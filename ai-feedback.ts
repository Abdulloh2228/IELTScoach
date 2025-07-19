// generateWritingFeedback.ts

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use SERVICE_ROLE key for writes
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function generateWritingFeedback(submissionId: string) {
  // 1. Get the submission content
  const { data: submission, error: fetchError } = await supabase
    .from('writing_submissions')
    .select('id, content')
    .eq('id', submissionId)
    .single();

  if (fetchError || !submission) {
    console.error('Fetch Error:', fetchError);
    return { success: false, error: fetchError };
  }

  // 2. Ask OpenAI for feedback
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an IELTS writing examiner. Please give structured feedback in JSON format like:
{
  "band_score": 6.5,
  "task_response": 6,
  "coherence": 7,
  "grammar": 6,
  "vocabulary": 7,
  "comment": "Your writing shows a clear argument, but some grammar and vocabulary are weak."
}`
      },
      {
        role: 'user',
        content: `Please give feedback on this IELTS Writing Task:\n\n${submission.content}`
      }
    ],
    temperature: 0.7
  });

  const rawText = response.choices[0].message.content ?? '';
  
  // 3. Try to parse JSON response
  let aiFeedback;
  try {
    aiFeedback = JSON.parse(rawText);
  } catch (err) {
    console.error('Failed to parse feedback:', rawText);
    aiFeedback = { comment: rawText }; // Fallback if GPT returns plain text
  }

  // 4. Update submission with AI feedback
  const { error: updateError } = await supabase
    .from('writing_submissions')
    .update({ ai_feedback: aiFeedback })
    .eq('id', submissionId);

  if (updateError) {
    console.error('Update Error:', updateError);
    return { success: false, error: updateError };
  }

  return { success: true, feedback: aiFeedback };
}

