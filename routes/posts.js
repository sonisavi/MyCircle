// const PostModel = require("../models/user");
// var express = require('express');
// var router = express.Router();
// const path = require('path');
// const multer = require("multer");

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // console.log(req, 'res')
//         cb(null, 'public/images/uploads')
//     },
//     filename: (req, file, cb) => {
//         const postImg = file.fieldname + "-" + Date.now();
//         const fileExtension = path.extname(file.originalname);
//         cb(null, `${postImg}${fileExtension}`);
//     }
// });
// const upload = multer({
//     storage: storage
// });


// router.post("/:postId?", upload.single('post-img'), async (req, res) => {

//     const { postId } = req.params;
//     const { title, description } = req.body;
//     const image = req.file?.filename;

//     if (postId) {
//         await PostModel.findByIdAndUpdate(postId, { title, description, image });

//         return res.send({
//             type:"success",
//             message:"Updated"
//         }); 
//     }
//     else{
//         const addPost = await PostModel.create({
//             title, description, image
//         })
//         return res.send(addPost); 
//     }

   
// });

// module.exports = router;