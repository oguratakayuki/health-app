// scripts/test-db-connection.js
const { PrismaClient } = require('../src/generated/client')

async function testConnection() {
  const prisma = new PrismaClient()
  try {
    console.log('🔌 Testing database connection...')
    // 接続テスト
    await prisma.$connect()
    console.log('✅ Database connected')
    // テーブル存在確認
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'health_development'
    `
    console.log('📊 Tables in database:', tables.map(t => t.TABLE_NAME))
    // 料理数確認
    const dishCount = await prisma.dish.count()
    console.log(`🍽️  Dish count: ${dishCount}`)
    // 食材数確認
    const ingredientCount = await prisma.ingredient.count()
    console.log(`🥕 Ingredient count: ${ingredientCount}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
