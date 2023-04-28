var express = require('express');
var router = express.Router();
const path = require('path')
const multer= require("multer");
const UserModel = require('../models/user');
/* GET users listing. */
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req, 'res')
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        const userId = req.user._id.toString();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${userId}${fileExtension}`);
    }
});
const upload = multer({
    storage: storage,
   });
   
 
router.get('/user-profile', function(req, res, next) {
  res.render("user-profile",{layout:"main", userDetail:req.user});
});

router.post('/user-profile',upload.single('profile'), async function (req,res,next) {
    
    const {firstname, lastname, email} = req.body;
    const payload = {
        firstname, lastname, email
    };

    if(req.file) {
        payload.profile = req.file.filename
    }
    await UserModel.updateOne({_id : req.user._id}, { $set : payload });
    res.redirect('/post')
})

module.exports = router;
