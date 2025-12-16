import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

type Cliente = {
  id: string;
  nome: string;
  phone: string;
  criadoEm: Timestamp;
  ordem: number;
};

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const q = collection(db, "fila");

    const unsub = onSnapshot(q, snapshot => {
      const lista: Cliente[] = snapshot.docs
        .map(d => ({
          id: d.id,
          ...(d.data() as Omit<Cliente, "id">),
        }))
        .sort((a, b) => a.ordem - b.ordem);

      setClientes(lista);
    });

    return unsub;
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#0f0f0f] text-white p-4 sm:p-10">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">
        Clientes na Fila
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {clientes.length === 0 ? (
          <div className="text-gray-400 text-center border border-dashed border-white/20 rounded-xl p-6">
            Nenhum cliente na fila
          </div>
        ) : (
          clientes.map((cliente, i) => (
            <div
              key={cliente.id}
              className="border border-yellow-500 rounded-xl p-4 bg-black text-red-400"
            >
              {i + 1} - {cliente.nome} - {cliente.phone}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Clientes;
