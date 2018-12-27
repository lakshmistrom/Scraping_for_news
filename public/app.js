// Grab the articles as a json
$.getJSON("/articles", function (data) {
  //data for a single article
  let article = `
      <div class='col-xl-3 col-sm-12 my-2' >
        <div data-id='{{ id }}' class='card'>
          <img class='card-img-top img-fluid' src='{{ image }}' alt='article image' />
          <div class='card-body'>
            <h5 class='card-title'>
              <a href='{{ link }}'>{{ title }}</a>
            </h5>
            <p class='card-text'>{{ teaser }}</p>
            <div class="row justify-content-between">
              <div class="col-auto">
                <a href='#' class='btn btn-primary'>Save</a>
              </div>
              <div class="col-auto">
                <a href='#noteCollapse-{{ id }}' class='btn btn-primary' data-toggle='collapse' role='button' aria-expanded='false' aria-controls='#noteCollapse-{{ id }}'>Notes</a>
              </div>
            </div>
            <div id='noteCollapse-{{ id }}' class='collapse'>
              <form class='my-3'>
                <div class='from-group mb-3'>
                  <label for='noteBox'>Note:</label>
                  <textarea class='form-control' id='noteBox' rows='3'></textarea>
                </div>
                <button type='submit' class='btn btn-success'>Save Note</button>
              </form>
            </div>
          </div>
        </div>
    </div>`;
  let template = Handlebars.compile(article);
  // For each one
  for (var i = 0; i < data.length; i += 4) {
    // Display the apropiate information on the page
    let active = (i === 0) ? 'active' : '';
    let carItem = $(`<div class="carousel-item ${active} ">`);
    let row = $('<div class="row row-nowrap align-items-center">');
    let end = Math.min(i + 4, data.length);
    for (let j = i; j < end; j++) {
      let articleData = {
        id: data[j]._id,
        image: data[j].image,
        link: data[j].link,
        title: data[j].title,
        teaser: data[j].teaser
      }
      row.append(template(articleData));
    }
    carItem.append(row);
    $("#articles").append(carItem);
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
