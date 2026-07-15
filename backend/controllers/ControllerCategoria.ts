import CategoriaDao from '../dao/CategoriaDao.ts';
import type Categoria from '../Entities/Categoria.ts';
import type Subcategoria from '../Entities/Subcategoria.ts';

class ControllerCategoria {
    async listCategorias() {
        return await CategoriaDao.allCategorias();
    }

    async listSubcategorias() {
        return await CategoriaDao.allSubcategorias();
    }

    async subcategoriasByGenero(catId: number) {
        return await CategoriaDao.subcategoriasByGenero(catId);
    }

    async update(categoria: Categoria){
        if (categoria.id == null)
            return new Error("Id categoria não pode ser nulo");
        return await CategoriaDao.update(categoria);
    }

    async updateSubcategoria(subcategoria: Subcategoria) {
        if (subcategoria.id == null)
            return new Error("Id subcategoria não pode ser nulo");
        return await CategoriaDao.updateSubcategoria(subcategoria);
    }

    async createSubcategoria(subcategoria: Subcategoria) {
        return await CategoriaDao.createSubcategoria(subcategoria);
    }

    async createCategoria(nome: string, img?: string | null) {
        if (!nome.trim()) throw new Error('Nome não pode ser vazio');
        return await CategoriaDao.createCategoria({ nome: nome.trim(), img: img ?? null });
    }
}

export default new ControllerCategoria();
