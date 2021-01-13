import React, { useEffect, useState } from "react";
import netlifyIdentity, { User } from "netlify-identity-widget";
import { Avatar, Box, Button } from "@material-ui/core";

function NetlifyLogin(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    netlifyIdentity.on("init", (currentUser) => setUser(currentUser));
    netlifyIdentity.on("login", (currentUser) => setUser(currentUser));
    netlifyIdentity.on("logout", () => setUser(null));
  });

  return (
    <Box display="flex">
      {user ? (
        <>
          {user.user_metadata.avatar_url ? (
            <Avatar alt="" src={user.user_metadata.avatar_url} />
          ) : (
            <Avatar>{user.user_metadata.full_name.charAt(0)}</Avatar>
          )}
          <Button onClick={() => netlifyIdentity.logout()}>Log out</Button>
        </>
      ) : (
        <>
          <Button onClick={() => netlifyIdentity.open("login")}>Log in</Button>
          <Button onClick={() => netlifyIdentity.open("signup")}>
            Create account
          </Button>
        </>
      )}
    </Box>
  );
}
export default NetlifyLogin;
