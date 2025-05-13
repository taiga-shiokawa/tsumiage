import { useState } from "react";
import { supabase } from "../../libs/supabaseClient";

export const AddTodo = ({ onAdded }: { onAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [goalWeek, setGoalWeek] = useState("");
  const [goalDay, setGoalDay] = useState("");
  const [loading, setLoading] = useState(false);

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
        goal_week: goalWeek.trim() || null,
        goal_day: goalDay.trim() || null,
        // started_at, ended_at, report は初期は null のまま
      },
    ]);

    setLoading(false);
    if (error) {
      console.error(error);
      return alert("タスクの登録に失敗しました");
    }

    // フォームクリア & 親で一覧再取得
    setTitle("");
    setGoalWeek("");
    setGoalDay("");
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
      <input
        type="text"
        value={goalWeek}
        onChange={(e) => setGoalWeek(e.target.value)}
        placeholder="今週の目標"
        className="border p-2 w-full"
        disabled={loading}
      />
      <input
        type="text"
        value={goalDay}
        onChange={(e) => setGoalDay(e.target.value)}
        placeholder="今日の目標"
        className="border p-2 w-full"
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
