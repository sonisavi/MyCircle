const PostModel = require("../models/post");
const UserModel = require("../models/user");
const SavedPostModel = require("../models/saved-post");
const { ObjectId } = require('mongoose').Types;
const path = require('path');
const multer = require("multer");
var express = require('express');
var router = express.Router();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        const postImg = file.fieldname + "-" + Date.now();
        console.log(file);
        const fileExtension = path.extname(file.originalname);
        cb(null, `${postImg}${fileExtension}`);
    }
});
const upload = multer({
    storage: storage
});

// router.post("/:postId?", async (req, res) => {
//     console.log("postId ==========> ", req.params.postId);
//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             console.log("**************");
//             console.log(err.message);
//             res.end()
//             // A Multer error occurred when uploading.
//         } else if (err) {
//             console.log("-------------------")
//             console.log(err);
//             res.end()
//             // An unknown error occurred when uploading.
//         } else {
//             console.log("body",req.body);
//             console.log("hello");
//             res.end()
//         }
//         // Everything went fine.
//     })
//     res.end()
// });

router.get("/", async (req, res) => {
    const { archived, saved, mine, others, searchVal, sortBy,sortOrder } = req.query;
    const loggedInUser = new ObjectId(req.user._id);
    let match = {
        isArchived: false
    };
    let sortObj = {
      _id:-1
    }

    if (archived) {
        match.isArchived = true;
        match.postBy = loggedInUser;
    }

    if (saved) {
        const savedPosts = await SavedPostModel.find({ user: req.user._id }, { post: 1 }).lean();
        const savedPostIds = savedPosts.map(value => value.post);
        match._id = { $in: savedPostIds }
        // console.log('savedPosts', savedPosts);
    }
    // console.log('other  ===> ', others, loggedInUser);
    // console.log('mine  ===> ', mine, loggedInUser);
    if (mine) {
        match.postBy = loggedInUser;
        // sortObj = {[sortBy]:parseInt(sortOrder)}
    }
    if (others) {
        match = { ...match, postBy: { $ne: loggedInUser } }
        // match.postBy != loggedInUser;
        // console.log(req.query);
    }

    if (searchVal) {
        // console.log({...match , title :{$eq:searchVal}});
        match = { ...match, $or: [{ 'title': { $regex: searchVal } }, { 'description': { $regex: searchVal } }] }
    }

    if(sortBy && sortOrder){
        sortObj = {[sortBy]:parseInt(sortOrder)}
        console.log("dfgdfggfdgt");
    }
    // console.log("===============");
    // console.log(match);
    // console.log("match", match)

    const posts = await PostModel.aggregate([
        { $match: match },
        {
            $lookup: {
                from: "users",
                let: { id: "$postBy" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                                { $eq: ["$_id", "$$id"] }

                        }
                    },

                    { $project: { _id: 1, firstname: 1, profile: 1 } }
                ],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "saved-posts",
                let: { postId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$user", req.user._id],
                                $eq: ["$post", "$$postId"]
                            },
                        }
                    },
                    { $project: { _id: 1 } }
                ],
                as: "savedPost"
            }
        },
        { $sort : sortObj },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                image: 1,
                postBy: 1,
                isArchived: 1,
                createdAt: 1,
                updatedAt: 1,
                user: 1,
                saved: { $size: "$savedPost" }
            },
        }
    ]);
    // console.log(req.user._id);
    // console.log(posts)

    res.render("timeline", {
        layout: "main", userDetail: req.user, posts: posts
    })
});





router.get("/:postId", async (req, res) => {
    const post = await PostModel.findById(req.params.postId).lean();
    res.json(post);
});

router.post("/", upload.single('post-img'), async (req, res) => {

    console.log(req.body);
    const addPost = await PostModel.create({
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
        postBy: req.user._id
    })
    res.json(addPost)
});


router.put("/archive/:postId", async (req, res) => {
    // let postInfo = await PostModel.findById(req.params.postId);
    try {
        const isArchived = req.body.isArchived;
        let updatePost = await PostModel.updateOne({ _id: req.params.postId }, { $set: { isArchived: isArchived } });
        res.json("success")
    } catch (error) {
        console.log("error", error);
    }

})

// router.post("/", upload.single('post-img'), async (req, res) => {
//     console.log(req.body);
//     console.log(req.file);
// const { postId } = req.params.postId;
// const { title, description } = req.body;
// const image = req.file?.filename;


// console.log(image);
// if (postId) {
//     console.log(postId);
//     await PostModel.findByIdAndUpdate({_id:postId}, { title, description, image });

//     return res.send({
//         type:"success",
//         message:"Updated"
//     }); 
// }
// else{
//     const addPost = await PostModel.create({
//         title, description, image
//     })
//     return res.send(addPost); 
// }

//     res.end()


// });
router.put('/:postId', function (req, res) {
    var postId = req.params.postId;
    // var postData = req.body;
    let postData = PostModel.findById(req.params.postId);
    console.log(postData);
    PostModel.findByIdAndUpdate(postId, postData, function (err, updatedPost) {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        if (!updatedPost) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.send(updatedPost);
    });
});

// router.post("/:postId",upload.single('post-img'),async(req,res)=>{
//     const updatedPost= await PostModel.findByIdAndUpdate(postId,{title,description,image});
//      res.send(updatedPost)

// })

router.post("/save", async (req, res) => {

    const { saved, post } = req.body;
    console.log(saved);

    // const savePost= await PostModel.updateOne({_id:req.body.post},{$set:{isSaved:isSaved}});
    const savedPost = await SavedPostModel.create({
        user: req.user._id,
        post: req.body.post,

    });


    res.json(savedPost)
})





module.exports = router;
