
  document.addEventListener('DOMContentLoaded', PWGen_Options_Init);
  

  var PWGenDesign_Default = "body {\n color: black;\n}"
  var PWGen_Init = false;  
  
  function PWGen_Options_Init(){
    if (PWGen_Init == true) {return}; 
    getID("TestButton").addEventListener("click", function(){console.log(getID("PWGenOptions_Einstellungen_InputMarkerMenuklick").value)});
    var i;
    var tablinks = document.getElementsByClassName("PWGen_tablinks");    
    for (i = 0; i < tablinks.length; i++) {                                                           // Listener für die Options-Tabs
      getID(tablinks[i].id).addEventListener("click", function(e){PWGen_openTab(this.name, e)});
    }

    getID("PWGenOptions_Einstellungen_InputMarkerFarbe").addEventListener("change", function(){
      PWGen_Config.Marker.Farbe = getID("PWGenOptions_Einstellungen_InputMarkerFarbe").value;
      console.log (PWGen_Config.Marker.Farbe);
      browser.storage.local.set({PWGen_Config});
      console.log (PWGen_Config);            
    });

    getID("PWGenOptions_Einstellungen_InputProfiEinstellungen").addEventListener("change", function(){
      if (getID("PWGenOptions_Einstellungen_InputProfiEinstellungen").value == "true"){
        getID("PWGenOptions_ButtonAussehen").style.display = "inline-block";
        var y = document.querySelectorAll('tr.PWGen_Profioptionen');                        // Profi-Optionen aktiv
        for (var i = 0; i < y.length; i++) {
          y[i].style.display='table-row';
        };        
      }
      else {
        getID("PWGenOptions_ButtonAussehen").style.display = "none";
        var y = document.querySelectorAll('tr.PWGen_Profioptionen');                        // Profi-Optionen inaktiv
        for (var i = 0; i < y.length; i++) {
          y[i].style.display='none';
        };
      }                  
    });
    
    getID("PWGenOptions_Einstellungen_InputMarkerAktiv").addEventListener("change", function(){
      if (getID("PWGenOptions_Einstellungen_InputMarkerAktiv").value == "true"){
        var y = document.querySelectorAll('tr.PWGen_Markeroptionen');                        // Marker aktiv
        for (var i = 0; i < y.length; i++) {
          y[i].style.display='table-row';
        };        
      }
      else {
        var y = document.querySelectorAll('tr.PWGen_Markeroptionen');                        // Marker inaktiv
        for (var i = 0; i < y.length; i++) {
          y[i].style.display='none';
        };
      }                  
    });
    
    
    getID("PWGenOptions_Einstellungen_InputMasterpasswort").addEventListener("change", function(){
      if (getID("PWGenOptions_Einstellungen_InputMasterpasswort").value == "save"){
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
      }                  
    });
    
    // erstmal die eigentlich unsichtbaren Felder ausblenden:
    getID("PWGenOptions_ButtonAussehen").style.display = "none";
    var y = document.querySelectorAll('tr.PWGen_Profioptionen');                        
    for (var i = 0; i < y.length; i++) {
      y[i].style.display='none';
    };
    var y = document.querySelectorAll('tr.PWGen_Masterpasswort_Vorgabe');                       
    for (var i = 0; i < y.length; i++) {
      y[i].style.display='none';
    }; 
    
    var Adresse = window.location.href; 
    var Adresse_Parameter = new URL(Adresse);                
    var Adresse_Paramater_Ziel = Adresse_Parameter.searchParams.get("ziel");                                     // auf URL-Parameter checken...
    if (Adresse_Paramater_Ziel) {getID("PWGenOptions_Button"+Adresse_Paramater_Ziel).click();}                   // wenn URL-Parameter "Ziel" dann direkt laden
    else {getID("PWGenOptions_ButtonAllgemein").click();}
    PWGen_Init = true;
  }
  
  function PWGen_openTab(tabName, event) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("PWGen_Tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabcontent = document.getElementsByClassName("PWGen_TabcontentSub");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
        

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("PWGen_tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");        
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    getID("PWGenOptionsTabs"+event.target.innerHTML).style.display = "block";
    if (getID("PWGenOptionsTabs"+event.target.innerHTML+"Submenu")) {
      getID("PWGenOptionsTabs"+event.target.innerHTML+"Submenu").style.display = "block";
    }
    getID(event.target.id).classList.add("active");
}
