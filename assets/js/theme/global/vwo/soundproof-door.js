import updateCartQuantityIndicator from '../quoteAndCart';

const CART_URL = 'https://www.secondskinaudio.com/api/storefront/carts';

function errorMessageFactory(text) {
  return '[SoundproofDoorHelper]: ' + text;
}

function jambExtensionSkuFactory(wood) {
  return 'SLDR-JAMB-' + wood;
}

function windowSkuFactory(windowId) {
  return 'SLDR-WINDOW-' + windowId;
}

function hardwareColorSkuFactory(hardwareColor) {
  return 'SLDR-HARDWARE-' + hardwareColor;
}

function productIdToDtoFactory(productId, variantId) {
  return productId ? {
    productId,
    variantId,
    quantity: 1,
  } : null;
}

function cartUpdateUrlFactory(cartId) {
  return `${CART_URL}/${cartId}/items`;
}

class SoundproofDoorHelper {
  constructor() {
    this._setupAllowedOptions();
    this.productIds = {
      SOUNDLOCK_DOOR: 501,
      JAMB_EXTENSION: 508,
      HARDWARE: 505,
      WINDOW: 507,
      DOOR_CLOSER: 503,
      KICKPLATE: 504,
      CRATING_FEE: 550,
      INSTALL_KIT: 549,
    };
    this._value = {
      wood: null,
      handleset: null,
      handleLockType: null,
      swingType: null,
      isThickWall: false,
      window: null,
      hardwareColor: null,
      hasDoorCloser: false,
      hasKickplate: false
    };

    this._addOns = {
      jambExtension: undefined,
      window: undefined,
      hardwareColor: undefined,
      doorCloser: undefined,
      kickplate: undefined
    };

    this._getSkuIdMap()
  }

  getDoorVariantId() {
    if (!this._value) return null;

    const ns = this._value;
    
    if ([ns.wood, ns.handleset, ns.handleLockType, ns.swingType].every(Boolean) === false) {
      // We lack the fundamental bits of info that comprise the door SKU
      return null;
    }

    const sku = [
      'SLDR',
      ns.wood,
      ns.handleset,
      ns.handleLockType,
      ns.swingType
    ].join('-');

    return this.skuIdMap[sku];
  }

  _getDoorAndAddOnProductIdDto() {
    const doorVariantId = this.getDoorVariantId();

    if (!doorVariantId) {
      // If we don't have a door SKU, we don't want to imply that a cart may be populated with
      // add-ons alone.
      return [];
    }

    return [
      productIdToDtoFactory(this.productIds.SOUNDLOCK_DOOR, doorVariantId),
      productIdToDtoFactory(this.productIds.INSTALL_KIT),
      productIdToDtoFactory(this.productIds.CRATING_FEE),
      ...Object.values(this._addOns)
    ].filter(Boolean);
  }

  setWood(woodValue) {
    if (this.woodOptions.indexOf(woodValue) === -1) {
      console && console.warn(errorMessageFactory('Wood value not enumerated'));
    } else {
      this._value.wood = woodValue;
      this._checkAddJambExtension();
    }

    return this;
  }

  setHandleset(handlesetValue) {
    if (this.handlesetOptions.indexOf(handlesetValue) === -1) {
      console && console.warn(errorMessageFactory('Handleset value not enumerated'));
    } else {
      this._value.handleset = handlesetValue;
    }

    return this;
  }

  setHandleLockType(handleLockType) {
    if (this.handleLockTypeOptions.indexOf(handleLockType) === -1) {
      console && console.warn(errorMessageFactory('Handle Lock Type value not enumerated'));
    } else {
      this._value.handleLockType = handleLockType;
    }

    return this;
  }

  setSwingType(swingType) {
    if (this.swingTypeOptions.indexOf(swingType) === -1) {
      console && console.warn(errorMessageFactory('Swing Type value not enumerated'));
    } else {
      this._value.swingType = swingType;
    }

    return this;
  }

  setIsThickWall(isThickWall) {
    if (typeof isThickWall !== 'boolean') {
      console && console.warn(errorMessageFactory('Is Thick Wall value is not of correct type'));
    } else {
      this._value.isThickWall = isThickWall;
      this._checkAddJambExtension();
    }

    return this;
  }

  setWindow(window) {
    if (this.windowOptions.indexOf(window) === -1) {
      console && console.warn(errorMessageFactory('Window value not enumerated'));
    } else {
      this._value.window = window;
      this._checkAddWindow();
    }

    return this;
  }

  setHardwareColor(hardwareColor) {
    if (this.hardwareColorOptions.indexOf(hardwareColor) === -1) {
      console && console.warn(errorMessageFactory('Hardware Color value not enumerated'));
    } else {
      this._value.hardwareColor = hardwareColor;
      this._checkAddHardwareColor();
    }

    return this;
  }

  setHasDoorCloser(hasDoorCloser) {
    if (typeof hasDoorCloser !== 'boolean') {
      console && console.warn(errorMessageFactory('Has Door Closer value is not of correct type'));
    } else {
      this._value.hasDoorCloser = hasDoorCloser;
      this._checkAddDoorCloser();
    }

    return this;
  }

  setHasKickplate(hasKickplate) {
    if (typeof hasKickplate !== 'boolean') {
      console && console.warn(errorMessageFactory('Has Kickplate value is not of correct type'));
    } else {
      this._value.hasKickplate = hasKickplate;
      this._checkAddKickplate();
    }

    return this;
  }

  _setupAllowedOptions() {
    this.woodOptions = [
      'OAK',
      'BIR',
      'MAP',
      'CHE',
      'WAL'
    ];
  
    this.handlesetOptions = [
      'VENICE',
      'ALLEGRO',
      'TORINO'
    ];
  
    this.handleLockTypeOptions = [
      'KEYED',
      'PASSAGE'
    ];
  
    this.swingTypeOptions = [
      'LHS',
      'RHS'
    ];
  
    this.windowOptions = [
      '1010',
      '628',
      '2228',
      '2256',
      null
    ];
  
    this.hardwareColorOptions = [
      null,
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08'
    ];
  }

  _checkAddJambExtension() {
    if (!this._value.wood || !this._value.isThickWall) {
      this._addOns.jambExtension = undefined;
      return;
    }

    this._addOns.jambExtension = productIdToDtoFactory(
      this.productIds.JAMB_EXTENSION,
      this.skuIdMap[jambExtensionSkuFactory(this._value.wood)]
    );
  }

  _checkAddWindow() {
    if (!this._value.window) {
      this._addOns.window = undefined;
      return;
    }

    this._addOns.window = productIdToDtoFactory(
      this.productIds.WINDOW,
      this.skuIdMap[windowSkuFactory(this._value.window)]
    );
  }

  _checkAddHardwareColor() {
    if (!this._value.hardwareColor) {
      this._addOns.hardwareColor = undefined;
      return;
    }

    this._addOns.hardwareColor = productIdToDtoFactory(
      this.productIds.HARDWARE,
      this.skuIdMap[hardwareColorSkuFactory(this._value.hardwareColor)]
    );
  }

  _checkAddDoorCloser() {
    if (!this._value.hasDoorCloser) {
      this._addOns.doorCloser = undefined;
      return;
    }

    this._addOns.doorCloser = productIdToDtoFactory(this.productIds.DOOR_CLOSER);
  }

  _checkAddKickplate() {
    if (!this._value.hasKickplate) {
      this._addOns.kickplate = undefined;
      return;
    }

    this._addOns.kickplate = productIdToDtoFactory(this.productIds.KICKPLATE);
  }

  _getProductsAndVariants() {
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.theme_settings.sf_tk}`,
      },
      body: JSON.stringify({
        query: `
        query ExtendedProductsById($productIds: [Int!]) {
          site {
            products(entityIds: $productIds) {
              edges {
                node {
                  name
                  entityId
                  prices {
                    price {
                      value
                    }
                  }
                  variants(first: 125) {
                    edges {
                      node {
                        sku
                        entityId
                        prices {
                          price {
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
        variables: {
          productIds: Object.values(this.productIds),
        },
      }),
    };

    return fetch('https://www.secondskinaudio.com/graphql', options)
      .then(resp => resp.json())
      .then((resp) => {
        this.productsAndVariants = resp.data.site.products.edges;
      });
  }

  _getSkuIdMap() {
    this._getProductsAndVariants()
      .then(() => {
        this.skuIdMap = this.productsAndVariants
          .reduce((acc, val) => {
            const myArr = acc.slice();
        
            return myArr.concat(val.node.variants.edges);
          }, [])
          .reduce((acc, val) => {
            const myObj = Object.assign({}, acc);
        
            myObj[val.node.sku] = val.node.entityId;
            return myObj;
          }, {});
      });
  }

  getTotalPrice() {
    return this._getDoorAndAddOnProductIdDto()
      .map(({ productId, variantId }) => {
        const product = this.productsAndVariants.find(({ node }) => node.entityId === productId);

        if (variantId) {
          return product.node.variants.edges.find(({ node: variantNode }) => variantNode.entityId === variantId).node.prices.price.value;
        }

        return product.node.prices.price.value;
      })
      .reduce((acc, val) => acc + val, 0);
  }

  addSkusToCart(cb) {
    const callbackFn = typeof cb === 'function' ? cb : () => {};
    const lineItems = this._getDoorAndAddOnProductIdDto();
    const options = {
      method: 'POST',
      body: JSON.stringify({
        lineItems,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(CART_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then((carts) => {
        if (carts.length) {
          const cartId = carts[0].id;

          fetch(cartUpdateUrlFactory(cartId), options)
            .then(() => {
              updateCartQuantityIndicator();
              callbackFn(true);
            })
            .catch((err) => {
              callbackFn(false);
            });

          return;
        }

        fetch(CART_URL, options)
          .then(() => {
            updateCartQuantityIndicator();
            callbackFn(true);
          })
          .catch((err) => {
            callbackFn(false);
          });
      })
      .catch((err) => {
        callbackFn(false);
      });
  }
};

export default function setupSoundproofDoorHelper() {
  window.vwoSoundproofDoorHelperFactory = function() {
    return new SoundproofDoorHelper();
  };
}
