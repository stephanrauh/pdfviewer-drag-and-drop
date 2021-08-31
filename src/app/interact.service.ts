import { Injectable } from '@angular/core';
import interact from 'interactjs';

@Injectable({
  providedIn: 'root'
})
export class InteractService {
  public coordinates = {
    x: null,
    y: null
  };

  constructor() {}

  public init() {
    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      accept: '.drag-drop',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function(event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function(event) {
        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        const imageUrl =
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/Chris_Hemsworth_Signature.png';
        draggableElement.style.backgroundImage = `url('${imageUrl}')`;
        draggableElement.style.backgroundRepeat = 'round';
        draggableElement.style.border = 'thin dotted black';
        draggableElement.style.width = '400px';
        draggableElement.style.height = '120px';
        draggableElement.textContent = '';
      },
      ondragleave: function(event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.textContent = 'Dragged out';
        event.relatedTarget.style.backgroundImage='';
      },
      ondropdeactivate: function(event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });

    interact('.drag-drop').draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrict({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      listeners: {
        move: event => {
          const target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // translate the element
          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        // call this function on every dragend event
        end: e => {
          let canvas: HTMLCanvasElement = <HTMLCanvasElement>(
            document.getElementById('pdfCanvas')
          );
          if (!canvas) {
            canvas = document.querySelector('.canvasWrapper > canvas') as HTMLCanvasElement;
          }
          const rect = canvas.getBoundingClientRect();
          const elementRelativeLX = e.client.x - rect.left;
          const elementRelativeRX = e.client.x - rect.right;
          const elementRelativeTY = e.client.y - rect.top;
          const elementRelativeBY = e.client.y - rect.bottom;

          const canvasRelativeLX =
            (elementRelativeLX * canvas.width) / rect.width;
          const canvasRelativeRX =
            (elementRelativeRX * canvas.width) / rect.width;
          const canvasRelativeTY =
            (elementRelativeTY * canvas.height) / rect.height;
          const canvasRelativeBY =
            (elementRelativeBY * canvas.height) / rect.height;

          const maxPDFx = 595;
          const maxPDFy = 842;
          const offsetY = 7;

          const pdfY = (e.client.y * maxPDFy) / canvas.height;
          const posizioneY = maxPDFy - offsetY - pdfY;
          const posizioneX = (e.client.y * maxPDFx) / canvas.width;

          this.coordinates = {
            x: posizioneX,
            y: posizioneY
          };

          console.log('newX: ' + posizioneX + 'newY: ' + posizioneY);
          console.log(
            'lx: ' +
              canvasRelativeLX +
              'ty: ' +
              canvasRelativeTY +
              'rx: ' +
              canvasRelativeRX +
              'by: ' +
              canvasRelativeBY
          );
        }
      }
    });
  }

  getCoordinates() {
    return this.coordinates;
  }
}
