import {Stage} from '../../src/easelts/display/Stage';
import {Debug} from '../../src/easelts/display/Debug';
import {Bitmap} from '../../src/easelts/display/Bitmap';

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.addChild(new Debug);
stage.addChild(new Bitmap('assets/image/ninepatch_red.png', 0, 0, '100%', 0, '100%', 0));
stage.start();