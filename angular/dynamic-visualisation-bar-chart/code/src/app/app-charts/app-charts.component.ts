import { Component, HostBinding, HostListener, Input } from '@angular/core';
import {
  BarChartCategory,
  BarChartSeries
} from '../bar-chart/bar-chart.component';

@Component({
  selector: 'app-charts-container',
  templateUrl: './app-charts.component.html',
  styleUrls: ['./app-charts.component.scss']
})
export class ChartsContainerComponent {
  @HostBinding('style.--left-size.px')
  public leftSize = null;

  @HostBinding('style.--top-size.px')
  public topSize = null;

  private trackingX = false;
  private trackingY = false;

  @Input()
  categories: BarChartCategory[];

  @Input()
  series: BarChartSeries[];

  @HostListener('mousemove', ['$event'])
  public onMove(e: MouseEvent) {
    if (this.trackingX || this.trackingY) {
      e.preventDefault();
      e.stopPropagation();

      // tslint:disable-next-line: no-bitwise
      if (!(e.buttons & 1)) {
        this.trackingX = this.trackingY = false;
        return;
      }

      if (this.trackingX) {
        this.leftSize = e.pageX - (e.currentTarget as any).offsetLeft;
        return;
      }

      if (this.trackingY) {
        this.topSize = e.pageY - (e.currentTarget as any).offsetTop;
        return;
      }
    }
  }

  onVGrab(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.trackingX = true;
  }

  onHGrab(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.trackingY = true;
  }
}
