define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/display/Bitmap'], function (require, exports, Stage, Debug, Bitmap) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    stage.addChild(new Debug);
    stage.addChild(new Bitmap('assets/image/ninepatch_red.png', 0, 0, '100%', 0, '100%', 0));
    stage.start();
});
