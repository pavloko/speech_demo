import React, {Component} from 'react';
import './App.css';
//noinspection JSUnresolvedVariable
import mic from './mic.svg';
//noinspection JSUnresolvedVariable
import success from './success.svg';
//noinspection JSUnresolvedVariable
import fail from './fail.svg';
//noinspection JSUnresolvedVariable
import play from './play.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      sentence: 'How do you do?',
      isListeningToUser: false,
      isExerciseCorrect: false,
      isExerciseWrong: false,
    };
  }

  handleSpeechResult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        let userSpeech = event.results[i][0].transcript;
        let controlSentenceTrimmed = this.state.sentence.toLowerCase().replace(/[?.]/, '');
        if (userSpeech === controlSentenceTrimmed) {
          this.recognition.stop();
          this.setState({
            isExerciseCorrect: true,
            isListeningToUser: false,
          });
        } else {
          this.recognition.stop();
          this.setState({
            isExerciseWrong: true,
            isListeningToUser: false,
          });
        }
      }
    }
  };

  componentDidMount() {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('No SpeechRecognition API');
    } else {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.lang = 'en-US';
      // this.recognition.continuous = true; // keep listening when the user stopped talking
      // this.recognition.interimResults = true; // recognition results might change
      this.recognition.onresult = this.handleSpeechResult;
    }
  }

  listenToUser = () => {
    if (this.state.isListeningToUser) {
      this.recognition.stop();
      this.setState({
        isListeningToUser: false
      });
      return;
    }

    this.recognition.start();
    this.setState({
      isListeningToUser: true
    });
  };

  playSentence = () => {
    // window.responsiveVoice.speak(this.state.sentence, "UK English Male", {pitch: 1});
    let synth = window.speechSynthesis;
    let sentenceToSpeak = new SpeechSynthesisUtterance(this.state.sentence);
    //  sentenceToSpeak.lang = 'en-GB'; // Sounds much better than en-US, need to look into SpeechSynthesisVoice
    window.speechSynthesis.getVoices().forEach((voice) => {
      if (voice.name === 'Daniel') { // Daniel sounds great on all desktop browsers (not tested IE), but doesn't work on mobile.
        console.log(voice)
        sentenceToSpeak.voice = voice
      }
      if (voice.lang === 'en-GB' || voice.lang === 'en-US') {
        console.log(voice.name, voice.lang)
      }
    })
    synth.speak(sentenceToSpeak);
  };

  render() {
    let {isListeningToUser, sentence, isExerciseCorrect, isExerciseWrong} = this.state;

    return (
      <div className="wrapper">
        <header>Engly speaking demo</header>
        <main>
          <h1>Click the microphone and say:</h1>
          <p className="sentence-wrapper">
            <img src={play} className="play" alt="Play button"
                 onClick={this.playSentence}/>
            <b className="sentence">{sentence}</b>
          </p>
          <img
            src={mic}
            className={isListeningToUser ? 'mic mic__listening': 'mic'}
            alt="Microphone icon"
            onClick={this.listenToUser}
          />
          {
            isExerciseCorrect &&
            <img
              className="success"
              src={success}
              alt="Success icon"
            />
          }
          {
            isExerciseWrong && !isExerciseCorrect &&
            <img
              className="success"
              src={fail}
              alt="Fail icon"
            />
          }
        </main>
      </div>
    );
  }
}

export default App;
