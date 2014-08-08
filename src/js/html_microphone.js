/**
 *  inject_html_microphone.js: injects html tailored for either WebRTC, or Flash
 *                             depending if 'getUserMedia' is supported
 */

$(document).ready(function() {
// local variables
  var $container = $('.microphone')
  var obj_mic = {};

// Feature Detection: getUserMedia
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

// HTML Structure: getUserMedia
  if (navigator.getUserMedia) {
    obj_mic['button_start']    = '<button class="buttonStart">Start</button>';
    obj_mic['button_stop']     = '<button class="buttonStop">Stop</button>';
    obj_mic['br']              = '<br/>';
    obj_mic['div_status']      = '<div>WebSocket: <span id="webSocketStatus">Not Connected</span></div>';
    obj_mic['div_volume']      = '<div>Volume: <span id="volume"></span></div>';
    obj_mic['div_volume_max']  = '<div>Volume Max: <span id="volumeMax"></span></div>';
    obj_mic['audio_controls']  = '<audio controls="controls" src="" id="audioPlayer">Audio tag not supported in your web browser</audio>';
  }
// HTML Structure: flash
  else {

  }

// Build HTML:
  $.each(obj_mic, function(i, data) {
    $container.append(data);
  });
});
