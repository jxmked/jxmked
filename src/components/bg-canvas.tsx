import React, { useRef, useEffect, useState } from 'react';
import {  windowInitialHeight, windowInitialWidth } from '../constants';
import { Vec2 } from '../interfaces';
import { inRange } from '../utils';
import useWindowSize from '../hooks/useWIndowSize';

export type ICanvasElement = React.HTMLAttributes<HTMLCanvasElement>;

export enum B_COLLISION {
  TOP = 0b1000,
  LEFT = 0b0100,
  BOTTOM = 0b0010,
  RIGHT = 0b0001
}


const minScreenize = Math.min(windowInitialHeight, windowInitialWidth);
const arcSize = minScreenize * 0.0003; // Radius
const maxRes = Math.min(windowInitialHeight, windowInitialWidth);
const maxSpeed = 1; // px/s
const position = new Vec2();
const velocity = new Vec2(inRange(0.1, 0.9), inRange(0.1, 0.9));


const onBorderHit = function (
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  size: number
): number {
  const { width, height } = ctx.canvas;

  const { x, y } = pos;
  let collided: number = 0b0000;

  if (0 >= size + x) {
    collided |= B_COLLISION.LEFT;
  } else if (width <= size + x) {
    collided |= B_COLLISION.RIGHT;
  }

  if (0 >= size + y) {
    collided |= B_COLLISION.TOP;
  } else if (height <= size + y) {
    collided |= B_COLLISION.BOTTOM;
  }

  return collided;
};

const draw = function (ctx: CanvasRenderingContext2D, newSize:number[]): void {
  ctx.canvas.width = newSize[0];
  ctx.canvas.height = newSize[1];

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const borderHitResult = onBorderHit(ctx, position, arcSize);

  position.x += velocity.x;
  position.y += velocity.y;

  if (borderHitResult > 0) {
    // Top and bottom
    if ((borderHitResult & B_COLLISION.TOP) > 0) {
      velocity.y = inRange(0.1, maxSpeed);
    } else if ((borderHitResult & B_COLLISION.BOTTOM) > 0) {
      velocity.y = -inRange(0.1, maxSpeed);
    }

    // Left and Right
    if ((borderHitResult & B_COLLISION.LEFT) > 0) {
      velocity.x = inRange(0.1, maxSpeed);
    } else if ((borderHitResult & B_COLLISION.RIGHT) > 0) {
      velocity.x = -inRange(0.1, maxSpeed);
    }

    // Keep the object inside of the box

    if(position.x - arcSize <= 0) {
      position.x = arcSize;
    } else if (position.x + arcSize >= ctx.canvas.width) {
      position.x = ctx.canvas.width - arcSize;
    }

    if(position.y - arcSize <= 0) {
      position.y = arcSize;
    } else if (position.y + arcSize >= ctx.canvas.height) {
      position.y = ctx.canvas.height - arcSize;
    }
  }

  // const gradient = ctx.createRadialGradient(
  //   position.x,
  //   position.y,
  //   170,
  //   position.x,
  //   position.y,
  //   arcSize
  // );

  // gradient.addColorStop(0, '#000000');
  // gradient.addColorStop(0.5, '#ffffff');

  // ctx.fillStyle = gradient;

  ctx.fillStyle = "#ffffff"
  ctx.beginPath();
  ctx.arc(position.x, position.y, maxRes * arcSize, 0, 2 * Math.PI);
  ctx.fill();
};

const Canvas = (props: React.HTMLAttributes<HTMLCanvasElement>) => {
  const [windowSize, setWindowSize] = useState([windowInitialWidth, windowInitialHeight])

  const canvasRef = useRef<HTMLCanvasElement>(null);
  setWindowSize(useWindowSize())

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext('2d')!;
    let animationFrameId: ReturnType<Window['requestAnimationFrame']>;

    //Our draw came here
    const render = () => {
      draw(context, windowSize);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [windowSize]);

  props = Object.assign(
    {
      className:
        'z-0 fixed block w-full h-full p-0 m-0 top-0 left-0 translate-x-0.5 translate-y-0.5',
      width: windowInitialWidth,
      height: windowInitialHeight,
      ref: canvasRef
    },
    props
  );

  return <canvas {...props} />;
};

export default Canvas;
