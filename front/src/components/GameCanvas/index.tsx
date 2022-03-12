import type { MutableRefObject } from 'react';
import React, { useEffect, useRef } from 'react';

import { Seed } from '~/api';
import { Game } from '~/game';

import { Canvas } from './styles';

type Props = {
  animationEffect: boolean,
  gameRef: MutableRefObject<Game | undefined>,
  mini?: boolean,
};


const GameCanvas = ({ animationEffect, gameRef, mini }: Props) => {
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

  const width = mini ? '61px' : '245px';
  const height = mini ? '115px' : '460px';

  return (
    <Canvas ref={canvasRef} width={width} height={height} />
  );
};

export default GameCanvas;
