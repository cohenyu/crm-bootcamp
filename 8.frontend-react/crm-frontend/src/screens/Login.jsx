import React from 'react';
import Form from '../components/form/Form';
import Logo from '../components/logo/Logo';
import AuthApi from '../helpers/authApi';
import '../styles/simpleForm.css';
import {
    Link,
    useHistory,
    withRouter
  } from "react-router-dom";

const authApi = new AuthApi();

function Login(props) {  

      
      const submit = async (data) => {
        const res = await authApi.signin(data);
        console.log("response", res.valid);
        if(res.valid){
          window.location.href = 'http://localhost:3000/home';
        } else {
          return res;
        }
      }

      const login = {
        submitHandle: submit,
        type: 'signin',
        title: "Welcome Back!",
        buttonTitle: "Log In",
        buttonClass: 'main-button',
        errorMap: {
          'serverError': 'Try again later',
          'IncorrectMailOrPassword': 'Incorrect mail or password'
        },
        fields: {
          mail: {
            text: "Email",
            id: "mail",
            error: false,
            mainType: 'mail',
            type: 'text'
          },
          password: {
            text: "Password",
            id: "password",
            error: false,
            mainType: 'password',
            type: 'password'
          }
        }
      }

      var formClasses = 'form-container login small';
    

    return (
        <div className='box-wrapper'>
            <div className='logo'> 
                <Logo size='small'/>
            </div>
            <div className={formClasses}>
                <Form 
                    className='form-body'
                    fields={login.fields} 
                    title={login.title}
                    submitHandle={login.submitHandle} 
                    type={login.type}
                    errorMap = {login.errorMap}
                    button={login.buttonTitle}
                    buttonClass={login.buttonClass}
                />
                <div className='links'>
                <Link className='linkto' to="/signup">I don't have an account</Link>
                <Link className='linkto' to="/forgotPassword">Forgot password?</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;