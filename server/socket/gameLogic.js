import cardUtils from '../utils';

const { mixCards } = cardUtils;

export default function (io, socket) {
  socket.on('play_card', ({ stack, turn, quantity }) => {
    socket.broadcast.emit('card_played', { stack, turn, quantity });
  });

  socket.on('take_card', ({ turn, quantity, cards }) => {
    socket.broadcast.emit('card_taked', { turn, quantity, cards });
  });

  socket.on('change_type', ({ type, stack, turn }) => {
    socket.broadcast.emit('type_changed', { type, stack, turn });
  });

  socket.on('shuffle', (stack) => {
    const newStack = mixCards(stack);
    io.emit('shuffled', newStack);
  });
}
