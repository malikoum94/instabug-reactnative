'use strict'
import { NativeModules, Platform } from 'react-native'
let { Instabug } = NativeModules
import parseErrorStackLib from 'react-native/Libraries/Core/Devtools/parseErrorStack.js'

let parseErrorStack = error => {
  try {
    return parseErrorStackLib(error)
  } catch (error2) {
    var jsonObject = {
      message: error2.name + ' - ' + error2.message,
      os: Platform.OS,
      platform: 'react_native',
      exception: null,
    }
    if (Platform.OS === 'android') {
      Instabug.sendJSCrash(JSON.stringify(jsonObject))
    } else {
      Instabug.sendJSCrash(jsonObject)
    }
    if (originalHandler) {
      if (Platform.OS === 'ios') {
        originalHandler(e, isFatal)
      } else {
        setTimeout(() => {
          originalHandler(e, isFatal)
        }, 500)
      }
    }
  }
}

const originalHandler = global.ErrorUtils.getGlobalHandler()

let init = () => {
  if (__DEV__) {
    return
  }

  function errorHandler(e, isFatal) {
    try {
      let jsStackTrace = parseErrorStackLib(e)

      //JSON object to be sent to the native SDK
      var jsonObject = {
        message: e.name + ' - ' + e.message,
        os: Platform.OS,
        platform: 'react_native',
        exception: jsStackTrace,
      }
      if (Platform.OS === 'android') {
        Instabug.sendJSCrash(JSON.stringify(jsonObject))
      } else {
        Instabug.sendJSCrash(jsonObject)
      }
      if (originalHandler) {
        if (Platform.OS === 'ios') {
          originalHandler(e, isFatal)
        } else {
          setTimeout(() => {
            originalHandler(e, isFatal)
          }, 500)
        }
      }
    } catch (error) {
      var jsonObject = {
        message: error.name + ' - ' + error.message,
        os: Platform.OS,
        platform: 'react_native',
        exception: null,
      }
      if (Platform.OS === 'android') {
        Instabug.sendJSCrash(JSON.stringify(jsonObject))
      } else {
        Instabug.sendJSCrash(jsonObject)
      }
      if (originalHandler) {
        if (Platform.OS === 'ios') {
          originalHandler(e, isFatal)
        } else {
          setTimeout(() => {
            originalHandler(e, isFatal)
          }, 500)
        }
      }
    }
  }
  global.ErrorUtils.setGlobalHandler(errorHandler)
}

module.exports = {
  parseErrorStack: parseErrorStack,
  captureJsErrors: init,
}
