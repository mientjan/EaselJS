var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractBehavior"], function (require, exports, AbstractBehavior_1) {
    "use strict";
    var MediaQueryBehavior = (function (_super) {
        __extends(MediaQueryBehavior, _super);
        function MediaQueryBehavior(matchLast) {
            var _this = this;
            if (matchLast === void 0) { matchLast = false; }
            _super.call(this);
            this._data = {};
            this._restore = {};
            this.onResizeMatchAll = function () {
                var matchFound = false;
                for (var mediaQuery in _this._data) {
                    if (window.matchMedia(mediaQuery).matches) {
                        matchFound = true;
                        var data = _this._data[mediaQuery];
                        _this.setData(_this.owner, data);
                    }
                }
                if (!matchFound) {
                    _this.setData(_this.owner, _this._restore);
                }
            };
            this.onResizeMatchLast = function () {
                var data = null;
                for (var mediaQuery in _this._data) {
                    if (window.matchMedia(mediaQuery).matches) {
                        data = _this._data[mediaQuery];
                    }
                }
                _this.setData(_this.owner, data || _this._restore);
            };
            this._matchLast = matchLast;
        }
        MediaQueryBehavior.prototype.initialize = function (owner) {
            _super.prototype.initialize.call(this, owner);
            if (this._matchLast) {
                this._resizeSignalConnection = this.owner.resizeSignal.connect(this.onResizeMatchLast);
            }
            else {
                this._resizeSignalConnection = this.owner.resizeSignal.connect(this.onResizeMatchAll);
            }
            for (var query in this._data) {
                this.storeData(owner, this._restore, this._data[query]);
            }
        };
        MediaQueryBehavior.prototype.addQuery = function (query, data) {
            if (this.owner) {
                throw new Error('can not add new queries when behavior is initialized');
            }
            this._data[query] = data;
            return this;
        };
        MediaQueryBehavior.prototype.addQueries = function (data) {
            if (this.owner) {
                throw new Error('can not add new queries when behavior is initialized');
            }
            for (var query in data) {
                this.addQuery(query, data[query]);
            }
            return this;
        };
        MediaQueryBehavior.prototype.storeData = function (owner, storeData, data) {
            if (!owner) {
                throw new Error('owner is unknown ');
            }
            for (var property in data) {
                var value = data[property];
                switch (property) {
                    case 'x':
                        {
                            storeData.x = owner.x;
                            break;
                        }
                    case 'y':
                        {
                            storeData.y = owner.x;
                            break;
                        }
                    case 'width':
                        {
                            storeData.width = owner.width;
                            break;
                        }
                    case 'height':
                        {
                            storeData.height = owner.height;
                            break;
                        }
                    case 'regX':
                        {
                            storeData.regX = owner.regX;
                            break;
                        }
                    case 'regY':
                        {
                            storeData.regY = owner.regY;
                            break;
                        }
                    case 'scaleX':
                        {
                            storeData.scaleX = owner.scaleX;
                            break;
                        }
                    case 'scaleY':
                        {
                            storeData.scaleY = owner.scaleY;
                            break;
                        }
                    default:
                        {
                            storeData[property] = {};
                            this.storeData(this.owner[property], storeData[property], value);
                            break;
                        }
                }
            }
        };
        MediaQueryBehavior.prototype.setData = function (owner, data) {
            if (!owner) {
                throw new Error('owner is unknown ');
            }
            for (var property in data) {
                var value = data[property];
                switch (property) {
                    case 'x':
                        {
                            owner.setX(value);
                            break;
                        }
                    case 'y':
                        {
                            owner.setY(value);
                            break;
                        }
                    case 'width':
                        {
                            owner.setWidth(value);
                            break;
                        }
                    case 'height':
                        {
                            owner.setHeight(value);
                            break;
                        }
                    case 'regX':
                        {
                            owner.setRegX(value);
                            break;
                        }
                    case 'regY':
                        {
                            owner.setRegY(value);
                            break;
                        }
                    case 'scaleX':
                        {
                            owner.scaleX = value;
                            break;
                        }
                    case 'scaleY':
                        {
                            owner.scaleY = value;
                            break;
                        }
                    default:
                        {
                            this.setData(this.owner[property], value);
                            break;
                        }
                }
            }
        };
        return MediaQueryBehavior;
    }(AbstractBehavior_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MediaQueryBehavior;
});
