import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { UserAccount } from '../../models/user-account';
import { OwnerAccount } from '../../models/owner-account';
import { TenantAccount } from './../../models/tenant-account';

@Injectable()
export class FirebaseProvider {

  public message: string = "";
  public validator: boolean = false;
  public displayName: string; 
  user: firebase.auth.UserCredential;

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFirestore) {
    //checking user state.
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;        
        return;
      }
      this.displayName = user.displayName;      
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
    console.log(profile+"!!");
   
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
      this.user = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
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
      this.user = await this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());
      this.message = "Login efetuado com sucesso! Seja bem vindo, " + this.displayName + "!";
      this.validator = true;
    }
    catch (error) {
      this.message = "Erro ao tentar logar: " + error;
      this.validator = false;
    }
  }


  public signOut() {
    this.afAuth.auth.signOut();
  }

}