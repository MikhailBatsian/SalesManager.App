import { Component, ViewChild} from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChartComponent } from '../chart/chart.component';
import { SaleService } from '../../services/sale.service';

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

  selectedDateInterval: string = 'quarter';
  shouldHideBtnPrevious: boolean = true;
  shouldHideBtnNext: boolean = false;

  salesAmounts: Number[] = [];
  startDates: string[] =[];

  @ViewChild(ChartComponent) chart!:ChartComponent;

  constructor(private service: SaleService,  private datePipe: DatePipe) {
    const filter = this.getFilter();
    this.fetchSalesData(filter);
  }

  onChangeDateInterval(value: any){
    this.resetElementsCounter();

    const filter = this.getFilter();
    filter.timeInterval = value;
    this.fetchSalesData(filter);
  }

  onChangeStartDate(){

  }
  
  onChangeEndDate(){

  }

  resetZoom(){
    this.chart.ResetZoom();
  }

  resetElementsCounter(){
    this.skipElementsCounter = 0;
  }

  getNexData(){
    this.resetZoom();
    this.skipElementsCounter = this.skipElementsCounter + this.takeElementsCount;
    const filter = this.getFilter();
    this.fetchSalesData(filter);
  }

  getPreviousData(){
    this.resetZoom();
    //todo: in future version refactor to get saledata from cache
    this.skipElementsCounter = this.skipElementsCounter - this.takeElementsCount;
    const filter = this.getFilter();
    this.fetchSalesData(filter);
  }

  getFilter(){
    let filter = {
      skip: this.skipElementsCounter,
      take: this.takeElementsCount,
      timeInterval: this.selectedDateInterval,
      startDate: "2020-01-02 00:00:00.0000000",
      endDate: "2022-03-23 00:00:00.0000000"
    };

    return filter;
  }

  fetchSalesData(filter: any){
    this.service.GetSalesAmounts(filter).subscribe(response => {
      if(!response.length) {
        this.shouldHideBtnNext = true;
        alert("No any data");
        return;
      }

      this.shouldHideBtnPrevious = !this.skipElementsCounter;
      this.shouldHideBtnNext = response.length < this.takeElementsCount;

      this.startDates = response.map(x => this.datePipe.transform(x.periodStartDate, 'MM/dd/yyyy')!);
      this.salesAmounts = response.map(x => x.salesAmount);
    });
  }
}
