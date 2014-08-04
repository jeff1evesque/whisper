(function(window){
    var AudioRecorder = function(source, websocket, cfg, clb) {
	this.websocket = websocket;
	var callback = clb || function (x) { };
	var config = cfg || {};
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
	this.node.onaudioprocess = function(e){
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

	this.start = function(sentence){
	    this.websocket.send("start:"+sentence);
	    volumeMax = 0;
	    recording = true;
	    receivedData = false;
	    callback({volumeMax: -1});
	};
	
	this.stop = function(){
	    recording = false;
	    this.websocket.send("stop");
	    if (receivedData) {
		callback({volumeMax: volumeMax});
	    }
	    worker.postMessage({ command: 'getWave' });
	    worker.postMessage({ command: 'clear' });
	};

	this.cancel = function(){
	    recording = false;
	    this.websocket.send("cancel");
	    worker.postMessage({ command: 'clear' });
	};

	myrecorder = this;
	worker.onmessage = function(e){
	    if ((e.data.command == 'newVolume') && recording) {
		volumeMax = Math.max(volumeMax, e.data.data);
		callback({volume: e.data.data});
	    } else if ((e.data.command == 'newBuffer') && recording) {
		receivedData = true;
		myrecorder.websocket.send(e.data.data);
	    } else if (e.data.command == 'newWave') {
		var url = URL.createObjectURL(e.data.blob);
		callback({audio: url});
	    }
	};
	source.connect(this.node);
	this.node.connect(this.context.destination);
    };
    window.AudioRecorder = AudioRecorder;
})(window);

