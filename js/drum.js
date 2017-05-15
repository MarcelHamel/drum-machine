document.addEventListener('DOMContentLoaded', function(){

  // Storing query selections...
  var playButton = document.querySelector('#play');
  var stopButton = document.querySelector('#stop');
  var tempoField = document.querySelector('#bpm');
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

  var bpmInMS = 125;
  var bpm = 120;

  var newTempo = function(input) {
    bpmInMS = 60000 / (input * 4);
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
    playButton.classList.toggle('playing')
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
      if (rhythm[seqPos].length > 0) {
        document.querySelector(`.key[data-index='${seqPos}']`)
                .classList
                .add('lit');
      }

      // Checks to see if playback has reached the end of the array
      // Returns to beginning if so
      seqPos < 15 ? seqPos++ : seqPos = 0;
      // bpm is tempo set via user input above
    }, bpmInMS);
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
    playButton.classList.toggle('playing');
    loopPlaying = false;
  });


  // Drum selector animation listeners
  document.querySelector('#drum-selector').addEventListener('mousedown', function(e) {
    if (e.target && e.target.matches('button')) {
      e.target.classList.toggle('press');
    }
  });

  document.querySelector('#drum-selector').addEventListener('mouseup', function(e) {
    if (e.target && e.target.matches('button')) {
      e.target.classList.toggle('press');
    }
  });

  // Sequencer key animation listeners
  document.querySelector('#sequencer').addEventListener('mousedown', function(e) {
    if (e.target && e.target.matches('div.key')) {
      e.target.classList.toggle('press');
    }
  });

  document.querySelector('#sequencer').addEventListener('mouseup', function(e) {
    if (e.target && e.target.matches('div.key')) {
      e.target.classList.toggle('press');
    }
  });

  // Playback button animation listeners
  document.querySelector('#controls').addEventListener('mousedown', function(e) {
    if (e.target && e.target.matches('button')) {
      e.target.classList.toggle('press');
      if (e.target.getAttribute('id') === 'stop') e.target.classList.add('stop');
    }
  });

  document.querySelector('#controls').addEventListener('mouseup', function(e) {
    if (e.target && e.target.matches('button')) {
      e.target.classList.toggle('press');
      if (e.target.getAttribute('id') === 'stop') e.target.classList.remove('stop');
    }
  });


  document.querySelector('#speed-up').addEventListener('click', function(e) {
      console.log('Arrow clicked!');
      bpm++;
      console.log('BPM:', bpm);
      tempoField.innerHTML = bpm;
      newTempo(bpm);
  })

  document.querySelector('#slow-down').addEventListener('click', function(e) {
      console.log('Arrow clicked!');
      bpm--;
      console.log('BPM:', bpm);
      tempoField.innerHTML = bpm;
      newTempo(bpm);
  })
  // Tempo event listener
//   inputField.addEventListener('keypress', function(e) {

//     // Checking if the keypress is the ENTER key
//     if (e.which === 13 && parseInt(inputField.value) < 401 && parseInt(inputField.value) > 39)  {
//       newTempo(inputField.value);
//     }
//     if (parseInt(inputField.value) > 399) {
//       badInput.style.display = 'initial';
//       setTimeout(function(){
//         badInput.style.display = 'none';
//       }, 1000);
//     }
//   });
});
