import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

type Categoria = { id: number; nome: string; id_categoria: number | null; img?: string | null };
type Subcategoria = { id: number; nome: string; id_categoria: number; img?: string | null };
type Produto = { id: number; nome: string; descricao: string; valor: number; quantidade: number; tipo_disponibilidade: number; id_subcategoria?: number | null; imagem_url?: string | null };
type Aba = 'categorias' | 'subcategorias' | 'produtos';
type ModalTarget =
  | { tipo: 'categoria'; item: Categoria }
  | { tipo: 'nova-categoria' }
  | { tipo: 'subcategoria'; item: Subcategoria }
  | { tipo: 'nova-subcategoria'; catId: number }
  | { tipo: 'produto'; item: Produto }
  | { tipo: 'novo-produto' };

type ProdutoForm = {
  nome: string; descricao: string; valor: string;
  quantidade: string; tipo_disponibilidade: string;
  id_subcategoria: string; imagem_url: string;
};

const EMPTY_PRODUTO_FORM: ProdutoForm = { nome: '', descricao: '', valor: '', quantidade: '', tipo_disponibilidade: '0', id_subcategoria: '', imagem_url: '' };
const DISPONIBILIDADE = ['Pronta Entrega', 'Encomenda'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [aba, setAba] = useState<Aba>('categorias');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalTarget | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [imgEdit, setImgEdit] = useState('');
  const [produtoForm, setProdutoForm] = useState<ProdutoForm>(EMPTY_PRODUTO_FORM);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState('');
  const [sucessoModal, setSucessoModal] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    Promise.all([
      fetch('/api/categorias').then(r => r.json()),
      fetch('/api/subcategorias').then(r => r.json()),
      fetch('/api/produtos').then(r => r.json()),
    ]).then(([cats, subs, prods]) => {
      setCategorias(cats);
      setSubcategorias(subs);
      setProdutos(prods);
    }).finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (modal) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [modal]);

  const abrirModal = (target: ModalTarget) => {
    setErroModal('');
    setSucessoModal('');
    if (target.tipo === 'produto') {
      setProdutoForm({
        nome: target.item.nome,
        descricao: target.item.descricao,
        valor: String(target.item.valor),
        quantidade: String(target.item.quantidade),
        tipo_disponibilidade: String(target.item.tipo_disponibilidade),
        id_subcategoria: target.item.id_subcategoria ? String(target.item.id_subcategoria) : '',
        imagem_url: target.item.imagem_url ?? '',
      });
    } else if (target.tipo === 'novo-produto') {
      setProdutoForm(EMPTY_PRODUTO_FORM);
    } else {
      setNomeEdit(target.tipo === 'nova-subcategoria' || target.tipo === 'nova-categoria' ? '' : target.item.nome);
      if (target.tipo === 'categoria') setImgEdit(target.item.img ?? '');
      else if (target.tipo === 'subcategoria') setImgEdit(target.item.img ?? '');
      else setImgEdit('');
    }
    setModal(target);
  };

  const fecharModal = () => { if (!salvando) setModal(null); };

  const setProd = (field: keyof ProdutoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setProdutoForm(prev => ({ ...prev, [field]: e.target.value }));

  const salvar = async () => {
    if (!modal) return;
    const token = localStorage.getItem('token');
    setSalvando(true);
    setErroModal('');
    try {
      let endpoint: string;
      let payload: object;

      if (modal.tipo === 'categoria') {
        if (!nomeEdit.trim()) { setErroModal('Nome não pode ser vazio.'); return; }
        endpoint = '/api/update/categoria';
        payload = { id: modal.item.id, nome: nomeEdit.trim(), id_categoria: modal.item.id_categoria, img: imgEdit.trim() || null };
      } else if (modal.tipo === 'nova-categoria') {
        if (!nomeEdit.trim()) { setErroModal('Nome não pode ser vazio.'); return; }
        endpoint = '/api/create/categoria';
        payload = { nome: nomeEdit.trim(), img: imgEdit.trim() || null };
      } else if (modal.tipo === 'subcategoria') {
        if (!nomeEdit.trim()) { setErroModal('Nome não pode ser vazio.'); return; }
        endpoint = '/api/update/subcategoria';
        payload = { id: modal.item.id, nome: nomeEdit.trim(), id_categoria: modal.item.id_categoria, img: imgEdit.trim() || null };
      } else if (modal.tipo === 'nova-subcategoria') {
        if (!nomeEdit.trim()) { setErroModal('Nome não pode ser vazio.'); return; }
        endpoint = '/api/create/subcategoria';
        payload = { nome: nomeEdit.trim(), id_categoria: modal.catId, img: imgEdit.trim() || null };
      } else if (modal.tipo === 'produto') {
        if (!produtoForm.nome.trim()) { setErroModal('Nome não pode ser vazio.'); return; }
        endpoint = '/api/update/produto';
        payload = {
          id: modal.item.id,
          nome: produtoForm.nome.trim(),
          descricao: produtoForm.descricao.trim(),
          valor: parseFloat(produtoForm.valor),
          quantidade: parseInt(produtoForm.quantidade, 10),
          tipo_disponibilidade: parseInt(produtoForm.tipo_disponibilidade, 10),
          imagem_url: produtoForm.imagem_url.trim() || null,
          ...(produtoForm.id_subcategoria ? { id_subcategoria: parseInt(produtoForm.id_subcategoria, 10) } : {}),
        };
      } else {
        if (!produtoForm.nome.trim()) { setErroModal('Nome não pode ser vazio.'); return; }
        if (!produtoForm.id_subcategoria) { setErroModal('Selecione uma subcategoria.'); return; }
        if (!produtoForm.valor || parseFloat(produtoForm.valor) <= 0) { setErroModal('Informe um valor válido.'); return; }
        endpoint = '/api/create/produto';
        payload = {
          nome: produtoForm.nome.trim(),
          descricao: produtoForm.descricao.trim(),
          valor: parseFloat(produtoForm.valor),
          quantidade: parseInt(produtoForm.quantidade || '0', 10),
          tipo_disponibilidade: parseInt(produtoForm.tipo_disponibilidade, 10),
          imagem_url: produtoForm.imagem_url.trim() || null,
          id_subcategoria: parseInt(produtoForm.id_subcategoria, 10),
        };
      }

      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ data: payload }),
      });

      if (r.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
      if (!r.ok) { setErroModal('Erro ao salvar. Tente novamente.'); return; }

      if (modal.tipo === 'categoria') {
        setCategorias(prev => prev.map(c => c.id === modal.item.id ? { ...c, nome: nomeEdit.trim(), img: imgEdit.trim() || null } : c));
      } else if (modal.tipo === 'nova-categoria') {
        const nova = await r.json().catch(() => null);
        setCategorias(prev => [...prev, { id: nova?.lastID ?? Date.now(), nome: nomeEdit.trim(), id_categoria: null, img: imgEdit.trim() || null }]);
      } else if (modal.tipo === 'subcategoria') {
        setSubcategorias(prev => prev.map(s => s.id === modal.item.id ? { ...s, nome: nomeEdit.trim(), img: imgEdit.trim() || null } : s));
      } else if (modal.tipo === 'nova-subcategoria') {
        const nova = await r.json().catch(() => null);
        setSubcategorias(prev => [...prev, { id: nova?.lastID ?? Date.now(), nome: nomeEdit.trim(), id_categoria: modal.catId, img: imgEdit.trim() || null }]);
      } else if (modal.tipo === 'produto') {
        setProdutos(prev => prev.map(p => p.id === modal.item.id ? {
          ...p,
          nome: produtoForm.nome.trim(),
          descricao: produtoForm.descricao.trim(),
          valor: parseFloat(produtoForm.valor),
          quantidade: parseInt(produtoForm.quantidade, 10),
          tipo_disponibilidade: parseInt(produtoForm.tipo_disponibilidade, 10),
          imagem_url: produtoForm.imagem_url.trim() || null,
          id_subcategoria: produtoForm.id_subcategoria ? parseInt(produtoForm.id_subcategoria, 10) : p.id_subcategoria,
        } : p));
      } else {
        const novo = await r.json().catch(() => null);
        setProdutos(prev => [...prev, {
          id: novo?.id ?? Date.now(),
          nome: produtoForm.nome.trim(),
          descricao: produtoForm.descricao.trim(),
          valor: parseFloat(produtoForm.valor),
          quantidade: parseInt(produtoForm.quantidade || '0', 10),
          tipo_disponibilidade: parseInt(produtoForm.tipo_disponibilidade, 10),
        }]);
      }
      setSucessoModal('Salvo com sucesso!');
      setTimeout(() => { setSucessoModal(''); setModal(null); }, 1500);
    } catch {
      setErroModal('Erro ao conectar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const raizes = categorias.filter(c => c.id_categoria === null);
  const subsFor = (catId: number) => subcategorias.filter(s => s.id_categoria === catId);

  const totalEstoque = produtos.reduce((acc, p) => acc + Number(p.quantidade), 0);
  const prontos = produtos.filter(p => p.tipo_disponibilidade === 0).length;
  const encomenda = produtos.filter(p => p.tipo_disponibilidade === 1).length;

  const produtosPorSub = subcategorias
    .map(sub => ({
      nome: sub.nome,
      total: produtos.filter(p => p.id_subcategoria === sub.id).length,
    }))
    .filter(s => s.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const maxBar = Math.max(...produtosPorSub.map(s => s.total), 1);

  const ABAS: { key: Aba; label: string; count: number }[] = [
    { key: 'categorias',    label: 'Categorias',    count: raizes.length },
    { key: 'subcategorias', label: 'Subcategorias', count: subcategorias.length },
    { key: 'produtos',      label: 'Produtos',      count: produtos.length },
  ];

  const isProdutoForm = modal?.tipo === 'produto' || modal?.tipo === 'novo-produto';

  return (
    <div className="dash">
      <div className="dash__header">
        <h1 className="dash__title">Dashboard</h1>
        <button className="dash__voltar" onClick={() => navigate('/')}>← Voltar à vitrine</button>
      </div>

      {!loading && (
        <div className="dash__overview">
          <div className="dash__tiles">
            <div className="dash__tile">
              <span className="dash__tile-value">{produtos.length}</span>
              <span className="dash__tile-label">Produtos</span>
            </div>
            <div className="dash__tile">
              <span className="dash__tile-value">{subcategorias.length}</span>
              <span className="dash__tile-label">Subcategorias</span>
            </div>
            <div className="dash__tile">
              <span className="dash__tile-value">{totalEstoque}</span>
              <span className="dash__tile-label">Em Estoque</span>
            </div>
            <div className="dash__tile">
              <span className="dash__tile-value">{prontos}</span>
              <span className="dash__tile-label">Pronta Entrega</span>
            </div>
            <div className="dash__tile">
              <span className="dash__tile-value">{encomenda}</span>
              <span className="dash__tile-label">Encomenda</span>
            </div>
          </div>

          {produtosPorSub.length > 0 && (
            <div className="dash__chart">
              <p className="dash__chart-title">Produtos por subcategoria</p>
              <div className="dash__bars">
                {produtosPorSub.map(s => (
                  <div key={s.nome} className="dash__bar-row">
                    <span className="dash__bar-label" title={s.nome}>{s.nome}</span>
                    <div className="dash__bar-track">
                      <div
                        className="dash__bar-fill"
                        style={{ width: `${(s.total / maxBar) * 100}%` }}
                      />
                    </div>
                    <span className="dash__bar-count">{s.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="dash__tabs">
        {ABAS.map(a => (
          <button
            key={a.key}
            className={`dash__tab ${aba === a.key ? 'dash__tab--active' : ''}`}
            onClick={() => setAba(a.key)}
          >
            {a.label}
            {!loading && <span className="dash__tab-count">{a.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="dash__loading">Carregando...</p>
      ) : (
        <section className="dash__section">

          {aba === 'categorias' && (
            <div className="dash__list">
              {raizes.map(cat => (
                <div key={cat.id} className="dash__row">
                  <span className="dash__row-name">{cat.nome}</span>
                  <button className="dash__edit-btn" onClick={() => abrirModal({ tipo: 'categoria', item: cat })}>✎</button>
                </div>
              ))}
              <button className="dash__add-sub-btn" onClick={() => abrirModal({ tipo: 'nova-categoria' })}>
                + categoria
              </button>
            </div>
          )}

          {aba === 'subcategorias' && (
            <div className="dash__grid">
              {raizes.map(cat => (
                <div key={cat.id} className="dash__card">
                  <div className="dash__card-header">
                    <p className="dash__card-title">{cat.nome}</p>
                  </div>
                  <ul className="dash__sublist">
                    {subsFor(cat.id).length === 0
                      ? <li className="dash__subitem dash__subitem--empty">Nenhuma subcategoria</li>
                      : subsFor(cat.id).map(sub => (
                          <li key={sub.id} className="dash__subitem">
                            <span>{sub.nome}</span>
                            <button className="dash__edit-btn dash__edit-btn--sm" onClick={() => abrirModal({ tipo: 'subcategoria', item: sub })}>✎</button>
                          </li>
                        ))
                    }
                  </ul>
                  <button className="dash__add-sub-btn" onClick={() => abrirModal({ tipo: 'nova-subcategoria', catId: cat.id })}>
                    + subcategoria
                  </button>
                </div>
              ))}
            </div>
          )}

          {aba === 'produtos' && (
            <>
              <button className="dash__add-sub-btn" style={{ marginBottom: '1rem' }} onClick={() => abrirModal({ tipo: 'novo-produto' })}>
                + produto
              </button>
              <table className="dash__table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Quantidade</th>
                    <th>Disponibilidade</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.length === 0
                    ? <tr><td colSpan={6} className="dash__table-empty">Nenhum produto cadastrado.</td></tr>
                    : produtos.map(p => {
                        const sub = subcategorias.find(s => s.id === p.id_subcategoria);
                        const cat = sub ? categorias.find(c => c.id === sub.id_categoria) : null;
                        const categoriaLabel = [cat?.nome, sub?.nome].filter(Boolean).join(' › ');
                        return (
                          <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{categoriaLabel || <span style={{ color: '#aaa', fontStyle: 'italic' }}>—</span>}</td>
                            <td>R$ {p.valor.toFixed(2)}</td>
                            <td>{p.quantidade}</td>
                            <td>{DISPONIBILIDADE[p.tipo_disponibilidade] ?? '-'}</td>
                            <td className="dash__table-action">
                              <button className="dash__edit-btn" onClick={() => abrirModal({ tipo: 'produto', item: p })}>✎</button>
                            </td>
                          </tr>
                        );
                      })
                  }
                </tbody>
              </table>
            </>
          )}

        </section>
      )}

      <dialog ref={dialogRef} className="dash__modal" onCancel={fecharModal}>
        {modal && (
          <>
            <h2 className="dash__modal-title">
              {modal.tipo === 'categoria' ? 'Editar categoria'
                : modal.tipo === 'nova-categoria' ? 'Nova categoria'
                : modal.tipo === 'subcategoria' ? 'Editar subcategoria'
                : modal.tipo === 'nova-subcategoria' ? 'Nova subcategoria'
                : modal.tipo === 'produto' ? 'Editar produto'
                : 'Novo produto'}
            </h2>

            {isProdutoForm ? (
              <div className="dash__modal-form">
                <label className="dash__modal-label" htmlFor="p-nome">Nome</label>
                <input id="p-nome" className="dash__modal-input" value={produtoForm.nome} onChange={setProd('nome')} autoFocus />

                <label className="dash__modal-label" htmlFor="p-descricao">Descrição</label>
                <textarea id="p-descricao" className="dash__modal-input dash__modal-textarea" value={produtoForm.descricao} onChange={setProd('descricao')} />

                <div className="dash__modal-row">
                  <div className="dash__modal-col">
                    <label className="dash__modal-label" htmlFor="p-valor">Valor (R$)</label>
                    <input id="p-valor" className="dash__modal-input" type="number" step="0.01" min="0.01" value={produtoForm.valor} onChange={setProd('valor')} />
                  </div>
                  <div className="dash__modal-col">
                    <label className="dash__modal-label" htmlFor="p-qtd">Quantidade</label>
                    <input id="p-qtd" className="dash__modal-input" type="number" min="0" value={produtoForm.quantidade} onChange={setProd('quantidade')} />
                  </div>
                </div>

                <label className="dash__modal-label" htmlFor="p-disp">Disponibilidade</label>
                <select id="p-disp" className="dash__modal-input" value={produtoForm.tipo_disponibilidade} onChange={setProd('tipo_disponibilidade')}>
                  <option value="0">Pronta Entrega</option>
                  <option value="1">Encomenda</option>
                </select>

                <label className="dash__modal-label" htmlFor="p-img">URL da imagem (opcional)</label>
                <input id="p-img" className="dash__modal-input" type="url" placeholder="https://..." value={produtoForm.imagem_url} onChange={setProd('imagem_url')} />

                <label className="dash__modal-label" htmlFor="p-subcat">Subcategoria</label>
                <select id="p-subcat" className="dash__modal-input" value={produtoForm.id_subcategoria} onChange={setProd('id_subcategoria')}>
                  <option value="">Selecione...</option>
                  {raizes.map(cat => (
                    <optgroup key={cat.id} label={cat.nome}>
                      {subsFor(cat.id).map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.nome}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <label className="dash__modal-label" htmlFor="modal-nome">Nome</label>
                <input
                  id="modal-nome"
                  className="dash__modal-input"
                  value={nomeEdit}
                  onChange={e => setNomeEdit(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && salvar()}
                />
                {(modal.tipo === 'categoria' || modal.tipo === 'nova-categoria'
                  || modal.tipo === 'subcategoria' || modal.tipo === 'nova-subcategoria') && (
                  <>
                    <label className="dash__modal-label" htmlFor="modal-img">URL da imagem (opcional)</label>
                    <input
                      id="modal-img"
                      className="dash__modal-input"
                      type="url"
                      placeholder="https://..."
                      value={imgEdit}
                      onChange={e => setImgEdit(e.target.value)}
                    />
                  </>
                )}
              </>
            )}

            {erroModal && <p className="dash__modal-erro">{erroModal}</p>}
            {sucessoModal && <p className="dash__modal-sucesso">{sucessoModal}</p>}
            <div className="dash__modal-actions">
              <button className="dash__modal-btn dash__modal-btn--ghost" onClick={fecharModal} disabled={salvando}>Cancelar</button>
              <button className="dash__modal-btn" onClick={salvar} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
