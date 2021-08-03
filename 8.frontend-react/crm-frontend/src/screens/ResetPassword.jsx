import Form from '../components/form/Form';
import Logo from '../components/logo/Logo';
import AuthApi from '../helpers/authApi';
import '../styles/massageBox.css';
import {
    Link, useParams
  } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Message from '../components/message/Message';

const authApi = new AuthApi();

function ResetPassword(props) {  
      const [isPasswordChanged, setPasswordChanged] = useState(false);
      const [isLoading, setIsLoading] = useState(true);
      const [isValidPage, setIsValidPage] = useState(false);
      const {mail} = useParams();

      
      
      useEffect(()=>{
        (async () => {
          // Check if the page is still relevant
          const result = await checkPageRelevance();
          if(result) {
            setIsValidPage(true);
          } 
          setIsLoading(false);
        })();
      }, [])
      
      /**
       * Sends request to check if the page is still relevant
       * @returns true if the page is relevant, false otherwise
       */
      const checkPageRelevance =  async () => {
        const res = await authApi.checkTokenValidation({mailToken: mail});
        return res.valid;
      }

      /**
       * Sends request to set a new password
       * @param {the mail of the user with the new password} data 
       * @returns the response if the data isn't valid
       */
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
        submitHandle: submit,
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
        }
      }

      let formClasses = 'form-container login small';

      let links = [
        {
            title: "log in", 
            url: '/login'
        }, 
    ];


    const getPageContent = () => {
      if(isValidPage){
        return <div className={formClasses}>
              {isPasswordChanged ? 
              <div className='successful-operation'>
                <h2>Password changed!</h2>
                <Link 
                    className='linkto' 
                    to="/login">Go to log in
                </Link>
              </div> 
              : 
              <Form 
                    className='form-body'
                    fields={reset.fields} 
                    title={reset.title}
                    submitHandle={reset.submitHandle} 
                    type={reset.type}
                    errorMap = {reset.errorMap}
                    button={reset.buttonTitle}
                    buttonClass={reset.buttonClass}
                    passwordError = 'Password must include 1-9 a-z A-Z and at least 8 characters'
                /> 
                }
            </div>
      } else {
        return <Message 
                  links={links} 
                  massage='This page is no longer available.'
              />
      }
    }

    return (
        <div className='box-wrapper'>
            <div className='logo'> 
                <Logo size='small'/>
            </div>
            {isLoading ? 
              <div>Loading... </div> 
              : 
              getPageContent()
            }
        </div>
    );
}

export default ResetPassword;