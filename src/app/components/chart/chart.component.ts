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

  @Input() labels:string[] = [];
  @Input() data:Number[] = [];

  constructor(){
  }

  ngOnChanges(changes: SimpleChanges) {
    const { labels , data } = changes;
    
    if(labels && !labels.firstChange && data && !data.firstChange){
      this.changeData(labels.currentValue, data.currentValue);
    }
  }

  ngOnInit(): void{
    this.chart = new Chart('custom-chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Sales',
          data: this.data,
          borderWidth: 1,
          order: 0
        },
        {
          label: 'Sales',
          data: this.data,
          borderWidth: 1,
          order: 0,
          type: 'line',
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
            zoom: {
              drag: {
                enabled: true
              },
              mode: 'x',
            },
          },
          legend: {
            display: false,
          }

        },
      }
    });
  }

  changeData(labels: Date[], amounts: Number[]) {
    this.chart.data.labels = labels;
    this.chart.data.datasets.forEach((dataset: { data: any; }) => {
      dataset.data=amounts;
    });

    this.chart.update();
    this.chart.render();
  }

  ResetZoom(){
    this.chart.resetZoom();
  }
}