const express= require('express');
const router = express();
const Post = require('../../models/Post')
const faker = require('faker');

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.post('/generate', (req,res)=>{
    for(let i = 0; i < req.body.amount; i++ ){
        let post = new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.save(function(err){
            if (err) throw err;
        })
    }
    res.redirect('/admin/posts/posts');
})


module.exports = router;