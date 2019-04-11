$("#user-login").on("submit", function(e) {
  e.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/login",
    data: {
      email: $("#login-email")
        .val()
        .trim(),
      password: $("#login-password")
        .val()
        .trim()
    }
  })
    .then(function (data) {
      console.log(data);
      window.location.replace(data);
      // start();
    })
    .catch(function (err) {
      console.log(err);
      alert(err.responseText);
    });
});
