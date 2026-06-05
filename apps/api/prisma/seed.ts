import { PrismaClient } from 'generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from '../src/auth/util/auth.util'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
})

type SeedProduct = {
  name: string
  keyword: string
  basePrice: number
}

const productsByCategory: Record<string, SeedProduct[]> = {
  Електроніка: [
    {
      name: 'Смартфон Samsung Galaxy S24',
      keyword: 'smartphone',
      basePrice: 28999,
    },
    {
      name: 'Ноутбук Apple MacBook Air M3',
      keyword: 'macbook',
      basePrice: 54999,
    },
    {
      name: 'Навушники Sony WH-1000XM5',
      keyword: 'headphones',
      basePrice: 13499,
    },
    { name: 'Планшет Apple iPad Air', keyword: 'tablet', basePrice: 24999 },
    {
      name: 'Смарт-годинник Apple Watch Series 9',
      keyword: 'smartwatch',
      basePrice: 17999,
    },
    { name: 'Павербанк Xiaomi 20000mAh', keyword: 'powerbank', basePrice: 999 },
  ],
  'Побутова техніка': [
    { name: 'Холодильник LG GBB72', keyword: 'refrigerator', basePrice: 32999 },
    {
      name: 'Пральна машина Samsung WW80',
      keyword: 'washing-machine',
      basePrice: 18499,
    },
    {
      name: 'Мікрохвильова піч Panasonic',
      keyword: 'microwave',
      basePrice: 4299,
    },
    { name: 'Пилосос Philips PowerPro', keyword: 'vacuum', basePrice: 5999 },
    {
      name: 'Кавомашина DeLonghi Magnifica',
      keyword: 'coffee-machine',
      basePrice: 22499,
    },
    {
      name: 'Мультиварка Tefal Cook4me',
      keyword: 'pressure-cooker',
      basePrice: 6499,
    },
  ],
  Одяг: [
    { name: 'Футболка бавовняна біла', keyword: 'tshirt', basePrice: 399 },
    { name: 'Джинси класичні сині', keyword: 'jeans', basePrice: 1299 },
    { name: 'Светр вовняний', keyword: 'sweater', basePrice: 1799 },
    { name: 'Куртка зимова пухова', keyword: 'jacket', basePrice: 4999 },
    { name: 'Сукня вечірня', keyword: 'dress', basePrice: 2499 },
    { name: 'Штани спортивні', keyword: 'sweatpants', basePrice: 999 },
  ],
  Спорт: [
    { name: "Футбольний м'яч Nike", keyword: 'soccer-ball', basePrice: 899 },
    { name: 'Гантелі набірні 5кг', keyword: 'dumbbells', basePrice: 1299 },
    { name: 'Скакалка професійна', keyword: 'jump-rope', basePrice: 299 },
    { name: 'Килимок для йоги', keyword: 'yoga-mat', basePrice: 599 },
    {
      name: 'Велосипед гірський Trek',
      keyword: 'mountain-bike',
      basePrice: 18999,
    },
    {
      name: 'Бігова доріжка електрична',
      keyword: 'treadmill',
      basePrice: 24999,
    },
  ],
  'Дім та сад': [
    {
      name: "Садовий стіл дерев'яний",
      keyword: 'garden-table',
      basePrice: 3499,
    },
    { name: 'Шезлонг розкладний', keyword: 'sun-lounger', basePrice: 2199 },
    {
      name: 'Газонокосарка електрична',
      keyword: 'lawn-mower',
      basePrice: 5499,
    },
    { name: 'Мангал чавунний', keyword: 'bbq-grill', basePrice: 1899 },
    { name: 'Поливальний шланг 25м', keyword: 'garden-hose', basePrice: 599 },
    {
      name: 'Садові ножиці Fiskars',
      keyword: 'pruning-shears',
      basePrice: 449,
    },
  ],
  Краса: [
    {
      name: "Тональний крем L'Oreal",
      keyword: 'foundation-makeup',
      basePrice: 599,
    },
    { name: 'Туш для вій Maybelline', keyword: 'mascara', basePrice: 349 },
    { name: 'Помада червона MAC', keyword: 'lipstick', basePrice: 799 },
    {
      name: 'Парфуми Christian Dior Sauvage',
      keyword: 'perfume',
      basePrice: 4299,
    },
    {
      name: 'Маска для обличчя зволожуюча',
      keyword: 'face-mask',
      basePrice: 249,
    },
    {
      name: 'Шампунь проти лупи Head&Shoulders',
      keyword: 'shampoo',
      basePrice: 199,
    },
  ],
  Авто: [
    {
      name: 'Шини зимові Michelin 205/55 R16',
      keyword: 'car-tire',
      basePrice: 4299,
    },
    {
      name: 'Автомобільний пилосос Karcher',
      keyword: 'car-vacuum',
      basePrice: 1499,
    },
    {
      name: 'Тримач для телефону магнітний',
      keyword: 'phone-mount',
      basePrice: 299,
    },
    {
      name: 'Набір інструментів 108 предметів',
      keyword: 'toolbox',
      basePrice: 2499,
    },
    {
      name: 'Рідина омивача зимова 5л',
      keyword: 'windshield-washer',
      basePrice: 199,
    },
    {
      name: 'Чохли для сидінь універсальні',
      keyword: 'car-seat-cover',
      basePrice: 1199,
    },
  ],
  'Дитячі товари': [
    {
      name: 'Лялька Barbie Dreamhouse',
      keyword: 'barbie-doll',
      basePrice: 1499,
    },
    { name: 'Конструктор LEGO Star Wars', keyword: 'lego', basePrice: 2799 },
    { name: 'Машинка на пульті керування', keyword: 'rc-car', basePrice: 999 },
    { name: "М'яка іграшка ведмедик", keyword: 'teddy-bear', basePrice: 599 },
    { name: "Пазли 3D дерев'яні", keyword: 'puzzle', basePrice: 449 },
    {
      name: 'Розвиваюча книжка з наліпками',
      keyword: 'kids-book',
      basePrice: 199,
    },
  ],
}

const imageUrl = (keyword: string, seed: number) =>
  `https://loremflickr.com/600/600/${keyword}?lock=${seed}`

const round = (n: number) => Math.round(n * 100) / 100

const usersToSeed = [
  {
    email: 'admin@gmail.com',
    firstName: 'Admin',
    lastName: 'NestHub',
    password: 'PASSWORD1',
    role: 'admin' as const,
  },
  {
    email: 'user@gmail.com',
    firstName: 'Demo',
    lastName: 'User',
    password: 'PASSWORD1',
    role: 'user' as const,
  },
]

async function main() {
  console.log('🌱 Starting database seeding...')

  console.log('Seeding users...')
  for (const { email, firstName, lastName, password, role } of usersToSeed) {
    const hashedPassword = await hashPassword(password)
    await prisma.user.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        password: hashedPassword,
        role,
        Cart: { upsert: { create: {}, update: {} } },
      },
      create: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        Cart: { create: {} },
      },
    })
    console.log(`✅ Seeded ${role}: ${email}`)
  }

  let totalProducts = 0
  let imageSeed = 1

  for (const [categoryName, products] of Object.entries(productsByCategory)) {
    console.log(`Creating category: ${categoryName}`)

    // Idempotent: reuse the category if it already exists.
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    })

    // Skip product seeding for categories that already have products,
    // so the seed can be safely re-run on a populated database.
    const existingProducts = await prisma.product.count({
      where: { categoryId: category.id },
    })

    if (existingProducts > 0) {
      console.log(`↩︎ "${categoryName}" already has products, skipping`)
      continue
    }

    const data = products.map(({ name, keyword, basePrice }) => {
      const variance = (Math.random() - 0.5) * 0.2

      return {
        name,
        description: `${name} — гарантія якості, офіційний імпорт. Безкоштовна доставка по Україні.`,
        price: round(basePrice * (1 + variance)),
        imageUrl: imageUrl(keyword, imageSeed++),
        stock: Math.floor(Math.random() * 150) + 5,
        rating: Math.floor(Math.random() * 5) + 1,
        categoryId: category.id,
      }
    })

    await prisma.product.createMany({ data })
    totalProducts += data.length

    console.log(`✅ Added ${data.length} products to "${categoryName}"`)
  }

  console.log('Seeding promo codes...')
  const promoCodes = [
    { code: 'SAVE10', discountPercent: 10 },
    { code: 'SAVE20', discountPercent: 20 },
    { code: 'WELCOME100', discountAmount: 100 },
  ]
  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    })
  }
  console.log(`✅ Added ${promoCodes.length} promo codes`)

  console.log('🎉 Database seeding completed successfully!')
  console.log(
    `📊 Total: ${usersToSeed.length} users, ${Object.keys(productsByCategory).length} categories, ${totalProducts} products, ${promoCodes.length} promo codes`,
  )
}

main()
  .catch((error: unknown) => {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
