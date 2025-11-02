import React from 'react';
import { motion } from 'framer-motion';
import { Target, Star, TrendingUp, ArrowRight } from 'lucide-react';

const RecommendationCard = ({ career, index }) => {
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

  return (
    <motion.div
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
  );
};

export default RecommendationCard;
