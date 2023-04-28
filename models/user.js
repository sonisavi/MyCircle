const mongoose= require("mongoose");

const options = {
     timestamps:{
        createdOn:'created_at',
        updatedOn:'updated_at'
     }
};

const UserSchema= mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    gender:{
       type:String,
       enum:['Female','Male']
    },
    email:{
        type:String
    },
    password:{
        type:String 
    },
    profile: {
        type: String
    }
},options);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;

