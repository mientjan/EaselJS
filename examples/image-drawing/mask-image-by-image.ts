import {Stage} from "../../src/easelts/display/Stage";
import {Bitmap} from "../../src/easelts/display/Bitmap";
import {Container} from "../../src/easelts/display/Container";
import {Canvas2DElement} from "../../src/easelts/renderer/Canvas2DElement";


var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, {autoResize:true});

var container = new Container().setBuffer(new Canvas2DElement(500, 500), true)
var image = new Bitmap('../assets/image/ninepatch_red.png', '100%', '100%', 0, 0, 0, 0);
var mask = new Bitmap('../assets/image/mask-image.png', 0, 0, '50%', '50%', '50%', '50%');
mask.compositeOperation = Bitmap.COMPOSITE_OPERATION_DESTINATION_OUT;

container.addChild(image);
container.addChild(mask);

stage.addChild(container);

var container = new Container().setBuffer(new Canvas2DElement(500, 500));

var mask = new Bitmap('../assets/image/mask-image.png', 0, 0, 20, 20, 0, 0);
var image = new Bitmap('../assets/image/ninepatch_red.png', '50%', '50%', 0, 0, 0, 0);
mask.compositeOperation = Bitmap.COMPOSITE_OPERATION_DESTINATION_IN;

container.addChild(image);
container.addChild(mask);
stage.addChild(container);

stage.start();

setTimeout(() => {
	container.cache(0, 0, 1000, 1000, 1);
}, 1000);