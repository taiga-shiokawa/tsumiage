import { TodoList } from "../components/todos/TodoList";

const Home = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Home Page</h2>
      <TodoList />
    </div>
  );
};

export default Home;
