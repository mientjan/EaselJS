define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/display/Bitmap'], function (require, exports, Stage, Debug, Bitmap) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    setTimeout(function () { return stage.addChild(new Debug); }, 1000);
    stage.addChild(new Bitmap('assets/image/ninepatch_red.png'));
    stage.start();
});
