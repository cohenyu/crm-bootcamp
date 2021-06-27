import React from 'react';
import Form from '../components/Form';
import Logo from '../components/Logo';
import AuthApi from '../helpers/authApi';
import '../styles/login.css';
import {
    Link,
  } from "react-router-dom";

const authApi = new AuthApi();

function Login(props) {  

      const login = {
        submitFunc: authApi.signin,
        type: 'signin',
        title: "Welcome Back!",
        buttonTitle: "LOG IN",
        fields: {
          mail: {
            text: "Email",
            id: "mail",
          },
          password: {
            text: "Password",
            id: "password"
          }
        }
      }

      var formClasses = 'form-container login small';
    

    return (
        <div>
            <div className='logo'> 
                <Logo size='small'/>
            </div>
            <div className={formClasses}>
                <Form 
                    className='form-body'
                    fields={login.fields} 
                    title={login.title}
                    submitHandle={login.submitFunc} 
                    type={login.type}
                    button={login.buttonTitle}
                />
                <hr></hr>
                <Link className='linkto' to="/signup">I don't have an account</Link>
            </div>
        </div>
    );
}

export default Login;