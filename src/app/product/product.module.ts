import { FormsModule } from '@angular/forms';
import { HelloNg2Component } from './../component/hello-ng2/hello-ng2.component';
import { ProductRoutingModule } from './product.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductIndexComponent } from './index/index.component';
import { ProductListComponent } from './list/list.component';
import { ProductDetailComponent } from './detail/detail.component';

import 'hammerjs'; // 手势

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  declarations: [
    ProductIndexComponent,
    ProductListComponent,
    ProductDetailComponent,
    HelloNg2Component
  ]
})
export class ProductModule { }
