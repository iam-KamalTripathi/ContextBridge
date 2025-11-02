import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "support@careercompass.ai",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      details: "San Francisco, CA",
      description: "Visit us at our headquarters"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-dark-800 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto">
            Have questions about your career path? We're here to help you discover your potential.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="card p-8"
          >
            <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Tell us about your career questions or how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-dark-800 dark:text-white mb-6">
                Contact Information
              </h2>
              <p className="text-lg text-dark-600 dark:text-dark-300 mb-8">
                We're here to help you navigate your career journey. Reach out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="text-primary-600 dark:text-primary-400 mr-4 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                        {info.title}
                      </h3>
                      <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-1">
                        {info.details}
                      </p>
                      <p className="text-dark-600 dark:text-dark-300">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-1">
                    How accurate are the career recommendations?
                  </h4>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Our recommendations are based on established psychological theories and AI analysis, with 85%+ accuracy rates.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-1">
                    Is my data secure and private?
                  </h4>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Yes, we use enterprise-grade security and never share your personal information.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-1">
                    Can I retake the assessment?
                  </h4>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Absolutely! You can retake the quiz anytime to see how your interests may have evolved.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="card p-8 max-w-2xl mx-auto">
            <CheckCircle className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark-800 dark:text-white mb-4">
              We're Here to Help
            </h3>
            <p className="text-lg text-dark-600 dark:text-dark-300">
              Our team of career experts and AI specialists are committed to helping you find your ideal career path. 
              We typically respond within 24 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
