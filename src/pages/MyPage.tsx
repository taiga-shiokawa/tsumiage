import { Report } from "../components/report/Report";
import RequireAuth from "../components/layout/RequireAuth";

const MyPage = () => {

  return (
    <RequireAuth>
      <div>
        <Report />
      </div>
    </RequireAuth>
  );
};

export default MyPage;
