import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../libs/supabaseClient';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/signin');
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  if (loading) {
    return <div>認証確認中...</div>;
  }
  return <>{children}</>;
} 