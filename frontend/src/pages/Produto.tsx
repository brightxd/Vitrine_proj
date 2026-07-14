import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Produto.css';

type ProdutoDetalhe = {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  quantidade: number;
  tipo_disponibilidade: number;
  imagem_url?: string;
};

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    setLoading(true);
    setErro(false);
    fetch(`/api/produtos/${id}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setProduto)
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detalhe__estado">Carregando...</div>;
  if (erro || !produto) return <div className="detalhe__estado">Produto não encontrado.</div>;

  const disponivel = produto.tipo_disponibilidade === 0;

  return (
    <div className="detalhe">
      <button className="detalhe__voltar" onClick={() => navigate(-1)}>← Voltar</button>

      <div className="detalhe__card">
        <div className="detalhe__imagem">
          {produto.imagem_url
            ? <img src={produto.imagem_url} alt={produto.nome} />
            : <span className="detalhe__placeholder">📦</span>
          }
          <span className={`detalhe__badge ${disponivel ? 'detalhe__badge--disponivel' : 'detalhe__badge--encomenda'}`}>
            {disponivel ? 'Pronta Entrega' : 'Encomenda'}
          </span>
        </div>

        <div className="detalhe__info">
          <p className="detalhe__estoque">Estoque: {produto.quantidade}</p>
          <h1 className="detalhe__nome">{produto.nome}</h1>
          <p className="detalhe__descricao">{produto.descricao}</p>
          <p className="detalhe__valor">R$ {produto.valor.toFixed(2).replace('.', ',')}</p>
          <button className="detalhe__btn">ADICIONAR AO CARRINHO</button>
        </div>
      </div>
    </div>
  );
}
