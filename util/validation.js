function isEmpty(value){
    return !value || value.trim() === '';
}
function UserCredentialsAreVaild(email,password){
    return 
        email && email.includes('@') &&
        password.trim().length >= 6;
    }

function userDetailsAreValid(email,password,name,street,postal,city){
    return (
        UserCredentialsAreVaild(email,password) &&
        !isEmpty(name) &&
        !isEmpty(street) &&
        !isEmpty(postal) &&
        !isEmpty(city)
    );
}
function emailConfirmed (email,confirmEmail){
    return email === confirmEmail;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    emailConfirmed: emailConfirmed
};