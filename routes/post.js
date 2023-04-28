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



router.get("/", async (req, res) => {
    const { archived, saved, mine, others, searchVal, sortBy, sortOrder } = req.query;
    const loggedInUser = new ObjectId(req.user._id);
    let match = {
        isArchived: false
    };
    let sortObj = {
        _id: -1
    }

    if (archived) {
        match.isArchived = true;
        match.postBy = loggedInUser;
    }

    if (saved) {
        const savedPosts = await SavedPostModel.find({ user: req.user._id }, { post: 1 }).lean();
        const savedPostIds = savedPosts.map(value => value.post);
        match._id = { $in: savedPostIds }
// console.log(savedPosts);


    }

    if (mine) {
        match.postBy = loggedInUser;

    }
    if (others) {
        match = { ...match, postBy: { $ne: loggedInUser } }

    }

    if (searchVal) {
        match = { ...match, $or: [{ 'title': { $regex: searchVal } }, { 'description': { $regex: searchVal } }] }
    }

    if (sortBy && sortOrder) {
        sortObj = { [sortBy]: parseInt(sortOrder) }
        console.log(sortObj);
    }


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
                                $eq: ["$user", new ObjectId(req.user._id)],
                                $eq: ["$post", "$$postId"]
                            },
                        }
                    },
                    { $project: { _id: 1 } }
                ],
                as: "savedPost"
            }
        },
        { $sort: sortObj },
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

    res.render("timeline", {
        layout: "main", userDetail: req.user, posts: posts, active: "post"
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
    console.log(typeof saved);

    if (saved == "true") {
        const data = await SavedPostModel.deleteOne({
            user: new ObjectId(req.user._id),
            post: new ObjectId(post)
        });
    } else {
         await SavedPostModel.create({
            user: req.user._id,
            post: req.body.post,

        });
    }

    res.json({})
})





module.exports = router;

