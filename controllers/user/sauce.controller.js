const { Sauce } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js")

const addSauce = async (req,res) => {
    try {
        // add sauce to db
        if (!req.body.name) {
            return res.status(400).json({message:"Sauce name is required"})
        }
        const user = await User.findOne({ email: req.user.email });
        const sauce = await Sauce.create({
            title:req.body?.title,
            name: req.body.name,
            type : req.body?.type,
            owner : user.id,
            description : req.body?.description,
            ingredients:req.body?.ingredients
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

const requestSauce = async (req, res) => {
  try {
    const { name, title, description } = req.body;
    console.log("HI");

    //! dont know who this request is for

    return res
      .status(200)
      .json({ message: "Sauce Request Submitted Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Something went wrong while Submitting a sauce request",
      });
  }
};

module.exports = {
    addSauce,
    requestSauce,
};
