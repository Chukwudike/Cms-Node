const express= require('express');
const router = express();
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');

router.get('/',(req,res)=>{
    Comment.find({user:req.user.id}).populate('user').then(comments=>{
        res.render('admin/comments/index',{comment:comments});  
        //console.log(comments);
    })
   
})

router.post('/', (req, res)=>{
    Post.findOne({_id:req.body.id}).then(post=>{
        const newComment = new Comment({
            user : req.user.id,
            body : req.body.body
        });
        post.comments.push(newComment);
        post.save().then(postncomment=>{
            newComment.save().then(savedcomment=>{
                res.redirect(`/fullpost/${post._id}`);
            })
        })
    })
});

router.delete('/:id', (req,res)=>{
    Comment.remove({_id : req.params.id}).then(comment=>{
        Post.findOneAndUpdate( {comments:req.params.id},{ $pull : {comments:req.params.id } },(err,data)=>{
            if(err) throw err;
            res.redirect('/admin/comments/');
            console.log(data);
        } )
        
    })
})



module.exports = router;