const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const AccountSchema=new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    role:{
        type:String,
        enum:['user', 'profesional'],
        required: true,
        unique:true
    }
});

AccountSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Account',AccountSchema);