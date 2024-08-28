const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function validatePostalCode(num) {
    return /^[0-9]{5}$/.test(num);
}

const ApplicationSchema=new Schema({
    comment:{
        type:String,
        required: true,
        trim: true
    },
    status:{
        type:String,
        required: true,
        default: 'pending',
        enum: ['pending', 'applied', 'accepted', 'done']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    appliedAt: {
        type:Date,
        required: true,
        default: () => {
            const date = new Date();
            return date;
        }
    },
    postalCode: {
        type: Number,
        required: true,
        validate: {
            validator: validatePostalCode,
            message: 'Working place must be 5-digit number.'
        }
    },
    engineCategory: {
        type: String,
        required: true,
        enum: ['car', 'motorcycle', 'bicycle', 'boat', 'truck', 'bus', 'tractor']
    }
});

module.exports=mongoose.model('Application',ApplicationSchema);