/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

// const { getAverage } = require('./02-numbers-tasks');


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function a() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class MyClass {
  constructor(v) {
    this.ar = [];
    this.value = v;
  }

  element(arg) {
    const doubleEr = new Error(
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    );
    const orderEr = new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
    try {
      this.ar.push(arg);
      if (
        this.ar.filter((el) => el[0].toUpperCase() !== el[0].toLowerCase())
          .length > 1
      ) {
        throw doubleEr;
      }
      if (this.ar.length > 1) {
        throw orderEr;
      }
      return this;
    } catch (error) {
      if (
        this.ar.filter((el) => el[0].toUpperCase() !== el[0].toLowerCase())
          .length > 1
      ) {
        throw error;
      }
      if (this.ar.length > 1) {
        throw orderEr;
      }
    }
    return this;
  }

  id(arg) {
    const doubleEr = new Error(
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    );
    const orderEr = new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
    try {
      if (this.ar.find((el) => el[0] === '#')) {
        throw doubleEr;
      }
      if (this.ar.find((el) => el[0] === '.')) {
        throw orderEr;
      }
      if (this.ar.find((el) => el[0] === ':' && el[1] === ':')) {
        throw orderEr;
      }
      this.ar.push(`#${arg}`);
      return this;
    } catch (error) {
      if (this.ar.find((el) => el[0] === '#')) {
        throw doubleEr;
      }
      if (this.ar.find((el) => el[0] === '.')) {
        throw orderEr;
      }
      if (this.ar.find((el) => el[0] === ':' && el[1] === ':')) {
        throw orderEr;
      }
    }
    return this;
  }

  class(arg) {
    const orderEr = new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
    try {
      if (this.ar.find((el) => `${el[0]}` === '[')) {
        throw orderEr;
      }
      this.ar.push(`.${arg}`);
      return this;
    } catch (er) {
      throw orderEr;
    }
  }

  attr(arg) {
    const orderEr = new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
    try {
      if (this.ar.find((el) => el[0] === ':')) {
        throw orderEr;
      }
      this.ar.push(`[${arg}]`);
      return this;
    } catch (er) {
      if (this.ar.find((el) => el[0] === ':')) {
        throw orderEr;
      }
    }
    return this;
  }

  pseudoClass(arg) {
    const orderEr = new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
    try {
      if (this.ar.find((el) => el[0] === ':' && el[1] === ':')) {
        throw orderEr;
      }
      this.ar.push(`:${arg}`);
      return this;
    } catch (er) {
      throw orderEr;
    }
  }

  pseudoElement(arg) {
    try {
      if (this.ar.find((el) => `${el[0]}${el[1]}` === '::')) {
        throw new Error();
      }
      this.ar.push(`::${arg}`);
      return this;
    } catch (e) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
  }

  combine(v) {
    let localAR = '';
    Array.from(v).map((el) => {
      if (typeof el === 'object') localAR += el.ar.join('');
      if (typeof el === 'string') localAR += ` ${el} `;
      return el;
    });
    this.ar.push(localAR);
    return this;
  }

  stringify() {
    return this.ar.join('');
  }
}

const cssSelectorBuilder = {
  element(v) {
    return new MyClass(v).element(v);
  },

  id(v) {
    return new MyClass(v).id(v);
  },

  class(v) {
    return new MyClass(v).class(v);
  },

  attr(v) {
    return new MyClass(v).attr(v);
  },

  pseudoClass(v) {
    return new MyClass(v).pseudoClass(v);
  },

  pseudoElement(v) {
    return new MyClass(v).pseudoElement(v);
  },

  combine(...v) {
    return new MyClass(v).combine(v);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
