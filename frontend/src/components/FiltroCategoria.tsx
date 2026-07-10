import './FiltroCategoria.css';

type Subcategoria = {
  id: number;
  nome: string;
  id_categoria: number;
};

type Props = {
  subcategorias: Subcategoria[];
  selecionada: number | null;
  onSelect: (id: number | null) => void;
};

export default function FiltroCategoria({ subcategorias, selecionada, onSelect }: Props) {
  return (
    <div>
      <button
        className={`filtro__item ${selecionada === null ? 'filtro__item--ativo' : ''}`}
        onClick={() => onSelect(null)}
      >
        Todos
      </button>
      {subcategorias.map(s => (
        <button
          key={s.id}
          className={`filtro__item ${selecionada === s.id ? 'filtro__item--ativo' : ''}`}
          onClick={() => onSelect(s.id)}
        >
          {s.nome}
        </button>
      ))}
    </div>
  );
}
