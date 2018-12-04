// Load application styles
import 'styles/index.less';

// ================================
// START YOUR APP HERE
// ================================

const $serviceName = document.getElementsByClassName('service_name')[0];
const $inputWindow = document.getElementsByClassName('input_window')[0];
const $textBox = document.getElementsByClassName('input_text')[0];
const $wordCounter = document.getElementsByClassName('word_counter')[0];
const $descriptionLayer = document.getElementsByClassName('description_layer')[0];
const $showWindow = document.getElementsByClassName('show_window')[0];
const $controlButtons = document.getElementsByClassName('control_buttons');
const $fontSelect = document.getElementsByClassName('font-select')[0];
const $colorSelect = document.getElementsByClassName('color-select')[0];
const $colorStorage = {
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
const $fontStorage = {
  lobster: 'font_lobster',
  openSans: 'font_open_sans',
  indieFlower: 'font_indie_flower',
};
let $colorIndex = 0;
let $selectedColor = 'bright';
let $selectedFont = '';
let $savedMinedData = [];
let $dataIndex = 0;
let $showType = 'List';
let $lastFunctionTime = 0;

$serviceName.addEventListener('click', ev => window.location.reload());
$textBox.addEventListener('input', getText);
$colorSelect.addEventListener('change', changeColor);
$fontSelect.addEventListener('change', changeFont);
$showWindow.addEventListener('mousedown', addMousemoveEvent);
$showWindow.addEventListener('mouseup', removeMousemoveEvent);

for (let i = 0; i < $controlButtons.length; i++) {
  $controlButtons[i].addEventListener('click', changeShowType);
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
    if ($inputWindow.classList.contains('overflow')) {
      $inputWindow.classList.remove('overflow');
    }

    analyzeText(inputString);
  } else {
    $inputWindow.classList.add('overflow');
  }

  if (!$showWindow.innerHTML) {
    $descriptionLayer.classList.remove('hidden');
  } else {
    $descriptionLayer.classList.add('hidden');
  }

  function showTextLength(textLength) {
    $wordCounter.children[0].textContent = `type : ${textLength}`;
  }
}

function analyzeText(inputString) {
  const notEnglishPattern = /[^a-zA-Z0-9\s']/g;
  const beginWithCommaPattern = /^'|''+/gm;
  const endWithCommaPattern = /'\s|'$/gm;
  const spacePattern = /[\r|\n|\s\s+]/g;
  let minedString = inputString.replace(notEnglishPattern, '');

  minedString = minedString.replace(beginWithCommaPattern, '');
  minedString = minedString.replace(endWithCommaPattern, ' ');
  minedString = minedString.replace(spacePattern, ' ');

  const splitedString = minedString.split(' ');
  const wordDictionary = {};
  let wordAndCount = [];

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
      wordAndCount.push([key, wordDictionary[key]]);
    }
  }

  wordAndCount = wordAndCount.sort((a,b) => b[1] - a[1]);
  $savedMinedData = wordAndCount;

  if ($showType === 'List') {
    makeListText(wordAndCount);
  }
}

function makeListText(wordAndCount) {
  removeCloud();

  if (wordAndCount[0] !== undefined) {
    const highestValue = wordAndCount[0][1];
    const colorPallet = $colorStorage[$selectedColor];
    let colorIndex = 0;

    for (let i = 0; i < wordAndCount.length; i++) {
      const cloudItem = document.createElement('div');

      cloudItem.textContent = wordAndCount[i][0];
      cloudItem.style.fontSize = `${wordAndCount[i][1] * 40 / highestValue + 8}px`;
      cloudItem.style.color = colorPallet[colorIndex];
      cloudItem.classList.add('cloud_items');
      $showWindow.appendChild(cloudItem);
      colorIndex++;

      if (colorIndex === 5) {
        colorIndex = 0;
      }
    }
  }
}

function makeCanvasText(ev) {
  if ($showType === 'Canvas') {
    if (Date.now() - $lastFunctionTime > 100) {
      if ($savedMinedData[$dataIndex]) {
        const colorPallet = $colorStorage[$selectedColor];
        const highestValue = $savedMinedData[0][1];
        const cloudItem = document.createElement('div');

        ev.currentTarget.appendChild(cloudItem);
        cloudItem.textContent = $savedMinedData[$dataIndex][0];
        cloudItem.style.fontSize = `${$savedMinedData[$dataIndex][1] * 40 / highestValue + 10}px`;
        cloudItem.style.color = colorPallet[$colorIndex];
        cloudItem.classList.add('canvas');
        cloudItem.style.top = `${ev.offsetY - cloudItem.offsetHeight / 2}px`;
        cloudItem.style.left = `${ev.offsetX - cloudItem.offsetWidth / 2}px`;
        cloudItem.addEventListener('mousemove', ev => ev.stopPropagation());
        $dataIndex++;
        $colorIndex++;

        if ($colorIndex === 5) {
          $colorIndex = 0;
        }
      }

      $lastFunctionTime = Date.now();
    }
  }
}

function changeShowType(ev) {
  if (ev.target.textContent === 'Canvas') {
    $showType = 'Canvas';
    removeCloud();
  } else {
    $showType = 'List';
    makeListText($savedMinedData);
  }
}

function changeColor(ev) {
  $selectedColor = ev.currentTarget.value;
  const colorPallet = $colorStorage[$selectedColor];
  let colorIndex = 0;

  for (let i = 0; i < $showWindow.children.length; i++) {
    $showWindow.children[i].style.color = colorPallet[colorIndex];
    colorIndex++;

    if (colorIndex === 5) {
      colorIndex = 0;
    }
  }
}

function changeFont(ev) {
  $showWindow.classList.remove($fontStorage[$selectedFont]);
  $selectedFont = ev.currentTarget.value;
  $showWindow.classList.add($fontStorage[$selectedFont]);
}

function addMousemoveEvent(ev) {
  $showWindow.addEventListener('mousemove', makeCanvasText);
}

function removeMousemoveEvent(ev) {
  $showWindow.removeEventListener('mousemove', makeCanvasText);
}

function removeCloud() {
  for (let i = $showWindow.children.length - 1; i > -1; i--) {
    $showWindow.children[i].remove();
  }

  $dataIndex = 0;
}
