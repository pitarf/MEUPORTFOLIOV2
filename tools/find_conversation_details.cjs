const fs = require('fs');
const transcript = fs.readFileSync('C:\\Users\\rfpit\\.gemini\\antigravity\\brain\\88af8884-f912-484a-ab32-3f9e61b7dfaf\\.system_generated\\logs\\transcript.jsonl', 'utf8');
const lines = transcript.split('\n');

const domains = new Set();
lines.forEach(l => {
  const matches = l.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s"'<>)]*/g);
  if (matches) {
    matches.forEach(m => {
      if (!m.includes('googleapis') && !m.includes('github') && !m.includes('schema.org') && !m.includes('w3.org') && !m.includes('localhost') && !m.includes('127.0.0.1')) {
        domains.add(m);
      }
    });
  }
});

console.log('URLs encontradas no transcript:');
domains.forEach(d => console.log(d));

// Procurar onde fica o repositório local
lines.slice(0, 30).forEach(l => {
  if (l.includes('workspace') || l.includes('Git') || l.includes('C:\\\\') || l.includes('c:\\')) {
    console.log('Linha de workspace:', l.slice(0, 200));
  }
});
