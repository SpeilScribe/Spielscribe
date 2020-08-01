
var message = document.querySelector('#message');
var processDF = document.querySelector('#processDF');
var processDigiPres = document.querySelector('#processDigiPres');

var ansFromDF;
var prescriptionjson={};
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var command = "";
var grammar = '#JSGF V1.0;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.continuous = true;
let finalTranscript = '';
//if(window.sessionStorage.hasOwnProperty('detailsToReuse')){
recognition.onresult = function(event) {
    // var last = event.results.length - 1;
    // command = event.results[last][0].transcript;
    // document.getElementById("docSpeechTextBox").value= command;
    let interimTranscript = '';
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      document.getElementById("docSpeechTextBox").value= finalTranscript+ interimTranscript;
};

recognition.onspeechend = function() {
    document.getElementById("recordingGif").src = "images/recordToForm.gif";
    document.getElementById("docSpeechTextBox").readOnly = false;
    speechSynthesis.speak( new SpeechSynthesisUtterance("Please edit details if required and then Please Click on process button"))
};

recognition.onerror = function(event) {
    finalTranscript='';
    document.getElementById("docSpeechTextBox").value= "Error occurred in recognition";
}        

document.querySelector('#btnGiveCommand').addEventListener('click', function(){
    speechSynthesis.speak( new SpeechSynthesisUtterance("Your assistant is ready"))
    document.getElementById("docSpeechTextBox").readOnly = true;
    finalTranscript = '';
    recognition.start();
});

document.querySelector('#btnStopCommand').addEventListener('click', function(){
    recognition.stop();
});

document.querySelector('#btnfetchCommand').addEventListener('click', function(){
    speechSynthesis.speak( new SpeechSynthesisUtterance("fetching of recording in process please wait"))
    isPermissionGranted=false;
});


