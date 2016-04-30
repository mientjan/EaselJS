define(["require", "exports", '../../src/easelts/display/Bitmap', "../../src/easelts/display/Stage", "../../src/core/math/Vector3"], function (require, exports, Bitmap_1, Stage_1, Vector3_1) {
    "use strict";
    var v3 = new Vector3_1.Vector3();
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, {});
    var image = new Bitmap_1.Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
    stage.addChild(image);
    stage.start();
});
