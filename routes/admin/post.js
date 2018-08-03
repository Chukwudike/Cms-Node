const express= require('express');
const router = express();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const uploadhelper = require('../../helpers/upload_helper');
const fs = require('fs');
const {Protector} = require('../../helpers/protector');


router.all('*/',Protector,(req,res,next)=>{
    next();
})
router.get('/edit/:id', (req, res) => {
    Post.findOne({_id:req.params.id}).then(post=>{
        Category.find({}).then(category=>{
            res.render('admin/posts/edit',{found:post, category:category});
        })
        
    })
});

router.get('/posts', (req, res,next) => {
    Post.find({}).populate('category').then(function(posts){
        res.render('admin/posts/posts',{allpost:posts} );
       })
   
});

router.get('/create', (req, res) => {
    Category.find({}).then(category=>{
        //console.log(category);
        res.render('admin/posts/create',{category:category});
    })
   
});


router.put('/edit/:id',(req,res)=>{
Post.findOne({_id : req.params.id}).then(post=>{
    if(req.body.allowComments){
        req.body.allowComments = true;
    }else{
        req.body.allowComments = false;
    }
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = req.body.allowComments;
    post.body = req.body.body;
    post.category= req.body.category;
    
    if(!uploadhelper.isEmpty(req.files)){
       
        let file = req.files.file;
        filename = Date.now() + '-' +file.name;
        post.file = filename;
        file.mv('./public/uploads/'+filename, function(err){
            if (err) throw err;
        })
    
        }

    post.save().then(updatedPost=>{
        res.redirect('/admin/posts/posts');
    })
})
})

router.delete('/delete/:id',(req,res)=>{
    Post.findOne({_id : req.params.id}).populate('comments').then(post=>{
        fs.unlink('./public/uploads/'+post.file, function(err){
            if(!post.comments.length < 1){
                post.comments.forEach(comment=>{
                    comment.remove();
                })
            }
            post.remove().then(postremoved=>{
                req.flash('success_message','This post was deleted successfully');
                res.redirect('/admin/posts/posts');
            })
        })
    })
    })


router.post('/create', (req, res) => {

    let filename = 'nodeejs.png';

    if(!uploadhelper.isEmpty(req.files)){
       
    let file = req.files.file;
    filename = Date.now() + '-' +file.name;
    file.mv('./public/uploads/'+filename, function(err){
        if (err) throw err;
    })

    }

    if(req.body.allowComments){
        req.body.allowComments = true;
    }else{
        req.body.allowComments = false;
    }
    const newPost = new Post(
        { 
          title : req.body.title,
          status : req.body.status,
          allowComments : req.body.allowComments,
          body : req.body.body,
          file : filename,
          category: req.body.category
        });

    newPost.save().then(function(data)
    {
    req.flash('success_message','This post was added successfully');
    res.redirect('/admin/posts/posts');
       
    })
   
    
});

router.get('/generate', (req,res)=>{
res.render('admin/posts/index');
})






module.exports = router;