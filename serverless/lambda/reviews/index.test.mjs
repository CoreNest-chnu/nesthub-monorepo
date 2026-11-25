// Unit tests of the handler with a stubbed DynamoDB client (no AWS needed):
//   cd serverless && bun install && npm test
import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { handler, setDbClient, validateReview } from './index.mjs'

// In-memory stand-in for DynamoDBDocumentClient.send().
function fakeDb() {
  const items = new Map()
  return {
    items,
    async send(command) {
      const input = command.input
      switch (command.constructor.name) {
        case 'PutCommand':
          items.set(input.Item.id, input.Item)
          return {}
        case 'GetCommand':
          return { Item: items.get(input.Key.id) }
        case 'DeleteCommand': {
          const old = items.get(input.Key.id)
          items.delete(input.Key.id)
          return { Attributes: old }
        }
        case 'QueryCommand': {
          const productId = input.ExpressionAttributeValues[':p']
          return {
            Items: [...items.values()].filter((i) => i.productId === productId),
          }
        }
        default:
          throw new Error(`unexpected ${command.constructor.name}`)
      }
    },
  }
}

const event = (httpMethod, resource, extra = {}) => ({
  httpMethod,
  resource,
  ...extra,
})
const body = (res) => (res.body ? JSON.parse(res.body) : undefined)

describe('reviews handler', () => {
  let db
  beforeEach(() => {
    db = fakeDb()
    setDbClient(db)
  })

  it('creates, reads, lists and deletes a review', async () => {
    const created = await handler(
      event('POST', '/reviews', {
        body: JSON.stringify({
          productId: 'p-1',
          author: 'Olena',
          rating: 5,
          text: 'Great',
        }),
      }),
    )
    assert.equal(created.statusCode, 201)
    const review = body(created)
    assert.match(review.id, /^[0-9a-f-]{36}$/)
    assert.equal(review.rating, 5)

    const got = await handler(
      event('GET', '/reviews/{id}', { pathParameters: { id: review.id } }),
    )
    assert.equal(got.statusCode, 200)
    assert.deepEqual(body(got), review)

    const list = await handler(
      event('GET', '/reviews', { queryStringParameters: { productId: 'p-1' } }),
    )
    assert.equal(body(list).count, 1)

    const deleted = await handler(
      event('DELETE', '/reviews/{id}', { pathParameters: { id: review.id } }),
    )
    assert.equal(deleted.statusCode, 204)
    assert.equal(db.items.size, 0)
  })

  it('returns 404 for a missing review', async () => {
    const res = await handler(
      event('GET', '/reviews/{id}', { pathParameters: { id: 'nope' } }),
    )
    assert.equal(res.statusCode, 404)
    const del = await handler(
      event('DELETE', '/reviews/{id}', { pathParameters: { id: 'nope' } }),
    )
    assert.equal(del.statusCode, 404)
  })

  it('rejects invalid input with 400', async () => {
    const bad = await handler(event('POST', '/reviews', { body: '{not json' }))
    assert.equal(bad.statusCode, 400)
    const noRating = await handler(
      event('POST', '/reviews', {
        body: JSON.stringify({ productId: 'p', author: 'a', rating: 9 }),
      }),
    )
    assert.equal(noRating.statusCode, 400)
    const noProduct = await handler(event('GET', '/reviews'))
    assert.equal(noProduct.statusCode, 400)
  })

  it('answers 405 for an unsupported method and 500 when DynamoDB fails', async () => {
    assert.equal((await handler(event('PUT', '/reviews/{id}'))).statusCode, 405)
    setDbClient({ send: async () => Promise.reject(new Error('boom')) })
    const res = await handler(
      event('GET', '/reviews/{id}', { pathParameters: { id: 'x' } }),
    )
    assert.equal(res.statusCode, 500)
  })
})

describe('validateReview', () => {
  it('accepts a review without text', () => {
    assert.equal(
      validateReview({ productId: 'p', author: 'a', rating: 1 }),
      null,
    )
  })
  it('requires rating from 1 to 5', () => {
    assert.match(
      validateReview({ productId: 'p', author: 'a', rating: 0 }),
      /rating/,
    )
    assert.match(
      validateReview({ productId: 'p', author: 'a', rating: 4.5 }),
      /rating/,
    )
  })
})
