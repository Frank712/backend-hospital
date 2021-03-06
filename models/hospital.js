let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, required: [true, 'The name is required!']},
    img: { type: String, required: false},
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The ID of user is required'] }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
