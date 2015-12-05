define(["require", "exports", "../../src/core/math/Vector3", "../../src/core/math/Matrix4", "../../src/easelts/display/Stage", "../../src/easelts/display/Shape", "../../src/core/util/Interval"], function (require, exports, Vector3_1, Matrix4_1, Stage_1, Shape_1, Interval_1) {
    var v3_0 = new Vector3_1.Vector3();
    var v3_1 = new Vector3_1.Vector3();
    var v3_2 = new Vector3_1.Vector3();
    var camera = new Matrix4_1.Matrix4().makePerspective(1, 4 / 3, 1, 1100);
    var world = new Matrix4_1.Matrix4().identity();
    var end = new Matrix4_1.Matrix4().identity();
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, {});
    var total = 100;
    var items = [];
    for (var i = 0; i < total; i++) {
        var shape = new Shape_1.default();
        shape.graphics.beginFill('#FFFFFF').drawRect(0, 0, 10, 10);
        shape.x = Math.random() * stage.width;
        shape.y = Math.random() * stage.height;
        stage.addChild(shape);
        items.push(new Vector3_1.Vector3(shape.x, shape.y, shape.x));
    }
    var interval = new Interval_1.default(60).attach(function (delta) {
        var children = stage.children;
        var end = camera.clone().multiply(world);
        children.forEach(function (element) {
        });
    });
    stage.start();
});
