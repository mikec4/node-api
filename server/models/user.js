const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');



const {mongoose}=require('./../db/mongoose-connect');

var userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:"Invalid email"
        }
        
       

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6

    },
    tokens:[
        {
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }
    ]
});

userSchema.methods.generateToken=function(){
 var user=this;
 var access='auth';
 var tokenObject={
     _id:user._id.toHexString(),
     access
 };

 var token=jwt.sign(tokenObject,process.env.JWT_SECRET);

  user.tokens.push({access,token});

  return user.save().then(()=>{
      return token;
  });
// return new Promise((res,rej)=>{
//     if(token)return res(token);
//     else
//     return rej();
// })
 
};

userSchema.pre('save',function(next){
    var user=this;

   if(user.isModified('password')){

       bcrypt.genSalt(10,(e,salt)=>{
           if(e)return Promise.reject();

           bcrypt.hash(user.password,salt,(e,hash)=>{
               user.password=hash;
               next();
           });
       });
   }else{
       next();
   }
})

userSchema.statics.findUser=function(email,password){
  
  var User=this;
  
 var user= User.findOne({email}).then((user)=>{

      if(!user)return Promise.reject();

     return new Promise((res,rej)=>{

          bcrypt.compare(password,user.password,(e,result)=>{

              if(result){
                  res(user);
              }else{
                  rej();
              }

          })
      })
  })

  return user;
};

userSchema.statics.findByToken=function(token){

    var User=this;
    
   var decoded;

   try {
       decoded=jwt.verify(token,process.env.JWT_SECRET);
   } catch (e) {
       Promise.reject(e);

   }



 var user= User.findOne({
        _id:decoded._id,
        'tokens.token':token,
         'tokens.access':decoded.access

    });
   
   return user;  
}

userSchema.methods.removeToken=function(token){

    var user=this;
   return user.update({
      $pull:{
          tokens:{token}
      }
  });


    
}

var User=mongoose.model('Users',userSchema);


module.exports={User};