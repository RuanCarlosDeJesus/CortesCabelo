
import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";

export function Home() {
  const [days, setDays] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [names, setNames] = useState<{ [hour: string]: any }>({});

 
  const hoursList = [
    "09:00", "10:00", "11:00", "13:00",
    "14:00", "15:00", "16:00","17:00", "18:00", "19:00", "20:00", "21:00"
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
    const ref = collection(db, "agendamentos", todayKey, "horarios");

    const unsub = onSnapshot(ref, (snap) => {
      const updated: any = {};

      snap.forEach((doc) => {
        const data = doc.data();

        updated[doc.id] = data.nome
          ? data.phone
            ? `${data.nome} - ${data.phone}`
            : data.nome
          : "Disponível";
      });

      setNames(updated);
    });

    return () => unsub();
  }, []);

 
  function openModal(hour: string) {
    setSelectedHour(hour);

    const current = names[hour];

    if (current && current !== "Disponível") {
      const parts = current.split(" - ");
      setTempName(parts[0]);
      setTempPhone(parts[1] || "");
    } else {
      setTempName("");
      setTempPhone("");
    }

    setModalOpen(true);
  }

 
  async function handleSave() {
    if (!selectedHour) return;

    const ref = doc(db, "agendamentos", todayKey, "horarios", selectedHour);

    await setDoc(ref, {
      nome: tempName.trim(),
      phone: tempPhone.trim()
    });

    setModalOpen(false);
    setSelectedHour(null);
    setTempName("");
    setTempPhone("");
  }

  return (
    <div className="h-screen w-full flex flex-col items-center p-10 text-[28px] font-bold text-white">

      <header className="w-full flex flex-col justify-center items-center">
        <h2 className="font-playfair">Área do admin</h2>
        <div className="text-white mx-10 flex gap-7 text-[20px] m-5 mt-10">
          <a href="#Histórico" className="hover:text-yellow-300">Histórico</a>
          <a href="#Horários" className="hover:text-yellow-300 font-black text-yellow-300">Horários</a>
          <a href="#Clientes" className="hover:text-yellow-300">Clientes</a>
        </div>
      </header>

      <main className="w-[80%] flex flex-col items-center mt-6">
        <table className="text-white border-collapse text-2xl w-full max-w-xl">
          <thead>
            <tr className="bg-black/40">
              <th className="border border-white p-3">Horário</th>
              <th className="border border-white p-3">{days[0]}</th>
            </tr>
          </thead>

          <tbody>
            {hoursList.map((hour) => (
              <tr key={hour} className="bg-black/20">
                <td className="border border-white p-3 font-bold text-yellow-300">
                  {hour}
                </td>

                <td
                  className="border border-white p-3 cursor-pointer hover:bg-yellow-400 hover:text-black transition"
                  onClick={() => openModal(hour)}
                >
                  {names[hour] || "Disponível"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Editar Horário</h2>
            
            <p className="text-lg font-semibold mb-2">
              {selectedHour} - {days[0]}
            </p>

            <input
              className="w-full p-2 border rounded mb-4"
              placeholder="Nome"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />

            <input
              className="w-full p-2 border rounded mb-4"
              placeholder="Telefone"
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
