define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug'], function (require, exports, Stage, Debug) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    stage.start();
    stage.addChild(new Debug('canvas', '100% - 300', '100% - 300', '50%', '50%', '50%', '50%'));
});
