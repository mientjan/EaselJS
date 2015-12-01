define(["require", "exports", "../../src/easelts/display/Stage", "../../src/easelts/geom/Vector3", "../../src/easelts/geom/Matrix4"], function (require, exports, Stage_1, Vector3_1, Matrix4_1) {
    var v3_0 = new Vector3_1.default();
    var v3_1 = new Vector3_1.default();
    var v3_2 = new Vector3_1.default();
    var camera = new Matrix4_1.default().makePerspective(1, 4 / 3, 1, 1100);
    var world = new Matrix4_1.default().identity();
    var obj = new Matrix4_1.default().identity();
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, {});
    var items = [];
    for (var i = 0; i < 50; i++) {
        var obj1 = [i];
    }
    stage.start();
});
