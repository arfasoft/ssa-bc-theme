import $ from 'jquery';

/**
 * @param {string[]} [scriptUrls]
 * @param {string[]} [possibleEvents]
 */
class ScriptManager {
  constructor(urls = [], possibleEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll']) {
    this.urls = urls;
    this.hasUserTakenAction = false;
    this.possibleEvents = possibleEvents;

    this.setupEventListener();
    this.scripts = this.setupScriptTags(this.urls);
  }

  setupEventListener() {
    var context = this;
    var event = context.possibleEvents.map(function(eventName) {
        return eventName + '.sm';
      }).join(' ');

    var handler = function(ev) {
      context.hasUserTakenAction = true;
      context.mountScripts(context.scripts);
      $(document).off(event);
    };

    $(document).on(event, handler);
  }

  /**
   * 
   * @param {string[]} [scriptUrls] 
   * @return {jQuery[]}
   */
  setupScriptTags(urls = []) {
    return urls.map(this.createScript.bind(this));
  }

  mountScripts(scriptTags) {
    $.each(scriptTags, function(i, $el) {
      $(document.body).append($el);
    });
  }

  /**
   * 
   * @param {string} url 
   * @return {jQuery}
   */
  createScript(url) {
    var $script = $('<script>', {
      src: url,
      type: 'text/javascript',
    });

    if (this.hasUserTakenAction === true) {
      this.mountScripts([$script]);
    }

    return $script;
  }
}

/**
 * Create a new Menu instance
 * @param {string[]} [scriptUrls]
 * @return {ScriptManager}
 */
export default function scriptManagerFactory(scriptUrls) {
    const scriptManager = new ScriptManager(scriptUrls);
    
    return scriptManager;
}
