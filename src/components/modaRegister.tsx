import { useState, useRef, useEffect } from "react";
import { db } from "../services/firebaseConnect";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Props = {
  close: () => void;
  onSave: () => void;
};

export default function ModalRegister({ close, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nomeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    nomeRef.current?.focus();
  }, []);

  function validatePhone(phone: string) {
    return phone.replace(/\D/g, "").length >= 8;
  }

  function canSubmit() {
    return nome.trim().length > 0 && tel.trim().length > 0 && validatePhone(tel) && !loading;
  }

  async function handleConfirm() {
    if (!canSubmit()) {
      setError("Preencha todos os campos corretamente.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      
      await addDoc(collection(db, "fila"), {
        nome: nome.trim(),
        phone: tel.trim(),
        criadoEm: serverTimestamp(),
        ordem: 9999, 
      });

      onSave();
      close();
      setNome("");
      setTel("");
    } catch {
      setError("Erro ao salvar cliente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
      <div className="w-full max-w-md bg-black rounded-2xl border border-yellow-500 p-6 flex flex-col gap-5">
        <button onClick={close} className="flex justify-end">
          <span className="text-3xl text-white cursor-pointer">×</span>
        </button>

        <h2 className="text-2xl font-bold text-yellow-500 text-center">
          Registrar Cliente
        </h2>

        <input
          ref={nomeRef}
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do cliente"
          className="h-12 rounded-xl px-3 bg-black border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          value={tel}
          onChange={e => setTel(e.target.value)}
          placeholder="Telefone"
          className="h-12 rounded-xl px-3 bg-black border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <button
          onClick={handleConfirm}
          disabled={!canSubmit()}
          className={`h-12 rounded-xl font-bold transition ${
            canSubmit()
              ? "bg-yellow-500 text-black hover:bg-yellow-600"
              : "bg-yellow-500/40 text-black/60 cursor-not-allowed"
          }`}
        >
          {loading ? "Salvando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
}
