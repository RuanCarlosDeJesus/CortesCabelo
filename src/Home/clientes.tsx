import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import { collection, doc, onSnapshot, Timestamp } from "firebase/firestore";

type Cliente = {
  id: string;
  nome: string;
  phone: string;
  criadoEm: Timestamp;
  ordem: number;
};

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [aberta, setAberta] = useState<boolean>(true);

  useEffect(() => {
    const statusRef = doc(db, "config", "status");
    const unsubStatus = onSnapshot(statusRef, snap => {
      if (snap.exists()) {
        setAberta(snap.data().aberta);
      }
    });

    const filaRef = collection(db, "fila");
    const unsubFila = onSnapshot(filaRef, snapshot => {
      const lista: Cliente[] = snapshot.docs
        .map(d => ({
          id: d.id,
          ...(d.data() as Omit<Cliente, "id">),
        }))
        .sort((a, b) => a.ordem - b.ordem);

      setClientes(lista);
    });

    return () => {
      unsubStatus();
      unsubFila();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#0f0f0f] text-white p-10">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">
        Clientes na Fila
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {!aberta ? (
          <div className="text-red-500 text-center border border-dashed border-red-500/40 rounded-xl p-6 font-bold text-lg">
            A barbearia está fechada
          </div>
        ) : clientes.length === 0 ? (
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
