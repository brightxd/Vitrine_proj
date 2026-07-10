import CategoriaDao from '../dao/CategoriaDao.ts';

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
}

export default new ControllerCategoria();
