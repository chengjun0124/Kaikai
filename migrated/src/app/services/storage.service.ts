import { Injectable } from '@angular/core';


// app.factory("storageService", [function () {
//   return {
//       set: function (key, value) {
//           localStorage[key] = value;
//       },
//       get: function (key) {
//           return localStorage[key];
//       },
//       setSession: function (key, value) {
//           sessionStorage[key] = value;
//       },
//       getSession: function (key) {
//           return sessionStorage[key];
//       },
//       removeSession: function (key) {
//           delete sessionStorage[key];
//       }
//   };
// }]);

export class StorageService {

  constructor() { }

  set(key: string, value: string) {
    localStorage[key] = value;
  }
  get(key) {
    return localStorage[key];
  }

  setSession(key, value) {
    sessionStorage[key] = value;
  }

  getSession(key) {
    return sessionStorage[key];
  }

  removeSession(key) {
    delete sessionStorage[key];
  }
}
