import useAuth from "./hooks/useAuth"
import Landing from "./screens/Landing";
import Whiteboard from "./screens/Whiteboard";

function App() {
  const [isLogin,token]=useAuth();
  console.log(isLogin)

  return isLogin?<Whiteboard/>:<Landing/>
}

export default App
