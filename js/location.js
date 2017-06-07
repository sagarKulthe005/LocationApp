/**File contains code to get location using users co-ordinates*/

var map;
var infowindow;
var service;

/**Function to get user's current co-ordinates*/
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/**Function to get near by places to user using his/her co-ordinates*/
function initMap(data) {
  var coOrdinate = { lat: data.coords.latitude, lng: data.coords.longitude };

  map = new google.maps.Map(document.getElementById('map'), {
    center: coOrdinate,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: coOrdinate,
    radius: 500,
    type: ['store']
  }, nearByPlaces);
}

/**Function which will contain near by places to user*/
function nearByPlaces(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

/**Function to create markers around found places*/
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var request = {
    placeId: place.place_id
  };

  service.getDetails(request, callback);

  function callback(placeDetails, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var html = "<div id='infoWindow'>";
      html += "<span class='clsTipTitle'>" + placeDetails.name + "<span><br/>";
      html += "<span class='clsTipContent'>" + placeDetails.formatted_address + "</span><br/><br/>";


      if (placeDetails.formatted_phone_number) {
        html += "<span class='clsTipTitle'>Phone: <span><br/>";
        html += "<span class='clsTipContent'>" + placeDetails.formatted_phone_number + "</span><br/><br/>";
      }

      if (placeDetails.website) {
        html += "<span class='clsTipTitle'>Website: <span><br/>";
        html += "<span class='clsTipContent'>" + placeDetails.website + "</span><br/><br/>";
      }

      if (placeDetails.opening_hours) {
        var weekData = placeDetails.opening_hours.weekday_text;
        var startOfWeek = '';
        var timing = '';
        var endOfWeek = '';
        var closeDay = '';

        /**get day of the week*/
        var day = new Date();
        var dayNumber = day.getDay();

        html += "<span class='clsTipTitle'>Operating Hours: <span><br/>";
        html += "<table  class='clsTipContent'>"
        for (var count = 0; count < weekData.length; count++) {
          var status = weekData[count].split(":");
          /**To highlight todays entry */
          if (dayNumber == (count + 1)) {
            if (status.length == 4) {
              html += "<tr class='clsTipTitle'><td>" + status[0] + "</td><td>" + status[1] + ':' + status[2] + ':' + status[3] + "</td></tr>";
            }
            else {
              html += "<tr class='clsTipTitle'><td>" + status[0] + "</td><td>" + status[1] + "</td></tr>";
            }
          }
          else {
            if (status.length == 4) {
              html += "<tr><td>" + status[0] + "</td><td>" + status[1] + ':' + status[2] + ':' + status[3] + "</td></tr>";
            }
            else {
              html += "<tr><td>" + status[0] + "</td><td>" + status[1] + "</td></tr>";
            }
          }
        }
        html += "</table>";
      }
      html += "</div>";

      /**Create marker */
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(html);
        infowindow.open(map, this);
      });
    }
  }

}
