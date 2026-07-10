import { useState, useEffect } from 'react';
import './Header.css';

type Subcategoria = { id: number; nome: string; id_categoria: number };

type Props = {
  onSearch: (q: string) => void;
  onNavClick: (cat: string) => void;
  onSubcatClick: (id: number) => void;
  subcategorias: Subcategoria[];
};

const NAV = [
  { label: 'HOME', catId: null },
  { label: 'CASA', catId: 1 },
  { label: 'VESTUÁRIO', catId: 2 },
  { label: 'JARDIM', catId: 3 },
  { label: 'ELETRÔNICOS', catId: 4 },
  { label: 'MOBILE', catId: 5 },
];

const VESTUARIO_GRUPOS = [
  { id: 6, label: 'Masculino' },
  { id: 7, label: 'Feminino' },
  { id: 8, label: 'Infantil' },
];

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

const CAT_FALLBACK: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  5: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
};

export default function Header({ onSearch, onNavClick, onSubcatClick, subcategorias }: Props) {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [hoveredSub, setHoveredSub] = useState<Subcategoria | null>(null)

  useEffect(() => {
    const close = () => setOpenCat(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const subsFor = (catId: number) => subcategorias.filter(s => s.id_categoria === catId);

  return (
    <header className="header">
      <div className="header__bar" onClick={e => e.stopPropagation()}>

        <button className="header__logo" onClick={() => { onNavClick('HOME'); setOpenCat(null); }}>
          ◆ VITRINE
        </button>

        <nav className="header__nav">
          {NAV.map(item => {
            const isVest = item.catId === 2;
            const hasSimpleSubs = item.catId !== null && !isVest && subsFor(item.catId).length > 0;
            const isOpen = openCat === item.catId;

            return (
              <div
                key={item.label}
                className="nav__item"
                onMouseEnter={() => item.catId !== null ? setOpenCat(item.catId) : setOpenCat(null)}
                onMouseLeave={() => { setOpenCat(null); setHoveredSub(null); }}
              >
                <button
                  className={`nav__btn ${isOpen ? 'nav__btn--open' : ''}`}
                  onClick={() => { onNavClick(item.label); setOpenCat(null); }}
                >
                  {item.label}
                  {(isVest || hasSimpleSubs) && <span className="nav__arrow">▾</span>}
                </button>

                {isVest && isOpen && (
                  <div className="nav__megamenu">
                    <div className="megamenu__list">
                      {VESTUARIO_GRUPOS.map(grupo => (
                        <div key={grupo.id}>
                          <p className="megamenu__group-title">{grupo.label}</p>
                          {subsFor(grupo.id).map(sub => (
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
                      ))}
                    </div>
                    <div className="megamenu__image">
                      <img
                        src={hoveredSub ? (SUB_IMAGES[hoveredSub.nome] ?? CAT_FALLBACK[2]) : CAT_FALLBACK[2]}
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
                        src={hoveredSub ? (SUB_IMAGES[hoveredSub.nome] ?? CAT_FALLBACK[item.catId!]) : CAT_FALLBACK[item.catId!]}
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
      </div>
    </header>
  );
}
