'use strict';

// global shits
var trials = 5;
var imageData = [['bag', 'jpg'],
                  ['banana', 'jpg'],
                  ['bathroom', 'jpg'],
                  ['boots', 'jpg'],
                  ['breakfast', 'jpg'],
                  ['bubblegum', 'jpg'],
                  ['chair', 'jpg'],
                  ['cthulhu', 'jpg'],
                  ['dog-duck', 'jpg'],
                  ['dragon', 'jpg'],
                  ['pen', 'jpg'],
                  ['pet-sweep', 'jpg'],
                  ['scissors', 'jpg'],
                  ['shark', 'jpg'],
                  ['sweep', 'png'],
                  ['tauntaun', 'jpg'],
                  ['unicorn', 'jpg'],
                  ['usb', 'gif'],
                  ['water-can', 'jpg'],
                  ['wine-glass', 'jpg']
                ];
var allImages;
var currentThree = new Array();

// DOM
var bigContainer = document.getElementById('all-image-container');
bigContainer.addEventListener('click', processSelection);
var buttonContainer = document.getElementById('button-container');
var resultContainer = document.getElementById('result-container');
var moreTrialsButton;
var resultButton;
moreTrialsButton = document.createElement('button');
resultButton = document.createElement('button');
moreTrialsButton.textContent = '10 more trials';
resultButton.textContent = 'display result';
moreTrialsButton.style.margin = '5px';
resultButton.style.margin = '5px';
moreTrialsButton.addEventListener('click', addMoreTrials);
resultButton.addEventListener('click', function() {
  displayResult();
  displayChart();
});
var resetButton = document.createElement('button');
resetButton.textContent = 'Reset';
resetButton.style.margin = '5px';
resetButton.addEventListener('click', reset);

class Image {
  constructor(name, extension) {
    this.name = name;
    this.id = name;
    this.extension = extension;
    this.filepath = '../assets/img/' + name + '.' + this.extension;
    this.displayN = 0;
    this.clickN = 0;
    this.percentage = this.calculatePercentage();
  }
}

Image.prototype.calculatePercentage = function() {
  if(this.displayN) {
    return (this.clickN/this.displayN * 100).toFixed(2);
  } else {
    return 'never been displayed';
  }
}

Image.prototype.incrementClickCount = function() {
  this.clickN++;
  this.percentage = this.calculatePercentage();
}

Image.prototype.incrementDisplayCount = function() {
  this.displayN++;
  this.percentage = this.calculatePercentage();
}

// Image manager
class ImageCollection {
  constructor(imageArray) {
    if(imageArray) {
      this.imageArray = imageArray;
    } else {
      this.imageArray = new Array();
    }
    this.size = this.imageArray.length;
  }
}

ImageCollection.prototype.getThreeRandomImages = function() {
  currentThree = new Array();
  var randomImage;
  var possibleIndices = new Array(20);
  for (var i = 0; i < possibleIndices.length; i++) {
    possibleIndices[i] = i;
  }
  shuffle(possibleIndices);

  for (var j = 0; j < 3; j++) {
    randomImage = this.imageArray[possibleIndices.pop()];
    currentThree.push(randomImage);
  }
}

// currently not used
ImageCollection.prototype.getRandomImage = function() {
  var random = Math.floor(Math.random() * (this.size));
  return this.imageArray[random];
}

ImageCollection.prototype.addImage = function(image) {
  this.imageArray.push(image);
  this.size = this.imageArray.length;
}

function collectAllImages() {
  allImages = new ImageCollection();
  for (var i = 0; i < imageData.length; i++) {
    var currentData = imageData[i];
    var newImage = new Image(currentData[0],currentData[1]);
    allImages.addImage(newImage);
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function showThreeNewImages() {
  var container;
  var newImgDocumentElement;
  var currentImage;

  allImages.getThreeRandomImages();

  for (var i = 0; i < currentThree.length; i++) {
    currentImage = currentThree[i];
    container = document.getElementById('image-container' + i);
    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    newImgDocumentElement = document.createElement('img');
    newImgDocumentElement.src = currentImage.filepath;
    newImgDocumentElement.id = currentImage.id;
    container.appendChild(newImgDocumentElement);
    currentImage.incrementDisplayCount();
  }
}

function processSelection(event) {
  if(trials) {
    var clickedOnDiv = Number.parseInt(event.target.parentNode.getAttribute('id').charAt(15));

    if(!isNaN(clickedOnDiv)) {
      var selectedImage = currentThree[clickedOnDiv];
      selectedImage.incrementClickCount();
      console.log(selectedImage.name + ' has been clicked on ' + selectedImage.clickN + ' times');
      console.log(selectedImage.name + ' has been displayed ' + selectedImage.displayN + ' times');
    }
    trials--;
    if(trials <= 0) {
      alert('done');
      addButtons();
    } else {
      showThreeNewImages();
    }
  } else {
    alert('stop clicking dude');
  }
}

function addMoreTrials() {
  trials += 10;
  showThreeNewImages();
  removeButtons();
}

function displayResult() {
  var resultHeader = document.createElement('h1');
  resultHeader.textContent = 'RESULTS';

  while(resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  var resultList = document.createElement('ul');

  for (var i = 0; i < allImages.imageArray.length; i++) {
    var item = document.createElement('li');
    item.textContent = (allImages.imageArray[i].name.toUpperCase() + '. Clicked: ' + allImages.imageArray[i].clickN + '. Displayed: ' + allImages.imageArray[i].displayN + '. Selection percentage: ' + allImages.imageArray[i].percentage);
    resultList.appendChild(item);
  }
  showResetButton();
  resultContainer.appendChild(resultHeader);
  resultContainer.appendChild(resultList);
}

// charting
var chartCanvasContainer = document.getElementById('chart-canvas-container');

function displayChart() {
  while (chartCanvasContainer.firstChild) {
    chartCanvasContainer.removeChild(chartCanvasContainer.firstChild);
  }
  var chartCanvas = document.createElement('canvas');
  chartCanvas.getContext('2d');
  chartCanvasContainer.appendChild(chartCanvas);

  var titles = new Array();
  var clickData = new Array();
  var displayData = new Array();

  for (var k = 0; k < allImages.imageArray.length; k++) {
    titles.push(allImages.imageArray[k].name);
    clickData.push(allImages.imageArray[k].clickN);
    displayData.push(allImages.imageArray[k].displayN);
  }

  var chartData = {
    labels: titles,
    datasets: [
      {
        label: "Times Displayed",
        backgroundColor: "rgba(204,51,17,1)",
        borderColor: "rgba(204,51,17,1)",
        borderWidth: 1,
        data: displayData,
        yAxisID: "y-axis-0",
      },
      {
        label: "Times Selected",
        backgroundColor: "rgba(0,0,0,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: clickData
      }
    ]
  };

  var myBarChart = new Chart(chartCanvas.getContext('2d'), {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
      }
  });

  chartCanvasContainer.appendChild(chartCanvas);
}

function showResetButton() {
  removeButtons();
  buttonContainer.appendChild(resetButton);
}

function reset() {
  trials = 5;
  collectAllImages();
  showThreeNewImages();

  removeButtons();
  removeResult();
  removeChart();
}

function addButtons() {
  buttonContainer.appendChild(moreTrialsButton);
  buttonContainer.appendChild(resultButton);
}

function removeButtons() {
  while (buttonContainer.firstChild) {
    buttonContainer.removeChild(buttonContainer.firstChild);
  }
}

function removeResult() {
  while(resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }
}

function removeChart() {
  while (chartCanvasContainer.firstChild) {
    chartCanvasContainer.removeChild(chartCanvasContainer.firstChild);
  }
}

// run this shit
collectAllImages();
console.log(allImages);
showThreeNewImages();
