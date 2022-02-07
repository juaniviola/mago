export default function logicListeners(
  socket: any,
  setGameProps: any,
): void {
  socket.on('cards', (userCards: []) => {
    socket.on('start_match', ({ users, cards, stack, turn }) => {
      setGameProps({ gameStarted: true, quantity: 0, userCards, users, cards, stack, turn, typeCard: stack[0].slice(3) });
    });
  });

  socket.on('user_disconnected', (users: []) => {
    setGameProps({ users });
  });
}
