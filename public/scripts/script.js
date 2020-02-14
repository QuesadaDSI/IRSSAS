var grafico = graficoNuevo ();

function aranna(value, tipo, anno, idchart = ""){
	var parameters = { "id": value, "tipo": tipo, "anno": anno};
    $.get('/getRiesgo',parameters,function(data) {
		var tipoRiesgo = getTipoRiesgo (data.riesgo[0].valor);
		grafico.data.labels = data.componentes;
		grafico.data.datasets[0].label = data.nombre;
		grafico.data.datasets[0].data = data.valores;
		grafico.update();
		pintarGrafico (grafico);
		document.getElementById ("riesgo").value = data.riesgo[0].valor;
		document.getElementById ("tipoRiesgo").textContent = (["Muy Alto", "Alto", "Intermedio", "Bajo", "Muy bajo"])[tipoRiesgo];
	});
};

function graficoAranna()
{
	var url = new URL(document.URL);
	var param = url.searchParams.get("asada");
	document.getElementById("asada").value = param == null ? document.getElementById("asada").value : param;
	var value = document.getElementById("asada").value;
    aranna(value,"INDICADORXASADA",0)
};

function graficoNuevo (asada = "")
{
	return new Chart(document.getElementById("radar-chart"+asada), {
		type: (document.getElementById ("tipoGrafico") == null ? "bar" : document.getElementById ("tipoGrafico").value),
		data: {
		labels: null,
	
		datasets: [
			{
			label: null,
			fill: true,
			backgroundColor: "rgba(25,61,102,0.2)",
			borderColor: "rgba(25,61,102,1)",
			pointBorderColor: "#fff",
			pointBackgroundColor: "rgba(179,181,198,1)",
			data: null
			}]
	
		},
		options: {
			title: {
				display: true,
				text: 'Nivel de Riesgo de la ASADA'
			},
			scale: //Extraido de: https://stackoverflow.com/questions/39249722/set-min-max-and-number-of-steps-in-radar-chart-js
			{
				ticks:
				{
					beginAtZero: true,
					max: 100,
					min: 0,
					stepSize: 10
				}
			}
	}});
}

function presentarAsada(){
    
    var asada = document.getElementById("asada").value;
    var values_list = asada.split(";");
    //console.log(values_list);
    
    $("div.present").html(
        "<br><p><b>" + values_list[0] + "</b></p><br>" + 
        "<p><b>UBICACIÓN:</b> " + values_list[1] + ", " + values_list[2] + ", " + values_list[3] + "</p><br>" + 
        "<p><b>SEÑAS ADICIONALES:</b> " + values_list[4] + "</p><br>" + 
        "<p><b>TELÉFONO:</b> " + values_list[5] + "</p><br>" +
        "<p><b>URL:</b> " + values_list[6] + "</p><br>" 
    );
};

function cambiarTipoInforme(){

    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
        $("#agregarAsada").hide();
        $("#borrarAsada").hide();
        $("#asadasInforme").hide();
    }
    else{
        $("#agregarAsada").show();        
        $("#borrarAsada").show();
        $("#asadasInforme").show();
    }
    $("#prueba").hide();
	$("#downloadpdf").hide();
};

function addAsadaToList(){
    var asada = document.getElementById("asada").value;
	
	if ($("#listaAsadas").val() != "")
		$("#listaAsadas").val($("#listaAsadas").val() + "|" + asada);
	else
		$("#listaAsadas").val(asada);
	
    var values_list = asada.split(",");
	values_list[1] = values_list[1].trim(values_list[1]);	

	if (!$("#asadasInforme").val().includes(values_list[1]))
		$("#asadasInforme").val($("#asadasInforme").val() + values_list[1] + "\n");

};

function deleteAsadaFromList(){
    var asada = document.getElementById("asada").value;
    var values_list = asada.split(",");

	if ($("#listaAsadas").val().split("|").length > 1)
		$("#listaAsadas").val($("#listaAsadas").val().replace("|" + asada, ""));
	else
		$("#listaAsadas").val("");

	values_list[1] = values_list[1].trim(values_list[1]);
	$("#asadasInforme").val($("#asadasInforme").val().replace(values_list[1] + "\n", ""));
	
};

function generarPDF(){
	$("#prueba").show();
    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
    
        var asada = document.getElementById("asada").value;
        var values_list = asada.split(",");

        $("#prueba").html(
			'<div id="'+values_list[0]+'">'+
            "<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
            "<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
            "<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
            "<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
            "<p>Población: " + values_list[8] + "</p><br>" + 
            "<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
            "<p>Teléfono: " + values_list[10] + "</p><br>" + 
            "<p>URL: " + values_list[11] + "</p><br>" +
            "<canvas id=\"radar-chart\"></canvas></div>"
        );

        var incluirGraf = $("input[name='grafico']:checked")[0];
        var incluirHist = $("input[name='hist']:checked")[0];


        if (incluirGraf != null){
			grafico = graficoNuevo();
			aranna(parseInt(values_list[0]),"INDICADORXASADA",0, values_list[0]);
		}

        /*
        if (incluirHist != null)
            pdfdoc.addImage(canvasImg, 'JPEG', 10, 110, 100, 100);    
        */
    }
    else{
		var lista = $("#listaAsadas").val().split("|");

		$("#prueba").html("");

		for (var i = 0; i < lista.length; i++){
			values_list = lista[i].split(",");
			
			for (var j = 0; j < values_list.length; j++){
				values_list[j] = values_list[j].trim(values_list[j]);	
			}

			$("#prueba").append(
				'<div id="'+values_list[0]+'">'+
				"<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
				"<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
				"<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
				"<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
				"<p>Población: " + values_list[8] + "</p><br>" + 
				"<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
				"<p>Teléfono: " + values_list[10] + "</p><br>" + 
				"<p>URL: " + values_list[11] + "</p><br>" +
				"<canvas id=\"radar-chart"+values_list[0]+"\"></canvas></div>"
			);

			var incluirGraf = $("input[name='grafico']:checked")[0];
			var incluirHist = $("input[name='hist']:checked")[0];

			if (incluirGraf != null){
				grafico = graficoNuevo(values_list[0]);
				aranna(parseInt(values_list[0]),"INDICADORXASADA",0, values_list[0]);
			}
		}
	}
	$("#downloadpdf").show();
};

function downloadPDF()
{
	var pdfdoc = new jsPDF();

	var specialElementHandlers = {
		'#ignoreContent': function (element, renderer) {
			return true;
		}
	};

	var asadas = document.getElementById("prueba");
	var file_name = 'Informe - ASADAS'
	asadas.childNodes.forEach((element,key) => {
		if(key < asadas.childNodes.length && key > 0) pdfdoc.addPage();

		pdfdoc.fromHTML(element.innerHTML, 10, 10, {
			'width': 190,
			'elementHandlers': specialElementHandlers
		});
		//Cambiar el fondo a blanco para el jpeg
		var ctx = element.lastChild.getContext("2d");
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, element.lastChild.width, element.lastChild.height);
		
		pdfdoc.addImage(element.lastChild, "JPEG", 10, 110, 190, 190);
		file_name += " - " + element.id;
	});
	pdfdoc.save(file_name + '.pdf');
}

function getAnnos(object){
    var val= object.value

    $.get('/getAnno',{"asada": val},function(data) {
      jsonsites = data;
     }).done(function(res){
        var select = document.getElementById("anno");
        select.innerHTML="";
        jsonsites.annos.forEach(function(anno){
            select.innerHTML+="<option value='"+anno.anno+"'>"+anno.anno+"</option>";
        });
        document.getElementById("buttonAnno").value= jsonsites.anno;
     });
     var select = document.getElementById("componenttable");
     select.innerHTML="<tr></tr>";
     document.getElementById("radar-chart-div").style.visibility = "hidden";

}

function getRespuestas(val,tipo){
    if(val!="0" && val!=""){
    $("#error").html("");
    var asada= document.getElementById("asada").value
    var tipo = ((tipo == "actual") ? 'INDICADORXASADA' : 'HISTORICORESPUESTA');
    aranna(asada,tipo,val);
    document.getElementById("radar-chart-div").style.visibility = "visible";
    $.get('/getRespuestas',{"asada": asada, "anno": val, "tipo": tipo},function(data) {
      jsonsites = data;
     }).done(function(res){
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr>";
        jsonsites.preguntas.forEach(function(pregunta){
            select.innerHTML+="<td>"+pregunta.pregunta+"</td><td>"+pregunta.respuesta+"</td>";
        });
        select.innerHTML+="</tr>";

     });
    }
     else{
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr></tr>";
        $("#error").html(((val == "0") ? "No existen respuestas actuales de esta Asada" : 'No existen respuestas históricas de esta Asada'));
        document.getElementById("radar-chart-div").style.visibility = "hidden";
     }
}


function comparar(){
  layers[2].setStyle(null);
  layers2[2].setStyle(null);
  var parameters = { "tipo": "2", "anno": document.getElementById("anno1").value,  "anno2": document.getElementById("anno2").value};
  $.get('/getSites',parameters,function(data) {
      jsonsites = data.jsonsites1;
      jsonsites2 = data.jsonsites2;
     }).done(function(res){       
        layers[2].setStyle(styleFunction);
        layers2[2].setStyle(styleFunction2);
    });
};

function getCanton(){
	var parameters = { "provincia": document.getElementById("prov").value};
	var cantones;
	$.get('/getCantones',parameters,function(data) {
		cantones = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("cant");
		  selectCant.innerHTML="<option value='0'>Sin filtro</option>";
		  cantones.rows.forEach(row => {
			  selectCant.innerHTML+="<option value='"+row.ID+"'>"+row.Nombre+"</option>";
		  });
		  document.getElementById("dist").innerHTML="<option value='0'>Sin filtro</option>";
	  });

}


function getDistrito(){
	var parameters = { "provincia": document.getElementById("prov").value, "canton": document.getElementById("cant").value};
	var distritos;
	$.get('/getDistritos',parameters,function(data) {
		distritos = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("dist");
		  selectCant.innerHTML="<option value='0'>Sin filtro</option>";
		  distritos.rows.forEach(row => {
			  selectCant.innerHTML+="<option value='"+row.ID+"'>"+row.Nombre+"</option>";
		  });
	  });

}

function getAsada()
{
	var provincia = document.getElementById("prov");
	var canton = document.getElementById("cant");
	var distrito = document.getElementById("dist");
	var asadas = document.getElementById("asada");
	for(var i = 1; i < asadas.children.length; i++)
	{
		asadas[i].hidden = !(asadas[i].attributes.provincia.value == provincia.value && asadas[i].attributes.canton.value == canton.value && asadas[i].attributes.distrito.value == distrito.value);
	}
}

function getEstadisticas(){
	var parameters = { "provincia": document.getElementById("prov").value, "canton": document.getElementById("cant").value, "distrito": document.getElementById("dist").value, "orden": document.getElementById("ord").value};
	var distritos;
	$.get('/getEstadisticas',parameters,function(data) {
		distritos = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("componenttable");
		  selectCant.innerHTML="";
		  distritos.rows.forEach(consulta => {
			  selectCant.innerHTML+="<tr><td>"+consulta.Asada_ID+"</td><td>"+consulta.Nombre+"</td><td>"+
			  ""+consulta.Distrito+"</td><td>"+consulta.Canton+"</td><td>"+consulta.Provincia+"</td><td>"+
			  ""+consulta.valor+"</td><td><i class='glyphicon glyphicon-leaf' style='color: #325276' "+
			  "onclick='location.href='/statsSubcomponentes/"+consulta.Asada_ID+"';'></i></td></tr>";
		  });
	  });

}

function getTipoRiesgo (valor)
{
    
    if (valor < 47.0)
    {
      return 4
    }
    else if (valor < 57.0)
    {
      return 3
    }
    else if (valor < 67.0)
    {
      return 2
    }
    else if (valor < 77.0)
    {
      return 1
    }
    else
    {
      return 0
    }
}

function pintarGrafico (graficoObj)
{
	var colores = ['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)'];
	graficoObj.data.datasets[0].backgroundColor = document.getElementById ("tipoGrafico").value == "radar" ? "rgba(25,61,102,0.2)" : []
	graficoObj.data.datasets[0].pointBackgroundColor = []
	for (var i = 0; i < graficoObj.data.datasets[0].data.length; i++)
	{
		if (document.getElementById ("tipoGrafico").value == "radar")
		{
			graficoObj.data.datasets[0].pointBackgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
		else
		{
			graficoObj.data.datasets[0].backgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
	}
	graficoObj.update();
}