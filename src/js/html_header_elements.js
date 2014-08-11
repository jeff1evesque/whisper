/**
 *  html_script.js: dynamically injects required scripts for 'getUserMedia',
 *                  or flash, depending on which is supported.
 */

 $(document).ready(function() {

 // Local variables
   var header = $('head');

 // Header File: WebRTC 'getUserMedia'
   if (navigator.getUserMedia) {
     load_header_file('../../src/js/initializer.js', 'js');
   }

 // Header File: Flash 
   else {
     load_header_file('../../src/js/swfobject.js', 'js');
     load_header_file('../../src/js/recorder.js', 'js');
     load_header_file('../../src/js/recorder_control.js', 'js');
     load_header_file('../../src/js/recorder_attributes.js', 'js');
     load_header_file('../../src/js/recorder_initialize.js', 'js');

     load_header_file('../../src/css/main.css', 'css');
   }

 }); // Closes $(document).ready(function() {


/**
 *  load_header_file: Loads the specified javascript, or css 'file'.
 */

 function load_header_file (file, type) {
   if (type == 'js') {
     var element = document.createElement('script');
     element.src = file;
   }
   else {
     var element = document.createElement('link');
     element.href = file;
     element.rel = 'stylesheet';
   }
   document.body.appendChild(element);
 }
