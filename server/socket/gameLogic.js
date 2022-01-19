import cardUtils from '../utils';

const { mixCards } = cardUtils;

export default function (io, socket) {
  socket.on('play_card', ({ card, turn, quantity }) => {
    socket.broadcast.emit('card_played', { card, turn, quantity });
  });

  socket.on('take_card', ({ turn, quantity }) => {
    socket.broadcast.emit('card_taked', { turn, quantity });
  });

  socket.on('change_type', (type) => {
    socket.broadcast.emit('type_changed', type);
  });

  socket.on('shuffle', (stack) => {
    const newStack = mixCards(stack);
    io.emit('shuffled', newStack);
  });
}
