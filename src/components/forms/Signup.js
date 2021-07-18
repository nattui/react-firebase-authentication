/* eslint-disable no-unused-vars */
import { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase.config';
import styles from './Forms.module.scss';

export default function Signup() {
  const setAuthentication = useContext(AuthContext)[1];
  const emailRef = useRef();
  const passwordRef = useRef();

  async function signup(event) {
    event.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      // State global user data
      setAuthentication(true);
      toast.success('Login successful.');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2>Create Account</h2>
          <form onSubmit={signup}>
            <label htmlFor="login">Email address</label>
            <input
              type="text"
              id="login"
              name="login"
              autoCapitalize="off"
              autoComplete="username"
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
            <button>Create Account</button>
          </form>
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </section>
  );
}
