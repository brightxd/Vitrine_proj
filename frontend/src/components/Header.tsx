import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

type Subcategoria = { id: number; nome: string; id_categoria: number; img?: string | null };
type Categoria = { id: number; nome: string; id_categoria: number | null; img?: string | null };

type Props = Readonly<{
  onSearch: (q: string) => void;
  onNavClick: (cat: string) => void;
  onSubcatClick: (id: number) => void;
  subcategorias: Subcategoria[];
  categorias: Categoria[];
}>;

type AccordionProps = Readonly<{
  child: Categoria;
  subs: Subcategoria[];
  onSubClick: (id: number) => void;
  onSubHover: (sub: Subcategoria | null) => void;
  onClose: () => void;
}>;

function AccordionGroup({ child, subs, onSubClick, onSubHover, onClose }: AccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="megamenu__group">
      <button
        className={`megamenu__row megamenu__row--group ${open ? 'megamenu__row--active' : ''}`}
        onClick={e => { e.stopPropagation(); if (subs.length > 0) setOpen(prev => !prev); }}      >
        <span>{child.nome}</span>
        {subs.length > 0 && (
          <span className="megamenu__chevron">{open ? '▾' : '›'}</span>
        )}
      </button>

      {open && subs.length > 0 && (
        <ul className="megamenu__accordion">
          {subs.map(sub => (
            <li key={sub.id}>
              <button
                className="megamenu__accordion-item"
                onMouseEnter={() => onSubHover(sub)}
                onMouseLeave={() => onSubHover(null)}
                onClick={e => { e.stopPropagation(); onSubClick(sub.id); onClose(); }}
              >
                {sub.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header({ onSearch, onNavClick, onSubcatClick, subcategorias, categorias }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [hoveredSub, setHoveredSub] = useState<Subcategoria | null>(null);
  const [logado, setLogado] = useState(!!localStorage.getItem('token'));
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLogado(!!localStorage.getItem('token'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
    navigate('/');
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setOpenCat(null);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const subsFor = (catId: number) => subcategorias.filter(s => s.id_categoria === catId);
  const childCatsFor = (catId: number) => categorias.filter(c => c.id_categoria === catId);

  const closeMenu = () => {
    setOpenCat(null);
    setHoveredSub(null);
  };

  const nav = [
    { label: 'HOME', catId: null },
    ...categorias
      .filter(c => c.id_categoria === null)
      .map(c => ({ label: c.nome.toUpperCase(), catId: c.id })),
  ];

  return (
    <header ref={headerRef} className="header" onMouseLeave={closeMenu}>
      <div role="presentation" className="header__bar">

        <button className="header__logo" onClick={() => { navigate('/'); onNavClick('HOME'); closeMenu(); }}>
          ◆ VITRINE
        </button>

        <nav className="header__nav">
          {nav.map(item => {
            const childCats = item.catId !== null ? childCatsFor(item.catId) : [];
            const directSubs = item.catId !== null ? subsFor(item.catId) : [];
            const hasChildCats = childCats.length > 0;
            const hasSubs = hasChildCats || directSubs.length > 0;
            const isOpen = openCat === item.catId;
            const currentImg = hoveredSub?.img ?? categorias.find(c => c.id === item.catId)?.img ?? null;

            return (
              <div
                key={item.label}
                className="nav__item"
                onMouseEnter={() => { if (item.catId !== null) { setOpenCat(item.catId); } else { setOpenCat(null); } }}
              >
                <button
                  className={`nav__btn ${isOpen ? 'nav__btn--open' : ''}`}
                  onClick={() => { if (item.catId === null) { navigate('/'); } onNavClick(item.label); closeMenu(); }}
                >
                  {item.label}
                  {hasSubs && <span className="nav__arrow">▾</span>}
                </button>

                {hasSubs && isOpen && (
                  <div className="nav__megamenu">
                    <div className="megamenu__list">
                      {hasChildCats ? (
                        childCats.map(child => (
                          <AccordionGroup
                            key={child.id}
                            child={child}
                            subs={subsFor(child.id)}
                            onSubClick={onSubcatClick}
                            onSubHover={setHoveredSub}
                            onClose={closeMenu}
                          />
                        ))
                      ) : (
                        directSubs.map(sub => (
                          <button
                            key={sub.id}
                            className="megamenu__row"
                            onMouseEnter={() => setHoveredSub(sub)}
                            onClick={() => { onSubcatClick(sub.id); closeMenu(); }}
                          >
                            <span>{sub.nome}</span>
                            <span className="megamenu__chevron">›</span>
                          </button>
                        ))
                      )}
                    </div>

                    <div className="megamenu__image">
                      {currentImg && <img src={currentImg} alt="" />}
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
            <button className="header__action-btn header__action-btn--ghost" onClick={handleLogout}>Sair</button>
          ) : (
            <button className="header__action-btn" onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
}
