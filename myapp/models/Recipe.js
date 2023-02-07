const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var recipeSchema = new Schema({
  title: String,
  ingredients: String,
  instructions: String,
  imageUrl: String,
});

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
