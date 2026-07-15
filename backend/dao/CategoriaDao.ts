import type Categoria from '../Entities/Categoria.ts';
import type Subcategoria from '../Entities/Subcategoria.ts';
import Connection from './Connection.ts';

class CategoriaDao extends Connection {
    async allCategorias() {
        const db = await this.db;
        return db?.all('SELECT * FROM categorias');
    }

    async allSubcategorias() {
        const db = await this.db;
        return db?.all('SELECT * FROM subcategorias');
    }

    async subcategoriasByGenero(catId: number) {
        const db = await this.db;
        return db?.all('SELECT * FROM subcategorias WHERE id_categoria = ?', [catId]);
    }

    async update({ id, nome, id_categoria, img}: Categoria) {
        const db = await this.db;
        return db?.run(
            'UPDATE categorias SET nome = ?, id_categoria = ?, img = ? WHERE id = ?',
            [nome, id_categoria, img, id]
        );
    }

    async updateSubcategoria({ id, nome, id_categoria, img }: Subcategoria) {
        const db = await this.db;
        return db?.run(
            'UPDATE subcategorias SET nome = ?, id_categoria = ?, img = ? WHERE id = ?',
            [nome, id_categoria, img ?? null, id]
        );
    }

    async createSubcategoria({ nome, id_categoria, img }: Subcategoria) {
        const db = await this.db;
        return db?.run(
            'INSERT INTO subcategorias (nome, id_categoria, img) VALUES (?, ?, ?)',
            [nome, id_categoria, img ?? null]
        );
    }

    async createCategoria({ nome, img }: { nome: string; img?: string | null }) {
        const db = await this.db;
        return db?.run(
            'INSERT INTO categorias (nome, id_categoria, img) VALUES (?, NULL, ?)',
            [nome, img ?? null]
        );
    }
}

export default new CategoriaDao();
