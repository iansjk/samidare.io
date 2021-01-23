import React, { useContext, useEffect } from "react";
import netlifyIdentity from "netlify-identity-widget";
import {
  Avatar,
  Box,
  Button,
  makeStyles,
  Typography,
  NoSsr,
} from "@material-ui/core";
import NetlifyLoginContext from "./NetlifyLoginContext";

const useStyles = makeStyles((theme) => ({
  loginWrapper: {
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
  logoutButton: {
    marginLeft: theme.spacing(1),
    paddingTop: "7px",
  },
}));

function NetlifyLogin(): React.ReactElement {
  const classes = useStyles();
  const { currentUser, setCurrentUser } = useContext(NetlifyLoginContext);

  useEffect(() => {
    if (setCurrentUser) {
      netlifyIdentity.on("init", (user) => setCurrentUser(user));
      netlifyIdentity.on("login", async (user) => {
        await netlifyIdentity.refresh();
        setCurrentUser(user);
      });
      netlifyIdentity.on("logout", () => setCurrentUser(null));
    }
  }, [setCurrentUser]);

  return (
    <NoSsr>
      <div className={classes.loginWrapper}>
        {currentUser ? (
          <>
            {currentUser.user_metadata.avatar_url ? (
              <Avatar alt="" src={currentUser.user_metadata.avatar_url} />
            ) : (
              <Avatar>{currentUser.user_metadata.full_name.charAt(0)}</Avatar>
            )}
            <Typography variant="h6">
              {currentUser.user_metadata.full_name}
            </Typography>
            <Button
              className={classes.logoutButton}
              onClick={() => netlifyIdentity.logout()}
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => netlifyIdentity.open("login")}>
              Log in
            </Button>
            <Box clone ml={1}>
              <Button onClick={() => netlifyIdentity.open("signup")}>
                Register
              </Button>
            </Box>
          </>
        )}
      </div>
    </NoSsr>
  );
}
export default NetlifyLogin;
