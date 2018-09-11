//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { UserAccount } from '../../models/user-account';

@Injectable()
export class FirebaseProvider {

  public message: string;

  constructor(private afAuth: AngularFireAuth) {
  }

  signUp(account: UserAccount): Promise<void> {
    console.log(account);
    return this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password).then((user) => {
      this.message = "Conta criada com sucesso!";
      console.log(user);
    })
      .catch((error) => {
        this.message = "Erro ao criar conta: " + error.message;
        console.log(error);
      });
  }


  signIn(account: UserAccount): Promise<void> {
    return this.afAuth.auth.signInWithEmailAndPassword(account.email, account.password).then((user) => {

      console.log(user);
    }).catch((error) => {
      console.log(error);
    })
  }

}