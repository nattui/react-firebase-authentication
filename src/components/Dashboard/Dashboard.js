import { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase.config';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);
  if (isAuthenticated === false) return <Redirect to='/' />

  async function signOut() {
    await auth.signOut();
    setAuthentication(false);
    toast.success('You have successfully sign out.');
  }

  return (
    <section className={styles.base}>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Congratulations!</h1>
        <button onClick={signOut}>Log out</button>
      </div>
    </section>
  );
}
