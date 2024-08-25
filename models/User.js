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

const UserSchema=new Schema({
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
    }

});

module.exports=mongoose.model('User',UserSchema);