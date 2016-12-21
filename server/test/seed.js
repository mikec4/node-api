const {Post}=require('./../models/post');
const {ObjectID}=require('mongodb');

var postOneId=new ObjectID();
var postTwoId=new ObjectID();
var posts=[
    {
        _id:postOneId,
        text:"first post"
    },
    {
        _id:postTwoId,
        text:"Second post"
    }
];


const populatePosts=(done)=>{
    Post.insertMany(posts).then((posts)=>{
     done();
    })
    .catch((e)=>done(e));
};

module.exports={posts,populatePosts};