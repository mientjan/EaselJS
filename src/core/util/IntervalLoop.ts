import Container from "../../easelts/display/Container";
import {Interval2} from "./Interval2";

export class RenderInterval
{
	interval:Interval2
	currentTime:number = 0;
	accumulator:number = 0;
	millisecondsPerFrame:number = 0;

	constructor(container:Container, protected framePerSecond:number)
	{
		this.millisecondsPerFrame = 1000 / framePerSecond;
	}

	public start(){
		this.interval = new Interval2();
		this.interval.add(this.update)
	}

	public stop(){
		if(this.interval){
			this.interval.destruct();
		}
	}

	protected update = () => {
		const dt = this.millisecondsPerFrame;
		const newTime = Date.now();
		var deltaTime = newTime - this.currentTime;
		this.currentTime = newTime;

		if (deltaTime>25){
			deltaTime = 25;
		}

		this.accumulator += deltaTime;

		while ( this.accumulator >= dt)
		{
			this.accumulator -= dt;
			integrate(current, t, dt);
			t += dt;
		}
	}
}

/*

 while (!quit)
 {
 glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

 const float newTime = time();
 float deltaTime = newTime - currentTime;
 currentTime = newTime;

 if (deltaTime>0.25f)
 deltaTime = 0.25f;

 accumulator += deltaTime;

 while (accumulator>=dt)
 {
 accumulator -= dt;
 previous = current;
 integrate(current, t, dt);
 t += dt;
 }

 State state = interpolate(previous, current, accumulator/dt);

 glBegin(GL_POINTS);
 glColor3f(1,1,1);
 glVertex3f(state.x, 0, 0);
 glEnd();

 updateDisplay();
 }
 */