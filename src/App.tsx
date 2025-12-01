import LogoBlack from "../public/logoBlack.png";

import cortesData from ".././cortesData.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Corte {
  id: number;
  nome: string;
  preco: number;
  caminhoArquivo: string;
}

const cortes: Corte[] = cortesData;

export function App() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((prev) => (prev + 1) % cortes.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + cortes.length) % cortes.length);

  const navigate = useNavigate();
  return (
    <div className=" h-screen w-full flex flex-col items-center p-2  text-white">
      <header className="w-[70%] flex flex-col  justify-center items-center py-8 gap-4">
        <img
          src={LogoBlack}
          alt="Logo"
          className="w-full md:w-[50%] "
        />

        <div className="w-full md:w-[40%] text-center md:text-left order-2 md:order-1">
          <h2 className="text-4xl sm:text-5xl font-bold py-1.5 mb-3 font-cormorant">
            Transforme seu visual com estilo!
          </h2>

          <p className="text-lg sm:text-2xl font-playfair mb-6">
            Cortes modernos, clássicos e sob medida para você.
          </p>

          <button
            className="bg-black text-white border border-[#d4af37] text-xl px-6 py-2 font-playfair rounded-xl font-bold hover:bg-[#d4af37] hover:text-black transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Saíba mais!
          </button>
        </div>
      </header>

      <main className="w-[80%] justify-center items-center flex flex-col m-2.5">
        <section className="relative flex flex-col items-center">
  <h2 className="text-4xl sm:text-5xl font-bold py-1.5 mb-6 font-cormorant">
    Catálogo
  </h2>

  
  <div className="relative flex items-center justify-center w-full">

    <button
      onClick={prev}
      className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white px-4 py-2 rounded-full cursor-pointer z-20"
    >
      <i className="bi bi-arrow-left"></i>
    </button>

    <div className="flex gap-8 overflow-hidden py-4">
      {[0, 1, 2].map((i) => {
        const pos = (index + i) % cortes.length;
        return (
          <img
            key={pos}
            src={cortes[pos].caminhoArquivo}
            alt={cortes[pos].nome}
            className="
              w-[300px] h-[300px]
              rounded-xl object-cover
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:border-5 hover:border-[#C4A052]
              cursor-pointer overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar
            "
          />
        );
      })}
    </div>

    <button
      onClick={next}
      className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white px-4 py-2 rounded-full cursor-pointer z-20"
    >
      <i className="bi bi-arrow-right"></i>
    </button>

  </div>
</section>

      </main>


      <section className="w-full flex flex-col items-center px-6 py-14">

  {/* Título Contatos */}
  <h3 className="text-4xl sm:text-5xl font-bold font-cormorant mb-4 text-center">
    Contatos
  </h3>

  {/* Lista */}
  <ul className="text-center sm:text-left text-2xl md:text-3xl flex flex-col gap-3 mb-10">
    <li className="flex items-center gap-3 justify-center sm:justify-start">
      <span>Instagram:</span>
      <i className="bi bi-instagram text-pink-600 text-3xl"></i>
    </li>
    <li className="flex items-center gap-3 justify-center sm:justify-start">
      <span>Whatsapp:</span>
      <i className="bi bi-whatsapp text-green-500 text-3xl"></i>
    </li>
  </ul>

  {/* Localização */}
  <div className="flex flex-col items-center w-full max-w-4xl gap-4">
    <h3 className="text-4xl sm:text-5xl font-bold font-cormorant text-center">
      Localização
    </h3>

    <p className="text-xl sm:text-2xl text-center">
      Av. Chrisóstomo Pimentel de Oliveira, 1110 - Pavuna
    </p>

    <iframe
      className="w-full h-[280px] sm:h-[350px] md:h-[420px] rounded-2xl shadow-xl border border-neutral-300"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d919.4002605799227!2d-43.38998593035901!3d-22.81724236254863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9963f50c501967%3A0x5ed76c35be2d2ca2!2sAv.%20Chris%C3%B3stomo%20Pimentel%20de%20Oliveira%2C%201110%20-%20Pavuna%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2021645-522!5e0!3m2!1spt-BR!2sbr!4v1764365433913!5m2!1spt-BR!2sbr"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</section>


      <footer></footer>
    </div>
  );
}

export default App;
