import logic from './logic';
import gameLogic from './gameLogic';

export default function (io) {
  io.on('connection', (socket) => {
    logic(io, socket);
    gameLogic(io, socket);
  });
}
