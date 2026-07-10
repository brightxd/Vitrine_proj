import { useState, useEffect } from 'react';

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

// IDs dos sub-grupos de Vestuário
const VESTUARIO_GRUPOS = [
  { id: 6, label: 'Masculino' },
  { id: 7, label: 'Feminino' },
  { id: 8, label: 'Infantil' },
];

export default function Header({ onSearch, onNavClick, onSubcatClick, subcategorias }: Props) {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');

  // fecha dropdown ao clicar fora
  useEffect(() => {
    const close = () => setOpenCat(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const subsFor = (catId: number) => subcategorias.filter(s => s.id_categoria === catId);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div
        style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 56, gap: '1rem' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Logo */}
        <span
          onClick={() => { onNavClick('HOME'); setOpenCat(null); }}
          style={{ fontWeight: 900, fontSize: '1.25rem', color: '#fff', letterSpacing: 3, textTransform: 'uppercase', flexShrink: 0, cursor: 'pointer' }}
        >
          ◆ VITRINE
        </span>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '0.1rem', flex: 1, justifyContent: 'center', position: 'relative' }}>
          {NAV.map(item => {
            const isVest = item.catId === 2;
            const hasSimpleSubs = item.catId !== null && !isVest && subsFor(item.catId).length > 0;
            const isOpen = openCat === item.catId;

            return (
              <div
                key={item.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => item.catId !== null ? setOpenCat(item.catId) : setOpenCat(null)}
                onMouseLeave={() => setOpenCat(null)}
              >
                <button
                  onClick={() => { onNavClick(item.label); setOpenCat(null); }}
                  style={{
                    background: 'none', border: 'none', color: isOpen ? '#fff' : '#ccc',
                    fontSize: '0.78rem', fontWeight: 600, letterSpacing: 0.8,
                    textTransform: 'uppercase', cursor: 'pointer', padding: '0 14px',
                    height: 56, borderBottom: `2px solid ${isOpen ? '#42A5F5' : 'transparent'}`,
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  {item.label}
                  {(isVest || hasSimpleSubs) && <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▾</span>}
                </button>

                {/* Mega-menu Vestuário — 3 colunas */}
                {isVest && isOpen && (
                  <div style={{
                    position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
                    background: '#fff', border: '1px solid #e0e0e0', borderTop: '2px solid #42A5F5',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '0 0 4px 4px',
                    padding: '1.2rem 1.5rem', zIndex: 200, display: 'flex', gap: '2rem', minWidth: 480
                  }}>
                    {VESTUARIO_GRUPOS.map(grupo => (
                      <div key={grupo.id} style={{ minWidth: 130 }}>
                        <p style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: 800, color: '#1565C0', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          {grupo.label}
                        </p>
                        {subsFor(grupo.id).map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => { onSubcatClick(sub.id); setOpenCat(null); }}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              background: 'none', border: 'none', padding: '6px 0',
                              fontSize: '0.82rem', color: '#444', cursor: 'pointer',
                              borderBottom: '1px solid #f5f5f5'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#1565C0'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}
                          >
                            {sub.nome}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown simples para outras categorias */}
                {hasSimpleSubs && isOpen && (
                  <div style={{
                    position: 'absolute', top: 56, left: 0,
                    background: '#fff', border: '1px solid #e0e0e0', borderTop: '2px solid #42A5F5',
                    minWidth: 180, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    borderRadius: '0 0 4px 4px', zIndex: 200
                  }}>
                    {subsFor(item.catId!).map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => { onSubcatClick(sub.id); setOpenCat(null); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          background: 'none', border: 'none', padding: '10px 16px',
                          fontSize: '0.82rem', color: '#333', cursor: 'pointer',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.color = '#1565C0'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#333'; }}
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

        {/* Busca */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#333', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Busca"
            value={searchVal}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', padding: '6px 12px', fontSize: '0.82rem', width: 160 }}
            onChange={e => { setSearchVal(e.target.value); onSearch(e.target.value); }}
          />
          <span style={{ padding: '0 10px', color: '#aaa', fontSize: '0.85rem' }}>🔍</span>
        </div>
      </div>
    </header>
  );
}
