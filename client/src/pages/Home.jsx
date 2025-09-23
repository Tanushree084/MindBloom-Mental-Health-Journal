import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, BarChart3, MessageSquare, Brain } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Daily Journal',
      description: 'Write about your thoughts and feelings in a private, secure space.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns and identify trends over time.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Support',
      description: 'Get empathetic responses and guidance from our AI assistant.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Brain,
      title: 'Mental Wellness',
      description: 'Discover personalized activities and resources for self-care.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Welcome to <span className="text-blue-600">MindBloom</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Your personal mental health companion. Track your mood, journal your thoughts, 
          and receive AI-powered support on your wellness journey.
        </p>
        
        {user ? (
          <div className="space-y-4">
            <p className={styles.welcomeText}>
              Welcome back, <span className="font-semibold text-blue-600">{user.username}</span>!
            </p>
            <div className="flex justify-center space-x-4">
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className={styles.welcomeText}>
              Start your mental wellness journey today. It's free and anonymous to try.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className={styles.primaryButton}
              >
              </Link>
              <Link
                to="/about"
                className={styles.secondaryButton}
              >
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>
          How MindBloom Helps You ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles[feature.bgColor]}`}>
                <feature.icon className={styles.featureIconSvg} />
              </div>
              <h3 className={styles.featureTitle}>
                {feature.title}
              </h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="text-center py-16 bg-gray-50 rounded-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their mental health 
            with our simple, effective tools.
          </p>
          <Link
            to="/register"
            className={styles.primaryButton}
          >
            Create Your Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;