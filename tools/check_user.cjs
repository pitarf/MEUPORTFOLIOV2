const fs = require('fs');
const content = fs.readFileSync('C:/Git/React/ConsultaALL-v2/.env', 'utf8');
const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)/);
const dbUrl = match[1].trim();
const { PrismaClient } = require('C:/Git/React/ConsultaALL-v2/node_modules/@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'rfpita.ti@gmail.com' },
    select: { id: true, name: true, email: true, role: true, balance: true, passwordHash: true }
  });
  console.log('User rfpita.ti@gmail.com has passwordHash:', !!user.passwordHash);
  const totalQueries = await prisma.consultaLog.count();
  console.log('Total consulta logs:', totalQueries);
}
check().catch(console.error).finally(() => prisma.$disconnect());
