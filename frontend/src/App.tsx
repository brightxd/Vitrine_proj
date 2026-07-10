import { useEffect, useState, useCallback } from 'react';
import ProdutoCard from './components/ProdutoCard.tsx';
import Header from './components/Header.tsx';
import Slider from './components/Slider.tsx';

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  quantidade: number;
  tipo_disponibilidade: number;
  imagem_url?: string;
};

type Subcategoria = {
  id: number;
  nome: string;
  id_categoria: number;
};

const CAT_NAME_TO_ID: Record<string, number> = {
  'CASA': 1, 'VESTUÁRIO': 2, 'JARDIM': 3, 'ELETRÔNICOS': 4, 'MOBILE': 5
};

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [filtro, setFiltro] = useState<number | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetch('/api/subcategorias').then(r => r.json()).then(setSubcategorias);
  }, []);

  const carregarProdutos = useCallback((subcatId: number | null, q: string) => {
    let url = '/api/produtos';
    if (q.trim().length > 0) {
      url = `/api/busca?q=${encodeURIComponent(q)}`;
    } else if (subcatId !== null) {
      url = `/api/produtos/categoria/${subcatId}`;
    }
    fetch(url).then(r => r.json()).then(setProdutos);
  }, []);

  useEffect(() => {
    carregarProdutos(filtro, busca);
  }, [filtro, busca, carregarProdutos]);

  const handleSearch = (q: string) => {
    setBusca(q);
    setFiltro(null);
  };

  const handleNavClick = (cat: string) => {
    if (cat === 'HOME') {
      setFiltro(null);
      setBusca('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const id = CAT_NAME_TO_ID[cat];
    if (id) {
      setBusca('');
      const first = subcategorias.find(s => s.id_categoria === id);
      if (first) setFiltro(first.id);
      document.getElementById('itens')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubcatClick = (id: number) => {
    setBusca('');
    setFiltro(id);
    document.getElementById('itens')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVerTudo = () => {
    setFiltro(null);
    setBusca('');
    document.getElementById('itens')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <Header
        onSearch={handleSearch}
        onNavClick={handleNavClick}
        onSubcatClick={handleSubcatClick}
        subcategorias={subcategorias}
      />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: '#fff'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, letterSpacing: 1 }}>Items</h1>
        <p style={{ marginTop: 8, fontSize: '0.95rem', opacity: 0.85 }}>Explore nossa coleção completa de produtos</p>
        <button onClick={handleVerTudo} style={{
          marginTop: '1.2rem', background: '#fff', color: '#1565C0',
          border: 'none', padding: '10px 32px', borderRadius: 4,
          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', letterSpacing: 0.5
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e3f2fd')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
        >
          VER TUDO
        </button>
      </div>

      {/* Slider */}
      <Slider subcategorias={subcategorias} onSelect={handleSubcatClick} />

      {/* Grid */}
      <main id="itens" style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '2rem 1rem', boxSizing: 'border-box' }}>
        <span style={{ fontSize: '0.82rem', color: '#666', display: 'block', marginBottom: '1rem' }}>
          {busca && `Busca: "${busca}" · `}{produtos.length} produto{produtos.length !== 1 ? 's' : ''}
        </span>
        {produtos.length === 0
          ? <p style={{ color: '#999', textAlign: 'center', marginTop: '4rem' }}>Nenhum produto encontrado.</p>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {produtos.map(p => <ProdutoCard key={p.id} produto={p} />)}
            </div>
          )
        }
      </main>

      <footer style={{ background: '#1a1a1a', color: '#aaa', textAlign: 'center', padding: '1.5rem', fontSize: '0.78rem' }}>
        © 2026 Vitrine de Produtos · Todos os direitos reservados
      </footer>
    </div>
  );
}
