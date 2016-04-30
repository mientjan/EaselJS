import {Stage} from '../../src/easelts/display/Stage';
import {Debug} from '../../src/easelts/display/Debug';
import {Bitmap} from '../../src/easelts/display/Bitmap';
import {BitmapNinePatch} from '../../src/easelts/component/BitmapNinePatch';
import {NinePatch} from '../../src/easelts/component/bitmapninepatch/NinePatch';
import {Rectangle} from '../../src/easelts/geom/Rectangle';

import {ButtonBehavior} from '../../src/easelts/behavior/ButtonBehavior';
//import {FollowMouseBehavior} from 'lib/easelts/behavior/FollowMouseBehavior';

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