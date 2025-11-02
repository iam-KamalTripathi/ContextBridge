import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  MessageCircle, 
  ArrowRight,
  BarChart3,
  Star,
  CheckCircle,
  Lightbulb,
  Users,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Results = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get results from localStorage
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // If no results, redirect to quiz
      navigate('/quiz');
    }
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getMatchBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (percentage >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-orange-100 dark:bg-orange-900/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
            No Results Found
          </h2>
          <p className="text-dark-600 dark:text-dark-300 mb-4">
            Please complete the quiz to see your results.
          </p>
          <Link to="/quiz" className="btn-primary">
            Take Quiz
          </Link>
        </div>
      </div>
    );
  }

  const { riasec_scores, recommendations } = results;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark-800 dark:text-white mb-4">
            Your Career Assessment Results
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto">
            Based on your responses, here are the career paths that best match your personality and interests.
          </p>
        </motion.div>

        {/* RIASEC Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6 text-center">
            Your Personality Profile
          </h2>
          <div className="card p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(riasec_scores).map(([category, score]) => (
                <div key={category} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {score}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-dark-800 dark:text-white mb-1">
                    {category}
                  </h3>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Career Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6 text-center">
            Your Top Career Matches
          </h2>
          <div className="space-y-6">
            {recommendations?.map((career, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                className="card p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
                      <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
                        {career.title}
                      </h3>
                      <p className="text-dark-600 dark:text-dark-300">
                        {career.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${getMatchBgColor(career.match_percentage)}`}>
                      <Star className={`w-5 h-5 mr-2 ${getMatchColor(career.match_percentage)}`} />
                      <span className={`font-bold ${getMatchColor(career.match_percentage)}`}>
                        {career.match_percentage}% Match
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-dark-800 dark:text-white mb-3">
                      Why This Career Fits You
                    </h4>
                    <p className="text-dark-600 dark:text-dark-300 mb-4">
                      {career.why_fits || 'This career aligns well with your personality traits and interests.'}
                    </p>
                    
                    <h4 className="text-lg font-semibold text-dark-800 dark:text-white mb-3">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.skills?.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-dark-800 dark:text-white mb-3">
                      Growth Outlook
                    </h4>
                    <p className="text-dark-600 dark:text-dark-300 mb-4">
                      {career.growth_outlook || 'This field shows strong growth potential and career advancement opportunities.'}
                    </p>
                    
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      <span className="font-medium">Growing Field</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6 text-center">
            What's Next?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <MessageCircle className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                Chat with AI Coach
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Get personalized guidance and ask questions about your recommended careers.
              </p>
              <Link to="/chatbot" className="btn-primary w-full">
                Start Conversation
              </Link>
            </div>

            <div className="card p-6 text-center">
              <BookOpen className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                Learn More
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Explore detailed information about your recommended career paths.
              </p>
              <Link to="/#resources" className="btn-secondary w-full">
                Explore Resources
              </Link>
            </div>

            <div className="card p-6 text-center">
              <BarChart3 className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                Track Progress
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Monitor your career development and set goals for the future.
              </p>
              <Link to="/dashboard" className="btn-secondary w-full">
                View Dashboard
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-dark-800 dark:text-white mb-4">
              Ready to Take Action?
            </h3>
            <p className="text-lg text-dark-600 dark:text-dark-300 mb-6 max-w-2xl mx-auto">
              Your career journey starts now. Take the next step towards your ideal career path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chatbot" className="btn-primary inline-flex items-center">
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat with AI Coach
              </Link>
              <Link to="/dashboard" className="btn-secondary inline-flex items-center">
                <ArrowRight className="mr-2 w-5 h-5" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
