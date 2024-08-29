const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationInterestSchema=new Schema({
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    appliedAt: {
        type:Date,
        required: true,
        default: () => {
            const date = new Date();
            return date;
        }
    }
});

ApplicationInterestSchema.index({ professional: 1, application: 1 }, { unique: true });

module.exports=mongoose.model('ApplicationInterest',ApplicationInterestSchema);