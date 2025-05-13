import { useState } from "react";
import { supabase } from "../libs/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("SignIn email:", email);
    console.log("SignIn password:", password);

    if (error) {
      alert(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: exists } = await supabase.from("users").select("id").eq("id", user.id).single();
        if (!exists) {
          await supabase.from("users").insert([
            { id: user.id, email: user.email }
          ]);
        }
      }
      alert("ログイン成功");
      navigate("/mypage");
    }
  };
  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">ログイン</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4 w-80"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-80"
      />
      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        ログイン
      </button>
      <p className="mt-4">
        新規登録は<Link to="/signup" className="text-blue-500 hover:underline">こちら</Link>
      </p>
    </div>
  );
};

export default SignIn;
