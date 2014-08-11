$(document).ready(function () {
  var gain = $('#gain')[0];
  var silenceLevel = $('#silenceLevel')[0];

  for(var i=0; i<=100; i++) {
    gain.options[gain.options.length] = new Option(100-i);
    silenceLevel.options[silenceLevel.options.length] = new Option(i);
  }

  var appWidth = 24;
  var appHeight = 24;
  var flashvars = {'event_handler': 'microphone_recorder_events', 'upload_image': '../img/upload.png'};
  var params = {};
  var attributes = {'id': "recorderApp", 'name':  "recorderApp"};
  swfobject.embedSWF("flash/recorder.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);
})
