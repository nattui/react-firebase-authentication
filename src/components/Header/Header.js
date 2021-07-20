import { useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase';
import styles from './Header.module.scss';

export default function Header() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);

  async function signOut() {
    await auth.signOut();
    setAuthentication(false);
    toast.success('You have successfully sign out.');
  }

  // Conditionally render buttons based on authentication state
  function renderButtons() {
    if (isAuthenticated === false) {
      return (
        <nav className={styles.links}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up <span>for free</span></Link>
        </nav>
      );
    } else if (isAuthenticated === true) {
      return (
        <nav className={styles.links}>
          <button onClick={signOut}>Logout</button>
        </nav>
      );
    } else {
      return null;
    }
  }

  return (
    <header className={styles.base}>
      <div className={styles.wrapper}>
        <Link className={styles.logo} to="/">
          <span>Authentication</span>
          <span>Example</span>
        </Link>
        {renderButtons()}
      </div>
    </header>
  );
}
