import React, {
  memo, useEffect, useRef, useState,
} from 'react';

import { Game } from '~/game';

type Props = {
  animationEffect: boolean,
};


const GameCanvas = ({ animationEffect }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    setGame(new Game(canvasRef.current));
  }, []);

  useEffect(() => {
    if (!game) {
      return;
    }

    if (game) {
      game.startGame();
    }
  }, [game]);

  useEffect(() => {
    if (game) {
      game.animationEffect = animationEffect;
    }
  }, [animationEffect, game]);

  return (
    <canvas ref={canvasRef} width='245px' height='460px'/>
  );
};

export default GameCanvas;
