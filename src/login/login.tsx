import React, { useState } from "react";
import { signIn } from "../services/auth";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/home");
     
    } catch (err: any) {
      alert(err.message || "Erro ao logar");
    } 
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-black/80 rounded-xl">
        <h2 className="text-2xl text-yellow-400 font-bold mb-4 text-center">Login</h2>

        <label className="block mb-2 text-yellow-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-md bg-black border border-yellow-600 text-white mb-4"
          required
        />

        <label className="block mb-2 text-yellow-300">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-black border border-yellow-600 text-white mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
