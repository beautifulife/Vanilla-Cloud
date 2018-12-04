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
const colorSelect = document.getElementsByClassName('color-select')[0];
const controlButtons = document.getElementsByClassName('control_buttons');
const colorStorage = {
  bright: [
    'rgba(78, 205, 196, 1)',
    'rgba(107, 255, 184, 1)',
    'rgba(255, 107, 107, 1)',
    'rgba(255, 230, 109, 1)',
    'rgba(242, 143, 59, 1)',
  ],
  rainbow: [
    'rgba(239, 71, 111, 1)',
    'rgba(255, 209, 102, 1)',
    'rgba(6, 214, 160, 1)',
    'rgba(17, 138, 178, 1);',
    'rgba(7, 59, 76, 1)',
  ],
  baby: [
    'rgba(255, 153, 200, 1)',
    'rgba(252, 246, 189, 1)',
    'rgba(208, 244, 222, 1)',
    'rgba(169, 222, 249, 1)',
    'rgba(228, 193, 249, 1)',
  ],
  blue: [
    'rgba(11, 19, 43, 1)',
    'rgba(28, 37, 65, 1)',
    'rgba(58, 80, 107, 1)',
    'rgba(91, 192, 190, 1)',
    'rgba(111, 255, 233, 1)',
  ],
};
let colorIndex = 0;
const fontStorage = {
  lobster: 'font_lobster',
  openSans: 'font_open_sans',
  indieFlower: 'font_indie_flower',
};
let saveMinedData = [];
let dataIndex = 0;
let selectedFont = '';
let showType = 'List';
let lastFunctionTime = 0;

textBox.addEventListener('input', getText);
colorSelect.addEventListener('change', changeColor);
fontSelect.addEventListener('change', changeFont);
for (let i = 0; i < controlButtons.length; i++) {
  controlButtons[i].addEventListener('click', changeShowType);
}

showWindow.addEventListener('mousedown', (ev) => {
  showWindow.addEventListener('mousemove', startDrawing);
});

showWindow.addEventListener('mouseup', (ev) => {
  showWindow.removeEventListener('mousemove', startDrawing);
});


function startDrawing(ev) {
  if (Date.now() - lastFunctionTime > 200) {
    if (saveMinedData[dataIndex]) {
      const colorPallet = colorStorage[colorSelect.value];
      const highestValue = saveMinedData[0][1];
      const div = document.createElement('div');

      ev.currentTarget.appendChild(div);
      div.style.top = ev.offsetY + 'px';
      div.style.left = ev.offsetX + 'px';
      div.style.color = colorPallet[colorIndex];
      div.style.fontSize = `${saveMinedData[dataIndex][1] * 40 / highestValue + 10}px`;
      div.textContent = saveMinedData[dataIndex][0];
      div.classList.add('canvas');
      dataIndex++;
      colorIndex++;

      if (colorIndex === 5) {
        colorIndex = 0;
      }
    }

    lastFunctionTime = Date.now();
  }
}

function changeShowType(ev) {
  if (ev.target.textContent === 'Canvas') {
    showType = 'Canvas';
    removeCloud();
  } else {
    showType = 'List';
    showCloud(saveMinedData);
  }
}

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
    if (wordDictionary[splitedString[i].toLowerCase()] === undefined) {
      wordDictionary[splitedString[i].toLowerCase()] = 1;
    } else {
      wordDictionary[splitedString[i].toLowerCase()]++;
    }
  }

  delete wordDictionary[''];

  for (let key in wordDictionary) {
    if (wordDictionary.hasOwnProperty(key)) {
      wordArray.push([key, wordDictionary[key]]);
    }
  }

  wordArray = wordArray.sort((a,b) => b[1] - a[1]);
  saveMinedData = wordArray;

  if (showType === 'List') {
    showCloud(wordArray);
  }
}

// showCloud
function showCloud(wordArray) {
  removeCloud();

  if (wordArray[0] !== undefined) {
    const highestValue = wordArray[0][1];
    const colorPallet = colorStorage[colorSelect.value];
    let j = 0;

    if (selectedFont) {
      showWindow.classList.remove(fontStorage[selectedFont]);
    }

    if (fontStorage[fontSelect.value]) {
      showWindow.classList.add(fontStorage[fontSelect.value]);
    }

    for (let i = 0; i < wordArray.length; i++) {
      const div = document.createElement('div');

      div.style.fontSize = `${wordArray[i][1] * 40 / highestValue + 10}px`;
      div.textContent = wordArray[i][0];
      div.classList.add('cloud_items');
      div.style.color = colorPallet[j];
      showWindow.appendChild(div);
      j++;

      if (j === 5) {
        j = 0;
      }
    }
  }
}

function changeColor(ev) {
  showCloud(saveMinedData);
}

function changeFont(ev) {
  showCloud(saveMinedData);
  selectedFont = ev.currentTarget.value;
}

function removeCloud() {
  for (let i = showWindow.children.length - 1; i > -1; i--) {
    showWindow.children[i].remove();
  }
  dataIndex = 0;
}
