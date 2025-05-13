import { TodoList } from "../components/todos/TodoList";
import RequireAuth from "../components/layout/RequireAuth";

const Home = () => {
  return (
    <RequireAuth>
      <div>
        <h2 className="text-2xl font-bold mb-4">Home Page</h2>
        <TodoList />
      </div>
    </RequireAuth>
  );
};

export default Home;
