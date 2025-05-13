import { useState } from "react";
import { supabase } from "../../libs/supabaseClient";
import { useNavigate } from "react-router-dom";

export const AddTodo = ({ onAdded }: { onAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!title.trim()) return alert("タスクのタイトルを入力してください");
    setLoading(true);

    // 現在ユーザーID取得
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return alert("ログインしてください");
    }

    // INSERT into todos
    const { error } = await supabase.from("todos").insert([
      {
        user_id: user.id,
        title: title.trim(),
        report: report.trim() || null,
        // started_at, ended_at は初期は null のまま
      },
    ]);

    setLoading(false);
    if (error) {
      console.error(error);
      alert("タスクの登録に失敗しました。ログインしてください");
      navigate("/signin");
      return;
    }

    // フォームクリア & 親で一覧再取得
    setTitle("");
    setReport("");
    onAdded();
  };

  return (
    <div className="space-y-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクのタイトル"
        className="border p-2 w-full"
        disabled={loading}
      />
      <textarea
        value={report}
        onChange={(e) => setReport(e.target.value)}
        placeholder="メモ（任意）"
        className="border p-2 w-full h-24"
        disabled={loading}
      />
      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "登録中..." : "タスクを追加"}
      </button>
    </div>
  );
};
