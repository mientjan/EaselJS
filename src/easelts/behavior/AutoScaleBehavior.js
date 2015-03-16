var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './AbstractBehavior', '../geom/Size'], function (require, exports, AbstractBehavior, Size) {
    var AutoScaleBehavior = (function (_super) {
        __extends(AutoScaleBehavior, _super);
        function AutoScaleBehavior(downScaleBreakPoint, downScaleLimit, upScaleBreakPoint, upScaleLimit) {
            _super.call(this);
            this._downScaleBreakPoint = null;
            this._downScaleLimit = null;
            this._upScaleBreakPoint = null;
            this._upScaleLimit = null;
            this._downScaleBreakPoint = downScaleBreakPoint;
            this._downScaleLimit = downScaleLimit;
            this._upScaleBreakPoint = upScaleBreakPoint;
            this._upScaleLimit = upScaleLimit;
        }
        AutoScaleBehavior.prototype.initialize = function (owner) {
            _super.prototype.initialize.call(this, owner);
            this._resizeSignalConnection = this.owner.resizeSignal.connect(this.updateScale.bind(this));
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setDownScaleBreakPoint = function (width, height) {
            if (!this._downScaleBreakPoint) {
                this._downScaleBreakPoint = new Size(width, height);
            }
            else {
                this._downScaleBreakPoint.width = width;
                this._downScaleBreakPoint.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setDownScaleBreakPointWidth = function (width) {
            if (!this._downScaleBreakPoint) {
                this._downScaleBreakPoint = new Size(width, 0);
            }
            else {
                this._downScaleBreakPoint.width = width;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setDownScaleBreakPointHeight = function (height) {
            if (!this._downScaleBreakPoint) {
                this._downScaleBreakPoint = new Size(0, height);
            }
            else {
                this._downScaleBreakPoint.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setDownScaleLimit = function (width, height) {
            if (!this._downScaleLimit) {
                this._downScaleLimit = new Size(width, height);
            }
            else {
                this._downScaleLimit.width = width;
                this._downScaleLimit.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setDownScaleLimitWidth = function (width) {
            if (!this._downScaleLimit) {
                this._downScaleLimit = new Size(width, 0);
            }
            else {
                this._downScaleLimit.width = width;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setDownScaleLimitHeight = function (height) {
            if (!this._downScaleLimit) {
                this._downScaleLimit = new Size(0, height);
            }
            else {
                this._downScaleLimit.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setUpScaleBreakPoint = function (width, height) {
            if (!this._upScaleBreakPoint) {
                this._upScaleBreakPoint = new Size(width, height);
            }
            else {
                this._upScaleBreakPoint.width = width;
                this._upScaleBreakPoint.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setUpScaleBreakPointWidth = function (width) {
            if (!this._upScaleBreakPoint) {
                this._upScaleBreakPoint = new Size(width, Number.MAX_VALUE);
            }
            else {
                this._upScaleBreakPoint.width = width;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setUpScaleBreakPointHeight = function (height) {
            if (!this._upScaleBreakPoint) {
                this._upScaleBreakPoint = new Size(Number.MAX_VALUE, height);
            }
            else {
                this._upScaleBreakPoint.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setUpScaleLimit = function (width, height) {
            if (!this._upScaleLimit) {
                this._upScaleLimit = new Size(width, height);
            }
            else {
                this._upScaleLimit.width = width;
                this._upScaleLimit.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setUpScaleLimitWidth = function (width) {
            if (!this._upScaleLimit) {
                this._upScaleLimit = new Size(width, 0);
            }
            else {
                this._upScaleLimit.width = width;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.setUpScaleLimitHeight = function (height) {
            if (!this._upScaleLimit) {
                this._upScaleLimit = new Size(0, height);
            }
            else {
                this._upScaleLimit.height = height;
            }
            this.updateScale();
        };
        AutoScaleBehavior.prototype.updateScale = function (width, height) {
            if (!this.owner || !this.owner.parent)
                return;
            width = width || this.owner.parent.width;
            height = height || this.owner.parent.height;
            if (this._downScaleBreakPoint || this._upScaleBreakPoint) {
                if (this._downScaleBreakPoint && (width < this._downScaleBreakPoint.width || height < this._downScaleBreakPoint.height)) {
                    if (this._downScaleLimit) {
                        width = Math.max(width, this._downScaleLimit.width);
                        height = Math.max(height, this._downScaleLimit.height);
                    }
                    this.owner.scaleX = this.owner.scaleY = Math.min(1, width / this._downScaleBreakPoint.width, height / this._downScaleBreakPoint.height);
                }
                else if (this._upScaleBreakPoint && (width > this._upScaleBreakPoint.width || height > this._upScaleBreakPoint.height)) {
                    if (this._upScaleLimit) {
                        width = Math.min(width, this._upScaleLimit.width);
                        height = Math.min(height, this._upScaleLimit.height);
                    }
                    this.owner.scaleX = this.owner.scaleY = Math.max(1, Math.min(width / this._upScaleBreakPoint.width, height / this._upScaleBreakPoint.height));
                }
                else {
                    this.owner.scaleX = this.owner.scaleY = 1;
                }
            }
        };
        AutoScaleBehavior.prototype.destruct = function () {
            if (this._resizeSignalConnection) {
                this._resizeSignalConnection.dispose();
                this._resizeSignalConnection = null;
            }
            this._downScaleBreakPoint = null;
            this._downScaleLimit = null;
            this._upScaleBreakPoint = null;
            this._upScaleLimit = null;
            _super.prototype.destruct.call(this);
        };
        return AutoScaleBehavior;
    })(AbstractBehavior);
    return AutoScaleBehavior;
});
