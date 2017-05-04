document.addEventListener('DOMContentLoaded', function(){

  // Storing query selections...
  var playButton = document.querySelector('#play');
  var stopButton = document.querySelector('#stop');
  var inputField = document.querySelector('input');
  var keys = document.querySelectorAll('.key');
  var lights = document.querySelectorAll('.light');
  var badInput = document.querySelector('#badinput');

  // Variables which check for game state and store user input
  var rhythmBank = [
    [[2],[],[],[],[2],[],[2],[],[],[],[2],[],[2],[],[2],[]],
  ];

  // Is this still necessary?
  var userSequence = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

  // Set tempo functionality
  var bpm = 125

  var newTempo = function(input) {
    // var interval = inputField.value;
    bpm = 60000 / (input * 4);
  }

  // Halts animation class.
  function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('lit');
  };

  // Animation event listeners.
  keys.forEach(key => key.addEventListener('transitionend', removeTransition));
  lights.forEach(light => light.addEventListener('transitionend', removeTransition));

  // Actual playback function
  var intervalID;

  var playSequence = function(rhythm) {
    var seqPos = 0;

      // What is this setInterval doing?
      intervalID = setInterval(function(){

        rhythm[seqPos].forEach(function(i){
          var audio = document.querySelector(`audio[data-note='${i}']`);
          audio.currentTime = 0;
          audio.play();
        });

        var light = document.querySelector(`.light[data-index='${seqPos}']`);
        light.classList.add('lit');
        if (rhythm[seqPos].length > 0) {
          document.querySelector(`.key[data-index='${seqPos}']`)
                  .classList
                  .add('lit');
        }
        seqPos < 15 ? seqPos++ : seqPos = 0;
      }, bpm); // End setInterval
  };

  // Set variable to hold selected drum...
  // Maybe add later.

  // //Sequence Key event listener w/ event delegation
  document.querySelector('#sequencer').addEventListener('click', function(e) {
    if (e.target && e.target.matches('div.key')) {
      e.target.classList.toggle('key-select');
          var i = parseInt(e.target.dataset.index);

          var sample = i % 2 == 0 || i === 0 ? '3a' : '3b';

          userSequence[i].includes(sample) ? userSequence[i].splice(userSequence.indexOf(sample), 1)
                                      : userSequence[i].push(sample);
    }
  });

  // Play button event listener
  var loopPlaying = false;
  playButton.addEventListener('click', function() {
    if (loopPlaying) return;
    playSequence(userSequence);
    loopPlaying = true;
  });

  // Stop button event listener
  stopButton.addEventListener('click', function() {
    if (!loopPlaying) return;
    clearInterval(intervalID);
    loopPlaying = false;
  });


  // Tempo event listener
  inputField.addEventListener('keypress', function(e) {

    // Checking if the keypress is the ENTER key
    if (e.which === 13 && parseInt(inputField.value) < 401 && parseInt(inputField.value) > 39)  {
      newTempo(inputField.value);
    }
    if (parseInt(inputField.value) > 399) {
      badInput.style.display = 'initial';
      setTimeout(function(){
        badInput.style.display = 'none';
      }, 1000);
    }
  });
});
