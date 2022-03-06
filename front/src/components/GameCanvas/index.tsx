import type { MutableRefObject } from 'react';
import React, { useEffect, useRef } from 'react';

import { Game } from '~/game';

import { Canvas } from './styles';
import { Seed } from '~/api';

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

    canvasRef.current.onselectstart = () => false;

    gameRef.current = new Game(canvasRef.current);

    if (!gameRef.current) {
      return;
    }

    Seed.get().then((seed) => {
      gameRef.current!.startGame(seed);
    });

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
