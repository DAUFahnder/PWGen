
document.addEventListener('DOMContentLoaded', PWGen_Popup_Init);
var DomainKodiert = "";
var DomainDekodiert = "";

    
function PWGen_Popup_Init(){
 
  function PWGenlogTabs(tabs) {
    let tab = tabs[0];                                          // aktuelle Tab-Domain ins Popup schicken
    var url = new URL(tab.url);
    var url_strg = url.toString();
    if (url_strg.search("moz-extension://") != -1) {                 // aber nur, wenns keine Extension ist...
      inputs = document.getElementsByClassName("PWGenPopupInput");
      for (i = 0; i < inputs.length; i++) {
        getID(inputs[i].id).disabled = true;
      }
      getID("PWGenPopupHinweis").innerHTML = "-- Keine AddOn-Manipulationen möglich! --";
      return;
    }    
    else {
      getID("PWGenPopupHinweis").innerHTML = ""
      inputs = document.getElementsByClassName("PWGenPopupInput");
      for (i = 0; i < inputs.length; i++) {
        getID(inputs[i].id).readOnly = false;
      }    
    
    };
    if (url_strg.search("file://") != -1) {                 // aber nur, wenns keine lokale Datei ist...
      inputs = document.getElementsByClassName("PWGenPopupInput");
      for (i = 0; i < inputs.length; i++) {
        getID(inputs[i].id).disabled = true;
      }
      getID("PWGenPopupHinweis").innerHTML = "-- Keine File-Manipulationen möglich! --";
      return;
    }    
    else {
      getID("PWGenPopupHinweis").innerHTML = ""
      inputs = document.getElementsByClassName("PWGenPopupInput");
      for (i = 0; i < inputs.length; i++) {
        getID(inputs[i].id).readOnly = false;
      }    
    
    };    
    
    if (url.protocol == "about:") {                                 // und keine about:-Seite! 
      inputs = document.getElementsByClassName("PWGenPopupInput");
      for (i = 0; i < inputs.length; i++) {
        getID(inputs[i].id).disabled = true;
      }
      getID("PWGenPopupHinweis").innerHTML = "-- Keine about:-Manipulationen möglich! --";
      return;
    }
    else {
      getID("PWGenPopupHinweis").innerHTML = "";
      inputs = document.getElementsByClassName("PWGenPopupInput");
      for (i = 0; i < inputs.length; i++) {
        getID(inputs[i].id).disabled = false;
      }      
      
    };    
    getID("PWGenPoupFormTableDomain").value = url.hostname;

    var RegExEins = /\./g;
    var RegExZwei = /PUNKT/g;
    DomainKodiert = url.hostname.replace(RegExEins, "PUNKT");
    DomainDekodiert = DomainKodiert.replace(RegExZwei, ".");
    
    browser.storage.local.get()
    .then(settings => {
      var PWGenUser = settings.PWGenUser;
      if (!settings.DomainConfigs[DomainKodiert]) {console.log ("Keine Daten fuer diese Domain gespeichert, Laden abgebrochen. Warte auf Usereingaben!"); return;}          // Optionen für diese Domain wurden noch nie gesetzt -> Abbruch!
      else if (!settings.DomainConfigs[DomainKodiert][PWGenUser]) {console.log ("Der PWGenUser " + PWGenUser + " hat auf dieser Domain noch keine gespeicherten Daten, Laden abgebrochen. Warte auf Usereingaben!"); return;}
      else {
        if (settings.MasterpasswortAbfrage == "2") {        
          getID("PWGenPopupFormTableMasterPW").value = settings.Masterpasswort;
          console.log ("MasterPW noch ver- und entschlüsseln!");        
        };
        if (Object.keys(settings.DomainConfigs[DomainKodiert][PWGenUser][Benutzer]).length > 1) {console.log ("Mehr als einer");}      // Abfragen welcher es denn sein soll...
        console.log("T");
        console.log (Object.keys(settings.DomainConfigs[DomainKodiert][PWGenUser]));
        console.log("T");
        getID("PWGenPopupFormTableBenutzer").value = settings.DomainConfigs[DomainKodiert][PWGenUser].Benutzer;
        getID("PWGenPopupFormTableNummer").value = settings.DomainConfigs[DomainKodiert][PWGenUser].Nummer;
        getID("PWGenPopupFormTableSonderzeichen").value = settings.DomainConfigs[DomainKodiert][PWGenUser].Sonderzeichen;
        getID("PWGenPopupFormTablePWLaenge").value = settings.DomainConfigs[DomainKodiert][PWGenUser].PWLaenge;
      };
      
    }, error => console.log(`Error: ${error}`));

  }
  
  browser.tabs.query({currentWindow: true, active: true}).then(PWGenlogTabs);    

  getID("PWGenPopupFormTableErzeugen").addEventListener("click", PWGenCreatePw);
  getID("PWGenPopupFormTableMasterPW").addEventListener("change", PWGenCreatePw);       // egal ob per Mausklick auf Erzeugen oder per Enter in den Input-Feldern,
  getID("PWGenPopupFormTableDomain").addEventListener("change", PWGenCreatePw);         // immer versuchen das PW zu erzeugen; Vorteil: Enter führt automatisch zum 
  getID("PWGenPopupFormTableBenutzer").addEventListener("change", PWGenCreatePw);       // nächsten Input-Feld das noch leer ist oder erzeugt das PW, welches direkt per
  getID("PWGenPopupFormTablePWKopieren").addEventListener("click", PWGenCopyPw);        // Enter in die Zwischenablage übernommen werden kann
  getID("PWGenPopup_LinkOptionen").addEventListener("click", PWGenLoadOptions);
  getID("PWGenPopup_LinkHilfe").addEventListener("click", PWGenLoadHilfe);
}  

function PWGenLoadHilfe() {
  browser.tabs.create({
    url:browser.extension.getURL("content/options/options.html?ziel=KopfHilfe")
  });
  window.close();
}
function PWGenLoadOptions() {
  browser.tabs.create({
    url:browser.extension.getURL("content/options/options.html?ziel=KopfBenutzer")
  });
  window.close();  
}

//   Daten aus Popup ziehen und PW erzeugen. Vorab Check ob keine Felder leer sind
function PWGenCreatePw() {

  var Master = getID("PWGenPoupFormTableMasterPW").value;
  if (Master == "") {
    getID("PWGenPoupFormTableMasterPW").style.background = "red"; 
    getID("PWGenPopupHinweis").innerHTML = "-- Masterpasswort fehlt! --";
    browser.browserAction.setIcon({path: PopupIconWarn});
    getID("PWGenPoupFormTableMasterPW").focus(); 
    return;
  }
  else {
    getID("PWGenPoupFormTableMasterPW").style.background = "";
    getID("PWGenPopupHinweis").innerHTML = "";
    browser.browserAction.setIcon({path: PopupIconNorm});
  }; 
  var Domain = getID("PWGenPoupFormTableDomain").value;
  if (Domain == "") {
    getID("PWGenPoupFormTableDomain").style.background = "red";
    getID("PWGenPopupHinweis").innerHTML = "-- Domain fehlt! --";
    browser.browserAction.setIcon({path: PopupIconWarn});
  getID("PWGenPoupFormTableDomain").focus(); 
  return;
  }
  else {
    getID("PWGenPoupFormTableDomain").style.background = "";
    getID("PWGenPopupHinweis").innerHTML = "";
    browser.browserAction.setIcon({path: PopupIconNorm});
  };
  var Benutzer = getID("PWGenPoupFormTableBenutzer").value;
  if (Benutzer == "") {
    getID("PWGenPoupFormTableBenutzer").style.background = "red";
    browser.browserAction.setIcon({path: PopupIconWarn});
    getID("PWGenPopupHinweis").innerHTML = "-- Benutzer fehlt! --"; 
    getID("PWGenPoupFormTableBenutzer").focus(); 
    return;
  }
  else {
    getID("PWGenPoupFormTableBenutzer").style.background = "";
    getID("PWGenPopupHinweis").innerHTML = "";
    browser.browserAction.setIcon({path: PopupIconNorm});
  };
  var Nummer = getID("PWGenPoupFormTableNummer").value; 
  var Laenge = getID("PWGenPoupFormTablePWLaenge").value; 
  var pw = Hash(Master+Domain+Benutzer+Nummer);   
  document.getElementById("PWGenPoupFormTableAusgabe").value = pw.substring(0,Laenge);
  
  browser.browserAction.setIcon({path: PopupIconOk});
  getID("PWGenPoupFormTablePWKopieren").focus();                  // PW erzeugt, also focus auf den Kopier-Button
  
      
  browser.storage.local.get()                                     // und wenn autom. Speichern aktiv...  
  .then(settings => {
    console.log (settings);
    if (settings.Options.PWGenOptions_Einstellungen_ProfioptionAutospeichern == "true") {
      console.log ("Speichere");
      var PWGenUser = "DAUFahnder";                                                                                           // PWGen-User -> später mal abfragen...
      var Benutzer = getID("PWGenPopupFormTableBenutzer").value;                                                              // PWGen-Nutzer X benutzt Alias Y...
      if (!settings.DomainConfigs[DomainKodiert]) {settings.DomainConfigs[DomainKodiert] = {}};                               // Nur wenn für diese Domain noch gar keine Daten vorhanden sind...
      if (!settings.DomainConfigs[DomainKodiert][PWGenUser]) {settings.DomainConfigs[DomainKodiert][PWGenUser]= {}};          // Nur wenn dieser PWGen-Benutzer auf dieser Domain noch keine Daten hat...           
      settings.DomainConfigs[DomainKodiert][PWGenUser][Benutzer] = {};      
      settings.DomainConfigs[DomainKodiert][PWGenUser][Benutzer].Benutzer = getID("PWGenPopupFormTableBenutzer").value;        // PWGen-User X benutzt auf dieser Domain den Alias Y... 
      settings.DomainConfigs[DomainKodiert][PWGenUser][Benutzer].Nummer = getID("PWGenPopupFormTableNummer").value;            
      settings.DomainConfigs[DomainKodiert][PWGenUser][Benutzer].Sonderzeichen = getID("PWGenPopupFormTableSonderzeichen").value;
      settings.DomainConfigs[DomainKodiert][PWGenUser][Benutzer].PWLaenge = getID("PWGenPopupFormTablePWLaenge").value;
      browser.storage.local.set(settings)
    .then (() => getID("PWGenPopupHinweis").style.background = "green", getID("PWGenPopupHinweis").style.color = "black", getID("PWGenPopupHinweis").innerHTML = "-- Daten Gespeichert --");
    };          
  }, error => console.log(`Error: ${error}`));

};

function PWGenCopyPw() {
  if (getID("PWGenPoupFormTableAusgabe").value == "") {
    browser.browserAction.setIcon({path: PopupIconWarn});
    getID("PWGenPoupFormTableAusgabe").style.background = "red";
    getID("PWGenPopupHinweis").innerHTML = "-- Passwort fehlt! --"
    return;
  }
  else {
    browser.browserAction.setIcon({path: PopupIconNorm});
    getID("PWGenPoupFormTableAusgabe").style.background = "";
    getID("PWGenPopupHinweis").innerHTML = "";    
  };
  getID("PWGenPoupFormTableAusgabe").select();                // Ausgabe markieren,
  document.execCommand("copy");                               // in die Zwischenablage kopieren,
  browser.browserAction.setIcon({path: PopupIconOk});         // Icon Modus "OK",                                             
  window.close();                                             // Popup schliessen...      
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