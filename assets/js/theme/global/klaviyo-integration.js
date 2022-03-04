class KlaviyoHelper {
  constructor() {
    this._publicKey = 'JQEccv';
  }

  
  _appendDivTo(appendToDiv$, formId) {
    const div$ = document.createElement('div');
    
    div$.classList.add(`klaviyo-form-${formId}`);
    appendToDiv$.appendChild(div$);
  }
  
  _appendScriptTagTo(appendToDiv$) {
    const scriptTag$ = document.createElement('script');
    
    scriptTag$.src = `//static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this._publicKey}`;
    scriptTag$.setAttribute('type', 'text/javascript');
    scriptTag$.setAttribute('async', '');
    appendToDiv$.appendChild(scriptTag$);
  }

  addFormToDiv(div$, formId) {
    if (!formId || !div$ || !div$.setAttribute) {
      throw new Error('Two arguments should be specified: domNode (HTMLElement), formId (string)');
    }

    this._appendDivTo(div$, formId);
    this._appendScriptTagTo(div$);
  }
};

export default function setupKlaviyoHelper() {
  const klaviyoHelper = new KlaviyoHelper();

  window.vwoInsertKlaviyoForm = klaviyoHelper.addFormToDiv.bind(klaviyoHelper);
}
