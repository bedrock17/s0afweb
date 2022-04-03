type Point = {
  x: number,
  y: number,
};

type Lines = number;

type eventType = 'Touch' | 'Attack';

type PopTileEvent = {
  type: eventType,
  data: Point | Lines,
};
