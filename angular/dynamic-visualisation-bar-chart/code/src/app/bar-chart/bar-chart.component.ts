import {
  Component,
  OnInit,
  HostBinding,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

export interface BarChartSeries {
  label: string;
  color: string;
}

export interface BarChartCategory {
  label: string;
  values: number[];
}

const { floor, ceil, log10, pow, min, max } = Math;

/**
 * For a given number, round it up or down to a "nice" value.
 * Where a "nice" value is a power of ten multiple of 1, 2 or 5.
 */
const niceNum = (n: number, round: boolean) => {
  const exp = floor(log10(n));
  const frac = n / pow(10, exp);

  let niceFrac: number;

  if (round) {
    niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  } else {
    niceFrac = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10;
  }

  return niceFrac * pow(10, exp);
};

function* niceTicks(dataMin: number, dataMax: number, tickCount: number) {
  // Round the range size up to a nice value.
  const range = niceNum(dataMax - dataMin, false);

  // Find a nice tick size for the new range.
  const tickInterval = niceNum(range / (tickCount - 1), true);

  // Round the min and max up and down respectively, based on the tick size.
  const niceMin = floor(dataMin / tickInterval) * tickInterval;
  const niceMax = ceil(dataMax / tickInterval) * tickInterval;

  // Output all ticks between the nice min and max.
  for (let v = niceMin; v <= niceMax + 0.5 * tickInterval; v += tickInterval) {
    yield v;
  }
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit {
  @HostBinding('style.--category-count')
  public get categoryCount() {
    return this.categories.length;
  }

  public categories: BarChartCategory[] = [];

  @Input('categories')
  public set categoriesInput(value: BarChartCategory[]) {
    if (!value) {
      return;
    }

    this.categories = value;

    const values = value.flatMap(c => c.values);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    this.yTicks = [...niceTicks(minValue, maxValue, 10)];

    this.maxValue = this.yTicks[this.yTicks.length - 1];
  }

  @Input()
  public series: BarChartSeries[];

  @Input()
  public title: string;

  @Input()
  public xAxisLabel: string;

  @Input()
  public yAxisLabel: string;

  @HostBinding('style.--max-value')
  public maxValue = 1;

  yTicks: number[] = [];

  constructor() {}

  ngOnInit() {}
}
