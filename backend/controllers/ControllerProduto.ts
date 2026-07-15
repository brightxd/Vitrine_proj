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
        const produtoCriado = await ProdutoDao.create(produto);
        console.log({ produtoCriado });
        return produto;
    }

    async update(data: {
        id: number; nome: string; descricao: string; valor: number;
        quantidade: number; tipo_disponibilidade: number;
        imagem_url?: string | null; id_subcategoria?: number;
    }) {
        if (data.id == null) return new Error("Id do produto está faltando");
        const produto = new Produto(data.id, data.nome, data.descricao, data.valor, data.quantidade, data.tipo_disponibilidade, data.imagem_url ?? null);
        await ProdutoDao.update(produto);
        if (data.id_subcategoria != null)
            await ProdutoDao.updateSubcategoria(data.id, data.id_subcategoria);
        return produto;
    }

    async createWithSubcategoria(data: {
        nome: string; descricao: string; valor: number;
        quantidade: number; tipo_disponibilidade: number;
        imagem_url?: string | null; id_subcategoria: number;
    }) {
        const produto = new Produto(null, data.nome, data.descricao, data.valor, data.quantidade, data.tipo_disponibilidade, data.imagem_url ?? null);
        const result = await ProdutoDao.create(produto) as { lastID: number } | undefined;
        if (!result?.lastID) throw new Error('Falha ao criar produto');
        await ProdutoDao.linkSubcategoria(result.lastID, data.id_subcategoria);
        return { ...produto, id: result.lastID };
    }

    async byCategoria(id_categoria: number) {
        return await ProdutoDao.byCategoria(id_categoria);
    }

    async search(q: string) {
        return await ProdutoDao.search(q);
    }
}

export default new ControllerProduto();
