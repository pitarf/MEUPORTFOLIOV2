const fs = require('fs');
const transcript = fs.readFileSync('C:\\Users\\rfpit\\.gemini\\antigravity\\brain\\ea6c2044-763b-407b-ad2f-9753edd722e2\\.system_generated\\logs\\transcript.jsonl', 'utf8');

const regex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s"'<>)]*/g;
const urls = new Set();
let m;
while ((m = regex.exec(transcript)) !== null) {
  if (!m[0].includes('googleapis') && !m[0].includes('github') && !m[0].includes('w3.org') && !m[0].includes('schema.org') && !m[0].includes('localhost')) {
    urls.add(m[0]);
  }
}

console.log('URLs encontradas:');
urls.forEach(u => console.log(u));
