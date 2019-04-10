$(document).ready(function() {
  function start() {
    $("#signUpForm").hide();
    $("#login").hide();
  }
  start();

  $("#signup").on("click", function(e) {
    e.preventDefault();
    $("#signUpForm").show();
    $("#login").hide();
    $("#signUpForm")[0].scrollIntoView();
  });

  $("#user-sign-up").on("click", function(e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/api/signup",
      data: {
        name: $("#name")
          .val()
          .trim(),
        email: $("#email")
          .val()
          .trim(),
        username: $("#username")
          .val()
          .trim(),
        password: $("#password")
          .val()
          .trim(),
        instagram: $("#instagram")
          .val()
          .trim(),
        facebook: $("#facebook")
          .val()
          .trim()
      }
    })
      .then(function (data) {
        console.log(data);
        window.location.replace(data);
        start();
      })
      .catch(function (err) {
        console.log(err);
        alert(err.responseText);
      });
  });

})