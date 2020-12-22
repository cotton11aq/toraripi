import React, { useEffect, useState } from "react";
import firebase from "./firebase";
import { Contents } from "./assets/components/index";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const logout = () => {
    firebase.auth().signOut();
  };

  return (
    <>
      <AppBar position="fixed">
        <div className="contacts">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              トラリピ資金管理表
            </Typography>
            <Button color="inherit" onClick={logout}>
              ログアウト
            </Button>
          </Toolbar>
        </div>
      </AppBar>
      <div className="App">
        <Contents />
      </div>
    </>
  );
};

export default App;
