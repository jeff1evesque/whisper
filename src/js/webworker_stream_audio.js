/**
 * webworker_audio_stream.js: is a WebWorker for the 'WebWorker Constructor'
 *
 *                     A WebWorker is an HTML5 feature that allows javascript to be
 *                     run in the background independent of other scripts (threads),   
 *                     without affecting the performance of the page.  This portion
 *                     is considered the 'Worker'.
 *
 *  @onmessage is an event listener to the 'WebWorker Constructor'.  The 'event.data'
 *                     parameter is used to acquire data from the 'WebWorker Constructor'.
 *
 *  @postMessage('YOUR-DATA-HERE') sends data to the 'WebWorker Constructor', and must be
 *                     defined in the 'onmessage' function. The 'WebWorker Constructor'
 *                     can receive data from this script by implementing the following:
 *
 *                     [constructor].onmessage = function(event) {console.log(event.data)}
 */

  onmessage = function (event) {
    setInterval('postMessage(randomByte())', 1000);
  }

 /**
  *  randomByte: generates a random byte, and returns the binary digit format.
  */

  function randomByte() {
    return Math.floor(Math.random()*256).toString(2);
  }
