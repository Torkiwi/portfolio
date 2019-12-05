import { Injectable, EventEmitter, Renderer2, RendererFactory2, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { WatchDogUtilityService } from './watchdog-utility.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { WatchdogEvents } from '../interfaces/watchdog.interface';
import { WatchdogModule } from '../watchdog.module';


@Injectable({
    providedIn: 'root'
})

export class WatchdogService {

    // Watchdog Events
    public onTimeoutWarning: Subject<any> = new Subject();
    public onTimeout: Subject<any> = new Subject();
    public onIdleEnd: Subject<any> = new Subject();
    public timeLeft: BehaviorSubject<number> = new BehaviorSubject(0);

    // Internal variable
    private warnIdle: number; // in seconds
    private timeoutIdle: number; // in seconds
    private renderer: Renderer2;
    private watchdogActive: boolean = false;
    private eventsHandler = {
        click : '',
        keypress : '',
        visibilitychange : ''
    };

    constructor(
        private utility: WatchDogUtilityService,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    public setEventListeners(eventType: WatchdogEvents['types'], eventType2?: WatchdogEvents['types'], eventType3?: WatchdogEvents['types']) {
        this.clearEventsListeners();
        for(let i=0; i<arguments.length;i++){
            if(arguments[i] == 'none'){
                this.clearEventsListeners();
                return;
            }
            this.eventsHandler[arguments[i]] = this.createEventListener(arguments[i]);
        }   
    }

    private clearEventsListeners(){
        for(let handler in this.eventsHandler) {
            if(this.eventsHandler[handler] != ''){
                this.eventsHandler[handler]();
            }
        }
    }

    private createEventListener(type){
        return this.renderer.listen('document',type,(event)=>{
                this.onIdleEnd.next();
        })
    }

    public startWatchdog(warnIdle?: number, timeoutIdle?: number) {
        this.doCheck(warnIdle, timeoutIdle);
        this.utility.safe_timeout('watchdogWarnTimer', this.warnTimeout, this.warnIdle * 1000, this);
        this.utility.safe_timeout('watchdogTimeoutTimer', this.inactivityTimeout, this.timeoutIdle * 1000, this);
    }

    private doCheck(warnIdle?: number, timeoutIdle?: number) {
        if (warnIdle >= timeoutIdle) {
            console.warn('Watchdog Warning: Idle timer is bigger than Timeout Timer');
        }
        if (this.utility.isset(warnIdle) && this.utility.isset(timeoutIdle)) {
            this.setupTimer(warnIdle, timeoutIdle);
        }
        if (!this.utility.isset(this.warnIdle) && !this.utility.isset(this.timeoutIdle)) {
            throw new Error('Watchdog Error: Idle timer and Timeout timer haven\'t been set');
        }
        if (!this.watchdogActive) {
            this.watchdogActive = true;

			this.utility.safe_interval('watchdogTimeleft',this.getTimeLeft,1000,this)
            this.listenForIdleEnd();
        }
    }

    private setupTimer(warnIdle: number, timeoutIdle: number) {
        this.warnIdle = Number(warnIdle);
        this.timeoutIdle = Number(timeoutIdle);
    }

    private getTimeLeft() {      
        this.timeLeft.next(Math.round(this.utility.get_timeout('watchdogTimeoutTimer') / 1000));
    }

    private listenForIdleEnd() {
        this.onIdleEnd.subscribe(() => {
            this.startWatchdog();
        });
    }

    private warnTimeout() {
        this.onTimeoutWarning.next();
    }

    private inactivityTimeout() {
        this.onTimeout.next();
    }

    public stopWatchdog() {
        this.utility.clear_safe_timeout('watchdogWarnTimer');
        this.utility.clear_safe_timeout('watchdogTimeoutTimer');
        this.utility.clear_safe_interval('watchdogTimeleft');
        this.setEventListeners('none');
		this.watchdogActive = false;
	}
}
