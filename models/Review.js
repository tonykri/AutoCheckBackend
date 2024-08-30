const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ReviewSchema=new Schema({
    content:{
        type:String,
        required: true,
        trim: true,
        minlength: [10, 'Review must be at least 10 characters long.'],
        maxlength: [500, 'Review cannot be more than 500 characters long.']
    },
    stars: {
        type:Number,
        required: true,
        min: [1, 'Stars must be at least 1.'],
        max: [10, 'Stars cannot be more than 10.']
    },
    createdAt: {
        type:Date,
        required: true,
        default: () => {
            const date = new Date();
            return date;
        }
    },
    lastModifiedAt: {
        type:Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    }

});

ReviewSchema.index({ professional: 1, user: 1 }, { unique: true });

module.exports=mongoose.model('Review',ReviewSchema);