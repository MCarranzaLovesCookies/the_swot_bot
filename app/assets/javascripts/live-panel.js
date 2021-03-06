$(document).ready(function() {

  $('.other-function-container').hide();
  $('.attendance-container').hide();
  $('.assignments-container').hide();

  // $('.sortable').sortable();

  $('.behavior-container .student-icon').click(function() {
      $(this).toggleClass('active');
  });

  function confirmMessage(message) {
    $('<p class="confirm-message">'+message+'</p>').insertBefore('.icon-container').fadeOut(2000, function(){
      $(this).remove();
    });
  }

  function adjustIconValues(icon, action) {
    var positive_count = icon.find('.positive-count').html();
    var negative_count = icon.find('.negative-count').html();

    if(action.hasClass('positive-action')){
      var new_positive_count = (parseInt(positive_count) + 1)
      icon.find('.positive-count').html(new_positive_count);
    }
    if(action.hasClass('negative-action')){
      var new_negative_count = (parseInt(negative_count) + 1)
      icon.find('.negative-count').html(new_negative_count);
    }
  }

// ===============IPAD SPECIFIC EVENTS====================

 $('.swipe').addSwipeEvents().
  bind('swiperight', function(evt, swiperight) {
    $('.student-icon').removeClass('active');
    $('.student-icon').addClass('active');
  });

 $('.swipe').addSwipeEvents().
  bind('swipeleft', function(evt, swipeleft) {
    $('.student-icon').removeClass('active');
  });

// ==============FRONT PAGE BEHAVIOR ACTIONS=====================

  $('.behavior-container .submit-button').click(function(event) {
    var submit_action = $(this).attr('id'); 
    var data = [];
    var button_pushed = $(this);

    $('.behavior-container .active').each(function(){
      data.push($(this).data('id')); // Student ID
      adjustIconValues($(this), button_pushed);
      // console.log(this);
    });

    // console.log(data);
    var course_id = $('#course-id data').attr('id');
    var url = ('/live_class');
    var dataToSend = {action_name: submit_action,
                      student_ids : data, 
                      course_id: course_id}
    // console.log(dataToSend);                  
           
    $.post(url, dataToSend);
  
    confirmMessage("Student Behaviors Updated");
    $('.student-icon').removeClass('active');
    data = [];
  });

// ==================OTHER BEHAVIOR ACTIONS========================

  $('#other').click(function() {
    
    $('.grid-container').hide();
    $('.behavior-container').hide();
    $('.other-function-container').show();

    $('.other-function').click(function(){
      var submit_action = $(this).attr('id');
      var data = [];
      var button_pushed = $(this);
      
      $('.behavior-container .active').each(function(){
        data.push($(this).data('id'));
        adjustIconValues($(this), button_pushed);
      });
      // console.log(data);
      var url = ('/live_class');
      var course_id = $('#course-id data').attr('id');
      var dataToSend = {action_name: submit_action,
                        student_ids : data,
                        course_id: course_id }
      // console.log(dataToSend);

      $.post(url, dataToSend);
      confirmMessage("Student Behaviors Updated");
      $('.other-function-container').hide();
      $('.grid-container').show();
      $('.behavior-container').show();
      $('.student-icon').removeClass('active');
      data = [];
    });
  });

// ===============ATTENDANCE ACTIONS===================

  $('#attendance').click(function(){

    $('.behavior-container').hide();
    $('.attendance-container').show().find('.student-icon').addClass('on_time');
   
    var course_id = $('#course-id data').attr('id');
    var get_url = '/teachers/courses/'+course_id+'/liveclass'
    var on_time;
    var tardy;
    var absent;
    var icon;

    // get the current attendance from db (json)
    //set the classes for each icon to the attendance status
    $.get(get_url, function(response){
      // console.log(response);
      on_time = response.attendance['on-time']
      tardy = response.attendance.tardy
      absent = response.attendance.absent
      
      function set_class(status_array, class_name){
        $.each(status_array, function(i, v){
          icon = $(".attendance-container [data-id='" + v + "']");
          icon.removeClass();
          icon.addClass('student-icon '+class_name+'')
        });
      }

      set_class(on_time, "on_time");
      set_class(tardy, "tardy");
      set_class(absent, "absent");
    }, 'json');


    function toggleAttendance(currentIcon){
      // console.log(currentIcon);
      if($(currentIcon).hasClass('on_time')){
        $(currentIcon).removeClass('on_time');
        $(currentIcon).addClass('tardy');
      }
      else if($(currentIcon).hasClass('tardy')){
        $(currentIcon).removeClass('tardy');
        $(currentIcon).addClass('absent');
      }
      else if($(currentIcon).hasClass('absent')){
        $(currentIcon).removeClass('absent');
        $(currentIcon).addClass('on_time');
      }
    }
    
    $('.attendance-container .student-icon').click(function() {
      // console.log("clicked");
      toggleAttendance(this);  
    });

    $('#submit').click(function(){
      var data = [];
      var tardy_posts = [];
      var absent_posts = [];
      var on_time_posts = [];

      var submit_action = $(this).attr('id');

      $('.tardy').each(function(){
        tardy_posts.push($(this).data('id')); // Student ID
      });

      $('.absent').each(function(){
        absent_posts.push($(this).data('id')); // Student ID
      });

      $('.on_time').each(function(){
        on_time_posts.push($(this).data('id')); // Student ID
      });

      var course_id = $('#course-id data').attr('id');
      url = ('/live_class');
      dataToSend =  {
                    tardy : tardy_posts,
                    absent : absent_posts,
                    on_time : on_time_posts,
                    course_id : course_id
                    }

      $.post(url, dataToSend);
      confirmMessage("Student Attendance Updated");
      $('.attendance-container').hide();
      $('.behavior-container').show();
    });
  });

// ===================ASSIGNMENT ACTIONS======================

  $('#assignments').click(function(){

    $('.behavior-container').hide();
    $('.assignments-container').show();
    $('.assignments-container .student-icon').addClass('missing-assignment');
    $('.assignments-container .student-icon').addClass('complete').removeClass('missing-assignment');

    var course_id = $('#course-id data').attr('id');
    var get_url = '/teachers/courses/'+course_id+'/liveclass'

    $.get(get_url, function(response){
      // console.log(response);
      missing_assignments = response.assignments.missing_assignments;
      console.log(missing_assignments);
      
      function set_class(status_array){
        $.each(status_array, function(i, v){
          icon = $(".assignments-container [data-id='" + v + "']");
          icon.removeClass();
          icon.addClass('student-icon missing-assignment')
        });
      }

      set_class(missing_assignments);
    }, 'json');

    $('.assignments-container .student-icon').click(function() {
      $(this).toggleClass('missing-assignment');
      $(this).toggleClass('complete');
    });

    $('.assignment-button').click(function(){
      // var submit_action = $(this).attr('id');
      var data = [];
      
      $('.missing-assignment').each(function(){
        data.push($(this).data('id'));
      });
      // console.log(data);
      var url = ('/live_class');
      var course_id = $('#course-id data').attr('id');
      var assignment_id = $(this).parent().find('data').data('assignmentid');
      var dataToSend = {
                        student_ids : data,
                        assignment_id: assignment_id,
                        course_id: course_id
                        }
      // console.log(dataToSend);

      $.post(url, dataToSend);
      confirmMessage("Student Assignments Updated");
      $('.assignments-container').hide();
      $('.grid-container').show();
      $('.behavior-container').show();
      $('.student-icon').removeClass('missing-assignment');
      data = [];
    });
  });

// =====================MASTERY ACTIONS======================

});






