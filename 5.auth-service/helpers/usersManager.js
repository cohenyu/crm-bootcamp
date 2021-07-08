import SessionHelper from './sessionHelper.js';
import MailgunHelper from './mailgunHelper.js'
import ValidationHelper from './validationHelper.js';
import SqlHelper from './sqlHelper.js';
import md5 from 'md5';

const sessionHelper = new SessionHelper();
const sqlHelper = new SqlHelper();
const mailgunHelper = new MailgunHelper();
const validation = new ValidationHelper();


class UsersManager {

    /**
     * Updates the new details of the user in the db.
     * @param {object} fields 
     * @param {string} token 
     * @returns 
     */
   async editNewUser(fields, token){
        let data = {valid: false, errors: [], serverError: ''};

        // fields validations
        data =  validation.validateAll(fields);
        if(!data.valid){
            return data;
        }

        const tokenBody = sessionHelper.verifyToken(token);
        if(tokenBody) {
            const {accountId, userId} = tokenBody;
            
            // insert the account to the db
            let sql = `UPDATE users SET user_name = '${fields.name.value}', user_password = '${this.encodePassword(fields.password.value)}', user_phone = '${fields.phone.value}' WHERE user_id = ${userId};`;
            let result = await sqlHelper.update(sql).catch((err)=>{});
            if(!result){
                data.serverError = 'serverError';
                return data;
            }

            sql = `SELECT * FROM accounts WHERE account_id = '${accountId}'`;
            result = await sqlHelper.select(sql).catch((err)=>{});
            if(!result || result == 0){
                data.serverError = 'serverError';
                return data;
            }

            try {
                const adminMail = result[0].first_user_mail;
                await mailgunHelper.sendMail(
                'coheen1@gmail.com', 
                'coheen1@gmail.com', 
                // TODO adminMail, 
                'RGB - Invitation accepted', 
                `The invitation you sent to <b>${fields.name.value}</b> was accepted.`
                );
            } catch {}

            // userMail
            const user = {userName: fields.name.value,  userId: userId, accountId: accountId };
            data.valid = true;
            data.accessToken = sessionHelper.createSession(user);
            data.user_name = result.user_name;

        } else {
            data.serverError = "serverError";
        }
        return data;
    }

    /**
     * @param {string} password 
     * @returns the encoded password.
     */
    encodePassword(password){
        return md5(password);
    }

    /**
     * Removes the user from the db.
     * @param {object} user 
     */
    async removeUser(user){
        let data = {valid: true};
        let sql = `DELETE FROM users WHERE user_id = '${user.user_id}'`;
        let result = await sqlHelper.delete(sql).catch((err)=>{});

        // The query failed
        if(!result){
            data.valid = false;
            data.serverError = "serverError";
        } 
        return data;
    }

    /**
     * @param {object} user 
     * @returns All the users from the same account
     */
    async getUsers(user){
        const data = {valid: true};
        let sql = `SELECT * FROM users WHERE account_id = '${user.accountId}'`;
        let result = await sqlHelper.select(sql).catch((err)=>{});

        // The query failed
        if(!result){
            data.valid = false;
            data.serverError = "serverError";
        } else {
            data.usersList = result;
        }

        return data;
    }

    /**
     * Add new user to the db and send him a sign up link
     * @param {object} fields 
     * @param {string} token 
     * @returns returns the new user details or in case of error return errors list.
     */
    async addUser(fields, token){
        let data = {valid: false};

        // fields validations
        data =  validation.validateAll(fields);
        if(!data.valid){
            return data;
        }
        
        const userMail = fields.mail.value;
        const tokenBody = sessionHelper.verifySession(token);
        if(userMail && tokenBody){

            // Check if the user is already in the db
            var sql = `SELECT * FROM users WHERE user_mail = '${userMail}'`;
            let result = await sqlHelper.select(sql).catch((err)=>{});

            // The query failed
            if(!result){
                data.serverError = "serverError";
                return data;
            };

            // User mail is already in the db
            if(result.length > 0){
                data.serverError = "userMailAlreadyExist";
                return data;
            }

            // New user - insert the new user to the db
            sql = `INSERT INTO users (account_id, user_mail) VALUES ('${tokenBody.accountId}', '${userMail}');`;
            result = await sqlHelper.insert(sql).catch((err)=>{});
            if(!result){
                data.serverError = 'serverError';
                return data;
            }
            
            // Encoding the mail address and the account id 
            const mailToken = sessionHelper.createToken({userMail: userMail, accountId: tokenBody.accountId, userId: result.insertId}, 86400 * 10);
            // send the invite mail to the user
            // TODO replace my mail with userMail
            try {
                data = await mailgunHelper.sendMail(
                    'coheen1@gmail.com', 
                    // TODO userMail
                    'coheen1@gmail.com', 
                    'RGB - Invitation', 
                    `You have received an invitation to join RGB! <br/> <a href=${`${process.env.URL}/newUser/${mailToken}`}>Click to sign up.</a>`);
                data.user = {user_mail: userMail, user_id: result.insertId};
            } catch {
                data.serverError = "serverError";
            }

        //  Mail is undefined
        } else {
            data.serverError = "serverError";
        }
        console.log(data);
        return data;  
    }

    /**
     * Updates the new details of the old user in the db.
     * @param {object} fields 
     * @param {string} token 
     * @returns 
     */
   async editOldUser(fields, userId){
    let data = {valid: false, errors: [], serverError: ''};

    // fields validations
    data =  validation.validateAll(fields);
    if(!data.valid){
        res.send(data);
        return;
    }
    
    // insert the account to the db
    let sql = `UPDATE users SET user_name = '${fields.name.value}', user_mail = '${fields.mail.value}', user_phone = '${fields.phone.value}' WHERE user_id = ${userId};`;
    let result = await sqlHelper.update(sql).catch((err)=>{});
    if(!result){
        data.serverError = 'serverError';
        return data;
    }

    data.valid = true;
    return data;
}

} 

export default UsersManager;