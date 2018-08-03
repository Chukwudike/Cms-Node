const express = require('express');
//const User = require('./models')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');

const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

app.set('view engine', 'ejs');
//upload middleware

app.use(upload());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

//connect to Database
mongoose.connect('mongodb://localhost/CMS');
mongoose.connection.once('open',function(){
    console.log('connection has been made successfully')
}).on('error',function(error){
    console.log('connection error:', error)
});

// Middleware forstatic files
app.use(express.static('./public'));

//for sessions
app.use(session({
    secret: 'Bryan dikky',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message =  req.flash('success_message');
    res.locals.error_message =    req.flash('error_message');
    res.locals.success_register = req.flash('success_register');
    res.locals.login_error =   req.flash('error'); 
   // console.log(res.locals.success_message);
    next();
})

//require routes
const Main = require('./routes/home/main');
const admin = require('./routes/admin/main');
const post = require('./routes/admin/post');
const category = require('./routes/admin/category');
const comment = require('./routes/admin/comments');

//use middleware for route
app.use('/',Main);
app.use('/admin',admin);
app.use('/admin/posts',post);
app.use('/admin/categories',category);
app.use('/admin/comments',comment);















app.listen(3000,()=>{
    console.log('i am listening to you at port 3000!')
})