/**
 * Centralized API Client with Server & Hybrid Static Deployment Fallback (GitHub Pages)
 */

const SESSION_KEY = 'inquiry_platform_session_id';

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Fallback seed articles for static deployments (e.g. GitHub Pages)
const SEED_ARTICLES = [
  {
    id: 'quantum-biology-photosynthesis',
    title: 'Quantum Coherence in Photosynthetic Light Harvesting',
    discipline: 'Quantum Biology',
    summary: 'Investigating how marine algae and plant chlorophyll complexes achieve near-unity quantum efficiency during solar energy conversion.',
    content: `Photosynthesis relies on pigment-protein complexes to absorb light and transfer excitation energy to reaction centers with near 100% quantum efficiency. Classical hopping models of energy transfer fail to explain why energy isn't dissipated as heat during random walks through complex protein structures.

Spectroscopic observations suggest quantum coherence allows excitons to sample multiple pathways simultaneously—a phenomenon known as quantum superposition in biological environments.

However, biological systems operate at warm, noisy, non-equilibrium conditions. The exact role of chromophore-protein vibrations (vibronic coupling) in sustaining coherence against thermal decoherence remains a central debate in quantum biophysics.`,
    formulas: [
      {
        id: 'f_exciton_hamiltonian',
        label: 'System-Bath Vibronic Hamiltonian',
        latex: 'H = \\sum_{i} \\epsilon_i |i\\rangle\\langle i| + \\sum_{i\\neq j} J_{ij} |i\\rangle\\langle j| + H_{bath} + H_{sys-bath}',
        explanation: 'Describes chromophore site energies, inter-site coupling J_ij, and coupling to noisy thermal protein bath modes.'
      },
      {
        id: 'f_coherence_rate',
        label: 'FRET Energy Transfer Rate',
        latex: 'k_{ET} = \\frac{2\\pi}{\\hbar} |V_{DA}|^2 \\int f_D(\\nu) a_A(\\nu) d\\nu',
        explanation: 'Förster Resonance Energy Transfer rate linking donor emission and acceptor absorption spectral overlap.'
      }
    ],
    diagrams: [
      {
        id: 'd_chlorophyll_spectrum',
        title: 'Chlorophyll Absorption & Coherence Pathways',
        type: 'spectrum_diagram',
        caption: 'Absorption peaks at 430nm (Soret band) & 660nm (Qy band) with quantum coherence pathways.',
        svgData: 'chlorophyll_coherence_map'
      },
      {
        id: 'd_energy_funnel',
        title: 'Exciton Energy Transfer Funnel',
        type: 'energy_map',
        caption: 'Delocalized exciton state funneling into P680 reaction center.',
        svgData: 'energy_funnel_map'
      }
    ]
  },
  {
    id: 'enzyme-quantum-tunneling',
    title: 'Enzymatic Catalysis & Hydrogen Quantum Tunneling',
    discipline: 'Biochemistry',
    summary: 'Exploring how enzymes utilize quantum mechanical barrier tunneling of protons and hydride ions to accelerate biochemical reaction rates.',
    content: `Enzymatic reaction rates can exceed uncatalyzed rates by factors of up to 10^17. While classical Transition State Theory attributes rate acceleration to activation energy reduction via active site complementary binding, heavy-atom kinetic isotope effects (KIE) reveal quantum tunneling of light particles.

In enzymes like soybean lipoxygenase and alcohol dehydrogenase, primary deuterium and tritium isotope effects deviate dramatically from classical Arrhenius temperature dependence.

Vibrational motions of the enzyme scaffold ("promoting vibrations") compress donor-acceptor distances (DAD) to transiently shorten tunneling barriers. Whether enzymes evolved specifically to optimize tunneling or if tunneling is an inherent consequence of packed active site geometries is actively investigated.`,
    formulas: [
      {
        id: 'f_tunneling_prob',
        label: 'WKB Barrier Tunneling Probability',
        latex: 'P_{tunnel} \\approx \\exp\\left( -\\frac{2}{\\hbar} \\int_{x_1}^{x_2} \\sqrt{2m(V(x) - E)} \\, dx \\right)',
        explanation: 'WKB approximation for tunneling probability, showing mass dependence m and barrier width x2 - x1.'
      },
      {
        id: 'f_kie_ratio',
        label: 'Kinetic Isotope Effect (KIE)',
        latex: 'KIE = \\frac{k_H}{k_D} = \\frac{A_H}{A_D} \\exp\\left( \\frac{\\Delta E_{ZPE}}{k_B T} \\right)',
        explanation: 'Ratio of reaction rates for hydrogen vs deuterium, highlighting Zero Point Energy difference Delta E_ZPE.'
      }
    ],
    diagrams: [
      {
        id: 'd_tunneling_barrier',
        title: 'Active Site Distance Compression & Tunneling Barrier',
        type: 'tunneling_diagram',
        caption: 'Transient Donor-Acceptor Distance (DAD) reduction during enzyme active site vibration.',
        svgData: 'tunneling_barrier_map'
      }
    ]
  },
  {
    id: 'prebiotic-parity-violation',
    title: 'Cosmic Electroweak Parity Violation & Homochirality',
    discipline: 'Astrophysics & Prebiotic Chemistry',
    summary: 'Investigating whether cosmic electroweak parity violation broke chiral symmetry in primordial biological molecules.',
    content: `Terrestrial biology exhibits strict homochirality: all natural proteins consist exclusively of L-amino acids, while RNA and DNA backbones utilize D-sugars. Physical law under electromagnetic and gravitational interactions is mirror-symmetric, suggesting racemic mixtures (50:50 L/D) should form naturally.

However, the weak nuclear force violates parity symmetry (P-violation), imparting a tiny Energy Parity Violating Difference (EPVD) between enantiomers on the order of 10^-17 to 10^-14 eV.

Whether this infinitesimal energy difference was amplified by autocatalytic non-equilibrium chemical reactions (e.g., Soai reaction kinetics) or if homochirality arose from circularly polarized interstellar radiation in protostellar nebulae remains a fundamental open question in astrobiology.`,
    formulas: [
      {
        id: 'f_epvd_weak',
        label: 'Electroweak Parity Violating Potential',
        latex: 'V_{EPVD} = \\frac{G_F}{2\\sqrt{2} m_e c} \\sum_i Q_W \\left\\{ \\vec{\\sigma}_i \\cdot \\vec{p}_i , \\delta^3(\\vec{r}_i) \\right\\}',
        explanation: 'Electroweak weak neutral current potential coupling electron spin and momentum near atomic nuclei.'
      }
    ],
    diagrams: [
      {
        id: 'd_homochirality_amplification',
        title: 'Symmetry Breaking & Autocatalytic Amplification',
        type: 'chiral_diagram',
        caption: 'Bifurcation diagram showing tiny initial EPVD bias amplified into single-enantiomer dominance.',
        svgData: 'chiral_amplification_map'
      }
    ]
  }
];

// In-Memory Local Storage Repository for static deployment fallback
function getLocalInquiries() {
  try {
    const raw = localStorage.getItem('local_inquiries_store');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalInquiry(inq) {
  try {
    const list = getLocalInquiries();
    list.push(inq);
    localStorage.setItem('local_inquiries_store', JSON.stringify(list));
  } catch (e) {}
}

function evaluateClientSide(question, contextSnippet, contextType, discipline) {
  const qLower = (question || '').toLowerCase();
  
  let originality = 3;
  if (qLower.includes('could biological') || qLower.includes('homochirality') || qLower.includes('cosmic') || qLower.includes('without quantum')) {
    originality = 10;
  } else if (qLower.includes('completely lost') || qLower.includes('quantum tunneling') || qLower.includes('isotope effect')) {
    originality = 9;
  } else if (qLower.includes('how does') || qLower.includes('affect') || qLower.includes('denaturation')) {
    originality = 6;
  } else if (qLower.startsWith('what is') || qLower.startsWith('define')) {
    originality = 2;
  } else {
    originality = 4;
  }

  let mechanisticDepth = 4;
  if (qLower.includes('coherence pathway') || qLower.includes('intermediate quantum state') || qLower.includes('kinetic isotope')) {
    mechanisticDepth = 10;
  } else if (qLower.includes('quantum coherence') || qLower.includes('rubisco') || qLower.includes('energy transfer')) {
    mechanisticDepth = 7;
  }

  let reasoningRigor = 4;
  if (qLower.includes('without quantum') || qLower.includes('completely lost')) {
    reasoningRigor = 10;
  } else if (qLower.includes('if ') && qLower.includes('how would')) {
    reasoningRigor = 9;
  } else if (qLower.includes('how does') || qLower.includes('affect')) {
    reasoningRigor = 6;
  }

  const score = Math.max(1, Math.min(10, Math.round((originality + mechanisticDepth + reasoningRigor) / 3)));
  
  let tier = 'Good';
  if (score >= 10) tier = 'Einstein';
  else if (score >= 8) tier = 'Genius';
  else if (score >= 5) tier = 'Excellent';

  let explanation = `Score ${score}/10 — Quality evaluation for scientific inquiry.`;
  if (tier === 'Einstein') explanation = `Score ${score}/10 — Exceptional first-principles synthesis! Probes foundational biological and physical assumptions.`;
  if (tier === 'Genius') explanation = `Score ${score}/10 — High-order inquiry examining extreme boundary conditions and mechanistic anomalies.`;
  if (tier === 'Excellent') explanation = `Score ${score}/10 — Strong system dynamics question investigating causal relationships across physical states.`;
  if (tier === 'Good') explanation = `Score ${score}/10 — Baseline recall inquiry clarifying foundational terms or direct mechanism facts.`;

  return {
    score,
    tier,
    explanation,
    metrics: { originality, mechanisticDepth, reasoningRigor }
  };
}

export const apiClient = {
  async getArticles() {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.articles) return data;
      }
    } catch (e) {}

    // Fallback for static deployments
    return {
      success: true,
      articles: SEED_ARTICLES.map(a => ({
        id: a.id,
        title: a.title,
        discipline: a.discipline,
        summary: a.summary,
        formulaCount: a.formulas.length,
        diagramCount: a.diagrams.length
      }))
    };
  },

  async getArticleById(id) {
    try {
      const res = await fetch(`/api/content/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.article) return data;
      }
    } catch (e) {}

    // Fallback for static deployments
    const article = SEED_ARTICLES.find(a => a.id === id) || SEED_ARTICLES[0];
    return { success: true, article };
  },

  async evaluateQuestion({ contextSnippet, contextType, contextLabel, question, discipline, articleId }) {
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-ID': getSessionId() },
        body: JSON.stringify({ contextSnippet, contextType, contextLabel, question, discipline, articleId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {}

    // Fallback for static deployments
    const evaluation = evaluateClientSide(question, contextSnippet, contextType, discipline);
    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      question,
      contextSnippet,
      contextType,
      contextLabel: contextLabel || '',
      discipline: discipline || 'General Science',
      articleId: articleId || '',
      score: evaluation.score,
      tier: evaluation.tier,
      explanation: evaluation.explanation,
      metrics: evaluation.metrics
    };

    saveLocalInquiry(newInquiry);
    const inquiries = getLocalInquiries();

    const currentStreak = inquiries.length;
    let highOrderStreak = 0;
    let maxHighOrder = 0;
    inquiries.slice().reverse().forEach(i => {
      if (i.score >= 8) {
        highOrderStreak++;
        if (highOrderStreak > maxHighOrder) maxHighOrder = highOrderStreak;
      } else {
        highOrderStreak = 0;
      }
    });

    const tierCounts = { Good: 0, Excellent: 0, Genius: 0, Einstein: 0 };
    inquiries.forEach(i => { if (tierCounts[i.tier] !== undefined) tierCounts[i.tier]++; });

    const milestones = [
      { id: 'inquiry_initiated', title: 'Inquiry Initiated', description: 'Submit your first scientific question attached to content context', achieved: inquiries.length >= 1, progress: inquiries.length >= 1 ? 1 : 0 },
      { id: 'excellent_tier_achieved', title: 'Excellent Tier Inquiry', description: 'Reach Excellent tier by investigating system dynamics', achieved: (tierCounts.Excellent + tierCounts.Genius + tierCounts.Einstein) >= 1, progress: (tierCounts.Excellent + tierCounts.Genius + tierCounts.Einstein) >= 1 ? 1 : 0 },
      { id: 'genius_tier_achieved', title: 'Genius Tier Inquiry', description: 'Reach Genius tier by testing boundary conditions', achieved: (tierCounts.Genius + tierCounts.Einstein) >= 1, progress: (tierCounts.Genius + tierCounts.Einstein) >= 1 ? 1 : 0 },
      { id: 'einstein_tier_achieved', title: 'Einstein Tier Inquiry', description: 'Achieve 10/10 Einstein score demonstrating first-principles synthesis', achieved: tierCounts.Einstein >= 1, progress: tierCounts.Einstein >= 1 ? 1 : 0 },
      { id: 'einstein_streak_badge', title: 'Einstein Streak', description: 'Achieve consistent high-order inquiries', achieved: maxHighOrder >= 3, progress: Math.min(highOrderStreak / 3, 1), isSpecialBadge: true }
    ];

    return {
      success: true,
      evaluation,
      inquiryId: newInquiry.id,
      timestamp: newInquiry.timestamp,
      progression: {
        currentStreak,
        highOrderStreak,
        maxHighOrderStreak: maxHighOrder,
        einsteinStreakThreshold: 3,
        einsteinStreakBadgeUnlocked: maxHighOrder >= 3,
        milestones,
        totalMilestonesAchieved: milestones.filter(m => m.achieved).length
      }
    };
  },

  async getDashboard() {
    try {
      const res = await fetch('/api/dashboard', { headers: { 'X-Session-ID': getSessionId() } });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.dashboard) return data.dashboard;
      }
    } catch (e) {}

    // Fallback for static deployments
    const inquiries = getLocalInquiries();
    const tierDistribution = { Good: 0, Excellent: 0, Genius: 0, Einstein: 0 };
    const disciplineTrends = {};
    let totalOrig = 0;
    let highestScore = 0;

    inquiries.forEach(inq => {
      if (tierDistribution[inq.tier] !== undefined) tierDistribution[inq.tier]++;
      if (inq.score > highestScore) highestScore = inq.score;
      totalOrig += (inq.metrics?.originality || inq.score);

      const disc = inq.discipline || 'General Science';
      if (!disciplineTrends[disc]) disciplineTrends[disc] = { discipline: disc, count: 0, totalScore: 0, avgScore: 0 };
      disciplineTrends[disc].count++;
      disciplineTrends[disc].totalScore += inq.score;
      disciplineTrends[disc].avgScore = Number((disciplineTrends[disc].totalScore / disciplineTrends[disc].count).toFixed(1));
    });

    const totalInquiries = inquiries.length;
    const avgOriginality = totalInquiries > 0 ? Number((totalOrig / totalInquiries).toFixed(1)) : 0;
    const avgScore = totalInquiries > 0 ? Number((inquiries.reduce((acc, c) => acc + c.score, 0) / totalInquiries).toFixed(1)) : 0;

    let highOrderStreak = 0;
    let maxHighOrder = 0;
    inquiries.slice().reverse().forEach(i => {
      if (i.score >= 8) {
        highOrderStreak++;
        if (highOrderStreak > maxHighOrder) maxHighOrder = highOrderStreak;
      } else {
        highOrderStreak = 0;
      }
    });

    const milestones = [
      { id: 'inquiry_initiated', title: 'Inquiry Initiated', description: 'Submit your first scientific question attached to content context', achieved: totalInquiries >= 1, progress: totalInquiries >= 1 ? 1 : 0 },
      { id: 'excellent_tier_achieved', title: 'Excellent Tier Inquiry', description: 'Reach Excellent tier by investigating system dynamics', achieved: (tierDistribution.Excellent + tierDistribution.Genius + tierDistribution.Einstein) >= 1, progress: (tierDistribution.Excellent + tierDistribution.Genius + tierDistribution.Einstein) >= 1 ? 1 : 0 },
      { id: 'genius_tier_achieved', title: 'Genius Tier Inquiry', description: 'Reach Genius tier by testing boundary conditions', achieved: (tierDistribution.Genius + tierDistribution.Einstein) >= 1, progress: (tierDistribution.Genius + tierDistribution.Einstein) >= 1 ? 1 : 0 },
      { id: 'einstein_tier_achieved', title: 'Einstein Tier Inquiry', description: 'Achieve 10/10 Einstein score demonstrating first-principles synthesis', achieved: tierDistribution.Einstein >= 1, progress: tierDistribution.Einstein >= 1 ? 1 : 0 },
      { id: 'einstein_streak_badge', title: 'Einstein Streak', description: 'Achieve consistent high-order inquiries', achieved: maxHighOrder >= 3, progress: Math.min(highOrderStreak / 3, 1), isSpecialBadge: true }
    ];

    return {
      summary: {
        totalInquiries,
        avgOriginality,
        avgScore,
        highestScore,
        tierDistribution,
        disciplineTrends: Object.values(disciplineTrends),
        recentInquiries: inquiries.slice().reverse().slice(0, 10)
      },
      progression: {
        currentStreak: totalInquiries,
        highOrderStreak,
        maxHighOrderStreak: maxHighOrder,
        einsteinStreakThreshold: 3,
        einsteinStreakBadgeUnlocked: maxHighOrder >= 3,
        milestones,
        totalMilestonesAchieved: milestones.filter(m => m.achieved).length
      }
    };
  },

  async resetSession() {
    try {
      await fetch('/api/reset', { method: 'POST', headers: { 'X-Session-ID': getSessionId() } });
    } catch (e) {}
    localStorage.removeItem('local_inquiries_store');
    return { success: true };
  }
};
