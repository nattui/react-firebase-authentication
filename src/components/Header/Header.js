import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.base}>
      <div className={styles.wrapper}>
        <Link className={styles.logo} to="/">
          <span>Authentication</span>
          <span>Example</span>
        </Link>
        <nav className={styles.links}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up <span>for free</span></Link>
        </nav>
      </div>
    </header>
  );
}
