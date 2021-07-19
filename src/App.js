import { useState, useContext, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthContext from './contexts/AuthContext';
import { auth } from './utils/firebase.config';
import styles from './App.module.scss';

import Header from './components/Header/Header';
const Login = lazy(() => import('./components/Auth/Login'));
const Signup = lazy(() => import('./components/Auth/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));

export default function App() {
  const [isAuthenticated, setAuthentication] = useState(useContext(AuthContext));
  if (process.env.NODE_ENV === 'development') console.log('isAuthenticated:', isAuthenticated);

  useEffect(() => {
    // Things you should know: auth.onAuthStateChanged follows the observer pattern needs
    // to be unsubscribe on every run. The useEffect hook will check authentication state
    // after rerender. That means everytime the value from AuthContext is updated.
    const unsubscribe = auth.onAuthStateChanged(user => {
      user ?
        setAuthentication(true) :
        setAuthentication(false);
      unsubscribe();
    });
  }, []);

  function renderHome() {
    if (isAuthenticated === false) {
      return <Login />;
    } else if (isAuthenticated === true) {
      return <Dashboard />;
    } else {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={[isAuthenticated, setAuthentication]}>
      <Router>
        <Header />
        <Suspense fallback={null}>
          <Switch>
            <Route exact path='/'>{renderHome()}</Route>
            <Route path='/login'><Login /></Route>
            <Route path='/signup'><Signup /></Route>
            <Route path='/dashboard'><Dashboard /></Route>
            <Route path='*'><Redirect to='/' /></Route>
          </Switch>
        </Suspense>
        <Toaster
          gutter={16}
          position="top-right"
          toastOptions={{ className: styles.toast }}
          containerStyle={{ top: 88 }}
        />
      </Router>
    </AuthContext.Provider>
  );
}
