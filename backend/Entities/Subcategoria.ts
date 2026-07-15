class Subcategoria {
    id: number | null;
    nome: string;
    id_categoria: number;
    img: string | null;

    constructor(id: number | null, nome: string, id_categoria: number, img: string | null = null) {
        this.validateNome(nome);
        this.id = id;
        this.nome = nome.trim();
        this.id_categoria = id_categoria;
        this.img = img;
    }

    validateNome(nome: string) {
        if (nome.trim().length === 0) throw new Error('Nome não pode ser vazio');
    }
}

export default Subcategoria;
