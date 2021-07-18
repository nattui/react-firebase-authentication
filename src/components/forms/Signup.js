import { Link } from 'react-router-dom';
import styles from './Forms.module.scss';

export default function Signup() {
  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2>Create Account</h2>
          <form>
            <label htmlFor="login">Email address</label>
            <input
              type="text"
              id="login"
              name="login"
              autoCapitalize="off"
              autoComplete="username"
              spellCheck="false"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
            />
            <button>Create Account</button>
          </form>
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </section>
  );
}
