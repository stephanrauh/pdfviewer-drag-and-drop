import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

let PDFJS: any;

function isSSR() {
  return typeof window === 'undefined';
}

if (!isSSR()) {
  // @ts-ignore
  PDFJS = require('pdfjs-dist/build/pdf');
}

interface IPdfDocumentLoad {
  numPages: number;
}

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PDFViewerComponent implements OnInit {
  @Input()
  pdfSrc: string = '';

  @Input()
  pageNumber = 1;

  @Input()
  zoom = 1.0;

  @Input()
  bgColor = 'rgba(0,0,0,0)'; // Default background color is white

  @Output()
  PdfDocumentLoad = new EventEmitter<IPdfDocumentLoad>();

  private _pdfDocument: any;

  constructor() {
    if (isSSR()) {
      return;
    }

    const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${
      PDFJS.version
    }/pdf.worker.min.js`;
    PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }

  getNumPages() {
    return this._pdfDocument._pdfInfo.numPages;
  }

  afterPageLoad(): IPdfDocumentLoad {
    const obj = {
      numPages: this.getNumPages()
    };
    return obj;
  }

  async ngOnInit(): Promise<void> {
    try {
      console.log(this.pdfSrc);
      this._pdfDocument = await this.getDocument();
      this.createRenderTask();

      this.PdfDocumentLoad.emit(this.afterPageLoad());
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnChanges(changes: { pageNumber: { currentValue: any; }; }) {
    if (!this._pdfDocument) {
      return;
    }

    if (
      changes.pageNumber &&
      !this.isValidPageNumberRequest(changes.pageNumber.currentValue)
    ) {
      return;
    }

    this.createRenderTask();
  }

  async ngOnDestroy() {
    if (this._pdfDocument) {
      this._pdfDocument.destroy();
      this._pdfDocument = null;
    }
  }

  isValidPageNumberRequest(requestedPage: number) {
    return requestedPage > 0 && requestedPage <= this.getNumPages();
  }

  private async getDocument() {
    const loadingTask = PDFJS.getDocument(this.pdfSrc);
    return loadingTask.promise.then(function(pdfDocument: unknown) {
      return new Promise(resolve => resolve(pdfDocument));
    });
  }

  private async getPage(page: number): Promise<any> {
    return await this._pdfDocument.getPage(page);
  }

  private getCanvas(viewport: { height: any; width: any; }): HTMLCanvasElement {
    const canvas: any = document.getElementById('pdfCanvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    return canvas;
  }

  private async createRenderTask() {
    const page: any = await this.getPage(this.pageNumber);
    const viewport = page.getViewport({ scale: this.zoom });
    const canvas: HTMLCanvasElement = this.getCanvas(viewport);

    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const task = page.render({
      canvasContext: context,
      viewport,
      background: this.bgColor
    });

    return task;
  }
}
