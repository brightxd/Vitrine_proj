import ProdutoDao from '../dao/ProdutoDao.ts';
import Produto from '../Entities/Produto.ts';

class ControllerProduto {
    async list() {
        return await ProdutoDao.all();
    }

    async find(id: number) {
        return await ProdutoDao.find(id);
    }

    async create(produto: Produto) {
        await ProdutoDao.create(produto);
        return produto;
    }

    async byCategoria(id_categoria: number) {
        return await ProdutoDao.byCategoria(id_categoria);
    }

    async search(q: string) {
        return await ProdutoDao.search(q);
    }
}

export default new ControllerProduto();
