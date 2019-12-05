import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationCancel, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	isPopEvent: boolean = false;
	private renderer: Renderer2;

	constructor(
		private router: Router,
		private renderFactory: RendererFactory2,
	) {}

	init() {
		this.renderer = this.renderFactory.createRenderer(null, null);
		this.listenToPopState();
		this.router.events.subscribe(event => {
			if (event instanceof NavigationCancel) {
				this.isPopEvent = false;
			}
		});
	}

	listenToPopState() {
		this.renderer.listen('window', 'popstate', (event) => {
			if (environment.production) {
				this.isPopEvent = true;
				this.preventForwardNavigation(event);
				return false;
			}
		});
	}

	preventForwardNavigation(event) {
		if (typeof event.state == 'object'
			&& event.state.obsolete !== true) {
			history.replaceState({'obsolete': true}, '');
			history.pushState(null, null, document.URL);
		}
		if (typeof event.state == 'object'
			&& event.state.obsolete === true) {
			history.back();
		}
		this.isPopEvent = false;
	}
}
