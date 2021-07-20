import { useContext, useState, useRef } from 'react';
import { Redirect, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase';
import styles from './Auth.module.scss';

export default function Signup() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);
  const [isButtonDisabled, setButtonState] = useState(false);
  const nameRef = useRef('');
  const emailRef = useRef('');
  const passwordRef = useRef('');

  async function signup(event) {
    event.preventDefault();
    setButtonState(true);

    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      user.updateProfile({ displayName: name });
      await auth.signInWithEmailAndPassword(email, password); // Force auth.currentUser to update
      setAuthentication(true);
      toast.success('Your account has been successfully created.');
    } catch (error) {
      passwordRef.current.value = '';
      setButtonState(false);
      toast.error(error.message);
    }
  }

  if (isAuthenticated === null) return null;
  if (isAuthenticated === true) return <Redirect to='/' />
  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2>Create Account</h2>
          <form onSubmit={signup}>
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength="32"
              autoComplete="name"
              spellCheck="false"
              autoFocus
              required
              ref={nameRef}
            />
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
