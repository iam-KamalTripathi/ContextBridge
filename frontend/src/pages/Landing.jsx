import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, MessageCircle, Target, Users, Lightbulb, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Assessment",
      description: "Advanced psychological profiling using RIASEC theory"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Personalized Chat",
      description: "Interactive career coaching with AI guidance"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precise Matching",
      description: "Find careers that truly match your personality"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Take the Quiz",
      description: "Complete our scientifically-backed RIASEC assessment"
    },
    {
      number: "02",
      title: "Chat with AI Coach",
      description: "Get personalized guidance and career insights"
    },
    {
      number: "03",
      title: "Discover Your Path",
      description: "Receive detailed career recommendations and next steps"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-dark-800 dark:text-white mb-6">
              Find Your True
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                {" "}Career Path
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-600 dark:text-dark-300 mb-8 max-w-3xl mx-auto">
              Discover what fits you — scientifically and intelligently with AI-powered career guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz" className="btn-primary inline-flex items-center">
                Start Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/chatbot" className="btn-secondary inline-flex items-center">
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat with Coach
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-800 dark:text-white mb-4">
              Why Choose NextStep?
            </h2>
            <p className="text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              Our platform combines psychological science with cutting-edge AI to provide the most accurate career guidance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-800 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              Three simple steps to discover your ideal career path
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 dark:bg-primary-800 transform translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-800 dark:text-white mb-6">
              Ready to Discover Your Career?
            </h2>
            <p className="text-xl text-dark-600 dark:text-dark-300 mb-8">
              Join thousands of people who have found their perfect career match
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-secondary inline-flex items-center">
                Learn More
                <Lightbulb className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
