define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug'], function (require, exports, Stage_1, Debug_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, true);
    stage.addChild(new Debug_1.default);
    stage.start();
});
