const UserApi = (redisClient) => {
  const set = ({ roomId, username, socketId }) => redisClient
    .hSet(`${roomId}`, username, socketId);

  const get = ({ roomId, username }) => redisClient.hGet(`${roomId}`, username);

  const getFromRoom = (roomId) => redisClient.hGetAll(`${roomId}`);

  const remove = ({ roomId, username }) => redisClient.hDel(`${roomId}`, username);

  const setOwner = ({ roomId, username }) => redisClient.hSet('owner', `${roomId}`, username);

  const getOwner = (roomId) => redisClient.hGet('owner', `${roomId}`);

  const removeOwner = (roomId) => redisClient.hDel('owner', `${roomId}`);

  return {
    set,
    get,
    getFromRoom,
    remove,
    setOwner,
    getOwner,
    removeOwner,
  };
};

export default UserApi;
