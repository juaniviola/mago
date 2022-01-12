const RoomApi = (Room) => {
  const createRoom = ({ userOwner, password = '' } = {}) => Room.create({
    userOwner,
    password,
    started: false,
  });

  const getRoom = (id) => Room.findOne({ where: { id } });

  const getAllRooms = () => Room.findAll({});

  const updateRoomStatus = ({ roomId, started }) => Room.update(
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

  const deleteRoom = (roomId) => Room.destroy({ where: { id: roomId } });

  return {
    createRoom,
    getRoom,
    getAllRooms,
    updateRoomStatus,
    areCredentialsValid,
    deleteRoom,
  };
};

export default RoomApi;
