import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    avgMood: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalEntries: 0,
    moodDistribution: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your mental health overview</p>
      </div>

      <div className={styles.statsGrid}>
        {/* Average Mood Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>😊</div>
          <h3>Average Mood</h3>
          <p className={styles.statValue}>{stats.avgMood.toFixed(1)}/5</p>
        </div>

        {/* Current Streak Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <h3>Current Streak</h3>
          <p className={styles.statValue}>{stats.currentStreak} days</p>
        </div>

        {/* Max Streak Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <h3>Longest Streak</h3>
          <p className={styles.statValue}>{stats.maxStreak} days</p>
        </div>

        {/* Total Entries Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <h3>Total Entries</h3>
          <p className={styles.statValue}>{stats.totalEntries}</p>
        </div>
      </div>

      {/* Streak Visualization */}
      <div className={styles.streakSection}>
        <h2>Your Streaks</h2>
        <div className={styles.streakVisualization}>
          {Array.from({ length: Math.max(stats.maxStreak, 7) }, (_, i) => (
            <div
              key={i}
              className={`${styles.streakDay} ${
                i < stats.currentStreak ? styles.active : styles.inactive
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Mood Distribution */}
      <div className={styles.moodDistribution}>
        <h2>Mood Distribution</h2>
        <div className={styles.moodBars}>
          {Object.entries(stats.moodDistribution).map(([mood, count]) => (
            <div key={mood} className={styles.moodBar}>
              <span className={styles.moodLabel}>{mood}</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(count / stats.totalEntries) * 100}%`,
                    backgroundColor: getMoodColor(mood)
                  }}
                ></div>
              </div>
              <span className={styles.moodCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getMoodColor = (mood) => {
  const colors = {
    'Very Happy': '#4CAF50',
    'Happy': '#8BC34A',
    'Neutral': '#FFC107',
    'Sad': '#FF9800',
    'Very Sad': '#F44336'
  };
  return colors[mood] || '#9E9E9E';
};

export default Dashboard;