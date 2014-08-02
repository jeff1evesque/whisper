/**
 * initializer.js:
 */


var sock = null;
sock = new WebSocket("ws://localhost:9001");
console.log("Websocket created...");

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

function randomByte() {
  return Math.floor(Math.random()*256).toString(2);
}
