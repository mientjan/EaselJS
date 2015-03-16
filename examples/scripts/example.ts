import Stage = require('../../src/easelts/display/Stage');
import Debug = require('../../src/easelts/display/Debug');

var holder = document.getElementById('holder');

var stage = new Stage(holder, true);
stage.start();

stage.addChild(new Debug('canvas', '100% - 300', '100% - 300', '50%', '50%', '50%', '50%'));

