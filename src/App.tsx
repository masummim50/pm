import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./app/components/LandingPage";
import SignUp from "./app/components/auth/SignUpTailwind";
import Login from "./app/components/auth/LoginTailwind";
import Profile from "./app/components/profile/ProfileTailwind";
import OtherLayout from "./app/components/OtherLayoutTailwind";
import PrivateRoute from "./PrivateRoute";
import { jwtDecode } from "jwt-decode";
import { setUser } from "./app/redux/features/user/userSlice";
import { useAppDispatch } from "./app/redux/hooks";
import Todos from "./app/components/todo/Todos";
import Home from "./Home";
import Projects from "./app/components/Projects";
import CreateProject from "./app/components/project/CreateProject";
import PersonalProjectHome from "./app/components/project/PersonalProjectHome";
import TeamProjectHome from "./app/components/project/TeamProjectHome";
import Journal from "./app/components/Journal";
import JournalHome from "./app/components/journal/JournalHome";
import TestingPage from "./app/components/TestingPage";
import ProjectDetailsTab from "./app/components/project/ProjectDetailsTab";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <OtherLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "", element: <Home /> },
        { path: "test", element: <TestingPage /> },
        { path: "profile", element: <Profile /> },
        { path: "todos", element: <Todos /> },
        {
          path: "personalprojects",
          element: <Projects />,
          children: [
            { path: "", element: <PersonalProjectHome /> },
            {
              path: "createnew",
              element: <CreateProject />,
            },
            { path: ":id", element: <ProjectDetailsTab /> },
          ],
        },
        {
          path: "teamprojects",
          element: <Projects />,
          children: [
            { path: "", element: <TeamProjectHome /> },
            {
              path: "createnew",
              element: <CreateProject />,
            },
            { path: ":id", element: <ProjectDetailsTab /> },
          ],
        },
        {
          path: "journal",
          element: <Journal />,
          children: [
            { path: "", element: <JournalHome /> }
          ]
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ]);

  const dispatch = useAppDispatch();
  const token = localStorage.getItem("project-m-token");
  if (token) {
    const present = new Date().getTime() / 1000;
    const decoded: { _id: string, name: string; email: string; exp: number; iat: number } =
      jwtDecode(token);
    if (decoded?.exp > present) {
      dispatch(
        setUser({ id: decoded?._id, name: decoded?.name, email: decoded?.email, token: token })
      );
    }
  }
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
