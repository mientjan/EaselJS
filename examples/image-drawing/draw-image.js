define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Bitmap'], function (require, exports, Stage, Bitmap) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
    stage.addChild(image);
    stage.start();
});
