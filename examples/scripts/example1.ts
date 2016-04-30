import {Stage} from '../../src/easelts/display/Stage';
import {Debug} from '../../src/easelts/display/Debug';

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.addChild(new Debug);
stage.start();