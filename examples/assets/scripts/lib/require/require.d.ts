/**
 * Main entry point.
 *
 * If the only argument to require is a string, then the module that
 * is represented by that string is fetched for the appropriate context.
 *
 * If the first argument is an array, then it will be treated as an array
 * of dependency string names to fetch. An optional function callback can
 * be specified to execute when all of those dependencies are available.
 */
declare function require( deps:string, callback?:Function, errback?:Function, optional?:Function ):any;
declare function require( deps:any[], callback?:Function, errback?:Function, optional?:Function ):any;
declare function require( deps:any, callback?:Function, errback?:Function, optional?:Function ):any;

declare function define( name:string, deps:any[], callback:Function ):any;
declare function define( deps:any[], callback:Function ):any;

declare var requirejs:any;