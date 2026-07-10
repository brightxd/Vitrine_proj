import Connection from './Connection.ts';
import Produto from '../Entities/Produto.ts';

class ProdutoDao extends Connection {
    async all() {
        const db = await this.db;
        return db?.all('SELECT * FROM produto');
    }

    async find(id: number) {
        const db = await this.db;
        return db?.get('SELECT * FROM produto WHERE id = ?', [id]);
    }

    async create(produto: Produto) {
        const db = await this.db;
        return db?.run(
            'INSERT INTO produto (nome, descricao, valor, quantidade, tipo_disponibilidade) VALUES (?, ?, ?, ?, ?)',
            [produto.nome, produto.descricao, produto.valor, produto.quantidade, produto.tipo_disponibilidade]
        );
    }

    async byCategoria(id_categoria: number) {
        const db = await this.db;
        return db?.all(
            `SELECT p.* FROM produto p
             INNER JOIN categoria_produto cp ON cp.id_produto = p.id
             WHERE cp.id_categoria = ?`,
            [id_categoria]
        );
    }

    async search(q: string) {
        const db = await this.db;
        const like = `%${q}%`;
        return db?.all(
            `SELECT * FROM produto WHERE nome LIKE ? OR descricao LIKE ?`,
            [like, like]
        );
    }
}

export default new ProdutoDao();
