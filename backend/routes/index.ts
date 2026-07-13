import { Router, type Request, type Response } from 'express';
import ControllerProduto from '../controllers/ControllerProduto.ts';
import ControllerCategoria from '../controllers/ControllerCategoria.ts';
import Produto from '../Entities/Produto.ts';
import AuthMiddleware from '../middleware/authmiddleware.ts';
import ControllerUser from '../controllers/ControllerUser.ts';

const router = Router();

router.get('/produtos', async (_req: Request, resp: Response) => {
    try {
        const data = await ControllerProduto.list();
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/produtos', AuthMiddleware, async (req: Request, resp: Response) => {
    try {
        const { data } = req.body;
        const produto = new Produto(null, data.nome, data.descricao, data.valor, data.quantidade, data.tipo_disponibilidade);
        const returnData = await ControllerProduto.create(produto);
        resp.status(201).json(returnData);
    } catch (error) {
        console.error(error);
        resp.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar produto' });
    }
});

router.get('/produtos/categoria/:id', async (req: Request, resp: Response) => {
    try {
        const id = Number(req.params.id);
        const data = await ControllerProduto.byCategoria(id);
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/produtos/:id', async (req: Request, resp: Response) => {
    try {
        const id = Number(req.params.id);
        const data = await ControllerProduto.find(id);
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/busca', async (req: Request, resp: Response) => {
    try {
        const q = String(req.query['q'] ?? '');
        const data = await ControllerProduto.search(q);
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/categorias', async (_req: Request, resp: Response) => {
    try {
        const data = await ControllerCategoria.listCategorias();
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/subcategorias', async (_req: Request, resp: Response) => {
    try {
        const data = await ControllerCategoria.listSubcategorias();
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/subcategorias/genero/:catId', async (req: Request, resp: Response) => {
    try {
        const catId = Number(req.params.catId);
        const data = await ControllerCategoria.subcategoriasByGenero(catId);
        resp.json(data);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

//router.post('/create/product', AuthMiddleware, () => {});

router.post('/auth/register', async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        const response = await ControllerUser.register(data);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        const response = await ControllerUser.login(data);
        if (response === false)
            return res.sendStatus(401);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
