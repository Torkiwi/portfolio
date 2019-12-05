import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
	selector: '[inputRestriction]'
})
export class InputRestrictionDirective {
	inputElement: ElementRef;
	digitOnlyRegexp = /[^\d]/gi;
	noSpecialCharRegexp = /[^\dA-Z]/gi;
	regexp;

	@Input('delimiter') delimiter: string;

	@Input('inputRestriction') inputRestriction: 'integer'|'noSpecialChars';

	constructor(el: ElementRef) {
		this.inputElement = el;
	}

	@HostListener('keypress', ['$event']) onKeyPress(event) {
		if (this.inputRestriction === 'integer') {
			this.regexp = this.digitOnlyRegexp;
			this.setDelimiter();
			this.integerOnly(event);
		} else if (this.inputRestriction === 'noSpecialChars') {
			this.regexp = this.noSpecialCharRegexp;
			this.setDelimiter();
			this.noSpecialChars(event);
		}
	}

	private setDelimiter() {
		if(this.delimiter == undefined) {
			return;
		}
		let temp = this.regexp.source;
		temp = temp.slice(0, temp.length-1) + this.delimiter + temp.slice(temp.length-1);
		this.regexp = new RegExp(temp,'gi');
	}

	integerOnly(event) {
		const e = <KeyboardEvent>event;
		if (['Enter','Escape'].indexOf(e.key) !== -1 ||
			// Allow: Ctrl+A
			(e.key === 'a' && e.ctrlKey === true) ||
			// Allow: Ctrl+C
			(e.key === 'c' && e.ctrlKey === true) ||
			// Allow: Ctrl+V
			(e.key === 'v' && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(e.key === 'x' && e.ctrlKey === true)) {
			// let it happen, don't do anything
			return;
		}
		if (!this.regexp.test(e.key)) {
			return;
		}
		this.regexp.lastIndex = 0;
		e.preventDefault();
	}

	noSpecialChars(event) {
		const e = <KeyboardEvent>event;
		if (e.key === 'Tab' || e.key === 'TAB') {
			return;
		}
		if (!this.regexp.test(e.key)) {
			return;
		}
		this.regexp.lastIndex = 0;
		e.preventDefault();
	}

	@HostListener('paste', ['$event']) onPaste(event) {
		if (this.inputRestriction === 'integer') {
			this.regexp = this.digitOnlyRegexp;
			this.setDelimiter()
		} else if (this.inputRestriction === 'noSpecialChars') {
			this.regexp = this.noSpecialCharRegexp;
			this.setDelimiter()
		}
		const e = <ClipboardEvent>event;
		e.preventDefault();
		const pasteData = e.clipboardData.getData('text/plain').replace(this.regexp,'');
		document.execCommand('insertText', false, pasteData);
	}
}
