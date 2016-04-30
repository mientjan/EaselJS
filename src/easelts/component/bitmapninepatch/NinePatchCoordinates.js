define(["require", "exports"], function (require, exports) {
    "use strict";
    var NinePatchCoordinates = (function () {
        function NinePatchCoordinates(sourceRow, sourceColumn, destRow, destColumn) {
            this.sourceRow = sourceRow;
            this.sourceColumn = sourceColumn;
            this.destRow = destRow;
            this.destColumn = destColumn;
        }
        return NinePatchCoordinates;
    }());
    exports.NinePatchCoordinates = NinePatchCoordinates;
});
