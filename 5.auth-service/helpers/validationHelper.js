
class ValidationHelper{

    regexMap = {
        mail: /^[0-9a-zA-Z-_.]{1,30}@[a-zA-Z]{2,30}[.]{1}[a-zA-Z]{2,30}([.]{1}[a-zA-Z]{2,30}){0,1}$/,
        name: /^([a-zA-Z]{2,20}\s{0,1}){1,3}$/,
        phone: /^[0-9]{3}[-]{0,1}[0-9]{3}[-]{0,1}[0-9]{4}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
    }

    /**
     * Returns if the specific field is valid
     * @param {string} type 
     * @param {boolean} isRequired 
     * @param {string} value 
     * @returns 
     */
    validate = (type, isRequired, value) => {
        if (isRequired && !value){
            return false;
        }
        switch (type) {
            case 'mail':
               return this.regexMap.mail.test(value);
                break;
            case 'password':
                return this.regexMap.password.test(value);
                break;
            case 'phone':
                return this.regexMap.phone.test(value);
            case 'name':
            default:
                return this.regexMap.name.test(value);
        }
    
    }

    /**
     * @param {object} fields 
     * @returns object with all the invalid fields.
     */
     validateAll = (fields) => {
        let resData = {valid: true, errors: []};
        for(let field in fields){
            let content = fields[`${field}`];
            if(!this.validate(content.type, true, content.value)){
                resData.valid = false;
                resData.errors.push(field);
            }
        }
        return resData;
    }
}

export default ValidationHelper;
