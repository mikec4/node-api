const {mongoose}=require('./../db/mongoose-connect');


var postSchema=mongoose.Schema({
    text:{
        type:String,
        required:true
    }
});

var Post =mongoose.model('Posts',postSchema);

module.exports={Post};