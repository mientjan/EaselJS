/**
 * @enum ValueType
 */
export const enum DisplayType {
	UNKNOWN = 1 << 0,
	DISPLAYOBJECT = 1 << 1,
	STAGE = 1 << 2,
	CONTAINER = 1 << 3,
	SHAPE = 1 << 4,
	BITMAP = 1 << 5,
	MOVIECLIP = 1 << 6,
	SPRITESHEET = 1 << 7,
	BITMAPVIDEO = 1 << 8,
	BITMAPTEXT = 1 << 9,
	TEXTURE = 1 << 10,
	FLUMPSYMBOL = 1 << 11,
}

