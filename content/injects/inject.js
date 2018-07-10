"use strict";

          // getID("PWGenMarker").addEventListener ("click", PWGenInject_Push_Links);           // ... sein Linksklick-Listener erzeugt

document.addEventListener("DOMContentLoaded",  PWGenMarker());

function getID(id) {
  return document.getElementById(id);
}

function PWGenMarker() {

  browser.storage.local.get()
  .then(settings => {
    var PWInputs = [];
    var inputs = document.getElementsByTagName("input");                         // suche die Inputs...   
    if (inputs.length > 0) {
      for (var i=0; i<inputs.length; i++) {
        if (settings.Options.PWGenOptions_Einstellungen_InputAutocomplete == "true") {
          if (inputs[i].autocomplete) {
            getID(inputs[i].id).autocomplete = "on";
          }
        }
        if (inputs[i].type.toLowerCase() === "password") {                      // ... mit type = password.... 
          PWInputs.push(inputs[i]);
        }      
      }
      if (PWInputs.length > 0) {
        for (i = 0; i < PWInputs.length; i++) {
          var Element = getID(PWInputs[i].id);                                // ... und rein mit dem Listener:
          Element.addEventListener ("mouseover", PWGenInject_OnHover);        // Hover oder Focus, der Marker wird reingeschoben
          Element.addEventListener ("focus", PWGenInject_OnHover);         
        }
      }
    }
  });

    if (!getID("PWGenMarker")) {
      console.log ("setze Marker");
      var Marker = document.createElement("img");
          Marker.setAttribute ("src", browser.extension.getURL("icons/marker_blue.svg"));
          Marker.setAttribute ("id", "PWGenMarker");                                       // der Marker wird generiert...
          Marker.setAttribute ("position", "fixed");
          Marker.setAttribute ("width", "12px");
          Marker.setAttribute ("height", "30px");
          document.body.appendChild(Marker);
          getID("PWGenMarker").style.display = "none";
          getID("PWGenMarker").addEventListener ("click", PWGenInject_Push_Links);           // ... sein Linksklick-Listener erzeugt
          getID("PWGenMarker").addEventListener ("auxclick", PWGenInject_Push_Links);           // ... sein Linksklick-Listener erzeugt
          
          
    }

    if (!getID("PWGenLeiste")) {   
      console.log ("setze Leiste");      
      var Infoleiste = document.createElement("div");
          Infoleiste.setAttribute ("id", "PWGenLeiste");
          document.body.appendChild(Infoleiste);
          getID("PWGenLeiste").innerHTML = "<ul><li><a id='PWGenLeiste_PWAktuell'>Passwort einfuegen</a></li><li><a id='PWGenLeiste_PWNeu'>Neues Passwort</a></li><li><a id='PWGenLeiste_PWAlt'>Vorheriges Passwort</a></li><hr><li><a id='PWGenLeiste_BenutzerWahl'>Benutzer waehlen</a></li><li><a id='PWGenLeiste_BenutzerNeu'>Neuer Benutzer</a></li><hr><li><a id='PWGenLeiste_Optionen'>Optionen oeffnen</a></li><hr><li><a id='PWGenLeiste_DomainBefuellen'>Alle Felder befuellen</a></li><hr><li><a id='PWGenLeiste_DomainLoeschen'>Daten fuer Seite loeschen!</a></li><hr><li><a id='PWGenLeiste_Beenden'>Schliessen</a></li></ul>";
          getID("PWGenLeiste").style.display = "none";
    };
    getID("PWGenLeiste_Beenden").addEventListener ("click", PWGenLeite_Beenden_F);
    function PWGenLeite_Beenden_F(e) {
      getID("PWGenLeiste").style.display = "none";    
    }
        
  
  function PWGenInject_Push_Links(event) {
    event.preventDefault();
    event.stopPropagation();
    var Ziel = getID(event.target.id).getAttribute("data-input-passwort-id");
    var ZielX = event.clientX;
    var ZielY = event.clientY; 
    var Key, Klick, Mouse, MouseKey, TasteAlt, TasteStrg, TasteShift, PasswortKlick, MenuKlick, OptionsKlick;      // den Mausklick auf den Marker bestimmen...
    if (event.altKey) {Key = "alt"}
    else if (event.shiftKey) {Key = "shift"}
    else if (event.ctrlKey) {Key = "ctrl"}
    else {Key = ""};
    if (event.button == 0) {Mouse = "Left"}
    if (event.button == 1) {Mouse = "Middle"}
    if (event.button == 2) {Mouse = "Right"}
    MouseKey = Key+Mouse;                 
    
    getID("PWGenMarker").style.display = "none";
    
    browser.storage.local.get()
    .then(settings => {
          PasswortKlick = settings.Options.PWGenOptions_Einstellungen_InputMarkerPasswortklick;
          OptionsKlick = settings.Options.PWGenOptions_Einstellungen_InputMarkerOptionsklick;
          MenuKlick = settings.Options.PWGenOptions_Einstellungen_InputMarkerMenuklick;                           // .. und die entsprechende Funktion starten    
          if (MouseKey == PasswortKlick) {PWGen_Passwortklick(Ziel);}
          else if (MouseKey == OptionsKlick) {PWGen_OptionsKlick(Ziel);}
          else if (MouseKey == MenuKlick) {PWGen_MenuKlick(Ziel, ZielX, ZielY);}; 
        }
    );
  };
  
  function PWGen_Passwortklick(Ziel) {
    console.log ("Passwortklick");
    getID("PWGenMarker").style.display = "none";
  }

  function PWGen_OptionsKlick(Ziel) {
    console.log ("Optionsklick");
    console.log(browser);
    console.log (browser.extension.getURL("content/options/options.html"));
    
    browser.tabs.create({
      url:browser.extension.getURL("content/options/options.html?ziel=KopfInfo")
    });

  }

  function PWGen_MenuKlick(Ziel, ZielX, ZielY) {
    console.log ("Menuklick");
    var ZielPosition = getPosition(getID(Ziel));
    getID("PWGenLeiste").style.display = "block";
    getID("PWGenLeiste").style.top = ZielY + "px";
    getID("PWGenLeiste").style.left = ZielX + "px";
  }

  
  window.addEventListener("scroll", function (){getID("PWGenMarker").style.display = "none"; getID("PWGenLeiste").style.display = "none";});     // wenn sich was ändert nicht lange suchen wo das Feld nun ist,
  window.addEventListener("resize", function (){getID("PWGenMarker").style.display = "none"; getID("PWGenLeiste").style.display = "none";});     // einfach den Marker wieder ausblenden, fertig   
    
  
  function PWGenInject_OnHover(event) { 
      browser.storage.local.get()
      .then(settings => {
            if (settings.Options.PWGenOptions_Einstellungen_InputMarkerAktiv == "false") {getID("PWGenMarker").style.display = "none"; return};
            getID("PWGenMarker").src = browser.extension.getURL("icons/marker" + settings.Options.PWGenOptions_Einstellungen_InputMarkerTyp + "_" + settings.Options.PWGenOptions_Einstellungen_InputMarkerFarbe + ".svg");                     // weitere Daten wie aktuelle Domain, Master-PW etc hier senden...          
            var Ziel = event.target.id;
            var ZielPosition = getPosition(getID(Ziel));                              // Position,
            var ZielBreite = getID(event.target.id).clientWidth;                      // Breite,  
            var ZielHoehe = getID(event.target.id).clientHeight;                      // und Höhe des Inputs
    
            var IconGroesse = (parseInt(ZielHoehe)-4);                                // Icon wird 4 px kleiner    
    
            var PositionZielX = (parseInt(ZielPosition.x) + parseInt(ZielBreite) -(parseInt(IconGroesse))-1)+"px";           // vom Ende des Inputs Icon-Grösse abziehen und da der Marker hin    
            var PositionZielY = ((parseInt(ZielPosition.y) + (parseInt(ZielHoehe)/2) - (parseInt(IconGroesse)/2))+1)+"px";   // die Höhe wird mittig angenommen, plus halbe Icons-Höhe plus 1 px, da steht der Marker    
       
            getID("PWGenMarker").setAttribute("data-input-passwort-id", Ziel);                 // damit der Marker sagen kann, zu welchem Input-Feld er gehört...
            getID("PWGenMarker").style.top = PositionZielY;
            getID("PWGenMarker").style.left = PositionZielX;
            getID("PWGenMarker").style.height = IconGroesse+"px";
            getID("PWGenMarker").style.width = IconGroesse+"px";
            getID("PWGenMarker").style.display = "inline-block";          
          }
      );  
  };

};
  
//  
// Quelle: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
// perfekt: Wo ist denn das Input-Feld? Brauche ich für die Position des Markers
// 
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