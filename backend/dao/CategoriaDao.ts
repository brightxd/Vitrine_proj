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
}

export default new CategoriaDao();
