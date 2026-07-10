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
  { label: 'HOME',        catId: null },
  { label: 'CASA',        catId: 1 },
  { label: 'VESTUÁRIO',   catId: 2 },
  { label: 'JARDIM',      catId: 3 },
  { label: 'ELETRÔNICOS', catId: 4 },
  { label: 'MOBILE',      catId: 5 },
];

const VESTUARIO_GRUPOS = [
  { id: 6, label: 'Masculino' },
  { id: 7, label: 'Feminino' },
  { id: 8, label: 'Infantil' },
];

export default function Header({ onSearch, onNavClick, onSubcatClick, subcategorias }: Props) {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');

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
                onMouseLeave={() => setOpenCat(null)}
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
                    {VESTUARIO_GRUPOS.map(grupo => (
                      <div key={grupo.id} className="megamenu__col">
                        <p className="megamenu__title">{grupo.label}</p>
                        {subsFor(grupo.id).map(sub => (
                          <button
                            key={sub.id}
                            className="megamenu__item"
                            onClick={() => { onSubcatClick(sub.id); setOpenCat(null); }}
                          >
                            {sub.nome}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {hasSimpleSubs && isOpen && (
                  <div className="nav__dropdown">
                    {subsFor(item.catId!).map(sub => (
                      <button
                        key={sub.id}
                        className="nav__dropdown-item"
                        onClick={() => { onSubcatClick(sub.id); setOpenCat(null); }}
                      >
                        {sub.nome}
                      </button>
                    ))}
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
