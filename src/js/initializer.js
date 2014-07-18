/**
 * initializer.js:
 */

var websocket = null;
// URL of the WebSocket server (ipsikit)
#var websocket_uri = "ws://108.59.3.115:18875";
// URL of the WebSocket server (whisper)
var websocket_uri = "ws://localhost:90001";
var audio_context;
var recorder = null;
// You might need to change this to full path
// depending on what web framework you use
var AUDIO_RECORDER_WORKER = "../../src/js/audioRecorderWorker.js";

// Callback function from the recorder, called
// for audio volume and audio file blob URL
function callbackRecorder(x) {
  if (typeof(x.volume) !== 'undefined')
    document.getElementById("volume").innerHTML = Math.floor(x.volume);
  if (typeof(x.volumeMax) !== 'undefined')
    document.getElementById("volumeMax").innerHTML = Math.floor(x.volumeMax);
  if (typeof(x.audio) !== 'undefined') {
    document.getElementById("audioDownloadLink").href = x.audio;
    document.getElementById("audioPlayer").src = x.audio;
  }
}


// Called back by getUserMedia, calls createMediaStreamSource
// and initializes recorder
function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  // Firefox hack https://support.mozilla.org/en-US/questions/984179
  window.firefox_audio_hack = input; 
  recorder = new AudioRecorder(input, websocket, {}, callbackRecorder);
}


// This initializes the websocket and wires up the messages it sends back
// to the client
function initWebSocket() {
  websocket = new WebSocket(websocket_uri);

  websocket.onopen = function() {
    document.getElementById("webSocketStatus").innerHTML = "Connected";
    // Re-assigning websocket, because we don't know if recorder or
    // websocket will be ready first
    if (recorder)
      recorder.websocket = websocket;
  };

  // Getting messages from server through WebSocket, either a result or an error
  websocket.onmessage = function(e) {
    result = JSON.parse(e.data);
    if (typeof(result.score) !== 'undefined')
      document.getElementById("result").innerHTML = "Score: " + result.score + " Speed: " + result.speed + " Words: " + result.words;
    if (typeof(result.error) !== 'undefined')
      document.getElementById("error").innerHTML = result.error;
    else
      document.getElementById("error").innerHTML = "";
    }
}

// Starting recording on a given sentence
function start() {
  if (recorder)
    recorder.start(document.getElementById("sentence").value);
}

// Stopping recording
function stop() {
  if (recorder)
    recorder.stop();
}

window.onload = function init() {
  try {
    initWebSocket();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;  
    audio_context = new AudioContext;
  } catch (e) {
    document.getElementById("error").innerHTML = "Error with Web Audio: " + e;
  }
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    document.getElementById("error").innerHTML = "Error initializing getUserMedia: " + e;
  });
};
