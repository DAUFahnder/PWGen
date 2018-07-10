
const GO = browser.storage.local.get();
GO.then(Start, onError);

function Start(cfg) {
  if (cfg.Setup) {console.log ("Neustart")}
  else {                                                                        // Start-Config nur laden wenn noch keine Config vorhanden...
  var PWG_cfg = {};
      PWG_cfg.Options = {};
      PWG_cfg.Options.PWGenOptions_Einstellungen_InputMarkerFarbe = "black";
      PWG_cfg.Options.PWGenOptions_Einstellungen_ProfioptionAutospeichern = "true";
      PWG_cfg.Options.PWGenOptions_Einstellungen_InputMarkerPasswortklick = "Left";
      PWG_cfg.Options.PWGenOptions_Einstellungen_InputMarkerMenuklick = "altLeft";
      PWG_cfg.Options.PWGenOptions_Einstellungen_InputMarkerOptionsklick = "ctrlLeft";
      PWG_cfg.Options.PWGenOptions_Einstellungen_InputAutocomplete = "true";
      PWG_cfg.Multiuser = "false";      
      PWG_cfg.PWGenUser = "PWGen";
      
 
            
      PWG_cfg.DomainConfigs = {};
      PWG_cfg.Blacklist = {};
      PWG_cfg.Blacklist.System = {};
      PWG_cfg.Blacklist.User = {};
      PWG_cfg.Whitelist = {};
      PWG_cfg.Setup = true;
      PWG_cfg.MasterpasswortAbfrage = "0";
      browser.storage.local.set(PWG_cfg);
      browser.runtime.openOptionsPage();  
      console.log ("Erstkonfiguration komplett");
  }; 
  browser.tabs.onActivated.addListener(PWGen_Background_Init);
  console.log ("Beta, starte Optionen auch bei Neustart!");
  browser.runtime.openOptionsPage();
  PWGen_Background_Init();
}         

// Domain und alle eventuell damit verbundenen Daten aktualisieren:
function PWGen_Background_Init(){browser.tabs.query({currentWindow: true, active: true}).then(PWGen_logTabs, onError);}
              
function PWGen_logTabs(tabs) {
    let tab = tabs[0]; // Dürfte nur ein aktiver Tab im aktuellen Fenster sein...
    var url = new URL(tab.url);
    var url_strg = url.toString();
    var PWGen_AktuellDomain = url.hostname;
    
    var RegExEins = /\./g;
    DomainKodiert = url.hostname.replace(RegExEins, "PUNKT");
    
    var regexp = /^[0-9,.]*$/;

    if (PWGen_AktuellDomain.match(regexp)) {
      browser.browserAction.setIcon({path: PopupIconWarn});
      return;
    }    
    else if (url_strg.search("moz-extension://") != -1) {
      browser.browserAction.setIcon({path: PopupIconWarn}); 
      return;    
    }
    else if (url_strg.search("file://") != -1) {
      browser.browserAction.setIcon({path: PopupIconWarn}); 
      return;    
    }
    else if (url.protocol == "about:") {
      browser.browserAction.setIcon({path: PopupIconWarn});     
      return;    
    }
    else {
      browser.storage.local.get()
      .then(settings => {        
        if (settings.DomainConfigs[DomainKodiert]) {
          browser.browserAction.setIcon({path: PopupIconOk});

          browser.browserAction.setBadgeText({text: "9"});                        // fehlt: Abfrage wieviele Identitäten hat er denn hier...
          browser.browserAction.setBadgeBackgroundColor({color: "green"});

        }
        else {browser.browserAction.setIcon({path: PopupIconNorm});}        
      }
    );
    }
}

function onError(err){
    console.error(err); 
}

var PopupIconWarn = {
  24: "../../icons/icon_red.svg"
}
var PopupIconNorm = {
  24: "../../icons/icon_blue.svg"
}
var PopupIconOk = {
  24: "../../icons/icon_green.svg"
}