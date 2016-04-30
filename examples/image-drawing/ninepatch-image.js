define(["require", "exports", '../../src/easelts/display/Stage', "../../src/easelts/component/BitmapNinePatch", "../../src/easelts/component/bitmapninepatch/NinePatch", "../../src/easelts/geom/Rectangle", "../../src/easelts/display/Debug"], function (require, exports, Stage_1, BitmapNinePatch_1, NinePatch_1, Rectangle_1, Debug_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, { autoResize: true });
    var ninePatch = new NinePatch_1.NinePatch('../assets/image/ninepatch_red.png', new Rectangle_1.Rectangle(100, 100, 300, 300));
    var image = new BitmapNinePatch_1.BitmapNinePatch(ninePatch);
    stage.addChild(new Debug_1.Debug);
    stage.addChild(image);
    stage.start();
});
