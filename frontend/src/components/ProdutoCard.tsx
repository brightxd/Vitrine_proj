import './ProdutoCard.css';

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  quantidade: number;
  tipo_disponibilidade: number;
  imagem_url?: string;
};

type Props = { produto: Produto };

export default function ProdutoCard({ produto }: Props) {
  const disponivel = produto.tipo_disponibilidade === 0;

  return (
    <div className="card">
      <div className="card__image">
        {produto.imagem_url
          ? <img src={produto.imagem_url} alt={produto.nome} />
          : <span className="card__image-placeholder">📦</span>
        }
        <span className={`card__badge ${disponivel ? 'card__badge--disponivel' : 'card__badge--encomenda'}`}>
          {disponivel ? 'Pronta Entrega' : 'Encomenda'}
        </span>
      </div>

      <div className="card__body">
        <p className="card__estoque">Estoque: {produto.quantidade}</p>
        <p className="card__nome">{produto.nome}</p>
        <p className="card__descricao">{produto.descricao}</p>
        <p className="card__valor">R$ {produto.valor.toFixed(2)}</p>
        <button className="card__btn">Adicionar ao Carrinho</button>
      </div>
    </div>
  );
}
