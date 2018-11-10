export class UserAccount {
    public id: string;
    public name: string;
    public document: string;
    public email: string;
    public phone: string;
    public birthdate: string;
    public genre: string;
    public password: string;
    public photoURL: string;
    public active: boolean;

    constructor() {
        this.id = null;
        this.name = null;
        this.document = null; 
        this.email = null;
        this.phone = null;
        this.birthdate = null;
        this.genre = null;
        this.password = null;
        this.photoURL = '../../assets/imgs/user-y500.png';
        this.active = true;
    }

}