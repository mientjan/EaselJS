var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../display/Container', '../../facebook/Layout', '../enum/DisplayType'], function (require, exports, Container, Layout, DisplayType) {
    /**
     * Usage example:
     *
     * var box:FlexBox = new FlexBox("100%", 400, 0, 0);
     * box.style = {flexDirection:"row", padding: 10};
     *
     * var square1:SquareColor = new SquareColor("#ff0000", 100, 100);
     * square1.style.flex = 1;
     * box.addChild(square1);
     *
     * var square2:SquareColor = new SquareColor("#ff0000", 100, 100);
     * square2.style.marginLeft = 10;
     * box.addChild(square2);
     */
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
        }
        FlexBox.prototype.updateLayout = function () {
            if (this.children.length > 0) {
                var node = this.createNode(this);
                Layout.computeLayout(node);
                for (var i = 0; i < node.children.length; i++) {
                    this.applyLayoutToChild(this.getChildAt(i), node.children[i]);
                }
            }
        };
        FlexBox.prototype.applyLayoutToChild = function (child, node) {
            child.setGeomTransform(node.layout.width, node.layout.height, node.layout.left, node.layout.top);
            if (child.type === 2 /* CONTAINER */) {
                for (var i = 0; i < node.children.length; i++) {
                    this.applyLayoutToChild(child.getChildAt(i), node.children[i]);
                }
            }
        };
        FlexBox.prototype.createNode = function (displayObject) {
            displayObject.style.width = displayObject.width;
            displayObject.style.height = displayObject.height;
            var node = {
                layout: { left: 0, top: 0, width: undefined, height: undefined },
                style: displayObject.style,
                children: []
            };
            if (displayObject.type === 2 /* CONTAINER */) {
                for (var i = 0; i < displayObject.children.length; i++) {
                    node.children.push(this.createNode(displayObject.children[i]));
                }
            }
            return node;
        };
        FlexBox.prototype.addChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i - 0] = arguments[_i];
            }
            return (this.updateLayoutAfterAddChild(_super.prototype.addChild.apply(this, arguments)));
        };
        FlexBox.prototype.addChildAt = function (child, index) {
            return (this.updateLayoutAfterAddChild(_super.prototype.addChildAt.apply(this, arguments)));
        };
        FlexBox.prototype.updateLayoutAfterAddChild = function (child) {
            this.updateLayout();
            return child;
        };
        FlexBox.prototype.removeChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i - 0] = arguments[_i];
            }
            return (this.updateLayoutAfterRemoveChild(_super.prototype.removeChild.apply(this, arguments)));
        };
        FlexBox.prototype.removeChildAt = function () {
            var index = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                index[_i - 0] = arguments[_i];
            }
            return (this.updateLayoutAfterRemoveChild(_super.prototype.removeChildAt.apply(this, arguments)));
        };
        FlexBox.prototype.updateLayoutAfterRemoveChild = function (result) {
            if (result) {
                this.updateLayout();
            }
            return result;
        };
        FlexBox.prototype.onResize = function (size) {
            _super.prototype.onResize.call(this, size);
            this.updateLayout();
        };
        return FlexBox;
    })(Container);
    return FlexBox;
});
