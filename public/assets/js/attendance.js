'use strict';
$(document).ready(function() {
  function initHandlers() {
    $('#submit-attendance-btn').on('click', submitAttendance);
    $('.modal').modal();
    $('select').material_select();
    datePickerInit();
  }

  function datePickerInit() {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      format: 'yyyy-mm-dd',
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false // Close upon selecting a date,
    });
  }

  function getTeacher() {
    $.get('/api/teacher_data').then(function(teacher) {
      console.log(teacher);
      displayStudents(teacher);
    });
  }

  function displayStudents(teacher) {
    console.log(teacher);
    var id = teacher.id;
    $.get(`/api/students/${id}`).then(function(data) {
      console.log(data);
      // code to show data on the page
      var choices = ['Present', 'Present-Tardy', 'Absent'];
      for (var i = 0; i < data.length; i++) {
        var studentName = data[i]['name'];
        var studentId = data[i]['id'];
        var listItem = $(`
        <li class='collection-item'>
        <p id=${studentId}>Student Id: ${studentId} | ${studentName}</p>
        <form>
          ${generateDropdown(studentId, studentName, studentName, choices[0])}
          ${generateDropdown(studentId, studentName, studentName + 1, choices[1])}
          ${generateDropdown(studentId, studentName, studentName + 2, choices[2])}
        </form>
        </li>`);
        $('#append-here').append(listItem);
      }
    });
  }

  function generateDropdown(studentId, studentName, inputId, choices) {
    studentName = studentName.replace(/ /g, '');
    inputId = inputId.replace(/ /g, '');
    var dropDown = `
      <p> 
        <input data-student-id=${studentId} class='with-gap students' name=${studentName} id=${inputId} type='radio' value=${choices} />
        <label for=${inputId}> ${choices}</label>
      </p>`;
    return dropDown;
  }

  function submitAttendance() {
    var submitAttendanceData = [];
    var attendanceDate = {
      attendanceDate: $('#attendance-date').val()
    };
    console.log(attendanceDate);
    var studentValues = $.map($('input:radio:checked'), function(elem, i) {
      var studentId = $(elem).data('student-id');
      var presence = $(elem).val();
      return {
        StudentId: studentId,
        presence: presence
      };
    });
    submitAttendanceData.push(attendanceDate);
    submitAttendanceData.push(studentValues);
    console.log(submitAttendanceData);

    $.ajax({
      type: 'post',
      url: '/api/attendance',
      data: JSON.stringify(submitAttendanceData),
      contentType: 'application/json',
      dataType: 'json'
    }).then(function(response) {
      console.log(response);
    });
  }

  initHandlers();
  getTeacher();

  // ===================================================
  // Future facial recognition
  var video = document.querySelector('#videoElement');

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true }, handleVideo, videoError);
  }

  function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
  }

  function videoError(e) {
    // do something
    console.log('not working!');
  }
});
