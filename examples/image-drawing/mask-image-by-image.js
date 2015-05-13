define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Bitmap', '../../src/easelts/display/Container'], function (require, exports, Stage, Bitmap, Container) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    var container = new Container().setRenderIsolation(true);
    var image = new Bitmap('../assets/image/ninepatch_red.png', '100%', '100%', 0, 0, 0, 0);
    var mask = new Bitmap('../assets/image/mask-image.png', 0, 0, '50%', '50%', '50%', '50%');
    mask.compositeOperation = Bitmap.COMPOSITE_OPERATION_DESTINATION_OUT;
    container.addChild(image);
    container.addChild(mask);
    stage.addChild(container);
    var container = new Container().setRenderIsolation(true);
    var mask = new Bitmap('../assets/image/mask-image.png', 0, 0, 20, 20, 0, 0);
    var image = new Bitmap('../assets/image/ninepatch_red.png', '50%', '50%', 0, 0, 0, 0);
    mask.compositeOperation = Bitmap.COMPOSITE_OPERATION_DESTINATION_IN;
    container.addChild(image);
    container.addChild(mask);
    stage.addChild(container);
    stage.start();
});
