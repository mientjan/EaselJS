
/*
 * LinkedList
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Basarat Ali Syed
 * Copyright (c) 2013 Mauricio Santos
 * Copyright (c) 2015 Mient-jan Stelling
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export class LinkedList<T>
{
	/**
	 * First node in the list
	 * @type {Object}
	 * @private
	 */
	public firstNode:ILinkedListNode<T> = null;
	/**
	 * Last node in the list
	 * @type {Object}
	 * @private
	 */
	private lastNode:ILinkedListNode<T> = null;

	/**
	 * Number of elements in the list
	 * @type {number}
	 * @private
	 */
	private numberOfNodes:number = 0;

	/**
	 * Creates an empty Linked List.
	 * @class A linked list is a data structure consisting of a group of nodes
	 * which together represent a sequence.
	 * @constructor
	 */
	constructor()
	{
	}

	/**
	 * Adds an element to this list.
	 * @param {Object} item element to be added.
	 * @param {number=} index optional index to add the element. If no index is specified
	 * the element is added to the end of this list.
	 * @return {boolean} true if the element was added or false if the index is invalid
	 * or if the element is undefined.
	 */
	public add(item:T, index:number = this.numberOfNodes):boolean
	{
		if(index < 0 || index > this.numberOfNodes)
		{
			return false;
		}

		var newNode = this.createNode(item);
		if(this.numberOfNodes === 0)
		{
			// First node in the list.
			this.firstNode = newNode;
			this.lastNode = newNode;
		}
		else if(index === this.numberOfNodes)
		{
			// Insert at the end.
			this.lastNode.next = newNode;
			this.lastNode = newNode;
		}
		else if(index === 0)
		{
			// Change first node.
			newNode.next = this.firstNode;
			this.firstNode = newNode;
		}
		else
		{
			var prev = this.nodeAtIndex(index - 1);
			newNode.next = prev.next;
			prev.next = newNode;
		}
		this.numberOfNodes++;
		return true;
	}

	/**
	 * Returns the first element in this list.
	 * @return {*} the first element of the list or undefined if the list is
	 * empty.
	 */
	public first():T
	{
		if(this.firstNode !== null)
		{
			return this.firstNode.element;
		}

		return undefined;
	}

	/**
	 * Returns the last element in this list.
	 * @return {*} the last element in the list or undefined if the list is
	 * empty.
	 */
	public last():T
	{
		if(this.lastNode !== null)
		{
			return this.lastNode.element;
		}

		return undefined;
	}

	/**
	 * Returns the element at the specified position in this list.
	 * @param {number} index desired index.
	 * @return {*} the element at the given index or undefined if the index is
	 * out of bounds.
	 */
	public elementAtIndex(index:number):T
	{

		var node = this.nodeAtIndex(index);
		if(node === null)
		{
			return undefined;
		}
		return node.element;
	}

	/**
	 * Returns the index in this list of the first occurrence of the
	 * specified element, or -1 if the List does not contain this element.
	 * <p>If the elements inside this list are
	 * not comparable with the === operator a custom equals function should be
	 * provided to perform searches, the function must receive two arguments and
	 * return true if they are equal, false otherwise. Example:</p>
	 *
	 * <pre>
	 * var petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
	 * </pre>
	 * @param {Object} item element to search for.
	 * @param {function(Object,Object):boolean=} equalsFunction Optional
	 * function used to check if two elements are equal.
	 * @return {number} the index in this list of the first occurrence
	 * of the specified element, or -1 if this list does not contain the
	 * element.
	 */
	public indexOf(item:T, equalsFunction?:(a: T, b: T) => boolean):number
	{

		var equalsF = equalsFunction || defaultEquals;

		var currentNode = this.firstNode;
		var index = 0;
		while(currentNode !== null)
		{
			if(equalsF(currentNode.element, item))
			{
				return index;
			}
			index++;
			currentNode = currentNode.next;
		}
		return -1;
	}


	/**
	 * Returns true if this list contains the specified element.
	 * <p>If the elements inside the list are
	 * not comparable with the === operator a custom equals function should be
	 * provided to perform searches, the function must receive two arguments and
	 * return true if they are equal, false otherwise. Example:</p>
	 *
	 * <pre>
	 * var petsAreEqualByName = function(pet1, pet2) {
           *  return pet1.name === pet2.name;
           * }
	 * </pre>
	 * @param {Object} item element to search for.
	 * @param {function(Object,Object):boolean=} equalsFunction Optional
	 * function used to check if two elements are equal.
	 * @return {boolean} true if this list contains the specified element, false
	 * otherwise.
	 */
	public contains(item:T, equalsFunction?:IEqualsFunction<T>):boolean
	{
		return (this.indexOf(item, equalsFunction) >= 0);
	}

	/**
	 * Removes the first occurrence of the specified element in this list.
	 * <p>If the elements inside the list are
	 * not comparable with the === operator a custom equals function should be
	 * provided to perform searches, the function must receive two arguments and
	 * return true if they are equal, false otherwise. Example:</p>
	 *
	 * <pre>
	 * var petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
	 * </pre>
	 * @param {Object} item element to be removed from this list, if present.
	 * @return {boolean} true if the list contained the specified element.
	 */
	public remove(item:T, equalsFunction?:IEqualsFunction<T>):boolean
	{
		var equalsF = equalsFunction || defaultEquals;
		if(this.numberOfNodes < 1)
		{
			return false;
		}

		var previous:ILinkedListNode<T> = null;
		var currentNode:ILinkedListNode<T> = this.firstNode;

		while(currentNode !== null)
		{
			if(equalsF(currentNode.element, item))
			{

				if(currentNode === this.firstNode)
				{
					this.firstNode = this.firstNode.next;
					if(currentNode === this.lastNode)
					{
						this.lastNode = null;
					}
				}
				else if(currentNode === this.lastNode)
				{
					this.lastNode = previous;
					previous.next = currentNode.next;
					currentNode.next = null;
				}
				else
				{
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
	}

	/**
	 * Removes all of the elements from this list.
	 */
	public clear():void
	{
		this.firstNode = null;
		this.lastNode = null;
		this.numberOfNodes = 0;
	}

	/**
	 * Returns true if this list is equal to the given list.
	 * Two lists are equal if they have the same elements in the same order.
	 * @param {LinkedList} other the other list.
	 * @param {function(Object,Object):boolean=} equalsFunction optional
	 * function used to check if two elements are equal. If the elements in the lists
	 * are custom objects you should provide a function, otherwise
	 * the === operator is used to check equality between elements.
	 * @return {boolean} true if this list is equal to the given list.
	 */
	public equals(other:LinkedList<T>, equalsFunction?:IEqualsFunction<T>):boolean
	{
		var eqF = equalsFunction || defaultEquals;
		if(!(other instanceof LinkedList))
		{
			return false;
		}
		if(this.size() !== other.size())
		{
			return false;
		}
		return this.equalsAux(this.firstNode, other.firstNode, eqF);
	}

	/**
	 * @private
	 */
	private equalsAux(n1:ILinkedListNode<T>, n2:ILinkedListNode<T>, eqF:IEqualsFunction<T>):boolean
	{
		while(n1 !== null)
		{
			if(!eqF(n1.element, n2.element))
			{
				return false;
			}
			n1 = n1.next;
			n2 = n2.next;
		}
		return true;
	}

	/**
	 * Removes the element at the specified position in this list.
	 * @param {number} index given index.
	 * @return {*} removed element or undefined if the index is out of bounds.
	 */
	public removeElementAtIndex(index:number):T
	{
		if(index < 0 || index >= this.numberOfNodes)
		{
			return undefined;
		}
		var element:T;
		if(this.numberOfNodes === 1)
		{
			//First node in the list.
			element = this.firstNode.element;
			this.firstNode = null;
			this.lastNode = null;
		}
		else
		{
			var previous = this.nodeAtIndex(index - 1);
			if(previous === null)
			{
				element = this.firstNode.element;
				this.firstNode = this.firstNode.next;
			}
			else if(previous.next === this.lastNode)
			{
				element = this.lastNode.element;
				this.lastNode = previous;
			}
			if(previous !== null)
			{
				element = previous.next.element;
				previous.next = previous.next.next;
			}
		}
		this.numberOfNodes--;
		return element;
	}

	/**
	 * Executes the provided function once for each element present in this list in order.
	 * @param {function(Object):*} callback function to execute, it is
	 * invoked with one argument: the element value, to break the iteration you can
	 * optionally return false.
	 */
	public forEach(callback:(item:T) => any):void
	{
		var currentNode = this.firstNode;
		while(currentNode !== null)
		{
			callback(currentNode.element)
			currentNode = currentNode.next;
		}
	}

	/**
	 * Reverses the order of the elements in this linked list (makes the last
	 * element first, and the first element last).
	 */
	public reverse():void
	{
		var previous:ILinkedListNode<T> = null;
		var current:ILinkedListNode<T> = this.firstNode;
		var temp:ILinkedListNode<T> = null;
		while(current !== null)
		{
			temp = current.next;
			current.next = previous;
			previous = current;
			current = temp;
		}
		temp = this.firstNode;
		this.firstNode = this.lastNode;
		this.lastNode = temp;
	}

	/**
	 * Returns an array containing all of the elements in this list in proper
	 * sequence.
	 * @return {Array.<*>} an array containing all of the elements in this list,
	 * in proper sequence.
	 */
	public toArray():T[]
	{
		var array:T[] = [];
		var currentNode:ILinkedListNode<T> = this.firstNode;
		while(currentNode !== null)
		{
			array.push(currentNode.element);
			currentNode = currentNode.next;
		}
		return array;
	}

	/**
	 * Returns the number of elements in this list.
	 * @return {number} the number of elements in this list.
	 */
	public size():number
	{
		return this.numberOfNodes;
	}

	/**
	 * Returns true if this list contains no elements.
	 * @return {boolean} true if this list contains no elements.
	 */
	public isEmpty():boolean
	{
		return this.numberOfNodes <= 0;
	}

	public toString():string
	{
		return this.toArray().toString();
	}

	/**
	 * @private
	 */
	private nodeAtIndex(index:number):ILinkedListNode<T>
	{

		if(index < 0 || index >= this.numberOfNodes)
		{
			return null;
		}
		if(index === (this.numberOfNodes - 1))
		{
			return this.lastNode;
		}
		var node = this.firstNode;
		for(var i = 0; i < index; i++)
		{
			node = node.next;
		}
		return node;
	}

	/**
	 * @private
	 */
	private createNode(item:T):ILinkedListNode<T>
	{
		return {
			element: item,
			next: null
		};
	}
}

export interface ILinkedListNode<T> {
	element: T;
	next: ILinkedListNode<T>;
}

export class LinkedListNode<T> implements ILinkedListNode<T>
{
	element: T;
	next: ILinkedListNode<T>;

	constructor(element:T, next?:LinkedListNode<T>){
		this.element = element;
		this.next = next;
	}
}

/**
 * Function signature for checking equality
 */
export interface IEqualsFunction<T>{
	(a: T, b: T): boolean;
}

export function defaultEquals<T>(a: T, b: T): boolean {
	return a === b;
}

