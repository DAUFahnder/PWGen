
  document.addEventListener('DOMContentLoaded', PWGen_Options_Init);

  var pwg_cfg = {};
      pwg_cfg.Options = {};      
  
    function PWGen_Options_Load() {
      browser.storage.local.get()
        .then(settings => {
        if (!settings.Options) {console.log ("Erster Aufruf der Optionen, Laden abgebrochen. Warte auf Usereingaben!"); return;}          // Optionen wurden noch nie gesetzt -> Abbruch!
        Object.keys(settings.Options).forEach(
        key => getID(key).value = settings.Options[key]
        );           // Einmal durchs Array bitte und die Daten in den Optionen einfügen...
      }, error => console.log(`Error: ${error}`));
    }
    
    function PWGen_Options_Init(){    
    if (browser.storage) {PWGen_Options_Load();}                      // im Testmodus (nur als Webseite) gibts kein browser.storage...
    var i;
    var BetaInputs = document.getElementsByClassName("BETA");
    for (i = 0; i < BetaInputs.length; i++) {                                                           // Listener für die Options-Tabs
      getID(BetaInputs[i].id).disabled = true;;
    }
    
    var i;
    var tablinks = document.getElementsByClassName("tabsKopf");    
    for (i = 0; i < tablinks.length; i++) {                                                           // Listener für die Options-Tabs
      getID(tablinks[i].id).addEventListener("click", function(e){PWGen_openTab(e)});
    }
    var i;
    var tablinks = document.getElementsByClassName("tabsSub");    
    for (i = 0; i < tablinks.length; i++) {                                                           // Listener für die Options-SubTabs
      getID(tablinks[i].id).addEventListener("click", function(e){PWGen_openTab(e)});
    }
    
    var i;
    var optionen = document.getElementsByClassName("PWGenOptionsInput");    
    for (i = 0; i < optionen.length; i++) {                                                           
      getID(optionen[i].id).addEventListener("change", function(e){
        var c;
        var defaultSettings = {};
            defaultSettings.Options = {};
        var inputs = document.getElementsByClassName("PWGenOptionsInput");                         // Listener für die Optionsfelder
        for (c = 0; c < inputs.length; c++) {
          defaultSettings.Options[inputs[c].id] = getID(inputs[c].id).value;
        }
        browser.storage.local.set(defaultSettings)
        .then (() => setTimeout(() => setStatus(e.target.id), 200));
        PWGen_CheckAnsicht();
        e.preventDefault();
      });
    }

    

    var Adresse = window.location.href; 
    var Adresse_Parameter = new URL(Adresse);                
    var Adresse_Paramater_Ziel = Adresse_Parameter.searchParams.get("ziel");                                     // auf URL-Parameter checken...
    if (Adresse_Paramater_Ziel) {getID("tabs"+Adresse_Paramater_Ziel).click();}                   // wenn URL-Parameter "Ziel" dann direkt laden
    else {getID("tabsKopfInfo").click();}
    var t = setTimeout(function(){
      PWGen_CheckAnsicht(); 
    }, 50);
  }
  
  function PWGen_openTab(event) {   
       
    var i;
    var tablinks = document.getElementsByClassName("tabsKopf");    
    for (i = 0; i < tablinks.length; i++) {                                      
      getID(tablinks[i].id).classList.remove("kopfAktiv");
    };
    var i;
    var tablinks = document.getElementsByClassName("tabsSub");    
    for (i = 0; i < tablinks.length; i++) {                                      
      getID(tablinks[i].id).classList.remove("subAktiv");
    };
    var i;
    var tablinks = document.getElementsByClassName("tabsWrapper");    
    for (i = 0; i < tablinks.length; i++) {                                      
      getID(tablinks[i].id).classList.remove("wrapperAktiv");
    };
    var i;
    var tablinks = document.getElementsByClassName("tabsContent");    
    for (i = 0; i < tablinks.length; i++) {                                      
      getID(tablinks[i].id).style.display = "none";
    };
    var i;
    var tablinks = document.getElementsByClassName("tabsSubContent");    
    for (i = 0; i < tablinks.length; i++) {                                      
      getID(tablinks[i].id).style.display = "none";
    };

    
    
    var LinkZiel = getID(event.target.id).getAttribute("data-zielid");
    var TabsQuelleType = getID(event.target.id).getAttribute("data-tabstype");;
    var TabsQuelleWrapper = getID(event.target.id).getAttribute("data-tabswrapper");     
    getID(LinkZiel).style.display = "block";
    getID(event.target.id).classList.add(TabsQuelleType+"Aktiv");
    getID(TabsQuelleWrapper).classList.add("wrapperAktiv");        
    

  }


  // Markeroptionen, Profioptionen etc nur einblenden wenn sie auch aktiv sein sollen 
  function PWGen_CheckAnsicht() {

    if (getID("PWGenOptions_Einstellungen_InputHilfeaktiv").value == "true"){
      var y = document.querySelectorAll("td.Schalterhilfe");                        // Hilfe-System aktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="table-cell";
      };        
    }
    else {
      var y = document.querySelectorAll("td.Schalterhilfe");                        // Hilfe-System inaktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="none";
      };
    };                  

    if (getID("PWGenOptions_Einstellungen_BenutzerMultipleJaNein").value == "true") {                                              // wenn multiple Benutzer, dann...
      getID("PWGenOptions_Einstellungen_BenutzerDatenMultiplerText").innerHTML = " des Benutzers " + getID("PWGenOptions_Einstellungen_BenutzerAuswahl").value;                    // - den Infotext zu den gespeicherten Daten anpassen
      var y = document.querySelectorAll("tr.PWGen_MultipleBenutzer");
      for (var i = 0; i < y.length; i++) {                                        // - die Tabellenzeilen einblenden
        y[i].style.display="table-row";        
      }
    }
    else {                                                                        // ansonsten den Infotext und die Zeilen ausblenden    
      getID("PWGenOptions_Einstellungen_BenutzerDatenMultiplerText").innerHTML = "";
      var y = document.querySelectorAll("tr.PWGen_MultipleBenutzer");
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="none";        
      }
    };
    
    
    if (getID("PWGenOptions_Einstellungen_InputProfiEinstellungen").value == "true"){
      var y = document.querySelectorAll("tr.PWGen_Profioptionen");                        // Profi-Optionen aktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="table-row";
      };        
    }
    else {
      var y = document.querySelectorAll("tr.PWGen_Profioptionen");                        // Profi-Optionen inaktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="none";
      };
    };                  
    if (getID("PWGenOptions_Einstellungen_InputMarkerAktiv").value == "true"){
      var y = document.querySelectorAll("tr.PWGen_Markeroptionen");                        // Marker aktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="table-row";
      };      
      if (getID("PWGenOptions_Einstellungen_InputMarkerEigeneGrafik").value) {
        getID("PWGenOptions_Einstellungen_InputMarkerEigeneGrafikMuster").innerHTML = "<br/>Es wurde folgende Grafik hinterlegt: <img src='" + getID("PWGenOptions_Einstellungen_InputMarkerEigeneGrafik").value + "' height='20px' width='20px'>";
      }
      else {getID("PWGenOptions_Einstellungen_InputMarkerEigeneGrafikMuster").innerHTML = ""}
      
      getID("MarkerMuster1").src = "../../icons/marker" + getID("PWGenOptions_Einstellungen_InputMarkerTyp").value + "_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
      getID("MarkerMuster2").src = "../../icons/marker" + getID("PWGenOptions_Einstellungen_InputMarkerTyp").value + "_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
      getID("Marker1Muster").src = "../../icons/marker1_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
      getID("Marker2Muster").src = "../../icons/marker2_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
      getID("Marker3Muster").src = "../../icons/marker3_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
      getID("Marker4Muster").src = "../../icons/marker4_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
      getID("Marker5Muster").src = "../../icons/marker5_" + getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value + ".svg";
            
    }
    else {
      var y = document.querySelectorAll('tr.PWGen_Markeroptionen');                        // Marker inaktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display='none';
      };
    };                  

    if (getID("PWGenOptions_Einstellungen_InputMasterpasswort").value == "2"){
      var y = document.querySelectorAll('tr.PWGen_Masterpasswort_Vorgabe');                        // Master-Passwort speichern ja
      for (var i = 0; i < y.length; i++) {
        y[i].style.display='table-row';
      };        
    }
    else {
      var y = document.querySelectorAll('tr.PWGen_Masterpasswort_Vorgabe');                        // Master-Passwort speichern nein
      for (var i = 0; i < y.length; i++) {
        y[i].style.display='none';
      };
    };
  } 

  function setStatus(t) {
    getID(t).style.background = "green";    
    getID("PWGenOptionenInhalte").style.borderColor = "green";
    setTimeout(() => (getID(t).style.background = "", getID("PWGenOptionenInhalte").style.borderColor = ""), 650);    
  }
