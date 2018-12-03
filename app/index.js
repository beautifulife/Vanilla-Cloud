// Load application styles
import 'styles/index.less';

// ================================
// START YOUR APP HERE
// ================================

// getText
const textBox = document.getElementsByClassName('input_text')[0];
const inputWindow = document.getElementsByClassName('input_window')[0];
const wordCounter = document.getElementsByClassName('word_counter')[0];
const showWindow = document.getElementsByClassName('show_window')[0];
const descriptionLayer = document.getElementsByClassName('description_layer')[0];
const fontSelect = document.getElementsByClassName('font-select')[0];
const colorSelect = document.getElementsByClassName('font-select')[0];

textBox.addEventListener('input', getText);

function getText(ev) {
  const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;

  if (koreanPattern.test(ev.currentTarget.value)) {
    ev.currentTarget.value = ev.currentTarget.value.replace(koreanPattern, '');

    return alert('You can analyze only english');
  }

  const inputString = ev.currentTarget.value;

  showTextLength(inputString.length);

  if (inputString.length <= 5000) {
    if (inputWindow.classList.contains('overflow')) {
      inputWindow.classList.remove('overflow');
    }

    analyzeText(inputString);
  } else {
    inputWindow.classList.add('overflow');
  }

  if (!showWindow.innerHTML) {
    descriptionLayer.classList.remove('hidden');
  } else {
    descriptionLayer.classList.add('hidden');
  }

  function showTextLength(textLength) {
    wordCounter.children[0].textContent = `type : ${textLength}`;
  }
}

// analyzeText
function analyzeText(inputString) {
  const notEnglishPattern = /[^a-zA-Z0-9\s']/g;
  const beginWithCommaPattern = /^'/gm;
  const endWithCommaPattern = /'\s/gm;
  const spacePattern = /[\r|\n|\s\s+]/g;
  let minedString = inputString.replace(notEnglishPattern, '');

  minedString = minedString.replace(beginWithCommaPattern, '');
  minedString = minedString.replace(endWithCommaPattern, ' ');
  minedString = minedString.replace(spacePattern, ' ');

  const splitedString = minedString.split(' ');
  const wordDictionary = {};
  let wordArray = [];

  for (let i = 0; i < splitedString.length; i++) {
    if (wordDictionary[splitedString[i]] === undefined) {
      wordDictionary[splitedString[i]] = 1;
    } else {
      wordDictionary[splitedString[i]]++;
    }
  }

  delete wordDictionary[''];

  for (let key in wordDictionary) {
    if (wordDictionary.hasOwnProperty(key)) {
      wordArray.push([key, wordDictionary[key]]);
    }
  }

  wordArray = wordArray.sort((a,b) => b[1] - a[1]);

  removeCloud();
  showCloud(wordArray);
}

// showCloud
function showCloud(wordArray) {
  if (wordArray[0] !== undefined) {
    const highestValue = wordArray[0][1];

    for (let i = 0; i < wordArray.length; i++) {
      const div = document.createElement('div');
      div.style.fontSize = `${wordArray[i][1] * 40 / highestValue + 10}px`;
      div.textContent = wordArray[i][0];
      div.classList.add('cloud_items');
      showWindow.appendChild(div);
    }
  }
}

function removeCloud() {
  for (let i = showWindow.children.length - 1; i > -1; i--) {
    showWindow.children[i].remove();
  }
}
