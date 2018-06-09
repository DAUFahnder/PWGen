  var Marker = document.createElement("img");
  Marker.setAttribute ("src", browser.extension.getURL("icons/p.png"));
  Marker.setAttribute ("id", "PWGenMarker");                                       // der Marker wird generiert...
  Marker.setAttribute ("position", "fixed");
  Marker.setAttribute ("width", "12px");
  Marker.setAttribute ("height", "12px");
  document.body.appendChild(Marker);
  getID("PWGenMarker").style.display = "none";  

  getID("PWGenMarker").addEventListener ("click", PWGenInject_Push);             // ... sein Listener erzeugt
  
  function PWGenInject_Push(event) {
    alert ("ich gehöre zum Input-Feld\nmit der DOM-ID: "+getID(event.target.id).getAttribute("data-input-id"));      // zu welchem Input-Feld gehöre ich?
  };

  
  window.addEventListener("scroll", function (){getID("PWGenMarker").style.display = "none";});     // wenn sich was ändert nicht lange suchen wo das Feld nun ist,
  window.addEventListener("resize", function (){getID("PWGenMarker").style.display = "none";});     // einfach den Marker wieder ausblenden, fertig     
  
  var PWInputs = [];
  var inputs = document.getElementsByTagName("input");                         // suche die Inputs...
  if (inputs.length > 0) {
    for (var i=0; i<inputs.length; i++) {
      if (inputs[i].type.toLowerCase() === "password") {                      // ... mit type = password.... 
        PWInputs.push(inputs[i]);
      }      
    }
    if (PWInputs.length > 0) {
      for (i = 0; i < PWInputs.length; i++) {
        var Element = getID(PWInputs[i].id);                                // ... und rein mit dem Listener
        Element.addEventListener ("mouseover", PWGenInject_OnHover);        // Hover oder Focus, der Marker wird reingeschoben
        Element.addEventListener ("focus", PWGenInject_OnHover);         
      }
    }
  }

  function PWGenInject_OnHover(event) {
    var Ziel = event.target.id;
    var ZielPosition = getPosition(getID(Ziel));                              // Position,
    var ZielBreite = getID(event.target.id).scrollWidth;                      // Breite,  
    var ZielHoehe = getID(event.target.id).scrollHeight;                      // und Höhe des Inputs
    
    var IconGroesse = (parseInt(ZielHoehe)-4);                                // Icon wird 4 px kleiner    
    
    var PositionZielX = (parseInt(ZielPosition.x) + parseInt(ZielBreite) -(parseInt(IconGroesse))-1)+"px";           // vom Ende des Inputs Icon-Grösse abziehen und da der Marker hin    
    var PositionZielY = ((parseInt(ZielPosition.y) + (parseInt(ZielHoehe)/2) - (parseInt(IconGroesse)/2))+1)+"px";   // die Höhe wird mittig angenommen, plus halbe Icons-Höhe plus 1 px, da steht der Marker    
       
    getID("PWGenMarker").setAttribute("data-input-id", Ziel);                 // damit der Marker sagen kann, zu welchem Input-Feld er gehört...
    getID("PWGenMarker").style.top = PositionZielY;
    getID("PWGenMarker").style.left = PositionZielX;
    getID("PWGenMarker").style.height = IconGroesse+"px";
    getID("PWGenMarker").style.width = IconGroesse+"px";
    getID("PWGenMarker").style.display = "inline-block";
  };

  
//  
// Quelle: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
//
// perfekt: Wo ist denn das Input-Feld? Brauche ich für die Position des Markers
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}