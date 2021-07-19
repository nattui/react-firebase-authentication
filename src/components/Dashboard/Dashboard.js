import { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const isAuthenticated = useContext(AuthContext)[0];
  if (isAuthenticated === false) return <Redirect to='/' />

  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Congratulations!</h1>
      </div>
    </section>
  );
}
