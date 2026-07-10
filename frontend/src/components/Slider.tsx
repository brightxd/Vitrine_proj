import { useState } from 'react';

type Subcategoria = {
  id: number;
  nome: string;
  id_categoria: number;
};

type Props = {
  subcategorias: Subcategoria[];
  onSelect: (id: number) => void;
};

const SLIDER_IMAGES: Record<string, string> = {
  'Sala':              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'Cozinha':           'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  'Quarto':            'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&q=80',
  'Masculino':         'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&q=80',
  'Feminino':          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  'Infantil':          'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80',
  'Calças Masc':       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
  'Camisetas Masc':    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  'Calças Fem':        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80',
  'Blusas Fem':        'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
  'Roupas Infantis':   'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80',
  'Plantas':           'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Ferramentas de Jardim': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Notebooks':         'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  'Monitores':         'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  'Periféricos':       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'Smartphones':       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  'Tablets':           'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  'Acessórios Mobile': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80',
};

const VISIBLE = 5;

export default function Slider({ subcategorias, onSelect }: Props) {
  const [offset, setOffset] = useState(0);

  if (subcategorias.length === 0) return null;

  const prev = () => setOffset(o => Math.max(0, o - 1));
  const next = () => setOffset(o => Math.min(subcategorias.length - VISIBLE, o + 1));
  const visible = subcategorias.slice(offset, offset + VISIBLE);

  return (
    <div style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #eee' }}>
      <h2 style={{ margin: '0 0 1.2rem', fontSize: '1rem', fontWeight: 700, color: '#222', letterSpacing: 0.5 }}>
        Compre por Categorias
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={prev} disabled={offset === 0} style={{
          background: 'none', border: '1px solid #ddd', borderRadius: '50%',
          width: 32, height: 32, cursor: offset === 0 ? 'default' : 'pointer',
          opacity: offset === 0 ? 0.3 : 1, fontSize: '1rem', flexShrink: 0
        }}>‹</button>

        <div style={{ display: 'flex', gap: '1rem', flex: 1, overflow: 'hidden' }}>
          {visible.map(sub => (
            <div
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              style={{ flex: 1, cursor: 'pointer', textAlign: 'center', minWidth: 0 }}
            >
              <div style={{
                height: 220, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden',
                marginBottom: 10
              }}>
                <img
                  src={SLIDER_IMAGES[sub.nome] ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'}
                  alt={sub.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#222' }}>{sub.nome}</span>
            </div>
          ))}
        </div>

        <button onClick={next} disabled={offset >= subcategorias.length - VISIBLE} style={{
          background: 'none', border: '1px solid #ddd', borderRadius: '50%',
          width: 32, height: 32, cursor: offset >= subcategorias.length - VISIBLE ? 'default' : 'pointer',
          opacity: offset >= subcategorias.length - VISIBLE ? 0.3 : 1, fontSize: '1rem', flexShrink: 0
        }}>›</button>
      </div>
    </div>
  );
}
