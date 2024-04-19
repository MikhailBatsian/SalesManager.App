import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesData } from '../interfaces/sales-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiHost:string = 'https://localhost:44305';

  constructor(private http:HttpClient) { }

  GetSalesDataTotalCount(filter: any):Observable<number>{
    const params = new HttpParams().appendAll(filter);
    
    return this.http.get<number>(`${this.apiHost}/api/sales/datacount`, {params: params});
  }

  GetSalesData(filter: any):Observable<SalesData[]>{
    const params = new HttpParams().appendAll(filter);
    
    return this.http.get<SalesData[]>(`${this.apiHost}/api/sales/data/`, {params: params});
  }
}
