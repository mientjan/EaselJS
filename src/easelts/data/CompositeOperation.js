define(["require", "exports"], function (require, exports) {
    "use strict";
    var CompositeOperation = (function () {
        function CompositeOperation() {
        }
        CompositeOperation.SOURCE_ATOP = 'source-atop';
        CompositeOperation.SOURCE_IN = 'source-in';
        CompositeOperation.SOURCE_OUT = 'source-out';
        CompositeOperation.SOURCE_OVER = 'source-over';
        CompositeOperation.DESTINATION_ATOP = 'destination-atop';
        CompositeOperation.DESTINATION_IN = 'destination-in';
        CompositeOperation.DESTINATION_OUT = 'destination-out';
        CompositeOperation.DESTINATION_OVER = 'destination-over';
        CompositeOperation.LIGHTER = 'lighter';
        CompositeOperation.COPY = 'copy';
        CompositeOperation.XOR = 'xor';
        CompositeOperation.MULTIPLY = 'multiply';
        CompositeOperation.SCREEN = 'screen';
        return CompositeOperation;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CompositeOperation;
});
