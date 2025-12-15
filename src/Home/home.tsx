import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import ModalRegister from "../components/modaRegister";
import HeaderNavigate from "../components/headerNavigate";

export function Home() {
  const [profile, setProfile] = useState<"caua" | "Thiago">("caua");
  const [modalOpen, setModalOpen] = useState(false);
  const [names, setNames] = useState<{ [key: number]: string }>({});

  const queueSize = 12;

  useEffect(() => {
    const q = query(
      collection(db, "profissionais", profile, "fila"),
      orderBy("criadoEm", "asc")
    );

    const unsub = onSnapshot(q, snap => {
      const updated: { [key: number]: string } = {};

      for (let i = 1; i <= queueSize; i++) {
        updated[i] = "Disponível";
      }

      snap.docs.forEach((docSnap, index) => {
        if (index < queueSize) {
          const data = docSnap.data();
          updated[index + 1] = data.phone
            ? `${data.nome} - ${data.phone}`
            : data.nome;
        }
      });

      setNames(updated);
    });

    return unsub;
  }, [profile]);

  async function handleDelete(position: number) {
    const q = query(
      collection(db, "profissionais", profile, "fila"),
      orderBy("criadoEm", "asc")
    );

    const snap = await new Promise<any>(resolve =>
      onSnapshot(q, s => resolve(s))
    );

    const docToDelete = snap.docs[position - 1];
    if (!docToDelete) return;

    await deleteDoc(
      doc(db, "profissionais", profile, "fila", docToDelete.id)
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0f0f0f] text-white p-4 sm:p-10">
      <HeaderNavigate />

      <div className="mb-6 flex gap-4">
        <div
          onClick={() => setProfile("caua")}
          className={`px-4 py-2 rounded-xl font-semibold cursor-pointer ${
            profile === "caua"
              ? "bg-yellow-500 text-black"
              : "bg-white/20"
          }`}
        >
          Cauã
        </div>

        <div
          onClick={() => setProfile("Thiago")}
          className={`px-4 py-2 rounded-xl font-semibold cursor-pointer ${
            profile === "Thiago"
              ? "bg-yellow-500 text-black"
              : "bg-white/20"
          }`}
        >
          Thiago
        </div>
      </div>

      <header className="w-full max-w-4xl text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-semibold">
          Painel Administrativo – {profile === "caua" ? "Cauã" : "Thiago"}
        </h2>
      </header>

      <main className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl">
        <table className="w-full text-sm sm:text-lg">
          <thead>
            <tr className="bg-white/10">
              <th className="p-4 text-left">Ordem</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Remover</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: queueSize }, (_, i) => {
              const pos = i + 1;
              const status = names[pos];

              return (
                <tr key={pos} className="hover:bg-white/5">
                  <td className="p-4 font-semibold text-yellow-400">
                    {pos}
                  </td>

                  <td
                    className={`p-4 ${
                      status === "Disponível"
                        ? "text-green-400"
                        : "text-red-400 font-semibold"
                    }`}
                  >
                    {status}
                  </td>

                  <td className="p-4">
                    {status !== "Disponível" && (
                      <button
                        onClick={() => handleDelete(pos)}
                        className="bg-red-600 px-3 py-1 rounded"
                      >
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-6 px-6 py-3 rounded-xl bg-blue-500 font-semibold hover:bg-yellow-600"
      >
        Editar Cliente
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
