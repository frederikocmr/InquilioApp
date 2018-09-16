import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { UserAccount } from '../../models/user-account';
import { OwnerAccount } from '../../models/owner-account';
import { TenantAccount } from './../../models/tenant-account';

@Injectable()
export class FirebaseProvider {

  public message: string;

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFirestore) {
  }

  public signUp(account: UserAccount, profile: String): Promise<void> {
    

    //Downcasting 
    if(profile == 'owner'){
      account = account as OwnerAccount; 
    } else {
      account = account as TenantAccount; 
    }
  
    
    return this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password).then((user) => {

      this.createNewAccount(account, profile);

      console.log(user);
    })
      .catch((error) => {
        this.message = "Erro ao criar conta: " + error.message;
        console.log(error);
      });
  }


  public signIn(account: UserAccount): Promise<void> {
    return this.afAuth.auth.signInWithEmailAndPassword(account.email, account.password).then((user) => {
      console.log(user);
    }).catch((error) => {
      console.log(error);
    });
  }

  public createNewAccount(account: UserAccount, profile: String): Promise<void>  {
    //Parsing custom object
    var data = JSON.parse(JSON.stringify(account));
    console.log(profile+"!!");
   
    return this.afDb.collection(profile+"Account").add(data).then((ok) => {
      this.message = "Conta criada com sucesso!";
    }).catch((error) => {
      this.message = "Conta criada, porém com erro: " + error;
    });

  }

}