export interface IScrollerOptions {
	scrollingX?: boolean;
	scrollingY?: boolean;
	animating?: boolean;
	animationDuration?: number;
	bouncing?: boolean;
	locking?: boolean;
	paging?: boolean;
	snapping?: boolean;
	zooming?: boolean;
	minZoom?: number;
	maxZoom?: number;
	speedMultiplier?: number;
	scrollingComplete?: Function;
	penetrationDeceleration?: number;
	penetrationAcceleration?: number;
}

