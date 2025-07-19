import { supabase } from './supabase';
import { authService } from './auth';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface TestSession {
  id: string;
  user_id: string;
  test_type: string;
  status: 'in_progress' | 'completed' | 'submitted';
  started_at: string;
  completed_at?: string;
  overall_score?: number;
}

export interface TestResult {
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
  ai_feedback: AIFeedback;
}

export interface AIFeedback {
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  detailed_feedback?: {
    task_achievement?: string;
    coherence_cohesion?: string;
    lexical_resource?: string;
    grammatical_range?: string;
    fluency_coherence?: string;
    pronunciation?: string;
  };
}

export interface WritingSubmission {
  task_type: 'task1' | 'task2';
  prompt: string;
  content: string;
  submission_type: 'typed' | 'uploaded';
  file_url?: string;
  human_feedback_requested?: boolean;
}

export interface SpeakingRecording {
  part_number: number;
  question: string;
  recording_url?: string;
  duration: number;
  transcript?: string;
}

export interface ReadingResponse {
  passage_id: string;
  answers: { [key: string]: string };
  correct_answers: { [key: string]: string };
  total_questions: number;
  time_taken: number;
}

export interface ListeningResponse {
  audio_id: string;
  answers: { [key: string]: string };
  correct_answers: { [key: string]: string };
  total_questions: number;
}

export const testService = {
  async createTestSession(testType: string): Promise<TestSession> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('test_sessions')
      .insert({
        user_id: user.id,
        test_type: testType,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitWritingEssay(submission: WritingSubmission): Promise<TestResult> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Call AI feedback function
      const aiResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'writing',
          data: {
            task_type: submission.task_type,
            prompt: submission.prompt,
            content: submission.content,
            word_count: submission.content.split(/\s+/).filter(word => word.length > 0).length
          }
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI feedback error:', errorText);
        throw new Error('Failed to get AI feedback');
      }

      const aiFeedback = await aiResponse.json();

      // Insert writing submission
      const { data: writingData, error: writingError } = await supabase
        .from('writing_submissions')
        .insert({
          user_id: user.id,
          task_type: submission.task_type,
          prompt: submission.prompt,
          content: submission.content,
          submission_type: submission.submission_type,
          word_count: aiFeedback.word_count || submission.content.split(/\s+/).filter(word => word.length > 0).length,
          band_score: aiFeedback.band_score,
          task_response: aiFeedback.task_response,
          coherence_cohesion: aiFeedback.coherence_cohesion,
          lexical_resource: aiFeedback.lexical_resource,
          grammatical_range: aiFeedback.grammatical_range,
          ai_feedback: aiFeedback,
          human_feedback_requested: submission.human_feedback_requested || false,
        })
        .select()
        .single();

      if (writingError) throw writingError;

      return {
        id: writingData.id,
        band_score: aiFeedback.band_score,
        task_response: aiFeedback.task_response,
        coherence_cohesion: aiFeedback.coherence_cohesion,
        lexical_resource: aiFeedback.lexical_resource,
        grammatical_range: aiFeedback.grammatical_range,
        word_count: writingData.word_count,
        score: 0,
        total_questions: 0,
        ai_feedback: {
          strengths: aiFeedback.strengths || [],
          improvements: aiFeedback.improvements || [],
          suggestions: aiFeedback.suggestions || [],
          detailed_feedback: aiFeedback.detailed_feedback
        }
      };
    } catch (error) {
      console.error('Error in submitWritingEssay:', error);
      throw error;
    }
  },

  async submitSpeakingRecording(recording: SpeakingRecording): Promise<TestResult> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // For demo purposes, we'll use a sample transcript
      // In a real app, you'd use speech-to-text to get the transcript
      const sampleTranscript = "Well, I think this is a really interesting question. In my opinion, technology has definitely changed the way we communicate with each other. For example, social media platforms like Facebook and Instagram allow us to stay connected with friends and family who live far away. However, I also think that sometimes we rely too much on technology and we're losing the ability to have face-to-face conversations. I mean, when I go to restaurants now, I often see families sitting together but everyone is looking at their phones instead of talking to each other.";

      // Call AI feedback function
      const aiResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'speaking',
          data: {
            part_number: recording.part_number,
            question: recording.question,
            transcript: recording.transcript || sampleTranscript,
            duration: recording.duration
          }
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI feedback error:', errorText);
        throw new Error('Failed to get AI feedback');
      }

      const aiFeedback = await aiResponse.json();

      // Insert speaking recording
      const { data: speakingData, error: speakingError } = await supabase
        .from('speaking_recordings')
        .insert({
          user_id: user.id,
          part_number: recording.part_number,
          question: recording.question,
          duration: recording.duration,
          band_score: aiFeedback.band_score,
          fluency_coherence: aiFeedback.fluency_coherence,
          pronunciation: aiFeedback.pronunciation,
          lexical_resource: aiFeedback.lexical_resource,
          grammatical_range: aiFeedback.grammatical_range,
          ai_feedback: aiFeedback,
        })
        .select()
        .single();

      if (speakingError) throw speakingError;

      return {
        id: speakingData.id,
        band_score: aiFeedback.band_score,
        fluency_coherence: aiFeedback.fluency_coherence,
        pronunciation: aiFeedback.pronunciation,
        lexical_resource: aiFeedback.lexical_resource,
        grammatical_range: aiFeedback.grammatical_range,
        score: 0,
        total_questions: 0,
        ai_feedback: {
          strengths: aiFeedback.strengths || [],
          improvements: aiFeedback.improvements || [],
          suggestions: aiFeedback.suggestions || [],
          detailed_feedback: aiFeedback.detailed_feedback
        }
      };
    } catch (error) {
      console.error('Error in submitSpeakingRecording:', error);
      throw error;
    }
  },

  async submitReadingResponse(response: ReadingResponse): Promise<TestResult> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const score = this.calculateReadingScore(response.answers, response.correct_answers);
    const bandScore = this.calculateBandScore(score, response.total_questions);

    const { data, error } = await supabase
      .from('reading_responses')
      .insert({
        user_id: user.id,
        passage_id: response.passage_id,
        answers: response.answers,
        correct_answers: response.correct_answers,
        score,
        total_questions: response.total_questions,
        band_score: bandScore,
        time_taken: response.time_taken,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
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

  async submitListeningResponse(response: ListeningResponse): Promise<TestResult> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const score = this.calculateListeningScore(response.answers, response.correct_answers);
    const bandScore = this.calculateBandScore(score, response.total_questions);

    const { data, error } = await supabase
      .from('listening_responses')
      .insert({
        user_id: user.id,
        audio_id: response.audio_id,
        answers: response.answers,
        correct_answers: response.correct_answers,
        score,
        total_questions: response.total_questions,
        band_score: bandScore,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
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
      if (userAnswers[key] && userAnswers[key].toLowerCase().trim() === correctAnswers[key].toLowerCase().trim()) {
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