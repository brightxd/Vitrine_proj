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
    <div
      style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(21,101,192,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Placeholder imagem */}
      <div style={{
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {produto.imagem_url
          ? <img src={produto.imagem_url} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '3rem' }}>📦</span>
        }
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: disponivel ? '#42A5F5' : '#1565C0',
          color: '#fff', fontSize: '0.7rem', fontWeight: 700,
          padding: '3px 8px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: 0.5
        }}>
          {disponivel ? 'Pronta Entrega' : 'Encomenda'}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '0.9rem' }}>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Estoque: {produto.quantidade}
        </p>
        <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '0.95rem', color: '#222', lineHeight: 1.3 }}>
          {produto.nome}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#666', lineHeight: 1.4 }}>
          {produto.descricao}
        </p>
        <p style={{ margin: '10px 0 0', fontWeight: 800, fontSize: '1.05rem', color: '#1565C0' }}>
          R$ {produto.valor.toFixed(2)}
        </p>
        <button style={{
          marginTop: '0.7rem', width: '100%', background: '#1565C0', color: '#fff',
          border: 'none', padding: '9px', borderRadius: 3,
          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
          letterSpacing: 0.5, textTransform: 'uppercase'
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0D47A1')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1565C0')}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
