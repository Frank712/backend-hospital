let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} is not a valid role'
};

const userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    lastname: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, unique: true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String },
    role: { type: String, required: [true, 'Role is required'], default: 'USER_ROLE', enum: validRoles },
    google: { type: Boolean, required: [true, 'Google status is required'], default: false }
});

userSchema.plugin( uniqueValidator, { message: '{PATH} should be unique'} );
module.exports = mongoose.model('User', userSchema);