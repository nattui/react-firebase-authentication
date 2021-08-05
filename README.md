React is one of the most popular front-end frameworks in building web user interfaces. When creating a web application, you will often need to tell whether a person is logged in or not and then navigate them to the sections you want them to use. Starter projects tend to follow this page paradigm: create account, sign in, and dashboard page. Users cannot see the dashboard page unless they are authenticated. If you need a free, small to medium project solution in user authentication or want to put yourself in the learning authentication headspace, using Firebase Authentication is beneficial.

I’m going to show you how to link React and Firebase Authentication together. The web application will have three pages. I’ll be using React Hooks, React Context, and Firebase Web v8 APIs. At the time of writing, Firebase Web v9 is in beta. I’ll briefly explain React Context in this tutorial as when I was learning Firebase, I didn’t know it well enough to form a good software design pattern. This guide assumes you have some knowledge in React and JavaScript however.

![screens.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626823549373/2yfUvnFcx.png)

- GitHub:  [https://github.com/nattwasm/react-firebase-authentication](https://github.com/nattwasm/react-firebase-authentication)
- Live Demo:  [https://authentication-example.vercel.app/](https://authentication-example.vercel.app/)
- Article: [https://nattwasm.hashnode.dev/react-firebase-authentication](https://nattwasm.hashnode.dev/react-firebase-authentication)


### Folder structure

The file and folders that we’ll take a look at for this guide are:

```
.
└── /src
    ├── /components
    ├── /contexts
    ├── /utils
    └── App.js
```

[components](#components) hold React components. In this app, we have the header, dashboard, and auth forms.

[contexts](#context) hold React contexts. We use it as a form of global variables to check whether the user is authenticated or not. It's one file for this directory.

[utils](#utils) hold the firebase configurations. Another one file for this directory.


### utils

The utils folder in this project would hold a singular `firebase.js` file that contains the Firebase configurations. This folder is an excellent place to put your Firebase helper functions here too.

In the Firebase console, select add web app in the project overview page and get the Firebase configurations.

![firebase.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626824322127/aE672KYe7Y.png)

Install Firebase in your web project with `npm install firebase` and then you should see it in `package.json`. Then, we set our`firebase.js` file like this:

```js
// utils/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: 'bGudRur85ecpvwxfpmYDWymjjGpkcu2BQ2ZCJ84',
  authDomain: 'project-1234.firebaseapp.com',
  projectId: 'project-1234',
  storageBucket: 'project-1234.appspot.com',
  messagingSenderId: '384986944843',
  appId: '1:384986944843:web:rdtvvg6vkb7exja3enezak'
});

export const auth = firebase.auth();
```

We can now use Firebase auth throughout the project.

In the side note, you can add more Firebase services in the future like this:

```js
// utils/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

...

export const auth = firebase.auth();
export const db = firebase.firestore();
```


### contexts

We need a good way to check whether the user is authenticated. You might think it’s a simple boolean state but there is more to it. Firebase abstract away a back-end, but it’s going through Google’s infrastructure to grab and receive data. The time for your device to receive user data is going to be the pending state. Many of their web APIs are JavaScript promises. Your device asks for data or does a function, it is going to time. That time might be really short with modern internet speeds and Google’s infrastructure being fast. The promise can either be resolved and rejected. Knowing this, a good model would have three states: null for pending, true for resolved and logged in, and false for resolved and not signed in. If it is rejected, it’s something off on Firebase’s/Google’s side which should never happen.

When the website with authentication logic loads, one of the first things it asks is am I authenticated. The website needs to know to subsequently perform a series of tasks based on the answer. A simple way of thinking is when you get an answer, you can stay or get redirected to a different place.

This is how we are going to do things for the three page website.
- The website is going to show nothing as the  auth information is pending.
- If authenticated: user can stay in dashboard page but not in create account and login page
- If not authenticated: user can stay in create account and login page but not in dashboard page.

We are going to use a variable called `isAuthenticated` to determine authentication status.

The contexts folder would hold a singular `AuthContext.js` file that contains the authentication context. The initial `createContext` state is `null` as the website is pending data. It’s then going to change to true or false. This auth status information is available throughout the app.

```js
// contexts/AuthContext.js
import { createContext } from 'react';

export default createContext(null);
```

### components

The components folder holds user interfaces and logic. The header component has a login and sign up button when `isAuthenticated` is false. A log out button shows when `isAuthenticated` is true. The auth components are the 'create account' and 'sign in' form section of the page. We are going to use it for sign up and login. The dashboard component acts only as a visual to tell whether user is logged in.


### App.js

The file `App.js` is where routing and important auth logic happens. The snippet of code is how we set up the authentication context and pass them down to the children. The variables `isAuthenticated` and `setAuthentication` array acts like global variables for children components. Everytime `setAuthentication(true)` is called, `isAuthenticated` will be changed to `true` throughout the app.

It took me a while to understand React Context API. When I was first learning Firebase, I thought Firebase would handle user data management and renders for me. Again, Firebase was not initially designed for React. We need to use state management like React Context to handle auth logic and renders.

```js
// App.js
import { useState, useContext } from 'react';
import AuthContext from './contexts/AuthContext';

export default function App() {
  const [isAuthenticated, setAuthentication] = useState(useContext(AuthContext));

  ...

  return (
    <AuthContext.Provider value={[isAuthenticated, setAuthentication]}>

      ...

    </AuthContext.Provider>
  );
}
```

The initial state of the context is `null`. We designed the app so `null` means pending for auth data. So we add in a `useEffect` for component mounting.

There is a bit to unpacked here. The website would run `auth.onAuthStateChanged`. The `onAuthStateChanged` follows the observer pattern. So to make it run well with the React paradigm, we need to `unsubscribe` or terminate the observer after we know the `user` is not null. The line `auth.onAuthStateChanged` runs once. We just need to know the variable `user` exists. That is how we know whether the user is authenticated or not.

```js
// App.js (Did do)
import { useState, useContext, useEffect } from 'react';
import AuthContext from './contexts/AuthContext';

export default function App() {
  const [isAuthenticated, setAuthentication] = useState(useContext(AuthContext));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      user ?
        setAuthentication(true) :
        setAuthentication(false);
      unsubscribe(); // terminate the observer after completion
    });
  }, []);

 ...
```

Why am I the only one to write it in this way? Not `return unsubscribe` so `useEffect` can terminate the observer in cleanup.

That's what I did at first when following other tutorials, but here is why I did it this way. I noticed a double print out when I `console.log('isAuthenticated:', isAuthenticated)` every time the value gets changed. I use print outs and Chrome debugger to debug. The double render annoyed me as I always use the template of Create React App and it comes with `React.StrictMode`. To future proof myself for React incoming concurrent mode feature, I wanted to ensure a deterministic development cycle. I converted the observer pattern to run only once after completion. It follows the React paradigm, and I recommend this method.

```js
// App.js (Didn't do)
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    user ?
      setAuthentication(true) :
      setAuthentication(false);
  });
  return unsubscribe;
}, []);
 ...
```

We need to display a user interface. Here we have a basic route. The header always shows while other parts of the page change based on the path.

```js
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/Header/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';

return (
  <AuthContext.Provider value={[isAuthenticated, setAuthentication]}>
    <Router>
      <Header />
      <Switch>
        <Route exact path='/'><Login /></Route>
        <Route path='/login'><Login /></Route>
        <Route path='/signup'><Signup /></Route>
        <Route path='/dashboard'><Dashboard /></Route>
        <Route path='*'><Redirect to='/' /></Route>
      </Switch>
    </Router>
  </AuthContext.Provider>
);
```

### Auth Components

In order to use the context, we import it in and use it just like we would for `useState`. The only difference is the `isAuthenticated` variable is available throughout the app. The `isAuthenticated` variable has three states: null, false, and true. When the user data is pending, show nothing and wait until it resolves to false or true. If true, show dashboard. If false, show signup. This process of checking whether the user can visit a section of the page is an example of auth protected routes.

```js
// components/Auth/Signup.js
import { Redirect, Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

export default function Signup() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);

  ...

  // When the user data is pending, show nothing
  if (isAuthenticated === null) return null;
  // When the user is authenticated, they shouldn't see the auth pages
  // So redirect them to dashboard page
  if (isAuthenticated === true) return <Redirect to='/dashboard' />
  return (

    ...

  );
}
```

When the form submits, it runs the signup function and grabs the email and password string and pass it along to Firebase Auth's `createUserWithEmailAndPassword(email, password)` which let's Firebase handles user creation. When the user successfully creates an account, `setAuthentication(true)` runs and subsequently `isAuthenticated` will turn true. Now the route logic will redirect the user to the dashboard route where they will see the dashboard screen.

```js
// components/Auth/Signup.js
import { useContext, useRef } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { auth } from '../../utils/firebase';

export default function Signup() {
  const [isAuthenticated, setAuthentication] = useContext(AuthContext);
  const emailRef = useRef('');
  const passwordRef = useRef('');

  async function signup(event) {
    event.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setAuthentication(true);
    } catch (error) {
      passwordRef.current.value = '';
      setButtonState(false);
    }
  }

  if (isAuthenticated === null) return null;
  if (isAuthenticated === true) return <Redirect to='/dashboard' />
  return (
    <form onSubmit={signup}>
      <label htmlFor="email">Email address</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        ref={emailRef}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        ref={passwordRef}
      />
      <button>Create Account</button>
    </form>
  );
}
```

### Conclusion

That concludes this guide. We got to look at a React design pattern, set up Firebase authentication, use React Context, and auth protect routes.

- GitHub:  [https://github.com/nattwasm/react-firebase-authentication](https://github.com/nattwasm/react-firebase-authentication)
- Live Demo:  [https://authentication-example.vercel.app/](https://authentication-example.vercel.app/)
- Article: [https://nattwasm.hashnode.dev/react-firebase-authentication](https://nattwasm.hashnode.dev/react-firebase-authentication)
