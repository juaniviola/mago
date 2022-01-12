const RoomApi = (Room) => {
  const createRoom = ({ userOwner, password = '' } = {}) => Room.create({
    userOwner,
    password,
    started: false,
  });

  const getAllRooms = () => Room.findAll({});

  const updateRoomStatus = ({ roomId, started }) => Room.update(
    { started },
    { where: { id: roomId } },
  );

  const areCredentialsValid = async ({ roomId, password = '' } = {}) => {
    try {
      const room = await Room.findOne({ where: { id: roomId } });
      if (!room || !room.id || room.password !== password) throw Error('Invalid credentials');

      return true;
    } catch (error) {
      throw Error(error);
    }
  };

  const deleteRoom = (roomId) => Room.destroy({ where: { id: roomId } });

  return {
    createRoom,
    getAllRooms,
    updateRoomStatus,
    areCredentialsValid,
    deleteRoom,
  };
};

export default RoomApi;
