import { useContext, useState, useRef } from 'react';
import { Redirect, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase.config';
import styles from './Auth.module.scss';

export default function Signup() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);
  const [isButtonDisabled, setButtonState] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  if (isAuthenticated === true) return <Redirect to='/' />

  async function signup(event) {
    event.preventDefault();
    setButtonState(true);

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setAuthentication(true);
      toast.success('Your account has been successfully created.');
    } catch (error) {
      passwordRef.current.value = '';
      setButtonState(false);
      toast.error(error.message);
    }
  }

  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2>Create Account</h2>
          <form onSubmit={signup}>
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
              placeholder="6+ characters"
              minLength="6"
              maxLength="100"
              autoComplete="new-password"
              required
              ref={passwordRef}
            />
            <button disabled={isButtonDisabled}>Create Account</button>
          </form>
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </section>
  );
}
