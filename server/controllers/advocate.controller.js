const Advocate = require("../models/advocate.model");

// Get all advocates
const getAdvocates = async (req, res, next) => {
  try {
    const advocates = await Advocate.find().populate("user", "name email");

    if (!advocates || advocates.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No advocates found",
      });
    }

    res.status(200).json({
      success: true,
      advocates,
    });
  } catch (error) {
    next(error);
  }
};

// Get single advocate profile
const getAdvocateById = async (req, res, next) => {
  try {
    const advocate = await Advocate.findById(req.params.advocateId).populate(
      "user",
      "name email"
    );

    if (!advocate)
      return res.status(404).json({
        success: false,
        message: "Advocate not found",
      });

    res.status(200).json({
      success: true,
      advocate,
    });
  } catch (error) {
    next(error);
  }
};

//Add createOrUpdateAdvocate
const createOrUpdateAdvocate = async (req, res, next) => {
  try {
    const { specialization, experience, hourlyRate, availability } = req.body;
    const userId = req.user._id; 

    // Update or create advocate profile linked to this user
    const advocate = await Advocate.findOneAndUpdate(
      { user: userId }, 
      {
        user: userId,
        specialization,
        experience,
        hourlyRate,
        availability,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("user", "name email role"); 

    res.status(200).json({
      success: true,
      advocate: {
        id: advocate._id,
        specialization: advocate.specialization,
        experience: advocate.experience,
        hourlyRate: advocate.hourlyRate,
        availability: advocate.availability,
        user: advocate.user, 
      },
      message: "Advocate profile created/updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { getAdvocates, getAdvocateById, createOrUpdateAdvocate };
