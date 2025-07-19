@@ .. @@
 import { supabase } from './supabase';
 import { authService } from './auth';
+
+const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

@@ .. @@
   async submitWritingEssay(submission: WritingSubmission): Promise<TestResult> {
     const user = await authService.getCurrentUser();
     if (!user) throw new Error('User not authenticated');
 
+    // Call AI feedback function
+    const aiResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
+      method: 'POST',
+      headers: {
+        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
+        'Content-Type': 'application/json',
+      },
+      body: JSON.stringify({
+        type: 'writing',
+        data: {
+          task_type: submission.task_type,
+          prompt: submission.prompt,
+          content: submission.content,
+          word_count: submission.content.split(/\s+/).filter(word => word.length > 0).length
+        }
+      })
+    });
+
+    if (!aiResponse.ok) {
+      throw new Error('Failed to get AI feedback');
+    }
+
+    const aiFeedback = await aiResponse.json();
+
     // Insert writing submission
     const { data: writingData, error: writingError } = await supabase
       .from('writing_submissions')
       .insert({
         user_id: user.id,
         task_type: submission.task_type,
         prompt: submission.prompt,
         content: submission.content,
         submission_type: submission.submission_type,
-        word_count: submission.content.split(/\s+/).filter(word => word.length > 0).length,
-        band_score: this.calculateWritingBandScore(submission.content),
-        task_response: 7.0,
-        coherence_cohesion: 6.5,
-        lexical_resource: 7.5,
-        grammatical_range: 6.0,
-        ai_feedback: {
-          strengths: ["Good task achievement", "Clear structure"],
-          improvements: ["Expand vocabulary", "Complex sentences"],
-          suggestions: ["Practice conditionals", "Use more linking words"]
-        },
+        word_count: aiFeedback.word_count || submission.content.split(/\s+/).filter(word => word.length > 0).length,
+        band_score: aiFeedback.band_score,
+        task_response: aiFeedback.task_response,
+        coherence_cohesion: aiFeedback.coherence_cohesion,
+        lexical_resource: aiFeedback.lexical_resource,
+        grammatical_range: aiFeedback.grammatical_range,
+        ai_feedback: aiFeedback.feedback,
         human_feedback_requested: submission.human_feedback_requested || false,
       })
       .select()
       .single();

@@ .. @@
     return {
       id: writingData.id,
-      band_score: writingData.band_score,
-      task_response: writingData.task_response,
-      coherence_cohesion: writingData.coherence_cohesion,
-      lexical_resource: writingData.lexical_resource,
-      grammatical_range: writingData.grammatical_range,
+      band_score: aiFeedback.band_score,
+      task_response: aiFeedback.task_response,
+      coherence_cohesion: aiFeedback.coherence_cohesion,
+      lexical_resource: aiFeedback.lexical_resource,
+      grammatical_range: aiFeedback.grammatical_range,
       word_count: writingData.word_count,
       score: 0,
       total_questions: 0,
-      ai_feedback: writingData.ai_feedback as AIFeedback
+      ai_feedback: aiFeedback.feedback
     };
   },

@@ .. @@
   async submitSpeakingRecording(recording: SpeakingRecording): Promise<TestResult> {
     const user = await authService.getCurrentUser();
     if (!user) throw new Error('User not authenticated');
 
+    // For demo purposes, we'll use a sample transcript
+    // In a real app, you'd use speech-to-text to get the transcript
+    const sampleTranscript = "Well, I think this is a really interesting question. In my opinion, technology has definitely changed the way we communicate with each other. For example, social media platforms like Facebook and Instagram allow us to stay connected with friends and family who live far away.";
+
+    // Call AI feedback function
+    const aiResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
+      method: 'POST',
+      headers: {
+        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
+        'Content-Type': 'application/json',
+      },
+      body: JSON.stringify({
+        type: 'speaking',
+        data: {
+          part_number: recording.part_number,
+          question: recording.question,
+          transcript: sampleTranscript,
+          duration: recording.duration
+        }
+      })
+    });
+
+    if (!aiResponse.ok) {
+      throw new Error('Failed to get AI feedback');
+    }
+
+    const aiFeedback = await aiResponse.json();
+
     // Insert speaking recording
     const { data: speakingData, error: speakingError } = await supabase
       .from('speaking_recordings')
       .insert({
         user_id: user.id,
         part_number: recording.part_number,
         question: recording.question,
         duration: recording.duration,
-        band_score: 6.5,
-        fluency_coherence: 7.0,
-        pronunciation: 6.0,
-        lexical_resource: 6.5,
-        grammatical_range: 6.5,
-        ai_feedback: {
-          strengths: ["Good fluency", "Clear pronunciation"],
-          improvements: ["Expand vocabulary", "Complex grammar"],
-          suggestions: ["Practice daily", "Record yourself"]
-        },
+        band_score: aiFeedback.band_score,
+        fluency_coherence: aiFeedback.fluency_coherence,
+        pronunciation: aiFeedback.pronunciation,
+        lexical_resource: aiFeedback.lexical_resource,
+        grammatical_range: aiFeedback.grammatical_range,
+        ai_feedback: aiFeedback.feedback,
       })
       .select()
       .single();

@@ .. @@
     return {
       id: speakingData.id,
-      band_score: speakingData.band_score,
-      fluency_coherence: speakingData.fluency_coherence,
-      pronunciation: speakingData.pronunciation,
-      lexical_resource: speakingData.lexical_resource,
-      grammatical_range: speakingData.grammatical_range,
+      band_score: aiFeedback.band_score,
+      fluency_coherence: aiFeedback.fluency_coherence,
+      pronunciation: aiFeedback.pronunciation,
+      lexical_resource: aiFeedback.lexical_resource,
+      grammatical_range: aiFeedback.grammatical_range,
       score: 0,
       total_questions: 0,
-      ai_feedback: speakingData.ai_feedback as AIFeedback
+      ai_feedback: aiFeedback.feedback
     };
   },