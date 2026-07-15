class Produto {
    id: number | null;
    nome: string;
    descricao: string;
    valor: number;
    quantidade: number;
    tipo_disponibilidade: number;
    imagem_url: string | null;

    constructor(
        id: number | null,
        nome: string,
        descricao: string,
        valor: number,
        quantidade: number,
        tipo_disponibilidade: number,
        imagem_url: string | null = null
    ) {
        this.validateNome(nome);
        this.validateValor(valor);
        this.validateQuantidade(quantidade);
        this.validateTipo(tipo_disponibilidade);

        this.id = id;
        this.nome = nome.trim();
        this.descricao = descricao.trim();
        this.valor = valor;
        this.quantidade = quantidade;
        this.tipo_disponibilidade = tipo_disponibilidade;
        this.imagem_url = imagem_url;
    }

    validateNome(nome: string) {
        if (nome.trim().length === 0) throw new Error('Nome não pode ser vazio');
    }

    validateValor(valor: number) {
        if (valor <= 0) throw new Error('Valor deve ser maior que zero');
    }

    validateQuantidade(quantidade: number) {
        if (quantidade < 0) throw new Error('Quantidade não pode ser negativa');
    }

    validateTipo(tipo: number) {
        if (tipo !== 0 && tipo !== 1) throw new Error('Tipo de disponibilidade deve ser 0 (Pronta Entrega) ou 1 (Encomenda)');
    }
}

export default Produto;
