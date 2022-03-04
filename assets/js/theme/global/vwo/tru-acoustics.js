import updateCartQuantityIndicator from '../quoteAndCart';

const CART_URL = 'https://www.secondskinaudio.com/api/storefront/carts';

function errorMessageFactory(text) {
  return '[TruAcousticsWindowHelper]: ' + text;
}

function windowSkuFactory(stc, size) {
  return 'SLDR-WINDOW-' + windowId;
}

function productIdToDtoFactory(productId, variantId, quantity = 1) {
  return productId ? {
    productId,
    variantId,
    quantity,
  } : null;
}

function cartUpdateUrlFactory(cartId) {
  return `${CART_URL}/${cartId}/items`;
}

class TruAcousticsWindowHelper {
  constructor() {
    this._setupAllowedOptions();
    this._setupDefaultCallbacks();
    this.productIds = {
      TRU_ACOUSTICS_WINDOW: 571,
      DIMENSIONS_ADD_ON: 629,
      ONE_WAY_GLASS_1_SQFT: 609,
      CRATING_FEE: 550,
      INSTALL_KIT: 270,
    };
    this._value = {
      stcRating: null,
      quantity: null,
      dimensionsWidth: null,
      dimensionsHeight: null,
      frameColor: null,
      hasOneWayCustomGlass: false,
    };

    this._addOns = {
      oneWayGlass: undefined,
    };

    // this._getSkuIdMap()
    this._getOptions()
      .then((result) => {
        console.log({ result });
      });
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

  setStcRating(stcRatingValue) {
    if (this.stcRatingOptions.indexOf(stcRatingValue) === -1) {
      console && console.warn(errorMessageFactory('STC Rating value not enumerated'));
    } else {
      this._value.stcRating = stcRatingValue;
      // this._checkAddJambExtension();
    }

    return this;
  }

  setDimensions(dimensionsWidthValue, dimensionsHeightValue) {
    if (isNaN(dimensionsWidthValue)) {
      console && console.warn(errorMessageFactory('Width dimension must be of type Number'));
    } else if (isNaN(dimensionsHeightValue)) {
      console && console.warn(errorMessageFactory('Height dimension must be of type Number'));
    } else {
      this._value.dimensionsWidth = dimensionsWidthValue;
      this._value.dimensionsHeight = dimensionsHeightValue;
      this._checkDimensions();
    }
  }

  setFrameColor(frameColorValue) {
    if (this.frameColorOptions.indexOf(frameColorValue) === -1) {
      console && console.warn(errorMessageFactory('Frame color value not enumerated'));
    } else {
      this._value.frameColor = frameColorValue;
    }
  }

  setHasOneWayCustomGlass(hasOneWayCustomGlassValue) {
    if (typeof hasOneWayCustomGlassValue !== 'boolean') {
      console && console.warn(errorMessageFactory('`setHasOneWayCustomGlass` argument must be of type `boolean`'));
    } else {
      this._value.hasOneWayCustomGlass = hasOneWayCustomGlassValue;
      this._checkHasOneWayCustomGlass();
    }
  }

  _setupAllowedOptions() {
    this.stcRatingOptions = [
      '45',
      '49',
      '56',
    ];
  
    this.frameColorOptions = [
      'clearSilver',
      'bronzeBlack',
    ];
  }

  _setupDefaultCallbacks() {
    this.cbExtraLargeWindows = () => {};
    this.cbCustomFrameColor = () => {};
    this.cbCustomGlass = () => {};
  }

  _doCallback(cb) {
    if (typeof cb === 'function') {
      return cb.bind(this);
    }
  }

  _checkDimensions() {
    const isRatingValue = (optionIndex) => this._value.stcRating === this.stcRatingOptions[optionIndex];
    const isRating45 = isRatingValue(0);
    const isRating49 = isRatingValue(1);
    const isRating56 = isRatingValue(2);
    const isBeyondMaxDimensions = (maxWidthInches, maxHeightInches) => {
      if (!this._value.dimensionsWidth || !this._value.dimensionsHeight) {
        return false;
      }

      return (
        this._value.dimensionsWidth > maxWidthInches
          && this._value.dimensionsHeight > maxHeightInches
      );
    };

    if (isRating49 && isBeyondMaxDimensions(60, 120)) {
      this._doCallback(this.cbExtraLargeWindows);
    } else if ((isRating45 || isRating56) && isBeyondMaxDimensions(48, 96)) {
      this._doCallback(this.cbExtraLargeWindows);
    }
  }

  _checkHasOneWayCustomGlass() {
    const numSqFt = this._getWindowSquareFeet();

    if (this._value.hasOneWayCustomGlass && numSqFt) {
      this._addOns.oneWayGlass = productIdToDtoFactory(
        this.productIds.ONE_WAY_GLASS_1_SQFT,
        undefined,
        numSqFt,
      );
    }
  }

  _getWindowSquareFeet() {
    if (!this._value.dimensionsWidth || !this._value.dimensionsHeight) {
      return 0;
    }

    return Math.ceil((this._value.dimensionsWidth / 12) * (this._value.dimensionsHeight / 12));
  }

  _getOptions() {
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.theme_settings.sf_tk}`,
      },
    };

    options.body = JSON.stringify({
      query: `
        query ExtendedProductsById(
          $productIds: [Int!]
          # Use GraphQL Query Variables to inject your product IDs
        ) {
          site {
            products(entityIds: $productIds, first: 5) {
              edges {
                node {
                  entityId
                  name
                  productOptions(first: 5) {
                    edges {
                      node {
                        entityId
                        displayName
                        ... on MultipleChoiceOption {
                          values(first: 50) {
                            edges {
                              node {
                                entityId
                                label
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
          }
        }
      `,
      variables: {
        productIds: [this.productIds.TRU_ACOUSTICS_WINDOW],
      },
    });

    return fetch('https://www.secondskinaudio.com/graphql', options)
      .then(resp => resp.json())
      .then(resp => {
        const {
          data: {
            site: {
              products: {
                edges: products,
              },
            },
          },
        } = resp;

        return products[0].node.productOptions.edges.reduce((acc, val) => {
          const myObj = Object.assign({}, acc);

          console.log({ val });
          
          if (val.node.entityId === 515) {
            // Size
            myObj.size = val.node;
          } else if (val.node.entityId === 534) {
            // STC
            myObj.stc = val.node;
          }

          return myObj;
        }, {});
      });
  }

  _getTruAcousticsWindow(productId, optionValueIds) {
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.theme_settings.sf_tk}`,
      },
    };

    options.body = JSON.stringify({
      query: `
        query ProductsWithOptionSelections (
          $productId: Int!,
          $optionValueIds: [OptionValueId!]
          # Use GraphQL Query Variables to inject your product ID
          # and Option Value IDs
        ) {
          site {
            productWithSelectedOptions: product(
              entityId: $productId
              optionValueIds: $optionValueIds
            ) {
              ...ProductFields
            }
          }
        }
      `,
      variables: {
        productId,
        optionValueIds: optionValueIds,
      },
    });

    return fetch('https://www.secondskinaudio.com/graphql', options)
      .then(resp => resp.json())
      .then((resp) => {
        console.log({ foobar: resp });
        // this.productsAndVariants = resp.data.site.products.edges;
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

export default function setupTruAcousticsHelper() {
  window.vwoTruAcousticsHelperFactory = function() {
    return new TruAcousticsWindowHelper();
  };
}
