define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Shape', '../../src/easelts/behavior/ButtonBehavior', '../../src/easelts/display/BitmapProjective'], function (require, exports, Stage_1, Shape_1, ButtonBehavior_1, BitmapProjective_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, true);
    stage.enableMouseOver(20);
    var points = [
        [100, 100],
        [200 + Math.random() * 200, 100],
        [100, 200 + Math.random() * 200],
        [200 + Math.random() * 200, 200 + Math.random() * 200]
    ];
    var image = new BitmapProjective_1.BitmapProjective('../assets/image/ninepatch_red.png', points, 0, 0, 0);
    stage.addChild(image);
    stage.start();
    var buttonPoints = [];
    for (var i = 0; i < 4; i++) {
        var btn = new Shape_1.Shape();
        btn.graphics.beginFill('#FF0').beginStroke('#000').drawRect(0, 0, 30, 30);
        btn.addBehavior(new ButtonBehavior_1.ButtonBehavior);
        btn.addEventListener(Stage_1.Stage.EVENT_PRESS_MOVE, function (index, event) {
            var x = event.rawX;
            var y = event.rawY;
            var lx = event.getLocalX();
            var ly = event.getLocalY();
            points[index][0] = x;
            points[index][1] = y;
            this.x = x;
            this.y = y;
            image.setPoints(points);
        }.bind(btn, i));
        btn.x = points[i][0];
        btn.y = points[i][1];
        buttonPoints.push(btn);
        stage.addChild(btn);
    }
});
