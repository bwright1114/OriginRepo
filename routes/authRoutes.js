const path = require('path');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactApp = React.createFactory(require('../app/components/ReactApp.js').ReactApp);

// ROUTES FOR USER AUTHENTICATION
module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('landing');
  });

  // These bring us to the main page with modals for sign up / sign in
  app.get('/signup', function(req, res) {
    res.render('landing');
  });

  app.get('/signin', function(req, res) {
    res.render('landing');
  });

  // When new user signs up we will take them to class summary
  // (redirect to sign up form if fails)
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/class',
      failureRedirect: '/signup'
    })
  );

  // only authenticated users should see class summary
  app.get('/class', isLoggedIn, function(req, res) {
    var reactHtml = ReactDOMServer.renderToString(ReactApp({}));
    // output rendered by react
    res.render('class', { reactOutput: reactHtml });
  });

  // only authenticated users should see assignments
  app.get('/assignments', isLoggedIn, function(req, res) {
    res.render('assignments');
  });

  // only authenticated users should see attendance
  app.get('/attendance', isLoggedIn, function(req, res) {
    res.render('attendance');
  });

    // only authenticated users should see attendance
  app.get('/grades', isLoggedIn, function(req, res) {
    res.render('grades');
  });

  // when user logs out, destory the session and redirect to home
  app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
      res.redirect('/');
    });
  });

  // When existing user signs in take them to class summary
  // (redirect to sign-in form if fails)
  app.post(
    '/signin',
    passport.authenticate('local-signin', {
      successRedirect: '/class',
      failureRedirect: '/signin'
    })
  );

  // Route for getting some data about our teacher to be used client side
  app.get('/api/teacher_data', function(req, res) {
    if (!req.user) {
      // If the user is not logged in, send back a filler name
      res.json({
        name: 'Teacher'
      });
    } else {
      // This capitalizes the first letter of each name, and lowercase all others
      req.user.name = req.user.name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      });

      // Otherwise send back the user's name
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // custom middleware to protect routes after logging in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    else res.redirect('/signin');
  }
};
