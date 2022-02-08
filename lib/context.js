// Firebase by default does not support custom usernames so we provide a User Context.
import { createContext } from 'react';
export const UserContext = createContext({ user: null, username: null });
