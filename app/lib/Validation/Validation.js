const isObject = ob => ob && typeof ob === 'object' && ob.constructor === Object;

const isFunction = func => typeof func === 'function';

const isNull = nullValue => nullValue === null;

const isUndefined = und => typeof und === 'undefined';

const isBoolean = bool => typeof bool === 'boolean';

const isArray = arr => arr && typeof arr === 'object' && arr.constructor === Array;

const isNumber = num => typeof num === 'number' && isFinite(num);

const isString = str => typeof str === 'string' || str instanceof String;

const isJson = (str) => {
  if (!isString(str)) return false;
  let json = null;
  try {
    json = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return json;
};

const Validation = {
  isObject,
  isFunction,
  isNull,
  isUndefined,
  isBoolean,
  isArray,
  isNumber,
  isString,
  isJson,
};

export default Validation;