import Form from '../components/form/Form';
import Logo from '../components/logo/Logo';
import AuthApi from '../helpers/authApi';
import '../styles/massageBox.css';
import { Link } from "react-router-dom";
import React, { useState} from 'react';

const authApi = new AuthApi();

function ForgotPassword(props) {  

      const [isFormSubmitted, setFormSubmitted] = useState(false);

      /**
       * Sends request to reset the password
       * @param {mail} data 
       * @returns the response if the mail is invalid
       */
      const submit = async (data) => {
        const res = await authApi.forgotPassword(data);
        if(res.valid){
          setFormSubmitted(true);
        } else {
          return res;
        }
      }


      const forgot = {
        submitHandle: submit,
        type: 'forgot',
        title: "Forgot Password",
        errorMap: {
          'serverError': 'Try again later',
        },
        buttonTitle: 'Reset My Password',
        buttonClass: 'main-button',
        fields: {
          mail: {
            text: "Enter Your Email",
            id: "mail",
            error: false,
            mainType: 'mail'
          }
        }
      }

      var formClasses = 'form-container login small';
    

    /**
     * @returns the content of the page, depending on whether the form was submitted successfully.
     */
    const getPageContent = ()=>{
      if(isFormSubmitted){
        return <div className='successful-operation'>
                <h2>Link to reset your password sent to your mail!</h2>
                <Link 
                    className='linkto' 
                    to="/login">Go to login
                </Link>
              </div>
      } else {
        return <div className='form-box'>
                  <Form 
                      className='form-body'
                      button= {forgot.buttonTitle}
                      {...forgot}
                  />
                  <div className='links'>
                      <Link 
                          className='linkto' 
                          to="/signup">Create new account
                      </Link>
                      <Link 
                          className='linkto' 
                          to="/login">Back to login
                      </Link>
                  </div>
              </div>
      }
    }

    return (
        <div className='box-wrapper'>
            <div className='logo'> 
                <Logo size='small'/>
            </div>
            <div className={formClasses}>
                {getPageContent()}
            </div>
        </div>
    );
}

export default ForgotPassword;