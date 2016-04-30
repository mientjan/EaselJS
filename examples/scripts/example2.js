define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/display/Bitmap'], function (require, exports, Stage_1, Debug_1, Bitmap_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, true);
    setTimeout(function () { return stage.addChild(new Debug_1.Debug); }, 1000);
    stage.addChild(new Bitmap_1.Bitmap('assets/image/ninepatch_red.png'));
    stage.start();
});
