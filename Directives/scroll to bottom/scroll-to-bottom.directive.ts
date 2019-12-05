import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[scrollBottom]'
})
export class ScrollToBottomDirective {
	@Output() scrolledToBottom: EventEmitter<any> = new EventEmitter();
	element: ElementRef;
	private scrolled: boolean = false;

	constructor(el: ElementRef) {
		this.element = el;
	}

	@HostListener('scroll') scrolling() {
		this.isBottomOfElement();
	}

	isBottomOfElement() {
		if (this.scrolled) {
			return;
		}
		if (Math.round(this.element.nativeElement.scrollHeight - this.element.nativeElement.scrollTop) === this.element.nativeElement.clientHeight) {
			this.scrolled = true;
			this.scrolledToBottom.emit(true);
		}
	}
}
