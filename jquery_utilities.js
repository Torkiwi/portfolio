var waiting_for={};
var js_timeouts={};
var storage={};

function stop_waiting_for(s,o){
	if(hasProp(waiting_for,s)){
		waiting_for[s]--;
		if(waiting_for[s]==0){
			if(isset(o)){
				ifexec(s,o);
			}else{
				ifexec(s);
			}
			delete(waiting_for[s]);
		}
	}
}

function safe_timeout(id,func,timing){
	if(hasProp(js_timeouts,id)){
		clearTimeout(js_timeouts[id]);
	}
	js_timeouts[id]=setTimeout(func,timing);
}

function storage_search(s,k,v){
	for(var i=0;i<storage[s].length;i++){
		if(storage[s][i][k]==v){
			return storage[s][i];
		}
	}
}

function isset(variable){
	if(typeof variable != 'undefined'){
		return true;
	}
	return false;
}

function hasProp(O,prop){
	try{
		var fuckYouInternetExplorer=O[prop];
	}catch(e){
		return false;
	}
	if(!isset(O[prop])){
		return false;
	}
	return true;
}