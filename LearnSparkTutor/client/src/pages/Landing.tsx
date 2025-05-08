import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: 'AI-Powered Tutoring',
      description: 'Get personalized help with our AI tutor that adapts to your learning style and needs.',
      icon: 'fa-robot',
      color: 'bg-blue-600'
    },
    {
      title: 'Smart Flashcards',
      description: 'Create and study flashcards that adjust to your mastery level for efficient learning.',
      icon: 'fa-layer-group',
      color: 'bg-violet-600'
    },
    {
      title: 'Adaptive Quizzes',
      description: 'Test your knowledge with quizzes that adapt to your skill level and help identify weak areas.',
      icon: 'fa-question-circle',
      color: 'bg-emerald-600'
    },
    {
      title: 'Document Analysis',
      description: 'Upload study materials and get AI-generated summaries, flashcards, and quizzes.',
      icon: 'fa-file-alt',
      color: 'bg-amber-600'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="py-4 px-6 flex justify-between items-center backdrop-blur-md bg-slate-900/80 sticky top-0 z-50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-3">
            <i className="fas fa-bolt text-xl"></i>
          </div>
          <span className="text-xl font-bold">SparkTutor</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-primary/20">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" className="text-white">
            <i className="fas fa-bars"></i>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="py-20 md:py-32 px-6 max-w-7xl mx-auto text-center"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div variants={item}>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500 mb-6">
            Learn Smarter with AI-Powered Education
          </h1>
        </motion.div>
        <motion.div variants={item}>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            SparkTutor combines AI technology with proven learning methods to help you master new skills more efficiently than ever before.
          </p>
        </motion.div>
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 shadow-lg shadow-primary/20">
              Get Started <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
              <i className="fas fa-play mr-2"></i> See How It Works
            </Button>
          </a>
        </motion.div>
        <motion.div
          variants={item}
          className="relative mx-auto w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl bg-slate-800 aspect-video"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors">
                <i className="fas fa-play text-white text-2xl"></i>
              </div>
              <p className="text-white/80 text-lg">Watch our demo</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Learning</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Our platform combines AI technology with proven learning methods to help you learn faster and retain more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'bg-slate-700 shadow-lg scale-105' : 'hover:bg-slate-700/50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start">
                    <div className={`${feature.color} rounded-lg w-12 h-12 flex items-center justify-center shrink-0 mr-4`}>
                      <i className={`fas ${feature.icon} text-white text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-700 rounded-xl p-2 shadow-xl">
              <div className="rounded-lg overflow-hidden aspect-[4/3] bg-slate-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`${features[activeFeature].color} w-20 h-20 rounded-full flex items-center justify-center animate-pulse`}>
                    <i className={`fas ${features[activeFeature].icon} text-white text-2xl`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SparkTutor Works</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Our simple 3-step process helps you learn effectively with personalized guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Sign Up', icon: 'fa-user-plus', description: 'Create your account and tell us what you want to learn.' },
              { title: 'Learn with AI', icon: 'fa-robot', description: 'Our AI tutor adapts to your learning style and helps you understand concepts.' },
              { title: 'Track Progress', icon: 'fa-chart-line', description: 'Monitor your improvement and identify areas that need more focus.' }
            ].map((step, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className={`fas ${step.icon} text-primary text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-lg text-slate-300 mb-10">
            Join thousands of students using SparkTutor to achieve their learning goals faster and more effectively.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-lg shadow-primary/20">
              Get Started for Free <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white mr-3">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="font-bold">SparkTutor</span>
            </div>
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} SparkTutor. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;