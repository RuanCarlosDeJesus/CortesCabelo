import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ModalRegister from "../components/modaRegister";

type Cliente = {
  id: string;
  nome: string;
  phone: string;
  criadoEm: any;
  ordem: number;
};

export function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [aberta, setAberta] = useState<boolean>(true);

  const queueSize = 12;

  // 🔹 Listener da fila
  useEffect(() => {
    const q = query(collection(db, "fila"), orderBy("ordem", "asc"));
    const unsub = onSnapshot(q, snap => {
      const lista: Cliente[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Cliente, "id">),
      }));
      setClientes(lista);
    });

    return unsub;
  }, []);

  // 🔹 Listener do status da barbearia
  useEffect(() => {
    const ref = doc(db, "config", "status");

    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setAberta(snap.data().aberta);
      }
    });

    return unsub;
  }, []);

  async function toggleBarbearia() {
    const ref = doc(db, "config", "status");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, { aberta: true });
      setAberta(true);
      return;
    }

    await updateDoc(ref, {
      aberta: !aberta,
    });
  }

  async function handleDelete(index: number) {
    const cliente = clientes[index];
    if (!cliente) return;
    await deleteDoc(doc(db, "fila", cliente.id));
  }

  async function onDragEnd(result: any) {
    if (!result.destination) return;

    const items = Array.from(clientes);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setClientes(items);

    await Promise.all(
      items.map((c, index) =>
        updateDoc(doc(db, "fila", c.id), { ordem: index + 1 })
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 flex flex-col items-center">
      <header className="mt-6 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Área de Edição do Admin</h1>

        <button
          onClick={toggleBarbearia}
          className={`px-6 py-2 rounded-xl font-bold transition cursor-pointer ${
            aberta ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {aberta ? "Barbearia Aberta" : "Barbearia Fechada"}
        </button>
      </header>

      <h2 className="text-3xl font-semibold my-6">Fila Única (Admin)</h2>

      <main className="w-full max-w-3xl bg-white/10 p-6 rounded-xl">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fila">
            {provided => (
              <table
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full"
              >
                <thead>
                  <tr>
                    <th className="text-left p-3">Ordem</th>
                    <th className="text-left p-3">Cliente</th>
                    <th className="p-3">Remover</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: queueSize }).map((_, i) => {
                    const cliente = clientes[i];

                    if (!cliente) {
                      return (
                        <tr key={i}>
                          <td className="p-3 text-yellow-400">{i + 1}</td>
                          <td className="p-3 text-green-400">Disponível</td>
                          <td className="p-3"></td>
                        </tr>
                      );
                    }

                    return (
                      <Draggable draggableId={cliente.id} index={i} key={cliente.id}>
                        {provided => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td className="p-3 text-yellow-400">{i + 1}</td>
                            <td className="p-3 text-red-400">
                              {cliente.nome} - {cliente.phone}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDelete(i)}
                                className="bg-red-600 px-3 py-1 rounded"
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-6 px-6 py-3 rounded-xl bg-blue-500 hover:bg-yellow-600"
      >
        Adicionar Cliente
      </button>

      {modalOpen && (
        <ModalRegister
          close={() => setModalOpen(false)}
          onSave={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
