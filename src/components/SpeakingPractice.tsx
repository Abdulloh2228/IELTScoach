import React, { useState } from 'react';
import { Mic, Square, Play, RotateCcw, Volume2, Star } from 'lucide-react';
import { testService } from '../lib/testService';
import { progressService } from '../lib/progressService';
import { getRandomSpeakingQuestions } from '../lib/testMaterials';

type Page = 'dashboard' | 'exam-selector' | 'writing' | 'reading' | 'speaking' | 'listening' | 'progress' | 'profile';

interface SpeakingPracticeProps {
  onNavigate: (page: Page) => void;
}

export default function SpeakingPractice({ onNavigate }: SpeakingPracticeProps) {
  const [currentPart, setCurrentPart] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState(() => getRandomSpeakingQuestions(1));
  const [results, setResults] = useState<any>(null);

  React.useEffect(() => {
    setCurrentQuestions(getRandomSpeakingQuestions(currentPart as 1 | 2 | 3));
    setHasRecording(false);
    setIsRecording(false);
  }, [currentPart]);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create test session
      await testService.createTestSession('speaking');
      
      // Submit speaking recording
      const currentQuestion = currentPart === 2 
        ? (currentQuestions as any).topic 
        : (currentQuestions as any).questions?.[0] || 'Speaking question';
        
      const recording = await testService.submitSpeakingRecording({
        part_number: currentPart,
        question: currentQuestion,
        duration: 120,
      });

      setResults(recording);
      setShowResults(true);
      
      // Update user stats
      await progressService.incrementTestCompletion();
      await progressService.addStudyTime(15);
    } catch (error) {
      console.error('Error submitting speaking test:', error);
      alert(`Error submitting test: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  if (showResults) {
    if (!results) return null;
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Speaking Analysis Results</h1>
          <button 
            onClick={() => setShowResults(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Practice Again
          </button>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Speaking Band Score</h2>
          <div className="text-6xl font-bold mb-4">{results.band_score}</div>
          <p className="text-purple-100">Great progress! Keep practicing to reach your target.</p>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Scores</h3>
            <div className="space-y-4">
              {[
                { criteria: 'Fluency & Coherence', score: results.fluency_coherence },
                { criteria: 'Pronunciation', score: results.pronunciation },
                { criteria: 'Lexical Resource', score: results.lexical_resource },
                { criteria: 'Grammatical Range', score: results.grammatical_range }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{item.criteria}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.score / 9) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-purple-600 w-8">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Feedback</h3>
            <div className="space-y-3">
              {results.ai_feedback.improvements?.map((tip: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Answers */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            <Star className="inline mr-2" size={20} />
            Sample High-Band Answers
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-medium text-green-800 mb-2">Part 1 Example Response</h4>
              <p className="text-gray-700 text-sm italic">
                "I work as a software developer for a tech startup in the city center. I absolutely love my job because 
                it allows me to be creative and solve complex problems every day. What I find particularly rewarding is..."
              </p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Listen to Full Sample Answer →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Speaking Practice</h1>
          <p className="text-gray-600 mt-2">IELTS Speaking Test Simulation</p>
        </div>
        <button 
          onClick={() => onNavigate('exam-selector')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Exams
        </button>
      </div>

      {/* Part Selection */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Speaking Part</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((part) => (
            <button
              key={part}
              onClick={() => setCurrentPart(part)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                currentPart === part
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold mb-1">Part {part} - {
                part === 1 ? 'Introduction & Interview' :
                part === 2 ? 'Long Turn' : 'Discussion'
              }</h3>
              <p className="text-sm text-gray-600 mb-2">
                {part === 1 ? '4-5 minutes' : part === 2 ? '3-4 minutes' : '4-5 minutes'}
              </p>
              <p className="text-xs text-gray-500">
                {part === 1 ? 'General questions about yourself' :
                 part === 2 ? 'Speak for 1-2 minutes on a topic' :
                 'Discussion related to Part 2 topic'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Part Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Part {currentPart} - {
            currentPart === 1 ? 'Introduction & Interview' :
            currentPart === 2 ? 'Long Turn' : 'Discussion'
          }
        </h2>
        
        {currentPart === 2 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Cue Card</h3>
            <p className="text-gray-800 font-medium mb-4">
              {(currentQuestions as any).topic}
            </p>
            <div className="text-gray-700 whitespace-pre-line">
              {(currentQuestions as any).cueCard}
            </div>
            <p className="text-sm text-gray-600 mt-4 font-medium">
              You have 1 minute to prepare. You can make notes if you wish.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-800">Practice Questions:</h3>
            {(currentQuestions as any).questions?.map((question: string, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{index + 1}. {question}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recording Interface */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
          <div className="text-center">
            <div className="mb-6">
              <button
                onClick={handleRecord}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isRecording ? <Square size={32} /> : <Mic size={32} />}
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isRecording ? 'Recording in progress...' : 'Ready to record your answer'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {isRecording 
                ? 'Speak clearly and at a natural pace' 
                : 'Click the microphone to start recording'
              }
            </p>

            {hasRecording && (
              <div className="flex justify-center space-x-4 mb-4">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Play size={16} />
                  <span>Play Recording</span>
                </button>
                <button 
                  onClick={() => {setHasRecording(false); setIsRecording(false);}}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw size={16} />
                  <span>Re-record</span>
                </button>
              </div>
            )}

            {hasRecording && (
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Get AI Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Speaking Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Before Recording:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ensure you're in a quiet environment</li>
              <li>• Test your microphone</li>
              <li>• Take time to think about your answer</li>
              <li>• Practice speaking clearly</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">While Speaking:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Speak at a natural pace</li>
              <li>• Use varied vocabulary</li>
              <li>• Give detailed examples</li>
              <li>• Don't worry about perfect grammar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}