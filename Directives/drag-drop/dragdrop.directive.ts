import { Directive, HostListener, HostBinding, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
    selector: '[appDnd]'
})
export class DragdropDirective {

    @Output() filedropped : EventEmitter<any> = new EventEmitter()
    @HostBinding('style.background') public background = '#eee';

    constructor() { }

    @HostListener('dragover', ['$event']) public onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#999';
    }
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#eee'
    }
    @HostListener('drop', ['$event']) public onDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let files = evt.dataTransfer.files;
        console.log(files)
        if (files.length > 0) {
            this.background = '#eee'
        }

        this.filedropped.emit(files);

    }
}
