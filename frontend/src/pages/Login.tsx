import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');
    if (token){
      navigate('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email, password } }),
      });
      console.log(r);
      if (r.status === 401) {
        setErro('E-mail ou password incorretos.');
        return;
      }
      if (!r.ok) throw new Error();
      const { token } = await r.json();
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch {
      setErro('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Entrar</h1>
        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">E-mail</label>
          <input
            className="auth__input"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="auth__label">Senha</label>
          <input
            className="auth__input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {erro && <p className="auth__erro">{erro}</p>}
          <button className="auth__btn" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
        <p className="auth__footer">
          Não tem conta? <Link to="/cadastro" className="auth__link">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
