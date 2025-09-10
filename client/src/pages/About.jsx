import { Heart, Shield, Users, Brain, BookOpen, BarChart3 } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Private Journaling',
      description: 'Write freely in your personal digital journal. Your thoughts are encrypted and only accessible to you.'
    },
    {
      icon: BarChart3,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns over time with visual charts and insights to better understand yourself.'
    },
    {
      icon: Brain,
      title: 'AI Support',
      description: 'Get empathetic responses and guidance from our AI assistant when you need someone to talk to.'
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'Your data is yours alone. We never share your personal information with third parties.'
    }
  ];

  const team = [
    {
      name: 'Our Mission',
      role: 'Making mental health support accessible',
      description: 'We believe everyone deserves access to mental health tools and support, regardless of their circumstances.'
    },
    {
      name: 'Our Vision',
      role: 'A world where mental wellness is prioritized',
      description: 'We aim to reduce the stigma around mental health and make self-care tools available to all.'
    }
  ];

  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About MindBloom</h1>
          <p className={styles.heroSubtitle}>
            Your compassionate digital companion for mental wellness. We're here to support your journey 
            toward better mental health through journaling, mood tracking, and AI-powered guidance.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>
          Why Choose MindBloom?
        </h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
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

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.missionHeader}>
          <Users className={styles.missionIcon} />
          <h2 className={styles.missionTitle}>Our Purpose</h2>
          <p className={styles.missionText}>
            We're dedicated to creating tools that make mental health support accessible, 
            affordable, and stigma-free for everyone.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} className={styles.teamCard}>
              <h3 className={styles.teamName}>
                {member.name}
              </h3>
              <p className={styles.teamRole}>
                {member.role}
              </p>
              <p className={styles.teamDescription}>
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>
          Our Values
        </h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={`${styles.valueIcon} ${styles.compassion}`}>
              <Heart className={styles.valueIconSvg} />
            </div>
            <h3 className={styles.valueTitle}>Compassion</h3>
            <p className={styles.featureDescription}>
              We approach mental health with empathy, understanding, and without judgment.
            </p>
          </div>

          <div className={styles.valueCard}>
            <div className={`${styles.valueIcon} ${styles.privacy}`}>
              <Shield className={styles.valueIconSvg} />
            </div>
            <h3 className={styles.valueTitle}>Privacy</h3>
            <p className={styles.featureDescription}>
              Your data is sacred. We protect it with industry-standard security measures.
            </p>
          </div>

          <div className={styles.valueCard}>
            <div className={`${styles.valueIcon} ${styles.accessibility}`}>
              <Users className={styles.valueIconSvg} />
            </div>
            <h3 className={styles.valueTitle}>Accessibility</h3>
            <p className={styles.featureDescription}>
              Mental health tools should be available to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className={styles.disclaimerSection}>
        <div className={styles.disclaimerContent}>
          <h2 className={styles.disclaimerTitle}>Important Notice</h2>
          <p className={styles.disclaimerText}>
            MindBloom is designed to support your mental wellness journey, but it is not a substitute 
            for professional medical advice, diagnosis, or treatment.
          </p>
          <p className={styles.disclaimerText}>
            <strong>If you're experiencing a mental health emergency, please contact emergency services 
            or a qualified mental health professional immediately.</strong>
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to Start Your Journey?
        </h2>
        <p className={styles.ctaText}>
          Join our community of users who are taking proactive steps toward better mental health.
        </p>
        <div className={styles.ctaButtons}>
          <a
            href="/register"
            className={styles.ctaPrimary}
          >
            Get Started
          </a>
          <a
            href="/"
            className={styles.ctaSecondary}
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;