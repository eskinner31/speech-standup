var textareas = document.getElementsByClassName('textarea');
var SpeechRecognition = window.webkitSpeechRecognition;
var resultIndex = 0;
var target;

var recognizing;
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interim = true;
reset();
recognition.onend = reset

recognition.onresult = function (event) {
  var result = "";
  for (var i = resultIndex; i < event.results.length; ++i) {
    if (event.results[i].final) {
      result += event.results[i][0].transcript;
    }else{
      result += event.results[i][0].transcript;
    }
  }
  // console.log(target);
  // console.log(event);
  target.innerHTML = result;
}

function reset() {
  recognizing = false;
  //button.innerHTML = "Click to Speak";
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    recognition.start();
    recognizing = true;
    //button.innerHTML = "Click to Stop";
  }
}



for(var i = 0; i < textareas.length; i++){
  textareas[i].addEventListener('click',function(el){

    target = el.target;
    //console.log(el.target);
    toggleStartStop();
  })
};
