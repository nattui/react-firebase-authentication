import { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import confetti from 'canvas-confetti';
import AuthContext from '../../contexts/AuthContext';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const isAuthenticated = useContext(AuthContext)[0];

  useEffect(() => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }, [])

  if (isAuthenticated === false) return <Redirect to='/' />
  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Congratulations!</h1>
      </div>
    </section>
  );
}
