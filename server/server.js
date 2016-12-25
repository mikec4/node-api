-require('./config/config');
const express=require('express');
const bodyparser=require('body-parser');
const _=require('lodash');
const jwt=require('jsonwebtoken');


const {ObjectID}=require('mongodb');
const {Post}=require('./models/post');
const {User}=require('./models/user');
const {authenticate}=require('./middleware/authenticate');


var app=express();

app.use(bodyparser.json());

var PORT=process.env.PORT;


//create posts
app.post('/posts',authenticate,(req,res)=>{
 
 var post =new Post({
     text:req.body.text,
     _userId:req.user._id
 });

 post.save().then((post)=>{
     if(!post)return Promise.reject();

     res.send(post);

 }).catch((e)=>res.status(404).send(e));

});

//getting all posts

app.get('/posts',authenticate,(req,res)=>{
    
    Post.find({
        _userId:req.user._id
    }).then((posts)=>{
       if(!posts) return Promise.reject();
       res.send(posts);
    }).catch((e)=>res.status(404).send(e));
});

//getting posts by id
app.get('/posts/:id',authenticate,(req,res)=>{
  
  var id=req.params.id;
  
   if(!ObjectID.isValid(id)) return res.status(404).send();

  Post.findById(id).then((post)=>{
      if(!post)return Promise.reject();

      res.send(post);
  }).catch((e)=>res.status(400).send());
});
//update posts

app.patch('/posts/:id',authenticate,(req,res)=>{
  
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

app.delete('/posts/:id',authenticate,(req,res)=>{
  
  var id=req.params.id;

  if(!ObjectID.isValid(id))return res.status(404).send();

    
    Post.findByIdAndRemove(id).then((post)=>{
        if(!post) return Promise.reject();

        res.send(post);
    }).catch((e)=>res.status(400).send(e));
});

//delete all
app.delete('/posts',authenticate,(req,res)=>{
  Post.remove({}).then((posts)=>{
     if(!posts) return Promise.reject();

     res.send(posts);

  }).catch((e)=>res.status(404).send());

});

//create a user

app.post('/users',(req,res)=>{

var body=_.pick(req.body,['email','password']);


var user=new User(body);

user.save().then((user)=>{
     if(!user)return Promise.reject();

res.send({user});

}).catch((e)=>res.status(400).send(e));
  
});

//user login

app.post('/users/login',(req,res)=>{

var body=_.pick(req.body,['email','password']);

   User.findUser(body.email,body.password).then((user)=>{
        
        if(!user)return Promise.reject();
        

    return user.generateToken().then((token)=>{
        res.header('x-auth',token).send(user);
    });

   }).catch((e)=>res.status(400).send(e));


});

//logout
app.delete('/users/logout',authenticate,(req,res)=>{
     var token=req.token;
     var user=req.user;
     
    user.removeToken(token).then((user)=>{
       
       if(!user)return Promise.reject();

       res.send(user);

    }).catch((e)=>res.status(400).send(e));
})
//get current user

app.get('/users/me',authenticate,(req,res)=>{
   
   res.send(req.user);
});



//get user by id
app.get('/users/:id',(req,res)=>{

    var _id=req.params.id;

    if(!ObjectID.isValid(_id))return res.status(404).send();

    User.findById(_id).then((user)=>{
        if(!user)return Promise.reject();

        res.send(user);
    }).catch((e)=>res.status(400).send(e));

});

//get all users
app.get('/users',(req,res)=>{
    
   User.find({}).then((users)=>{
       if(!users)return Promise.reject();

       res.send({users});
   }).catch((e)=>{
       res.status(400).send(e);
   });
});




app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
});



module.exports={app};