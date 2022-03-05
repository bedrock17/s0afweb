import React, { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

import { Game } from '~/game';

import { Canvas } from './styles';

type Props = {
  animationEffect: boolean,
  gameRef: MutableRefObject<Game | undefined>,
};


const GameCanvas = ({ animationEffect, gameRef }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    gameRef.current = new Game(canvasRef.current);

    if (!gameRef.current) {
      return;
    }

    gameRef.current.startGame(0);
    return () => {
      gameRef.current = undefined;
    };
  }, [gameRef]);

  useEffect(() => {
    if (!gameRef.current) {
      return;
    }
    gameRef.current.animationEffect = animationEffect;
  }, [animationEffect, gameRef]);

  return (
    <Canvas ref={canvasRef} width='245px' height='460px'/>
  );
};

export default GameCanvas;
