/**
 * detect_getusermedia.js: add respective classnames for 'getUserMedia', or 'Flash' support
 */

$( document ).ready(function() {

// getUserMedia() feature detection
  navigator.getUserMedia_ = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

  if ( navigator.getUserMedia_ ) {
    $('microphone').addClass('getusermedia_supported');
  }
  else {
    $('microphone').addclass('flash_supported');
  }

});
