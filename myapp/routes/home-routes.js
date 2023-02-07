const homeRoutes = (app) => {
  app.get("/tester", function (req, res) {
    res.render("tester");
  });

  app.get("/", (req, res) => {
    res.render("index", {
      user: req?.session?.passport?.user,
      title: "My pug app",
    });
  });
};

module.exports = { homeRoutes };
