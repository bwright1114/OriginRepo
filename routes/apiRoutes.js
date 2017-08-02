var db = require('../models');
const bodyParser = require('body-parser');
var moment = require('moment');

module.exports = function(app) {
  // parse application/json
  app.use(bodyParser.json());

  //route for retrieving all students associated with a specific teacher
  app.get('/api/students/:id', function(req, res) {
    var id = req.params.id;
    db.Students
      .findAll({
        where: { TeacherId: id }
      })
      .then(function(results) {
        res.json(results);
      });
  });

  app.post('/api/students', function(req, res) {
    db.Students.create(req.body).then(function(students) {
      res.json(students);
    });
  });

  //route for retrieving all assignments
  app.get('/api/assignments', function(req, res) {
    db.Assignments.findAll({}).then(function(results) {
      res.json(results);
    });
  });

  // route for saving a new assignment
  app.post('/api/assignments', function(req, res) {
    db.Assignments
      .create({
        assignName: req.body.assignName
      })
      .then(function(assignment) {
        res.json(assignment);
      });
  });

  app.get('/api/attendance', function(req, res) {
    db.Dates
      .findAll({
        include: [
          {
            model: db.Attendance,
            include: [
              {
                model: db.Students
              }
            ]
          }
        ]
      })
      .then(function(currDate) {
        res.json(currDate);
      });
  });

  // attendance
  app.post('/api/attendance', function(req, res) {
    var currAttendance = req.body;
    console.log(req.body);
    var attendanceDate = currAttendance[0].attendanceDate;
    console.log(attendanceDate);
    var studentData = currAttendance[1];
    db.Dates
      .create({
        schoolDates: attendanceDate
      })
      .then(function(savedDate) {
        console.log(savedDate);
        for (var i = 0; i < studentData.length; i++) {
          db.Attendance
            .create({
              DateId: savedDate.id,
              StudentId: studentData[i].StudentId,
              presence: studentData[i].presence
            })
            .then(function(createdAttendance) {
              console.log(createdAttendance.dataValues);
            });
        }
        res.send(`sucessfully updated attendance for students for ${currAttendance[0].attendanceDate}`);
      });
  });

  // Post event
  app.post('/api/events', function(req, res) {
    db.Cal_Events.create(req.body).then(function(events) {
      res.json(events);
    });
  });

  // Get events
  app.get('/api/events/', function(req, res) {
    var id = req.params.id;
    var currentDate = new Date();
    var endDate = moment().add(7, 'days').toDate();
    console.log(endDate);
    db.Cal_Events
      .findAll({
        where: {
          eventDate: {
            $between: [currentDate, endDate]
          }
        }
      })
      .then(function(results) {
        res.json(results);
      });
  });

  // Count Absent
  app.get('/api/absent/:id', function(req, res) {
    var id = req.params.id;
    db.Attendance
      .count({
        where: {
          StudentId: id,
          presence: 'Absent'
        }
      })
      .then(function(results) {
        res.json(results);
      });
  });
};
