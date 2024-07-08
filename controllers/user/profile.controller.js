const { STATUS_CODES } = require("http");
const Sauce = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs")

const changeName = async(req, res) => {
    //update logged in user's name
    try {
        let {newName} = req.body
        if (!newName) {
            return res.status(400).json({message:"Error: new name cant be empty."})
        }
        if (req.user.name === newName) {
            return res.status(400).json({message:"Error: Old name and new name are the same."})
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    name: newName
                },
            },
            { new: true }
        ).select("-password");

		return res.status(200).json({
			message: "User Name Changed Successfully",
			user,
		});
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .json({message: "Something went wrong while changing name",
            error
        })
    }
};

const changeImage = async (req, res) => {
    //upload image and overwrites user's previous image
    try {
        if (!req.file) {
            console.log("Image not found");
            return res.status(400).json({message: "Image not found"})
        }
        const user = await User.findOne({ email: req.user.email });
        user.image = baseUrl + "uploads/" + req.file.filename;
        const updatedUser = await user.save();

        return res.status(200).json({
			message: "Image Updated Successfully",
			updatedUser,
		});
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .json({message: "Something went wrong while changing image",
            error
        })
    }
};

const deleteUser = async (req,res) => {
    //set logged in user's status to inactive
    try {
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    status: "inactive"
                },
            },
            { new: true }
        ).select("-password");

		return res.status(200).json({
			message: "User Deleted Successfully",
			user,
		});
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .json({message: "Something went wrong while Deleting user",
            error,
        })
    }
};

const addSauce = async (req,res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({message:"Sauce name is required"})
        }
        const user = await User.findOne({ email: req.user.email });
        const sauce = await Sauce.create({
            name: req.body.name,
            type : req.body?.type,
            owner : user._id,
            description : req.body?.description
        }) 
        
		return res.status(200).json({
			message: "Sauce Added Successfully",
			sauce,
		});
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .json({message: "Something went wrong while Adding Sauce",
            error,
        })
    }
};

module.exports ={
    changeName,
    changeImage,
    deleteUser,
    addSauce,
};