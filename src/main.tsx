import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "./app/components/Login.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Provider } from "react-redux";
import { store } from "./app/redux/store.ts";
// import Todos from "./app/components/Todos.tsx";
// import Profile from "./app/components/Profile.tsx";
// import PersonalProjects from "./app/components/PersonalProjects.tsx";
// import PrivateProject from "./app/components/PrivateProject.tsx";
// import OtherLayout from "./app/components/OtherLayout.tsx";
// import Register from "./app/components/Register.tsx";
// import SignUp from "./app/components/SignUp.tsx";
// import { useAppSelector } from "./app/redux/hooks.ts";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "/",
//         element:  <OtherLayout />,
//         children: [
//           { path: "/", element: <Profile /> },
//           { path: "/todos", element: <Todos /> },
//           { path: "/personalProjects", element: <PersonalProjects /> },
//           { path: "/privateProjects", element: <PrivateProject /> },
//         ],
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path:'/signup',
//     element: <SignUp/>
//   }
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>
);
