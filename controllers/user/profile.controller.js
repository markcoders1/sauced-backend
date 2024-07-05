const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs")

const changeName = async(req, res) => {
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
}

const changeImage = async (req, res) => {
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
}


module.exports ={
    changeName,
    changeImage
};