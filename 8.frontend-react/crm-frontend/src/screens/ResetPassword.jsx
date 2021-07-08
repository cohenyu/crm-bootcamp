import Form from '../components/Form';
import Logo from '../components/Logo';
import AuthApi from '../helpers/authApi';
// import '../styles/login.css';
import '../styles/massageBox.css';
import {
    Link, useParams
  } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Massage from '../components/Massage';

const authApi = new AuthApi();

function ResetPassword(props) {  
      // const history = useHistory();
      const [isPasswordChanged, setPasswordChanged] = useState(false);
      const [isLoading, setIsLoading] = useState(true);
      const [isValidPage, setIsValidPage] = useState(false);

      const {mail} = useParams();

      const checkPageRelevance =  async () => {
        const res = await authApi.checkTokenValidation({mailToken: mail});
        return res.valid;
      }


      useEffect(()=>{
        (async () => {
          const result = await checkPageRelevance();
          if(result) {
           setIsValidPage(true);
          } 
          setIsLoading(false);
        })();
      }, [])


      const submit = async (data) => {
        // sending the mail token with the new password
        const res = await authApi.resetPassword({mailToken: mail, fields: data});
        if(res.valid){
          setPasswordChanged(true);
          return null;
        } 
        return res;
      }


      const reset = {
        submitFunc: submit,
        type: 'reset',
        title: "Enter a new password",
        buttonTitle:'Change Password',
        buttonClass: 'main-button',
        errorMap: {
          'serverError': 'Try again later',
        },
        fields: {
          newPassword: {
            text: "Password",
            id: "password",
            error: false,
            type: 'password',
            mainType: 'password'
          },
          // confirmPassword: {
          //   text: "Confirm New Password",
          //   id: "confirmPassword",
          //   error: false,
          //   mainType: 'password'
          // }
        }
      }

      let formClasses = 'form-container login small';
      let links = [
        {
            title: "log in", 
            url: '/login'
        }, 
    ];

    return (
        <div className='box-wrapper'>
            <div className='logo'> 
                <Logo size='small'/>
            </div>
            {isLoading ? 
              <div>Loading... </div> : 
              (isValidPage ?
                <div className={formClasses}>
                {isPasswordChanged ? 
                <div className='successful-operation'>
                  <h2>Password changed!</h2>
                  <Link className='linkto' to="/login">Go to log in</Link>
                </div> : 
                <Form 
                      className='form-body'
                      fields={reset.fields} 
                      title={reset.title}
                      submitHandle={reset.submitFunc} 
                      type={reset.type}
                      errorMap = {reset.errorMap}
                      button={reset.buttonTitle}
                      buttonClass={reset.buttonClass}
                      passwordError = 'Password must include 1-9 a-z A-Z and at least 8 characters'
                  /> 
                  }
              </div> : <Massage links={links} massage='This page is no longer available.'/>
            )}
            
        </div>
    );
}

export default ResetPassword;