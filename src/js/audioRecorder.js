/**
 *  audioRecorder.js: defines various 'stream' configurations, and sends the data to the
 *                    corresponding WebWorker defined in 'audioRecorderWorker.js'.
 *
 *                    A WebWorker is an HTML5 feature that allows javascript to be run in the
 *                    background independent of other scripts (threads), without affecting the
 *                    performance of the page.  This portion is considered the 'WebWorker
 *                    Constructor'.
 *
 *  @worker.onmessage is an event listener to the 'WebWorker'.  The 'event.data', and
 *                    'event.data' parameter is used to acquire data from the WebWorker.
 *
 *  @worker.postMessage('YOUR-DATA-HERE') sends data to the WebWorker.  However, if no
 *                    parameter is supplied, postMessage() simply starts the WebWorker.
 *                    The WebWorker receives data from this 'WebWorker Constructor' by
 *                    implementing the onmessage message:
 *  
 *                    onmessage = function(event) {console.log(event.data)}
 *
 *  @source a 'MediaStreamAudioSourceNode' object passed in from the instatiation of an
 *    AudioRecorder within 'initializer.js'.  The 'MediaStreamAudioSourceNode' object is
 *    AudioNode that acts as an 'audio source', it inherits the 'AudioNode.context' property.
 *
 *  @websocket a defined websocket object
 *  @cfg audio recorder configurations
 *  @clb audio recorder callback
 *
 *  @this.context.createScriptProcessor(bufferSize, inputChannels, outputChannels) is a method
 *    of the 'AudioContext' interface, and creates a 'ScriptProcessorNode' used for direct
 *    audio processing.  It is an AudioNode audio-processing module that is linked to two
 *    buffers, one containing the current input, one containing the output.
 *
 *    @bufferSize buffer size in units of 'sample-frames'.  If specified, the bufferSize must
 *      be one of the following: 256, 512, 102, 2048, 4096, 8192, 16384.  If it's not passed in,
 *      or if the value is 0, then the implementation will choose the best buffer size for the
 *      given environment (recommended).  This value controls how frequently the onaudioprocess
 *      event handler is called and how many sample-frames need to be processed for each call.
 *      Lower values for bufferSize will result in a lower (better) latency. Higher values will
 *      be necessary to avoid audio breakup and glitches.
 *
 *      A 'sample' is a single float32 value that represents the value of the audio stream at
 *      each specific point in time, in a specific channel.  A 'sample-frame' is the set of
 *      all values for all channels that will play at a each specific point in time: all the
 *      'samples' of all the channels that play at the same time (one for mono, two for a
 *      stereo sound, etc.).
 *
 *      A 'sample rate' is the number of 'sample frames' per second, used by all nodes in this
 *      audio context.
 *
 *    @inputChannels (optional) defaults to 2 (stereo), determines the number of channels for
 *      this node's input.
 *
 *    @outputChannels (optional) defaults to 2 (stereo), determines the number of channels for
 *      this nodes output.
 *
 *    Note: Sphinx translation engines use 1 channel (mono).  If this application is being used
 *          for such a task, it is wise to use 1 channel, rather than performing additional
 *          computing to convert audio after it has been streamed.
 *
 *  @this.context.sampleRate is a property of the AudioContext interface, which returns a
 *    floating point number representing the 'sample rate', in 'samples' per second, used by
 *    all nodes in this audio context.
 *
 *  @this.node.onaudioprocess an event listener of type 'AudioProcessingEvent' is called for
 *    audio processing each time the input buffer contains new data, and the event listener
 *    terminates when it has filled the output buffer with data.  The frequency of this event
 *    being called is determined by the 'bufferSize' parameter when declaring
 *    'AudioContext.createScriptProcessor(bufferSize inputChannels, outputChannels), see
 *    above.
 *
 *    The event listener processes audio from the input by accessing the audio data from the
 *    'inputBuffer' attribute.  The audio data which is the result of the processing, is then
 *    placed into the 'outputBuffer'.  It will have a number of channels equal to the
 *    'inputChannels' parameter of the createScriptProcessor() method.
 *
 *  @URL.createObjectURL(blob) creates a URL for the specified object.  The URL lifetime
 *    is tied to the 'document' in the window on which it was created (until browser tab / window
 *    is closed).  The new object URL represents the specified File object or Blob object.
 *
 *      @blob is a File object or a Blob object to create a object URL for
 */

// Immediately Invoked Function Expression (IIFE)

(function(window){
  var AudioRecorder = function(source, websocket, cfg, clb) {
    this.websocket = websocket;

  // Eliminate Undefined Errors
    var callback = clb || function (x) { };
    var config = cfg || {}

    var inputBufferLength = config.bufferLen || 4096;
    var outputBufferLength = config.outputBufferLength || 4000;

    var recording = false;
    var volumeMax = -1;
    var receivedData = false;

    this.context = source.context;
    this.node = this.context.createScriptProcessor(inputBufferLength, 2, 2);

    var worker = new Worker(config.worker || WEBWORKER_AUDIO_RECORDER);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        outputBufferLength: outputBufferLength
      }
    });

    this.node.onaudioprocess = function(e) {
      if (recording) {
        worker.postMessage({
          command: 'record',
          buffer: [
    // Buffer data from input channels
            e.inputBuffer.getChannelData(0),
            e.inputBuffer.getChannelData(1)
          ]
        });
      }
    };

    this.start = function() {
      this.websocket.send("start");
      volumeMax = 0;
      recording = true;
      receivedData = false;
      callback({volumeMax: -1});
    };
	
    this.stop = function() {
      recording = false;
      this.websocket.send("stop");
      if (receivedData) {
        callback({volumeMax: volumeMax});
      }
      worker.postMessage({ command: 'getWave' });
      worker.postMessage({ command: 'clear' });
    };

    this.cancel = function() {
      recording = false;
      this.websocket.send("cancel");
      worker.postMessage({ command: 'clear' });
    };

    myrecorder = this;
    worker.onmessage = function(e) {
      if ((e.data.command == 'newVolume') && recording) {
        volumeMax = Math.max(volumeMax, e.data.data);
        callback({volume: e.data.data});
      }
      else if ((e.data.command == 'newBuffer') && recording) {
        receivedData = true;
        myrecorder.websocket.send(e.data.data);
      }
      else if (e.data.command == 'newWave') {
        var url = URL.createObjectURL(e.data.blob);
        callback({audio: url});
      }
    };

  // Connects the 'audio source' AudioNode to 'audio-processing' AudioNode
    source.connect(this.node);
  // Connects the 'audio-processing' AudioNode to 'destination' AudioNode
    this.node.connect(this.context.destination);

  };

// AudioRecorder: allow function within 'IIFE' to have Global Scope
  window.AudioRecorder = AudioRecorder;

})(window);
