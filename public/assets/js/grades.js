      $(document).ready(function () {
        // initialize materialize
        $('.modal').modal();
        $(".button-collapse ").sideNav();
        $('.button-collapse').sideNav('hide');
        $(".dropdown-button").dropdown();
        $('select').material_select();

        // get all assignments and put in a dropdown form
        $.get("/api/assignments").then(makeForm);

        function makeForm(data) {
            data.map(function(allAssignments){
                console.log(allAssignments);
                var $selectDropdown = $("#assignments-select");
                var option = `<option value=${allAssignments.assignName} data-id=${allAssignments.id}>
                ${allAssignments.assignName}</option>`;
                $("#assignments-select").append(option);
                // trigger event
                $selectDropdown.trigger('contentChanged');
            });
        }

        $('select').on('contentChanged', function() {
            // re-initialize (update)
            $(this).material_select();
        });

        $('#add-grade').on('click', function(event) {

            event.preventDefault();
            // get the assignment id from the selected option
            var assignmentId = $("option:selected").data("id");
            console.log("assignment", assignmentId);
            var grade = $("#grade-input").val();
            // check that the form is filled out
            if ($("#assignments-select").val() == 0 || grade == 0 ) {
                alert("Please fill both required fields");
                return;
            } 
            
            console.log("grade:", grade, "assignmentId", assignmentId);
        
            studentId = 1;
            // new object to post to the database
            var newGrade = {
                AssignmentId: assignmentId,
                StudentId: studentId,
                grade: grade
            }

            // send an AJAX POST-request with the new grade
            $.ajax({
                type: "post",
                url: "/api/grades",
                data: JSON.stringify(newGrade),
                contentType: 'application/json',
                dataType: 'json'
            }).then(function(data) { 
                console.log(data);
            });
        
    });
});