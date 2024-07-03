const User = require("../models/user.model.js");

const changeName = async(req, res) => {
    try {
        let {newName} = req.body
        const user = await User.findById(req.user.id).select(
			"-password -__v"
		);
        if (user.name === newName) {
            return res.status(400).json({message:"Error: Old name and new name are the same."})
        }
        user.name = newName;
		await user.save();

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

module.exports ={
    changeName,
};