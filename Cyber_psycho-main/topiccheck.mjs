import fs from 'fs';
const src = fs.readFileSync('src/data/topics.ts', 'utf8');
const blocks = src.split(/\n  \{\n/).slice(1);
const valid = ['zerocipher', 'vesper', 'sentinel', 'consensusghost', 'darkpool', 'entropy', 'bytecode', 'stateroot'];
const issues = [];
const cats = {};
const ids = new Set();
blocks.forEach((b, i) => {
  const id = (b.match(/id: '([^']+)'/) || [])[1];
  const title = (b.match(/title: '([^']+)'/) || [])[1];
  const cat = (b.match(/category: '([^']+)'/) || [])[1];
  const bots = (b.match(/defaultInvolvedBots: \[([^\]]*)\]/) || [])[1] || '';
  const botIds = [...bots.matchAll(/'([^']+)'/g)].map(m => m[1]);
  cats[cat] = (cats[cat] || 0) + 1;
  if (!id || !title) issues.push('block ' + i + ' missing id/title');
  if (ids.has(id)) issues.push('duplicate id: ' + id);
  ids.add(id);
  if (botIds.length < 3 || botIds.length > 4) issues.push(title + ': ' + botIds.length + ' bots');
  for (const b2 of botIds) if (!valid.includes(b2)) issues.push(title + ': invalid bot ' + b2);
  for (const field of ['briefing', 'targetArchitecture', 'coreHypothesis']) {
    if (!new RegExp(field + ':').test(b)) issues.push(title + ': missing ' + field);
  }
});
console.log('total topics:', blocks.length);
console.log('categories:', JSON.stringify(cats, null, 2));
console.log('issues:', issues.length ? issues : 'NONE');
