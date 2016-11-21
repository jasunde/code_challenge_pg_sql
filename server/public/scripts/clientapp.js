$(document).ready(function () {

  // get treats on load
  getTreats();

  /**---------- Event Handling ----------**/
  $('#searchButton').on('click', function (event) {
    event.preventDefault();

    var queryString = $('#search').val();

    searchTreats(queryString);
  });

  $('#saveNewButton').on('click', function(event) {
    event.preventDefault();

    var treateName = $('#treatNameInput').val();
    var treatDescription = $('#treatDescriptionInput').val();
    var treateURL = $('#treatUrlInput').val();

    var newTreat = {
      name: treateName,
      description: treatDescription,
      url: treateURL
    };

    postTreat(newTreat);
  });

  $('#treat-display').on('click', '.update', updateTreat);
  $('#treat-display').on('click', '.delete', deleteTreat);

  /**---------- AJAX Functions ----------**/

  // GET /treats
  function getTreats() {
    $.ajax({
      method: 'GET',
      url: '/treats',
    })
    .done(function (treatArray) {
      console.log('GET /treats returned ', treatArray);

      $.each(treatArray, function (index, treat) {
        appendTreat(treat);
      });
    });
  }

  // Search GET /treats/thing
  function searchTreats(query) {
    $.ajax({
      method: 'GET',
      url: '/treats/' + query,
    })
    .done(function (treatArray) {
      console.log('GET /treats/', query, 'returned ', treatArray);

      clearDom();

      $.each(treatArray, function (index, treat) {
        // add this treat to the DOM
        appendTreat(treat);
      });
    });
  }

  // POST /treats
  function postTreat(treat) {
    $.ajax({
      method: 'POST',
      url: '/treats',
      data: treat,
    })
    .done(function () {
      console.log('POST /treats sent ', treat);
      clearDom();
      getTreats();
    });
  }

  // PUT /treats/id
  function updateTreat() {
    var $treat = $(this).closest('.individual-treat');

    var treat = {};
    $treat.find('input').serializeArray().forEach(function (input) {
      treat[input.name] = input.value;
    });

    $.ajax({
      method: 'PATCH',
      url: '/treats/' + $treat.data('id'),
      data: treat,
      success: function (response) {
        clearDom();
        getTreats();
      },
      error: function (response) {
        console.log(response);
      }
    });
  }

  // DELETE /treats/id
  function deleteTreat() {
    var treatId = $(this).closest('.individual-treat').data('id');

    $.ajax({
      method: 'DELETE',
      url: '/treats/' + treatId,
      success: function (response) {
        clearDom();
        getTreats();
      },
      error: function (response) {
        console.log(response);
      }
    });
  }

  /** ---------- DOM Functions ----------**/

  function clearDom() {
    var $treats = $('#treat-display');
    $treats.empty();
  }

  function appendTreat(treat) {
    // append a treat to the DOM and add data attributes
    // treat-display -> treat row -> treat
    var $treats = $('#treat-display');

    var treatCount = $treats.children().children().length;

    if (treatCount % 2 === 0) {
      // add a treat row every 2 treats
      $treats.append('<div class="treat row"></div>');
    }

    var $treat = $('<div class="six columns individual-treat">' +
                  '<div class="image-wrap">' +
                  '<img src="' + treat.pic + '" class="u-max-full-width" />' +
                  '<div class="toggle row">' +
                  '<div class="six columns">' +
                  '<button class="edit u-full-width">Edit</button>' +
                  '</div>' +
                  '<div class="six columns">' +
                  '<button class="delete u-full-width">Delete</button>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '<label for="name' + treat.id + '">Name:</label>'+
                  '<input type="text" id="name' + treat.id + '" name="name" value="' + treat.name + '" />' +
                  '<label for="description' + treat.id + '">Description:</label>'+
                  '<input type="text" id="description' + treat.id + '" '+
                  ' name="description" value="' + treat.description + '" />'+
                  '<button class="update">Update</button>'+
                  '<button class="delete">Delete</button>'+
                  '</div>');

    $treat.data('id', treat.id);

    $('.treat:last-of-type').append($treat);
  }
});
