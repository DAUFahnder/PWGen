
  document.addEventListener('DOMContentLoaded', PWGen_Options_Init);
    
    
    function PWGen_Options_Load() {
      for(i = getID("PWGen_BenutzerAuswahl").options.length - 1 ; i >= 0 ; i--) {
        getID("PWGen_BenutzerAuswahl").remove(i);
      };
      
      browser.storage.local.get()
        .then(Speicher => {
          
          // neu einsetzen:
          for(name in Speicher.User) {            
            var Feld = getID("PWGen_BenutzerAuswahl");
            var c = document.createElement("option");
            c.text = Speicher.User[name].Optionen.Benutzer.Anzeigename;
            c.value = name; 
            Feld.options.add(c, 1);
          };
          
          getID("PWGen_Version").innerHTML = Speicher.System.Version + " " + Speicher.System.Status + " | " + Speicher.System.Datum + "<br/> ";
          getID("PWGen_BenutzerAuswahl").value = Speicher.AktuellerUser;
          var User = getID("PWGen_BenutzerAuswahl").value;
                    
          getID("PWGen_MarkerFarbe").value = Speicher.User[User].Optionen.Aussehen.MarkerFarbe;
          getID("PWGen_MarkerTyp").value = Speicher.User[User].Optionen.Aussehen.MarkerTyp;
          getID("PWGen_MarkerGrafik").value = Speicher.User[User].Optionen.Aussehen.MarkerGrafik;
          getID("PWGen_MarkerPosition").value = Speicher.User[User].Optionen.Aussehen.MarkerPosition;
          

          getID("PWGen_HauptpasswortAbfrage").value = Speicher.User[User].Optionen.Benutzer.HauptpasswortAbfrage;

          getID("PWGen_MarkerSetzen").value = Speicher.User[User].Optionen.Verhalten.MarkerSetzen;
          getID("PWGen_ButtonSetzen").value = Speicher.User[User].Optionen.Verhalten.ButtonSetzen;
          getID("PWGen_MenuKlick").value = Speicher.User[User].Optionen.Verhalten.MenuKlick;
          getID("PWGen_OptionenKlick").value = Speicher.User[User].Optionen.Verhalten.OptionenKlick;
          getID("PWGen_PasswortKlick").value = Speicher.User[User].Optionen.Verhalten.PasswortKlick;
          getID("PWGen_OptionenHilfe").value = Speicher.User[User].Optionen.Verhalten.OptionenHilfe;
          getID("PWGen_AutocompleteOff").value = Speicher.User[User].Optionen.Verhalten.AutocompleteOff;
          getID("PWGen_SystemBlacklistAktiv").value = Speicher.User[User].Optionen.Verhalten.SystemBlacklistAktiv;
          getID("PWGen_DomainImmerSpeichern").value = Speicher.User[User].Optionen.Verhalten.DomainImmerSpeichern;
          PWGen_CheckAnsicht(); 
        }, error => console.log(`Error: ${error}`));
    }
    
    function PWGen_Options_Init(){    
    PWGen_Options_Load();                     
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

    getID("PWGen_BenutzerAuswahl").addEventListener ("change", function(e){
      browser.storage.local.get()
        .then(Speicher => {
          var User = getID("PWGen_BenutzerAuswahl").value;
          Speicher.AktuellerUser = User;
          browser.storage.local.set(Speicher)
          .then (() => setTimeout(() => setStatus(e.target.id), 200))
          .then (() => PWGen_Options_Load());             
        }, error => console.log(`Error: ${error}`));       
      e.preventDefault();
    });

    var i;
    var optionen = document.getElementsByClassName("PWGen_Optionen");    
    for (i = 0; i < optionen.length; i++) {                                                           
      getID(optionen[i].id).addEventListener("change", function(e){
        browser.storage.local.get()
          .then(Speicher => {
            var User = getID("PWGen_BenutzerAuswahl").value;
            Speicher.AktuellerUser = User;
            Speicher.User[User].Optionen.Aussehen.MarkerFarbe = getID("PWGen_MarkerFarbe").value;
            Speicher.User[User].Optionen.Aussehen.MarkerTyp = getID("PWGen_MarkerTyp").value;
            Speicher.User[User].Optionen.Aussehen.MarkerGrafik = getID("PWGen_MarkerGrafik").value;
            Speicher.User[User].Optionen.Aussehen.MarkerPosition = getID("PWGen_MarkerPosition").value;
            

            Speicher.User[User].Optionen.Benutzer.HauptpasswortAbfrage = getID("PWGen_HauptpasswortAbfrage").value;

            Speicher.User[User].Optionen.Verhalten.MarkerSetzen = getID("PWGen_MarkerSetzen").value;
            Speicher.User[User].Optionen.Verhalten.ButtonSetzen = getID("PWGen_ButtonSetzen").value;
            Speicher.User[User].Optionen.Verhalten.MenuKlick = getID("PWGen_MenuKlick").value;
            Speicher.User[User].Optionen.Verhalten.OptionenKlick = getID("PWGen_OptionenKlick").value;
            Speicher.User[User].Optionen.Verhalten.PasswortKlick = getID("PWGen_PasswortKlick").value;
            Speicher.User[User].Optionen.Verhalten.OptionenHilfe = getID("PWGen_OptionenHilfe").value;
            Speicher.User[User].Optionen.Verhalten.AutocompleteOff = getID("PWGen_AutocompleteOff").value;
            Speicher.User[User].Optionen.Verhalten.SystemBlacklistAktiv = getID("PWGen_SystemBlacklistAktiv").value;
            Speicher.User[User].Optionen.Verhalten.DomainImmerSpeichern = getID("PWGen_DomainImmerSpeichern").value;
            browser.storage.local.set(Speicher)
            .then (() => setTimeout(() => setStatus(e.target.id), 100))
            .then (() => PWGen_CheckAnsicht());            
          }, error => console.log(`Error: ${error}`));
        e.preventDefault();
      });
    }

    var Adresse = window.location.href;
    var Adresse_Parameter = new URL(Adresse);                
    var Adresse_Paramater_Ziel = Adresse_Parameter.searchParams.get("ziel");                      // auf URL-Parameter checken...
    if (Adresse_Paramater_Ziel) {getID("tabs"+Adresse_Paramater_Ziel).click();}                   // wenn URL-Parameter "Ziel" dann direkt laden
    else {getID("tabsKopfBenutzer").click();}
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
    
    if (getID("PWGen_HauptpasswortAbfrageSpeichern").value != getID("PWGen_HauptpasswortAbfrageWiederholen").value) {
      getID("PWGen_HauptpasswortAbfrageSpeichern").style.background = "red";
      getID("PWGen_HauptpasswortAbfrageWiederholen").style.background = "red";      
    }
    else {
      getID("PWGen_HauptpasswortAbfrageSpeichern").style.background = "";
      getID("PWGen_HauptpasswortAbfrageWiederholen").style.background = "";      
    } 

    if (getID("PWGen_OptionenHilfe").value == "true"){
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

    if (getID("PWGen_MarkerSetzen").value == "true"){
      var y = document.querySelectorAll("tr.PWGen_Markeroptionen");                        // Marker aktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display="table-row";
      };      
      if (getID("PWGen_MarkerGrafik").value) {
        getID("PWGenOptions_Einstellungen_InputMarkerEigeneGrafikMuster").innerHTML = "<br/>Es wurde folgende Grafik hinterlegt: <img src='" + getID("PWGen_MarkerGrafik").value + "' height='20px' width='20px'>";
      }
      else {getID("PWGenOptions_Einstellungen_InputMarkerEigeneGrafikMuster").innerHTML = ""}
      
      getID("MarkerMuster1").src = "../../icons/marker" + getID("PWGen_MarkerTyp").value + "_" + getID("PWGen_MarkerFarbe").value + ".svg";
      getID("MarkerMuster2").src = "../../icons/marker" + getID("PWGen_MarkerTyp").value + "_" + getID("PWGen_MarkerFarbe").value + ".svg";
      getID("Marker1Muster").src = "../../icons/marker1_" + getID("PWGen_MarkerFarbe").value + ".svg";
      getID("Marker2Muster").src = "../../icons/marker2_" + getID("PWGen_MarkerFarbe").value + ".svg";
      getID("Marker3Muster").src = "../../icons/marker3_" + getID("PWGen_MarkerFarbe").value + ".svg";
      getID("Marker4Muster").src = "../../icons/marker4_" + getID("PWGen_MarkerFarbe").value + ".svg";
      getID("Marker5Muster").src = "../../icons/marker5_" + getID("PWGen_MarkerFarbe").value + ".svg";             
    }
    
    else {
      var y = document.querySelectorAll('tr.PWGen_Markeroptionen');                        // Marker inaktiv
      for (var i = 0; i < y.length; i++) {
        y[i].style.display='none';
      };
    };                  

    if (getID("PWGen_HauptpasswortAbfrage").value == "2"){
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
