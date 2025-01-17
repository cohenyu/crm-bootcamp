import express from 'express';
import cors from 'cors';
import SessionHelper from './helpers/sessionHelper.js';
import dotenv from 'dotenv';
import UsersManager from './helpers/usersManager.js';
import AuthManager from './helpers/authManager.js';

const app = express();
const usersManager = new UsersManager();
const sessionHelper = new SessionHelper();
const authManager = new AuthManager();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});


/**
 * Inserts new user and account to the db and adds the new jwt token to the response.
 */
app.post('/signup', async function (req, res) {
  const response = await authManager.signup(req.body);
  res.send(response);
});

/**
 * Checks if the user is in the db and adds the new jwt token to the response.
 */
app.post('/login', async function (req, res) {
  const response =  await authManager.login(req.body);
  res.send(response);
});

/**
 * Checks the user is logged in and deletes his session.
 */
app.post('/logout', authMiddleware, function (req, res) {
  const response  = authManager.logout(req.user);
  res.send(response);
});


/**
 * @param {request object} req 
 * @param {response object} res 
 * @param {function} next 
 * @returns false if the token not verified
 */
function authMiddleware(req, res, next){
  const userData = sessionHelper.verifySession(req.headers.authorization);
  if(userData){
    req.user = userData;
    next()
  } else {
      return res.send(false);
  }
}

/**
 * Validates the given token
 */
app.get('/tokenValidation',  function(req, res){
  res.send(authManager.tokenValidation(req.headers.authorization));
});

/**
 * Sets the response to true.
 */
app.get('/ping', authMiddleware,  function(req, res){
  res.send(authManager.ping());
});

/**
 * Sends an email to the given mail address with a link to reset the user's password.
 */
app.post('/forgotPassword', async function (req, res) {
  const response = await authManager.forgotPassword(req.body);
  res.send(response);
  });

/**
 * Sets a new password to a given user.
 */
app.post('/resetPassword', async function(req, res){
  const {fields, mailToken} = req.body;
  const response = await authManager.resetPassword(fields, mailToken)
  res.send(response);
});

/**
 * Add new user to the account
 */
app.post('/addUser',  async function(req, res){
  const response = await usersManager.addUser(req.body.fields, req.body.token);
  res.send(response);
});

/**
 * Edit new user details.
 */
app.post('/editUser',  async function(req, res){
  const {fields, token} = req.body;
  const response = await usersManager.editNewUser(fields, token);
  res.send(response);
});

/**
 * Returns all the users of the account
 */
app.get('/getUsers', authMiddleware, async function(req, res){
  const response =  await usersManager.getUsers(req.user);
  res.send(response);
});

/**
 * Remove user from the account
 */
app.post('/removeUser', authMiddleware, async function(req, res){
  const response = await usersManager.removeUser(req.body);
  res.send(response);
});

/**
 * Edit old user details
 */
app.post('/editOldUser', authMiddleware, async function(req, res){
  const {fields, userId} = req.body;
  const response = await usersManager.editOldUser(fields, userId);
  res.send(response);
});

/**
 * Returns user details from the token body
 */
app.get('/getUser', authMiddleware, function(req, res){
  res.send(req.user);
})

/**
 * Calls to send msgs
 */
app.post('/sendMsgs', authMiddleware, async function(req, res){
  console.log("in sendMsgs after middleware");
  const response = await usersManager.sendMsgs(req.body);
  res.send(response);
})




