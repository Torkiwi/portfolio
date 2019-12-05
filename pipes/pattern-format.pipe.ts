import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'patternFormat'
})
export class PatternFormatPipe implements PipeTransform {

	transform(value: any, pattern: { offset: number, insert: string }[]): string {
		value = value.replace(/[^\d\A-Z]/gi, '');
		let offset = 0;
		let string_array = value.split('');
		for (let i = 0; i < pattern.length; i++) {
			if (offset + pattern[i]['offset'] >= string_array.length) {
				break;
			}
			offset += pattern[i]['offset'];
			string_array.splice(offset, 0, pattern[i]['insert']);
			offset += pattern[i]['insert'].length;
		}
		return string_array.join('');
	}

}
