import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

class Connection {
    protected db;

    constructor() {
        const dbPath = process.env.DATABASE_PATH;

        if (!dbPath) {
            console.error('❌ ERRO: DATABASE_PATH não definido no .env');
            return;
        }

        const fullPath = resolve(dbPath);
        console.log(`Conectando ao banco: ${fullPath}`);
        this.db = open({
            driver: sqlite3.Database,
            filename: fullPath
        });
    }

    async close() {
        const db = await this.db;
        await db?.close();
    }
}

export default Connection;
