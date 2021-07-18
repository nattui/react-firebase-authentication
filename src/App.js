import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/Header/Header';
const Login = lazy(() => import('./components/forms/Login'));
const Signup = lazy(() => import('./components/forms/Signup'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/'><Login /></Route>
          <Route path='/login'><Login /></Route>
          <Route path='/signup'><Signup /></Route>
          <Route path='*'><Redirect to='/' /></Route>
        </Switch>
      </Router>
    </Suspense>
  );
}
