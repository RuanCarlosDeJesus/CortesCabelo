import { useState } from "react";

export const ModalRegister = ({ close }: { close: () => void }) => {
  const [nome, setNome] = useState("");
  const [horario, setHorario] = useState("");
  const [tel, setTel] = useState("");
  const [showHorarios, setShowHorarios] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [showMensagem, setShowMensagem] = useState(false);

  function handleConfirm() {
    if (!nome || !horario || !tel) {
      setMensagem("Por favor, preencha todos os campos.");
      setShowMensagem(true);
      return;
    }

    setMensagem(`Registro confirmado!\nNome: ${nome}\nHorário: ${horario}`);
    setShowMensagem(true);
  }

  return (
    <>
      {/* MODAL */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-40">
        <div className="w-full max-w-md bg-black rounded-2xl border border-[#d4af37] p-6 flex flex-col gap-6">

          {/* BOTÃO FECHAR */}
          <button onClick={close} className="justify-end flex items-center h-8">
            <i className="bi bi-x text-3xl text-white border-2 border-red-500 rounded-xl cursor-pointer"></i>
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
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-yellow-500 font-semibold">Celular:</label>
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="bg-black border border-yellow-600/50 rounded-xl h-12 px-3 text-white"
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

          {/* BOTÃO CONFIRMAR */}
          <button
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl bg-black border border-yellow-600/60 text-yellow-500 font-semibold hover:bg-yellow-600 hover:text-black transition"
          >
            Confirmar
          </button>

        </div>
      </div>

      {/* ABA DE HORÁRIOS */}
      {showHorarios && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
          <div className="w-full max-w-md bg-black rounded-2xl border border-yellow-600 p-6 flex flex-col gap-4">
            <h2 className="text-yellow-500 text-xl font-bold text-center">Escolha um horário</h2>

            <div className="grid grid-cols-3 gap-3">
              {["09:00", "10:00", "11:00", "13:00"].map((h) => (
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

      {/* ALERTA */}
      {showMensagem && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-black border border-yellow-500 rounded-xl p-6 w-80 text-center">
            <p className="text-yellow-500 font-semibold whitespace-pre-line">
              {mensagem}
            </p>
            <button
              className="mt-4 bg-yellow-600 text-black font-bold py-2 px-4 rounded-xl w-full"
              onClick={() => {
                setShowMensagem(false);
                close();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default ModalRegister;