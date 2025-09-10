import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/journal');
    } catch {
      // Error is handled by AuthContext, so we can ignore the error parameter
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Welcome Back</h1>
          <p className={styles.loginSubtitle}>Sign in to your MindJournal account</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                className={styles.formInput}
                placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={isLoading}
            className={styles.loginButton}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.signupLink}>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className={styles.guestSection}>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Try the app without an account - use our mood tracker anonymously!
            </p>
            <Link
              to="/mood"
              className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;