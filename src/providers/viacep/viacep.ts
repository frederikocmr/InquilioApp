import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ViacepProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ViacepProvider {

  constructor(public http: HttpClient) {
  }
  
  callService(cep:String):any {
      return this.http.get(`http://viacep.com.br/ws/` + cep + `/json/`)
    }

}