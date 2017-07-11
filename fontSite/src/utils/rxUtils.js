import Rx from 'rxjs/Rx';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/switchMap';

export const Subject = Rx.Subject;
export const Observable = Rx.Observable;

Observable.prototype.groupThrottleTime = function groupThrottleTime(duration) {
	this._innerThrottleGroup = {};

	return this.filter((item) => {
		const key = JSON.stringify(item);
		const latest = this._innerThrottleGroup[key] || 0;
		const now = Date.now();
		this._innerThrottleGroup[key] = now;

		return now - latest >= duration;
	});
};

Observable.prototype.latestPromise = function latestPromise(mapFunc) {
	return this.switchMap((item) => {
		const promise = mapFunc(item);
		return Observable.create((observer) => {
			promise.then((result) => {
				observer.next(result);
				observer.complete();
			});
			return () => {};
		});
	});
};
