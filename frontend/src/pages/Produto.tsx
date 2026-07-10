import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PRODUTOS } from "../mock";


export default function Produto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const produto = MOCK_PRODUTOS.find(p => p.id === Number(id));

    if (!produto) return <p>Produto não encontrado</p>
    return (
        <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem', display: 'flex', gap: '2rem' }}>
            <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '1rem', left: '1rem' }}>← Voltar</button>

            <img src={produto.imagem} alt={produto.nome} style={{ width: 420, height: 500, objectFit: 'cover', borderRadius: 8 }} />

            <div>
                <h1>{produto.nome}</h1>
                <p style={{ color: '#666' }}>{produto.descricao}</p>
                <p style={{ fontSize: '2rem', color: '#c00', fontWeight: 700 }}>
                    R$ {produto.valor.toFixed(2).replace('.', ',')}
                </p>
                <button style={{ marginTop: '1rem', padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, fontSize: '1rem', cursor: 'pointer' }}>
                    ADICIONAR AO CARRINHO
                </button>
            </div>
        </div>
    );
}