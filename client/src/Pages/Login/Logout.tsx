import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";


function Logout() {
  const dispatch = useDispatch()

  function handleLogout(){  
    dispatch(logout())
  }

  return ( 
    <>
      <h1>Welcome <span></span></h1>
      <button onClick={()=>handleLogout()}>Logout</button>
    </>
   );
}

export default Logout;