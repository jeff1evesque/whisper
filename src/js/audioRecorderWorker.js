var recordingBuffer = [],
    recordingSamples = [],
    outSampleRate = 16000,
    inSampleRate;

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

function init(config) {
    inSampleRate = config.sampleRate;
    outputBufferLength = config.outputBufferLength;
}

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

function clear() {
  recordingBuffer = [];
  recordingSamples =[];
}

function writeString(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2)
      output.setInt16(offset, input[i], true);
}

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

