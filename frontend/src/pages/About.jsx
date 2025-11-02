import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Users, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';

const About = () => {
  const missionPoints = [
    "Combining psychological science with AI technology",
    "Providing personalized career guidance for everyone",
    "Making career discovery accessible and accurate",
    "Supporting lifelong career development"
  ];

  const values = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Scientific Approach",
      description: "Based on established psychological theories like RIASEC (Holland Code) to ensure accuracy and reliability."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Results",
      description: "Every recommendation is tailored to your unique personality, interests, and goals."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Inclusive Design",
      description: "Designed to serve people from all backgrounds and career stages."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Continuous Learning",
      description: "Our AI learns and improves to provide better guidance over time."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Psychologist",
      description: "Expert in career psychology with 15+ years of experience"
    },
    {
      name: "Alex Chen",
      role: "AI Research Lead",
      description: "Specialist in machine learning and career recommendation systems"
    },
    {
      name: "Maria Rodriguez",
      role: "User Experience Director",
      description: "Focused on making career guidance accessible to everyone"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-dark-800 dark:text-white mb-6">
            About NextStep
          </h1>
          <p className="text-xl md:text-2xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto">
            We're revolutionizing career guidance by combining psychological science with cutting-edge AI technology
          </p>
        </motion.div>

        {/* Mission Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 dark:text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 text-center max-w-3xl mx-auto">
              To democratize career guidance by making scientifically-backed, personalized career advice accessible to everyone, regardless of their background or economic status.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                  <span className="text-dark-700 dark:text-dark-300">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              Our three-step process combines psychology and AI for accurate career guidance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                Take the Quiz
              </h3>
              <p className="text-dark-600 dark:text-dark-300">
                Complete our scientifically-backed RIASEC assessment to understand your personality type and interests.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                Chat with AI Coach
              </h3>
              <p className="text-dark-600 dark:text-dark-300">
                Get personalized guidance and ask questions about your career options with our AI-powered coach.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                View Your Report
              </h3>
              <p className="text-dark-600 dark:text-dark-300">
                Receive detailed career recommendations with match percentages, required skills, and growth outlook.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
              Experts in psychology, AI, and user experience working together
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-dark-600 dark:text-dark-300">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="card p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 dark:text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of people who have discovered their ideal career path with NextStep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/quiz" className="btn-primary inline-flex items-center">
                Start Your Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a href="/contact" className="btn-secondary inline-flex items-center">
                Contact Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
