define(["require", "exports"], function (require, exports) {
    "use strict";
    var LinkedList = (function () {
        function LinkedList() {
            this.firstNode = null;
            this.lastNode = null;
            this.numberOfNodes = 0;
        }
        LinkedList.prototype.add = function (item, index) {
            if (index === void 0) { index = this.numberOfNodes; }
            if (index < 0 || index > this.numberOfNodes) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this.numberOfNodes === 0) {
                this.firstNode = newNode;
                this.lastNode = newNode;
            }
            else if (index === this.numberOfNodes) {
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            }
            else if (index === 0) {
                newNode.next = this.firstNode;
                this.firstNode = newNode;
            }
            else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.numberOfNodes++;
            return true;
        };
        LinkedList.prototype.first = function () {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        };
        LinkedList.prototype.last = function () {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        };
        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };
        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || defaultEquals;
            var currentNode = this.firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };
        LinkedList.prototype.contains = function (item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        };
        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || defaultEquals;
            if (this.numberOfNodes < 1) {
                return false;
            }
            var previous = null;
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this.firstNode) {
                        this.firstNode = this.firstNode.next;
                        if (currentNode === this.lastNode) {
                            this.lastNode = null;
                        }
                    }
                    else if (currentNode === this.lastNode) {
                        this.lastNode = previous;
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    this.numberOfNodes--;
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };
        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.numberOfNodes = 0;
        };
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size() !== other.size()) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
        };
        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };
        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this.numberOfNodes) {
                return undefined;
            }
            var element;
            if (this.numberOfNodes === 1) {
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                var previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                }
                else if (previous.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = previous;
                }
                if (previous !== null) {
                    element = previous.next.element;
                    previous.next = previous.next.next;
                }
            }
            this.numberOfNodes--;
            return element;
        };
        LinkedList.prototype.forEach = function (callback) {
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                callback(currentNode.element);
                currentNode = currentNode.next;
            }
        };
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this.firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        };
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        LinkedList.prototype.size = function () {
            return this.numberOfNodes;
        };
        LinkedList.prototype.isEmpty = function () {
            return this.numberOfNodes <= 0;
        };
        LinkedList.prototype.toString = function () {
            return this.toArray().toString();
        };
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this.numberOfNodes) {
                return null;
            }
            if (index === (this.numberOfNodes - 1)) {
                return this.lastNode;
            }
            var node = this.firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.createNode = function (item) {
            return {
                element: item,
                next: null
            };
        };
        return LinkedList;
    }());
    exports.LinkedList = LinkedList;
    var LinkedListNode = (function () {
        function LinkedListNode(element, next) {
            this.element = element;
            this.next = next;
        }
        return LinkedListNode;
    }());
    exports.LinkedListNode = LinkedListNode;
    function defaultEquals(a, b) {
        return a === b;
    }
    exports.defaultEquals = defaultEquals;
});
