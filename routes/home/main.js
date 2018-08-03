const express= require('express');
const router = express();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy ({usernameField : 'email'},(email,password,done)=>{
User.findOne({email: email}).then(user=>{
if(!user) return done(null,false, {message: 'User does not exist'});
bcrypt.compare(password,user.password,(err,matched)=>{
    if (err) throw err;
    if(matched){
        return done(null,user);
    }else{
      return done(null,false,{message : 'Incorrect password'})  
    }
} )
})
}))

router.post('/login', (req, res,next) => {
    passport.authenticate('local',{
        successRedirect : '/admin',
        failureRedirect : '/login',
        failureFlash : true
    })(req,res,next);
}) 

passport.serializeUser(function(user,done){
    done(null, user.id);
})
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    })
})

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
});


router.get('/', (req, res) => {
    Post.find({}).then(function(posts){
        Category.find({}).then(function(category){
            res.render('home/index',{allpost:posts, category:category});
        })
    })
});


router.get('/login', (req, res) => {
    res.render('home/login');
});


router.get('/register', (req, res) => {
    res.render('home/register');
});


router.post('/register', (req, res) => {
    
if(req.body.password !== req.body.passwordConfirm)
{
    req.flash('error_message','Passwords dont match');
    // var firstName = req.body.firstName;
    // var lastName = req.body.lastName;
    // var email = req.body.email;
    // var data = [firstName,lastName,email]
    res.redirect('/register');
}
else{
    User.findOne({email:req.body.email}).then(function(user){
   if(!user){
    const newUser = new User({
        firstName: req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password
     });
     bcrypt.genSalt(10,(err,salt)=>{
         bcrypt.hash(newUser.password, salt,(err,hash)=>{
            newUser.password = hash ;
            newUser.save().then(function(data){
                req.flash('success_register','You have successfully registered');
                res.redirect('/login');
             })
         })
     })
   }else{
    req.flash('error_message',' User exists!, Login instead!');  
    res.redirect('/register');
   }
    })
  
    
} 
    
});



router.get('/fullpost/:id', (req,res)=>{
Post.findOne({_id:req.params.id}).then(onepost=>{
    Category.find({}).then(function(category){
    res.render('home/fullpost',{found:onepost, category:category});
    })
})
});

module.exports = router;