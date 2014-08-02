/**
 * initializer.js:
 */

$(document).ready(function() {

// Local Variables
  var webworker_stream_audio;

// Create WebSocket
  var sock = null;
  sock = new WebSocket("ws://localhost:9001");
  console.log("Websocket created...");

// WebSocket Definitions: executed when websocket performs defined action (i.e. open, close, message, ...)
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
    endDataStream();
  });

// Function Definitions
  function randomByte() {
    return Math.floor(Math.random()*256).toString(2);
  }

  function endDataStream() {
  // Terminate WebWorker: 'webworker_audio_stream' defined in startDataStream()
    webworker_audio_stream.terminate();
  }

  function startDataStream() {

  // Check Support: WebWorker is an HTML5 feature that allows javascript to be
  //                run in the background independent of other scripts, without 
  //                affecting the performance of the page.
  //
  //                webworker_audio_stream.onmessage receives data from the WebWorker

    if(typeof(Worker) !== 'undefined') {
      webworker_audio_stream = new Worker('webworker_audio_stream.js');
      webworker_audio_stream.onmessage = function (event) {
        return event.data;
      };
    }
    else {
      alert('Error: Your browser does not support "Web Worker"');
    }

  }

});  // Closes $(document).ready(function() {}
