define(["require", "exports", '../util/Methods'], function (require, exports, Methods) {
    var RoundRect = (function () {
        function RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.radiusTL = radiusTL;
            this.radiusTR = radiusTR;
            this.radiusBR = radiusBR;
            this.radiusBL = radiusBL;
        }
        RoundRect.prototype.exec = function (ctx) {
            var max = (w < h ? w : h) / 2;
            var mTL = 0, mTR = 0, mBR = 0, mBL = 0;
            var x = this.x, y = this.y, w = this.w, h = this.h;
            var rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;
            if (rTL < 0) {
                rTL *= (mTL = -1);
            }
            if (rTL > max) {
                rTL = max;
            }
            if (rTR < 0) {
                rTR *= (mTR = -1);
            }
            if (rTR > max) {
                rTR = max;
            }
            if (rBR < 0) {
                rBR *= (mBR = -1);
            }
            if (rBR > max) {
                rBR = max;
            }
            if (rBL < 0) {
                rBL *= (mBL = -1);
            }
            if (rBL > max) {
                rBL = max;
            }
            ctx.moveTo(x + w - rTR, y);
            ctx.arcTo(x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR);
            ctx.lineTo(x + w, y + h - rBR);
            ctx.arcTo(x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR);
            ctx.lineTo(x + rBL, y + h);
            ctx.arcTo(x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL);
            ctx.lineTo(x, y + rTL);
            ctx.arcTo(x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL);
            ctx.closePath();
        };
        return RoundRect;
    })();
    var Oval = (function () {
        function Oval(x, y, xRadius, yRadius, rotationAngle, startAngle, endAngle) {
            this.x = x;
            this.y = y;
            this.xRadius = xRadius;
            this.yRadius = yRadius;
            this.rotationAngle = rotationAngle;
            this.startAngle = startAngle;
            this.endAngle = endAngle;
        }
        Oval.prototype.exec = function (ctx) {
            var x = this.x;
            var y = this.y;
            for (var i = this.startAngle * Math.PI; i < this.endAngle * Math.PI; i += 0.01) {
                var xPos = x - (this.xRadius * Math.sin(i)) * Math.sin(this.rotationAngle * Math.PI) + (this.yRadius * Math.cos(i)) * Math.cos(this.rotationAngle * Math.PI);
                var yPos = y + (this.yRadius * Math.cos(i)) * Math.sin(this.rotationAngle * Math.PI) + (this.xRadius * Math.sin(i)) * Math.cos(this.rotationAngle * Math.PI);
                if (i == 0) {
                    ctx.moveTo(xPos, yPos);
                }
                else {
                    ctx.lineTo(xPos, yPos);
                }
            }
        };
        return Oval;
    })();
    var LineTo = (function () {
        function LineTo(x, y) {
            this.x = x;
            this.y = y;
        }
        LineTo.prototype.exec = function (ctx) {
            ctx.lineTo(this.x, this.y);
        };
        return LineTo;
    })();
    var MoveTo = (function () {
        function MoveTo(x, y) {
            this.x = x;
            this.y = y;
        }
        MoveTo.prototype.exec = function (ctx) {
            ctx.moveTo(this.x, this.y);
        };
        return MoveTo;
    })();
    var ArcTo = (function () {
        function ArcTo(x1, y1, x2, y2, radius) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.radius = radius;
        }
        ArcTo.prototype.exec = function (ctx) {
            ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
        };
        return ArcTo;
    })();
    var Arc = (function () {
        function Arc(x, y, radius, startAngle, endAngle, anticlockwise) {
            this.exec = function (ctx) {
                ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
            };
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.startAngle = startAngle;
            this.endAngle = endAngle;
            this.anticlockwise = !!anticlockwise;
        }
        return Arc;
    })();
    var QuadraticCurveTo = (function () {
        function QuadraticCurveTo(cpx, cpy, x, y) {
            this.exec = function (ctx) {
                ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
            };
            this.cpx = cpx;
            this.cpy = cpy;
            this.x = x;
            this.y = y;
        }
        return QuadraticCurveTo;
    })();
    var BezierCurveTo = (function () {
        function BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            this.exec = function (ctx) {
                ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
            };
            this.cp1x = cp1x;
            this.cp1y = cp1y;
            this.cp2x = cp2x;
            this.cp2y = cp2y;
            this.x = x;
            this.y = y;
        }
        return BezierCurveTo;
    })();
    var Rect = (function () {
        function Rect(x, y, w, h) {
            this.exec = function (ctx) {
                ctx.rect(this.x, this.y, this.w, this.h);
            };
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        return Rect;
    })();
    var ClosePath = (function () {
        function ClosePath() {
            this.exec = function (ctx) {
                ctx.closePath();
            };
        }
        return ClosePath;
    })();
    var BeginPath = (function () {
        function BeginPath() {
        }
        BeginPath.prototype.exec = function (ctx) {
            ctx.beginPath();
        };
        return BeginPath;
    })();
    var Fill = (function () {
        function Fill(style, matrix) {
            this.path = false;
            this.style = style;
            this.matrix = matrix;
        }
        Fill.prototype.exec = function (ctx) {
            if (!this.style) {
                return;
            }
            ctx.fillStyle = this.style;
            var mtx = this.matrix;
            if (mtx) {
                ctx.save();
                ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            }
            ctx.fill();
            if (mtx) {
                ctx.restore();
            }
        };
        Fill.prototype.linearGradient = function (colors, ratios, x0, y0, x1, y1) {
            var o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
            for (var i = 0, l = colors.length; i < l; i++) {
                o.addColorStop(ratios[i], colors[i]);
            }
            o['props'] = { colors: colors, ratios: ratios, x0: x0, y0: y0, x1: x1, y1: y1, type: "linear" };
            return this;
        };
        Fill.prototype.radialGradient = function (colors, ratios, x0, y0, r0, x1, y1, r1) {
            var o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
            for (var i = 0, l = colors.length; i < l; i++) {
                o.addColorStop(ratios[i], colors[i]);
            }
            o['props'] = { colors: colors, ratios: ratios, x0: x0, y0: y0, r0: r0, x1: x1, y1: y1, r1: r1, type: "radial" };
            return this;
        };
        Fill.prototype.bitmap = function (image, repetition) {
            var o = this.style = Graphics._ctx.createPattern(image, "");
            o['props'] = { image: image, repetition: repetition, type: "bitmap" };
            return this;
        };
        return Fill;
    })();
    var Stroke = (function () {
        function Stroke(style, ignoreScale) {
            this.linearGradient = Fill.prototype.linearGradient;
            this.radialGradient = Fill.prototype.radialGradient;
            this.bitmap = Fill.prototype.bitmap;
            this.path = false;
            this.style = style;
            this.ignoreScale = ignoreScale;
        }
        Stroke.prototype.exec = function (ctx) {
            if (!this.style) {
                return;
            }
            ctx.strokeStyle = this.style;
            if (this.ignoreScale) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            ctx.stroke();
            if (this.ignoreScale) {
                ctx.restore();
            }
        };
        return Stroke;
    })();
    var StrokeStyle = (function () {
        function StrokeStyle(width, caps, joints, miterLimit) {
            this.path = false;
            this.width = width;
            this.caps = caps;
            this.joints = joints;
            this.miterLimit = miterLimit;
        }
        StrokeStyle.prototype.exec = function (ctx) {
            ctx.lineWidth = (this.width == null ? "1" : this.width);
            ctx.lineCap = (this.caps == null ? "butt" : this.caps);
            ctx.lineJoin = (this.joints == null ? "miter" : this.joints);
            ctx.miterLimit = (this.miterLimit == null ? "10" : this.miterLimit);
        };
        return StrokeStyle;
    })();
    var Circle = (function () {
        function Circle(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        Circle.prototype.exec = function (ctx) {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        };
        return Circle;
    })();
    var Ellipse = (function () {
        function Ellipse(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        Ellipse.prototype.exec = function (ctx) {
            var x = this.x, y = this.y;
            var w = this.w, h = this.h;
            var k = 0.5522848;
            var ox = (w / 2) * k;
            var oy = (h / 2) * k;
            var xe = x + w;
            var ye = y + h;
            var xm = x + w / 2;
            var ym = y + h / 2;
            ctx.moveTo(x, ym);
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        };
        return Ellipse;
    })();
    var PolyStar = (function () {
        function PolyStar(x, y, radius, sides, pointSize, angle) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.sides = sides;
            this.pointSize = pointSize;
            this.angle = angle;
        }
        PolyStar.prototype.exec = function (ctx) {
            var x = this.x, y = this.y;
            var radius = this.radius;
            var angle = (this.angle || 0) / 180 * Math.PI;
            var sides = this.sides;
            var ps = 1 - (this.pointSize || 0);
            var a = Math.PI / sides;
            ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
            for (var i = 0; i < sides; i++) {
                angle += a;
                if (ps != 1) {
                    ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
                }
                angle += a;
                ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
            }
            ctx.closePath();
        };
        return PolyStar;
    })();
    var Graphics = (function () {
        function Graphics() {
            this.command = null;
            this._stroke = null;
            this._strokeStyle = null;
            this._strokeIgnoreScale = false;
            this._fill = null;
            this._instructions = null;
            this._commitIndex = 0;
            this._activeInstructions = null;
            this._dirty = false;
            this._ctx = Graphics._ctx;
            this.curveTo = this.quadraticCurveTo;
            this.drawRect = this.rect;
            this.mt = this.moveTo;
            this.lt = this.lineTo;
            this.at = this.arcTo;
            this.bt = this.bezierCurveTo;
            this.qt = this.quadraticCurveTo;
            this.a = this.arc;
            this.r = this.rect;
            this.cp = this.closePath;
            this.c = this.clear;
            this.f = this.beginFill;
            this.lf = this.beginLinearGradientFill;
            this.rf = this.beginRadialGradientFill;
            this.bf = this.beginBitmapFill;
            this.ef = this.endFill;
            this.ss = this.setStrokeStyle;
            this.s = this.beginStroke;
            this.ls = this.beginLinearGradientStroke;
            this.rs = this.beginRadialGradientStroke;
            this.bs = this.beginBitmapStroke;
            this.es = this.endStroke;
            this.dr = this.rect;
            this.rr = this.drawRoundRect;
            this.rc = this.drawRoundRectComplex;
            this.dc = this.drawCircle;
            this.de = this.drawEllipse;
            this.dp = this.drawPolyStar;
            this.p = this.decodePath;
            this.clear();
        }
        Graphics.getRGB = function (r, g, b, alpha) {
            if (alpha === void 0) { alpha = null; }
            if (r != null && b == null) {
                alpha = g;
                b = r & 0xFF;
                g = r >> 8 & 0xFF;
                r = r >> 16 & 0xFF;
            }
            if (alpha == null) {
                return "rgb(" + r + "," + g + "," + b + ")";
            }
            else {
                return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
            }
        };
        Graphics.getHSL = function (hue, saturation, lightness, alpha) {
            if (alpha == null) {
                return "hsl(" + (hue % 360) + "," + saturation + "%," + lightness + "%)";
            }
            else {
                return "hsla(" + (hue % 360) + "," + saturation + "%," + lightness + "%," + alpha + ")";
            }
        };
        Graphics.prototype.isEmpty = function () {
            return !(this._instructions.length || this._activeInstructions.length);
        };
        Graphics.prototype.draw = function (ctx, data) {
            this._updateInstructions();
            var instr = this._instructions;
            for (var i = 0, l = instr.length; i < l; i++) {
                instr[i].exec(ctx, data);
            }
        };
        Graphics.prototype.drawAsPath = function (ctx) {
            this._updateInstructions();
            var instr, instrs = this._instructions;
            for (var i = 0, l = instrs.length; i < l; i++) {
                if ((instr = instrs[i]).path !== false) {
                    instr.exec(ctx);
                }
            }
        };
        Graphics.prototype.moveTo = function (x, y) {
            return this.append(new Graphics.MoveTo(x, y), true);
        };
        Graphics.prototype.lineTo = function (x, y) {
            return this.append(new Graphics.LineTo(x, y));
        };
        Graphics.prototype.oval = function (x, y, xRadius, yRadius, rotationAngle, startAngle, endAngle) {
            return this.append(new Graphics.Oval(x, y, xRadius, yRadius, rotationAngle, startAngle, endAngle));
        };
        Graphics.prototype.arcTo = function (x1, y1, x2, y2, radius) {
            return this.append(new Graphics.ArcTo(x1, y1, x2, y2, radius));
        };
        Graphics.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            return this.append(new Graphics.Arc(x, y, radius, startAngle, endAngle, anticlockwise));
        };
        Graphics.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            return this.append(new Graphics.QuadraticCurveTo(cpx, cpy, x, y));
        };
        Graphics.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            return this.append(new Graphics.BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
        };
        Graphics.prototype.rect = function (x, y, width, height) {
            return this.append(new Graphics.Rect(x, y, width, height));
        };
        Graphics.prototype.closePath = function () {
            return this._activeInstructions.length ? this.append(new Graphics.ClosePath()) : this;
        };
        Graphics.prototype.clear = function () {
            this._instructions = [];
            this._activeInstructions = [];
            this._commitIndex = 0;
            this._strokeStyle = this._stroke = this._fill = null;
            this._dirty = this._strokeIgnoreScale = false;
            return this;
        };
        Graphics.prototype.beginFill = function (color) {
            return this._setFill(color ? new Graphics.Fill(color) : null);
        };
        Graphics.prototype.beginLinearGradientFill = function (colors, ratios, x0, y0, x1, y1) {
            return this._setFill(new Graphics.Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
        };
        Graphics.prototype.beginRadialGradientFill = function (colors, ratios, x0, y0, r0, x1, y1, r1) {
            return this._setFill(new Graphics.Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
        };
        Graphics.prototype.beginBitmapFill = function (image, repetition, matrix) {
            if (repetition === void 0) { repetition = 'repeat'; }
            return this._setFill(new Graphics.Fill(null, matrix).bitmap(image, repetition));
        };
        Graphics.prototype.endFill = function () {
            return this.beginFill();
        };
        Graphics.prototype.setStrokeStyle = function (thickness, caps, joints, miterLimit, ignoreScale) {
            if (caps === void 0) { caps = null; }
            if (joints === void 0) { joints = null; }
            if (miterLimit === void 0) { miterLimit = null; }
            if (ignoreScale === void 0) { ignoreScale = false; }
            this._updateInstructions(true);
            this._strokeStyle = this.command = new Graphics.StrokeStyle(thickness, caps, joints, miterLimit);
            if (this._stroke) {
                this._stroke.ignoreScale = ignoreScale;
            }
            this._strokeIgnoreScale = ignoreScale;
            return this;
        };
        Graphics.prototype.beginStroke = function (color) {
            return this._setStroke(color ? new Graphics.Stroke(color, null) : null);
        };
        Graphics.prototype.beginLinearGradientStroke = function (colors, ratios, x0, y0, x1, y1) {
            return this._setStroke(new Graphics.Stroke(null, null).linearGradient(colors, ratios, x0, y0, x1, y1));
        };
        Graphics.prototype.beginRadialGradientStroke = function (colors, ratios, x0, y0, r0, x1, y1, r1) {
            return this._setStroke(new Graphics.Stroke(null, null).radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
        };
        Graphics.prototype.beginBitmapStroke = function (image, repetition) {
            return this._setStroke(new Graphics.Stroke(null, null).bitmap(image, repetition));
        };
        Graphics.prototype.endStroke = function () {
            return this.beginStroke(null);
        };
        Graphics.prototype.drawRoundRect = function (x, y, w, h, radius) {
            return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
        };
        Graphics.prototype.drawRoundRectComplex = function (x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
            return this.append(new Graphics.RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
        };
        Graphics.prototype.drawCircle = function (x, y, radius) {
            return this.append(new Graphics.Circle(x, y, radius));
        };
        Graphics.prototype.drawEllipse = function (x, y, w, h) {
            return this.append(new Graphics.Ellipse(x, y, w, h));
        };
        Graphics.prototype.drawPolyStar = function (x, y, radius, sides, pointSize, angle) {
            return this.append(new Graphics.PolyStar(x, y, radius, sides, pointSize, angle));
        };
        Graphics.prototype.append = function (command, clean) {
            this._activeInstructions.push(command);
            this.command = command;
            if (!clean) {
                this._dirty = true;
            }
            return this;
        };
        Graphics.prototype.decodePath = function (str) {
            var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
            var paramCount = [2, 2, 4, 6, 0];
            var i = 0, l = str.length;
            var params = [];
            var x = 0, y = 0;
            var base64 = Graphics.BASE_64;
            while (i < l) {
                var c = str.charAt(i);
                var n = base64[c];
                var fi = n >> 3;
                var f = instructions[fi];
                if (!f || (n & 3)) {
                    throw ("bad path data (@" + i + "): " + c);
                }
                var pl = paramCount[fi];
                if (!fi) {
                    x = y = 0;
                }
                params.length = 0;
                i++;
                var charCount = (n >> 2 & 1) + 2;
                for (var p = 0; p < pl; p++) {
                    var num = base64[str.charAt(i)];
                    var sign = (num >> 5) ? -1 : 1;
                    num = ((num & 31) << 6) | (base64[str.charAt(i + 1)]);
                    if (charCount == 3) {
                        num = (num << 6) | (base64[str.charAt(i + 2)]);
                    }
                    num = sign * num / 10;
                    if (p % 2) {
                        x = (num += x);
                    }
                    else {
                        y = (num += y);
                    }
                    params[p] = num;
                    i += charCount;
                }
                f.apply(this, params);
            }
            return this;
        };
        Graphics.prototype.getInstructions = function () {
            this._updateInstructions();
            return this._instructions;
        };
        Graphics.prototype.clone = function () {
            var o = new Graphics();
            o._instructions = this._instructions.slice();
            o._activeInstructions = this._activeInstructions.slice();
            o._commitIndex = this._commitIndex;
            o._fill = this._fill;
            o._stroke = this._stroke;
            o._strokeStyle = this._strokeStyle;
            o._dirty = this._dirty;
            o._strokeIgnoreScale = this._strokeIgnoreScale;
            return o;
        };
        Graphics.prototype.toString = function () {
            return "[Graphics]";
        };
        Graphics.prototype._updateInstructions = function (commit) {
            var instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;
            if (this._dirty && active.length) {
                instr.length = commitIndex;
                instr.push(Graphics.beginCmd);
                instr.push.apply(instr, active);
                if (this._fill) {
                    instr.push(this._fill);
                }
                if (this._stroke && this._strokeStyle) {
                    instr.push(this._strokeStyle);
                }
                if (this._stroke) {
                    instr.push(this._stroke);
                }
                this._dirty = false;
            }
            if (commit) {
                active.length = 0;
                this._commitIndex = instr.length;
            }
        };
        Graphics.prototype._setFill = function (fill) {
            this._updateInstructions(true);
            if (this._fill = fill) {
                this.command = fill;
            }
            return this;
        };
        Graphics.prototype._setStroke = function (stroke) {
            this._updateInstructions(true);
            if (this._stroke = stroke) {
                this.command = stroke;
                stroke.ignoreScale = this._strokeIgnoreScale;
            }
            return this;
        };
        Graphics.RoundRect = RoundRect;
        Graphics.MoveTo = MoveTo;
        Graphics.LineTo = LineTo;
        Graphics.ArcTo = ArcTo;
        Graphics.Arc = Arc;
        Graphics.QuadraticCurveTo = QuadraticCurveTo;
        Graphics.BezierCurveTo = BezierCurveTo;
        Graphics.Rect = Rect;
        Graphics.ClosePath = ClosePath;
        Graphics.BeginPath = BeginPath;
        Graphics.Fill = Fill;
        Graphics.Stroke = Stroke;
        Graphics.StrokeStyle = StrokeStyle;
        Graphics.Oval = Oval;
        Graphics.Circle = Circle;
        Graphics.Ellipse = Ellipse;
        Graphics.PolyStar = PolyStar;
        Graphics.beginCmd = new BeginPath();
        Graphics.BASE_64 = {
            "A": 0,
            "B": 1,
            "C": 2,
            "D": 3,
            "E": 4,
            "F": 5,
            "G": 6,
            "H": 7,
            "I": 8,
            "J": 9,
            "K": 10,
            "L": 11,
            "M": 12,
            "N": 13,
            "O": 14,
            "P": 15,
            "Q": 16,
            "R": 17,
            "S": 18,
            "T": 19,
            "U": 20,
            "V": 21,
            "W": 22,
            "X": 23,
            "Y": 24,
            "Z": 25,
            "a": 26,
            "b": 27,
            "c": 28,
            "d": 29,
            "e": 30,
            "f": 31,
            "g": 32,
            "h": 33,
            "i": 34,
            "j": 35,
            "k": 36,
            "l": 37,
            "m": 38,
            "n": 39,
            "o": 40,
            "p": 41,
            "q": 42,
            "r": 43,
            "s": 44,
            "t": 45,
            "u": 46,
            "v": 47,
            "w": 48,
            "x": 49,
            "y": 50,
            "z": 51,
            "0": 52,
            "1": 53,
            "2": 54,
            "3": 55,
            "4": 56,
            "5": 57,
            "6": 58,
            "7": 59,
            "8": 60,
            "9": 61,
            "+": 62,
            "/": 63
        };
        Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
        Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
        Graphics._canvas = Methods.createCanvas();
        Graphics._ctx = Graphics._canvas.getContext('2d');
        return Graphics;
    })();
    Graphics._canvas.width = Graphics._canvas.height = 1;
    return Graphics;
});
