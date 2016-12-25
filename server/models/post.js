const {mongoose}=require('./../db/mongoose-connect');


var postSchema=mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    _userId:{
        type:mongoose.Schema.Types.ObjectId
    }
});

var Post =mongoose.model('Posts',postSchema);

module.exports={Post};