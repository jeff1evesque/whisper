/**
 * initializer.js:
 */

$(document).ready(function() {

// Local Variables
  var webworker_stream_audio;
  var audio_context;

// Test 'getUserMedia' Support
  try {
    initWebSocket();
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio_context = new AudioContext;
  } catch (e) {
    $('.message').html('Error with Web Audio: ' + e);
  }

 /**
  *  Prompts users permission to use the requested media device (camera or microphone),
  *  and initializes the corresponding media stream.
  *
  *  navigator.getUserMedia(constraints, sCallback, eCallback)
  *
  *  @contraints is an object that specifies which media stream (audio, or video) are
  *                            being requested by the browser.
  *
  *  @sCallback is a callback function, executed if 'getUserMedia' is successful.  If
  *                            'getUserMedia' is successful, the resulting media stream
  *                            object is passed to 'sCallback' as its only argument.
  *
  *  @eCallback is an optional callback function, executed if 'getUserMedia' fails.
  */

  navigator.getUserMedia({video: false, audio: true}, startUserMedia, function(e) {
    $('.message').html('Error initializing getUserMedia: ' + e);
  });

// Create WebSocket
  var sock = null;
  sock = new WebSocket("ws://localhost:9001");
  console.log("Websocket created...");

// WebSocket Definitions: executed when websocket performs defined action 
//                        (i.e. open, close, message, ...)
  sock.onopen = function() {
    console.log("connected to server");
    sock.send("CONNECTED TO YOU");
  }

  sock.onclose = function(e) {
    console.log("connection closed (" + e.code + ")");
  }

  sock.onmessage = function(e) {
    console.log("message received: " + e.data);
  }

// Send Random Byte
  $('.buttonStart').click(function() {
    startDataStream();
  });
  $('.buttonStop').click(function() {
    if (typeof(webworker_audio_stream) != 'undefined') {
      endDataStream();
    }
  });

 /**
  *  endDataStream(): terminates the WebWorker defined in 'startDataStream()'
  */

  function endDataStream() {
    webworker_audio_stream.terminate();
  }

 /**
  *  startDataStream(): connects to a WebWorker.
  *
  *                     A WebWorker is an HTML5 feature that allows javascript to be
  *                     run in the background independent of other scripts (threads), 
  *                     without affecting the performance of the page.  This portion
  *                     is considered the 'WebWorker Constructor'.
  *
  *  @webworker_audio_stream.onmessage is an event listener to the 'WebWorker'.  The
  *                     'event.data' parameter is used to acquire data from the WebWorker.
  *
  *  @webworker_audio_stream.postMessage('YOUR-DATA-HERE') sends data to the WebWorker.
  *                     However, if no parameter is supplied, postMessage() simply starts
  *                     the WebWorker.  The WebWorker receives data from this 
  *                     'WebWorker' Constructor by implementing the onmessage message:
  *
  *                     onmessage = function(event) {console.log(event.data)}
  */

  function startDataStream() {

    if(typeof(Worker) !== 'undefined') {
      var path = '../../src/js/webworker_stream_audio.js';
      webworker_audio_stream = new Worker(path);
      webworker_audio_stream.onmessage = function(event) {
        console.log(event.data);
        return event.data;
      }

    // Starts the WebWorker
      webworker_audio_stream.postMessage();
    }
    else {
      $('.message').html('Error: Your browser does not support "Web Worker"');
    }

  }  // Closes  function startDataStream() {}
  
 /**
  *  startUserMedia(): is the 'getUserMedia' callback, which gets executed upon
  *                    successfully connecting to a media device (camera, or microphone).
  *                    This function intializes the recorder by instantiating the
  *                    AudioRecorder() object, defined within 'audioRecorder.js'. 
  *
  *  @createMediaStreamSource(stream) creates an 'AudioNode' from the 'stream' object.
  *
  *  @stream is a global variable determined by 'navigator.getUserMedia()'.
  */

  function startUserMedia(stream) {
    var mediaStreamSource = context.createMediaStreamSource(stream);
  // Firefox hack https://support.mozilla.org/en-US/questions/984179
    window.firefox_audio_hack = input;
    recorder = new AudioRecorder(input, websocket, {}, callbackRecorder);
  }

});  // Closes $(document).ready(function() {}
