import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { allContainerComponents } from './container';
import { allPresentationalComponents } from './presentational';

@NgModule({
  imports: [CommonModule],
  declarations: [...allPresentationalComponents, ...allContainerComponents],
  exports: [...allContainerComponents]
})
export class CustomerModule {}
