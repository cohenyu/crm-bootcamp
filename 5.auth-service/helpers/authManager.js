import SessionHelper from './sessionHelper.js';
import MailgunHelper from './mailgunHelper.js'
import ValidationHelper from './validationHelper.js';
import SqlHelper from './sqlHelper.js';
import md5 from 'md5';

const sessionHelper = new SessionHelper();
const sqlHelper = new SqlHelper();
const mailgunHelper = new MailgunHelper();
const validation = new ValidationHelper();


class AuthManager {

    /**
     * Inserts new user and account to the db.
     * @param {object} fields 
     * @returns jwt token
     */
    async signup(fields){
        let data = { valid: false, errors: [], serverError: '' }
        
        data = validation.validateAll(fields);
        if(!data.valid){
            return data;
        }

        // Check if the user already signed up
        var sql = `SELECT * FROM users WHERE user_mail = '${fields.mail.value}';`;
        let result = await sqlHelper.select(sql).catch((err)=>{});

        if(!result){
            data.serverError = "serverError";
            return data;
        };

        if(result.length > 0){
            data.serverError = 'userAlreadyExist';
            return data;
        }
            
        // insert the account to the db
        sql = `INSERT INTO accounts (business_name, first_user_mail) VALUES ('${fields.business.value}', '${fields.mail.value}');`;
        result = await sqlHelper.insert(sql).catch((err)=>{});
        if(!result){
            data.serverError = 'serverError';
            return data;
        }

        let account_id_value = result.insertId;
        sql = `INSERT INTO users (account_id, user_name, user_password, user_mail, user_phone) VALUES ('${account_id_value}', '${fields.name.value}', '${this.encodePassword(fields.password.value)}', '${fields.mail.value}', '${fields.phone.value}');`;
        result = await sqlHelper.insert(sql).catch((err)=>{});
        if(!result){
            data.serverError = 'serverError';
            return data;
        }

        const user = {userName: fields.name.value,  userId: result.insertId, accountId: account_id_value};
        data.valid = true;
        data.accessToken = sessionHelper.createSession(user);
        data.user_name = result.user_name;
        return data;
    }

    /**
     * Checks if the user is in the db.
     * @param {object} fields 
     * @returns jwt token
     */
    async login(fields){
        let data = { valid: false, errors: [], serverError: ''}

        data = validation.validateAll(fields);
        if(!data.valid){
            return data;
        }
        
        var sql = `SELECT * FROM users WHERE user_mail = '${fields.mail.value}' AND user_password = '${this.encodePassword(fields.password.value)}' ;`;
        let result = await sqlHelper.select(sql).catch((err)=>{});
        if(!result){
            data.serverError = "serverError";
            return data;
        };

        if(result.length == 0){
            data.serverError = 'IncorrectMailOrPassword';
            return data;
        }

        let userResult = result[0];     
        const user = {userName: userResult.user_name,  userId: userResult.user_id, accountId: userResult.account_id};
        data.valid = true; 
        data.user_name = userResult.user_name;
        data.accessToken = sessionHelper.createSession(user);
        return data;
    }

    /**
     * remove the session from the open sessions.
     * @param {string} authorization 
     * @returns valid ot not in case of error.
     */
    async logout(authorization){
        let data = { valid: false }

        var userData = sessionHelper.verifySession(authorization);
        if(userData){
            // sessionHelper.deleteSession(userData);
            data.valid = true;
        }
        return data;
    }

    /**
     * Updates the new password in the db.
     * @param {object} fields 
     * @param {string} mailToken 
     * @returns valid if the password has changed
     */
    async resetPassword(fields, mailToken){
        let data = {valid: false, errors: [], serverError: ''};

        // Validate the password
        data = validation.validateAll(fields);
        if(!data.valid){
            return data;
        }
        
        const tokenBody =  sessionHelper.verifyToken(mailToken);
        // Jwt token invalid
        if(!tokenBody){
            data.serverError = "serverError";
            return data;
        }

        const password = fields.newPassword.value;
        // Update the password in the db
        let sql = `UPDATE users SET user_password = '${this.encodePassword(password)}' WHERE user_mail = '${tokenBody.userMail}';`;
        let result = await sqlHelper.update(sql).catch((err)=>{});
        // The query failed
        if(!result){
            data.serverError = 'serverError';
            return data;
        }
        // The password has changed
        data.valid = true;
        return data;
    }

    /**
     * Sends an email to the given mail address with a link to reset the user's password.
     * @param {object} fields 
     * @returns valid if email sent to the user or not valid in case of error
     */
    async forgotPassword(fields){
        let data = {valid: false, errors: [], serverError: ''};

        // fields validations
        data =  validation.validateAll(fields);
        if(!data.valid){
            return data;
        }
        
        const userMail = fields.mail.value;
        if(userMail){
            // Check if the mail is in the db
            var sql = `SELECT * FROM users WHERE user_mail = '${userMail}'`;
            let result = await sqlHelper.select(sql).catch((err)=>{});

            // The query failed
            if(!result){
                data.serverError = "serverError";
                return data;
            };

            if(result.length == 0){
                data.valid = true;
                return data;
            }

            // User exist - encoding the mail address
            let tokenBody = {userMail: userMail};
            const mailToken = sessionHelper.createToken(tokenBody, (86400 / 24) * 4);
            try {
                data = await mailgunHelper.sendMail(
                'coheen1@gmail.com',
                //  TODO userMail, 
                'coheen1@gmail.com',
                'RGB - Reset password',
                `<a href=${`${process.env.URL}/resetPassword/${mailToken}`}>Click to reset your password.</a>`
                );
            } catch {
                data.serverError = "serverError";
            }

        //  Mail is undefined
        } else {
            data.serverError = "serverError";
        }
        return data;
    }

    ping(){
        return true;
    }

    /**
     * Checks if a jwt token is valid.
     * @returns valid, if the token is verified.
     */
    tokenValidation(authorization){
        const tokenBody = sessionHelper.verifyToken(authorization);
        return tokenBody ? {valid: true} : {valid: false};
    }

    /**
     * @param {string} password 
     * @returns the encoded password.
     */
     encodePassword(password){
        return md5(password);
    }

} 

export default AuthManager;