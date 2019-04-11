// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// const moment = require('moment');
// moment().format();

function queryEventbrite(location, endDate, categoryId) {
  const url = "/api/" + location + "/" + categoryId + "/" + endDate;
  const $container = $("#event-card-container");
  $container.empty();

  $.get(url, function (eventsData) {
    const event = eventsData.events;
    const showBtn = (window.location.pathname === "/profile") ? '<button type="button" id="search" class="btn btn-outline-success">Save Event!</button>': "";
    let cardData = "";
    for (let i = 0; i < event.length; i++) {
      let cardImg = event[i].logo.original.url
        ? event[i].logo.original.url
        : "https://placeholder.com/";
      cardData += `<div class="col-md-4"><a href="${eventsData.events[i].url}" target="_blank"><div class="card"><br>
    <img src="${cardImg}" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">${event[i].name.text}</h5>
        <p class="card-text"><small class="text-muted">${eventsData.location.augmented_location.city}</small></p>
        <p class="card-text"><span class="d-inline-block text-truncate" style="max-width: 200px;">${event[i].description.text}</span></p>
        <p class="card-text"><small class="text-muted">${moment(eventsData.events[i].end.local).format('dddd MMMM Do YYYY')}</small></p>
        ${showBtn}
       
    </div>
    </a>
</div>
<br>
</div>`;
    }
    const $card = $(`
      <div class="card-deck">
          ${cardData}
      </div>
  `);
    $container.append($card);
  });
}
// ${moment(eventsData.events[i].end.local).format('dddd MMMM Do YYYY')}
// queryEventbrite();

$("#search").on("click", function (e) {
  e.preventDefault();
  const date = moment($("#datepicker").val()).format("YYYY-MM-DD");
  const location = $("#location").val().trim();
  const category = $(".categories").val();
  console.log(date);
  console.log(location);
  console.log(category);
  queryEventbrite(location, date, category);
});

queryEventbrite("San Diego", "2019-05-19", "103");

// -----------------------------------------------------------------------------------------
// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

 //     // console.log(eventsData.location.augmented_location);
    //     // console.log(eventsData.events[1].category_id);
    //     // console.log(eventsData.events[1].end.local);
    //     // console.log(eventsData.events[1].start.local);

    //     // // -----------------------------------------------------------------------
    //     // // // location details (to print to the events cards, etc.)
    //     // console.log(eventsData.location.augmented_location.city);
    //     // console.log(eventsData.location.augmented_location.region);
    //     // console.log(eventsData.location.augmented_location.country);

    //     // // -----------------------------------------------------------------------
    //     // console.log(eventsData.events[1]);
    //     // console.log(eventsData.events[1].url);
    //     // console.log(eventsData.events[1].description.text);
    //     // console.log(eventsData.events[1].name.text);
    //     // -----------------------------------------------------------------------

    // const eventBriteStartDate = event[i].start.local;
    // const eventBriteEndDate = event[i].end.local;
    // const convertedDate = moment() 