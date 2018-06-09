

  document.addEventListener('DOMContentLoaded', init);
  
  function init (){
    var i;
    var tablinks = document.getElementsByClassName("PWGen_tablinks");
    for (i = 0; i < tablinks.length; i++) {
      getID(tablinks[i].id).addEventListener("click", function(e){PWGen_openTab(this.name, e)});   
    }
    
    var Adresse = window.location.href; 
    var Adresse_Parameter = new URL(Adresse);                
    var Adresse_Paramater_Ziel = Adresse_Parameter.searchParams.get("ziel");                                     // auf URL-Parameter checken...
    if (Adresse_Paramater_Ziel) {getID("PWGenOptions_Button"+Adresse_Paramater_Ziel).click();} // wenn URL-Parameter "Ziel" dann direkt laden
    else {getID("PWGenOptions_ButtonAllgemein").click();}
    
    // getID("PWGenSpeichern").addEventListener("click", PWGenAPI_Speichern);
    // getID("PWGenLaden").addEventListener("click", PWGenAPI_Laden);
     
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


// <div id="PWGenOptionsTabsHilfeSubmenu" class="PWGen_Tabcontent">