/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase.config';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);
  let deleteUserPending = false;

  async function deleteUser(event) {
    if (!deleteUserPending && event.keyCode === 48) {
      deleteUserPending = true;
      try {
        await auth.currentUser.delete();
        setAuthentication(false);
        toast.success('You have successfully deleted account.');
      } catch (error) {
        toast.error('Account is not deleted.');
      } finally {
        deleteUserPending = false;
      }
    } else if (event.keyCode === 32) {
      // Learning about Firebase user data management
      try {
        auth.currentUser.updateProfile({ displayName: 'James Bond' });
        toast.success('You have successfully changed name.');
      } catch (error) {
        toast.error('Name not updated.');
      }
    }
  }

  useEffect(() => {
    // Debug: press 0 to delete user
    window.addEventListener('keyup', deleteUser);

    // Create confetti effect
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => {
      // Clear confetti effect
      clearInterval(interval);
      confetti.reset();

      // Remove event listener
      window.removeEventListener('keyup', deleteUser);
    };
  }, [isAuthenticated])

  if (isAuthenticated === false) return <Redirect to='/' />
  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Congratulations {auth.currentUser.displayName}!</h1>
      </div>
    </section>
  );
}
