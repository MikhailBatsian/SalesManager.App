import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalesChartComponent } from './components/sales-chart/sales-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SalesChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'SalesManager.App';
}