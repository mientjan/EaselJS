import Stage from '../../src/easelts/display/Stage';
import Bitmap from '../../src/easelts/display/Bitmap';
import UIDefault from "../../src/easelts/ui/UIDefault";

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.ui = new UIDefault(stage);

var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
stage.addChild(image);

// this will keep drawing the image / you can also do a update when this image is loaded.
stage.start();
