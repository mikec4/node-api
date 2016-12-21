require('./config/config');
const express=require('express');
const bodyparser=require('body-parser');
const _=require('lodash');

const {ObjectID}=require('mongodb');
const {Post}=require('./models/post');

var app=express();

app.use(bodyparser.json());

var PORT=process.env.PORT;


//create posts
app.post('/posts',(req,res)=>{
 
 var post =new Post({
     text:req.body.text
 });

 post.save().then((post)=>{
     if(!post)return Promise.reject();

     res.send(post);

 }).catch((e)=>res.status(404).send(e));

});

//getting all posts

app.get('/posts',(req,res)=>{
    Post.find().then((posts)=>{
       if(!posts) return Promise.reject();
       res.send(posts);
    }).catch((e)=>res.status(404).send(e));
});

//getting posts by id
app.get('/posts/:id',(req,res)=>{
  
  var id=req.params.id;
  
   if(!ObjectID.isValid(id)) return res.status(404).send();

  Post.findById(id).then((post)=>{
      if(!post)return Promise.reject();

      res.send(post);
  }).catch((e)=>res.status(400).send());
});
//update posts

app.patch('/posts/:id',(req,res)=>{
  
  var id=req.params.id;
  
  var body=_.pick(req.body,['text']);


  if(!ObjectID.isValid(id))return res.status(404).send();

  Post.findByIdAndUpdate(id,{
      $set:body
  },{
      new:true
    }).then((post)=>{
        if(!post)return Promise.reject();

        res.send(post);
  }).catch((e)=>res.status(400).send());
  
});



//delete by id

app.delete('/posts/:id',(req,res)=>{
  
  var id=req.params.id;

  if(!ObjectID.isValid(id))return res.status(404).send();

    
    Post.findByIdAndRemove(id).then((post)=>{
        if(!post) return Promise.reject();

        res.send(post);
    }).catch((e)=>res.status(400).send(e));
});

//delete all
app.delete('/posts',(req,res)=>{
  Post.remove({}).then((posts)=>{
     if(!posts) return Promise.reject();

     res.send(posts);

  }).catch((e)=>res.status(404).send());

});

app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
});



module.exports={app};