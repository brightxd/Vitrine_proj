import { useState } from 'react';
import './Slider.css';

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
  'Calças':            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
  'Camisetas':         'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  'Camisas':           'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80',
  'Shorts':            'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80',
  'Blusas':            'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
  'Vestidos':          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
  'Saias':             'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80',
  'Calças Inf.':       'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80',
  'Camisetas Inf.':    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=80',
  'Vestidos Inf.':     'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80',
  'Conjuntos':         'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80',
  'Plantas':           'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Ferramentas':       'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'Notebooks':         'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  'Monitores':         'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  'Periféricos':       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'Smartphones':       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  'Tablets':           'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  'Acessórios':        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80',
};

const VISIBLE = 5;

export default function Slider({ subcategorias, onSelect }: Props) {
  const [offset, setOffset] = useState(0);

  if (subcategorias.length === 0) return null;

  const prev = () => setOffset(o => Math.max(0, o - 1));
  const next = () => setOffset(o => Math.min(subcategorias.length - VISIBLE, o + 1));
  const visible = subcategorias.slice(offset, offset + VISIBLE);

  return (
    <div className="slider">
      <h2 className="slider__title">Compre por Categorias</h2>

      <div className="slider__row">
        <button className="slider__arrow" onClick={prev} disabled={offset === 0}>‹</button>

        <div className="slider__track">
          {visible.map(sub => (
            <div key={sub.id} className="slider__item" onClick={() => onSelect(sub.id)}>
              <div className="slider__img-wrap">
                <img
                  src={SLIDER_IMAGES[sub.nome] ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'}
                  alt={sub.nome}
                />
              </div>
              <span className="slider__label">{sub.nome}</span>
            </div>
          ))}
        </div>

        <button className="slider__arrow" onClick={next} disabled={offset >= subcategorias.length - VISIBLE}>›</button>
      </div>
    </div>
  );
}
