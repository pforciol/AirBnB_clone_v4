// const host = 'localhost';
const host = '0.0.0.0';

const checkedAmenities = {}, checkedStates = {}, checkedCities = {};

const checkAmenities = function () {
  let displayAmenities = [];
  $('.amenities .popover input').change(function () {
    if ($(this).prop('checked')) {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete checkedAmenities[$(this).attr('data-id')];
    }
    displayAmenities = Object.values(checkedAmenities).sort();
    if (displayAmenities.length != 0)
      $('.amenities h4').text(displayAmenities.join(', '));
    else
      $('.amenities h4').html("&nbsp;");
  });
};

const checkStates = function () {
  let displayStates = [];
  $('.locations .popover h2 input').change(function () {
    if ($(this).prop('checked')) {
      checkedStates[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete checkedStates[$(this).attr('data-id')];
    }
    checkBoth();
  });
};

const checkCities = function () {
  $('.locations .popover li ul li input').change(function () {
    if ($(this).prop('checked')) {
      checkedCities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete checkedCities[$(this).attr('data-id')];
    }
    checkBoth();
  });
};

const checkBoth = function () {
  alltogether = Object.assign({}, checkedStates, checkedCities);
  displayAll = Object.values(alltogether).sort();
  if (displayAll.length != 0)
    $('.locations h4').text(displayAll.join(', '));
  else
    $('.locations h4').html("&nbsp;");
}

const checkApiStatus = function () {
  $.getJSON(`http://${host}:5001/api/v1/status`, (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
};

const fetchPlaces = function (amenitiesFilter = {}, statesFilter = {}, citiesFilter = {}) {
  $.ajax({
    url: `http://${host}:5001/api/v1/places_search`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ amenities: Object.keys(amenitiesFilter), states: Object.keys(statesFilter), cities: Object.keys(citiesFilter) }),
    success: (data) => {
      data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      $('section.places').empty();
      for (const place of data) {
        $.ajax({
          url: `http://${host}:5001/api/v1/users/${place.user_id}`,
          type: 'GET',
          contentType: 'application/json',
          success: (user) => {
            const article = `
            <article id="${place.id}">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guests</div>
                <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
              </div>
              <div class="user">
                <strong>Owner:</strong>&nbsp;
                ${user.first_name} ${user.last_name}
              </div>
              <div class="description">
                ${place.description}
              </div>
              <div class="reviews">
                <h2>Reviews <span class="toggleReviews">(show)</span></h2>&nbsp;
              </div>
            </article>`;
            $('section.places').append(article);
          }
        });
      }
    }
  }
  );
};

const toggleReviews = function (doc) {
  const id = $(doc).closest('article').attr('id');
  
  if ($(doc).text().match('(show)')) {
    $(doc).text("(hide)");
    $.ajax({
      url: `http://${host}:5001/api/v1/places/${id}/reviews`,
      type: 'GET',
      contentType: 'application/json',
      success: (reviews) => {
        if (reviews.length > 0) {
          for (const review of reviews) {
            
          }
        }
      }
    })
  }
}



$(() => {
  checkAmenities();
  checkStates();
  checkCities();
  checkApiStatus();
  fetchPlaces(checkedAmenities, checkedStates, checkedCities);
  $('button').on('click', () => {
    fetchPlaces(checkedAmenities, checkedStates, checkedCities);
  });
  $('SECTION.places').on('click', '.toggleReviews', function () {
    toggleReviews(this);
  })
});
