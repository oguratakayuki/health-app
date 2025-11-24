// scripts/debug-prisma.js
const { PrismaClient } = require('../src/generated/client');

async function debug() {
  console.log('🐛 Debugging Prisma connection...');
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('1. Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connected successfully');
    console.log('2. Testing simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);
  } catch (error) {
    console.log('❌ Error details:');
    console.log('   Message:', error.message);
    console.log('   Code:', error.code);
    console.log('   Meta:', error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
