const { STATUS_CODES } = require("http");
const Sauce = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");
const Follow = require("../../models/follow.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");
const { initializeAdmin } = require("../../services/firebase.js");
const admin = initializeAdmin();

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
        );

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

const deleteUser = async (req, res) => {
    try {
        //set logged in user's status to inactive and disable them from firebase as well
      const user = await User.findOne({ email:req.user.email });
      if (!user) return res.status(404).send({ message: "User not found." });
      const disabled = await admin
        .auth()
        .updateUser(user.uid, { disabled: true });
      user.status = "inactive";
      await user.save()
      res.status(200).send({ message: "User has been deleted.", disabled });
    } catch (error) {
      console.log(error);
      return res.status(400).json({message: "Something went wrong while Deleting user",
        error,
    });
    }
};

const reactivateUser = async (req, res) => {
	try {
        //set logged in user's status to active and undo disable from firebase as well
		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(404).send({ message: "User not found," });
		const activate = await admin
			.auth()
			.updateUser(user.uid, { disabled: false });
		user.status = "active";
		await user.save();
		res.status(200).send({ message: "User has been undeleted.", activate });
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong while undeleting user",
			error,
		});
	}
};

const getUser = async (req,res) => {
    try {
        //return current user and his followers count and following count
        const user = await User.findOne({ email: req.user.email });
        console.log(user);
        const following = await Follow.countDocuments({followGiver:user._id});
        const followers = await Follow.countDocuments({followReciever:user._id});
        return res.status(200).send({
            user: {
                // provider,
                ...user._doc,
                following,
                followers,
            }})
    } catch (error) {
        res.status(500).json({
			message: "Something went wrong while getting user details",
			error,
		});
    }
}


const addSauce = async (req,res) => {
    try {
        // add sauce to db
        if (!req.body.name) {
            return res.status(400).json({message:"Sauce name is required"})
        }
        const user = await User.findOne({ email: req.user.email });
        const sauce = await Sauce.create({
            name: req.body.name,
            type : req.body?.type,
            owner : user.id,
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

const welcome1 = async (req,res) =>{
    try {
        // return user's welcome boolean
        const welcome = req.user.welcome
        return res.status(200).json({welcome})

    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .json({message: "Something went wrong while showing welcome message",
            error,
        })
    }
}

const welcome2 = async (req,res) =>{
    try {
        // update user's welcome boolean to false
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    welcome: false
                },
            },
            { new: true }
        )
        user.save()
        const welcome = user.welcome
        return res.status(200).json({welcome});

    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .json({message: "Something went wrong while updating welcome boolean",
            error,
        })
    }
}

const getRandomUsers = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports ={
    changeName,
    changeImage,
    deleteUser,
    reactivateUser,
    addSauce,
    welcome1,
    welcome2,
    getUser,
    getRandomUsers
};