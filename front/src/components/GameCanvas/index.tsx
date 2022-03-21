import type { MutableRefObject } from 'react';
import React, {
  useEffect, useRef, useState
} from 'react';

import { Game } from '~/game';

import { Canvas } from './styles';

type Props = {
  animationEffect: boolean,
  gameRef: MutableRefObject<Game | undefined>,
  mini?: boolean,
  readonly?: boolean,
};


const GameCanvas = ({ animationEffect, gameRef, mini, readonly = false }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.onselectstart = () => false;

    const tileWidth = mini ? 8 : 31;
    gameRef.current = new Game(canvasRef.current, tileWidth);
    gameRef.current.onStateChange = setIsGameOver;

    if (!gameRef.current) {
      return;
    }

    return () => {
      gameRef.current = undefined;
    };
  }, [gameRef]);

  useEffect(() => {
    if (!gameRef.current) {
      return;
    }
    gameRef.current.animationEffect = animationEffect;
    gameRef.current.readonly = readonly;
  }, [readonly, animationEffect, gameRef]);

  const width = mini ? '64px' : '245px';
  const height = mini ? '120px' : '460px';


  return (
    <Canvas ref={canvasRef} width={width} height={height} gameOver={isGameOver} />
  );
};

export default GameCanvas;
