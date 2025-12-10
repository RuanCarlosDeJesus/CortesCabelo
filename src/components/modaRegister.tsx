
import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import {
  doc,
  setDoc,
 
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";

interface Props {
  close: () => void;
}

export default function ModalRegister({ close }: Props) {
  const [nome, setNome] = useState("");
  const [horario, setHorario] = useState("");
  const [tel, setTel] = useState("");
  const [showHorarios, setShowHorarios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const todayKey = new Date().toISOString().split("T")[0];


  useEffect(() => {
    async function load() {
      const colRef = collection(db, "agendamentos", todayKey, "horarios");
      const snap = await getDocs(colRef);

      const ocupados: string[] = [];
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.nome && data.nome !== "Disponível") {
          ocupados.push(doc.id);
        }
      });

      setHorariosOcupados(ocupados);
    }
    load();
  }, []);

  function validatePhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 8;
  }

  async function handleConfirm() {
    if (!nome.trim() || !horario || !tel.trim()) {
      alert("Preencha nome, telefone e escolha um horário.");
      return;
    }

    if (!validatePhone(tel)) {
      alert("Telefone inválido. Digite ao menos 8 dígitos.");
      return;
    }

    if (horariosOcupados.includes(horario)) {
      alert("Este horário já está preenchido!");
      return;
    }

    setLoading(true);

    try {
      const ref = doc(db, "agendamentos", todayKey, "horarios", horario);

      await setDoc(ref, {
        nome: nome.trim(),
        phone: tel.trim(),
        criadoEm: serverTimestamp(),
      });

      alert("Agendamento salvo com sucesso!");
      close();

      setNome("");
      setTel("");
      setHorario("");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-40">
        <div className="w-full max-w-md bg-black rounded-2xl border border-[#d4af37] p-6 flex flex-col gap-6">

          <button onClick={close} className="justify-end flex items-center h-8">
            <i className="bi bi-x text-3xl text-white border-2 border-red-500 rounded-xl cursor-pointer" />
          </button>

          <h2 className="text-2xl font-bold text-yellow-500 text-center">
            Faça seu Registro!
          </h2>

          <div className="flex flex-col gap-3">
            <label className="text-yellow-500 font-semibold">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white"
              placeholder="Nome completo"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-yellow-500 font-semibold">Celular</label>
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white"
              placeholder="(21) 9xxxx-xxxx"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-yellow-500 font-semibold">Horário</label>
            <button
              onClick={() => setShowHorarios(true)}
              className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white text-left"
            >
              {horario || "Selecione um horário"}
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl bg-black border border-yellow-600/60 text-yellow-500 font-semibold hover:bg-yellow-600 hover:text-black transition"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>

      {showHorarios && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
          <div className="w-full max-w-md bg-black rounded-2xl border border-yellow-600 p-6 flex flex-col gap-4">
            <h2 className="text-yellow-500 text-xl font-bold text-center">
              Escolha um horário
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {hours.map((h) => {
                const ocupado = horariosOcupados.includes(h);

                return (
                  <button
                    key={h}
                    onClick={() => {
                      if (!ocupado) {
                        setHorario(h);
                        setShowHorarios(false);
                      }
                    }}
                    disabled={ocupado}
                    className={`rounded-lg py-2 transition border
                      ${
                        ocupado
                          ? "bg-red-700 border-red-500 text-red-300 cursor-not-allowed"
                          : "bg-green-600/40 border-green-500 text-green-300 hover:bg-green-600"
                      }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowHorarios(false)}
              className="mt-4 bg-black border border-yellow-600 text-yellow-500 rounded-xl py-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
