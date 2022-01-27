import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import globalStyle from '../style/global';
import { Container, Button } from '../style/room';
import ListComponent from '../components/rooms/ListComponent';
import Modal from '../components/rooms/Modal';
import getRoomList from '../components/rooms/getRoomList';

import Create from '../components/rooms/CreateComponent';
import Login from '../components/rooms/LoginComponent';

export default function Room(): JSX.Element {
  const router = useRouter();
  const [showModal, setShowModal]: [boolean, any] = useState(false);
  const [typeModal, setTypeModal]: [string, any] = useState('');
  const [roomList, setRoomList]: [Array<object>, any] = useState([]);

  useEffect((): void => {
    const usernameFromStorage = sessionStorage.getItem('username');
    if (!usernameFromStorage) router.push('/');

    const getList = async (): Promise<void> => {
      const rooms: any = await getRoomList();
      setRoomList([...rooms] || []);
    };

    getList();
  });

  const handleOpenModal = (type: string): void => {
    if (type === 'create') setTypeModal('create');
    else setTypeModal('login');

    setShowModal(true);
  };

  return (
    <Container>
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        {typeModal === 'create' ? <Create /> : <Login />}
      </Modal>

      <Button onClick={() => handleOpenModal('create')}>Create Room</Button>
      <Button onClick={() => handleOpenModal('login')}>Join private Room</Button>

      {roomList.length === 0 ? <span>No rooms available</span> : null}

      {roomList.forEach((room: any) => <ListComponent
          roomId={room.id}
          users={room.users}
          key={room.id}
        />
      )}

      <style jsx global>{globalStyle}</style>
    </Container>
  );
}
