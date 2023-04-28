var express = require('express');
var router = express.Router();
const path = require('path')
const multer = require("multer");
const UserModel = require('../models/user');
const SavedPostModel = require('../models/saved-post');
const PostModel = require('../models/post');

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


router.get('/user-profile', function (req, res, next) {
    res.render("user-profile", { layout: "main", userDetail: req.user });
});

router.post('/user-profile', upload.single('profile'), async function (req, res, next) {

    const { firstname, lastname, email } = req.body;
    const payload = {
        firstname, lastname, email
    };

    if (req.file) {
        payload.profile = req.file.filename
    }
    await UserModel.updateOne({ _id: req.user._id }, { $set: payload });
    res.redirect('/post')
});


router.get("/users", async function (req, res, next) {
    const { searchUser, sortBy, sortOrder } = req.query;
    let search = {};
    let sortObj = {
        _id: 1
    }

    const savedPost = await UserModel.aggregate([
        {
            $lookup: {
                from: "saved-posts",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                                { $eq: ["$user", "$$id"] }

                        }
                    },

                    { $project: { _id: 1, firstname: 1, profile: 1 } }
                ],
                as: "user"
            }
        },
        { $unwind: "$user" }
    ])
    // const savedPosts = await SavedPostModel.find({ user: req.user._id }, { post: 1 });
    // console.log(savedPost);
    if (searchUser) {
        search = { ...search, $or: [{ 'firstname': { $regex: searchUser } }, { 'lastname': { $regex: searchUser } }, { 'email': { $regex: searchUser } }, { 'fullname': { $regex: searchUser } }] }

    }
    if (sortBy && sortOrder) {
        sortObj = { [sortBy]: parseInt(sortOrder) }
        console.log(sortObj);

    }
    const usersList = await UserModel.aggregate([
        { $match: search },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "postBy",
                as: "postdata"
            }

        }, {
            $lookup: {
                from: "saved-posts",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                                { $eq: ["$user", "$$id"] }

                        }
                    }
                ],
                as: "savedposts"
            }
        }, { $sort: sortObj },
        {
            $project: {
                firstname: 1,
                lastname: 1,
                profile: 1,
                email: 1,
                fullname: { $concat: ["$firstname", "$lastname"] },
                totalSaved: { $size: "$savedposts" },
                totalPosts: {
                    $size: "$postdata"
                }
            }
        }


    ]);
    //   console.log(usersList);
    // console.log(usersList);
    res.render("user-list", { layout: "main", userDetail: req.user, usersList: usersList, active: "user" })
});

router.get("/report", async function (req, res) {

    const userPost = await PostModel.countDocuments({ postBy: req.user._id });
    const userSavedPost = await SavedPostModel.countDocuments({ user: req.user._id });
    const savedPost = await PostModel.find({ postBy: req.user._id });
    const savedPostByOthers = await SavedPostModel.countDocuments({ post: { $in: savedPost } });
    console.log(savedPostByOthers);

    console.log(userSavedPost);
    res.render("user-report", { layout: "main", userDetail: req.user, userPost: userPost, userSavedPost: userSavedPost, savedPostByOthers: savedPostByOthers })
})



module.exports = router;
