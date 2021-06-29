
// import './App.css';
// import Form from './components/Form';

import React, { useState, useEffect } from 'react';
// import React, { useEffect } from 'react';
import Home from './screens/Home';
import ResetPassword from './screens/ResetPassword';
import ForgotPassword from './screens/ForgotPassword';
import Signup from './screens/Signup';
import Login from './screens/Login';
import AuthApi from './helpers/authApi';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
// const axios = require('axios');

const authApi = new AuthApi();
function App() {

  const [isConnect, setConnection] = useState(false);
  const [isLoading, setLoading] = useState(true);

  
    useEffect(() => {
      async function checkConnection() {
        if(localStorage.getItem('jwtToken')){
          const isUserAuthenticated = await authApi.ping();
          console.log(isUserAuthenticated);
          setConnection(isUserAuthenticated);
          setLoading(false);
        } else {
          setLoading(false);
          setConnection(false);
          
        }
      }
      checkConnection();
  }, [])


  return (

    <Router>
    <div className="App">
      <Switch>
      <Route
          exact path="/"
          render={() => {
              return ( isLoading ? 
                (<div>Loading</div>) : 
                isConnect ?
                <Redirect to="/home" /> :
                <Redirect to="/signup" /> 
              )
          }}
        />
        <Route 
          exact path="/signup">
            {isLoading ? (<div>Loading</div>) : 
            isConnect ?
                <Redirect to="/home" /> :
                <Signup /> 
            }
        </Route>
        <Route exact path="/home">
            {isLoading ? (<div>Loading</div>) : 
            isConnect ?
            <Home /> :
            <Redirect to="/login" /> 
            }
        </Route>
        <Route exact path="/login">
        {isLoading ? (<div>Loading</div>) : 
            isConnect ?
                <Redirect to="/home" /> :
                <Login />
            }
        </Route>
        <Route path="/resetPassword/:mail">
            <ResetPassword/>
        </Route >
        <Route exact path="/forgotPassword">
            <ForgotPassword/>
        </Route >
      </Switch>
    </div>
  </Router>
  );
}


export default App;