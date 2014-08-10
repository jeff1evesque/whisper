/**
 *  html_microphone.js: injects html tailored for either WebRTC, or Flash,
 *                      depending on 'getUserMedia' browser support.
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
    obj_mic['control_panel']   = '\
        <div class="control_panel audio">\
          <a class="record_button" onclick="FWRecorder.record(\'audio\', \'audio.wav\');" href="javascript:void(0);" title="Record">\
            <img src="assets/img/record.png" width="24" height="24" alt="Record" />\
          </a>\
          <a class="play_button" style="display:none;" onclick="FWRecorder.playBack(\'audio\');" href="javascript:void(0);" title="Play">\
            <img src="assets/img/play.png" width="24" height="24" alt="Play" />\
          </a>\
          <a class="pause_button" style="display:none;" onclick="FWRecorder.pausePlayBack(\'audio\');" href="javascript:void(0);" title="Pause">\
            <img src="assets/img/pause.png" width="24" height="24" alt="Pause" />\
          </a>\
          <div class="level"></div>\
        </div>\
      ';

    obj_mic['details']         = '\
        <div class="details">\
          <button class="show_level" onclick="FWRecorder.observeLevel();">Show Level</button>\
          <button class="hide_level" onclick="FWRecorder.stopObservingLevel();" style="display: none;">Hide Level</button>\
          <span id="save_button">\
            <span id="flashcontent">\
              <p>Your browser must have JavaScript enabled and the Adobe Flash Player installed.</p>\
            </span>\
          </span>\
          <div id="status">Recorder Status...</div>\
          <div>Duration: <span id="duration"></span></div>\
          <div>Activity Level: <span id="activity_level"></span></div>\
          <div>Upload status: <span id="upload_status"></span></div>\
        </div>\
      ';

    obj_mic['upload_form']     = '\
        <form id="uploadForm" name="uploadForm" action="php/upload.php">\
          <input name="authenticity_token" value="xxxxx" type="hidden">\
          <input name="upload_file[parent_id]" value="1" type="hidden">\
          <input name="format" value="json" type="hidden">\
        </form>\
      ';

    obj_mic['h4_config_mic']   = '<h4>Configure Microphone</h4>';

    obj_mic['mic_config']      = '\
        <form class="mic_config" onsubmit="return false;">\
          <ul>\
            <li>\
              <label for="rate">Rate</label>\
              <select id="rate" name="rate">\
                <option value="44">44,100 Hz</option>\
                <option value="16" selected>16,000 Hz</option>\
                <option value="11">11,025 Hz</option>\
                <option value="8">8,000 Hz</option>\
                <option value="5">5,512 Hz</option>\
              </select>\
            </li>\
            <li>\
              <label for="gain">Gain</label>\
              <select id="gain" name="gain"></select>\
            </li>\
            <li>\
              <label for="silenceLevel">Silence Level</label>\
              <select id="silenceLevel" name="silenceLevel"></select>\
            </li>\
            <li>\
              <label for="silenceTimeout">Silence Timeout</label>\
              <input id="silenceTimeout" name="silenceTimeout" value="2000"/>\
            </li>\
            <li>\
              <input id="useEchoSuppression" name="useEchoSuppression" type="checkbox"/>\
              <label for="useEchoSuppression">Use Echo Suppression</label>\
            </li>\
            <li>\
              <input id="loopBack" name="loopBack" type="checkbox"/>\
              <label for="loopBack">Loop Back</label>\
            </li>\
            <li>\
              <button onclick="configureMicrophone();">Configure</button>\
            </li>\
          </ul>\
        </form>\
      ';
  }

// Build HTML:
  $.each(obj_mic, function(i, data) {
    $container.append(data);
  });
});
