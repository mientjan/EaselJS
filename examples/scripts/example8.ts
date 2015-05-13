import Stage = require('../../src/easelts/display/Stage');
import Debug = require('../../src/easelts/display/Debug');

import Rectangle = require('../../src/easelts/geom/Rectangle');
import Text = require('../../src/easelts/display/Text');
import Shape = require('../../src/easelts/display/Shape');


var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.enableMouseOver();

var s0 = new Shape();
var t0 = new Text('Hello\nHello\nHello\nHello', '80px Arial');
t0.textAlign = Text.TEXT_ALIGN_END;
t0.textBaseline = Text.TEXT_BASELINE_ALPHABETIC;
t0.textBaseline = Text.TEXT_BASELINE_BOTTOM;
//t0.textBaseline = Text.TEXT_BASELINE_HANGING;
t0.textBaseline = Text.TEXT_BASELINE_IDEOGRAPHIC;
t0.textBaseline = Text.TEXT_BASELINE_MIDDLE;
t0.textBaseline = Text.TEXT_BASELINE_TOP;
t0.setX('50%').setY('50%');
s0.setX('50%').setY('50%');
stage.addChild(t0);
stage.addChild(s0);

var rect = t0.getExactSize();

s0.graphics.setStrokeStyle(1).beginStroke("#FF0000")
    .rect(rect.x0, rect.y0, rect.width, rect.height);

s0.graphics.setStrokeStyle(2).beginStroke("#FFFF00")
    .rect(t0.x, t0.y, t0.getMeasuredWidth(), t0.getMeasuredHeight());

stage.start();