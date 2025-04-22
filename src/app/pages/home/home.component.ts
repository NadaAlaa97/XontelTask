import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CategoryScale, LinearScale, BarController, BarElement, ArcElement, PointElement, LineElement, LineController, DoughnutController, Legend, Tooltip } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  LineController,
  DoughnutController,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    TranslateModule,
    BaseChartDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  showLoader = false;
  currentLang: string;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E2E8F0'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [45, 59, 80, 81, 56, 55, 40, 35, 50, 65, 75, 60],
        backgroundColor: '#6366F1',
        borderRadius: 8,
        barThickness: 12,
        maxBarThickness: 12
      }
    ]
  };

  public donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 100 
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          color: '#64748B',
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '75%'
  };

  public donutChartType: ChartType = 'doughnut';
  public donutChartData: ChartData<'doughnut'> = {
    labels: ['Optimistic', 'Pessimistic', 'Unsure'],
    datasets: [
      {
        data: [250, 130, 73],
        backgroundColor: [
          '#448EFC', 
          '#FF8743',
          '#D9D9D9'   
        ],
        borderWidth: 0,
        spacing: 2
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: '#E2E8F0'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        data: [25, 50, 35, 45, 75],
        borderColor: '#34B56F',
        backgroundColor: 'rgba(52, 181, 111, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#34B56F',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.currentLang = this.languageService.getCurrentLang();
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateChartLabels();
    });
  }

  private updateChartLabels() {
    this.donutChartData = {
      ...this.donutChartData,
      labels: [
        this.currentLang === 'en' ? 'Optimistic' : 'متفائل',
        this.currentLang === 'en' ? 'Pessimistic' : 'متشائم',
        this.currentLang === 'en' ? 'Unsure' : 'غير متأكد'
      ]
    };
  }

  ngOnInit() {
  }

  navigateToPosts() {
    this.router.navigate(['/posts']);
  }


  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
