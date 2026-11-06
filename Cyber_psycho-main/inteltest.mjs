const BASE = 'http://127.0.0.1:5213';

(async () => {
  console.log('=== PRE-HARVEST STATUS ===');
  const st0 = await (await fetch(BASE + '/api/intel/status')).json();
  console.log(JSON.stringify(st0, null, 2).slice(0, 700));

  console.log('\n=== RUNNING HARVEST (this hits 8 public sources) ===');
  const t = Date.now();
  const h = await fetch(BASE + '/api/intel/harvest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maxItems: 120, teach: true }),
  });
  const res = await h.json();
  console.log(`status=${h.status}  took ${Date.now() - t}ms`);
  console.log(JSON.stringify(res, null, 2));

  console.log('\n=== POST-HARVEST STATUS ===');
  const st = await (await fetch(BASE + '/api/intel/status')).json();
  console.log('techniqueCount:', st.techniqueCount);
  console.log('taughtCount   :', st.taughtCount);
  console.log('lastHarvestAt :', st.lastHarvestAt);
  console.log('sources:');
  for (const s of st.sources) {
    console.log(`  ${s.ok ? 'OK  ' : 'FAIL'} ${s.id.padEnd(18)} items=${String(s.items).padStart(3)} ${s.lastError ?? ''}`);
  }

  console.log('\n=== SAMPLE TECHNIQUES ===');
  const techs = await (await fetch(BASE + '/api/intel/techniques')).json();
  console.log('total techniques:', techs.length);
  for (const t2 of techs.slice(0, 5)) {
    console.log(`\n[${t2.layer}] ${t2.title}`);
    console.log(`   CWE: ${t2.cwe}  conf: ${t2.confidence}  src: ${t2.sourceName} (${t2.sourceId})`);
    console.log(`   primitive: ${t2.primitive.slice(0, 150)}`);
    console.log(`   detection: ${t2.detection.slice(0, 130)}`);
    console.log(`   remediation: ${t2.remediation.slice(0, 130)}`);
  }

  console.log('\n=== AGENT-TEACHING MAP ===');
  for (const a of ['zerocipher', 'vesper', 'sentinel', 'consensusghost', 'darkpool', 'entropy', 'bytecode', 'stateroot']) {
    const list = await (await fetch(`${BASE}/api/intel/techniques/${a}`)).json();
    console.log(`  ${a.padEnd(16)} ${list.length} techniques`);
  }

  console.log('\n=== INTEL-DERIVED SCENARIOS ===');
  const scen = await (await fetch(BASE + '/api/intel/scenarios?limit=5')).json();
  console.log('generated:', scen.length);
  for (const s of scen) {
    console.log(`\n  ${s.title}`);
    console.log(`   cat: ${s.category} | bots: ${s.defaultInvolvedBots.join(', ')}`);
    console.log(`   hypothesis: ${s.coreHypothesis.slice(0, 170)}`);
  }
})();
