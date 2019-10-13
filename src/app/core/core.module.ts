import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from '@angular/router';
import { CovalentLayoutModule } from "@covalent/core";

import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppHeaderComponent } from './app-header/app-header.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    AppFooterComponent],
  imports: [
    CommonModule,
    CovalentLayoutModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule
  ],
  exports: [
    AppHeaderComponent,
    AppFooterComponent]
})
export class CoreModule {
}
