import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { journalAPI } from '../utils/api';
import styles from './Journal.module.css';

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });
  
  const { user } = useAuth();

  const moods = [
    { value: 'happy', label: '😊 Happy', color: 'text-yellow-600' },
    { value: 'sad', label: '😢 Sad', color: 'text-blue-600' },
    { value: 'anxious', label: '😰 Anxious', color: 'text-red-600' },
    { value: 'excited', label: '🎉 Excited', color: 'text-orange-600' },
    { value: 'angry', label: '😠 Angry', color: 'text-red-700' },
    { value: 'tired', label: '😴 Tired', color: 'text-gray-600' },
    { value: 'calm', label: '😌 Calm', color: 'text-green-600' },
    { value: 'stressed', label: '😫 Stressed', color: 'text-red-800' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-500' }
  ];

  useEffect(() => {
    if (user) {
      fetchJournals();
    }
  }, [user]);

  const fetchJournals = async () => {
    try {
      const data = await journalAPI.getAll();
      setJournals(data.journals || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingJournal) {
        await journalAPI.update(editingJournal._id, formData);
      } else {
        await journalAPI.create(formData);
      }
      
      setFormData({ title: '', content: '', mood: 'neutral' });
      setShowForm(false);
      setEditingJournal(null);
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (journal) => {
    setFormData({
      title: journal.title,
      content: journal.content,
      mood: journal.mood
    });
    setEditingJournal(journal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await journalAPI.delete(id);
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Journal</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your personal journal and start writing about your thoughts and feelings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.journalContainer}>
      <div className={styles.journalHeader}>
        <h1 className={styles.journalTitle}>My Journal</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.newEntryBtn}
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {showForm && (
        <div className={styles.journalForm}>
          <h2 className={styles.formTitle}>
            {editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h2>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.formInput}
                placeholder="How are you feeling today?"
                required
              />
            </div>

            <div>
              <label className={styles.formLabel}>
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className={`${styles.formInput} ${styles.formSelect}`}
              >
                {moods.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={styles.formLabel}>
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder="Write about your thoughts, feelings, and experiences..."
                required
              />
            </div>

            <div className={styles.formButtons}>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.saveBtn}
              >
                {isLoading ? 'Saving...' : (editingJournal ? 'Update' : 'Save')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingJournal(null);
                  setFormData({ title: '', content: '', mood: 'neutral' });
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.journalEntries}>
        {journals.length === 0 ? (
          <div className={styles.emptyState}>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No journal entries yet</h3>
            <p className="text-gray-600">Start writing your first journal entry to begin your mental health journey.</p>
          </div>
        ) : (
          journals.map((journal) => {
            const mood = moods.find(m => m.value === journal.mood);
            return (
              <div key={journal._id} className={styles.journalCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.entryTitle}>{journal.title}</h3>
                    <p className={styles.entryDate}>{formatDate(journal.createdAt)}</p>
                  </div>
                  {mood && (
                    <span className={`${styles.moodBadge} ${styles[mood.value]}`}>
                      {mood.label}
                    </span>
                  )}
                </div>
                
                <p className={styles.entryContent}>{journal.content}</p>
                
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEdit(journal)}
                    className={styles.editBtn}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(journal._id)}
                    className={styles.deleteBtn}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Journal;