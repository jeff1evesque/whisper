/**
 * getusermedia.js: default to Flash, if `getUserMedia` is not supported
 */

$( document ).ready(function() {

// getUserMedia() feature detection
  navigator.getUserMedia_ = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

  if ( navigator.getUserMedia_ ) {

  }
  else {

  }

});
