define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/display/Bitmap', '../../src/easelts/behavior/ButtonBehavior'], function (require, exports, Stage, Debug, Bitmap, ButtonBehavior) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    stage.enableMouseOver();
    stage.addChild(new Debug);
    var btn = new Bitmap('assets/image/ninepatch_red.png', 0, 0, '100%', 0, '100%', 0);
    btn.addBehavior(new ButtonBehavior);
    stage.addChild(btn);
    btn.addEventListener(Bitmap.EVENT_MOUSE_CLICK, function () {
        alert('i clicked this button');
    });
    stage.start();
});
