/**
 * Repository interface for managing Student Inquiry and Analytics data.
 * 
 * DESIGN NOTE (DATABASE DEFERRAL):
 * Per requirement #2, this repository isolates the in-memory data store behind a clean interface.
 * When a real database (PostgreSQL, MongoDB, SQLite, etc.) is integrated later,
 * implement a `DbInquiryRepository` conforming to this class structure without
 * touching frontend or business logic.
 */

export class InquiryRepositoryInterface {
  async saveInquiry(inquiry) {
    throw new Error('Method not implemented');
  }
  async getInquiriesBySession(sessionId) {
    throw new Error('Method not implemented');
  }
  async getDashboardSummary(sessionId) {
    throw new Error('Method not implemented');
  }
  async resetSession(sessionId) {
    throw new Error('Method not implemented');
  }
}

export class InMemoryInquiryRepository extends InquiryRepositoryInterface {
  constructor() {
    super();
    // Maps sessionId -> Array of Inquiry records
    this.inquiriesBySession = new Map();
  }

  _getOrCreateSessionList(sessionId) {
    const sId = sessionId || 'default_session';
    if (!this.inquiriesBySession.has(sId)) {
      this.inquiriesBySession.set(sId, []);
    }
    return this.inquiriesBySession.get(sId);
  }

  async saveInquiry(sessionId, inquiryData) {
    const inquiries = this._getOrCreateSessionList(sessionId);
    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      sessionId: sessionId || 'default_session',
      ...inquiryData
    };
    inquiries.push(newInquiry);
    return newInquiry;
  }

  async getInquiriesBySession(sessionId) {
    const list = this._getOrCreateSessionList(sessionId);
    return [...list].reverse(); // Most recent first
  }

  async getDashboardSummary(sessionId) {
    const inquiries = this._getOrCreateSessionList(sessionId);

    // Initial empty metrics
    const tierDistribution = {
      Good: 0,
      Excellent: 0,
      Genius: 0,
      Einstein: 0
    };

    const disciplineTrends = {};
    let totalOriginalitySum = 0;
    let highestScore = 0;

    for (const inq of inquiries) {
      if (tierDistribution[inq.tier] !== undefined) {
        tierDistribution[inq.tier]++;
      }
      if (inq.score > highestScore) {
        highestScore = inq.score;
      }
      totalOriginalitySum += (inq.metrics?.originality || inq.score);

      const discipline = inq.discipline || 'General Science';
      if (!disciplineTrends[discipline]) {
        disciplineTrends[discipline] = {
          discipline,
          count: 0,
          totalScore: 0,
          avgScore: 0
        };
      }
      disciplineTrends[discipline].count++;
      disciplineTrends[discipline].totalScore += inq.score;
      disciplineTrends[discipline].avgScore = Number(
        (disciplineTrends[discipline].totalScore / disciplineTrends[discipline].count).toFixed(1)
      );
    }

    const totalInquiries = inquiries.length;
    const avgOriginality = totalInquiries > 0
      ? Number((totalOriginalitySum / totalInquiries).toFixed(1))
      : 0;

    const avgScore = totalInquiries > 0
      ? Number((inquiries.reduce((acc, curr) => acc + curr.score, 0) / totalInquiries).toFixed(1))
      : 0;

    return {
      totalInquiries,
      avgOriginality,
      avgScore,
      highestScore,
      tierDistribution,
      disciplineTrends: Object.values(disciplineTrends),
      recentInquiries: [...inquiries].reverse().slice(0, 10)
    };
  }

  async resetSession(sessionId) {
    const sId = sessionId || 'default_session';
    this.inquiriesBySession.set(sId, []);
    return true;
  }
}

// Export singleton instance of repository for session lifetime
export const inquiryRepository = new InMemoryInquiryRepository();
