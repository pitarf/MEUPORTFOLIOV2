const { SignJWT } = require('C:/Git/React/ConsultaALL-v2/node_modules/jose');
const fs = require('fs');

const envContent = fs.readFileSync('C:/Git/React/ConsultaALL-v2/.env', 'utf8');
const secretMatch = envContent.match(/SESSION_SECRET=["']?([^"'\r\n]+)/);
const secretKey = secretMatch ? secretMatch[1].trim() : 'chave-super-secreta-padrao-fallback';
const encodedKey = new TextEncoder().encode(secretKey);

async function makeToken(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return new SignJWT({ userId, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

makeToken('bf19e719-9f50-4bbe-8c15-e230d7d9a347').then(token => console.log('Admin Token:', token));
makeToken('94345c3d-0048-48b0-8f47-ad9f98a07327').then(token => console.log('User Token:', token));
