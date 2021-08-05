import jwt from 'jsonwebtoken';
import RedisHelper from './redisHelper.js';
class SessionHelper {
    
    constructor(){
        this.openSessions = new Map();
        this.sessionCounter = 1;
        this.accessTokenSecret = 'nkjnnj5j6jkbHBVjhuyg6tgbj';
        this.sessions =  new RedisHelper();
    }

    verifySession(accessToken){
        if(accessToken){
          return jwt.verify(accessToken, this.accessTokenSecret, (err, user) => {
            if (err){
              console.log("not verified");
              return null;
            }
            console.log("verified!");
            return this.sessions.get(user.sessionId) ?  user : false;
          });
        } 
        return null;
    }

    createSession (user){
        user.sessionId = this.sessionCounter;
        this.sessions.set(this.sessionCounter, user);
        this.openSessions.set(this.sessionCounter++, user);
        const token = jwt.sign(user, this.accessTokenSecret, {
          "algorithm": "HS256",
          // expiresIn: 86400 *  // expires in 10 days
        });
        return token;
    }

    deleteSession(userData){
        this.openSessions.delete(userData.sessionId);
    }

    isOpenSession(userData){
        return this.openSessions.has(userData.sessionId);
    }

    createToken(data, expiresTime){
      const token = jwt.sign(data, this.accessTokenSecret, {
        "algorithm": "HS256",
        // TODO 
        expiresIn: expiresTime// expires in 24 hours
      });

      return token;
    }

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