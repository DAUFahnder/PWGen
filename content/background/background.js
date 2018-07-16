
const VERSION = "0.1";
const STATUS = "pre-alpha";
const DATUM = "16. Juli 2018"
const GO = browser.storage.local.get();
GO.then(Start, onError);               

function Start(cfg) {

    console.log(cfg);  

  if (cfg.System) {    
    console.log ("Neustart");
  }
  else {                                                                        
    var cfg = {};
      
      cfg.AktuellerUser = "PWGen";
      
      cfg.System = {};
      cfg.System.Datum = DATUM;
      cfg.System.Status = STATUS;      
      cfg.System.Version = VERSION;
      cfg.System.Blacklist = {};
      
      cfg.User = {};
      cfg.User.PWGen = {};                                          // Standard-Nutzer...
      cfg.User.PWGen.Usermodus = 3;
      
      cfg.User.PWGen.Domains = {};                                  // gespeicherte Zugangs-Daten des Nutzers      
      
      cfg.User.PWGen.Optionen = {};      
      cfg.User.PWGen.Optionen.Aussehen = {};                         
      cfg.User.PWGen.Optionen.Aussehen.MarkerFarbe = "pink";
      cfg.User.PWGen.Optionen.Aussehen.MarkerTyp = "1";
      cfg.User.PWGen.Optionen.Aussehen.MarkerGrafik = "";
      cfg.User.PWGen.Optionen.Aussehen.MarkerPosition = "inside_right";
            

      cfg.User.PWGen.Optionen.Benutzer = {};                                
      cfg.User.PWGen.Optionen.Benutzer.HauptpasswortAbfrage = "0";
      cfg.User.PWGen.Optionen.Benutzer.Hauptpasswort = "PWGen";     
      cfg.User.PWGen.Optionen.Benutzer.Anzeigename = "PWgen Default";      

      cfg.User.PWGen.Optionen.Verhalten = {};
      cfg.User.PWGen.Optionen.Verhalten.MarkerSetzen = "true";
      cfg.User.PWGen.Optionen.Verhalten.ButtonSetzen = "true";
      cfg.User.PWGen.Optionen.Verhalten.MenuKlick = "altRight";
      cfg.User.PWGen.Optionen.Verhalten.OptionenKlick = "Middle";
      cfg.User.PWGen.Optionen.Verhalten.PasswortKlick = "Left";
      cfg.User.PWGen.Optionen.Verhalten.OptionenHilfe = "true";
      cfg.User.PWGen.Optionen.Verhalten.AutocompleteOff = "true";
      cfg.User.PWGen.Optionen.Verhalten.SystemBlacklistAktiv = "true";
      cfg.User.PWGen.Optionen.Verhalten.UserWhitelist = {};
      cfg.User.PWGen.Optionen.Verhalten.UserBlacklist = {};
      cfg.User.PWGen.Optionen.Verhalten.DomainImmerSpeichern = "true"; 
      
      
      
      cfg.User.Test = {};                                         
      cfg.User.Test.Usermodus = 3;
      
      cfg.User.Test.Domains = {};                                  
      
      cfg.User.Test.Optionen = {};      
      cfg.User.Test.Optionen.Aussehen = {};                         
      cfg.User.Test.Optionen.Aussehen.MarkerFarbe = "red";
      cfg.User.Test.Optionen.Aussehen.MarkerTyp = "3";
      cfg.User.Test.Optionen.Aussehen.MarkerGrafik = "";
      cfg.User.Test.Optionen.Aussehen.MarkerPosition = "inside_left";
            

      cfg.User.Test.Optionen.Benutzer = {};                                
      cfg.User.Test.Optionen.Benutzer.HauptpasswortAbfrage = "1";
      cfg.User.Test.Optionen.Benutzer.Hauptpasswort = "PWGen";     
      cfg.User.Test.Optionen.Benutzer.Anzeigename = "TestTest";      

      cfg.User.Test.Optionen.Verhalten = {};
      cfg.User.Test.Optionen.Verhalten.MarkerSetzen = "true";
      cfg.User.Test.Optionen.Verhalten.ButtonSetzen = "false";
      cfg.User.Test.Optionen.Verhalten.MenuKlick = "altLeft";
      cfg.User.Test.Optionen.Verhalten.OptionenKlick = "Middle";
      cfg.User.Test.Optionen.Verhalten.PasswortKlick = "Left";
      cfg.User.Test.Optionen.Verhalten.OptionenHilfe = "false";
      cfg.User.Test.Optionen.Verhalten.AutocompleteOff = "false";
      cfg.User.Test.Optionen.Verhalten.SystemBlacklistAktiv = "false";
      cfg.User.Test.Optionen.Verhalten.UserWhitelist = {};
      cfg.User.Test.Optionen.Verhalten.UserBlacklist = {};
      cfg.User.Test.Optionen.Verhalten.DomainImmerSpeichern = "false";       
                 
      
      browser.storage.local.set(cfg);
      // browser.runtime.openOptionsPage();  
      console.log ("Erstkonfiguration komplett");
  }; 
  browser.tabs.onActivated.addListener(PWGen_Background_Init);
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