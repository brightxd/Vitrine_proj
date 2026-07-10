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
  const itemStyle = (ativo: boolean): React.CSSProperties => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderLeft: ativo ? '3px solid #1565C0' : '3px solid transparent',
    padding: '8px 10px',
    fontSize: '0.85rem',
    fontWeight: ativo ? 700 : 400,
    color: ativo ? '#1565C0' : '#444',
    cursor: 'pointer',
    transition: 'all 0.15s'
  });

  return (
    <div>
      <button style={itemStyle(selecionada === null)} onClick={() => onSelect(null)}>
        Todos
      </button>
      {subcategorias.map(s => (
        <button key={s.id} style={itemStyle(selecionada === s.id)} onClick={() => onSelect(s.id)}>
          {s.nome}
        </button>
      ))}
    </div>
  );
}
