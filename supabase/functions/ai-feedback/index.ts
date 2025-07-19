import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    console.error('AI Feedback Error:', error)
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
  const systemPrompt = `You are an expert IELTS examiner with 15+ years of experience. You must provide accurate, detailed feedback following official IELTS band descriptors.

For Task 1: Focus on task achievement, data accuracy, overview, and appropriate language.
For Task 2: Focus on task response, position clarity, idea development, and argumentation.

Always provide scores as numbers (e.g., 6.5, 7.0) and detailed, actionable feedback.`

  const userPrompt = `Analyze this IELTS ${data.task_type.toUpperCase()} response:

TASK PROMPT: ${data.prompt}

STUDENT RESPONSE: ${data.content}

WORD COUNT: ${data.word_count}

Provide detailed analysis with:
1. Overall band score (1-9, use .5 increments)
2. Individual criterion scores:
   - Task Achievement/Response (1-9)
   - Coherence and Cohesion (1-9) 
   - Lexical Resource (1-9)
   - Grammatical Range and Accuracy (1-9)
3. Specific feedback for each criterion
4. 3-4 key strengths
5. 3-4 areas for improvement
6. 3-4 actionable suggestions

Format as JSON:
{
  "band_score": number,
  "task_response": number,
  "coherence_cohesion": number,
  "lexical_resource": number,
  "grammatical_range": number,
  "detailed_feedback": {
    "task_achievement": "specific feedback",
    "coherence_cohesion": "specific feedback", 
    "lexical_resource": "specific feedback",
    "grammatical_range": "specific feedback"
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1500
    })
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${result.error?.message || 'Unknown error'}`)
  }

  try {
    const content = result.choices[0].message.content
    return JSON.parse(content)
  } catch (e) {
    console.error('Failed to parse AI response:', result.choices[0].message.content)
    throw new Error('Failed to parse AI response')
  }
}

async function generateSpeakingFeedback(data: SpeakingFeedbackRequest, apiKey: string) {
  const systemPrompt = `You are an expert IELTS speaking examiner. Analyze speaking responses based on official IELTS criteria:
- Fluency and Coherence
- Pronunciation 
- Lexical Resource
- Grammatical Range and Accuracy

Consider the part number context:
Part 1: Personal questions, 4-5 minutes
Part 2: Individual long turn, 3-4 minutes  
Part 3: Discussion, 4-5 minutes

Provide accurate band scores and specific, actionable feedback.`

  const userPrompt = `Analyze this IELTS Speaking Part ${data.part_number} response:

QUESTION: ${data.question}

TRANSCRIPT: ${data.transcript}

DURATION: ${data.duration} seconds

Provide detailed analysis with:
1. Overall band score (1-9, use .5 increments)
2. Individual criterion scores:
   - Fluency and Coherence (1-9)
   - Pronunciation (1-9)
   - Lexical Resource (1-9) 
   - Grammatical Range and Accuracy (1-9)
3. Specific feedback for each criterion
4. 3-4 key strengths
5. 3-4 areas for improvement
6. 3-4 actionable suggestions

Format as JSON:
{
  "band_score": number,
  "fluency_coherence": number,
  "pronunciation": number,
  "lexical_resource": number,
  "grammatical_range": number,
  "detailed_feedback": {
    "fluency_coherence": "specific feedback",
    "pronunciation": "specific feedback",
    "lexical_resource": "specific feedback", 
    "grammatical_range": "specific feedback"
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1200
    })
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${result.error?.message || 'Unknown error'}`)
  }

  try {
    const content = result.choices[0].message.content
    return JSON.parse(content)
  } catch (e) {
    console.error('Failed to parse AI response:', result.choices[0].message.content)
    throw new Error('Failed to parse AI response')
  }
}