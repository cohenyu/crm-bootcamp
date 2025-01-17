import React from 'react';
import Form from '../components/form/Form';
import Logo from '../components/logo/Logo';
import AuthApi from '../helpers/authApi';
import '../styles/signUp.css';
import {
    Link,
    useParams,
  } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {changedIsLogged} from '../reduxData/actions'
const authApi = new AuthApi();



function Signup(props) {

  const {token} = useParams();
  const dispatch = useDispatch();

/**
 * Sends request to add user or to sign up new one
 * @param {Fields values} formData 
 * @returns the response from the server if the values aren't valid
 */
  const submit = async (formData) => {
    
    let res;
    if(props.type === 'newUser'){
      res =  await authApi.editUser({fields: formData, token: token});
    } else {
      res = await authApi.signup(formData);
    }
    
    // Move to home pages
    if(res.valid){
      const UserAuthenticated = await authApi.getAuth();
          if(UserAuthenticated && typeof setUserDetails === "function"){
            window.setUserDetails(UserAuthenticated.accountId, UserAuthenticated.userId, UserAuthenticated.userName);
          }
      dispatch(changedIsLogged());
      window.location.href = 'http://localhost:3000/home';
    } else {
      return res;
    }
  }

    const signup = {
        submitHandle: submit,
        type: 'signup',
        title: "Let's get started!",
        buttonTitle: "Sign Up",
        errorMap: {
          'serverError': 'Try again later',
          'userAlreadyExist': 'User already exist'
        },
        buttonClass: 'main-button',
        fields: {
          name: {
            text: "Full Name",
            id: "name",
            type: 'text',
            error: false,
            mainType: 'name'
          },
          mail: {
            text: "Email",
            id: "mail",
            type: 'text',
            error: false,
            mainType: 'mail'
          },
          phone: {
            text: "Phone Number",
            id: "phone",
            type: 'text',
            error: false,
            mainType: 'phone'
          }, 
          business: {
            text: "Business Name",
            id: "business",
            type: 'text',
            error: false,
            mainType: 'name'
          },
          password: {
            text: "Password",
            id: "password",
            type: "password",
            error: false,
            mainType: 'password'
          }
        }
      }

      // These fields are already known.
    if(props.type === 'newUser'){
      delete signup.fields.mail;
      delete signup.fields.business;
    }

    return (
      <div className='wrapper-container'>
        <div className='wrapper'>
            <div className='text-container'> 
              <Logo size='large'/>
              <h2>Be the best graphic designer you can</h2>
            </div>
            <div className='form-container'>
                <Form 
                  className='form-body'
                  fields={signup.fields} 
                  title={signup.title}
                  submitHandle={signup.submitHandle} 
                  type={signup.type}
                  errorMap = {signup.errorMap}
                  button={signup.buttonTitle}
                  buttonClass={signup.buttonClass}
                  passwordError = 'Password must include 1-9 a-z A-Z and at least 8 characters'
                />
                {props.type !== 'newUser' && 
                  <div>
                    <Link 
                        className='linkto' 
                        to="/login">I already have an account
                    </Link>
                  </div>}
            </div>
        </div>
      </div>
    );
}

export default Signup;