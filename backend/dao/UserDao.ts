import Connection from "./Connection.ts";

class UserDao extends Connection {

    async list() {
        const db = await this.db;
        return db.all('SELECT * FROM users');
    }

    async login(data: {email: string}) {
        const db = await this.db;
        return db.get('SELECT * FROM users WHERE email = ?', [data.email]);
    }

    async register(data: {email: string, password: string}) {
        const db = await this.db;
        return db.run('INSERT INTO users (email, password) VALUES (?, ?)', [data.email, data.password]);
    }

}

export default new UserDao();