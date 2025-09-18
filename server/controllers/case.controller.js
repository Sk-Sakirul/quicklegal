const Case = require("../models/case.model");
const findSimilarCases = require("../services/caseMatchingService");

// Register new case
const createCase = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;

    // find similar cases
    const similarCases = await findSimilarCases(title, description, tags);

    // create new case
    const newCase = await Case.create({
      user: req.user._id,
      title,
      description,
      tags,
      relatedCases: similarCases.map((c) => c._id),
    });

    res.status(201).json({
      success: true,
      message: "Case registered successfully",
      case: newCase,
      similarCases, 
    });
  } catch (err) {
    next(err);
  }
};

// Get user's case
const getMyCases = async (req, res, next) => {
  try {
    const myCases = await Case.find({ user: req.user._id }).populate(
      "relatedCases",
      "title description tags"
    );
    res.status(200).json({
        success:true,
        myCases
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {createCase, getMyCases}