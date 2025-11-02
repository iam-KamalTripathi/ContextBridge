import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  BarChart3,
  BookOpen,
  Users,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserHistory();
  }, [isAuthenticated, navigate]);

  const fetchUserHistory = async () => {
    try {
      const response = await api.get('/user/history');
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load your history');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Take Career Quiz',
      description: 'Discover your ideal career path',
      icon: <Brain className="w-8 h-8" />,
      href: '/quiz',
      color: 'bg-primary-500'
    },
    {
      title: 'Chat with AI Coach',
      description: 'Get personalized career guidance',
      icon: <MessageCircle className="w-8 h-8" />,
      href: '/chatbot',
      color: 'bg-green-500'
    },
    {
      title: 'View Results',
      description: 'See your career recommendations',
      icon: <Target className="w-8 h-8" />,
      href: '/results',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    {
      title: 'Career Matches',
      value: history.length,
      icon: <Target className="w-6 h-6" />,
      color: 'text-primary-600'
    },
    {
      title: 'Quiz Completed',
      value: history.length,
      icon: <Brain className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'AI Conversations',
      value: '12',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: '95%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark-800 dark:text-white mb-4">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-300">
            Ready to continue your career discovery journey?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <div className={`${stat.color} mb-3 flex justify-center`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-dark-800 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-dark-600 dark:text-dark-300 text-sm">
                {stat.title}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`${action.color} text-white p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-300 mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6">
              Your Recent Assessments
            </h2>
            <div className="space-y-4">
              {history.slice(0, 3).map((quiz, index) => (
                <div key={index} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
                        <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dark-800 dark:text-white">
                          Career Assessment #{quiz.id}
                        </h3>
                        <p className="text-dark-600 dark:text-dark-300">
                          Completed on {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-dark-600 dark:text-dark-300">Top Match</p>
                        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {quiz.result?.[0]?.title || 'N/A'}
                        </p>
                      </div>
                      <Link
                        to="/results"
                        className="btn-primary flex items-center"
                      >
                        View Results
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6">
            Learning Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                Career Guide
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Comprehensive guide to career development and job search strategies.
              </p>
              <Link to="/#guide" className="text-primary-600 dark:text-primary-400 font-medium">
                Read More →
              </Link>
            </div>

            <div className="card p-6">
              <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                Industry Reports
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Latest trends and insights across different industries and career paths.
              </p>
              <Link to="/#reports" className="text-primary-600 dark:text-primary-400 font-medium">
                Explore →
              </Link>
            </div>

            <div className="card p-6">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                Success Stories
              </h3>
              <p className="text-dark-600 dark:text-dark-300 mb-4">
                Real stories from people who found their dream careers with our help.
              </p>
              <Link to="/#stories" className="text-primary-600 dark:text-primary-400 font-medium">
                Read Stories →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center"
        >
          <div className="card p-8 md:p-12">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 dark:text-white mb-4">
              Ready to Discover More?
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 max-w-2xl mx-auto">
              Take another assessment or chat with our AI coach to explore new career possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz" className="btn-primary inline-flex items-center">
                Take New Quiz
                <Brain className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/chatbot" className="btn-secondary inline-flex items-center">
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat with Coach
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
