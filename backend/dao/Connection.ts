import { open, type Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

class Connection {
    private _db: Promise<Database> | null = null;

    protected get db(): Promise<Database> {
        if (!this._db) {
            const dbPath = process.env.DATABASE_PATH;
            if (!dbPath) {
                console.error('❌ ERRO: DATABASE_PATH não definido no .env');
                return Promise.reject(new Error('DATABASE_PATH não definido'));
            }
            const fullPath = resolve(dbPath);
            console.log(`Conectando ao banco: ${fullPath}`);
            this._db = open({ driver: sqlite3.Database, filename: fullPath });
        }
        return this._db;
    }

    async close() {
        const db = await this._db;
        await db?.close();
        this._db = null;
    }
}

export default Connection;
