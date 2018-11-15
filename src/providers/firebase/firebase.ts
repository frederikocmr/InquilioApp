
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

import 'rxjs/add/operator/toPromise';
import 'firebase/storage';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { UiProvider } from './../ui/ui';

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
  public userData: UserAccount;

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFirestore,
    private afStorage: AngularFireStorage,
    private ui: UiProvider) {
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
    
    this.afDb.collection('ownerAccount').doc(doc).snapshotChanges().subscribe(res => {
      if (res.payload.exists) {
        console.log(res);
      } else {
        this.afDb.collection('tenantAccount').doc(doc).snapshotChanges().subscribe(res => {
          if (res.payload.exists) {
            console.log(res);
          } else {
            console.log('nao encontrado.')
          }
        });
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

  public async signInWithGoogle(): Promise<any> {
    return await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

   
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
    console.log(parsedData);
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

  public async deleteDataFromArrayInDocument(collection, id, dataToBeRemoved): Promise<void> {
 
    try {
      await this.afDb.collection(collection).doc(id).update({
        HistoryArray : firebase.firestore.FieldValue.arrayRemove(dataToBeRemoved)
    });
      
    }
    catch (error) {
      this.message = "Erro na exclusão: " + error;
      this.validator = false;
      console.log(error);
    }
  }

  public getUserData(uid: string, loading: boolean): void {
    if(loading) { this.ui.showLoading(); }
    this.afDb.doc<OwnerAccount>('ownerAccount/' + uid).valueChanges().subscribe(data => {
      if (data) {
        this.userData = data;
        if(loading) { this.ui.closeLoading();}
      } else {
        this.afDb.doc<OwnerAccount>('tenantAccount/' + uid).valueChanges().subscribe(data => {
          if (data) {
            this.userData = data;
            if(loading) { this.ui.closeLoading();}
          } else {
            this.ui.closeLoading();
            if(loading) { this.ui.closeLoading();}
          }
        });
      }
    });
    
  }

  public signOut() {
    this.afAuth.auth.signOut();
  }

  public encodeImageUri(imageUri) {
    var c=document.createElement('canvas');
    var ctx=c.getContext("2d");
    var img=new Image();
    img.onload = function(){
      var aux:any = this;
      c.width=aux.width;
      c.height=aux.height;
      ctx.drawImage(img, 0,0);
    };
    img.src=imageUri;
    var dataURL = c.toDataURL("image/jpeg");
    return dataURL;
  };

  public uploadImage(imageURI, imageName){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('images').child('imageName');

        this.ui.showToast("image64:" + this.encodeImageUri(imageURI),3, 'top');
        imageRef.putString(this.encodeImageUri(imageURI), 'data_url')
        .then(snapshot => {
          this.ui.showToast("Snapshot:" + snapshot,3, 'top');
          resolve(snapshot.downloadURL);
        }, err => {
          reject(err);
        }).catch()
   
    })
  }

  // TODO: Ajustar dado que está sendo salvo no banco. (verificar existentes)
  // Ajustar quando é acionado essa função para fazer upload: somente após imovel cadastrado no bd.
  // Ajustar mensagens e escolher o melhor metodo que funciona.

  public uploadToStorage(imageURI) {
    let newName = `${new Date().getTime()}.txt`;
      let upload = this.afStorage.ref(`images/${newName}`).putString(this.encodeImageUri(imageURI));
 
      // Perhaps this syntax might change, it's no error here!
      upload.then().then(res => {
        // this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
          this.ui.showToast("Adicionado" + res,3, 'top');
        // });
      });
   
  }


}