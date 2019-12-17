import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BarChartSeries, BarChartCategory } from './bar-chart/bar-chart.component';
import { Location } from '@angular/common';

const DEFAULT_REPOS = ['angular/angular', 'facebook/react', 'vuejs/vue'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient, public location: Location) {
    DEFAULT_REPOS.forEach(repo => this.loadRepo(repo));
  }

  public repo: string;
  public fakeData = false;
  public rateLimit: string;

  categories: BarChartCategory[] = [];
  series: BarChartSeries[] = [
    {
      label: 'Subscribers',
      color: '#11C591',
    },
    {
      label: 'Forks',
      color: 'rebeccapurple',
    },
    {
      label: 'Issues',
      color: '#ED4DAF',
    },
  ];

  async addRepo() {
    if (this.repo && this.repo.length) {
      await this.loadRepo(this.repo);
      this.repo = '';
    }
  }

  removeRepo(repo: number) {
    this.categories = this.categories.filter((_, i) => i !== repo);
  }

  async loadRepo(repo: string) {
    const result = await (this.fakeData ? this.fakeRepo(repo) : this.loadGithubRepo(repo));

    if (!result) {
      return;
    }

    this.categories = [
      ...this.categories,
      {
        label: result.full_name,
        values: [result.subscribers_count, result.forks_count, result.open_issues],
      },
    ];
  }

  fakeRepo(repo: string) {
    return Promise.resolve({
      full_name: repo,
      subscribers_count: Math.floor(Math.random() * 5000),
      forks_count: Math.floor(Math.random() * 3000),
      open_issues: Math.floor(Math.random() * 1000),
    });
  }

  async loadGithubRepo(repo: string) {
    try {
      const response = await this.http
        .get<any>(`https://api.github.com/repos/${repo}`, {
          observe: 'response',
        })
        .toPromise();

      this.rateLimit = `GitHub rate limit: ${response.headers.get(
        'X-RateLimit-Remaining',
      )} of ${response.headers.get('X-RateLimit-Limit')} remaining.`;

      return response.body;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 403) {
          this.rateLimit = 'GitHub rate limit exceeded';
          this.fakeData = true;
          return this.fakeRepo(repo);
        }

        return null;
      }
    }
  }
}
