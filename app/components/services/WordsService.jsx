import axios from 'axios'

class WordsService {
  constructor() {
    this.onReady = this.onReady.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.enterReady = this.enterReady.bind(this);

    this.isRead = false
    this.onReadyCallbacks = []
  }

  onReady(callback) {
    if (this.isReady) {
      callback()
    } else {
        this.onReadyCallbacks.push(callback)
    }
  }

  startLoading() {
    console.log("loading...");
    const loadingWords = axios.get('words.json')
    const loadingLetters = axios.get('letters.json')
    this.loading = axios.all([loadingWords, loadingLetters]).
      then(axios.spread((words, letters) => {
        this.words = words.data;
        console.log("Easy words: ", this.words.easy.length);
        console.log("Medium words: ", this.words.medium.length);
        console.log("Hard words: ", this.words.hard.length);

        this.letters = letters.data.map(s => s.toUpperCase());
        console.log("Letters: ", this.letters);
        this.enterReady()
      }))
  }

  enterReady() {
    if (this.loadingLetters)
    this._isReady = true
    console.log("Words loaded");
    for (let callback of this.onReadyCallbacks) {
      callback.call()
    }
  }
}


const service = new WordsService()
service.startLoading()
export default service
