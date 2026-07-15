import UserDao from "../dao/UserDao.ts";
import User from "../Entities/User.ts";

import jwt from 'jsonwebtoken';

class ControllerUser {
    
    async list() {
        return await UserDao.list();
    }

    async login(data: {email: string, password: string}) {
        const user = await UserDao.login(data);
        const passwordhashed = user.password;
        const isPasswordVerified = await User.verifyPassword(data.password, passwordhashed);
        console.log({isPasswordVerified});
        if (isPasswordVerified) {
            const user = new User(data.email, passwordhashed);
            const token = jwt.sign({
                user: user,
                iat: Date.now()
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h'
            });
            return { token };
        } else return isPasswordVerified;
    }

    async register(data: {email: string, password: string}) {
        const passwordHashed = await User.hashPassword(data.password);
        data.password = passwordHashed;
        return await UserDao.register(data);
    }

}

export default new ControllerUser();