import { useState } from "react";
import { registerRequest } from "../api/auth";

function RegisterPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setMessage("");

    try {
      await registerRequest(login, password);
      setMessage("Реєстрація успішна! Увійдіть у систему.")
      setLogin("");
      setPassword("");
      } catch (e: any) {
        setError(e.message);
      };
  };

  return (
    <div className="centered">
      <h2>Реєстрація</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Логін"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Зареєструватися</button>
      
    </div>
  );
}

export default RegisterPage;