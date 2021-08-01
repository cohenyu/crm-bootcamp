// Map between the error span id to the error msg.
var error_map = {
    'error-name': "Please enter valid name", 
    'error-mail':"Please enter valid mail", 
    'error-phone':"Please enter valid phone",
    'error-server': "Please try again later"
    };

/**
 * Validate the form fields and send the lead to the server.
 */
function ListenToRequest(){
    
    const form = document.querySelector('#form');
    form.addEventListener('submit', function(e){
        e.preventDefault();

        // frontend validation
        if(!validation()){
            return false;
        } 
        

        const name = form.elements.name.value;
        const mail = form.elements.mail.value;
        const phone = form.elements.phone.value;


        // sending the form fields to the server
        axios.post('http://rgb.com:8004', {
        fullName: name,
        email: mail,
        phone: phone
        },)
        .then(function (response) {
            var validData = response.data;
            // checking if was success in the server side
            if(!validData.valid){
                for(const error of validData.errors){
                    updateError(error);
                }
                return false;
            }
            // redirect to the success page
            window.location.href = "http://rgb.com:8003/?name=" + name.split(" ")[0];
            return true;
        })
        .catch(function (error) {
            console.log(error);
        });
        
    });

    const openChat = document.getElementById('open-chat');
         openChat.addEventListener("click", function(e){
             e.target.style.display = 'none';
             const chat = document.querySelector('#chat');
             chat.style.display = 'block';
         });

    const exitChat = document.getElementById("exit-chat");
    exitChat.addEventListener("click", function(e){
        const chat = document.querySelector('#chat');
        chat.style.display = 'none';
        const openChat = document.querySelector('#open-chat');
        openChat.style.display = 'flex';
    })
}



/**
 * Sets the style and text of the error span.
 * @param {string} errorKey 
 */
function updateError(errorKey){
    var errorElement = document.getElementById(errorKey);
    errorElement.textContent = error_map[errorKey];
    errorElement.style.display = 'inline';
    errorElement.style.color = "red";
    if(errorKey == "error-server"){
        errorElement.style.margin = "10px 0";
    }
}



/**
 * Validates all the form's fields.
 * @returns true if all are valid.
 */
function validation(){
    var isValid = true;
    const form = document.querySelector('#form');
    if(!isValidateField(form.elements.name, validateName, 'error-name')){
        isValid = false;
    }
    
    if(!isValidateField(form.elements.mail, validateMail, 'error-mail')){
        isValid = false;
    }
    
    if(!isValidateField(form.elements.phone, validatePhone, 'error-phone')){
        isValid = false;
    }

    return isValid;
}


function isValidateField(field, validateFunction, errorKey){
    var content = field.value;
    if(!validateFunction(content)){
        updateError(errorKey);
        return false;
    }
    return true;
}

/**
 * @param {string} name 
 * @returns true if the name is valid.
 */
function validateName(name){
    var regex = /^([a-zA-Z]{2,20}\s{0,1}){1,3}$/;
    return regex.test(name);
}

/**
 * @param {string} phone 
 * @returns true if the phone is valid.
 */
function validatePhone(phone){
    var regex = /^[0-9]{3}[-]{0,1}[0-9]{3}[-]{0,1}[0-9]{4}$/;
    return regex.test(phone);
}

/**
 * @param {sting} mail 
 * @returns true if the mail is valid.
 */
function validateMail(mail){
    var regex = /^[0-9a-zA-Z-_.]{1,30}@[a-zA-Z]{2,30}[.]{1}[a-zA-Z]{2,30}([.]{1}[a-zA-Z]{2,30}){0,1}$/;
    return regex.test(mail);
}

/**
 * Cancels the error of the element in the view .
 * @param {input} element 
 */
function cancelError(element){
    var elementName = element.name;
    var error;
    if(elementName == 'name'){
        error  = document.getElementById('error-name');
    } else if (elementName == 'mail'){
        error  = document.getElementById('error-mail');
    } else if (elementName == 'phone'){
        error  = document.getElementById('error-phone');
    }
    error.style.display = 'none';
}


ListenToRequest();