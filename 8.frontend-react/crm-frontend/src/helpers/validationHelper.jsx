var regexMap = {
    mail: /^[0-9a-zA-Z-_.]{1,30}@[a-zA-Z]{2,30}[.]{1}[a-zA-Z]{2,30}([.]{1}[a-zA-Z]{2,30}){0,1}$/,
    name: /^([a-zA-Z]{2,20}\s{0,1}){1,3}$/,
    phone: /^[0-9]{3}[-]{0,1}[0-9]{3}[-]{0,1}[0-9]{4}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    date: /^\d{4}([-])\d{2}\1\d{2}$/,
    number: /^\d+$/
}

/**
 * Returns if the specific field is valid
 * @param {string} type 
 * @param {boolean} isRequired 
 * @param {string} value 
 * @returns 
 */
const validate = (type, isRequired, value) => {
    if (isRequired && !value){
        return false;
    }
    switch (type) {
        case 'mail':
           return regexMap.mail.test(value);
        case 'password':
            return regexMap.password.test(value);
        case 'phone':
            return regexMap.phone.test(value);
        case 'number':
            return regexMap.number.test(value);
        case 'date':
            return regexMap.date.test(value);
        case 'name':
        default:
            return regexMap.name.test(value);
    }

}

export default validate; 
