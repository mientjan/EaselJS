import Stage = require('../../src/easelts/display/Stage');
import Debug = require('../../src/easelts/display/Debug');
import Bitmap = require('../../src/easelts/display/Bitmap');
import BitmapNinePatch = require('../../src/easelts/component/BitmapNinePatch');
import NinePatch = require('../../src/easelts/component/bitmapninepatch/NinePatch');
import Rectangle = require('../../src/easelts/geom/Rectangle');

import ButtonBehavior = require('../../src/easelts/behavior/ButtonBehavior');
//import FollowMouseBehavior = require('lib/easelts/behavior/FollowMouseBehavior');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.enableMouseOver();
stage.addChild(new Debug);

var bitmap = new BitmapNinePatch(
	new NinePatch('assets/image/ninepatch_red.png', new Rectangle(40, 100, 160, 100) ),
	'50%', '50%', '50%', '50%', '50%', '50%'
);

stage.addChild(bitmap);
//bitmap.addBehavior(new FollowMouseBehavior);

stage.start();