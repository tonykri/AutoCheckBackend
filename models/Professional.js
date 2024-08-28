const mongoose=require('mongoose');
const Schema=mongoose.Schema;

function validateBirthdate(birthdate) {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear(); 
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
        age--; 
    }
    return age >= 18 && age <= 120;
}
function validatePostalCodes(array) {
    if (array.length < 1 || array.length > 15) {
        return false;
    }
    return array.every(num => /^[0-9]{5}$/.test(num));
}
function validateEngines(v) {
    v = [...new Set(v)];
    return v.length > 0; 
}

const ProfessionalSchema=new Schema({
    firstname:{
        type:String,
        required: true,
        trim: true
    },
    lastname:{
        type:String,
        required: true,
        trim: true
    },
    birthdate:{
        type:Date,
        required: true,
        validate: {
            validator: validateBirthdate,
            message: 'Age must be between 18 and 120 years old.'
        }
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    activeUntil: {
        type:Date,
        required: true,
        default: () => {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date;
        }
    },
    workingPlaces: {
        type: [Number],
        required: true,
        validate: {
            validator: validatePostalCodes,
            message: 'Working places must be between 1 and 15 5-digit numbers.'
        }
    },
    engineCategories: {
        type: [String],
        required: true,
        enum: ['car', 'motorcycle', 'bicycle', 'boat', 'truck', 'bus', 'tractor'],
        validate: {
            validator: function(v) {
                this.engineCategories = [...new Set(v)];
                return validateEngines(this.engineCategories);
            },
            message: 'engineCategories must contain at least one valid category and no duplicates.'
        }

    }
});

module.exports=mongoose.model('Professional',ProfessionalSchema);