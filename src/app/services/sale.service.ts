import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesData } from '../interfaces/sales-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http:HttpClient) { }

  GetSalesDataTotalCount(filter: any):Observable<number>{
    const params = new HttpParams().appendAll(filter);
    
    return this.http.get<number>('https://localhost:44305/api/sales/datacount', {params: params});
  }

  GetSalesData(filter: any):Observable<SalesData[]>{
    const params = new HttpParams().appendAll(filter);
    
    return this.http.get<SalesData[]>('https://localhost:44305/api/sales/data/', {params: params});
  }
}
