import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' }, 
    { name: 'Journal', href: '/journal' },
    { name: 'Mood Tracker', href: '/mood' },
    { name: 'AI Chat', href: '/chat' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarContent}>
          {/* Logo */}
          <Link to="/" className={styles.navbarBrand}>
            <Brain className={styles.logoIcon} />
            <span className={styles.logoText}>MindBloom</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className={styles.userSection}>
            {user ? (
              <div className={styles.userContainer}>
                <div className={styles.userInfo}>
                  <User className={styles.userIcon} />
                  <span className={styles.username}>{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className={styles.logoutBtn}
                >
                  <LogOut className={styles.logoutIcon} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link
                  to="/login"
                  className={styles.loginBtn}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={styles.signupBtn}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className={styles.mobileMenuButton}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.mobileMenuBtn}
            >
              {isOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={styles.mobileNav}>
            <div className={styles.mobileNavContent}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.mobileNavLinkActive : ''}`}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className={styles.mobileUserSection}>
                  <div className={styles.mobileUserInfo}>
                    <User className={styles.mobileUserIcon} />
                    <span className={styles.mobileUsername}>{user.username}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className={styles.mobileLogoutBtn}
                  >
                    <LogOut className={styles.mobileLogoutIcon} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={styles.mobileLoginBtn}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className={styles.mobileSignupBtn}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;