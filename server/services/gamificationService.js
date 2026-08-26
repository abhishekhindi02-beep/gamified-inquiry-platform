import { config } from '../config/env.js';

export class GamificationService {
  /**
   * Calculates active inquiry streaks and progression milestones for a student's inquiry session.
   * Configurable thresholds are isolated as implementation settings per project requirements.
   */
  evaluateProgression(inquiries = []) {
    // 1. Calculate total active inquiry count for current session
    const currentStreak = inquiries.length;

    // 2. Calculate "Einstein Streak" (consecutive high-order inquiries: score >= minScore)
    const minScore = config.einsteinStreakMinScore; // Implementation setting: score >= 8
    const requiredCount = config.einsteinStreakRequiredCount; // Implementation setting: 3 consecutive

    let currentHighOrderStreak = 0;
    let maxHighOrderStreak = 0;

    // Chronological order (oldest to newest)
    const chronologicalInquiries = [...inquiries].reverse();

    for (const inq of chronologicalInquiries) {
      if (inq.score >= minScore) {
        currentHighOrderStreak++;
        if (currentHighOrderStreak > maxHighOrderStreak) {
          maxHighOrderStreak = currentHighOrderStreak;
        }
      } else {
        currentHighOrderStreak = 0;
      }
    }

    const hasEinsteinStreakBadge = maxHighOrderStreak >= requiredCount;

    // 3. Progression Milestones aligned strictly with brief tiers and active inquiry progression
    const totalCount = inquiries.length;
    const tierCounts = { Good: 0, Excellent: 0, Genius: 0, Einstein: 0 };
    inquiries.forEach(i => {
      if (tierCounts[i.tier] !== undefined) tierCounts[i.tier]++;
    });

    const milestones = [
      {
        id: 'inquiry_initiated',
        title: 'Inquiry Initiated',
        description: 'Submit your first scientific question attached to content context',
        achieved: totalCount >= 1,
        progress: Math.min(totalCount / 1, 1),
        icon: 'Zap'
      },
      {
        id: 'excellent_tier_achieved',
        title: 'Excellent Tier Inquiry',
        description: 'Reach the Excellent tier by investigating system dynamics and cause-and-effect',
        achieved: (tierCounts.Excellent + tierCounts.Genius + tierCounts.Einstein) >= 1,
        progress: (tierCounts.Excellent + tierCounts.Genius + tierCounts.Einstein) >= 1 ? 1 : 0,
        icon: 'Compass'
      },
      {
        id: 'genius_tier_achieved',
        title: 'Genius Tier Inquiry',
        description: 'Reach the Genius tier by testing boundary conditions and non-obvious trade-offs',
        achieved: (tierCounts.Genius + tierCounts.Einstein) >= 1,
        progress: (tierCounts.Genius + tierCounts.Einstein) >= 1 ? 1 : 0,
        icon: 'Sparkles'
      },
      {
        id: 'einstein_tier_achieved',
        title: 'Einstein Tier Inquiry',
        description: 'Achieve a 10/10 Einstein score demonstrating first-principles synthesis',
        achieved: tierCounts.Einstein >= 1,
        progress: tierCounts.Einstein >= 1 ? 1 : 0,
        icon: 'Brain'
      },
      {
        id: 'einstein_streak_badge',
        title: 'Einstein Streak',
        description: 'Achieve consistent high-order inquiries at Genius or Einstein quality level',
        achieved: hasEinsteinStreakBadge,
        progress: Math.min(currentHighOrderStreak / requiredCount, 1),
        icon: 'Award',
        isSpecialBadge: true
      }
    ];

    return {
      currentStreak,
      highOrderStreak: currentHighOrderStreak,
      maxHighOrderStreak,
      einsteinStreakThreshold: requiredCount,
      einsteinStreakBadgeUnlocked: hasEinsteinStreakBadge,
      milestones,
      totalMilestonesAchieved: milestones.filter(m => m.achieved).length
    };
  }
}

export const gamificationService = new GamificationService();
