/**
 *  html_script.js: dynamically injects required scripts for 'getUserMedia',
 *                  or flash, depending on which is supported.
 */

 $(document).ready(function() {
 // Local variables
   var header = $('head');

 // Load Scipts: WebRTC 'getUserMedia'
   if (navigator.getUserMedia) {
     loadJS('../../src/js/initializer.js');
   }
 // Load Scripts: Flash 
   else {
     loadJS('../../src/js/swfobject.js');
   }

 }); // Closes $(document).ready(function() {


/**
 *  loadJS: Loads the specified javascript 'file'.
 */

 function loadJS (file) {
   var element = document.createElement("script");
   element.src = file;
   document.body.appendChild(element);
 }
