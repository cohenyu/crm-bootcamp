import jwt from 'jsonwebtoken';
import RedisHelper from './redisHelper.js';
class SessionHelper {
    
    constructor(){
        this.sessionCounter = 1;
        this.accessTokenSecret = 'nkjnnj5j6jkbHBVjhuyg6tgbj';
        this.sessions =  new RedisHelper();
    }

    /**
     * Verifies the user session
     * @param {token string} accessToken 
     * @returns user data id the session is verify, or false if not
     */
    verifySession(accessToken){
        if(accessToken){
          return jwt.verify(accessToken, this.accessTokenSecret, (err, user) => {
            if (err){
              console.log("not verified");
              return false;
            }
            console.log("verified!");
            return user;
            // TODO get the real session
              // try{
              //   const res = this.sessions.get(user.sessionId);
              //   console.log(res);
              //   return res ? user : false;
              // } catch (error) {
              //   return false;
              // }

            // return result ? user : false;
            // try {
            //   const result =  await this.sessions.get(user.sessionId);
            //   if(result){
            //     console.log(result);
            //     return user;
            //   } else {
            //     return false;
            //   }
            // } catch (error){
            //   return false;
            // }
          });
        } 
        return false;
    }

    /**
     * Creates new session and new token
     * @param {user data} user 
     * @returns token string
     */
    createSession (user){
        user.sessionId = this.sessionCounter;
        this.sessions.set(this.sessionCounter++, user);
        const token = jwt.sign(user, this.accessTokenSecret, {
          "algorithm": "HS256",
        });
        return token;
    }

    /**
     * Deletes the session
     * @param {user data object} userData 
     */
    deleteSession(userData){
      console.log("deleting session");
      this.sessions.delete(userData.sessionId);
    }

    /**
     * Creates a token string from the given data that will expire at the given time
     * @param {*} data 
     * @param {*} expiresTime 
     * @returns the new token
     */
    createToken(data, expiresTime){
      const token = jwt.sign(data, this.accessTokenSecret, {
        "algorithm": "HS256",
        expiresIn: expiresTime
      });

      return token;
    }

    /**
     * Verifies the given token
     * @param {token string} token 
     * @returns the token body if the token is verify, null otherwise
     */
    verifyToken(token){
      return jwt.verify(token, this.accessTokenSecret, (err, result) => {
        if (err){
          return null;
        }
        return result;
      });
    }

}

export default SessionHelper;