const RoomApi = (Room) => {
  const create = ({ password = '' } = {}) => Room.create({
    password,
    started: false,
  });

  const get = (id) => Room.findOne({ where: { id } });

  const getAll = () => Room.findAll({
    where: {
      started: false,
      password: '',
    },
  });

  const updateStatus = ({ roomId, started }) => Room.update(
    { started },
    { where: { id: roomId } },
  );

  const areCredentialsValid = async ({ roomId, password = '' } = {}) => {
    try {
      const room = await Room.findOne({ where: { id: roomId } });

      if (!room || !room.id || room.password !== password) throw new Error('Invalid credentials');

      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const remove = (roomId) => Room.destroy({ where: { id: roomId } });

  return {
    create,
    get,
    getAll,
    updateStatus,
    areCredentialsValid,
    remove,
  };
};

export default RoomApi;
