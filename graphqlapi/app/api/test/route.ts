// app/api/test/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// BigIntを文字列に変換する関数
function serializeBigInt(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString()
  } else if (Array.isArray(obj)) {
    return obj.map(serializeBigInt)
  } else if (obj !== null && typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value)
    }
    return result
  }
  return obj
}

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        dishIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    })

    // BigIntを変換
    const serializedDishes = serializeBigInt(dishes)

    return NextResponse.json({
      success: true,
      dishes: serializedDishes,
      count: serializedDishes.length,
      generatedFrom: 'src/generated/'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

