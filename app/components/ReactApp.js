var React = require('react');
var helpers = require('./utils/helpers');

var ReactApp = React.createFactory(
  React.createClass({
    getInitialState: function() {
      return {
        students: []
      };
    },
    componentDidMount: function() {
      helpers.getStudents().then(
        function(students) {
          console.log(students);
          this.setState({
            students: students.data
          });
        }.bind(this)
      );
    },

    render: function() {
      return (
        <div className="collection with-header center">
          <div className="collection-header">
            <h5>
              Students 
              <a href="#add-student-modal" className="">
                <i className="material-icons orange-text"> add_circle</i>
              </a>
            </h5>
          </div>
          {this.state.students.map((students, i) => {
            return (
              <a href="#student-summary-modal" id={students.id} key={i} className="collection-item name listed-student">
                <span className="showId">{students.id}</span> | <span className="showStudentName">{students.name}</span>
              </a>
            );
          })}
        </div>
      );
    }
  })
);

module.exports.ReactApp = ReactApp;
