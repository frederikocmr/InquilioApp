import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { UserAccount } from '../../models/user-account';
import { OwnerAccount } from '../../models/owner-account';
import { TenantAccount } from './../../models/tenant-account';

@Injectable()
export class FirebaseProvider {

  public message: string = "";
  public validator: boolean = false;
  public rootPage: string; 
  public user: any;

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFirestore) {
    //checking user state.  
      
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

  public async signUp(account: UserAccount, profile: String): Promise<void> {
    //Downcasting 
    if(profile == 'owner'){
      account = account as OwnerAccount; 
    } else {
      account = account as TenantAccount;
    }

    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password);
      this.createNewAccount(account, profile);
      console.log(user);
      this.validator = true;
    }
    catch (error) {
      this.message = "Erro ao criar conta: " + error.message;
      this.validator = false;
      console.log(error);
    }
  }

  public async createNewAccount(account: UserAccount, profile: String): Promise<void>  {
    //Parsing custom object
    var data = JSON.parse(JSON.stringify(account));
   
    try {
      if (await this.afDb.collection(profile + "Account").add(data)){
        this.message = "Conta criada com sucesso!";
        this.validator = true;
      }
    }
    catch (error) {
      this.message = "Conta criada, porém com erro: " + error;
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
      await this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());
      this.message = "Login efetuado com sucesso! Seja bem vindo!";
      this.validator = true;
    }
    catch (error) {
      this.message = "Erro ao tentar logar: " + error;
      this.validator = false;
    }
  }

  public insertDataToCollection(collection, data){
    var parsedData = JSON.parse(JSON.stringify(data));
   
    try {
      if (this.afDb.collection(collection).add(parsedData)){
        this.message = "Dados gravados com sucesso!";
        this.validator = true; // ?
      }
    }
    catch (error) {
      this.message = "Erro na gravação: " + error;
      this.validator = false; //?
    }

  }

  public signOut() {
    this.afAuth.auth.signOut();
  }

}