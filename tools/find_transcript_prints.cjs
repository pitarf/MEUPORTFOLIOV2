const fs = require('fs');
const transcript = fs.readFileSync('C:\\Users\\rfpit\\.gemini\\antigravity\\brain\\8e81738c-7b95-48b9-a8f4-133ce4a170c4\\.system_generated\\logs\\transcript.jsonl', 'utf8');

const regex = /"(C:[^"]*media[^"]*\.(?:png|jpg))"/g;
const paths = new Set();
let match;
while ((match = regex.exec(transcript)) !== null) {
  paths.add(match[1].replace(/\\\\/g, '/'));
}

console.log('Total paths found in transcript:', paths.size);

const results = [];
for (const p of paths) {
  const norm = p.replace(/\//g, '\\');
  if (fs.existsSync(norm)) {
    const s = fs.statSync(norm);
    results.push({ path: norm, size: s.size, mtime: s.mtimeMs });
  }
}

results.sort((a,b) => b.mtime - a.mtime);
console.log('Existing files found:', results.length);
results.forEach(r => console.log(r.path, r.size, 'bytes'));
