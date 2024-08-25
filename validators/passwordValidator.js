module.exports.passwordValidator = (password, cb) => {
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    const isValidLength = password.length >= 8 && password.length <= 20;

    if (!isValidLength) {
        return cb(new ExpressError('Password must be between 8 and 20 characters long.', 400));
    }
    if (!hasUpperCase.test(password)) {
        return cb(new ExpressError('Password must contain at least one uppercase letter.', 400));
    }
    if (!hasNumber.test(password)) {
        return cb(new ExpressError('Password must contain at least one number.', 400));
    }
    if (!hasSymbol.test(password)) {
        return cb(new ExpressError('Password must contain at least one symbol.', 400));
    }

    return cb(null);
};