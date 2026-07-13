import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    
    const header = req.headers['authorization'] ?? '';
    if (!header) {
        return res.status(401).json({ message: "Unauthorized - Cabecalho não está presente!! - Seu mané..." });
    }

    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Token não encontrado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!);
        next();
    } catch (err) {
        return res.status(401).json({message: "Unauthorized"});
    }

}