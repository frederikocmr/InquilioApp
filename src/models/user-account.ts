export class UserAccount {
    public name: string;
    public document: string;
    public email: string;
    public phone: number;
    public birthdate: string;
    public genre: string;
    public password: string;
    public active: boolean;

    constructor(
        name: string,
        document: string,
        email: string,
        phone: number,
        birthdate: string,
        genre: string,
        password: string) {
        this.name = name;
        this.document = document; 
        this.email = email;
        this.phone = phone;
        this.birthdate = birthdate;
        this.genre = genre;
        this.password = password;
        this.active = true;
    }

}