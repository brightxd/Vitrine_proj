export type SubSub = {
    id: number;
    nome: string;
    id_subcategoria: number;
};

export type Sub = {
    id: number;
    nome: string;
    id_categoria: number;
    subSubs: SubSub[];
};

export type Categoria = {
    id: number;
    nome: string;
    subs: Sub[];
};


export const MOCK_CATEGORY: Categoria[] = [
    {
        id: 1,
        nome: 'CASA',
        subs: [
            { id: 1, nome: 'Sala', id_categoria: 1, subSubs: [{ id: 1, nome: 'Sofás', id_subcategoria: 1 }, { id: 2, nome: 'Mesas', id_subcategoria: 1 }] },
            { id: 2, nome: 'Cozinha', id_categoria: 1, subSubs: [{ id: 3, nome: 'Utensílios', id_subcategoria: 2 }, { id: 4, nome: 'Eletrodomésticos', id_subcategoria: 2 }] },
            { id: 3, nome: 'Quarto', id_categoria: 1, subSubs: [{ id: 5, nome: 'Camas', id_subcategoria: 3 }, { id: 6, nome: 'Guarda-roupas', id_subcategoria: 3 }] },
        ],
    },
    {
        id: 2,
        nome: 'VESTUÁRIO',
        subs: [
            { id: 4, nome: 'Camisetas', id_categoria: 2, subSubs: [{ id: 7, nome: 'Manga Curta', id_subcategoria: 4 }, { id: 8, nome: 'Manga Longa', id_subcategoria: 4 }, { id: 9, nome: 'Polo', id_subcategoria: 4 }] },
            { id: 5, nome: 'Calças', id_categoria: 2, subSubs: [{ id: 10, nome: 'Jeans', id_subcategoria: 5 }, { id: 11, nome: 'Moletom', id_subcategoria: 5 }, { id: 12, nome: 'Social', id_subcategoria: 5 }] },
            { id: 6, nome: 'Vestidos', id_categoria: 2, subSubs: [{ id: 13, nome: 'Casual', id_subcategoria: 6 }, { id: 14, nome: 'Festa', id_subcategoria: 6 }] },
            { id: 7, nome: 'Blusas', id_categoria: 2, subSubs: [{ id: 15, nome: 'Moletom', id_subcategoria: 7 }, { id: 16, nome: 'Regata', id_subcategoria: 7 }] },
        ],
    },
    {
        id: 3,
        nome: 'JARDIM',
        subs: [
            { id: 8, nome: 'Plantas', id_categoria: 3, subSubs: [{ id: 17, nome: 'Internas', id_subcategoria: 8 }, { id: 18, nome: 'Externas', id_subcategoria: 8 }] },
            { id: 9, nome: 'Ferramentas', id_categoria: 3, subSubs: [{ id: 19, nome: 'Manuais', id_subcategoria: 9 }, { id: 20, nome: 'Elétricas', id_subcategoria: 9 }] },
        ],
    },
];

export const MOCK_PRODUTOS = [
    { id: 1, nome: 'Camiseta Básica', descricao: 'Camiseta 100% algodão', valor: 49.90, id_subsub: 7, imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
    { id: 2, nome: 'Camiseta Polo', descricao: 'Polo slim fit', valor: 89.90, id_subsub: 9, imagem: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80' },
    { id: 3, nome: 'Calça Jeans', descricao: 'Jeans slim fit', valor: 129.90, id_subsub: 10, imagem: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
    { id: 4, nome: 'Calça Moletom', descricao: 'Moletom confortável', valor: 99.90, id_subsub: 11, imagem: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80' },
    { id: 5, nome: 'Vestido Floral', descricao: 'Vestido leve de verão', valor: 89.90, id_subsub: 13, imagem: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80' },
    { id: 6, nome: 'Blusa Regata', descricao: 'Regata feminina', valor: 39.90, id_subsub: 16, imagem: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80' },
    { id: 7, nome: 'Sofá 3 Lugares', descricao: 'Sofá de couro', valor: 1299.90, id_subsub: 1, imagem: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
    { id: 8, nome: 'Camiseta Manga Longa', 'descricao': 'Algodão premium', valor: 69.90, id_subsub: 8, imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },

];