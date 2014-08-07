/**
 * initializer.js:
 */

// Global Variables
  var websocket = null;
  var recorder = null;
  var audio_context;
  var webworker_stream_audio;
  var websocket_uri = 'ws://localhost:9001';
  var WEBWORKER_AUDIO_RECORDER = '../../src/js/audioRecorderWorker.js';

$(document).ready(function() {

// Initialize Media Stream (getUserMedia)
  initMediaStream();

  try {
  // Initialize WebSocket
    initWebSocket();

  // AudioContext controls the audio processing interface
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio_context = new AudioContext;
  } catch (e) {
    $('.message').html('Error with Web Audio: ' + e);
  }

// Send Random Byte
  $('.buttonStart').click(function() {
    if (recorder) {
      recorder.start();
    }
  });
  $('.buttonStop').click(function() {
    if (recorder) {
      recorder.stop();
    }
  });

});  // Closes $(document).ready(function() {}

 /**
  *  callbackRecorder(): callback function from the 'recorder' object defined
  *                      within the 'startUserMedia()' function.  This function
  *                      acquires the blob data from the server, and distributes
  *                      it to the client side.
  *
  *  @x is an 'object literal' parameter defined where this callback is passed 
  *                      into (audioRecorder.js).
  */

  function callbackRecorder(x) {
    if (typeof(x.volume) !== 'undefined') {
      document.getElementById("volume").innerHTML = Math.floor(x.volume);
    }
    if (typeof(x.volumeMax) !== 'undefined') {
      document.getElementById("volumeMax").innerHTML = Math.floor(x.volumeMax);
    }
  }

 /**
  *  startUserMedia(): is the 'getUserMedia' callback, which gets executed upon
  *                    successfully connecting to a media device (camera, or microphone).
  *                    This function intializes the recorder by instantiating the
  *                    AudioRecorder() object, defined within 'audioRecorder.js'. 
  *
  *  @createMediaStreamSource(stream) creates a MediaStreamAudioSourceNode object, which is an
  *    AudioNode that acts as an 'audio source'.  To build such an object, the global 'stream'
  *    object needs to be passed in as a parameter.
  *
  *    In general, an AudioNode represents audio sources, the audio destination, and
  *    intermediate processing modules, connected together to form the AudioContext for
  *    rendering audio to the audio hardware.  AudioNodes are the building blocks of an
  *    'AudioContext', and an AudioContext are a set of AudioNode objects and their
  *    connections.  An AudioContext allows for arbitrary routing of signals to the
  *    'AudioDestinationNode'.
  *
  *  @stream is a global object determined by 'navigator.getUserMedia()'.
  */

  function startUserMedia(stream) {
    var mediaStreamSource = audio_context.createMediaStreamSource(stream);
  // Firefox hack https://support.mozilla.org/en-US/questions/984179
    window.firefox_audio_hack = mediaStreamSource;
    recorder = new AudioRecorder(mediaStreamSource, websocket, {}, callbackRecorder);
  }

 /**
  *  initWebSocket(): initializes the websocket
  *
  *  WebSocket Events
  *
  *  @Socket.onopen occurs when socket connection is established
  *  @Socket.onmessage occurs when client receives data from server
  *  @Socket.onerror occurs when there is an error in communication
  *  @Socket.onclose occurs when connection is closed
  *
  *  WebSocket Methods
  *
  *  @Socket.send() method transmits data using the connection
  *  @Socket.close() method used to terminate any existing connection
  *
  *  Send JSON-formatted string to the server
  *    var msg = {
  *      type = "message",
  *      text: document.getElementById("text").value
  *    };
  *    Socket.send(JSON.stringify(msg));
  *
  *  Receive JSON-formatted string from the server
  *    var msg = JSON.parse(e.data);
  *
  *    switch(msg.type) {
  *      case 'message':
  *        clientID = msg.text;
  *        break;
  *      case 'username':
  *      ...
  *    }
  */ 

  function initWebSocket() {

  // Create WebSocket
    websocket = new WebSocket(websocket_uri);
    console.log("Websocket created...");

  // WebSocket Definitions: executed when triggered
    websocket.onopen = function() {
      console.log("connected to server");
      websocket.send("CONNECTED TO YOU");

  // Re-assign websocket: not sure if 'recorder' will be ready before 'websocket'
      if (recorder) {
        recorder.websocket = websocket;
      }
    }
    websocket.onclose = function(e) {
      console.log("connection closed (" + e.code + ")");
    }
    websocket.onmessage = function(e) {
      console.log("message received: " + e.data);
      try {
        result = JSON.parse(e.data);
      } catch (e) {
        if (typeof(result.error) !== 'undefined') {
          $('.message').html('Error: ' + result.error);
        }
        else {
          $('.message').html('Welcome!');
        }
      }  // Closes try catch
    }

  }

 /**
  *  initMediaStream() : Prompts users permission to use the requested media device
  *                      (camera or microphone), and initializes the corresponding media
  *                      stream.
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

  function initMediaStream() {

  // Acquire 'getUserMedia' object
    try {
      navigator.getUserMedia = navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia;
    } catch (e) {
      $('.message').html('Error with Web Audio: ' + e);
    }

    navigator.getUserMedia({video: false, audio: true}, startUserMedia, function(e) {
      $('.message').html('Error initializing getUserMedia: ' + e);
    });
  }
