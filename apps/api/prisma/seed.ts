import { PrismaClient } from 'generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
})

const categories = [
  'Електроніка',
  'Побутова техніка',
  'Одяг',
  'Спорт',
  'Дім та сад',
  'Краса',
  'Авто',
  'Дитячі товари',
]

const productsByCategory: Record<string, string[]> = {
  Електроніка: [
    'Смартфон Samsung Galaxy',
    'Ноутбук Apple MacBook',
    'Навушники Sony',
    'Планшет iPad',
    'Смарт-годинник Apple Watch',
    'Павербанк Xiaomi',
  ],
  'Побутова техніка': [
    'Холодильник LG',
    'Пральна машина Samsung',
    'Мікрохвильовка Panasonic',
    'Пилосос Philips',
    'Кавомашина Delonghi',
    'Мультиварка Tefal',
  ],
  Одяг: [
    'Футболка бавовняна',
    'Джинси класичні',
    'Светр вовняний',
    'Куртка зимова',
    'Сукня вечірня',
    'Штани спортивні',
  ],
  Спорт: [
    "Футбольний м'яч",
    'Гантелі 5кг',
    'Скакалка професійна',
    'Килимок для йоги',
    'Велосипед гірський',
    'Бігова доріжка',
  ],
  'Дім та сад': [
    'Садовий стіл',
    'Шезлонг',
    'Газонокосарка',
    'Мангал',
    'Поливальний шланг',
    'Садові ножиці',
  ],
  Краса: [
    'Тональний крем',
    'Туш для вій',
    'Помада червона',
    'Парфуми Christian Dior',
    'Маска для обличчя',
    'Шампунь проти лупи',
  ],
  Авто: [
    'Шини зимові',
    'Автомобільний пилосос',
    'Тримач для телефону',
    'Набір інструментів',
    'Рідина омивача',
    'Чохли для сидінь',
  ],
  'Дитячі товари': [
    'Лялька Barbie',
    'Конструктор Lego',
    'Машинка на пульті',
    "М'яка іграшка ведмедик",
    'Пазли 3D',
    'Розвиваюча книжка',
  ],
}

async function main() {
  console.log('🌱 Starting database seeding...')

  for (const categoryName of categories) {
    console.log(`Creating category: ${categoryName}`)

    const category = await prisma.category.create({
      data: { name: categoryName },
    })

    const productNames = productsByCategory[categoryName]
    const products = productNames.map((productName, index) => ({
      name: productName,
      description: `Високоякісний ${productName.toLowerCase()} від відомого бренду. Гарантія якості та найкраща ціна на ринку!`,
      price: (index + 1) * 500 + Math.random() * 500,
      imageUrl: `https://picsum.photos/id/${(index + 1) * 27}/200/300`,
      stock: Math.floor(Math.random() * 150) + 10,
      categoryId: category.id,
    }))

    await prisma.product.createMany({
      data: products,
    })

    console.log(
      `✅ Added ${products.length} products to category "${categoryName}"`,
    )
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log(
    `📊 Total created: ${categories.length} categories and ${categories.length * 6} products`,
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
