import axios from 'axios';

// TODO: import from config
const uri = 'http://localhost:8001';

export default function getRoomList(): Promise<void> {
  return axios.get(uri.concat('/room/all'));
}
