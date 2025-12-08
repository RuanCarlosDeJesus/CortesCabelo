import App from "../src/App";
import Login from '../src/login/login'
import Home from '../src/Home/home'
import { Error } from "../src/error/error";
import { Private } from './private';
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/login",
    element: <Login />,
  },
  {
    path:"/home",
    element: <Private><Home /></Private>,
  }, {
    path: "*",
    element: <Error />,
  },
]);

export { router };
