define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/display/Bitmap', '../../src/easelts/behavior/ButtonBehavior'], function (require, exports, Stage_1, Debug_1, Bitmap_1, ButtonBehavior_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, true);
    stage.enableMouseOver();
    stage.addChild(new Debug_1.Debug);
    var btn = new Bitmap_1.Bitmap('assets/image/ninepatch_red.png', 0, 0, '100%', 0, '100%', 0);
    btn.addBehavior(new ButtonBehavior_1.ButtonBehavior);
    stage.addChild(btn);
    btn.addEventListener(Bitmap_1.Bitmap.EVENT_MOUSE_CLICK, function () {
        alert('i clicked this button');
    });
    stage.start();
});
