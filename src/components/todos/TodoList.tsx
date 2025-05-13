import { useState, useEffect } from "react";
import { supabase } from "../../libs/supabaseClient";
import { AddTodo } from "./AddTodo";
import { EditTodo } from "./EditTodo";

type Todo = {
  id: string;
  title: string;
  goal_week: string | null;
  goal_day: string | null;
  started_at: string | null;
  ended_at: string | null;
  report: string | null;
  break_started_at?: string | null;
  break_ended_at?: string | null;
};

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  // ページごとのtodoを計算
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(todos.length / todosPerPage);

  // ページ変更時に呼ぶ関数
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchTodos = async () => {
    // ユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setTodos([]);
      return;
    }
    // user_idで絞り込む
    const { data, error } = await supabase
      .from("todos")
      .select("id, title, goal_week, goal_day, started_at, ended_at, report, break_started_at, break_ended_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleStart = async (todoId: string) => {
    setLoadingId(todoId);
    const { error } = await supabase
      .from("todos")
      .update({ started_at: new Date().toISOString(), ended_at: null })
      .eq("id", todoId);
    setLoadingId(null);
    if (error) console.error(error);
    else fetchTodos();
  };

  const handleStop = async (todoId: string) => {
    setLoadingId(todoId);
    const { error } = await supabase
      .from("todos")
      .update({ ended_at: new Date().toISOString() })
      .eq("id", todoId);
    setLoadingId(null);
    if (error) console.error(error);
    else fetchTodos();
  };

  const handleBreakStart = async (todoId: string) => {
    setLoadingId(todoId);
    const { error } = await supabase
      .from("todos")
      .update({ break_started_at: new Date().toISOString(), break_ended_at: null })
      .eq("id", todoId);
    setLoadingId(null);
    if (error) console.error(error);
    else fetchTodos();
  };

  const handleBreakEnd = async (todoId: string) => {
    setLoadingId(todoId);
    const { error } = await supabase
      .from("todos")
      .update({ break_ended_at: new Date().toISOString() })
      .eq("id", todoId);
    setLoadingId(null);
    if (error) console.error(error);
    else fetchTodos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このタスクを本当に削除しますか？")) return;
    setLoadingId(id);
    const { error } = await supabase.from("todos").delete().eq("id", id);
    setLoadingId(null);
    if (error) console.error(error);
    else fetchTodos();
  };

  return (
    <div>
      <AddTodo onAdded={fetchTodos} />

      <ul className="space-y-4">
        {currentTodos.map((t) => (
          <li
            key={t.id}
            className="border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm">今週の目標: {t.goal_week || "—"}</p>
              <p className="text-sm">今日の目標: {t.goal_day || "—"}</p>
              <p className="text-xs text-gray-500">
                {t.started_at
                  ? `開始: ${new Date(t.started_at).toLocaleTimeString()}`
                  : ""}
                {t.ended_at
                  ? ` / 終了: ${new Date(t.ended_at).toLocaleTimeString()}`
                  : ""}
                {t.break_started_at
                  ? ` / 休憩開始: ${new Date(t.break_started_at).toLocaleTimeString()}`
                  : ""}
                {t.break_ended_at
                  ? ` / 休憩終了: ${new Date(t.break_ended_at).toLocaleTimeString()}`
                  : ""}
              </p>
              {t.report && <p className="text-sm mt-1">メモ: {t.report}</p>}
            </div>

            <div className="mt-2 md:mt-0 flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
              {editingId === t.id ? (
                <EditTodo
                  todo={t}
                  onUpdated={() => {
                    setEditingId(null);
                    fetchTodos();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  {t.started_at && !t.ended_at ? (
                    <>
                      <button
                        onClick={() => handleStop(t.id)}
                        disabled={loadingId === t.id}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        {loadingId === t.id ? "停止中..." : "⏹ 停止"}
                      </button>
                      {t.break_started_at && !t.break_ended_at ? (
                        <button
                          onClick={() => handleBreakEnd(t.id)}
                          disabled={loadingId === t.id}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2 disabled:opacity-50"
                        >
                          {loadingId === t.id ? "休憩終了中..." : "⏸ 休憩終了"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBreakStart(t.id)}
                          disabled={loadingId === t.id}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2 disabled:opacity-50"
                        >
                          {loadingId === t.id ? "休憩中..." : "⏸ 休憩"}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleStart(t.id)}
                      disabled={loadingId === t.id}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {loadingId === t.id ? "開始中..." : "▶️ 開始"}
                    </button>
                  )}
                  <button
                    onClick={() => setEditingId(t.id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={loadingId === t.id}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2 disabled:opacity-50"
                  >
                    削除
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* ページネーション: 5件超えたら表示 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'} hover:bg-blue-100`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
