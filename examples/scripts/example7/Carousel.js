var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../src/easelts/display/Container'], function (require, exports, Container) {
    var Carousel = (function (_super) {
        __extends(Carousel, _super);
        function Carousel(width, height, x, y, regX, regY) {
            _super.call(this, width, height, x, y, regX, regY);
            this.prevScrollX = 0;
            this.prevScrollY = 0;
            this._page = 0;
            this.enableMouseInteraction();
        }
        Carousel.prototype.setPage = function (value) {
            this.reset();
            this._page = value;
            this.y = this._page * -this.height;
            this.onScroll(this.x, this.y);
        };
        Carousel.prototype.next = function (onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            this._page++;
            this.animateToPage(this._page, onComplete);
        };
        Carousel.prototype.prev = function (onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            this._page--;
            this.animateToPage(this._page, onComplete);
        };
        Carousel.prototype.reset = function () {
            this._page = 0;
            this.prevScrollY = 0;
            this.prevScrollX = 0;
            this.y = 0;
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                child.setY(this.height * i);
                child.visible = true;
            }
        };
        Carousel.prototype.animateToPage = function (page, onComplete) {
            var _this = this;
            if (onComplete === void 0) { onComplete = null; }
            TweenLite.killTweensOf(this);
            TweenLite.to(this, 1, {
                y: page * -this.height,
                onComplete: onComplete,
                onUpdate: function () {
                    _this.onScroll(_this.x, _this.y);
                }
            });
        };
        Carousel.prototype.onScroll = function (x, y) {
            var children = this.children, length = children.length, width = this.width, height = this.height, child, x0, y0, x1, y1;
            var direction = this.prevScrollY - y;
            this.prevScrollX = x;
            this.prevScrollY = y;
            x = -x;
            y = -y;
            for (var i = 0; i < length; i++) {
                child = children[i];
                x0 = child.x - x;
                y0 = child.y - y;
                x1 = x0 + child.width;
                y1 = y0 + child.height;
                if (x0 < width && y0 < height && x1 > 0 && y1 > 0) {
                    child.visible = true;
                }
                else {
                    child.visible = false;
                    if (direction > 0) {
                        if (y > child.y) {
                            child.setY(child.y + (height * length));
                        }
                    }
                    else if (direction < 0) {
                        if ((y + height) < child.y) {
                            child.setY(child.y - (height * length));
                        }
                    }
                }
            }
        };
        Carousel.prototype.onResize = function (width, height) {
            _super.prototype.onResize.call(this, width, height);
            this.reset();
        };
        return Carousel;
    })(Container);
    return Carousel;
});
