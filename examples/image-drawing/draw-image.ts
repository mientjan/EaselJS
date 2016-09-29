import {Bitmap} from '../../src/easelts/display/Bitmap';
import {Stage} from "../../src/easelts/display/Stage";
import {Vector3} from "../../src/core/math/Vector3"; 


var v3 = new Vector3();

var holder = <HTMLDivElement> document.getElementById('holder');
var stage = new Stage(holder, {});

var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
stage.addChild(image);

// this will keep drawing the image / you can also do a update when this image is loaded.
stage.start();