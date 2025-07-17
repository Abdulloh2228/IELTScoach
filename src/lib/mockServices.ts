// Mock data and services for UI-only version

export interface MockTestResult {
  id: string;
  band_score: number;
  task_response?: number;
  coherence_cohesion?: number;
  lexical_resource?: number;
  grammatical_range?: number;
  fluency_coherence?: number;
  pronunciation?: number;
  score: number;
  total_questions: number;
  word_count?: number;
  ai_feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
}

export const mockTestService = {
  async createTestSession(testType: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: 'mock-session-' + Date.now() };
  },

  async submitWritingEssay(submission: any): Promise<MockTestResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const wordCount = submission.content.split(/\s+/).filter((word: string) => word.length > 0).length;
    const baseScore = Math.min(9, Math.max(4, 5 + (wordCount / 50)));

    return {
      id: 'mock-writing-' + Date.now(),
      band_score: Number((baseScore + Math.random() * 1.5).toFixed(1)),
      task_response: Number((baseScore + Math.random() * 1).toFixed(1)),
      coherence_cohesion: Number((baseScore + Math.random() * 1).toFixed(1)),
      lexical_resource: Number((baseScore + Math.random() * 1).toFixed(1)),
      grammatical_range: Number((baseScore + Math.random() * 1).toFixed(1)),
      word_count: wordCount,
      score: 0,
      total_questions: 0,
      ai_feedback: {
        strengths: [
          "Good task achievement with clear position",
          "Appropriate use of examples and explanations",
          "Generally well-organized structure"
        ],
        improvements: [
          "Consider using more varied cohesive devices",
          "Expand vocabulary with more sophisticated synonyms",
          "Work on complex sentence structures"
        ],
        suggestions: [
          "Practice using conditional sentences",
          "Learn more academic vocabulary",
          "Focus on paragraph transitions"
        ]
      }
    };
  },

  async submitSpeakingRecording(recording: any): Promise<MockTestResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseScore = 6 + Math.random() * 2;

    return {
      id: 'mock-speaking-' + Date.now(),
      band_score: Number(baseScore.toFixed(1)),
      fluency_coherence: Number((baseScore + Math.random() * 0.5).toFixed(1)),
      pronunciation: Number((baseScore + Math.random() * 0.5).toFixed(1)),
      lexical_resource: Number((baseScore + Math.random() * 0.5).toFixed(1)),
      grammatical_range: Number((baseScore + Math.random() * 0.5).toFixed(1)),
      score: 0,
      total_questions: 0,
      ai_feedback: {
        strengths: [
          "Good fluency with natural rhythm",
          "Clear pronunciation of most sounds",
          "Appropriate use of vocabulary"
        ],
        improvements: [
          "Work on specific sound pronunciation",
          "Use more varied vocabulary",
          "Practice complex grammatical structures"
        ],
        suggestions: [
          "Record yourself daily",
          "Practice tongue twisters",
          "Learn idiomatic expressions"
        ]
      }
    };
  },

  async submitReadingResponse(response: any): Promise<MockTestResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const score = this.calculateReadingScore(response.answers, response.correct_answers);
    const bandScore = this.calculateBandScore(score, response.total_questions);

    return {
      id: 'mock-reading-' + Date.now(),
      band_score: bandScore,
      score,
      total_questions: response.total_questions,
      ai_feedback: {
        strengths: [
          "Good comprehension of main ideas",
          "Effective scanning for specific information"
        ],
        improvements: [
          "Work on time management",
          "Practice identifying paraphrased information"
        ],
        suggestions: [
          "Read academic texts daily",
          "Practice skimming techniques"
        ]
      }
    };
  },

  async submitListeningResponse(response: any): Promise<MockTestResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const score = this.calculateListeningScore(response.answers, response.correct_answers);
    const bandScore = this.calculateBandScore(score, response.total_questions);

    return {
      id: 'mock-listening-' + Date.now(),
      band_score: bandScore,
      score,
      total_questions: response.total_questions,
      ai_feedback: {
        strengths: [
          "Good attention to detail",
          "Effective note-taking skills"
        ],
        improvements: [
          "Practice with different accents",
          "Work on spelling accuracy"
        ],
        suggestions: [
          "Listen to English podcasts daily",
          "Practice dictation exercises"
        ]
      }
    };
  },

  calculateReadingScore(userAnswers: any, correctAnswers: any): number {
    let correct = 0;
    Object.keys(correctAnswers).forEach(key => {
      if (userAnswers[key] && userAnswers[key].toLowerCase() === correctAnswers[key].toLowerCase()) {
        correct++;
      }
    });
    return correct;
  },

  calculateListeningScore(userAnswers: any, correctAnswers: any): number {
    return this.calculateReadingScore(userAnswers, correctAnswers);
  },

  calculateBandScore(score: number, total: number): number {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 9.0;
    if (percentage >= 80) return 8.0;
    if (percentage >= 70) return 7.0;
    if (percentage >= 60) return 6.0;
    if (percentage >= 50) return 5.0;
    if (percentage >= 40) return 4.0;
    return 3.0;
  }
};

export const mockProgressService = {
  async incrementTestCompletion(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  async addStudyTime(minutes: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};