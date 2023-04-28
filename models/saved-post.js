const mongoose = require("mongoose");
const options = {
    timestamps:{
       createdOn:'created_at',
       updatedOn:'updated_at'
    }
};
const savedPostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
        

},options)


const SavedPostModel = mongoose.model("saved-post", savedPostSchema);
module.exports = SavedPostModel;