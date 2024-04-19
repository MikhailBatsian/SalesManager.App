import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables);
Chart.register(zoomPlugin);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})

export class ChartComponent implements OnInit{

  private chart: any;
  private chartFontSize: number = 16;

  @Input() labels: string[] = [];
  @Input() salesAmounts: number[] = [];
  @Input() salesCounts: number[] = [];

  constructor(){
  }

  ngOnChanges(changes: SimpleChanges) {
    const { labels , salesAmounts, salesCounts } = changes;
    
    if(labels && !labels.firstChange){
      this.changeData(labels.currentValue, salesAmounts.currentValue, salesCounts.currentValue);
    }
  }

  ngOnInit(): void{
    this.chart = new Chart('custom-chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Sales sum',
          data: this.salesAmounts,
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Sales count',
          data: this.salesCounts,
          borderWidth: 1,
          type: 'line',
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1'
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
                font: {
                    size: this.chartFontSize, // set the font size for x-axis labels
                }
            }
        },
          y: {
            beginAtZero: true,
            display: true,
            title: {
              display: true,
              text: 'Sum',
              font:{
                size: this.chartFontSize
              }
            },
            ticks:{
              font: {
                size: this.chartFontSize,
              }
            }
          },
          y1: {
            beginAtZero: true,
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Count',
              font:{
                size: this.chartFontSize
              }
            },
            ticks:{
                font:{
                size: this.chartFontSize
              }
            },
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl'
            },
            zoom: {
              drag: {
                enabled: true
              },
              mode: 'x',
            },
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: this.chartFontSize
              }
            }
          }
        },
      }
    });
  }

  changeData(labels: Date[], amounts: number[], counts: number[]) {
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = amounts;
    this.chart.data.datasets[1].data = counts;

    this.chart.update();
  }

  ResetZoom(){
    this.chart.resetZoom();
  }
}