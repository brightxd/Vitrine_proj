import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import './NovoProduto.css';

export default function NovoProduto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    valor: '',
    quantidade: '',
    tipo_disponibilidade: '0',
    imagem_url: '',
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const r = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            nome: form.nome,
            descricao: form.descricao,
            valor: parseFloat(form.valor),
            quantidade: parseInt(form.quantidade, 10),
            tipo_disponibilidade: parseInt(form.tipo_disponibilidade, 10),
            imagem_url: form.imagem_url || undefined,
          },
        }),
      });

      if (r.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setErro(body.error ?? 'Erro ao criar produto.');
        return;
      }

      setSucesso('Produto criado com sucesso!');
      setForm({ nome: '', descricao: '', valor: '', quantidade: '', tipo_disponibilidade: '0', imagem_url: '' });
    } catch {
      setErro('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card novoproduto__card">
        <div className="novoproduto__header">
          <button className="novoproduto__voltar" onClick={() => navigate('/')}>← Voltar</button>
          <h1 className="auth__title" style={{ margin: 0 }}>Novo Produto</h1>
        </div>
        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">Nome</label>
          <input className="auth__input" type="text" placeholder="Nome do produto" value={form.nome} onChange={set('nome')} required />

          <label className="auth__label">Descrição</label>
          <textarea className="auth__input novoproduto__textarea" placeholder="Descrição do produto" value={form.descricao} onChange={set('descricao')} required />

          <div className="novoproduto__row">
            <div className="novoproduto__col">
              <label className="auth__label">Valor (R$)</label>
              <input className="auth__input" type="number" step="0.01" min="0" placeholder="0,00" value={form.valor} onChange={set('valor')} required />
            </div>
            <div className="novoproduto__col">
              <label className="auth__label">Quantidade</label>
              <input className="auth__input" type="number" min="0" placeholder="0" value={form.quantidade} onChange={set('quantidade')} required />
            </div>
          </div>

          <label className="auth__label">Disponibilidade</label>
          <select className="auth__input" value={form.tipo_disponibilidade} onChange={set('tipo_disponibilidade')}>
            <option value="0">Pronta Entrega</option>
            <option value="1">Encomenda</option>
          </select>

          <label className="auth__label">URL da Imagem (opcional)</label>
          <input className="auth__input" type="url" placeholder="https://..." value={form.imagem_url} onChange={set('imagem_url')} />

          {erro && <p className="auth__erro">{erro}</p>}
          {sucesso && <p className="novoproduto__sucesso">{sucesso}</p>}

          <button className="auth__btn" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'CRIAR PRODUTO'}
          </button>
        </form>
      </div>
    </div>
  );
}
