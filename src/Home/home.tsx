import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import { doc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import ModalRegister from "../components/modaRegister";
import HeaderNavigate from "../components/headerNavigate";
export function Home() {
  const [profile, setProfile] = useState<"caua" | "Thiago">("caua");
  const [days, setDays] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [names, setNames] = useState<{ [hour: string]: string }>({});

  const hoursList = [
    "09:00","10:00","11:00","13:00","14:00",
    "15:00","16:00","17:00","18:00","19:00",
    "20:00","21:00"
  ];

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const dList: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dList.push(d.toLocaleDateString("pt-BR", { weekday: "short" }));
    }
    setDays(dList);
  }, []);

  useEffect(() => {
    const ref = collection(db, "profissionais", profile, "agendas", todayKey, "horarios");
    const unsub = onSnapshot(ref, snap => {
      const updated: { [hour: string]: string } = {};
      hoursList.forEach(h => updated[h] = "Disponível");
      snap.forEach(doc => {
        const data = doc.data();
        const hour = doc.id;
        if (hoursList.includes(hour)) {
          updated[hour] = data.nome ? (data.phone ? `${data.nome} - ${data.phone}` : data.nome) : "Disponível";
        }
      });
      setNames(updated);
    });
    return () => unsub();
  }, [profile, todayKey]);

  async function handleDelete(hour: string) {
    if (!names[hour] || names[hour] === "Disponível") return;
    const confirmDel = window.confirm("Remover agendamento?");
    if (!confirmDel) return;
    const ref = doc(db, "profissionais", profile, "agendas", todayKey, "horarios", hour);
    await deleteDoc(ref);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0f0f0f] text-white p-4 sm:p-10">
           <HeaderNavigate />
      <div className="mb-6 flex gap-4">
        
        <div
          className={`px-4 py-2 rounded-xl font-semibold cursor-pointer text-sm sm:text-base ${profile==="caua"?"bg-yellow-500 text-black":"bg-white/20"}`}
          onClick={()=>setProfile("caua")}
        >
          Cauã
        </div>

        <div
          className={`px-4 py-2 rounded-xl font-semibold cursor-pointer text-sm sm:text-base ${profile==="Thiago"?"bg-yellow-500 text-black":"bg-white/20"}`}
          onClick={()=>setProfile("Thiago")}
        >
          Thiago
        </div>
      </div>

      <header className="w-full max-w-4xl text-center mb-10 px-2">
        <h2 className="text-2xl sm:text-4xl font-semibold mb-4">
          Painel Administrativo – {profile === "caua" ? "Cauã" : "Thiago"}
        </h2>
      </header>

      <main className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-3 sm:p-6 rounded-xl shadow-2xl overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm sm:text-lg min-w-[500px]">
          <thead>
            <tr className="bg-white/10">
              <th className="p-3 sm:p-4 border-b border-white/20 text-left">Horário</th>
              <th className="p-3 sm:p-4 border-b border-white/20 text-left">{days[0]}</th>
              <th className="p-3 sm:p-4 border-b border-white/20 text-left">Remove</th>
            </tr>
          </thead>

          <tbody>
            {hoursList.map(hour => (
              <tr key={hour} className="hover:bg-white/5 transition">
                <td className="p-3 sm:p-4 border-b border-white/10 text-yellow-400 font-semibold">
                  {hour}
                </td>

                <td className={`p-3 sm:p-4 border-b border-white/10 ${names[hour]==="Disponível"?"text-green-400":"text-red-400 font-semibold"}`}>
                  {names[hour]}
                </td>

                <td className="p-3 sm:p-4 border-b border-white/10">
                  {names[hour] !== "Disponível" && (
                    <button
                      onClick={() => handleDelete(hour)}
                      className="bg-red-600 px-2 py-1 rounded cursor-pointer text-xs sm:text-base"
                    >
                      Remover
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-blue-500 cursor-pointer font-semibold hover:bg-yellow-600 transition text-sm sm:text-base"
      >
        Editar Cliente
      </button>

      {modalOpen && (
        <ModalRegister close={() => setModalOpen(false)} onSave={() => setModalOpen(false)} />
      )}
    </div>
  );
}

export default Home;
