$('document').ready(function(){
	console.log('suoritus alkaa:');
	$.getJSON("data.json", function(data){
		console.log('haettiin dataa:');
		console.log(data);

		var tablehtml = '';
		var sources = data.data.sources;
		console.log(sources);
		var endings = data.data.endings;
		var endingsrowhtml = '<tr><th></th>';
		for(var i = 0; i < endings.length; i++){
			endingsrowhtml += '<th>'+endings[i].name+'</th>';
		}
		tablehtml += endingsrowhtml;
		for(var i = 0; i < sources.length; i++){
			var rowhtml = '<tr><th>' + sources[i].name + '</th>';
			for(var o = 0; o < endings.length; o++){
				rowhtml += '<td class="button" source='+sources[i].value+' ending='+endings[o].value+' title="'+sources[i].name+' -> '+endings[o].name+'" onclick="toteutaVaihto('+sources[i].value+', '+endings[o].value+'"></td>';
			}
			rowhtml += '</tr>';
			tablehtml += rowhtml;
		}
		$('#fulltable').html(tablehtml);

		//asetetaan io toiminnallisuus
		var socket = io();
		socket.on('updatestates', function(data){
			console.log('updating states:');
			console.log(data.states);
			$('#fulltable td.button').css('background-color', '#B3E5DC');
			for(var i = 0; i < data.states.length; i++){
				if(data.states[i]){
					$('#fulltable td.button[source='+i+'][ending='+data.states[i]+']').css('background-color', 'red');

				}
			}
		});
		$('#fulltable td.button').click(function(){
			var source = $(this).attr('source');
			var ending = $(this).attr('ending');
			console.log('setting state: '+source+' -> '+ending);
			socket.emit('setstate', {source:source, ending:ending});
		});
	});
});

function setContent(num){
	console.log('setting content: '+num);
	$('#input div').hide();
	switch(num){
		case 0:
			$('#input div#table').slideDown();
			break;
		case 1:
			$('#input div#form').slideDown();
			break;
		case 2:
			$('#input div#preset').slideDown();
			break;
	}	
}

