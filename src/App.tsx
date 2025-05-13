import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SignUpMessage from "./pages/SignUpMessage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup-message" element={<SignUpMessage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
