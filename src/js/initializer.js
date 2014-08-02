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
    if (typeof(webworker_audio_stream) != 'undefined') {
      endDataStream();
    }
  });

// Function Definitions
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
  //                webworker_audio_stream.postMessage('YOUR-DATA-HERE') sends
  //                  data to the WebWorker.  The WebWorker receives data as below,
  //                  with the .onmessage.  However, if no parameters are supplied,
  //                  postMessage() simple starts the WebWorker.

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
      alert('Error: Your browser does not support "Web Worker"');
    }

  }

});  // Closes $(document).ready(function() {}
