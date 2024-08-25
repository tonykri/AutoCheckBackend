const ExpressError = require('../utils/ExpressError');

module.exports.usernameValidator = (username) => {
    const isValidLength = username.length >= 3 && username.length <= 15;
    const hasInvalidChars = /[^a-zA-Z0-9_]/.test(username);

    if (!isValidLength) {
        throw new ExpressError('Username must be between 3 and 15 characters long.', 400);
    }
    if (hasInvalidChars) {
        throw new ExpressError('Username can only contain letters, numbers, and underscores.', 400);
    }
};