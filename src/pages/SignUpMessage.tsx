import React from "react";
import { Link } from "react-router-dom";

const SignUpMessage = () => (
  <div className="flex flex-col items-center mt-10">
    <h2 className="text-2xl font-bold mb-4">メールを確認してください</h2>
    <p className="mb-4">
      登録したメールアドレス宛に認証メールを送信しました。<br />
      メール内のリンクをクリックして認証を完了してください。<br />
      認証後はログインページからログインしてください。
    </p>
    <Link to="/signin" className="text-blue-500 underline">
      ログインページへ
    </Link>
  </div>
);

export default SignUpMessage; 