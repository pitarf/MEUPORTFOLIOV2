const fs = require('fs');
const content = fs.readFileSync('C:/Git/React/ConsultaALL-v2/.env', 'utf8');
const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)/);
const dbUrl = match[1].trim();

const { PrismaClient } = require('C:/Git/React/ConsultaALL-v2/node_modules/@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, name: true, email: true, role: true }
  });
  console.log('Users found:', users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
