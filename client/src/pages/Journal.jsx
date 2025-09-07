import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { journalAPI } from '../utils/api';

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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Journal</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How are you feeling today?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {moods.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write about your thoughts, feelings, and experiences..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {journals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No journal entries yet</h3>
            <p className="text-gray-600">Start writing your first journal entry to begin your mental health journey.</p>
          </div>
        ) : (
          journals.map((journal) => {
            const mood = moods.find(m => m.value === journal.mood);
            return (
              <div key={journal._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{journal.title}</h3>
                    <p className="text-sm text-gray-500">{formatDate(journal.createdAt)}</p>
                  </div>
                  {mood && (
                    <span className={`text-sm font-medium ${mood.color}`}>
                      {mood.label}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{journal.content}</p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(journal)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(journal._id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
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