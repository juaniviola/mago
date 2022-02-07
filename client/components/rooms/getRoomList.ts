import axios from 'axios';
import { serverUrl } from '../../config';

export default function getRoomList(): Promise<void> {
  return axios.get(serverUrl.concat('/room/all'));
}
