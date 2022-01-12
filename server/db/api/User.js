const UserApi = (User) => {
  const createUser = ({ username }) => User.create({ username });

  const addUserToRoom = ({ username, roomId }) => User.update(
    { roomId },
    { where: { username } },
  );

  const deleteUser = (username) => User.destroy({ where: { username } });

  const getUsersFromRoom = (roomId) => User.findAll({ where: { roomId } });

  return {
    createUser,
    addUserToRoom,
    deleteUser,
    getUsersFromRoom,
  };
};

export default UserApi;
