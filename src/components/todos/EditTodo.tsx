import { useState } from "react";
import { supabase } from "../../libs/supabaseClient";

export type Todo = {
  id: string;
  title: string;
  goal_week: string | null;
  goal_day: string | null;
  report: string | null;
};

type Props = {
  todo: Todo;
  onUpdated: () => void;
  onCancel: () => void;
};

export const EditTodo = ({ todo, onUpdated, onCancel }: Props) => {
  const [title, setTitle] = useState(todo.title);
  const [goalWeek, setGoalWeek] = useState(todo.goal_week || "");
  const [goalDay, setGoalDay] = useState(todo.goal_day || "");
  const [report, setReport] = useState(todo.report || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("todos")
      .update({
        title: title.trim(),
        goal_week: goalWeek.trim() || null,
        goal_day: goalDay.trim() || null,
        report: report.trim() || null,
      })
      .eq("id", todo.id);
    setLoading(false);

    if (error) {
      alert("更新に失敗しました: " + error.message);
    } else {
      onUpdated();
    }
  };

  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded border">
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
      <textarea
        value={report}
        onChange={(e) => setReport(e.target.value)}
        placeholder="レポート・メモ"
        className="border p-2 w-full h-24"
        disabled={loading}
      />
      <div className="flex space-x-2">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "更新中..." : "更新"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};
