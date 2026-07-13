import bcrypt from 'bcrypt';

const SALT_ROUNDS:number = 10;

class User {
    
    email:string;
    password:string;

    constructor(email:string, password:string){
        this.email = email;
        this.password = password;
    }

    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        console.log(password, hash);
        return await bcrypt.compare(password, hash);
    }

}

export default User;