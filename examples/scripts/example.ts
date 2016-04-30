import {Stage} from '../../src/easelts/display/Stage';
import {Debug} from '../../src/easelts/display/Debug';

var holder = document.getElementById('holder');

var stage = new Stage( <HTMLDivElement> holder, {});
stage.start();

stage.addChild(new Debug('canvas', '100% - 300', '100% - 300', '50%', '50%', '50%', '50%'));

