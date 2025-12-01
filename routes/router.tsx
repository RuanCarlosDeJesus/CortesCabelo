import App from "../src/App";
import {Login} from '../src/login/login'
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/login",
    element: <Login />,
  }
]);

export { router };
