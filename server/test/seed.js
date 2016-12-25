const {Post}=require('./../models/post');
const {ObjectID}=require('mongodb');
const {User}=require('./../models/user');
const jwt=require('jsonwebtoken');


var postOneId=new ObjectID();
var postTwoId=new ObjectID();

var userOneId=new ObjectID();
var userTwoId=new ObjectID();


var users=[
    {
        _id:userOneId,
        email:"a@y.com",
        password:"1234567",
        tokens:[
            {
                access:'auth',
                token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET)
            }
        ]
    },
    {
        _id:userTwoId,
        email:"a1@y.com",
        password:"1234567",
         token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET)
    }
];


var posts=[
    {
        _id:postOneId,
        text:"first post",
        _userId:userOneId
    },
    {
        _id:postTwoId,
        text:"Second post",
        _userId:userTwoId
    }
];


const populateUsers=(done)=>{

var user1=new User(users[0]).save();
var user2=new User(users[1]).save();

return Promise.all([user1,user2])
.then(()=>{
    done();
}).catch((e)=>done(e));
    
}
const populatePosts=(done)=>{
    Post.insertMany(posts).then((posts)=>{
     done();
    })
    .catch((e)=>done(e));
};

module.exports={posts,populatePosts,users,populateUsers};