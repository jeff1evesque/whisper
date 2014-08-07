/**
 *  audioRecorder.js: defines various 'stream' configurations, and sends the data to
 *                    the corresponding WebWorker defined in 'audioRecorderWorker.js'.
 *
 *                    A WebWorker is an HTML5 feature that allows javascript to be
 *                    run in the background independent of other scripts (threads),
 *                    without affecting the performance of the page.  This portion
 *                    is considered the 'WebWorker Constructor'.
 *
 *  @worker.onmessage is an event listener to the 'WebWorker'.  The 'event.data'
 *                    'event.data' parameter is used to acquire data from the WebWorker.
 *
 *  @worker.postMessage('YOUR-DATA-HERE') sends data to the WebWorker.
 *                    However, if no parameter is supplied, postMessage() simply starts
 *                    the WebWorker.  The WebWorker receives data from this
 *                    'WebWorker' Constructor by implementing the onmessage message:
 *  
 *                    onmessage = function(event) {console.log(event.data)}
 *
 *  @AudioRecorder(source, websocket, cfg, clb)
 *
 *      @source a 'MediaStreamAudioSourceNode' object passed in from the instatiation of
 *        AudioRecorder within 'initializer.js'.  The 'MediaStreamAudioSourceNode' object is
 *        an AudioNode that acts as an 'audio source', it inherits the 'AudioNode.context'
 *        property.
 *
 *      @websocket a defined websocket object
 *      @cfg audio recorder configurations
 *      @clb audio recorder callback
 */

(function(window){
  var AudioRecorder = function(source, websocket, cfg, clb) {
    this.websocket = websocket;

  // Eliminate Undefined Errors
    var callback = clb || function () { };
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

    source.connect(this.node);
    this.node.connect(this.context.destination);

  };

  window.AudioRecorder = AudioRecorder;

})(window);

