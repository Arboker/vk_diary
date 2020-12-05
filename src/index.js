import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import AppGuide from "./AppGuide";

// Init VK  Mini App
bridge.send("VKWebAppInit");

bridge.subscribe(e => {
  let body = document.getElementById('main');
  if (e.detail.type === "VKWebAppUpdateConfig") {
    if (e.detail.data.scheme) {
      body.setAttribute('scheme', e.detail.data.scheme);
      
      bridge.send('VKWebAppSetViewSettings', {
        'status_bar_style': e.detail.data.scheme === "bright_light" ? 'dark' : 'light',
        'action_bar_color': e.detail.data.scheme === "bright_light" ? '#ffffff' : '#191919'
      });
    }
  }
})

bridge.send("VKWebAppStorageGet", { "keys": ["userExists"] }).then(event => {
  var returnedData = event.keys.map(item => item.value);
  if (returnedData == "") {
    bridge.send("VKWebAppStorageSet", {"key": "userExists", "value": "true"});
    ReactDOM.render(<AppGuide />, document.getElementById("root"));
    if (process.env.NODE_ENV === "development") {
      import("./eruda").then(({ default: eruda }) => {
      }); //runtime download
    }
  }
  else {
    ReactDOM.render(<App />, document.getElementById("root"));
    if (process.env.NODE_ENV === "development") {
      import("./eruda").then(({ default: eruda }) => {
      }); //runtime download
    }
  }
})