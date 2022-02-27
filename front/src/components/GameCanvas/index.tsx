import React, {
  memo, useEffect, useRef
} from 'react';

import { Game } from '~/game';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const game = new Game(canvasRef.current);
    game.startGame();
  }, [canvasRef.current]);

  return (
    <canvas ref={canvasRef} width='245px' height='460px'/>
  );
};

export default memo(GameCanvas);
