import { Component, ViewChild } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule, MatDatepicker  } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChartComponent } from '../chart/chart.component';
import { SaleService } from '../../services/sale.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, ChartComponent, MatButton, MatMiniFabButton, MatIcon, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule],
  providers: [DatePipe, provideNativeDateAdapter()],
  templateUrl: './sales-chart.component.html',
  styleUrl: './sales-chart.component.css'
})

export class SalesChartComponent {
  private skipElementsCounter: number = 0
  private takeElementsCount: number = 15;
  
  dateIntervals: any[] = [
    {id: 'quarter', viewValue: 'Quarter'},
    {id: 'month', viewValue: 'Month'},
    {id: 'week', viewValue: "Week"},
    {id: 'dayofyear', viewValue: 'Day'}
  ];

  periodStartDate!: Date;
  periodEndDate!: Date;
  selectedDateInterval: string = 'quarter';
  shouldShowBtnPrevious: boolean = true;
  shouldShowBtnNext: boolean = false;

  startDates: string[] = [];
  salesAmounts: number[] = [];
  salesCounts: number[] = [];
  salesDataTotalCount: number = 0;
  
  isStartDateInvalid: boolean = false;
  isEndDateInvalid: boolean = false;

  @ViewChild(ChartComponent) chart!:ChartComponent;

  constructor(private salesService: SaleService,  private datePipe: DatePipe) {
  }

  async onChangeDateInterval(value: any){
    this.resetElementsCounter();

    const filter = this.getFilter();
    filter.timeInterval = value;

    await this.fetchSalesDataOnControlChange(filter);
  }

  onChangeStartDate(value: any){
    if(this.periodStartDate > this.periodEndDate){
      this.isStartDateInvalid = true;
      return;
    }else{
      this.isStartDateInvalid = false;
    }

    this.resetElementsCounter();

    const filter = this.getFilter();
    this.fetchSalesDataOnControlChange(filter);
  }

  onChangeEndDate(value: any){
    if(this.periodEndDate < this.periodStartDate){
      this.isEndDateInvalid = true;
      return;
    }else{
      this.isEndDateInvalid = false;
    }

    this.resetElementsCounter();
    const filter = this.getFilter();
    this.fetchSalesDataOnControlChange(filter);
  }

  //todo: a future version may be refactored to fetch sales data from cache
  getPreviousData(){
    this.skipElementsCounter = this.skipElementsCounter - this.takeElementsCount;

    const filter = this.getFilter();
    this.fetchSalesData(filter);
  }

  getNexData(){
    this.skipElementsCounter = this.skipElementsCounter + this.takeElementsCount;

    const filter = this.getFilter();
    this.fetchSalesData(filter);
  }
  
  resetZoom(){
    if(this.chart){
      this.chart.ResetZoom();
    }
  }

  resetElementsCounter(){
    this.skipElementsCounter = 0;
  }

  getFilter(){
    let filter = {
      skip: this.skipElementsCounter,
      take: this.takeElementsCount,
      timeInterval: this.selectedDateInterval,
      startDate:  this.datePipe.transform(this.periodStartDate, 'yyyy-MM-dd HH:mm:ss'),
      endDate:  this.datePipe.transform(this.periodEndDate, 'yyyy-MM-dd HH:mm:ss')
    };

    return filter;
  }

  async fetchSalesDataOnControlChange(filter: any){
    if(!this.periodStartDate || !this.periodEndDate || !this.selectedDateInterval){
      return;
    }

    this.salesDataTotalCount = await firstValueFrom(this.salesService.GetSalesDataTotalCount(filter));
    await this.fetchSalesData(filter);
  }

  async fetchSalesData(filter: any){
    this.resetZoom();

    const salesData = await firstValueFrom(this.salesService.GetSalesData(filter));
    this.startDates = salesData.map(x => this.datePipe.transform(x.periodStartDate, 'MM/dd/yyyy')!);
    this.salesAmounts = salesData.map(x => x.salesAmount);
    this.salesCounts = salesData.map(x => x.count);

    this.shouldShowBtnPrevious = this.skipElementsCounter > 0;
    this.shouldShowBtnNext = this.salesDataTotalCount > this.takeElementsCount 
      && this.skipElementsCounter + this.takeElementsCount < this.salesDataTotalCount;
  }
}
