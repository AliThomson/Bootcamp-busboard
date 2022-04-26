exports.isValidPostcode = function (inputPostcode) {
    let postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
    let isValid = postcodeRegEx.test(inputPostcode);
    return isValid;
}