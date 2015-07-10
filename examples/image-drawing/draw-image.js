define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Bitmap'], function (require, exports, Stage_1, Bitmap) {
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, true);
    var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
    stage.addChild(image);
    setInterval(function () {
        stage.update(0);
    }, 1000 / 2);
});
