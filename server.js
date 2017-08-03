'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
//import bcrypt (which we need to secure seed data password)
var bCrypt = require('bcrypt-nodejs');
// Authentication dependencies
var passport = require('passport');
var session = require('express-session');
const fileUpload = require('express-fileupload');
require('node-jsx').install();

// Models
var db = require('./models');

// Initialize app method
let app = express();

// set PORT variable
const PORT = process.env.PORT || 8080;

//Static directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// For Passport
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// parse application/json
app.use(bodyParser.json());

//Routes
//=================================================

// Authentication routes
require('./routes/authRoutes.js')(app, passport);
// load passport strategies
require('./config/passport/passport.js')(passport, db.Teachers);
//load amazon web service route
// require('./routes/upload')(app);
// load api routes
require('./routes/apiRoutes')(app);

// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true }).then(function(results) {
//   db.sequelize.sync({ force: true });
// });

db.sequelize
  .sync({
    // Force true deletes your data every time you restart
    force: true
  })
  .then(function() {
    app.listen(PORT, function() {
      console.log('App listening on PORT ' + PORT);
      // generate hashed password for seed data for testing purposes
      var jenPass = bCrypt.hashSync('testpass', bCrypt.genSaltSync(8), null);
      db.Teachers
        .create({
          name: 'Jen',
          email: 'jen@testteacher.com',
          password: jenPass
        })
        .then(function(teacher) {
          console.log(teacher);
          db.Students
            .bulkCreate([
              {
                name: 'Eyad Qassem',
                email: 'eyad@unc.edu',
                imgUrl:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/150px-Placeholder_no_text.svg.png',
                TeacherId: 1
              },
              {
                name: 'Henrietta Sharpe',
                email: 'henrietta@unc.edu',
                imgUrl:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/150px-Placeholder_no_text.svg.png',
                TeacherId: 1
              },
              {
                name: 'India Evans',
                email: 'india@unc.edu',
                imgUrl:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/150px-Placeholder_no_text.svg.png',
                TeacherId: 1
              },
              {
                name: 'Brittni Wright',
                email: 'india@unc.edu',
                imgUrl: 'http://img.usmagazine.com/social/beyonce-d5c55b42-2de9-48f4-84c4-bbd89bb622c8.jpg',
                TeacherId: 1
              }
            ])
            .then(function(teacher) {
              console.log(teacher);
              db.Assignments
                .bulkCreate([
                  {
                    assignName: 'TechnicalInterview'
                  }
                ])
                .then(function(student) {
                  db.Grades
                    .bulkCreate([
                      {
                        grade: 81,
                        AssignmentId: 1,
                        StudentId: 1
                      },
                      {
                        grade: 101,
                        AssignmentId: 1,
                        StudentId: 2
                      },
                      {
                        grade: 86,
                        AssignmentId: 1,
                        StudentId: 3
                      },
                      {
                        grade: 91,
                        AssignmentId: 1,
                        StudentId: 4
                      }
                    ])
                    .then(function(value) {
                      // db.Dates
                      //   .create({
                      //     schoolDates: Date.now()
                      //   })
                      //   .then(function(currDate) {
                      //     db.Attendance
                      //       .bulkCreate([
                      //         {
                      //           presence: 'Absent',
                      //           DateId: 1,
                      //           StudentId: 1
                      //         },
                      //         {
                      //           presence: 'Tardy-Excused',
                      //           DateId: 1,
                      //           StudentId: 2
                      //         },
                      //         {
                      //           presence: 'Tardy-Unexcused',
                      //           DateId: 1,
                      //           StudentId: 3
                      //         },
                      //         {
                      //           presence: 'Present',
                      //           DateId: 1,
                      //           StudentId: 4
                      //         }
                      //       ])
                      //       .then(function(attendance) {
                      // console.log(attendance);

                      console.log(value);
                      db.Students
                        .findAll({
                          include: [
                            {
                              model: db.Grades,
                              include: [
                                {
                                  model: db.Assignments
                                }
                              ]
                            },
                            {
                              model: db.Attendance,
                              include: [
                                {
                                  model: db.Dates
                                }
                              ]
                            }
                          ],
                          raw: true
                        })
                        .then(function(student) {
                          console.log(student);
                        });
                    });
                });
            });
        });
    });
  });
// });
// });
