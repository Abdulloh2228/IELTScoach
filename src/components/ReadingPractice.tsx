import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, BookOpen, ArrowRight } from 'lucide-react';
import { testService } from '../lib/testService';
import { progressService } from '../lib/progressService';
import { getRandomReadingPassage } from '../lib/testMaterials';

type Page = 'dashboard' | 'exam-selector' | 'writing' | 'reading' | 'speaking' | 'listening' | 'progress' | 'profile';

interface ReadingPracticeProps {
  onNavigate: (page: Page) => void;
}

export default function ReadingPractice({ onNavigate }: ReadingPracticeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [passageData] = useState(() => getRandomReadingPassage());


  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex.toString()
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create test session
      const session = await testService.createTestSession('reading');
      
      // Prepare correct answers
      const correctAnswers: { [key: string]: string } = {};
      passageData.questions.forEach(q => {
        if (q.type === 'multiple_choice') {
          correctAnswers[q.id.toString()] = q.correct.toString();
        } else {
          correctAnswers[q.id.toString()] = q.correct;
        }
      });
      
      // Submit reading response
      const response = await testService.submitReadingResponse({
        session_id: session.id,
        passage_id: passageData.id,
        answers,
        correct_answers: correctAnswers,
        total_questions: passageData.questions.length,
        time_taken: 3600 - timeLeft,
      });

      setResults(response);
      setShowResults(true);
      
      // Update user stats
      await progressService.incrementTestCompletion();
      await progressService.addStudyTime(60);
    } catch (error) {
      console.error('Error submitting reading test:', error);
      alert(`Error submitting test: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showResults]);

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
          <h1 className="text-3xl font-bold text-gray-900">Reading Test Results</h1>
          <button 
            onClick={() => {setShowResults(false); setAnswers({}); setCurrentQuestion(0); setTimeLeft(3600);}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Another Test
          </button>
        </div>

        {/* Score Overview */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Reading Band Score</h2>
          <div className="text-6xl font-bold mb-4">{results.band_score}</div>
          <p className="text-green-100">{results.score} out of {results.total_questions} questions correct</p>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Question Analysis</h3>
          <div className="space-y-4">
            {passageData.questions.map((question, index) => {
              const userAnswer = answers[question.id] || '';
              let isCorrect = false;
              let correctAnswer = '';
              
              if (question.type === 'multiple_choice' && question.options) {
                const userIndex = parseInt(userAnswer);
                isCorrect = userIndex === question.correct;
                correctAnswer = question.options[question.correct as number];
              } else {
                isCorrect = userAnswer.toLowerCase().trim() === (question.correct as string).toLowerCase().trim();
                correctAnswer = question.correct as string;
              }
              
              return (
                <div key={question.id} className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="text-green-600 mt-1" size={20} />
                    ) : (
                      <XCircle className="text-red-600 mt-1" size={20} />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Your answer:</span> {
                          userAnswer || 'Not answered'
                        }</p>
                        <p><span className="font-medium">Correct answer:</span> {correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Improvement Strategies</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Time Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Spend max 20 minutes per passage</li>
                <li>• Skim first, then read for details</li>
                <li>• Don't get stuck on difficult questions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Reading Techniques</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Look for keywords in questions</li>
                <li>• Practice scanning for specific information</li>
                <li>• Focus on topic sentences in paragraphs</li>
              </ul>
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
          <h1 className="text-3xl font-bold text-gray-900">Reading Practice</h1>
          <p className="text-gray-600 mt-2">IELTS Academic Reading Test</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border">
            <Clock className="text-blue-600" size={20} />
            <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => onNavigate('exam-selector')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Exams
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Passage */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">{passageData.title}</h2>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {passageData.passage}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <span className="text-sm text-gray-600">
              {Object.keys(answers).length}/{passageData.questions.length} answered
            </span>
          </div>

          <div className="space-y-6">
            {passageData.questions.map((question, index) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-800 mb-4">
                  {index + 1}. {question.question}
                </p>
                
                {question.type === 'multiple_choice' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionIndex}
                          checked={answers[question.id] === optionIndex.toString()}
                          onChange={() => handleAnswerSelect(question.id, optionIndex)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {(question.type === 'fill_blank' || question.type === 'true_false_not_given') && (
                  <div>
                    {question.type === 'true_false_not_given' ? (
                      <div className="space-y-2">
                        {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerSelect(question.id, option)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type your answer here..."
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0 || loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[48px]"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Submit Test</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}