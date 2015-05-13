var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Container'], function (require, exports, Container) {
    var SpriteContainer = (function (_super) {
        __extends(SpriteContainer, _super);
        function SpriteContainer(spriteSheet) {
            _super.call(this);
            this.spriteSheet = null;
            this.spriteSheet = spriteSheet;
        }
        SpriteContainer.prototype.addChild = function (child) {
            if (child == null) {
                return child;
            }
            if (arguments.length > 1) {
                return this.addChildAt.apply(this, Array.prototype.slice.call(arguments).concat([this.children.length]));
            }
            else {
                return this.addChildAt(child, this.children.length);
            }
        };
        SpriteContainer.prototype.addChildAt = function (child, index) {
            var l = arguments.length;
            var indx = arguments[l - 1];
            if (indx < 0 || indx > this.children.length) {
                return arguments[l - 2];
            }
            if (l > 2) {
                for (var i = 0; i < l - 1; i++) {
                    this.addChildAt(arguments[i], indx + i);
                }
                return arguments[l - 2];
            }
            if (child['_spritestage_compatibility'] >= 1) {
            }
            else {
                console && console.log("Error: You can only add children of type SpriteContainer, Sprite, BitmapText, or DOMElement [" + child.toString() + "]");
                return child;
            }
            if (child['_spritestage_compatibility'] <= 4) {
                var spriteSheet = child.spriteSheet;
                if ((!spriteSheet || !spriteSheet._images || spriteSheet._images.length > 1) || (this.spriteSheet && this.spriteSheet !== spriteSheet)) {
                    console && console.log("Error: A child's spriteSheet must be equal to its parent spriteSheet and only use one image. [" + child.toString() + "]");
                    return child;
                }
                this.spriteSheet = spriteSheet;
            }
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            this.children.splice(index, 0, child);
            return child;
        };
        SpriteContainer.prototype.toString = function () {
            return "[SpriteContainer (name=" + this.name + ")]";
        };
        return SpriteContainer;
    })(Container);
    return SpriteContainer;
});
