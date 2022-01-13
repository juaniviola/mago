const UserApi = (User, redisClient) => {
  const create = ({ username }) => User.create({ username });

  const addToRoom = async ({ username, roomId, socketId }) => {
    const update = await User.update(
      { roomId },
      { where: { username } },
    );

    await redisClient.hSet(`${roomId}`, username, socketId);

    return update;
  };

  const remove = (username) => User.destroy({ where: { username } });

  const getFromRoom = (roomId) => User.findAll({ where: { roomId } });

  const getSocket = ({ roomId, username }) => redisClient.hGet(`${roomId}`, username);

  const getRoomSockets = (roomId) => redisClient.hGetAll(`${roomId}`);

  const removeSocket = ({ roomId, username }) => redisClient.hDel(`${roomId}`, username);

  return {
    create,
    addToRoom,
    remove,
    getFromRoom,
    getSocket,
    getRoomSockets,
    removeSocket,
  };
};

export default UserApi;
