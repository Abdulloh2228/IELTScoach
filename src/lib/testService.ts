import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const testService = {
  async submitWriting(taskType: string, prompt: string, content: string, userId: string) {
    try {
      // Save to database first
      const { data: submission, error: dbError } = await supabase
        .from('writing_submissions')
        .insert({
          user_id: userId,
          task_type: taskType,
          prompt,
          content,
          word_count: content.split(' ').length,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Call AI feedback function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'writing',
          taskType,
          content,
          prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const feedback = await response.json();

      // Update submission with AI feedback
      const { error: updateError } = await supabase
        .from('writing_submissions')
        .update({
          band_score: feedback.overallBand,
          task_response: feedback.taskResponse,
          coherence_cohesion: feedback.coherenceCohesion,
          lexical_resource: feedback.lexicalResource,
          grammatical_range: feedback.grammaticalRange,
          ai_feedback: feedback
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      return {
        id: submission.id,
        overallBand: feedback.overallBand,
        taskResponse: feedback.taskResponse,
        coherenceCohesion: feedback.coherenceCohesion,
        lexicalResource: feedback.lexicalResource,
        grammaticalRange: feedback.grammaticalRange,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        suggestions: feedback.suggestions
      };
    } catch (error) {
      console.error('Error submitting writing:', error);
      throw error;
    }
  },

  async submitSpeaking(part: number, question: string, recordingUrl: string, userId: string) {
    try {
      // Save to database first
      const { data: recording, error: dbError } = await supabase
        .from('speaking_recordings')
        .insert({
          user_id: userId,
          part_number: part,
          question,
          recording_url: recordingUrl,
          duration: 120 // Default duration
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Call AI feedback function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'speaking',
          part,
          question,
          recordingUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const feedback = await response.json();

      // Update recording with AI feedback
      const { error: updateError } = await supabase
        .from('speaking_recordings')
        .update({
          band_score: feedback.overallBand,
          fluency_coherence: feedback.fluencyCoherence,
          pronunciation: feedback.pronunciation,
          lexical_resource: feedback.lexicalResource,
          grammatical_range: feedback.grammaticalRange,
          ai_feedback: feedback
        })
        .eq('id', recording.id);

      if (updateError) throw updateError;

      return {
        id: recording.id,
        overallBand: feedback.overallBand,
        fluencyCoherence: feedback.fluencyCoherence,
        pronunciation: feedback.pronunciation,
        lexicalResource: feedback.lexicalResource,
        grammaticalRange: feedback.grammaticalRange,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        suggestions: feedback.suggestions
      };
    } catch (error) {
      console.error('Error submitting speaking:', error);
      throw error;
    }
  },

  async submitReading(passageId: string, answers: any, userId: string) {
    try {
      const { data, error } = await supabase
        .from('reading_responses')
        .insert({
          user_id: userId,
          passage_id: passageId,
          answers,
          score: 0, // Will be calculated
          total_questions: Object.keys(answers).length
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting reading:', error);
      throw error;
    }
  },

  async submitListening(audioId: string, answers: any, userId: string) {
    try {
      const { data, error } = await supabase
        .from('listening_responses')
        .insert({
          user_id: userId,
          audio_id: audioId,
          answers,
          score: 0, // Will be calculated
          total_questions: Object.keys(answers).length
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting listening:', error);
      throw error;
    }
  }
};