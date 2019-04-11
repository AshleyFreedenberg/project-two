$(document).ready(function() {
  function start() {
    $("#signUpForm").hide();
    $("#loginForm").hide();
  }
  start();

  $("#signup").on("click", function(e) {
    e.preventDefault();
    $("#signUpForm").show();
    $("#loginForm").hide();
    $("#signUpForm")[0].scrollIntoView();
  });

  $("#login").on("click", function(e) {
    e.preventDefault();
    $("#signUpForm").hide();
    $("#loginForm").show();
    $("#loginForm")[0].scrollIntoView();
  });

  $("#search").on("click", function(e) {
    e.preventDefault();
    const date = $("#datepicker").val();
    const location = $("#location").val().trim();
    const category = $(".categories").val();
    console.log(date);
    console.log(location);
    console.log(category);
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