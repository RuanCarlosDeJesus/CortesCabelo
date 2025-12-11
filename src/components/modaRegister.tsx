import { useEffect, useState } from "react";
import { db } from "../services/firebaseConnect";
import { doc, setDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";

interface Props {
  close: () => void;
  onSave: () => void;
}

export default function ModalRegister({ close, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [barbeiro, setBarbeiro] = useState<"caua" | "Thiago" | "">("");
  const [horario, setHorario] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [showHorarios, setShowHorarios] = useState(false);
  const [loading, setLoading] = useState(false);

  const hours = ["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!barbeiro) return;

    const load = async () => {
      try {
        const refAgenda = doc(db, "profissionais", barbeiro, "agendas", todayKey);
        const colRef = collection(refAgenda, "horarios");
        const snap = await getDocs(colRef);
        const ocupados: string[] = [];

        snap.forEach(doc => {
          const data = doc.data();
          if (data.nome && data.nome !== "Disponível") ocupados.push(doc.id);
        });

        setHorariosOcupados(ocupados);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [barbeiro, todayKey]);

  function validatePhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 8;
  }

  async function handleConfirm() {
    if (!nome.trim() || !tel.trim() || !horario || !barbeiro) {
      alert("Preencha todos os campos e selecione barbeiro e horário.");
      return;
    }

    if (!validatePhone(tel)) {
      alert("Telefone inválido. Digite ao menos 8 dígitos.");
      return;
    }

    if (horariosOcupados.includes(horario)) {
      alert("Horário já ocupado.");
      return;
    }

    setLoading(true);

    const ref = doc(
      db,
      "profissionais",
      barbeiro,
      "agendas",
      todayKey,
      "horarios",
      horario
    );

    let salvou = false;

    try {
      await setDoc(
        ref,
        {
          nome: nome.trim(),
          phone: tel.trim(),
          criadoEm: serverTimestamp()
        },
        { merge: true }
      );

      salvou = true;
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar agendamento. Verifique barbeiro e horário.");
      return;
    } finally {
      setLoading(false);
    }

    if (salvou) {
      alert("Agendamento salvo com sucesso!");
      onSave();
      close();
      setNome("");
      setTel("");
      setHorario("");
      setBarbeiro("");
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-40">
        <div className="w-full max-w-md bg-black rounded-2xl border border-yellow-500 p-6 flex flex-col gap-6">
          <button onClick={close} className="justify-end flex items-center h-8">
            <i className="bi bi-x text-3xl text-white border-2 border-red-500 rounded-xl cursor-pointer" />
          </button>

          <h2 className="text-2xl font-bold text-yellow-500 text-center">Agendar Horário</h2>

          <div className="flex gap-4 justify-center">
            <label
              className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border p-4 cursor-pointer transition ${
                barbeiro === "caua"
                  ? "bg-yellow-500 border-yellow-400 text-black shadow-lg"
                  : "bg-black border-yellow-500 text-white"
              }`}
            >
              Cauã
              <input
                type="radio"
                className="hidden"
                value="caua"
                checked={barbeiro === "caua"}
                onChange={() => setBarbeiro("caua")}
              />
            </label>

            <label
              className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border p-4 cursor-pointer transition ${
                barbeiro === "Thiago"
                  ? "bg-yellow-500 border-yellow-400 text-black shadow-lg"
                  : "bg-black border-yellow-500 text-white"
              }`}
            >
              Thiago
              <input
                type="radio"
                className="hidden"
                value="Thiago"
                checked={barbeiro === "Thiago"}
                onChange={() => setBarbeiro("Thiago")}
              />
            </label>
          </div>

          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome"
            className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white"
          />

          <input
            type="tel"
            value={tel}
            onChange={e => setTel(e.target.value)}
            placeholder="Telefone"
            className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white"
          />

          <button
            onClick={() => setShowHorarios(true)}
            className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white text-left"
          >
            {horario || "Escolha um horário"}
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>

      {showHorarios && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
          <div className="w-full max-w-md bg-black rounded-2xl border border-yellow-600 p-6 flex flex-col gap-4">
            <h2 className="text-yellow-500 text-xl font-bold text-center">Escolha um horário</h2>

            <div className="grid grid-cols-3 gap-3">
              {hours.map(h => {
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
                    className={`rounded-lg py-2 transition border ${
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
