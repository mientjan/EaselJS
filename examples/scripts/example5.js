define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/component/BitmapNinePatch', '../../src/easelts/component/bitmapninepatch/NinePatch', '../../src/easelts/geom/Rectangle'], function (require, exports, Stage, Debug, BitmapNinePatch, NinePatch, Rectangle) {
    //import FollowMouseBehavior = require('lib/easelts/behavior/FollowMouseBehavior');
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    stage.enableMouseOver();
    stage.addChild(new Debug);
    var bitmap = new BitmapNinePatch(new NinePatch('assets/image/ninepatch_red.png', new Rectangle(40, 100, 160, 100)), '50%', '50%', '50%', '50%', '50%', '50%');
    stage.addChild(bitmap);
    //bitmap.addBehavior(new FollowMouseBehavior);
    stage.start();
});
