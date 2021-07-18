import { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase.config';
import styles from './Forms.module.scss';

export default function Login() {
  const setAuthentication = useContext(AuthContext)[1];
  const [isButtonDisabled, setButtonState] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  async function login(event) {
    event.preventDefault();
    setButtonState(true);

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      setAuthentication(true);
      toast.success('You have successfully login.');
    } catch (error) {
      let message = '';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'There is no account associated with this email address.';
          break;
        case 'auth/wrong-password':
          message = 'Wrong password. Try again.';
          break;
        default:
          message = error.message;
      }
      toast.error(message);
    }
    setButtonState(false);
  }

  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2>Sign in</h2>
          <form onSubmit={login}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              autoCapitalize="off"
              autoComplete="email"
              spellCheck="false"
              required
              ref={emailRef}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              ref={passwordRef}
            />
            <button disabled={isButtonDisabled}>Login</button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </section>
  );
}
