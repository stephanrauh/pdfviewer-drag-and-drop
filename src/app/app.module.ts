import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PDFViewerComponent } from './pdf-viewer/pdf-viewer.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [BrowserModule, FormsModule, NgxExtendedPdfViewerModule],
  declarations: [AppComponent, PDFViewerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
