// src/components/ModalRegister.tsx
import { useState } from "react";
import { db } from "../services/firebaseConnect";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
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

  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const todayKey = new Date().toISOString().split("T")[0];

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

    setLoading(true);

    try {
      const ref = doc(db, "agendamentos", todayKey, "horarios", horario);

      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        if (data && data.nome && data.nome !== "Disponível") {
          const existing = `${data.nome}${data.phone ? " - " + data.phone : ""}`;
          const ok = confirm(
            `Este horário já está preenchido:\n${existing}\n\nDeseja substituir?`
          );

          if (!ok) {
            setLoading(false);
            return;
          }
        }
      }

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
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setHorario(h);
                    setShowHorarios(false);
                  }}
                  className="bg-green-600/40 border border-green-500 text-green-300 rounded-lg py-2 hover:bg-green-600 transition"
                >
                  {h}
                </button>
              ))}
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
