//create article template
function createArticleTemplate() {
  //data for a single article
  let article = `
    <div class='col-xl-3 col-sm-12 my-2' >
      <div data-id='{{ id }}' class='card'>
        <img class='card-img-top img-fluid' src='{{ image }}' alt='article image' />
        <div class='card-body'>
          <h5 class='card-title'>
            <a href='{{ link }}' target='_blank'>{{ title }}</a>
          </h5>
          <p class='card-text'>{{ teaser }}</p>
          <a href='#noteCollapse-{{ id }}' class='btn btn-primary' data-toggle='collapse' role='button' aria-expanded='false' aria-controls='#noteCollapse-{{ id }}'>Notes</a>
          
          <div id='noteCollapse-{{ id }}' class='collapse'>
            <ul id="notes-{{ id }}" class="list-group list-group-flush">
              {{> noteList note=note articleId=id}}
            </ul>
            <form class='my-3' onsubmit="return false">
              <div class='from-group mb-3'>
                <label for='noteBox-{{ id }}'>Note:</label>
                <textarea class='form-control' id='noteBox-{{ id }}' rows='3'></textarea>
              </div>
              <button type='submit' class='btn btn-success save-note' data-id='{{ id }}'>Save Note</button>
            </form>
          </div>
        </div>
      </div>
    </div>`;
  Handlebars.registerPartial("noteList", `
    {{#each note}}
      <li class="list-group-item">
        <div class='row'>
          <div class='col'>
            {{ this.body }}
          </div>
          <div class='col text-right'>
            <button type='submit' class='btn btn-danger delete-note mr-auto' data-id='{{ this._id }}' data-article-id='{{ ../articleId }}'>X</button>
          </div>
        </div>
      </li>
    {{/each}}
  `);
  return Handlebars.compile(article);
}

//get the article template
const articleTemplate = createArticleTemplate();

// Grab the articles as a json
function getArticles() {
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i += 4) {
      // Display the apropiate information on the page
      let row = $('<div class="row align-items-center article-row">');
      let end = Math.min(i + 4, data.length);
      for (let j = i; j < end; j++) {
        let articleData = {
          id: data[j]._id,
          image: data[j].image,
          link: data[j].link,
          title: data[j].title,
          teaser: data[j].teaser,
          note: data[j].note
        }
        row.append(articleTemplate(articleData));
      }
      $("#articles").append(row);
    }
  });
}
//load articles onto the page
getArticles();

// When you click the savenote button
$(document).on("click", ".save-note", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  let noteBoxSelector = `#noteBox-${thisId}`;
  let noteListSelector = `#notes-${thisId}`;
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $(noteBoxSelector).val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $(noteListSelector).empty();
      //render the new notes
      $(noteListSelector).append(Handlebars.partials["noteList"]({ note: data.note, articleId: data._id }));
    });

  // Also, remove the values entered in the input and textarea for note entry
  $(noteBoxSelector).val("");
});
// When you click the X button inside the note list
$(document).on("click", ".delete-note", function () {
  // Grab the id associated with the article from the submit button
  let thisArticleId = $(this).attr("data-article-id");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  let noteListSelector = `#notes-${thisArticleId}`;
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: `/articles/${thisArticleId}/${thisId}`
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $(noteListSelector).empty();
      //render the new notes
      $(noteListSelector).append(Handlebars.partials["noteList"]({ note: data.note, articleId: data._id }));
    });
});
//when someone clicks on the scrape new articles link
$(document).on("click", "#scrape", function () {
  // Run a GET request to run the scrape
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);

      // Empty the articles
      $(".article-row").empty();

      //scrape the articles
      getArticles();
    });
});