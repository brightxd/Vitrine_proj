import { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProdutoCard from './components/ProdutoCard.tsx';
import Header from './components/Header.tsx';
import Slider from './components/Slider.tsx';
import Produto from './pages/Produto';

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
    <div className="app">
      <Header
        onSearch={handleSearch}
        onNavClick={handleNavClick}
        onSubcatClick={handleSubcatClick}
        subcategorias={subcategorias}
      />
      <Routes>
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/" element={
          <>
            <div className="hero">
              <h1>Items</h1>
              <p>Explore nossa coleção completa de produtos</p>
              <button className="hero__btn" onClick={handleVerTudo}>VER TUDO</button>
            </div>
            <Slider subcategorias={subcategorias} onSelect={handleSubcatClick} />
            <main id="itens" className="main">
              <span className="main__count">
                {busca && `Busca: "${busca}" · `}{produtos.length} produto{produtos.length !== 1 ? 's' : ''}
              </span>
              {produtos.length === 0
                ? <p className="main__empty">Nenhum produto encontrado.</p>
                : (
                  <div className="main__grid">
                    {produtos.map(p => <ProdutoCard key={p.id} produto={p} />)}
                  </div>
                )
              }
            </main>
            <footer className="footer">
              © 2026 Vitrine de Produtos · Todos os direitos reservados
            </footer>
          </>
        } />
      </Routes>
    </div>
  );
}
