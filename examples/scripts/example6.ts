import Stage = require('../../src/easelts/display/Stage');
import Debug = require('../../src/easelts/display/Debug');
import Bitmap = require('../../src/easelts/display/Bitmap');
import BitmapNinePatch = require('../../src/easelts/component/BitmapNinePatch');
import NinePatch = require('../../src/easelts/component/bitmapninepatch/NinePatch');
import Rectangle = require('../../src/easelts/geom/Rectangle');

import ButtonBehavior = require('../../src/easelts/behavior/ButtonBehavior');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.enableMouseOver();
stage.addChild(new Debug);

var video = document.createElement('video');
video.loop = true;
video.src = 'assets/video/placeholder_480x270.mp4';
video.width = 480;
video.height = 270;
video.play();

var nine = new NinePatch(video, new Rectangle(100, 50, 280, 170));


stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '0%', '0%', '0%', '0%').addBehavior(new ButtonBehavior));
stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '100%', '0%', '100%', '0%').addBehavior(new ButtonBehavior));
stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '0%', '100%', '0%', '100%').addBehavior(new ButtonBehavior));
stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '100%', '100%', '100%', '100%').addBehavior(new ButtonBehavior));

stage.start();