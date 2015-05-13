import Stage = require('../../src/easelts/display/Stage');
import Bitmap = require('../../src/easelts/display/Bitmap');
import Shape = require('../../src/easelts/display/Shape');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);

var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
stage.addChild(image);

var shape = new Shape();
shape.graphics.rect(10,10,100,100);

image.mask = shape;

// this will keep drawing the image / you can also do a update when this image is loaded.
stage.start();