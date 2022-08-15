import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Login from "../Login/Login";
import Logout from "../Login/Logout";


function LoginPage() {
  const user = useSelector(selectUser)

  return ( 
    <>
      {user ? <Logout/> : <Login/>}
    </>
   );
}

export default LoginPage;