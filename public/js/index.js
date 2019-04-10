// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

function queryEventbrite(location, startDate, endDate, categoryId) {
  const url = '/api/' + location + '/' + categoryId + '/' + startDate + '/' + endDate
  console.log(url);
  $.get(url, function (eventsData) {
    // // -----------------------------------------------------------------------
    // // directly below are specifically for the variables in the const url for this function
    console.log(eventsData);
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

    //   // TODO:
    //   // add a containing element to template to hold the cards
    //   // create a variable that references the containing element
    //   // copy michaels' event card example
    //   // create a variable to hold a new event card element (use jquery)
    // //   // add the new element to the page (also uses jquery)
    const event = eventsData.events;
    let cardData = "";
    for (let i = 0; i < event.length; i++) {
      let cardImg = event[i].logo.original.url
        ? event[i].logo.original.url
        : "https://placeholder.com/";
      cardData += `<div class="col-md-4"><div class="card">
    <img src="${cardImg}" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">${event[i].name.text}</h5>
        <p class="card-text"><small class="text-muted">${eventsData.location.augmented_location.city}</small></p>
        <p class="card-text">${event[i].description.text}</p>
        <p class="card-text"><small class="text-muted">${event[i].start.local}</small></p>
        <p class="card-text"><small class="text-muted">${event[i].end.local}</small></p>
    </div>
</div></div>`;
    }

    const $card = $(`
      <div class="card-deck">
          ${cardData}
      </div>
  `);
    const $container = $("#event-card-container");
    $container.append($card);
  });
}

queryEventbrite('San Diego', '2019-04-10', '2019-04-12', '103');

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
