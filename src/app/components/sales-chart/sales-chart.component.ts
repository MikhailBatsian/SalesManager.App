import { Component, ViewChild} from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ChartComponent } from '../chart/chart.component';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, ChartComponent, MatButton, MatMiniFabButton, MatIcon],
  providers: [DatePipe],
  templateUrl: './sales-chart.component.html',
  styleUrl: './sales-chart.component.css'
})

export class SalesChartComponent {
  private skipElementsCounter: number = 0
  private takeElements: number = 15;

  shouldHideBtnPrevious: boolean = true;
  shouldHideBtnNext: boolean = false;

  salesAmounts: Number[] = [];
  startDates: string[] =[];

  @ViewChild(ChartComponent) chart!:ChartComponent;

  constructor(private service: SaleService,  private datePipe: DatePipe) {
    this.fetchSalesData();
  }

  resetZoom(){
    this.chart.ResetZoom();
  }

  getNexData(){
    this.resetZoom();
    this.skipElementsCounter = this.skipElementsCounter + this.takeElements;
    this.fetchSalesData();
  }

  getPreviousData(){
    this.resetZoom();
    //todo: in future version refactor to get saledata from cache
    this.skipElementsCounter = this.skipElementsCounter - this.takeElements;
    this.fetchSalesData();
  }

  fetchSalesData(){
    let filter = {
      skip: this.skipElementsCounter,
      take: this.takeElements,
      timeInterval: "week",
      startDate: "2020-01-02 00:00:00.0000000",
      endDate: "2022-03-23 00:00:00.0000000"
    };

    this.service.GetSalesAmounts(filter).subscribe(response => {
     
      if(!response.length) {
        this.shouldHideBtnNext = true;
        alert("No any data");
        return;
      }

      this.shouldHideBtnPrevious = !this.skipElementsCounter;
      this.shouldHideBtnNext = false;

      this.startDates = response.map(x => this.datePipe.transform(x.periodStartDate, 'MM/dd/yyyy')!);
      this.salesAmounts = response.map(x => x.salesAmount);
    });
  }
}
