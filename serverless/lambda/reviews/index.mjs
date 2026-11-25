// Product reviews API for NestHub, run as one AWS Lambda function behind
// API Gateway (proxy integration) and stored in DynamoDB.
//
//   POST   /reviews                  create a review
//   GET    /reviews?productId=<id>   list the reviews of a product
//   GET    /reviews/{id}             get one review
//   DELETE /reviews/{id}             delete a review
//
// The AWS SDK v3 is part of the nodejs22.x runtime, so the function has no
// dependencies and is deployed as a single file. In LocalStack the SDK reaches
// DynamoDB through AWS_ENDPOINT_URL, which LocalStack sets for every function.
import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'

const TABLE = process.env.TABLE_NAME ?? 'nesthub-reviews'
const PRODUCT_INDEX = 'productId-index'

let db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Tests replace the DynamoDB client with a stub.
export const setDbClient = (client) => {
  db = client
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? '' : JSON.stringify(body),
})

const error = (statusCode, message) => json(statusCode, { error: message })

// Validates the body of POST /reviews; returns an error message or null.
export const validateReview = (input) => {
  if (!input || typeof input !== 'object') return 'Body must be a JSON object'
  const { productId, author, rating, text } = input
  if (typeof productId !== 'string' || productId.trim() === '')
    return 'productId is required'
  if (typeof author !== 'string' || author.trim() === '')
    return 'author is required'
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return 'rating must be an integer from 1 to 5'
  if (text !== undefined && (typeof text !== 'string' || text.length > 2000)) {
    return 'text must be a string of at most 2000 characters'
  }
  return null
}

async function createReview(event) {
  let input
  try {
    input = JSON.parse(event.body ?? '')
  } catch {
    return error(400, 'Body must be valid JSON')
  }
  const problem = validateReview(input)
  if (problem) return error(400, problem)

  const review = {
    id: randomUUID(),
    productId: input.productId.trim(),
    author: input.author.trim(),
    rating: input.rating,
    text: input.text ?? '',
    createdAt: new Date().toISOString(),
  }
  await db.send(new PutCommand({ TableName: TABLE, Item: review }))
  return json(201, review)
}

async function getReview(id) {
  const { Item } = await db.send(
    new GetCommand({ TableName: TABLE, Key: { id } }),
  )
  return Item ? json(200, Item) : error(404, `Review ${id} not found`)
}

async function listReviews(productId) {
  if (!productId) return error(400, 'Query parameter productId is required')
  const { Items = [] } = await db.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: PRODUCT_INDEX,
      KeyConditionExpression: 'productId = :p',
      ExpressionAttributeValues: { ':p': productId },
    }),
  )
  return json(200, { productId, count: Items.length, items: Items })
}

async function deleteReview(id) {
  const { Attributes } = await db.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { id },
      ReturnValues: 'ALL_OLD',
    }),
  )
  return Attributes ? json(204) : error(404, `Review ${id} not found`)
}

export async function handler(event) {
  const method = event.httpMethod
  const id = event.pathParameters?.id
  const started = Date.now()

  let response
  try {
    if (event.resource === '/reviews' && method === 'POST')
      response = await createReview(event)
    else if (event.resource === '/reviews' && method === 'GET')
      response = await listReviews(event.queryStringParameters?.productId)
    else if (event.resource === '/reviews/{id}' && method === 'GET')
      response = await getReview(id)
    else if (event.resource === '/reviews/{id}' && method === 'DELETE')
      response = await deleteReview(id)
    else response = error(405, `${method} ${event.resource} is not supported`)
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'unhandled', error: String(err) }),
    )
    response = error(500, 'Internal server error')
  }

  // One JSON line per request in CloudWatch Logs.
  console.log(
    JSON.stringify({
      level: response.statusCode >= 500 ? 'error' : 'info',
      msg: 'request',
      method,
      route: event.resource,
      status: response.statusCode,
      duration_ms: Date.now() - started,
    }),
  )
  return response
}
