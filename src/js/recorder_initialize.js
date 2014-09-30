function configureMicrophone() {
  if(! FWRecorder.isReady) {
    return;
  }

  FWRecorder.configure($('#rate').val(), $('#gain').val(), $('#silenceLevel').val(), $('#silenceTimeout').val());
  FWRecorder.setUseEchoSuppression($('#useEchoSuppression').is(":checked"));
  FWRecorder.setLoopBack($('#loopBack').is(":checked"));
}
