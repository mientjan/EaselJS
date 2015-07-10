define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Shape', '../../src/easelts/behavior/ButtonBehavior', '../../src/easelts/display/BitmapProjective'], function (require, exports, Stage_1, Shape, ButtonBehavior, BitmapProjective) {
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, true);
    var points = [
        [100, 100],
        [200 + Math.random() * 200, 100],
        [100, 200 + Math.random() * 200],
        [200 + Math.random() * 200, 200 + Math.random() * 200]
    ];
    var image = new BitmapProjective('../assets/image/ninepatch_red.png', points, 0, 0, 0);
    stage.addChild(image);
    stage.start();
    var buttonPoints = [];
    for (var i = 0; i < 4; i++) {
        var btn = new Shape();
        btn.graphics.beginFill('#FF0').beginStroke('#000').drawRect(0, 0, 30, 30);
        btn.addBehavior(new ButtonBehavior);
        btn.x = points[i][0];
        btn.y = points[i][1];
        buttonPoints.push(btn);
        stage.addChild(btn);
    }
});
