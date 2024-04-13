// accountModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving to database
accountSchema.pre('save', async function(next) {
    const account = this;
    if (!account.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(account.password, 10);
        account.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
