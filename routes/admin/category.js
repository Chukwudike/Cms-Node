const express= require('express');
const router = express();
const Category = require('../../models/Category');

router.get('/', (req,res)=>{
    Category.find({}).then(function(category){
        res.render('admin/category/index',{category:category});
    })
   
})

router.post('/create', (req,res)=>{
    const newCategory = new Category(
        { 
          name : req.body.name,
        });

        newCategory.save().then(function(data)
    {
    req.flash('success_message','This category was created with success');
    res.redirect('/admin/categories/');
       
    })
})

router.delete('/delete/:id',(req,res)=>{
    Category.findOne({_id : req.params.id}).then(category=>{
    category.remove();
    // req.flash('success_message','This post was deleted successfully');
    res.redirect('/admin/categories/');
    })
    })

    router.get('/edit/:id', (req,res)=>{
        Category.findOne({_id:req.params.id}).then(post=>{
            res.render('admin/category/edit',{category:post});
        })
       
    })

    router.put('/edit/:id', (req,res)=>{
        Category.findOne({_id:req.params.id}).then(post=>{
            post.name = req.body.name;
            post.save().then(function(){
            res.redirect('/admin/categories/');
            })
        
        })
       
    })
module.exports = router;