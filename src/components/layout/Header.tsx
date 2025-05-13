// src/components/layout/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../libs/supabaseClient';

export const Header = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // マウント時＆認証状態変化時にユーザー情報をセット
  useEffect(() => {
    // 初回取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUser({ email: user.email });
    });
    // 認証状態変更のサブスクライブ
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u && u.email ? { email: u.email } : null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <header className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/" className="hover:underline">
          ツミアゲ
        </Link>
      </h1>

      <nav className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button
              className="text-sm flex items-center focus:outline-none focus:ring"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              こんにちは、{user.email.split('@')[0]} さん
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-10">
                <Link
                  to="/mypage"
                  className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  マイページ
                </Link>
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 未ログイン時はサインイン・サインアップへのリンク */}
            <Link to="/signin" className="hover:underline">
              ログイン
            </Link>
            <Link to="/signup" className="hover:underline">
              新規登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
