import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import axios from 'axios'

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()

  async function handleSubmit(e:any){
    e.preventDefault();
    const {data} = await axios.post('http://localhost:5000/users/login/',{
      email: email,
      password: password,
    })
    console.log(data);
    

    dispatch(login({
      email: email,
      password: password,
    }))
  }

  return ( 
    <>
      <div>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <h1>Login</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
   );
}

export default Login;