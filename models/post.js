const mongoose= require("mongoose");
const UserModel= require("./user");

const options = {
    timestamps:{
       createdOn:'created_at',
       updatedOn:'updated_at'
    }
};

const PostSchema = mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    postBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    isArchived:{
        type:Boolean,
        default:false
    }
},options);

const PostModel = mongoose.model("post", PostSchema);
module.exports = PostModel;