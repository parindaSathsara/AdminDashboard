import 'firebase/analytics';
import { useAuthState } from "react-firebase-hooks/auth";
import Welcome from './Components/Welcome';
import ChatBox from './Components/ChatBox';
import { auth } from 'src/firebase';
import './Chatshome.css'

function Chatshome() {

  const [user] = useAuthState(auth);

  return (
    <div className='testing'>
      {/* {!user ? (
        <Welcome />
      ) : (
        <ChatBox />
      )} */}
      <ChatBox />
    </div>
  );

}

export default Chatshome;
