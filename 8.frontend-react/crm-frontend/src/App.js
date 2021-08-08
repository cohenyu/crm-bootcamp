import React, { useState, useEffect } from 'react';
import Home from './screens/Home';
import ResetPassword from './screens/ResetPassword';
import ForgotPassword from './screens/ForgotPassword';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Team from './screens/Team';
import AuthApi from './helpers/authApi';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Clients from './screens/Clients';
import AddProject from './screens/AddProject';
import './styles/styles.scss';
import './components/loading/Loading'
import AllProjects from './screens/AllProjects';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Loading from './components/loading/Loading';
import ProjectPage from './screens/ProjectPage';
import ClientPage from './screens/ClientPage';
import {useSelector, useDispatch} from 'react-redux';
import {changedIsLogged} from './reduxData/actions';
import ChatScreen from './screens/ChatScreen'
// const axios = require('axios');

const authApi = new AuthApi();
function App() {

  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isLogged = useSelector(state => state.isLogged);

    useEffect(() => {
      async function checkConnection() {
        if(localStorage.getItem('jwtToken')){
          const isUserAuthenticated = await authApi.ping();
          if(isUserAuthenticated){
            dispatch(changedIsLogged());
          }
        } 
        setLoading(false);
      }
      setTimeout(checkConnection, 800);
      setTimeout(() => {
        if(isLoading){
          setLoading(false);
        }
      }, 1800);
  }, [])

  const loader = <Loading color="#fe5f55" width={100} height={100}/>
  
  const loggedInRoutes = () => {
    return (
      <Switch>
            <Route 
              exact path="/home"
              component={Home}
            />,
            <Route 
              exact path="/team"
              component={Team}
            />,
            <Route 
              exact path="/allProjects"
              render= {() => <AllProjects mine={false}/>}
            />,
            <Route 
              exact path="/myProjects"
              render={() => <AllProjects mine={true} />}
            />,
            <Route 
              exact path="/clients"
              component={Clients}
            />,
             <Route 
              exact path="/addProject"
              component={AddProject}
            />,
            <Route 
              exact path="/project/:projectId"
              component={ProjectPage}
            />,
            <Route 
              exact path="/client/:clientId"
              component={ClientPage}
            />,
            <Route 
              exact path="/chat"
              component={ChatScreen}
            />,
            <Route >
              <Redirect to="/home"/>
            </Route>
      </Switch>
    );
  }

  const loggedOutRoutes = () => {
    return (
      <Switch>
            <Route 
              path="/signup"
              render={()=><Signup type='newAccount'/>}
            />,
            <Route 
              path="/newUser/:token"
              render={()=><Signup type='newUser'/>}
            />,
            <Route 
              exact path="/login"
              component={Login}
            />,
            <Route 
              exact path="/resetPassword/:mail"
              component={ResetPassword}
            />,
            <Route 
             exact path="/forgotPassword"
              component={ForgotPassword}
            />,
            <Route >
              <Redirect to="/login"/>
            </Route>
      </Switch>
    );
  }

  if (isLoading) return <div className="App">{loader}</div>;

  return (
    <Router>
    <div className="App">
      {
        isLogged ? loggedInRoutes() : loggedOutRoutes()
      }
    </div>
  </Router>
  );
}


export default App;

