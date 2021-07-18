import { createContext } from 'react';

// Default state of user.isAuthenticated is null, shows loading as Firebase is getting
// user authentication state and fetches resources from Firestore
export default createContext(null);
