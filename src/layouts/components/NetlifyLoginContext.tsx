import { User } from "netlify-identity-widget";
import React from "react";

interface NetlifyLoginContextType {
  currentUser: User | null;
  setCurrentUser?: (user: User | null) => void;
}

const NetlifyLoginContext = React.createContext<NetlifyLoginContextType>({
  currentUser: null,
});
export default NetlifyLoginContext;
