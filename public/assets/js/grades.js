      $(document).ready(function () {
        // initialize materialize
        $('.modal').modal();
        $(".button-collapse ").sideNav();
        $('.button-collapse').sideNav('hide');
        $(".dropdown-button").dropdown();
        $('select').material_select();

        $.get("/api/assignments").then(assignmentSelect(data));

        function assignmentSelect(data){
            for (var i = 0; i < data.length; i++){
                var option = $("<option>");
                option.text(data[i].assignName);
                option.attr("value", data[i].id);
                $("#assignments-select").append(option);
            }
        }

        $('#add-grade').on('click', function(event) {
            var assignmentId = $("#assignments-select").val();
            location.href = '/grades';
        });


        function postGrade(grade) {
            // check that the form is filled out
            if ($("#assignments-select").val() == 0 | $("#grade-input").val() == 0 ) {
                console.log("Please fill both required fields");
                return;
            }

            // new object to post to the database
            var newGrade = {
                assignmentId: assignmentId,
                studentId: studentId,
                grade: grade
            }

            // send an AJAX POST-request with the new grade
            $.post("/api/grades/:id", newGrade).done(function(data) { 
                
            });
        }

      });