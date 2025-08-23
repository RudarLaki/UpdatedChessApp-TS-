import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import { Home } from "./pages/home";
import GameScreen from "./pages/game-screen";
import FriendsPage from "./pages/friends";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/game/:roomId" element={<GameScreen />} />
        <Route path="/friends" element={<FriendsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
