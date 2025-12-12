import App from "../src/App";
import Login from '../src/login/login'
import Home from '../src/Home/home'
import { Error } from "../src/error/error";
import { Private } from './private';
import { Clientes } from "../src/Home/clientes";
import { Historico } from "../src/Home/historico";
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
  },{

  },
  {
path:"/clientes",
element:<Private><Clientes /></Private>,

  },
  {
path:"/historico",
element:<Private><Historico /></Private>,
  },

   {
    path: "*",
    element: <Error />,
  },
]);

export { router };
