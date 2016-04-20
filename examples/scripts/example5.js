define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/component/BitmapNinePatch', '../../src/easelts/component/bitmapninepatch/NinePatch', '../../src/easelts/geom/Rectangle'], function (require, exports, Stage_1, Debug_1, BitmapNinePatch_1, NinePatch_1, Rectangle_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, true);
    stage.enableMouseOver();
    stage.addChild(new Debug_1.default);
    var bitmap = new BitmapNinePatch_1.default(new NinePatch_1.default('assets/image/ninepatch_red.png', new Rectangle_1.default(40, 100, 160, 100)), '50%', '50%', '50%', '50%', '50%', '50%');
    stage.addChild(bitmap);
    stage.start();
});
