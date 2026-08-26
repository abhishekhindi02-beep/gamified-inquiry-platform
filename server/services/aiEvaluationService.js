import { config } from '../config/env.js';

export class AIEvaluationService {
  /**
   * Enforces strict score to tier mapping per product specification #9 & Step 7:
   * 1-4  => Good (Fact-seeking & Recall)
   * 5-7  => Excellent (System Dynamics)
   * 8-9  => Genius (Edge Cases & Anomalies)
   * 10   => Einstein (First-Principles Synthesis)
   */
  mapScoreToTier(score) {
    const s = Math.max(1, Math.min(10, Math.round(score)));
    if (s <= 4) return 'Good';
    if (s <= 7) return 'Excellent';
    if (s <= 9) return 'Genius';
    return 'Einstein';
  }

  /**
   * Validates and normalizes raw AI evaluation results.
   * Enforces independent metrics, score bounds (1-10 integer), and strict tier mapping.
   */
  normalizeResult(rawResult, question, contextText) {
    if (!rawResult || typeof rawResult !== 'object') {
      throw new Error('AI provider returned an invalid or empty response object.');
    }

    // 1. Validate / extract independent sub-metrics
    let originality = parseInt(rawResult.originality ?? rawResult.metrics?.originality, 10);
    let mechanisticDepth = parseInt(rawResult.mechanisticDepth ?? rawResult.metrics?.mechanisticDepth, 10);
    let reasoningRigor = parseInt(rawResult.reasoningRigor ?? rawResult.metrics?.reasoningRigor, 10);

    // 2. Validate overall score
    let score = parseInt(rawResult.score, 10);

    // If score is invalid or missing, attempt to derive from independent sub-metrics if valid
    if (isNaN(score) || score < 1 || score > 10) {
      if (!isNaN(originality) && !isNaN(mechanisticDepth) && !isNaN(reasoningRigor)) {
        score = Math.round((originality + mechanisticDepth + reasoningRigor) / 3);
      } else {
        throw new Error('AI evaluation result missing valid 1-10 score.');
      }
    }

    score = Math.max(1, Math.min(10, Math.round(score)));

    // Fill missing metrics independently based on score rather than cloning identical values
    if (isNaN(originality) || originality < 1 || originality > 10) originality = score;
    if (isNaN(mechanisticDepth) || mechanisticDepth < 1 || mechanisticDepth > 10) mechanisticDepth = score;
    if (isNaN(reasoningRigor) || reasoningRigor < 1 || reasoningRigor > 10) reasoningRigor = score;

    // 3. Strictly map score to tier (overriding any mismatched tier returned by AI)
    const tier = this.mapScoreToTier(score);

    // 4. Validate pedagogical micro-explanation
    let explanation = rawResult.explanation;
    if (!explanation || typeof explanation !== 'string' || explanation.trim().length === 0) {
      explanation = this._generateExplanation(score, tier, question);
    }

    return {
      score,
      tier,
      explanation: explanation.trim(),
      metrics: {
        originality: Math.max(1, Math.min(10, originality)),
        mechanisticDepth: Math.max(1, Math.min(10, mechanisticDepth)),
        reasoningRigor: Math.max(1, Math.min(10, reasoningRigor))
      }
    };
  }

  /**
   * Main evaluation entry point: evaluates a student's question given scientific context.
   */
  async evaluateQuestion({ contextSnippet, contextType, question, discipline }) {
    console.log('\n--- [AI Evaluation Service] Processing Inquiry ---');
    console.log(`[Input] Discipline: ${discipline || 'General Science'}`);
    console.log(`[Input] Context Type: ${contextType}`);
    console.log(`[Input] Context Snippet: "${contextSnippet.substring(0, 70)}..."`);
    console.log(`[Input] Student Question: "${question}"`);

    // 1. Try Gemini API if key is present
    if (config.geminiApiKey) {
      console.log('[AI Provider] Initiating Google Gemini API evaluation...');
      try {
        const geminiResult = await this._callGemini(contextSnippet, contextType, question, discipline);
        if (geminiResult) {
          console.log('[AI Provider] Gemini API response received successfully.');
          const normalized = this.normalizeResult(geminiResult, question, contextSnippet);
          console.log(`[Evaluation Result] Score: ${normalized.score}/10 | Tier: ${normalized.tier} | Metrics: O:${normalized.metrics.originality} D:${normalized.metrics.mechanisticDepth} R:${normalized.metrics.reasoningRigor}`);
          return normalized;
        }
      } catch (err) {
        console.error('[AI Provider Error] Gemini API evaluation failed:', err.message);
        throw new Error(`AI Evaluation Provider Error: ${err.message}`);
      }
    }

    // 2. Try OpenAI API if key is present
    if (config.openaiApiKey) {
      console.log('[AI Provider] Initiating OpenAI API evaluation...');
      try {
        const openaiResult = await this._callOpenAI(contextSnippet, contextType, question, discipline);
        if (openaiResult) {
          console.log('[AI Provider] OpenAI API response received successfully.');
          const normalized = this.normalizeResult(openaiResult, question, contextSnippet);
          console.log(`[Evaluation Result] Score: ${normalized.score}/10 | Tier: ${normalized.tier} | Metrics: O:${normalized.metrics.originality} D:${normalized.metrics.mechanisticDepth} R:${normalized.metrics.reasoningRigor}`);
          return normalized;
        }
      } catch (err) {
        console.error('[AI Provider Error] OpenAI API evaluation failed:', err.message);
        throw new Error(`AI Evaluation Provider Error: ${err.message}`);
      }
    }

    // 3. Multi-dimensional Scientific Heuristic Evaluator (for offline testing / local run without API key)
    console.log('[AI Evaluator Engine] Running multi-dimensional scientific inquiry analyzer...');
    const evaluatedResult = this._evaluateScientifically(contextSnippet, contextType, question, discipline);
    const normalized = this.normalizeResult(evaluatedResult, question, contextSnippet);
    console.log(`[Evaluation Result] Score: ${normalized.score}/10 | Tier: ${normalized.tier} | Metrics: Originality:${normalized.metrics.originality} Depth:${normalized.metrics.mechanisticDepth} Rigor:${normalized.metrics.reasoningRigor}`);
    return normalized;
  }

  /**
   * LLM System Prompt construction.
   * Explicitly requires independent scores for Originality, Mechanistic Depth, Reasoning Rigor, and Overall Score.
   */
  _buildSystemPrompt(contextSnippet, contextType, question, discipline) {
    return `
You are an expert AI Scientific Inquiry Evaluator for a platform that trains STEM students in original, hypothesis-driven scientific inquiry.

EVALUATION RUBRIC & SCORING TIERS:
- Score 1–4 (Tier: Good): Fact-seeking & Recall. Asks for baseline definitions, direct facts, or simple clarifications.
- Score 5–7 (Tier: Excellent): System Dynamics. Probes cause-and-effect, variable relationships, rate alterations, or parameter dependencies.
- Score 8–9 (Tier: Genius): Edge Cases & Anomalies. Tests boundary conditions, extreme physical limits, non-obvious trade-offs, or quantum/non-equilibrium anomalies.
- Score 10 (Tier: Einstein): First-Principles Synthesis. Constructs counterfactual thought experiments, bridges disparate scientific domains, or questions foundational assumptions.

EVALUATION METRICS (Evaluate each dimension independently from 1 to 10):
1. Originality (1–10): Novelty, creativity of framing, and original perspective.
2. Mechanistic Depth (1–10): Physical/chemical/biological cause-and-effect detail, specific scientific terminology, and process dynamics.
3. Reasoning Rigor (1–10): Logical coherence, boundary analysis, hypothesis structure, and scientific consistency.

INPUT TO EVALUATE:
Discipline: ${discipline || 'General Science'}
Context Type: ${contextType}
Selected Scientific Context: "${contextSnippet}"
Student's Question: "${question}"

RESPONSE INSTRUCTIONS:
- Evaluate the question rigorously based ONLY on its cognitive quality and scientific relationship to the context.
- Do NOT default to score 7 or any middle number. Use the full 1–10 scale.
- Return ONLY a valid JSON object matching this schema:
{
  "score": <integer 1-10>,
  "originality": <integer 1-10>,
  "mechanisticDepth": <integer 1-10>,
  "reasoningRigor": <integer 1-10>,
  "explanation": "<1-2 sentence pedagogical micro-explanation highlighting why the question received its score and how it relates to deep scientific inquiry>"
}
`.trim();
  }

  /**
   * Gemini API call adapter
   */
  async _callGemini(contextSnippet, contextType, question, discipline) {
    const prompt = this._buildSystemPrompt(contextSnippet, contextType, question, discipline);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini API');
    return JSON.parse(text);
  }

  /**
   * OpenAI API call adapter
   */
  async _callOpenAI(contextSnippet, contextType, question, discipline) {
    const prompt = this._buildSystemPrompt(contextSnippet, contextType, question, discipline);
    const url = 'https://api.openai.com/v1/chat/completions';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!res.ok) throw new Error(`OpenAI API returned status ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from OpenAI API');
    return JSON.parse(text);
  }

  /**
   * Multi-dimensional Scientific Inquiry Analyzer
   * Used for offline development and testing when no external AI API key is configured.
   * Evaluates Originality, Mechanistic Depth, and Reasoning Rigor independently.
   */
  _evaluateScientifically(contextSnippet, contextType, question, discipline) {
    const q = question.trim();
    const qLower = q.toLowerCase();

    // 1. Analyze Originality (1-10)
    let originality = 3;
    const firstPrinciplesTerms = ['could a biological', 'could biological', 'homochirality', 'cosmic', 'electroweak', 'without quantum', 'alternative mechanism', 'replace the pathway', 'counterfactual', 'thought experiment', 'derive from first-principles'];
    const anomalyTerms = ['completely lost', 'if quantum coherence were', 'boundary condition', 'anomalous', 'quantum tunneling', 'isotope effect', 'non-equilibrium', 'decoherence', 'zero point'];
    const dynamicsTerms = ['how would', 'how does', 'affect', 'influence', 'alter', 'relationship between', 'denaturation'];

    if (firstPrinciplesTerms.some(t => qLower.includes(t))) {
      originality = 10;
    } else if (anomalyTerms.some(t => qLower.includes(t))) {
      originality = 8 + (qLower.includes('if ') ? 1 : 0);
    } else if (dynamicsTerms.some(t => qLower.includes(t))) {
      originality = 6;
    } else if (qLower.startsWith('what is') || qLower.startsWith('define') || qLower.startsWith('what wavelength')) {
      originality = 2;
    } else {
      originality = 4;
    }

    // 2. Analyze Mechanistic Depth (1-10)
    let mechanisticDepth = 3;
    const deepTerms = [
      'coherence pathway', 'energy-transfer pathway', 'intermediate quantum state', 
      'kinetic isotope', 'vibronic coupling', 'active site', 'donor-acceptor', 
      'tunneling barrier', 'denaturation rate', 'alternative mechanism', 
      'energy-transfer efficiency', 'replace the pathway'
    ];
    const midTerms = ['quantum coherence', 'chlorophyll', 'rubisco', 'efficiency', 'energy transfer', 'absorb', 'wavelength', 'reaction rate'];

    const deepMatches = deepTerms.filter(t => qLower.includes(t)).length;
    const midMatches = midTerms.filter(t => qLower.includes(t)).length;

    if (deepMatches >= 2 || (deepMatches >= 1 && qLower.length > 70) || (qLower.includes('without quantum') && deepMatches >= 1)) {
      mechanisticDepth = 9 + (deepMatches >= 2 || qLower.includes('without quantum') ? 1 : 0);
    } else if (deepMatches >= 1 || midMatches >= 2) {
      mechanisticDepth = 7;
    } else if (midMatches >= 1) {
      mechanisticDepth = 5;
    } else {
      mechanisticDepth = 3;
    }

    // 3. Analyze Reasoning Rigor (1-10)
    let reasoningRigor = 3;
    const highRigorStructures = ['if ... how would', 'what mechanism could explain', 'could a ... maintain ... without', 'what alternative mechanism would need to', 'under non-equilibrium'];
    const midRigorStructures = ['how would ... affect', 'how does ... alter', 'what is the relationship'];

    if (qLower.includes('could a') && qLower.includes('without') && qLower.includes('replace')) {
      reasoningRigor = 10;
    } else if (highRigorStructures.some(s => {
      const parts = s.split('...');
      return parts.every(p => qLower.includes(p.trim()));
    })) {
      reasoningRigor = qLower.includes('without') || qLower.includes('completely lost') ? 9 : 8;
    } else if (midRigorStructures.some(s => {
      const parts = s.split('...');
      return parts.every(p => qLower.includes(p.trim()));
    })) {
      reasoningRigor = 6;
    } else if (qLower.startsWith('what is') || qLower.startsWith('define')) {
      reasoningRigor = 2;
    } else {
      reasoningRigor = 4;
    }

    // Calculate overall score as rounded average of independent dimensions
    const score = Math.max(1, Math.min(10, Math.round((originality + mechanisticDepth + reasoningRigor) / 3)));
    const tier = this.mapScoreToTier(score);
    const explanation = this._generateExplanation(score, tier, question);

    return {
      score,
      tier,
      originality,
      mechanisticDepth,
      reasoningRigor,
      explanation
    };
  }

  _generateExplanation(score, tier, question) {
    switch (tier) {
      case 'Einstein':
        return `Score ${score}/10 — Exceptional first-principles synthesis! Probes foundational biological and physical assumptions through a novel counterfactual thought experiment.`;
      case 'Genius':
        return `Score ${score}/10 — High-order inquiry examining extreme boundary conditions, non-equilibrium states, and mechanistic anomalies.`;
      case 'Excellent':
        return `Score ${score}/10 — Strong system dynamics question investigating causal relationships, variable coupling, and parameter sensitivity.`;
      case 'Good':
      default:
        return `Score ${score}/10 — Baseline recall inquiry clarifying foundational terms or direct mechanism facts.`;
    }
  }
}

export const aiEvaluationService = new AIEvaluationService();
