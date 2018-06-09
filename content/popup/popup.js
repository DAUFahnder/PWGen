
document.addEventListener('DOMContentLoaded', PWGeninit);    
function PWGeninit(){
 
  function PWGenlogTabs(tabs) {
    let tab = tabs[0];                                          // aktuelle Tab-Domain ins Popup schicken
    var url = new URL(tab.url);
    var url_strg = url.toString();
    if (url_strg.search("moz-extension://") != -1) {                 // aber nur, wenns keine Extension ist...
      inputs = document.getElementsByClassName("PWGenPopupInput");
      console.log (inputs);
      for (i = 0; i < inputs.length; i++) {
        console.log(inputs[i].id);
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
  }
  
  browser.tabs.query({currentWindow: true, active: true}).then(PWGenlogTabs);    


  getID("PWGenPoupFormTableErzeugen").addEventListener("click", PWGenCreatePw);
  getID("PWGenPoupFormTableMasterPW").addEventListener("change", PWGenCreatePw);       // egal ob per Mausklick auf Erzeugen oder per Enter in den Input-Feldern,
  getID("PWGenPoupFormTableDomain").addEventListener("change", PWGenCreatePw);         // immer versuchen das PW zu erzeugen; Vorteil: Enter führt automatisch zum 
  getID("PWGenPoupFormTableBenutzer").addEventListener("change", PWGenCreatePw);       // nächsten Input-Feld das noch leer ist oder erzeugt das PW, welches direkt per
  getID("PWGenPoupFormTablePWKopieren").addEventListener("click", PWGenCopyPw);        // Enter in die Zwischenablage übernommen werden kann
  getID("PWGenPopup_LinkOptionen").addEventListener("click", PWGenLoadOptions);
  getID("PWGenPopup_LinkHilfe").addEventListener("click", PWGenLoadHilfe);
}  

function PWGenLoadHilfe() {
  browser.tabs.create({
    url:browser.extension.getURL("content/options/options.html?ziel=Hilfe&Status="+PWGenPopupStatus)
  });
  window.close();
}
function PWGenLoadOptions() {
  browser.tabs.create({
    url:browser.extension.getURL("content/options/options.html")
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
    return
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
  return
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
    return
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
};

function PWGenCopyPw() {
  if (getID("PWGenPoupFormTableAusgabe").value == "") {
    browser.browserAction.setIcon({path: PopupIconWarn});
    getID("PWGenPoupFormTableAusgabe").style.background = "red";
    getID("PWGenPopupHinweis").innerHTML = "-- Passwort fehlt! --"
    return;;
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
  24: "../../icons/icon_r_24.png",
  32: "../../icons/icon_r_32.png",
  48: "../../icons/icon_r_48.png",
  64: "../../icons/icon_r_64.png"
}
var PopupIconNorm = {
  24: "../../icons/icon_b_24.png",
  32: "../../icons/icon_b_32.png",
  48: "../../icons/icon_b_48.png",
  64: "../../icons/icon_b_64.png"
}
var PopupIconOk = {
  24: "../../icons/icon_g_24.png",
  32: "../../icons/icon_g_32.png",
  48: "../../icons/icon_g_48.png",
  64: "../../icons/icon_g_64.png"
}
var PWGenPopupStatus;