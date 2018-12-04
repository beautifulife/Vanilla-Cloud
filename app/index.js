// Load application styles
import 'styles/index.less';

// ================================
// START YOUR APP HERE
// ================================

const $serviceName = document.getElementsByClassName('service_name')[0];
const $inputWindow = document.getElementsByClassName('input_window')[0];
const $textBox = document.getElementsByClassName('input_text')[0];
const $statisticWindow = document.getElementsByClassName('statistic_window')[0];
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
let $saveBeforeAfterData;
let $dataIndex = 0;
let $showType = 'List';
let $lastFunctionTime = 0;
let $statisticValue = '';

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

  checkDescriptionLayer();

  function showTextLength(textLength) {
    $wordCounter.children[0].textContent = `type : ${textLength}`;
  }
}

function analyzeText(inputString) {
  const notEnglishPattern = /[^a-zA-Z\s']/g;
  const beginWithCommaPattern = /^'|''+/gm;
  const endWithCommaPattern = /'\s|'$/gm;
  const spacePattern = /[\r|\n|\s\s+]/g;
  let minedString = inputString.replace(notEnglishPattern, '');

  minedString = minedString.replace(beginWithCommaPattern, '');
  minedString = minedString.replace(endWithCommaPattern, ' ');
  minedString = minedString.replace(spacePattern, ' ');

  const splitedString = minedString.split(' ');
  const splitedLowerString = splitedString.map(string => string.toLowerCase());
  const wordDictionary = {};
  let wordAndCount = [];

  for (let i = 0; i < splitedString.length; i++) {
    if (wordDictionary[splitedLowerString[i]] === undefined) {
      const beforeString = {};
      const afterString = {};

      if (splitedLowerString[i - 1]) {
        beforeString[splitedLowerString[i - 1]] = 1;
      } else {
        beforeString.Blank = 0;
      }

      if (splitedLowerString[i + 1]) {
        afterString[splitedLowerString[i + 1]] = 1;
      } else {
        afterString.Blank = 0;
      }

      wordDictionary[splitedLowerString[i]] = {};
      wordDictionary[splitedLowerString[i]].count = 1;
      wordDictionary[splitedLowerString[i]].before = beforeString;
      wordDictionary[splitedLowerString[i]].after = afterString;
    } else {
      const wordDictionaryIndexString = wordDictionary[splitedLowerString[i]];

      wordDictionaryIndexString.count++;

      if (wordDictionaryIndexString.before[splitedLowerString[i - 1]]) {
        wordDictionaryIndexString.before[splitedLowerString[i - 1]]++;
      } else {
        wordDictionaryIndexString.before[splitedLowerString[i - 1]] = 1;
      }

      if (splitedString[i + 1]) {
        if (wordDictionaryIndexString.after[splitedLowerString[i + 1]]) {
          wordDictionaryIndexString.after[splitedLowerString[i + 1]]++;
        } else {
          wordDictionaryIndexString.after[splitedLowerString[i + 1]] = 1;
        }
      }
    }
  }

  delete wordDictionary[''];

  for (let key in wordDictionary) {
    if (wordDictionary.hasOwnProperty(key)) {
      wordAndCount.push([key, wordDictionary[key].count]);
    }
  }

  wordAndCount = wordAndCount.sort((a,b) => b[1] - a[1]);
  $savedMinedData = wordAndCount;
  $saveBeforeAfterData = wordDictionary;

  if ($showType === 'List') {
    makeListText(wordAndCount);
  } else {
    removeCloud();
  }
}

function makeListText(wordAndCount) {
  removeCloud();

  if (wordAndCount[0] !== undefined) {
    const highestValue = Math.sqrt(wordAndCount[0][1]);
    const colorPallet = $colorStorage[$selectedColor];
    let colorIndex = 0;

    for (let i = 0; i < wordAndCount.length; i++) {
      const cloudItem = document.createElement('div');

      $showWindow.appendChild(cloudItem);
      cloudItem.textContent = wordAndCount[i][0];
      cloudItem.style.fontSize = `${Math.sqrt(wordAndCount[i][1]) * 60 / highestValue}px`;
      cloudItem.style.color = colorPallet[colorIndex];
      cloudItem.classList.add('cloud_items');
      cloudItem.addEventListener('click', showStatistic);
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
        const highestValue = Math.sqrt($savedMinedData[0][1]);
        const cloudItem = document.createElement('div');

        ev.currentTarget.appendChild(cloudItem);
        cloudItem.textContent = $savedMinedData[$dataIndex][0];
        cloudItem.style.fontSize = `${Math.sqrt($savedMinedData[$dataIndex][1]) * 60 / highestValue}px`;
        cloudItem.style.color = colorPallet[$colorIndex];
        cloudItem.classList.add('canvas');
        cloudItem.style.top = `${ev.offsetY - cloudItem.offsetHeight / 2}px`;
        cloudItem.style.left = `${ev.offsetX - cloudItem.offsetWidth / 2}px`;
        cloudItem.addEventListener('mousemove', ev => ev.stopPropagation());
        cloudItem.addEventListener('click', showStatistic);
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

function checkDescriptionLayer() {
  if (!$textBox.value) {
    $descriptionLayer.classList.remove('hidden');
  } else {
    $descriptionLayer.classList.add('hidden');
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

  checkDescriptionLayer();
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

function showStatistic(ev) {
  if ($statisticValue !== ev.currentTarget.textContent
  || $statisticWindow.classList.contains('hidden')) {
    const chosenText = document.getElementsByClassName('chosen_text')[0];
    const statisticContent = document.getElementsByClassName('statistic_content')[0];
    const calculatedData = calculateStatistic(ev.currentTarget.textContent);
    const statisticTable = document.createElement('div');

    console.log(calculatedData);

    if (statisticContent.children[1]) {
      statisticContent.children[1].remove();
    }

    for (let i = 0; i < 8; i++) {
      const tableRow = document.createElement('div');
      tableRow.classList.add('table_row');

      for (let j = 0; j < 3; j++) {
        const tableData = document.createElement('span');
        let beforeAfterText;

        if (j === 0) {
          if (i === 0) {
            beforeAfterText = 'Before';
          } else {
            if (calculatedData[0][i - 1] !== undefined) {
              beforeAfterText = calculatedData[0][i - 1][0];
            } else {
              beforeAfterText = '';
            }
          }
        } else if (j === 1) {
          if (i === 0) {
            beforeAfterText = 'Rank';
          } else {
            if (calculatedData[0][i - 1] !== undefined || calculatedData[1][i - 1] !== undefined ) {
              beforeAfterText = i;
            } else {
              beforeAfterText = '';
            }
          }
        } else {
          if (i === 0) {
            beforeAfterText = 'After';
          } else {
            if (calculatedData[1][i - 1] !== undefined) {
              beforeAfterText = calculatedData[1][i - 1][0];
            } else {
              beforeAfterText = '';
            }
          }
        }

        if (i === 0) {
          tableData.style.fontWeight = 'bold';
        }

        tableData.textContent = beforeAfterText;
        tableData.classList.add('table_data');
        tableRow.appendChild(tableData);
      }
      statisticTable.appendChild(tableRow);
    }
    statisticTable.classList.add('statistic_table');
    statisticContent.appendChild(statisticTable);

    chosenText.textContent = ev.currentTarget.textContent;
    chosenText.style.color = ev.currentTarget.style.color;
    $statisticWindow.classList.remove('hidden');
    setTimeout(() => $statisticWindow.style.left = '0', 0);
    $statisticValue = ev.currentTarget.textContent;
  } else {
    $statisticWindow.style.left = '';
    setTimeout(() => $statisticWindow.classList.add('hidden'), 1000);
  }
}

function calculateStatistic(currentTextData) {
  const beforeAfterData = $saveBeforeAfterData[currentTextData];
  let beforeData = [];
  let afterData = [];

  delete beforeAfterData.before[''];
  delete beforeAfterData.after[''];

  for (let key in beforeAfterData.before) {
    if (beforeAfterData.before.hasOwnProperty(key)) {
    beforeData.push([key, beforeAfterData.before[key]]);
    }
  }

  for (let key in beforeAfterData.after) {
    if (beforeAfterData.after.hasOwnProperty(key)) {
      afterData.push([key, beforeAfterData.after[key]]);
    }
  }

  beforeData = beforeData.sort((a,b) => b[1] - a[1]);
  afterData = afterData.sort((a,b) => b[1] - a[1]);

  return [beforeData, afterData];
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
