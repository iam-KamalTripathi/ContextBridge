import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  CheckCircle, 
  RotateCcw,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const Quiz = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textResponse, setTextResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchQuestions();
  }, [isAuthenticated, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/quiz');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/submit-quiz', {
        answers,
        text_response: textResponse
      });

      // Store results in localStorage for results page
      localStorage.setItem('quizResults', JSON.stringify(response.data));
      navigate('/results');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-dark-600 dark:text-dark-300">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
            No Questions Available
          </h2>
          <p className="text-dark-600 dark:text-dark-300 mb-4">
            We're having trouble loading the quiz questions.
          </p>
          <button
            onClick={fetchQuestions}
            className="btn-primary inline-flex items-center"
          >
            <RotateCcw className="mr-2 w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark-800 dark:text-white mb-4">
            Career Assessment
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-300">
            Discover your ideal career path with our scientifically-backed RIASEC assessment
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="card p-8 mb-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-white mb-4">
              {currentQ.question}
            </h2>
            <p className="text-dark-600 dark:text-dark-300">
              Rate how much this statement applies to you
            </p>
          </div>

          {/* Rating Scale */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label
                key={rating}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  answers[currentQ.id] === rating
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={rating}
                  checked={answers[currentQ.id] === rating}
                  onChange={() => handleAnswerChange(currentQ.id, rating)}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-dark-800 dark:text-white mr-3">
                        {rating}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full mr-2 ${
                                i < rating
                                  ? 'bg-primary-500'
                                  : 'bg-gray-300 dark:bg-dark-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-dark-600 dark:text-dark-300">
                      {rating === 1 && 'Strongly Disagree'}
                      {rating === 2 && 'Disagree'}
                      {rating === 3 && 'Neutral'}
                      {rating === 4 && 'Agree'}
                      {rating === 5 && 'Strongly Agree'}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-dark-600 dark:text-dark-300">
              {answeredQuestions} of {questions.length} answered
            </span>
            {answeredQuestions === questions.length && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || answeredQuestions < questions.length}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quiz
                  <Send className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* Additional Description Section (on last question) */}
        {currentQuestion === questions.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-4">
                Tell us more about yourself (Optional)
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Share any additional information about your interests, goals, or experiences that might help us provide better career recommendations.
              </p>
              <textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Describe your career interests, goals, or any relevant experience..."
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
