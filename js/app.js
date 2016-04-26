'use strict';

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

var currentThree = new Array();

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

// Log all possible images
var allImages = new ImageCollection();

for (var i = 0; i < imageData.length; i++) {
  var currentData = imageData[i];
  var newImage = new Image(currentData[0],currentData[1]);
  allImages.addImage(newImage);
}

console.log(allImages);

// randomize arrays to pop numbers out of to ensure no duplicates
// repopulate array everytime we show 3 new items
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
  // var randomImg;
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
    newImgDocumentElement.width = 300;
    newImgDocumentElement.height = 300;
    container.appendChild(newImgDocumentElement);
    currentImage.incrementDisplayCount();
  }
}

showThreeNewImages();

var bigContainer = document.getElementById('all-image-container');
bigContainer.addEventListener('click', processSelection);
var moreTrialsButton = document.getElementById('more-trials-button');
moreTrialsButton.addEventListener('click', addMoreTrials);
var resultButton = document.getElementById('result-button');
resultButton.addEventListener('click', displayResult);

var resultContainer = document.getElementById('result-container');

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
      moreTrialsButton.style.visibility = 'visible';
      resultButton.style.visibility = 'visible';
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
  moreTrialsButton.style.visibility = 'hidden';
  resultButton.style.visibility = 'hidden';

}

function displayResult() {
  while(resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  var resultList = document.createElement('ul');

  for (var i = 0; i < allImages.imageArray.length; i++) {
    var item = document.createElement('li');
    item.textContent = (allImages.imageArray[i].name + ' has been clicked ' + allImages.imageArray[i].clickN + ' times out of ' + allImages.imageArray[i].displayN + ' times displayed. Selection percentage: ' + allImages.imageArray[i].percentage);
    resultList.appendChild(item);
  }
  resultContainer.appendChild(resultList);
  moreTrialsButton.style.visibility = 'hidden';
  resultButton.style.visibility = 'hidden';
}
