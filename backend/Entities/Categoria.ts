class Categoria {
    id: number | null;
    nome: string;
    id_categoria: number | null;

    constructor(id: number | null, nome: string, id_categoria: number | null) {
        this.validateNome(nome);
        this.id = id;
        this.nome = nome.trim();
        this.id_categoria = id_categoria;
    }

    validateNome(nome: string) {
        if (nome.trim().length === 0) throw new Error('Nome não pode ser vazio');
    }
}

export default Categoria;
