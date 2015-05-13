import Stage = require('../../src/easelts/display/Stage');
import Debug = require('../../src/easelts/display/Debug');
import Bitmap = require('../../src/easelts/display/Bitmap');
import ButtonBehavior = require('../../src/easelts/behavior/ButtonBehavior');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.enableMouseOver();
stage.addChild(new Debug);

var btn = new Bitmap('assets/image/ninepatch_red.png', 0, 0, '100%', 0, '100%', 0);
btn.addBehavior(new ButtonBehavior);
stage.addChild(btn);

btn.addEventListener(Bitmap.EVENT_MOUSE_CLICK, () => {
	alert('i clicked this button');
})


stage.start();