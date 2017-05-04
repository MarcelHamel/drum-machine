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
    // Begin playback at beginning of sequencer array
    var seqPos = 0;

    // setInterval iterates through playback array
    intervalID = setInterval(function(){

      // For each audio sample in subarray
      rhythm[seqPos].forEach(function(i){
        // Find specific audio HTML element via data attribute
        var audio = document.querySelector(`audio[data-note='${i}']`);
        // Reset audio sample to beginning of clip
        audio.currentTime = 0;
        // Play audio sample
        audio.play();
      });

      // Triggers "light" and CSS transforms for active sample
      var light = document.querySelector(`.light[data-index='${seqPos}']`);
      light.classList.add('lit');
      if (rhythm[seqPos].length > 0) {
        document.querySelector(`.key[data-index='${seqPos}']`)
                .classList
                .add('lit');
      }

      // Checks to see if playback has reached the end of the array
      // Returns to beginning if so
      seqPos < 15 ? seqPos++ : seqPos = 0;
      // bpm is tempo set via user input above
    }, bpm);
    // End setInterval
  };

  // Set variable to hold selected drum...
  var selectedDrum = 1;

  document.querySelector('#drum-selector').addEventListener('click', function(e) {
    if (e.target && e.target.matches('button')) {
      if (document.querySelector('.drum-select')) {
        document.querySelector('.drum-select').classList.toggle('drum-select');
      }
      e.target.classList.toggle('drum-select');
      selectedDrum = e.target.dataset.drum;
      userSequence.forEach(function(i) {
        if (i.length === 0) return;
        i.includes(selectedDrum + 'a' || selectedDrum + 'b') ?
          document.getElementById(`${userSequence.indexOf(i)}`).classList.add('key-select') :
          document.getElementById(`${userSequence.indexOf(i)}`).classList.remove('key-select');
      })
      console.log(selectedDrum);
    }
  })
  // Maybe add later.

  // //Sequence Key event listener w/ event delegation
  document.querySelector('#sequencer').addEventListener('click', function(e) {
    if (e.target && e.target.matches('div.key')) {
      e.target.classList.toggle('key-select');
        var i = parseInt(e.target.dataset.index);

        var sample = i % 2 == 0 || i === 0 ? selectedDrum + 'a' : selectedDrum + 'b';

        userSequence[i].includes(sample) ?
          userSequence[i].splice(userSequence.indexOf(sample), 1)
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
