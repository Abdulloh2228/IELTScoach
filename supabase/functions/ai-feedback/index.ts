import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WritingFeedbackRequest {
  task_type: 'task1' | 'task2';
  prompt: string;
  content: string;
  word_count: number;
}

interface SpeakingFeedbackRequest {
  part_number: number;
  question: string;
  transcript: string;
  duration: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    let feedback;
    
    if (type === 'writing') {
      feedback = await generateWritingFeedback(data as WritingFeedbackRequest, openaiApiKey)
    } else if (type === 'speaking') {
      feedback = await generateSpeakingFeedback(data as SpeakingFeedbackRequest, openaiApiKey)
    } else {
      throw new Error('Invalid feedback type')
    }

    return new Response(
      JSON.stringify(feedback),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function generateWritingFeedback(data: WritingFeedbackRequest, apiKey: string) {
  const prompt = `
You are an expert IELTS examiner. Analyze this ${data.task_type} writing response and provide detailed feedback.

Task Prompt: ${data.prompt}

Student Response: ${data.content}

Word Count: ${data.word_count}

Please provide:
1. Overall band score (1-9)
2. Individual scores for:
   - Task Achievement/Response (1-9)
   - Coherence and Cohesion (1-9)
   - Lexical Resource (1-9)
   - Grammatical Range and Accuracy (1-9)
3. Detailed feedback including:
   - Strengths (3-4 points)
   - Areas for improvement (3-4 points)
   - Specific suggestions (3-4 points)

Format your response as JSON with this structure:
{
  "band_score": number,
  "task_response": number,
  "coherence_cohesion": number,
  "lexical_resource": number,
  "grammatical_range": number,
  "feedback": {
    "strengths": ["point1", "point2", "point3"],
    "improvements": ["point1", "point2", "point3"],
    "suggestions": ["point1", "point2", "point3"]
  }
}
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert IELTS examiner with years of experience. Provide accurate, constructive feedback that helps students improve their IELTS writing scores.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${result.error?.message || 'Unknown error'}`)
  }

  try {
    return JSON.parse(result.choices[0].message.content)
  } catch (e) {
    throw new Error('Failed to parse AI response')
  }
}

async function generateSpeakingFeedback(data: SpeakingFeedbackRequest, apiKey: string) {
  const prompt = `
You are an expert IELTS speaking examiner. Analyze this Part ${data.part_number} speaking response.

Question: ${data.question}

Student Response Transcript: ${data.transcript}

Duration: ${data.duration} seconds

Please provide:
1. Overall band score (1-9)
2. Individual scores for:
   - Fluency and Coherence (1-9)
   - Pronunciation (1-9)
   - Lexical Resource (1-9)
   - Grammatical Range and Accuracy (1-9)
3. Detailed feedback including:
   - Strengths (3-4 points)
   - Areas for improvement (3-4 points)
   - Specific suggestions (3-4 points)

Format your response as JSON with this structure:
{
  "band_score": number,
  "fluency_coherence": number,
  "pronunciation": number,
  "lexical_resource": number,
  "grammatical_range": number,
  "feedback": {
    "strengths": ["point1", "point2", "point3"],
    "improvements": ["point1", "point2", "point3"],
    "suggestions": ["point1", "point2", "point3"]
  }
}
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert IELTS speaking examiner. Provide accurate, constructive feedback based on the transcript provided.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    })
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${result.error?.message || 'Unknown error'}`)
  }

  try {
    return JSON.parse(result.choices[0].message.content)
  } catch (e) {
    throw new Error('Failed to parse AI response')
  }
}