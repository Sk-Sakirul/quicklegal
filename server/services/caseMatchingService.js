const Case = require("../models/case.model");

const findSimilarCases = async (title, description, tags) => {
  const allCases = await Case.find();

  const matches = allCases.filter((c) => {
    const text = (
      c.title +
      " " +
      c.description +
      " " +
      c.tags.join(" ")
    ).toLowerCase();
    const keywords = (
      title +
      " " +
      description +
      " " +
      tags.join(" ")
    ).toLowerCase();
    return keywords.split(" ").some((word) => text.includes(word));
  });

  return matches;
};

module.exports = findSimilarCases;