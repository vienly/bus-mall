'use strict';

var trials = 25;
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
    this.percentage = 0;
  }
}

Image.prototype.calculatePercentage = function() {
  if(this.displayN) {
    return this.clickN/this.displayN;
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
var clickedOnDiv;

var bigContainer = document.getElementById('all-image-container');
bigContainer.addEventListener('click', processSelection);

function processSelection(event) {
  if(trials) {
    var clickedOnDiv = Number.parseInt(event.target.parentNode.getAttribute('id').charAt(15));

    if(!isNaN(clickedOnDiv)) {
      currentThree[clickedOnDiv].incrementClickCount();
      console.log(currentThree[clickedOnDiv].name + ' has been clicked on ' + currentThree[clickedOnDiv].clickN + ' times');
      console.log(currentThree[clickedOnDiv].name + ' has been displayed ' + currentThree[clickedOnDiv].displayN + ' times');

      showThreeNewImages();
    }
    trials--;
  } else {
    alert('you\'re done!')
  }
}
