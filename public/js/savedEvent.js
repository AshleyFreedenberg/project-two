$("#save_event").on("click", function(e) {
  e.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/saved_event",
    data: {
      // eslint-disable-next-line camelcase
      eventbrite_id: $("#eventID").val()
    }
  }).then(function(data) {
    console.log(data);
  });
});
