import { Heart, Shield, Users, Brain, BookOpen, BarChart3 } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 mb-12">
          <h1 className="text-5xl font-bold mb-6">About MindJournal</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your compassionate digital companion for mental wellness. We're here to support your journey 
            toward better mental health through journaling, mood tracking, and AI-powered guidance.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose MindJournal?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 rounded-2xl mb-16">
        <div className="text-center mb-12">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Purpose</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're dedicated to creating tools that make mental health support accessible, 
            affordable, and stigma-free for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {member.name}
              </h3>
              <p className="text-blue-600 font-medium mb-4">
                {member.role}
              </p>
              <p className="text-gray-600">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Compassion</h3>
            <p className="text-gray-600">
              We approach mental health with empathy, understanding, and without judgment.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacy</h3>
            <p className="text-gray-600">
              Your data is sacred. We protect it with industry-standard security measures.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Accessibility</h3>
            <p className="text-gray-600">
              Mental health tools should be available to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-yellow-50 rounded-2xl mb-8">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Important Notice</h2>
          <p className="text-yellow-700 mb-4">
            MindJournal is designed to support your mental wellness journey, but it is not a substitute 
            for professional medical advice, diagnosis, or treatment.
          </p>
          <p className="text-yellow-700 font-semibold">
            If you're experiencing a mental health emergency, please contact emergency services 
            or a qualified mental health professional immediately.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of users who are taking proactive steps toward better mental health.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Get Started
          </a>
          <a
            href="/"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;