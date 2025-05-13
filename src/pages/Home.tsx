import { TodoList } from "../components/todos/TodoList";
import RequireAuth from "../components/layout/RequireAuth";
import { Report } from "../components/report/Report";
import { useState } from "react";

const Home = () => {
  const [reportRefreshKey, setReportRefreshKey] = useState(0);
  const handleTodoChanged = () => setReportRefreshKey((k) => k + 1);

  return (
    <RequireAuth>
      <div>
        <h2 className="text-2xl font-bold mb-4">ツミアゲを追加</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <TodoList onChanged={handleTodoChanged} />
          </div>
          <div className="w-full md:w-1/2">
            <Report showTodayOnly refreshKey={reportRefreshKey} />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Home;
