export class UserAccount {
    public profile: string;
    public name: string;
    public document: string;
    public email: string;
    public phone: number;
    public birthdate: string;
    public genre: string;
    public password: string;


    constructor(
        profile: string,
        name: string,
        document: string,
        email: string,
        phone: number,
        birthdate: string,
        genre: string,
        password: string) {

        this.profile = profile;
        this.name = name;
        this.document = document; 
        this.email = email;
        this.phone = phone;
        this.birthdate = birthdate;
        this.genre = genre;
        this.password = password;
    }

}