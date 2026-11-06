/* Soak test for the Adversarial Cognitive Engine v2.
 * Simulates long debates and PROVES:
 *  - no duplicated bot content (the old "same story over and over" bug)
 *  - agents reference each other's arguments (real debate, not monologue)
 *  - debate moves + angles vary turn over turn
 *  - custom operator scenarios work end-to-end
 *  - user interjections get direct answers
 * Run: npx tsx soak-test.ts
 */
import { generateNextDebateTurn, previewNextSpeaker } from './src/services/debateEngine';
import { DEBATE_TOPICS } from './src/data/topics';
import { BOTS } from './src/data/bots';
import { DebateMessage, DebateTopic } from './src/types';

const ALL_IDS = BOTS.map(b => b.id);

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').toLowerCase().trim();
}

async function runDebate(name: string, topic: DebateTopic, turns: number, interjections: Record<number, string> = {}) {
  const messages: DebateMessage[] = [];
  console.log(`\n=== DEBATE: ${name} (${turns} turns) — ${topic.title} ===`);

  for (let i = 0; i < turns; i++) {
    const userPrompt = interjections[i];
    const turn = await generateNextDebateTurn({
      topic,
      messages: [...messages],
      activeBotIds: ALL_IDS,
      userPrompt,
      allBots: BOTS
    });
    if (userPrompt) {
      messages.push({
        id: `user-${i}`, botId: 'user', authorName: 'Security Operator', authorHandle: '@Operator',
        timestamp: '', content: userPrompt, isUserInterjection: true
      });
    }
    messages.push(turn);
    const label = turn.moveLabel && turn.angleLabel ? ` [${turn.moveLabel} | ${turn.angleLabel}]` : '';
    console.log(`  T${String(i + 1).padStart(2, '0')} ${turn.authorHandle.padEnd(16)}${label}`);
    console.log(`      ${turn.content.slice(0, 150)}...`);
  }
  return messages;
}

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`\n❌ FAIL: ${msg}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${msg}`);
  }
}

async function main() {
  // ---------- Test 1: long debate, repetition check ----------
  const msgs = await runDebate('Scenario 1 marathon', DEBATE_TOPICS[0], 30);

  const botMsgs = msgs.filter(m => m.botId !== 'user');
  const contents = botMsgs.map(m => normalize(m.content));
  const unique = new Set(contents);
  assert(unique.size === contents.length, `Scenario 1: ${contents.length} turns, ${unique.size} unique — ZERO repeated content`);

  // per-bot repetition: no bot says the same thing twice
  const byBot = new Map<string, Set<string>>();
  for (const m of botMsgs) {
    if (!byBot.has(m.botId)) byBot.set(m.botId, new Set());
    byBot.get(m.botId)!.add(normalize(m.content));
  }
  const allUniquePerBot = [...byBot.entries()].every(([id, set]) => {
    const count = botMsgs.filter(m => m.botId === id).length;
    return set.size === count;
  });
  assert(allUniquePerBot, 'No single bot ever repeats its own content');

  // move diversity
  const moves = new Set(botMsgs.map(m => m.moveLabel).filter(Boolean));
  assert(moves.size >= 5, `Debate move variety: ${moves.size} distinct moves (${[...moves].slice(0, 8).join(', ')}...)`);

  const angles = new Set(botMsgs.map(m => m.angleLabel).filter(Boolean));
  assert(angles.size >= 10, `Angle variety: ${angles.size} distinct argument angles used`);

  // cross-reference: how many turns mention another agent's handle?
  const handles = BOTS.map(b => b.handle);
  const crossRef = botMsgs.filter(m => handles.some(h => h !== m.authorHandle && m.content.includes(h))).length;
  assert(crossRef / botMsgs.length >= 0.5, `Cross-referencing: ${crossRef}/${botMsgs.length} turns name another agent (${Math.round(crossRef / botMsgs.length * 100)}%)`);

  // rebuttal linkage
  const rebuttals = botMsgs.filter(m => m.rebuttalToMessageId).length;
  assert(rebuttals / botMsgs.length >= 0.7, `Rebuttal linkage: ${rebuttals}/${botMsgs.length} turns are direct rebuttals`);

  // ---------- Test 2: user interjections answered ----------
  const msgs2 = await runDebate('Interjection test', DEBATE_TOPICS[2], 8, {
    3: 'What if the attacker bribes the block builder to censor the pause transaction?',
    6: 'Could the team simply rotate all validator keys tonight and avoid the debate?'
  });
  const answers = msgs2.filter(m => m.moveLabel === 'Operator Response');
  assert(answers.length === 2, `User interjections: both got a dedicated "Operator Response" turn (${answers.length}/2)`);
  assert(normalize(answers[0].content).includes('bribe') || normalize(answers[0].content).includes('builder'), 'First interjection answer engages the actual scenario content');

  // ---------- Test 3: custom operator scenario ----------
  const customTopic: DebateTopic = {
    id: 'scenario-custom-test',
    title: 'Governance Flash-Loan Hijack of Treasury Multisig',
    category: 'Custom',
    targetArchitecture: 'DAO GovernorBravo + 4-of-9 Gnosis Safe Treasury',
    coreHypothesis: 'An attacker flash-borrows governance tokens in the same block a proposal is submitted, passing quorum before the timelock delay elapses.',
    briefing: 'OPERATOR SCENARIO BRIEFING: treasury drain attempted via governance capture.',
    defaultInvolvedBots: ['vesper', 'sentinel', 'darkpool', 'zerocipher', 'consensusghost'],
    isCustom: true
  };
  const msgs3 = await runDebate('Custom scenario', customTopic, 12);
  const contents3 = msgs3.map(m => normalize(m.content));
  assert(new Set(contents3).size === contents3.length, 'Custom scenario: zero repeated content across 12 turns');
  const archMentions = msgs3.filter(m => m.content.includes('GovernorBravo') || m.content.includes('governance') || m.content.includes('flash')).length;
  assert(archMentions >= 8, `Custom scenario engagement: ${archMentions}/12 turns reference the scenario specifics`);

  // ---------- Test 4: previewNextSpeaker (typing indicator) ----------
  const next = previewNextSpeaker({ topic: DEBATE_TOPICS[0], messages: msgs, activeBotIds: ALL_IDS, allBots: BOTS });
  assert(next !== null && typeof next.name === 'string', `previewNextSpeaker works (next up: ${next?.name})`);

  console.log('\n========================================');
  if (process.exitCode === 1) {
    console.log('SOAK TEST FAILED — see ❌ items above');
  } else {
    console.log('ALL SOAK TESTS PASSED ✅ — bots argue, vary angles, never repeat.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
