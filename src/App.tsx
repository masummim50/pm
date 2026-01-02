import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./app/components/SignUp";
import Login from "./app/components/Login";
import Profile from "./app/components/Profile";
import OtherLayout from "./app/components/OtherLayout";
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
      element: (
        <PrivateRoute>
          <OtherLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/test", element: <TestingPage /> },
        { path: "/dashboard", element: <Profile /> },
        { path: "/todos", element: <Todos /> },
        {
          path: "/personalprojects",
          element: <Projects />,
          children: [
            { path: "/personalprojects", element: <PersonalProjectHome /> },
            {
              path: "/personalprojects/createnew",
              element: <CreateProject />,
            },
            { path: "/personalprojects/:id", element: <ProjectDetailsTab /> },
          ],
        },
        {
          path: "/teamprojects",
          element: <Projects />,
          children: [
            { path: "/teamprojects", element: <TeamProjectHome /> },
            {
              path: "/teamprojects/createnew",
              element: <CreateProject />,
            },
            { path: "/teamprojects/:id", element: <ProjectDetailsTab /> },
          ],
        },
        {
          path:'/journal',
          element: <Journal/>,
          children:[
            {path:'/journal', element:<JournalHome/>}
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
    const decoded: {_id:string, name: string; email: string; exp: number; iat: number } =
      jwtDecode(token);
    if (decoded?.exp > present) {
      dispatch(
        setUser({id:decoded?._id, name: decoded?.name, email: decoded?.email, token: token })
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
