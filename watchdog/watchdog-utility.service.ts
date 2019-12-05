import { Injectable } from '@angular/core';
import { WatchdogModule } from '../watchdog.module';

@Injectable({
    providedIn: 'root'
})
export class WatchDogUtilityService {

    private js_timeouts = {};
	private js_intervals = {};

    constructor() { }

    isset(variable) {
        if (typeof variable != 'undefined') {
            return true;
        }
        return false;
    }

    hasProp(O, prop) {
        if (!this.isset(O[prop])) {
            return false;
        }
        return true;
    }

    safe_timeout(id, func, timing, scope?) {
        this.clear_safe_timeout(id)

        this.js_timeouts[id] = {};
        this.js_timeouts[id]['timeout'] = setTimeout(func.bind(scope), timing);
        this.js_timeouts[id]['data'] = [Date.now(), timing];
    }

    clear_safe_timeout(id) {
        if (this.hasProp(this.js_timeouts, id)) {
            clearTimeout(this.js_timeouts[id]['timeout']);
        }
    }

    get_timeout(id) {
        if (this.hasProp(this.js_timeouts, id)) {
            let timeout = this.js_timeouts[id]['data'];
            return timeout ? Math.max(timeout[1] - Date.now() + timeout[0], 0) : NaN;
        }
    }

	safe_interval(id,func,timing,scope?){
		this.clear_safe_interval(id);
		this.js_intervals[id]=setInterval(func.bind(scope),timing);
	}

	clear_safe_interval(id){
		if(this.hasProp(this.js_intervals,id)){
			clearInterval(this.js_intervals[id]);
		}
	}
}
