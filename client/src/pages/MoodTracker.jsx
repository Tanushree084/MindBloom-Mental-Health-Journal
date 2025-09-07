import { useState, useEffect } from 'react';
import { BarChart3, Plus, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { moodAPI } from '../utils/api';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [stats, setStats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [formData, setFormData] = useState({
    moodType: 'happy',
    intensity: 5,
    note: '',
    tags: []
  });
  
  const { user } = useAuth();

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
    { value: 'anxious', label: '😰 Anxious', color: 'bg-red-100 text-red-800' },
    { value: 'excited', label: '🎉 Excited', color: 'bg-orange-100 text-orange-800' },
    { value: 'angry', label: '😠 Angry', color: 'bg-red-200 text-red-900' },
    { value: 'tired', label: '😴 Tired', color: 'bg-gray-100 text-gray-800' },
    { value: 'calm', label: '😌 Calm', color: 'bg-green-100 text-green-800' },
    { value: 'stressed', label: '😫 Stressed', color: 'bg-red-300 text-red-950' }
  ];

  useEffect(() => {
    if (user) {
      fetchMoods();
      fetchStats();
    }
  }, [user, selectedPeriod]);

  const fetchMoods = async () => {
    try {
      const data = await moodAPI.getAll(selectedPeriod);
      setMoods(data || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await moodAPI.getStats(selectedPeriod);
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await moodAPI.create(formData);
      setFormData({ moodType: 'happy', intensity: 5, note: '', tags: [] });
      setShowForm(false);
      fetchMoods();
      fetchStats();
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodInfo = (moodType) => {
    return moodOptions.find(m => m.value === moodType) || moodOptions[0];
  };

  // Function to render intensity as stars
  const renderIntensity = (intensity) => {
    return '⭐'.repeat(intensity) + '☆'.repeat(10 - intensity);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mood Tracker</h2>
          <p className="text-gray-600 mb-6">
            Track your emotions and identify patterns. You can use this feature anonymously without an account!
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Try it out now:</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log Your Mood
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">How are you feeling?</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <select
                  value={formData.moodType}
                  onChange={(e) => setFormData({ ...formData, moodType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {moodOptions.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensity (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {renderIntensity(formData.intensity)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's influencing your mood today?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Mood Entry
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mood Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Log Mood</span>
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Viewing Period</h2>
        </div>
        <div className="flex space-x-4">
          {['week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <select
                value={formData.moodType}
                onChange={(e) => setFormData({ ...formData, moodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {moodOptions.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity (1-10): {formData.intensity}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {renderIntensity(formData.intensity)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's influencing your mood today?"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Mood
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics */}
      {stats.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mood Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const moodInfo = getMoodInfo(stat._id);
              return (
                <div key={stat._id} className={`p-4 rounded-lg ${moodInfo.color}`}>
                  <div className="text-2xl font-bold">{stat.count} entries</div>
                  <div className="text-lg">{moodInfo.label}</div>
                  <div className="text-sm">Avg intensity: {stat.avgIntensity?.toFixed(1) || 'N/A'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mood History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Mood History</h2>
        {moods.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No mood entries yet. Start tracking your mood to see your patterns!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moods.map((mood) => {
              const moodInfo = getMoodInfo(mood.moodType);
              return (
                <div key={mood._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${moodInfo.color}`}>
                      {moodInfo.label}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(mood.createdAt)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Intensity: </span>
                    {renderIntensity(mood.intensity)}
                  </div>
                  {mood.note && (
                    <p className="text-gray-700 text-sm">{mood.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;