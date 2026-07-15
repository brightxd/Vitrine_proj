import { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProdutoCard from './components/ProdutoCard.tsx';
import Header from './components/Header.tsx';
import Slider from './components/Slider.tsx';
import Produto from './pages/Produto';
import Login from './pages/Login';
import Register from './pages/Register';
import NovoProduto from './pages/NovoProduto';
import Dashboard from './pages/Dashboard';
import UseFetch from './UseFetch.ts';

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

type Categoria = {
  id: number;
  nome: string;
  id_categoria: number | null;
  img?: string | null;
};

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState<number | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetch('/api/categorias').then(async r => await r.json()).then(setCategorias);
    fetch('/api/subcategorias').then(async r => await r.json()).then(setSubcategorias);
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
    const categoria = categorias.find(c => c.nome.toUpperCase() === cat);
    if (categoria) {
      setBusca('');
      const first = subcategorias.find(s => s.id_categoria === categoria.id);
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
        categorias={categorias}
      />
      <Routes>
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/admin/novo-produto" element={<NovoProduto />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
