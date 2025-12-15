import HeaderNavigate from "../components/headerNavigate";
import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

type Barbeiro = "caua" | "Thiago";

type Cliente = {
  id: string;
  nome: string;
  phone: string;
  criadoEm: Timestamp;
};

export function Clientes() {
  const [barbeiro, setBarbeiro] = useState<Barbeiro>("caua");
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const doisDiasAtras = Timestamp.fromDate(
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    );

    const ref = collection(db, "profissionais", barbeiro, "fila");
    const q = query(ref, where("criadoEm", ">=", doisDiasAtras));

    const unsub = onSnapshot(q, snapshot => {
      const lista: Cliente[] = [];

      snapshot.docs.forEach(d => {
        const data = d.data() as Omit<Cliente, "id">;

        if (data.criadoEm?.toDate() < doisDiasAtras.toDate()) {
          deleteDoc(doc(db, "profissionais", barbeiro, "fila", d.id));
          return;
        }

        lista.push({
          id: d.id,
          nome: data.nome,
          phone: data.phone,
          criadoEm: data.criadoEm,
        });
      });

      setClientes(lista);
    });

    return () => unsub();
  }, [barbeiro]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0f0f0f] text-white p-4 sm:p-10">
      <HeaderNavigate />

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setBarbeiro("caua")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            barbeiro === "caua"
              ? "bg-yellow-500 text-black"
              : "bg-white/20"
          }`}
        >
          Cauã
        </button>

        <button
          onClick={() => setBarbeiro("Thiago")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            barbeiro === "Thiago"
              ? "bg-yellow-500 text-black"
              : "bg-white/20"
          }`}
        >
          Thiago
        </button>
      </div>

      <h1 className="text-2xl font-bold text-yellow-500 mb-6">
        Clientes (últimos 2 dias)
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {clientes.length === 0 && (
          <p className="text-gray-400 text-center">
            Nenhum cliente nos últimos 2 dias.
          </p>
        )}

        {clientes.map(c => (
          <div
            key={c.id}
            className="border border-yellow-500 rounded-xl p-4 bg-black"
          >
            <p className="font-semibold">{c.nome}</p>
            <p className="text-gray-300">{c.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clientes;
