import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

type Subcategoria = { id: number; nome: string; id_categoria: number };
type Categoria = { id: number; nome: string; id_categoria: number | null };

type Props = {
  onSearch: (q: string) => void;
  onNavClick: (cat: string) => void;
  onSubcatClick: (id: number) => void;
  subcategorias: Subcategoria[];
  categorias: Categoria[];
};

const SUB_IMAGES: Record<string, string> = {
  'Sala': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  'Cozinha': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'Quarto': 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&q=80',
  'Calças': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
  'Camisetas': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  'Blusas': 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80',
  'Vestidos': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
  'Conjuntos': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80',
  'Plantas': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  'Notebooks': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
};

const CAT_FALLBACK: Record<string, string> = {
  'CASA': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  'VESTUÁRIO': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  'JARDIM': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  'ELETRÔNICOS': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  'MOBILE': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
};

const VESTUARIO_GENEROS = ['Masculino', 'Feminino', 'Infantil'];

export default function Header({ onSearch, onNavClick, onSubcatClick, subcategorias, categorias }: Props) {
  const navigate = useNavigate();
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [hoveredSub, setHoveredSub] = useState<Subcategoria | null>(null);
  const [subcatsGenero, setSubcatsGenero] = useState<Record<number, Subcategoria[]>>({});
  const [logado, setLogado] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
    navigate('/');
  };

  useEffect(() => {
    const close = () => setOpenCat(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const subsFor = (catId: number) => subcategorias.filter(s => s.id_categoria === catId);

  const handleOpenCat = (catId: number | null) => {
    setOpenCat(catId);
    if (catId === null) return;

    const cat = categorias.find(c => c.id === catId);
    const isVestuario = cat?.nome.toUpperCase() === 'VESTUÁRIO';
    if (!isVestuario || subcatsGenero[catId]) return;

    fetch(`/api/subcategorias/genero/${catId}`)
      .then(r => r.json())
      .then((data: Array<{ id: number; nome: string; id_categoria: number }>) => {
        setSubcatsGenero(prev => ({ ...prev, [catId]: data }));
      })
      .catch(() => {});
  };

  const nav = [
    { label: 'HOME', catId: null },
    ...categorias
      .filter(c => c.id_categoria === null)
      .map(c => ({ label: c.nome.toUpperCase(), catId: c.id })),
  ];

  const vestuarioCat = categorias.find(c => c.nome.toUpperCase() === 'VESTUÁRIO');

  return (
    <header className="header">
      <div className="header__bar" onClick={e => e.stopPropagation()}>

        <button className="header__logo" onClick={() => { navigate('/'); onNavClick('HOME'); setOpenCat(null); }}>
          ◆ VITRINE
        </button>

        <nav className="header__nav">
          {nav.map(item => {
            const isVest = item.catId !== null && item.catId === vestuarioCat?.id;
            const hasSimpleSubs = item.catId !== null && !isVest && subsFor(item.catId).length > 0;
            const isOpen = openCat === item.catId;
            const catLabel = item.label;

            return (
              <div
                key={item.label}
                className="nav__item"
                onMouseEnter={() => item.catId !== null ? handleOpenCat(item.catId) : setOpenCat(null)}
                onMouseLeave={() => { setOpenCat(null); setHoveredSub(null); }}
              >
                <button
                  className={`nav__btn ${isOpen ? 'nav__btn--open' : ''}`}
                  onClick={() => { if (item.catId === null) navigate('/'); onNavClick(item.label); setOpenCat(null); }}
                >
                  {item.label}
                  {(isVest || hasSimpleSubs) && <span className="nav__arrow">▾</span>}
                </button>

                {isVest && isOpen && (
                  <div className="nav__megamenu">
                    <div className="megamenu__list">
                      {VESTUARIO_GENEROS.map(generoNome => {
                        const genCat = categorias.find(c => c.nome === generoNome);
                        const genSubs = genCat
                          ? (subcatsGenero[item.catId!] ?? subsFor(genCat.id))
                          : subsFor(item.catId!);
                        return (
                          <div key={generoNome}>
                            <p className="megamenu__group-title">{generoNome}</p>
                            {genSubs.map(sub => (
                              <button
                                key={sub.id}
                                className="megamenu__row"
                                onMouseEnter={() => setHoveredSub(sub)}
                                onClick={() => { onSubcatClick(sub.id); setOpenCat(null); }}
                              >
                                <span>{sub.nome}</span>
                                <span className="megamenu__chevron">›</span>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    <div className="megamenu__image">
                      <img
                        src={hoveredSub ? (SUB_IMAGES[hoveredSub.nome] ?? CAT_FALLBACK['VESTUÁRIO']) : CAT_FALLBACK['VESTUÁRIO']}
                        alt=""
                      />
                    </div>
                  </div>
                )}

                {hasSimpleSubs && isOpen && (
                  <div className="nav__megamenu">
                    <div className="megamenu__list">
                      {subsFor(item.catId!).map(sub => (
                        <button
                          key={sub.id}
                          className="megamenu__row"
                          onMouseEnter={() => setHoveredSub(sub)}
                          onClick={() => { onSubcatClick(sub.id); setOpenCat(null); }}
                        >
                          <span>{sub.nome}</span>
                          <span className="megamenu__chevron">›</span>
                        </button>
                      ))}
                    </div>
                    <div className="megamenu__image">
                      <img
                        src={hoveredSub ? (SUB_IMAGES[hoveredSub.nome] ?? CAT_FALLBACK[catLabel]) : CAT_FALLBACK[catLabel]}
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="header__search">
          <input
            type="text"
            placeholder="Busca"
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); onSearch(e.target.value); }}
          />
          <span>🔍</span>
        </div>

        <div className="header__actions">
          {logado ? (
            <>
              <Link to="/admin/novo-produto" className="header__action-btn">+ Produto</Link>
              <button className="header__action-btn header__action-btn--ghost" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="header__action-btn">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}
