/**
 * initializer.js:
 */

$(document).ready(function() {

// websocket
  var sock = null;
  sock = new WebSocket("ws://localhost:9001");
  console.log("Websocket created...");

// open websocket
  sock.onopen = function() {
    console.log("connected to server");
    sock.send("CONNECTED TO YOU");
  }

// send random byte
  $('.buttonStart').click(function() {
    sock.send(randomByte());
  });
  $('.buttonStop').click(function() {

  });

  sock.onclose = function(e) {
    console.log("connection closed (" + e.code + ")");
  }

  sock.onmessage = function(e) {
    console.log("message received: " + e.data);
  }

  function randomByte() {
    return Math.floor(Math.random()*256).toString(2);
  }

});
