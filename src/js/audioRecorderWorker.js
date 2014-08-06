/**
 *  audioRecorderWorker.js: is a 'WebWorker' for the 'WebWorker Constructor' the declared
 *                          in 'audioRecorder.js'.
 *
 *                          A WebWorker is an HTML5 feature that allows javascript to be
 *                          run in the background independent of other scripts (threads),
 *                          without affecting the performance of the page.  This portion
 *                          is considered the 'Worker'.
 *
 *  @onmessage is an event listener to the 'WebWorker Constructor'.  The 'event.data'
 *                          parameter is used to acquire data from the 'WebWorker
 *                          Constructor'.
 *
 *  @postMessage('YOUR-DATA-HERE') sends data to the 'WebWorker Constructor', and must be
 *                          defined in the 'onmessage' function. The 'WebWorker 
 *                          Constructor' can receive data from this script by implementing
 *                          the following:
 *
 *    [constructor].onmessage = function(event) { console.log(event.data) }
 */

    var recordingBuffer = [],
    recordingSamples = [],
    outSampleRate = 16000,
    inSampleRate;

 /**
  *  this.onmessage: receive data from 'WebWorker' Constructor
  */

  this.onmessage = function(e) {
    switch(e.data.command) {
      case 'init':
        init(e.data.config);
        break;
      case 'record':
        record(e.data.buffer);
        break;
      case 'clear':
        clear();
        break;
      case 'getWave':
        getWave();
        break;
    }
  };

 /**
  *  init: initializes 'inSampleRate', and 'outputBufferLength' variables
  */

  function init(config) {
    inSampleRate = config.sampleRate;
    outputBufferLength = config.outputBufferLength;
  }

 /**
  *  record: sends recording buffer to the server, then 'slice' out the buffer
  *          before the 'indexOut'
  */

  function record(inputBuffer) {
    var volumeMax = 0.0;
    var sample;
    for (var i = 0; i < inputBuffer[0].length; i++) {
      sample = (inputBuffer[0][i] + inputBuffer[1][i]) / 2;
      volumeMax = Math.max(volumeMax, sample, -sample);
      recordingBuffer.push(sample * 32766);
    }
    this.postMessage({command: 'newVolume', data: (100.0*volumeMax)});

    while(recordingBuffer.length * outSampleRate / inSampleRate > outputBufferLength) {
      var result = new Int16Array(outputBufferLength);
      var bin = 0, num = 0, indexIn = 0, indexOut = 0;
      while(indexIn < outputBufferLength) {
        bin = 0, num = 0;
        while(indexOut < Math.min(recordingBuffer.length, (indexIn + 1) * inSampleRate / outSampleRate)) {
          bin += recordingBuffer[indexOut];
          num += 1;
          indexOut++;
        }
        recordingSamples.push(bin/num);
        result[indexIn] = bin/num;
        indexIn++;
      }
      this.postMessage({command: 'newBuffer', data: result});
      recordingBuffer = recordingBuffer.slice(indexOut);
    }
  }

 /**
  *  clear: clears the 'recordingBuffer', and 'recordingSamples' arrays.
  */

  function clear() {
    recordingBuffer = [];
    recordingSamples = [];
  }

 /**
  *  writeString: uses setInt16() to store an 'Uint8' value at the specified
  *               byte 'offset'.  A Uint8 is an 8-bit unsigned integer (range
  *               is 0 through 255 decimal). Because a Uint8 is unsigned, its 
  *               first bit (Most Significant Bit, MSB) is not reserved for
  *               signing.
  *
  *  @view object is defined in getWave(), where this function is called.
  */

  function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

 /**
  *  floatTo16BitPCM: uses setInt16() to store an 'Int16' value (16 bit
  *                   signed integer), at the specified byte 'offset'.
  *
  *  @output object is defined in getWave(), where this function is called.
  */

  function floatTo16BitPCM(output, offset, input){
    for (var i = 0; i < input.length; i++, offset+=2)
      output.setInt16(offset, input[i], true);
  }

 /**
  *  getwave: creates a 'DataView' object using an 'ArrayBuffer' as an
  *           input parameter.  After the DataView object has been properly
  *           configured, it is used as a parameter to create a 'Blob' object.
  *           This blob object is then sent to the server-side using the
  *           'postMessage' method.
  *
  *  @ArrayBuffer(length) represents a raw buffer of binary data.
  *    ArrayBuffers cannot be read from or written directly, but can
  *    be passed a typed array, or 'DataView Object' to interpret the raw
  *    buffer as needed.
  *
  *      @length the size, in byte, the array buffer to create.
  *
  *  @DataView(buffer, byteOffset, byteLength) reads and writes the different
  *    kinds of binary data to any location in the 'ArrayBuffer'.
  *
  *      @buffer the 'ArrayBuffer' that the DataView represents
  *
  *      @byteOffset (optional) specifies the offset in bytes from the start
  *        of the buffer at which the DataView should begin.
  *
  *      @byteLength (optional) specifies the length (in bytes) of the section
  *        of the buffer that the DataView should represent.
  *
  *  @Blob(parts, properties) represents a file-like object of immutable,
  *    raw data.  Blobs represent data that isn't necessarily in a
  *    javascript-native format.
  *
  *      @parts is an array of data objects to put into the new Blob object.
  *        This can be any number of 'ArrayBuffer', 'ArrayBufferView' (typed
  *        array), 'Blob', or strings, in any order.
  *
  *      @properties is an object that provides properties for the new Blob
  *        object.
  *
  *  @view.setUintxx(byteOffset, value, littleEndian) store an 'Intxx' value
  *    (xx bit signed integer), at the specified byte 'offset'.
  *
  *      @value the value to set
  *
  *      @byteOffset the place at which the value should be retrieved
  *
  *      @littleEndian an optional parameter, which defaults to false.  This
  *        causes the data to be stored in 'BigEndian' format.  However, if
  *        set to TRUE, the 'Intxx' value is saved as "Little Endian".  The
  *        little endian stores the least significant byte in the smallest
  *        address.  Consider the four bytes: 90, AB, 12, CD (each byte
  *        requires 2 hex digits):
  *
  *          Address  Value
  *             1000     CD
  *             1001     12
  *             1002     AB
  *             1003     90
  */

  function getWave(){
    var sampleWidth = 2;
    var buffer = new ArrayBuffer(44 + recordingSamples.length * sampleWidth);
    var view = new DataView(buffer);
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + recordingSamples.length * sampleWidth, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 32000, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, recordingSamples.length * 2, true);
    floatTo16BitPCM(view, 44, recordingSamples);

    var audioBlob = new Blob([view], { type: 'audio/wave' });
    this.postMessage({command: 'newWave', blob: audioBlob});
  };
