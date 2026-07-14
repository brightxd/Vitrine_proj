import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email, senha } }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setErro(body.error ?? 'Erro ao cadastrar.');
        return;
      }
      navigate('/login');
    } catch {
      setErro('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Criar Conta</h1>
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
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <label className="auth__label">Confirmar Senha</label>
          <input
            className="auth__input"
            type="password"
            placeholder="••••••••"
            value={confirmacao}
            onChange={e => setConfirmacao(e.target.value)}
            required
          />
          {erro && <p className="auth__erro">{erro}</p>}
          <button className="auth__btn" type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'CRIAR CONTA'}
          </button>
        </form>
        <p className="auth__footer">
          Já tem conta? <Link to="/login" className="auth__link">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
