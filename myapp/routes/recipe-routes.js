const Recipe = require("../models/Recipe");
const { body, validationResult } = require("express-validator");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

const recipeRoutes = (app) => {
  //a logged in user should be able to get a form that allows them to add recipes and submit the recipes to the api and have it persist in MongoDB
  app.get("/addrecipe", upload.single("image"), (req, res) => {
    res.render("addrecipe", { title: "Add Recipe" });
  });
  //a logged in user can post to the /addrecipe endpoint and have the recipe added to the database
  app.post(
    "/addrecipe",
    upload.single("recipeImage"),
    body("title").not().isEmpty().withMessage("Title is required"),
    body("ingredients").not().isEmpty().withMessage("Ingredients are required"),
    body("instructions")
      .not()
      .isEmpty()
      .withMessage("Instructions are required"),
    (req, res) => {
      console.log("req.body", req.body);
      console.log("req.file", req.file);
      //validate the user input
      const errors = validationResult(req);
      console.log("errors", errors);
      if (!errors.isEmpty()) {
        req.flash("error", "Add recipe failed! Please try again.");
        res.redirect("/addrecipe");
        return;
      }
      //add the recipe to the database
      try {
        const recipe = new Recipe({
          title: req.body.title,
          ingredients: req.body.ingredients,
          instructions: req.body.instructions,
          imageUrl: req.file.filename,
        });
        console.log("recipe", recipe);
        recipe.save((err) => {
          if (err) {
            console.log(err);
            req.flash("error", "Add recipe failed! Please try again.");
            res.redirect("/addrecipe");
            return;
          }
          req.flash("success", "Recipe added successfully!");
          res.redirect("/recipes");
        });
      } catch (err) {
        console.log(err);
        req.flash("error", "Add recipe failed! Please try again.");
        res.redirect("/addrecipe");
        return;
      }
    }
  );

  // Express route for editing a recipe
  app.get("/editrecipe/:id", async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    res.render("editrecipe", {
      recipe: recipe,
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageUrl: "/public/uploads/" + recipe.imageUrl,
    });
  });

  app.post(
    "/editrecipe/:id",
    upload.single("recipeImage"),
    body("title").not().isEmpty().withMessage("Title is required"),
    body("ingredients").not().isEmpty().withMessage("Ingredients are required"),
    body("instructions")
      .not()
      .isEmpty()
      .withMessage("Instructions are required"),
    async (req, res) => {
      const recipe = await Recipe.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        imageUrl: req.file.filename,
      });
      res.redirect("/recipes");
    }
  );
};

module.exports = { recipeRoutes };
