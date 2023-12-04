const User = require('../models/User');
const Post = require("../models/Post");
const asyncHandler = require('express-async-handler'); // using asynchandler package you don't need to use try-catch block. so that it automatically handles any error
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req,res) => {
    // Get all users from MongoDb
    const users = await User.find().select('-password').lean();

    if (!users?.length) {
        return res.status(400).json({message : "No Users Found!"});
    }

    return res.json(users);
});



// @desc Create new user
// @route POST /users
// @access Private
const createUser = asyncHandler(async (req,res) => {

    // destructured what is coming from the request body
    const {username, password, roles} = req.body;

    // confirm data
    if (!username || !password  || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required!'});
    }

    // checking for duplicate usernames
    const duplicate = await User.findOne({username}).lean().exec();

    if (duplicate) {
        return res.status(409).json({message : "Username is already taken!"});
    }

    // Encrypting the password
    const hashedPassword = await bcrypt.hash(password,10); //Salt rounds

    const userObject = {username, "password" : hashedPassword, roles}

    // Creating MongoDB document
    const user = await User.create(userObject);

    if (user) {
        return res.status(201).json({message : `New user ${username} created!`});
    }else{
        return res.status(400).json({message : "invalid user data recieved!"});
    }

});



// @desc UPDATE user
// @route PUT /users
// @access Private
const updateUser = asyncHandler(async (req,res) => {

    // Here the id is _id in mongoDB. this is an alias which is use to check the request in POSTMAN
    const {id, username, password, roles, email, active} = req.body;

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message: 'All fields are required!'});
    }

    // check the existence of particular user
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({message : "User not found!"});
    }


    // check for duplicates
    const duplicate = await User.findOne({username}).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message : "Username is already taken!"});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    // if password is passed
    if (password) {
        user.password = await bcrypt.hash(password,10);
    }

    // Here saving the user which is fetch by "findById" function above
    const updatedUser = await user.save();

    if (updatedUser) {
        res.status(201).json({message : `User ${updatedUser.username} updated!`});
    }else{
        res.status(400).json({message : `User ${updatedUser.username} can not be updated!`});
    }

});



// @desc DELETE user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req,res) => {

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({message : "User ID is needed!"});
    }

    // Check the user has an posts
    // An user can not be deleted if he is assigned to any posts
    const posts = await Post.findOne({user : id}).lean().exec();

    if (posts) {
        return res.status(400).json({ message: 'User has assigned posts' })
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({message : "User not found!"});
    }

    const deletedUser = await user.deleteOne();

    const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`

    res.json(reply);
});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}