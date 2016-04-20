define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Bitmap'], function (require, exports, Stage_1, Bitmap_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, true);
    var image = new Bitmap_1.default('../assets/image/ninepatch_red.png', '100%', '100%', 0, 0, 0, 0);
    stage.addChild(image);
    stage.start();
});
