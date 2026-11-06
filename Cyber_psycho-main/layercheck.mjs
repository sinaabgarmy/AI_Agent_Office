const BASE = 'http://127.0.0.1:5213';
(async () => {
  const techs = await (await fetch(BASE + '/api/intel/techniques')).json();
  const byLayer = {};
  for (const t of techs) byLayer[t.layer] = (byLayer[t.layer] || 0) + 1;
  console.log('=== LAYER DISTRIBUTION ===');
  console.log(JSON.stringify(byLayer, null, 2));
  console.log('total:', techs.length);

  console.log('\n=== SCENARIO HYPOTHESES ===');
  const scen = await (await fetch(BASE + '/api/intel/scenarios?limit=6')).json();
  for (const s of scen) {
    console.log(`\n${s.title}`);
    console.log(`  [${s.category}] ${s.cwe}`);
    console.log(`  ${s.coreHypothesis}`);
  }
})();
