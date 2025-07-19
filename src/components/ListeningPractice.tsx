import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Clock, CheckCircle } from 'lucide-react';
import { testService } from '../lib/testService';
import { progressService } from '../lib/progressService';
import { getRandomListeningTest } from '../lib/testMaterials';

type Page = 'dashboard' | 'exam-selector' | 'writing' | 'reading' | 'speaking' | 'listening' | 'progress' | 'profile';

interface ListeningPracticeProps {
  onNavigate: (page: Page) => void;
}

export default function ListeningPractice({ onNavigate }: ListeningPracticeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [listeningData] = useState(() => getRandomListeningTest());


  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      // Create test session
      await testService.createTestSession('listening');
      
      // Prepare correct answers
      const correctAnswers: { [key: string]: string } = {};
      listeningData.questions.forEach(q => {
        if (q.type === 'multiple_choice' && q.options) {
          correctAnswers[q.id.toString()] = q.options[q.correct as number];
        } else {
          correctAnswers[q.id.toString()] = q.correct as string;
        }
      });
      
      // Submit listening response
      const response = await testService.submitListeningResponse({
        audio_id: listeningData.id,
        answers,
        correct_answers: correctAnswers,
        total_questions: listeningData.questions.length,
      });

      setResults(response);
      setShowResults(true);
      
      // Update user stats
      await progressService.incrementTestCompletion();
      await progressService.addStudyTime(30);
    } catch (error) {
      console.error('Error submitting listening test:', error);
      alert(`Error submitting test: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    if (!results) return null;
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Listening Test Results</h1>
          <button 
            onClick={() => {setShowResults(false); setAnswers({});}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Another Test
          </button>
        </div>

        {/* Score Overview */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Listening Band Score</h2>
          <div className="text-6xl font-bold mb-4">{results.band_score}</div>
          <p className="text-orange-100">{results.score} out of {results.total_questions} questions answered correctly</p>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Answer Review</h3>
          <div className="space-y-4">
            {listeningData.questions.map((question) => {
              const userAnswer = answers[question.id] || '';
              let correctAnswer = '';
              let isCorrect = false;
              
              if (question.type === 'multiple_choice' && question.options) {
                correctAnswer = question.options[question.correct as number];
                isCorrect = userAnswer === correctAnswer;
              } else {
                correctAnswer = question.correct as string;
                isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
              }
              
              return (
                <div key={question.id} className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Your answer:</span> {userAnswer || 'Not answered'}</p>
                        <p><span className="font-medium">Correct answer:</span> {correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Audio Transcript</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {listeningData.transcript}
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Listening Practice</h1>
          <p className="text-gray-600 mt-2">IELTS Listening Test Section</p>
        </div>
        <button 
          onClick={() => onNavigate('exam-selector')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Exams
        </button>
      </div>

      {/* Audio Player */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Volume2 className="text-orange-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">{listeningData.title}</h2>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-100">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <button
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow"
            >
              <RotateCcw size={20} />
            </button>
            
            <button
              onClick={handlePlay}
              className="w-16 h-16 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-600" />
              <span className="font-mono text-gray-700">{formatTime(currentTime)} / 2:45</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / 165) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-center text-gray-600 text-sm mt-4">
            {isPlaying ? 'Audio is playing...' : 'Click play to start the listening exercise'}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
        <p className="text-blue-700">
          Listen carefully and answer the questions below. You will hear the recording ONCE only.
        </p>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions</h2>
        
        <div className="space-y-6">
          {listeningData.questions.map((question, index) => (
            <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-800 mb-4">
                {index + 1}. {question.question}
              </p>
              
              {question.type === 'multiple_choice' && question.options ? (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-600">
            {Object.keys(answers).length}/{listeningData.questions.length} questions answered
          </span>
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit Answers
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Listening Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Before Listening:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Read all questions carefully</li>
              <li>• Predict possible answers</li>
              <li>• Use good quality headphones</li>
              <li>• Focus on keywords</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">While Listening:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Listen for specific information</li>
              <li>• Don't panic if you miss something</li>
              <li>• Write answers as you hear them</li>
              <li>• Pay attention to spelling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}