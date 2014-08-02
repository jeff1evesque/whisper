/**
 * initializer.js:
 */

$(document).ready(function() {

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
    sock.send(randomByte());
  });
  $('.buttonStop').click(function() {

  });

// Function Definitions
  function randomByte() {
    return Math.floor(Math.random()*256).toString(2);
  }

});
