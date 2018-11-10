
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { UserAccount } from '../../models/user-account';
import { OwnerAccount } from '../../models/owner-account';
import { TenantAccount } from './../../models/tenant-account';

@Injectable()
export class FirebaseProvider {
  // TODO: Criar modo de fazer login com email mesmo se já tiver conta google criada para aquele email e vice-versa;
  public message: string = "";
  public validator: boolean = false;
  public rootPage: string;
  public user: any;
  public account: UserAccount;
  public profile: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFirestore) {
    //checking user state.  
    this.validator = false;
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.rootPage = 'rootPage';
        this.user = null;
      } else {
        this.rootPage = 'tabsPage';
        this.user = user;
      }
    });
  }

  public async signUp(account: UserAccount, profile: string): Promise<void> {
    //Downcasting 
    this.profile = profile;
    if (profile == 'owner') {
      this.account = account as OwnerAccount;
    } else {
      this.account = account as TenantAccount;
    }

    return await this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password).then(
      (res) => {
        this.createNewAccount(this.account, this.profile, res.user);
        this.validator = true;
      }
    ).catch((error) => {
      this.message = "Erro ao criar conta: " + error.message;
      this.validator = false;
    });

  }

  public checkIfDocumentExists(doc: string, profile: string): boolean {
    this.afDb.collection(profile+'Account').doc(doc).snapshotChanges().subscribe(res => {

      if (res.payload.exists) {
        return true;
      } else {
        return false;
      }
    });
    // arrumar esta funcao
    return true;
  }

  public createNewAccount(account: UserAccount, profile: string, user: any) {
    //Parsing custom object
    var data = JSON.parse(JSON.stringify(account));

    try {
      if (this.insertDataToDocument(profile + "Account", user.uid, data)) {
        this.message = "Conta criada com sucesso!";
        this.validator = true;
      }
    }
    catch (error) {
      this.message = "Conta criada, porém não salvamos seus dados pessoais, " +
        "por favor edite-os nas configurações!";
      this.validator = false;
    }

  }

  public async signIn(email, password): Promise<void> {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.message = "Login efetuado com sucesso!";
      this.validator = true;
    }
    catch (error) {
      this.message = "Erro ao tentar logar: " + error;
      this.validator = false;
    }
  }

  public async signInWithGoogle(): Promise<void> {
    try {
      await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
        (res) => {
          console.log(res);

          //verificar através do res se isnew, se for então manda prompt
          //através do prompt definir se é owner ou não e pegar para criar nova conta..
          if (!(this.checkIfDocumentExists(res.user.uid, 'owner') && this.checkIfDocumentExists(res.user.uid, 'tenant'))) {
            this.createNewAccount(this.account, this.profile, res.user);
            this.validator = true;
          }

          this.message = "Login efetuado com sucesso! Seja bem vindo " +
            (res.user.displayName ? res.user.displayName : '') + "!";
          this.validator = true;
        }
      );

    }
    catch (error) {
      this.message = "Erro ao tentar logar: " + error;
      this.validator = false;
    }
  }

  public async insertDataToDocument(collection, document, data): Promise<void> {
    var parsedData = JSON.parse(JSON.stringify(data));

    try {
      await this.afDb.collection(collection).doc(document).set(parsedData);
      this.message = "Dados gravados com sucesso!";
      this.validator = true; // ?
    }
    catch (error) {
      this.message = "Erro na gravação: " + error;
      this.validator = false; //?
    }
  }

  public async insertDataToCollection(collection, data): Promise<void> {
    var parsedData = JSON.parse(JSON.stringify(data));

    try {
      await this.afDb.collection(collection).add(parsedData);
      this.message = "Dados gravados com sucesso!";
      this.validator = true; // ?
    }
    catch (error) {
      this.message = "Erro na gravação: " + error;
      this.validator = false; //?
    }
  }

  public async updateDataFromCollection(collection, data): Promise<void> {
    var parsedData = JSON.parse(JSON.stringify(data));

    try {
      await this.afDb.collection(collection).doc(data.id).update(parsedData);
      this.message = "Dados gravados com sucesso!";
      this.validator = true; // ?
    }
    catch (error) {
      this.message = "Erro na gravação: " + error;
      this.validator = false; //?
    }
  }

  public async deactivateDataFromCollection(collection, data): Promise<void> {
    data.active = false;
    var parsedData = JSON.parse(JSON.stringify(data));

    try {
      await this.afDb.collection(collection).doc(data.id).update(parsedData);
      this.message = "Dados desativados com sucesso!";
      this.validator = true; // ?
    }
    catch (error) {
      this.message = "Erro na gravação: " + error;
      this.validator = false; //?
    }
  }

  public async deleteDataFromCollection(collection, id): Promise<void> {
    try {
      await this.afDb.collection(collection).doc(id).delete();
      this.message = "Dados excluídos com sucesso!";
      this.validator = true;
    }
    catch (error) {
      this.message = "Erro na exclusão: " + error;
      this.validator = false;
      console.log(error);
    }
  }

  public signOut() {
    this.afAuth.auth.signOut();
  }

}