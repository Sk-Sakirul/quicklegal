const Advocate = require("../models/advocate.model");


// Get all advocates
const getAdvocates = async (req, res, next) => {
    try {
        const advocates = await Advocate.find().populate("user", "name email");

        if(!advocates || advocates.length === 0){
            return res.status(404).json({
                success : false,
                message: "No advocates found"
            })
        }

        res.status(200).json({
            success: true,
            advocates
        });
    } catch (error) {
        next(error);
    }
}

// Get single advocate profile
const getAdvocateById = async (req, res, next) => {
    try {
        const advocate = await Advocate.findById(req.params.id).populate('user', "name email");

        if(!advocate) return res.status(404).json({
            success: false,
            message: "Advocate not found"
        });

        res.status(200).json({
            success: true,
            advocate
        })
    } catch (error) {
        next(error);
    }
}

//Add Advocate Profile
const createAdvocate = async (req, res, next) => {
  try {
    const { specialization, experience, hourlyRate, availability } = req.body;

    const existingAdvocate = await Advocate.findOne({
      user: req.user.id || req.user._id,
    });
    if (existingAdvocate) {
      res.status(400);
      return next(new Error("Advocate profile already exists for this user"));
    }

    const advocate = await Advocate.create({
      user: req.user.id || req.user._id, 
      specialization,
      experience,
      hourlyRate,
      availability,
    });

    res.status(201).json({
      success: true,
      advocate,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {getAdvocates, getAdvocateById, createAdvocate};