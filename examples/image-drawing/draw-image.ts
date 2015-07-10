import { Stage } from '../../src/easelts/display/Stage';
import Bitmap = require('../../src/easelts/display/Bitmap');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);

var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
stage.addChild(image);

// this will keep drawing the image / you can also do a update when this image is loaded.
setInterval(() => {
	stage.update(0);
}, 1000 / 2)