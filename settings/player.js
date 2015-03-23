var ref;
var emu;
var node;

function play_song(filename, subtune) {
	if(node){
		node.disconnect();
		node = null;
	}
	var xhr = new XMLHttpRequest();
	xhr.open("GET", filename, true);
	xhr.responseType = "arraybuffer";
	xhr.onerror = function(e){
		message(e);
	};
	xhr.onload = function(e) {
		if(this.status == 404){
			message("not found");
			return;
		}
		var payload = new Uint8Array(this.response);
		playMusicData(payload, subtune);
	};
	xhr.send();
}

function playMusicData(payload, subtune){
		if (!window.AudioContext) {
			if (window.webkitAudioContext) {
				window.AudioContext = window.webkitAudioContext;
			} else if (window.mozAudioContext) {
				window.AudioContext = window.mozAudioContext;
			} else {
				message("Web Audio API is not supported.");
			}
		}


		try{
			//ëºÇÃÇ∆Ç±ÇÎÇ≈çÏÇ¡ÇΩÇÃÇégÇ¢Ç‹ÇÌÇ∑
		    //ctx = audioContext;//new AudioContext();
		    ctx = new AudioContext();
		}catch(e){
			alert("audio api error.please reload..: "+e);
			return;
		}

		ref = Module.allocate(1, "i32", Module.ALLOC_STATIC);

		var samplerate = ctx.sampleRate;

		if (Module.ccall("gme_open_data", "number", ["array", "number", "number", "number"], [payload, payload.length, ref, samplerate]) != 0){
			console.error("gme_open_data failed.");
			return;
		}
		emu = Module.getValue(ref, "i32");

		var subtune_count = Module.ccall("gme_track_count", "number", ["number"], [emu]);

		Module.ccall("gme_ignore_silence", "number", ["number"], [emu, 1]);
		
		var voice_count = Module.ccall("gme_voice_count", "number", ["number"], [emu]);

		if (Module.ccall("gme_start_track", "number", ["number", "number"], [emu, subtune]) != 0)
			console.log("could not load track");

		var bufferSize = 1024 * 16;
		var inputs = 2;
		var outputs = 2;
		
		if(!node && ctx.createJavaScriptNode)node = ctx.createJavaScriptNode(bufferSize, inputs, outputs);
		if(!node && ctx.createScriptProcessor)node = ctx.createScriptProcessor(bufferSize, inputs, outputs);

		var buffer = Module.allocate(bufferSize * 2, "i32", Module.ALLOC_STATIC);

		var INT16_MAX = Math.pow(2, 32) - 1;

		node.onaudioprocess = function(e) {
			if (Module.ccall("gme_track_ended", "number", ["number"], [emu]) == 1) {
				node.disconnect();
				message("end of stream");
				return;
			}

			var channels = [e.outputBuffer.getChannelData(0), e.outputBuffer.getChannelData(1)];

			var err = Module.ccall("gme_play", "number", ["number", "number", "number"], [emu, bufferSize * 2, buffer]);
			for (var i = 0; i < bufferSize; i++)
				for (var n = 0; n < e.outputBuffer.numberOfChannels; n++)
					channels[n][i] = Module.getValue(buffer + i * e.outputBuffer.numberOfChannels * 2 + n * 4, "i32") / INT16_MAX;
		}

    //node.connect(filterNode);
        node.connect(ctx.destination)
		window.savedReferences = [ctx, node];
}

