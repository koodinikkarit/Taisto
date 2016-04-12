var mobile;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	var mobile = true;
} else {
	var mobile = false;
}


var statesc = [];
var socket;

$('document').ready(function(){
	console.log('suoritus alkaa:');
	$.getJSON("/data.json", function(jsondata){
		console.log('haettiin dataa:');
		console.log(jsondata);

		fillTable(jsondata);
		fillMenu(jsondata);
		fillPresets(jsondata);

		//asetetaan io toiminnallisuus
		socket = io();
		socket.on('updatestates', function(data){
			console.log('updating states:');
			console.log(data.states);
			statesc = data.states;
			
			$('#ctable td.button[restrict="restrict"]').css('background-color', '#DDD');
			$('#ctable td.button[restrict="no"]').css('background-color', '#B3E5DC');
			for(var i = 0; i < data.states.length; i++){
				if(data.states[i]){
					$('#ctable td.button[source='+data.states[i]+'][ending='+i+']').css('background-color', 'red');

				}
			}
			createMenuLinks($('#input div#menu select').val(), jsondata.data.sources);
		});
	});
	if(mobile){
		setContent(1);
	} else {
		setContent(0);
	}
});

function setState(ending, source){
	if(socket){
		console.log('setting state: '+source+' -> '+ending);
		socket.emit('setstate', {source:source, ending:ending});
	}
}

function setContent(num){
	console.log('setting content: '+num);
	$('#input div.inputdiv').hide();
	switch(num){
		case 0:
			$('#input div#table').show();
			break;
		case 1:
			$('#input div#menu').show();
			break;
		case 2:
			$('#input div#preset').show();
			break;
	}	
}

function fillTable(data){
	var sources = data.data.sources;
	console.log(sources);
	var endings = data.data.endings;

	var etablehtml = '<tr><th class="first"></th></tr>';
	for(var i = 0; i < endings.length; i++){
		etablehtml += '<tr><th>'+endings[i].name+'</th></tr>';
	}
	$('#input div#table table#etable').html(etablehtml);


	var ctablehtml = '';
	var sourcesrowhtml = '<tr>';
	for(var i = 0; i < sources.length; i++){
		sourcesrowhtml += '<th><div class="header">'+sources[i].name+'</div></th>';
	}
	ctablehtml += sourcesrowhtml;
	
	for(var i = 0; i < endings.length; i++){
		if(endings[i].restrict == 1){
			var rowhtml = '<tr>';
			for(var o = 0; o < sources.length; o++){
				rowhtml += '<td class="button" restrict="restrict" source='+sources[o].value+' ending='+endings[i].value+' title="'+sources[o].name+' -> '+endings[i].name+'"></td>';
			}
			rowhtml += '</tr>';
		} else {
			var rowhtml = '<tr>';
			for(var o = 0; o < sources.length; o++){
				rowhtml += '<td class="button" restrict="no" source='+sources[o].value+' ending='+endings[i].value+' title="'+sources[o].name+' -> '+endings[i].name+'"></td>';
			}
			rowhtml += '</tr>';
		}
		ctablehtml += rowhtml;
	}
	$('#input div#table #ctable').html(ctablehtml);

	$('#ctable td.button[restrict="no"]').click(function(){
		var source = $(this).attr('source');
		var ending = $(this).attr('ending');
		setState(ending, source);
	});
}

function fillMenu(data){
	var sources = data.data.sources;
	var endings = data.data.endings;
	var selecthtml = '';
	for(var i = 0; i < endings.length; i++){
		selecthtml += '<option value="'+endings[i].value+'"';
		if(endings[i].restrict == 1){
			selecthtml += ' disabled ';
		} else {

		}
		selecthtml += '>'+endings[i].name+'</option>';
	}
	$('#input div#menu select').html(selecthtml);
	$('#input div#menu select').change(function(){
		var ending = $(this).val();
		createMenuLinks(ending, sources);
	});

}
function createMenuLinks(ending, sources){
	linkshtml = '';
	for(var i = 0; i < sources.length; i++){
		linkshtml += '<div class="link" ';
		if(statesc[ending] == sources[i].value) {
			linkshtml += 'style="background-color:red;color:white;" ';
		}
		linkshtml += 'source="'+sources[i].value+'" ending="'+ending+'">'+sources[i].name+'</div>';
	}
	$('#input div#menu #links').html(linkshtml);
	$('#input div#menu #links .link').click(function(){
		var source = $(this).attr('source');
		var ending = $(this).attr('ending');
		setState(ending, source);
	});

}


function fillPresets(data){
	$.getJSON("/presets.json", function(jsondata){
		var presets = jsondata.presets;
		var presethtml = '';
		for(var i = 0; i < jsondata.presets.length; i++){
			presethtml += '<div class="link" onclick="setState('+presets[i].ending+', '+presets[i].source+')">'+presets[i].name+'</div>';
		}
		$('#input div#preset').html(presethtml);
	});
}
