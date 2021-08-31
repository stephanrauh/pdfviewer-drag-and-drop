import { Component, OnInit, VERSION } from '@angular/core';
import { InteractService } from './interact.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  public document;
  public pdfSrc =
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

  constructor(private interactService: InteractService) {}

  ngOnInit() {
    this.interactService.init();
  }
}
