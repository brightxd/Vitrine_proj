import Connection from './Connection.ts';
import Produto from '../Entities/Produto.ts';

class ProdutoDao extends Connection {
    async all() {
        const db = await this.db;
        return db?.all(
            `SELECT p.*, cp.id_categoria AS id_subcategoria
             FROM produto p
             LEFT JOIN categoria_produto cp ON cp.id_produto = p.id`
        );
    }

    async find(id: number) {
        const db = await this.db;
        return db?.get('SELECT * FROM produto WHERE id = ?', [id]);
    }

    async create(produto: Produto) {
        const db = await this.db;
        return db?.run(
            'INSERT INTO produto (nome, descricao, valor, quantidade, tipo_disponibilidade, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
            [produto.nome, produto.descricao, produto.valor, produto.quantidade, produto.tipo_disponibilidade, produto.imagem_url ?? null]
        );
    }

    async update(produto: Produto) {
        const db = await this.db;
        return db?.run(
            'UPDATE produto SET nome = ?, descricao = ?, valor = ?, quantidade = ?, tipo_disponibilidade = ?, imagem_url = ? WHERE id = ?',
            [produto.nome, produto.descricao, produto.valor, produto.quantidade, produto.tipo_disponibilidade, produto.imagem_url ?? null, produto.id]
        );
    }

    async updateSubcategoria(id_produto: number, id_subcategoria: number) {
        const db = await this.db;
        await db?.run('DELETE FROM categoria_produto WHERE id_produto = ?', [id_produto]);
        return db?.run(
            'INSERT INTO categoria_produto (id_produto, id_categoria) VALUES (?, ?)',
            [id_produto, id_subcategoria]
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

    async linkSubcategoria(id_produto: number, id_subcategoria: number) {
        const db = await this.db;
        return db?.run(
            'INSERT INTO categoria_produto (id_produto, id_categoria) VALUES (?, ?)',
            [id_produto, id_subcategoria]
        );
    }
}

export default new ProdutoDao();
