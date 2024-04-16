import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesAmount } from '../interfaces/sales-amount';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http:HttpClient) { }

  GetSalesAmounts(filter: any):Observable<SalesAmount[]>{

    const params = new HttpParams().appendAll(filter);//({fromObject: filter})
    return this.http.get<SalesAmount[]>('https://localhost:44305/api/sales/amounts/', {params: params});
  }
}
