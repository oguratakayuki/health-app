// lib/test-connection.ts
import { prisma } from './prisma'

export async function testPrismaConnection() {
  try {
    // シンプルなクエリで接続をテスト
    const dishCount = await prisma.dish.count()
    console.log('✅ Prisma connection successful')
    console.log(`📊 Total dishes in database: ${dishCount}`)
    // サンプルデータの取得テスト
    const sampleDish = await prisma.dish.findFirst({
      include: {
        dishIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    })
    if (sampleDish) {
      console.log('✅ Sample data retrieval successful')
      console.log(`🍽️ Sample dish: ${sampleDish.name}`)
      console.log(`📝 Ingredients count: ${sampleDish.dishIngredients.length}`)
    }
    return true
  } catch (error) {
    console.error('❌ Prisma connection failed:', error)
    return false
  }
}
