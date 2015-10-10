define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Bitmap', "../../src/easelts/ui/UIDefault"], function (require, exports, Stage_1, Bitmap_1, UIDefault_1) {
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, true);
    stage.ui = new UIDefault_1.default(stage);
    var image = new Bitmap_1.default('../assets/image/ninepatch_red.png', 0, 0, 0, 0, 0, 0);
    stage.addChild(image);
    stage.start();
});
