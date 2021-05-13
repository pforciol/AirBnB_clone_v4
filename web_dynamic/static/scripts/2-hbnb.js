const checkAmenities = function () {
  const checkedAmenities = {};
  let displayAmenities = [];
  $('.amenities .popover input').change(function () {
    if ($(this).prop('checked')) {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete checkedAmenities[$(this).attr('data-id')];
    }
    displayAmenities = Object.values(checkedAmenities).sort();
    $('.amenities h4').text(displayAmenities.join(', '));
  });
};

const checkApiStatus = function () {
  $.getJSON('http://localhost:5001/api/v1/status', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
};

$(() => {
  checkAmenities();
  checkApiStatus();
});
