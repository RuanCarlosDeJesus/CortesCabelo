import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function HeaderNavigate() {
  const homeRef = useRef<HTMLAnchorElement | null>(null);
  const clientesRef = useRef<HTMLAnchorElement | null>(null);
  const historicoRef = useRef<HTMLAnchorElement | null>(null);

  const location = useLocation();

  useEffect(() => {
 
    [homeRef, clientesRef, historicoRef].forEach(ref => {
      if (ref.current) {
        ref.current.style.borderBottom = "";
      }
    });

   
    if (location.pathname === "/home" && homeRef.current) {
      homeRef.current.focus();
      homeRef.current.style.borderBottom = "2px solid yellow";
    }

    if (location.pathname === "/clientes" && clientesRef.current) {
      clientesRef.current.focus();
      clientesRef.current.style.borderBottom = "2px solid yellow";
    }

    if (location.pathname === "/historico" && historicoRef.current) {
      historicoRef.current.focus();
      historicoRef.current.style.borderBottom = "2px solid yellow";
    }
  }, [location.pathname]);

  return (
    <div className="text-white text-2xl flex w-full max-w-5xl mb-10 px-2 items-center justify-center">
      <div className="flex gap-10 md:gap-30 mt-5 border-amber-300 border p-5 rounded-xl w-full md-w-[50%] items-center justify-center font-bold">

        <Link to="/home" className="hover:text-amber-400" ref={homeRef}>
          Home
        </Link>

        <Link to="/clientes" className="hover:text-amber-400" ref={clientesRef}>
          Clientes
        </Link>

        <Link to="/historico" className="hover:text-amber-400" ref={historicoRef}>
          Histórico
        </Link>

      </div>
    </div>
  );
}
