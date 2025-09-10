import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/journal');
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <h1 className={styles.registerTitle}>Create Account</h1>
          <p className={styles.registerSubtitle}>Join MindJournal today</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                className={styles.formInput}
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address
            </label>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.formInput}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className={styles.formInput}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className={styles.formInput}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.passwordToggle}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.registerButton}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.loginLink}>
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className={styles.privacySection}>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Your data is secure and private. We never share your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;