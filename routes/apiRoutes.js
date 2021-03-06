const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const axios = require("axios");

module.exports = app => {
  // Get all examples
  app.get("/api/examples", isAuthenticated, (req, res) => {
    db.Example.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(dbExamples => {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", isAuthenticated, (req, res) => {
    db.Example.create({
      UserId: req.user.id,
      text: req.body.text,
      description: req.body.description
    }).then(dbExample => {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", isAuthenticated, (req, res) => {
    db.Example.destroy({ where: { id: req.params.id } }).then(dbExample => {
      res.json(dbExample);
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/profile");
  });

  // app.post("/api/login", (req, res) => {
  //   // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
  //   // So we're sending the user back the route to the members page because the redirect will happen on the front end
  //   // They won't get this or even be able to access this page if they aren't authed
  //   console.log(req.body);
  //   res.json("/profile");
  // });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    console.log(req.body);
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      instagram: req.body.instagram,
      facebook: req.body.facebook
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(422).json(err.errors[0].message);
      });
  });

  app.post("/api/saved_event", (req, res) => {
    console.log(req.body);
    db.Event.create({
      // eslint-disable-next-line camelcase
      eventbrite_id: req.body.eventbrite_id
    })
      .then(() => {
        res.redirect(307, "/profile");
      })
      .catch(err => {
        res.status(422).json(err.errors[0].message);
      });
  });

  app.get("/api/events", (req, res) => {
    axios
      .request({
        url:
          "https://www.eventbriteapi.com/v3/events/search?location.address=San+Diego&location.within=25mi&expand=venue",
        headers: { Authorization: `Bearer ${process.env.eventBriteToken}` }
      })
      .then(response => {
        res.json(response.data);
      });
  });

  // app.get("/api/categories", (req, res) => {
  //   axios
  //     .request({
  //       url: "https://www.eventbriteapi.com/v3/categories/",
  //       headers: { Authorization: `Bearer ${process.env.eventBriteToken}` }
  //     })
  //     .then(response => {
  //       res.json(response.data);
  //     });
  // });

  app.get("/api/:location/:id/:end_date", (req, res) => {
    const endpoint = "https://www.eventbriteapi.com/v3/events/search/";
    axios
      .request({
        url: `${endpoint}?categories=${req.params.id}&start_date.range_end=${
          req.params.end_date
        }T00:00:01Z&location.address=${
          req.params.location
        }&location.within=25mi&expand=venue`,
        headers: { Authorization: `Bearer ${process.env.eventBriteToken}` }
      })
      .then(response => {
        res.json(response.data);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};

// console.log(req.params.location);
// console.log(req.params.id);
// console.log(req.params.start_date);
// console.log(req.params.end_date);
