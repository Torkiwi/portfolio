import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObjectUtilService} from '../utils/object-util.service';

@Pipe({
	name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

	constructor(
		public translate: TranslateService
	) {
	}

	transform(obj: any, orderField: string, orderBy: 'Number' | 'String' = 'String', translate?: 'Translate' | undefined): any {
		let orderType = 'ASC';
		if (orderField[0] === '-') {
			orderField = orderField.substring(1);
			orderType = 'DESC';
		}
		if (ObjectUtilService.isPresent(obj)) {
			obj.sort((a, b) => {
				if (orderBy == 'Number') {
					if (orderType === 'ASC') {
						return (Number(a[orderField]) - Number(b[orderField]));
					} else {
						return (Number(b[orderField]) - Number(a[orderField]));
					}
				} else {
					if (translate) {
						if (orderType === 'ASC') {
							if (this.translate.instant(a[orderField]) < this.translate.instant(b[orderField])) {
								return -1;
							}
							if (this.translate.instant(a[orderField]) > this.translate.instant(b[orderField])) {
								return 1;
							}
							return 0;
						} else {
							if (this.translate.instant(a[orderField]) < this.translate.instant(b[orderField])) {
								return 1;
							}
							if (this.translate.instant(a[orderField]) > this.translate.instant(b[orderField])) {
								return -1;
							}
							return 0;
						}
					} else {
						if (orderType === 'ASC') {
							if (a[orderField] < b[orderField]) {
								return -1;
							}
							if (a[orderField] > b[orderField]) {
								return 1;
							}
							return 0;
						} else {
							if (a[orderField] < b[orderField]) {
								return 1;
							}
							if (a[orderField] > b[orderField]) {
								return -1;
							}
							return 0;
						}
					}
				}

			});
		}

		return obj;
	}

}
