let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: { type: String, required: [true, 'The name is required!']},
    img: { type: String, required: false},
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The ID of user is required'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'The ID of hospital is required'] }
});

module.exports = mongoose.model('Doctor', doctorSchema);
