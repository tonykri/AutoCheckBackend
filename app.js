require('dotenv').config();

const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
const MongoDBStore = require("connect-mongo"); 
const ExpressError = require('./utils/ExpressError');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const Account=require('./models/Account');

const accountRoutes=require('./routes/account');
const userRoutes=require('./routes/user');



// DB Connection Config
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/autocheck';
mongoose.connect(dbUrl)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));

    
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// Session Config
const secret=process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoDBStore.create({
    mongoUrl: dbUrl, 
    collectionName: 'sessions',
});
store.on('error',function(e){
    console.log("SESSION STORE ERROR",e);
});
app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 
        }
    })
);


// Passport Config
app.use(passport.initialize());
app.use(passport.session());  
passport.use(new LocalStrategy(Account.authenticate())); 
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// Routes Config
app.use('/auth',accountRoutes);
app.use('/user',userRoutes);

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message='Something went wrong'}=err;
    if(!err.message) err.message='Something Went Wrong';
    res.status(statusCode).json(err);
})

const port=process.env.PORT ||4000; 
app.listen(port,()=>{
    console.log(`SERVING ON PORT ${port}!`);
})
