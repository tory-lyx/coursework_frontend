import { useState } from "react";
import { loginRequest } from "../api/auth";

type Props = {
  onLogin: (token: string) => void;
};

function LoginPage({ onLogin }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try {
      const data = await loginRequest(login, password);

      onLogin(data.token);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="centered">
      <h2>Вхід</h2>

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

      <button onClick={handleSubmit}>Увійти</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LoginPage;