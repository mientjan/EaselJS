var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../display/Container', '../../facebook/Layout'], function (require, exports, Container, Layout) {
    var FlexBox = (function (_super) {
        __extends(FlexBox, _super);
        function FlexBox(width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.style = {};
        }
        FlexBox.prototype.onResize = function (size) {
            _super.prototype.onResize.call(this, size);
            this.layout();
        };
        FlexBox.prototype.layout = function () {
            if (this.children.length > 0) {
                var tree = this.buildTree(this);
                tree.style = { width: this.width, height: this.height, flexDirection: "row", flexWrap: "wrap", alignItems: "center" };
                var t0 = performance.now();
                Layout.fillNodes(tree);
                Layout.computeLayout(tree);
                console.log(tree);
                for (var i = 0; i < tree.children.length; i++) {
                    this.applyLayout(this.getChildAt(i), tree.children[i]);
                }
                var t1 = performance.now();
            }
        };
        FlexBox.prototype.applyLayout = function (node, tree) {
            node.setGeomTransform(tree.layout.width, tree.layout.height, tree.layout.left, tree.layout.top);
            for (var i = 0; i < tree.children.length; i++) {
                this.applyLayout(node.getChildAt(i), tree.children[i]);
            }
        };
        FlexBox.prototype.addChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i - 0] = arguments[_i];
            }
            var child = _super.prototype.addChild.apply(this, arguments);
            this.layout();
            return child;
        };
        FlexBox.prototype.removeChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i - 0] = arguments[_i];
            }
            var result = _super.prototype.removeChild.apply(this, arguments);
            this.layout();
            return result;
        };
        FlexBox.prototype.buildTree = function (node) {
            var result = {
                style: node.style || { width: node.width, height: node.height, margin: 20, flex: 1 },
                children: []
            };
            if (node.hasOwnProperty("children") && node.children.length > 0) {
                result;
                for (var i = 0; i < node.children.length; i++) {
                    result.children.push(this.buildTree(node.children[i]));
                }
            }
            return result;
        };
        return FlexBox;
    })(Container);
    return FlexBox;
});
