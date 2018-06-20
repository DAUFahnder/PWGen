
browser.tabs.onActivated.addListener(PWGen_Background_Init);         


// Domain und alle eventuell damit verbundenen Daten aktualisieren:
function PWGen_Background_Init(){browser.tabs.query({currentWindow: true, active: true}).then(PWGen_logTabs, onError);}
              
function PWGen_logTabs(tabs) {
    console.log (PWGen_Config.Marker.Farbe);
    let tab = tabs[0]; // Dürfte nur ein aktiver Tab im aktuellen Fenster sein...
    var url = new URL(tab.url);
    var url_strg = url.toString();
    
    if (url_strg.search("moz-extension://") != -1) { 
      return;    
    };
    if (url_strg.search("file://") != -1) { 
      return;    
    };
    if (url.protocol == "about:") {     
      return;    
    };
    PWGen_Aktuell.Domain = url.hostname;

    var regexp = /^[0-9,.]*$/;
    if (PWGen_Aktuell.Domain.match(regexp)) {
      return;
    };
}

function onError(err){
    console.error(err); 
}

