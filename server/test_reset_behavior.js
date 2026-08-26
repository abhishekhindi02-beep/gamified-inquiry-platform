import { aiEvaluationService } from './services/aiEvaluationService.js';
import { inquiryRepository } from './repository/inquiryRepository.js';
import { gamificationService } from './services/gamificationService.js';

async function testResetWorkspaceBehavior() {
  console.log('===========================================================');
  console.log(' TEST SUITE: WORKSPACE RESET VS SESSION ANALYTICS ');
  console.log('===========================================================');

  const sessionId = `reset_test_${Date.now()}`;
  await inquiryRepository.resetSession(sessionId);

  // 1. Submit 3 Inquiries
  console.log('\n▶ [Step 1] Submitting 3 initial questions...');
  
  const q1 = await aiEvaluationService.evaluateQuestion({
    contextSnippet: 'Photosynthesis light harvesting',
    contextType: 'text',
    question: 'What wavelength of light do chlorophyll pigments absorb?',
    discipline: 'Quantum Biology'
  });
  await inquiryRepository.saveInquiry(sessionId, { question: 'What wavelength of light do chlorophyll pigments absorb?', contextSnippet: 'Photosynthesis light harvesting', contextType: 'text', discipline: 'Quantum Biology', ...q1 });

  const q2 = await aiEvaluationService.evaluateQuestion({
    contextSnippet: 'RuBisCO fixation equation',
    contextType: 'formula',
    question: 'How does RuBisCO denaturation affect carbon fixation rates in C3 plants?',
    discipline: 'Biochemistry'
  });
  await inquiryRepository.saveInquiry(sessionId, { question: 'How does RuBisCO denaturation affect carbon fixation rates in C3 plants?', contextSnippet: 'RuBisCO fixation equation', contextType: 'formula', discipline: 'Biochemistry', ...q2 });

  const q3 = await aiEvaluationService.evaluateQuestion({
    contextSnippet: 'Active site tunneling diagram',
    contextType: 'diagram',
    question: 'If quantum coherence were completely lost during the intermediate quantum state, how would the energy-transfer pathway change and what mechanism could explain the difference?',
    discipline: 'Biochemistry'
  });
  await inquiryRepository.saveInquiry(sessionId, { question: 'If quantum coherence were completely lost during the intermediate quantum state, how would the energy-transfer pathway change and what mechanism could explain the difference?', contextSnippet: 'Active site tunneling diagram', contextType: 'diagram', discipline: 'Biochemistry', ...q3 });

  // 2. Check Dashboard Summary Before Workspace Reset
  const summaryBefore = await inquiryRepository.getDashboardSummary(sessionId);
  console.log(`Summary Before Reset: Total=${summaryBefore.totalInquiries}, HighestScore=${summaryBefore.highestScore}, AvgOriginality=${summaryBefore.avgOriginality}`);
  console.assert(summaryBefore.totalInquiries === 3, 'Total inquiries before reset must equal 3');
  console.assert(summaryBefore.highestScore === 9, 'Highest score before reset must equal 9');

  // 3. Simulate Workspace Reset
  console.log('\n▶ [Step 2] Performing Workspace Reset (clearing UI form state only)...');
  // Workspace UI resets local context & form state in React. Analytics repository is NOT wiped!
  const summaryAfterReset = await inquiryRepository.getDashboardSummary(sessionId);
  const inquiriesAfterReset = await inquiryRepository.getInquiriesBySession(sessionId);
  const progressionAfterReset = gamificationService.evaluateProgression(inquiriesAfterReset);

  console.log(`Summary After Workspace Reset: Total=${summaryAfterReset.totalInquiries}, HighestScore=${summaryAfterReset.highestScore}, AvgOriginality=${summaryAfterReset.avgOriginality}, Streak=${progressionAfterReset.currentStreak}`);
  console.assert(summaryAfterReset.totalInquiries === 3, 'Total inquiries MUST remain 3 after workspace reset');
  console.assert(summaryAfterReset.highestScore === 9, 'Highest score MUST remain 9 after workspace reset');
  console.assert(summaryAfterReset.recentInquiries.length === 3, 'Inquiry history MUST retain all 3 inquiries');
  console.assert(progressionAfterReset.currentStreak === 3, 'Active streak MUST remain 3 after workspace reset');

  // 4. Submit Question 4 After Workspace Reset
  console.log('\n▶ [Step 3] Submitting Question 4 after workspace reset...');
  const q4 = await aiEvaluationService.evaluateQuestion({
    contextSnippet: 'Prebiotic Homochirality diagram',
    contextType: 'diagram',
    question: 'Could a biological system maintain near-unity energy-transfer efficiency without quantum coherence, and what alternative mechanism would need to replace the pathway shown?',
    discipline: 'Quantum Biology'
  });
  await inquiryRepository.saveInquiry(sessionId, { question: 'Could a biological system maintain near-unity energy-transfer efficiency without quantum coherence, and what alternative mechanism would need to replace the pathway shown?', contextSnippet: 'Prebiotic Homochirality diagram', contextType: 'diagram', discipline: 'Quantum Biology', ...q4 });

  // 5. Verify Dashboard Updated from 3 → 4
  const summaryFinal = await inquiryRepository.getDashboardSummary(sessionId);
  const inquiriesFinal = await inquiryRepository.getInquiriesBySession(sessionId);
  const progressionFinal = gamificationService.evaluateProgression(inquiriesFinal);

  console.log(`Summary After Question 4: Total=${summaryFinal.totalInquiries}, HighestScore=${summaryFinal.highestScore}, AvgOriginality=${summaryFinal.avgOriginality}, Streak=${progressionFinal.currentStreak}`);
  console.assert(summaryFinal.totalInquiries === 4, 'Total inquiries MUST update from 3 to 4');
  console.assert(summaryFinal.highestScore === 10, 'Highest score MUST update to 10 (Einstein tier)');
  console.assert(summaryFinal.recentInquiries.length === 4, 'Inquiry history MUST contain all 4 inquiries');
  console.assert(progressionFinal.currentStreak === 4, 'Active streak MUST update to 4');

  console.log('\n===========================================================');
  console.log(' ALL WORKSPACE RESET & ANALYTICS TESTS PASSED PERFECTLY!');
  console.log('===========================================================');
}

testResetWorkspaceBehavior().catch(err => {
  console.error('Reset Test Failed:', err);
  process.exit(1);
});
