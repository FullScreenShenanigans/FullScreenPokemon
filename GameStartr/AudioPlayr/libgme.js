// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module.exports = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (ENVIRONMENT_IS_WEB) {
    Module['print'] = function(x) {
      console.log(x);
    };
    Module['printErr'] = function(x) {
      console.log(x);
    };
    this['Module'] = Module;
  } else if (ENVIRONMENT_IS_WORKER) {
    // We can do very little here...
    var TRY_USE_DUMP = false;
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          alignSize = type.alignSize || QUANTUM_SIZE;
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,((Math.min((+(Math.floor((value)/(+(4294967296))))), (+(4294967295))))|0)>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addOnPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 29784;
var _stderr;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } },{ func: function() { __GLOBAL__I_a() } },{ func: function() { __GLOBAL__I_a290() } },{ func: function() { __GLOBAL__I_a541() } });
var ___progname;
var __ZTVN10__cxxabiv120__si_class_type_infoE;
var __ZTVN10__cxxabiv119__pointer_type_infoE;
var __ZTVN10__cxxabiv117__class_type_infoE;
var __ZTIy;
var __ZTIx;
var __ZTIt;
var __ZTIs;
var __ZTIm;
var __ZTIl;
var __ZTIj;
var __ZTIi;
var __ZTIh;
var __ZTIf;
var __ZTIe;
var __ZTId;
var __ZTIc;
var __ZTIa;
var __ZN11Blip_BufferC1Ev;
var __ZN11Blip_BufferD1Ev;
var __ZN18Silent_Blip_BufferC1Ev;
var __ZN16Blip_Synth_Fast_C1Ev;
var __ZN11Blip_Synth_C1EPsi;
var __ZN11Classic_EmuD1Ev;
var __ZN13Subset_ReaderC1EP11Data_Readerl;
var __ZN16Remaining_ReaderC1EPKvlP11Data_Reader;
var __ZN15Mem_File_ReaderC1EPKvl;
var __ZN15Callback_ReaderC1EPFPKcPvS2_iElS2_;
var __ZN15Std_File_ReaderC1Ev;
var __ZN15Std_File_ReaderD1Ev;
var __ZN14Dual_ResamplerD1Ev;
var __ZN14Effects_Buffer8config_tC1Ev;
var __ZN14Effects_BufferC1Eb;
var __ZN14Effects_BufferD1Ev;
var __ZN14Fir_Resampler_C1EiPs;
var __ZN14Fir_Resampler_D1Ev;
var __ZN8Gme_FileD1Ev;
var __ZN13Silent_BufferC1Ev;
var __ZN11Mono_BufferC1Ev;
var __ZN11Mono_BufferD1Ev;
var __ZN13Stereo_BufferC1Ev;
var __ZN13Stereo_BufferD1Ev;
var __ZN9Music_EmuD1Ev;
var __ZN6Ay_ApuC1Ev;
var __ZN10Ym2612_EmuD1Ev;
var __ZN7Sms_OscC1Ev;
var __ZN7Sms_ApuC1Ev;
var __ZN7Sms_ApuD1Ev;
var __ZN6Ay_CpuC1Ev;
var __ZN6Ay_EmuC1Ev;
var __ZN6Ay_EmuD1Ev;
var __ZN6Gb_ApuC1Ev;
var __ZN7Gbs_EmuC1Ev;
var __ZN7Gbs_EmuD1Ev;
var __ZN7Gym_EmuC1Ev;
var __ZN7Gym_EmuD1Ev;
var __ZN7Hes_ApuC1Ev;
var __ZN7Hes_EmuC1Ev;
var __ZN7Hes_EmuD1Ev;
var __ZN7Kss_CpuC1Ev;
var __ZN7Kss_EmuC1Ev;
var __ZN7Kss_EmuD1Ev;
var __ZN7Nes_ApuC1Ev;
var __ZN13Nes_Namco_ApuC1Ev;
var __ZN12Nes_Vrc6_ApuC1Ev;
var __ZN7Nsf_EmuC1Ev;
var __ZN7Nsf_EmuD1Ev;
var __ZN9Nsfe_InfoC1Ev;
var __ZN9Nsfe_InfoD1Ev;
var __ZN8Nsfe_EmuC1Ev;
var __ZN8Nsfe_EmuD1Ev;
var __ZN12Sap_Apu_ImplC1Ev;
var __ZN7Sap_ApuC1Ev;
var __ZN7Sap_EmuC1Ev;
var __ZN7Sap_EmuD1Ev;
var __ZN7Spc_EmuC1Ev;
var __ZN7Spc_EmuD1Ev;
var __ZN10SPC_FilterC1Ev;
var __ZN7Vgm_EmuC1Ev;
var __ZN7Vgm_EmuD1Ev;
var __ZN10Ym2413_EmuC1Ev;
var __ZN10Ym2413_EmuD1Ev;
var __ZNSt9type_infoD1Ev;
var __ZNSt8bad_castC1Ev;
var __ZNSt8bad_castD1Ev;
var __ZNSt10bad_typeidC1Ev;
var __ZNSt10bad_typeidD1Ev;
var __ZN10__cxxabiv116__shim_type_infoD1Ev;
var __ZN10__cxxabiv123__fundamental_type_infoD1Ev;
var __ZN10__cxxabiv123__fundamental_type_infoD2Ev;
var __ZN10__cxxabiv117__array_type_infoD1Ev;
var __ZN10__cxxabiv117__array_type_infoD2Ev;
var __ZN10__cxxabiv120__function_type_infoD1Ev;
var __ZN10__cxxabiv120__function_type_infoD2Ev;
var __ZN10__cxxabiv116__enum_type_infoD1Ev;
var __ZN10__cxxabiv116__enum_type_infoD2Ev;
var __ZN10__cxxabiv117__class_type_infoD1Ev;
var __ZN10__cxxabiv117__class_type_infoD2Ev;
var __ZN10__cxxabiv120__si_class_type_infoD1Ev;
var __ZN10__cxxabiv120__si_class_type_infoD2Ev;
var __ZN10__cxxabiv121__vmi_class_type_infoD1Ev;
var __ZN10__cxxabiv121__vmi_class_type_infoD2Ev;
var __ZN10__cxxabiv117__pbase_type_infoD1Ev;
var __ZN10__cxxabiv117__pbase_type_infoD2Ev;
var __ZN10__cxxabiv119__pointer_type_infoD1Ev;
var __ZN10__cxxabiv119__pointer_type_infoD2Ev;
var __ZN10__cxxabiv129__pointer_to_member_type_infoD1Ev;
var __ZN10__cxxabiv129__pointer_to_member_type_infoD2Ev;
var __ZNSt9bad_allocC1Ev;
var __ZNSt9bad_allocD1Ev;
var __ZNSt20bad_array_new_lengthC1Ev;
var __ZNSt20bad_array_new_lengthD1Ev;
var __ZNSt20bad_array_new_lengthD2Ev;
var _err;
var _errx;
var _warn;
var _warnx;
var _verr;
var _verrx;
var _vwarn;
var _vwarnx;
var _stderr = _stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,56,97,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTVN10__cxxabiv119__pointer_type_infoE=allocate([0,0,0,0,88,97,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,120,97,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIy=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIx=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIt=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIs=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIm=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIl=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIj=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIi=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIh=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIf=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIe=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTId=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIc=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTIa=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([111,112,116,105,111,110,32,114,101,113,117,105,114,101,115,32,97,110,32,97,114,103,117,109,101,110,116,32,45,45,32,37,115,0,0,0,0,0,0,0,111,112,116,105,111,110,32,114,101,113,117,105,114,101,115,32,97,110,32,97,114,103,117,109,101,110,116,32,45,45,32,37,99,0,0,0,0,0,0,0,0,0,0,0,0,0,36,64,0,0,0,0,0,0,89,64,0,0,0,0,0,136,195,64,0,0,0,0,132,215,151,65,0,128,224,55,121,195,65,67,23,110,5,181,181,184,147,70,245,249,63,233,3,79,56,77,50,29,48,249,72,119,130,90,60,191,115,127,221,79,21,117,152,112,0,0,0,0,0,0,63,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,111,112,116,105,111,110,32,100,111,101,115,110,39,116,32,116,97,107,101,32,97,110,32,97,114,103,117,109,101,110,116,32,45,45,32,37,46,42,115,0,117,110,107,110,111,119,110,32,111,112,116,105,111,110,32,45,45,32,37,115,0,0,0,0,117,110,107,110,111,119,110,32,111,112,116,105,111,110,32,45,45,32,37,99,0,0,0,0,144,7,0,0,0,0,0,0,80,107,0,0,0,0,0,0,104,107,0,0,0,0,0,0,128,107,0,0,0,0,0,0,152,107,0,0,0,0,0,0,40,107,0,0,0,0,0,0,176,107,0,0,0,0,0,0,200,107,0,0,0,0,0,0,224,107,0,0,0,0,0,0,248,107,0,0,0,0,0,0,16,108,0,0,0,0,0,0,232,108,0,0,0,0,0,0,255,255,255,255,0,0,0,0,97,109,98,105,103,117,111,117,115,32,111,112,116,105,111,110,32,45,45,32,37,46,42,115,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,98,108,97,114,103,103,95,99,111,109,109,111,110,46,104,0,0,0,83,113,117,97,114,101,32,50,0,0,0,0,0,0,0,0,83,80,67,0,0,0,0,0,37,115,58,32,0,0,0,0,69,109,117,108,97,116,105,111,110,32,101,114,114,111,114,32,40,105,108,108,101,103,97,108,32,105,110,115,116,114,117,99,116,105,111,110,41,0,0,0,87,97,118,101,32,50,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,65,112,117,46,104,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,77,51,117,95,80,108,97,121,108,105,115,116,46,99,112,112,0,0,70,77,32,115,111,117,110,100,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,40,117,110,115,105,103,110,101,100,41,32,105,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,0,0,33,115,97,109,112,108,101,95,114,97,116,101,40,41,0,0,82,105,112,112,105,110,103,0,99,111,117,110,116,32,60,61,32,115,97,109,112,108,101,115,95,97,118,97,105,108,40,41,0,0,0,0,0,0,0,0,83,113,117,97,114,101,32,49,0,0,0,0,0,0,0,0,109,46,115,112,99,95,116,105,109,101,32,60,61,32,101,110,100,95,116,105,109,101,0,0,40,117,110,115,105,103,110,101,100,41,32,97,100,100,114,32,60,32,114,101,103,105,115,116,101,114,95,99,111,117,110,116,0,0,0,0,0,0,0,0,83,65,80,0,0,0,0,0,73,110,118,97,108,105,100,32,102,105,108,101,32,100,97,116,97,32,98,108,111,99,107,0,87,97,118,101,32,49,0,0,40,117,110,115,105,103,110,101,100,41,32,105,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,0,0,85,110,107,110,111,119,110,32,100,97,116,97,32,105,110,32,104,101,97,100,101,114,0,0,68,97,116,97,32,104,101,97,100,101,114,32,109,105,115,115,105,110,103,0,0,0,0,0,119,114,105,116,101,95,112,111,115,32,60,61,32,98,117,102,46,101,110,100,40,41,0,0,69,109,117,108,97,116,105,111,110,32,101,114,114,111,114,32,40,105,108,108,101,103,97,108,47,117,110,115,117,112,112,111,114,116,101,100,32,105,110,115,116,114,117,99,116,105,111,110,41,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,65,121,95,65,112,117,46,104,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,77,117,115,105,99,95,69,109,117,46,99,112,112,0,0,0,0,0,69,110,103,105,110,101,101,114,0,0,0,0,0,0,0,0,115,97,109,112,108,101,115,95,97,118,97,105,108,40,41,32,60,61,32,40,108,111,110,103,41,32,98,117,102,102,101,114,95,115,105,122,101,95,0,0,73,110,118,97,108,105,100,32,116,114,97,99,107,32,105,110,32,109,51,117,32,112,108,97,121,108,105,115,116,0,0,0,80,83,71,0,0,0,0,0,68,83,80,32,56,0,0,0,48,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,112,99,95,68,115,112,46,104,0,78,83,70,69,0,0,0,0,87,97,118,101,32,56,0,0,78,105,110,116,101,110,100,111,32,78,69,83,0,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,86,114,99,54,95,65,112,117,46,104,0,0,0,0,87,97,118,101,32,53,0,0,68,65,84,65,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,70,105,114,95,82,101,115,97,109,112,108,101,114,46,104,0,0,0,80,83,71,0,0,0,0,0,73,110,118,97,108,105,100,32,108,111,97,100,47,105,110,105,116,47,112,108,97,121,32,97,100,100,114,101,115,115,0,0,40,117,110,115,105,103,110,101,100,41,32,105,110,100,101,120,32,60,32,114,101,103,105,115,116,101,114,95,99,111,117,110,116,0,0,0,0,0,0,0,77,105,115,115,105,110,103,32,102,105,108,101,32,100,97,116,97,0,0,0,0,0,0,0,40,98,108,105,112,95,108,111,110,103,41,32,40,116,105,109,101,32,62,62,32,66,76,73,80,95,66,85,70,70,69,82,95,65,67,67,85,82,65,67,89,41,32,60,32,98,108,105,112,95,98,117,102,45,62,98,117,102,102,101,114,95,115,105,122,101,95,0,0,0,0,0,33,98,117,102,32,38,38,32,110,101,119,95,98,117,102,0,40,98,108,105,112,95,108,111,110,103,41,32,40,116,105,109,101,32,62,62,32,66,76,73,80,95,66,85,70,70,69,82,95,65,67,67,85,82,65,67,89,41,32,60,32,98,108,105,112,95,98,117,102,45,62,98,117,102,102,101,114,95,115,105,122,101,95,0,0,0,0,0,83,116,114,101,97,109,32,108,97,99,107,101,100,32,101,110,100,32,101,118,101,110,116,0,86,111,105,99,101,32,56,0,67,111,109,112,111,115,101,114,0,0,0,0,0,0,0,0,102,97,99,116,111,114,32,62,32,48,32,124,124,32,33,115,97,109,112,108,101,95,114,97,116,101,95,0,0,0,0,0,70,77,32,49,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,112,99,95,70,105,108,116,101,114,46,99,112,112,0,0,0,0,73,110,118,97,108,105,100,32,116,114,97,99,107,0,0,0,80,67,77,0,0,0,0,0,87,114,111,110,103,32,102,105,108,101,32,116,121,112,101,32,102,111,114,32,116,104,105,115,32,101,109,117,108,97,116,111,114,0,0,0,0,0,0,0,68,83,80,32,55,0,0,0,83,80,67,32,101,109,117,108,97,116,105,111,110,32,101,114,114,111,114,0,0,0,0,0,40,99,111,117,110,116,32,38,32,49,41,32,61,61,32,48,0,0,0,0,0,0,0,0,78,83,70,0,0,0,0,0,68,83,80,32,49,0,0,0,87,97,118,101,32,55,0,0,68,77,67,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,100,97,116,97,32,60,61,32,48,120,70,70,0,87,97,118,101,32,52,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,112,99,95,68,115,112,46,99,112,112,0,0,0,0,0,0,0,85,110,107,110,111,119,110,32,102,105,108,101,32,118,101,114,115,105,111,110,0,0,0,0,110,32,60,61,32,115,105,122,101,95,0,0,0,0,0,0,80,67,77,0,0,0,0,0,73,110,118,97,108,105,100,32,116,105,109,101,114,32,109,111,100,101,0,0,0,0,0,0,69,114,114,111,114,32,115,101,101,107,105,110,103,32,105,110,32,102,105,108,101,0,0,0,40,117,110,115,105,103,110,101,100,41,32,100,97,116,97,32,60,32,48,120,49,48,48,0,66,97,100,32,100,97,116,97,32,98,108,111,99,107,32,115,105,122,101,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,66,108,105,112,95,66,117,102,102,101,114,46,104,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,112,99,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,66,108,105,112,95,66,117,102,102,101,114,46,104,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,67,108,97,115,115,105,99,95,69,109,117,46,104,0,0,0,0,0,86,111,105,99,101,32,55,0,78,111,116,32,97,110,32,83,80,67,32,102,105,108,101,0,108,101,110,103,116,104,95,32,61,61,32,109,115,101,99,0,60,32,63,32,62,0,0,0,70,77,32,54,0,0,0,0,87,97,118,101,32,49,0,0,68,83,80,32,54,0,0,0,109,46,114,97,109,0,0,0,114,101,108,95,116,105,109,101,32,60,61,32,48,0,0,0,111,117,116,32,60,61,32,38,109,46,101,120,116,114,97,95,98,117,102,32,91,101,120,116,114,97,95,115,105,122,101,93,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,97,112,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,75,83,83,0,0,0,0,0,87,97,118,101,32,54,0,0,80,79,83,73,88,76,89,95,67,79,82,82,69,67,84,0,78,111,105,115,101,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,0,0,97,100,100,114,32,62,32,48,120,50,48,0,0,0,0,0,78,83,70,69,0,0,0,0,87,97,118,101,32,51,0,0,77,117,108,116,105,32,50,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,98,108,97,114,103,103,95,99,111,109,109,111,110,46,104,0,0,0,91,103,109,101,95,105,100,101,110,116,105,102,121,95,104,101,97,100,101,114,93,32,99,97,108,108,101,100,33,33,33,10,0,0,0,0,0,0,0,0,70,77,32,54,0,0,0,0,85,110,107,110,111,119,110,32,102,105,108,101,32,118,101,114,115,105,111,110,0,0,0,0,67,111,117,108,100,110,39,116,32,114,101,97,100,32,102,114,111,109,32,102,105,108,101,0,108,97,115,116,95,116,105,109,101,32,62,61,32,101,110,100,95,116,105,109,101,0,0,0,70,105,108,101,32,100,97,116,97,32,109,105,115,115,105,110,103,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,100,97,116,97,32,60,61,32,48,120,70,70,0,101,110,118,46,112,111,115,32,60,32,48,0,0,0,0,0,110,32,60,61,32,115,105,122,101,95,0,0,0,0,0,0,86,111,105,99,101,32,54,0,85,115,101,115,32,117,110,115,117,112,112,111,114,116,101,100,32,97,117,100,105,111,32,101,120,112,97,110,115,105,111,110,32,104,97,114,100,119,97,114,101,0,0,0,0,0,0,0,109,97,120,32,115,121,115,116,101,109,32,98,121,116,101,115,32,61,32,37,49,48,108,117,10,0,0,0,0,0,0,0,98,117,102,102,101,114,95,115,105,122,101,95,32,33,61,32,115,105,108,101,110,116,95,98,117,102,95,115,105,122,101,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,86,114,99,54,95,65,112,117,46,99,112,112,0,0,60,63,62,0,0,0,0,0,101,110,97,98,108,101,100,40,41,0,0,0,0,0,0,0,70,77,32,53,0,0,0,0,68,83,80,32,53,0,0,0,105,32,61,61,32,45,48,120,56,48,48,48,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,112,99,95,67,112,117,46,104,0,111,117,116,32,60,61,32,111,117,116,95,101,110,100,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,79,115,99,115,46,99,112,112,0,0,0,0,0,0,87,97,118,101,32,53,0,0,72,69,83,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,78,97,109,99,111,95,65,112,117,46,99,112,112,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,84,114,105,97,110,103,108,101,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,70,109,101,55,95,65,112,117,46,99,112,112,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,116,105,109,101,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,78,97,109,99,111,95,65,112,117,46,104,0,0,0,115,116,97,114,116,32,43,32,115,105,122,101,32,60,61,32,48,120,49,48,48,48,48,0,108,97,115,116,95,100,109,99,95,116,105,109,101,32,62,61,32,48,0,0,0,0,0,0,73,110,118,97,108,105,100,32,98,97,110,107,0,0,0,0,87,97,118,101,32,50,0,0,77,117,108,116,105,32,49,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,70,77,32,53,0,0,0,0,78,111,105,115,101,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,65,112,117,46,99,112,112,0,0,0,0,0,0,0,67,111,117,108,100,110,39,116,32,111,112,101,110,32,102,105,108,101,0,0,0,0,0,0,110,101,120,116,95,102,114,97,109,101,95,116,105,109,101,32,62,61,32,101,110,100,95,116,105,109,101,0,0,0,0,0,85,110,107,110,111,119,110,32,102,105,108,101,32,118,101,114,115,105,111,110,0,0,0,0,115,116,100,58,58,98,97,100,95,99,97,115,116,0,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,101,110,100,95,116,105,109,101,0,0,0,40,117,110,115,105,103,110,101,100,41,32,100,97,116,97,32,60,61,32,48,120,70,70,0,101,110,118,46,100,101,108,97,121,32,62,32,48,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,98,108,97,114,103,103,95,99,111,109,109,111,110,46,104,0,0,0,86,111,105,99,101,32,53,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,78,111,116,32,97,110,32,109,51,117,32,112,108,97,121,108,105,115,116,0,0,0,0,0,83,113,117,97,114,101,32,49,0,0,0,0,0,0,0,0,70,97,109,105,99,111,109,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,75,115,115,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,116,111,95,102,109,95,116,105,109,101,40,32,118,103,109,95,116,105,109,101,32,41,32,60,61,32,109,105,110,95,112,97,105,114,115,0,0,0,0,0,63,0,0,0,0,0,0,0,78,83,70,0,0,0,0,0,70,77,32,52,0,0,0,0,68,83,80,32,52,0,0,0,105,32,61,61,32,43,48,120,55,70,70,70,0,0,0,0,45,99,112,117,95,108,97,103,95,109,97,120,32,60,61,32,109,46,115,112,99,95,116,105,109,101,32,38,38,32,109,46,115,112,99,95,116,105,109,101,32,60,61,32,48,0,0,0,40,115,105,122,101,32,38,32,49,41,32,61,61,32,48,0,78,105,110,116,101,110,100,111,32,78,69,83,0,0,0,0,87,97,118,101,32,52,0,0,71,89,77,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,0,0,78,69,83,77,26,0,0,0,110,32,60,61,32,115,105,122,101,95,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,83,113,117,97,114,101,32,50,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,69,102,102,101,99,116,115,95,66,117,102,102,101,114,46,99,112,112,0,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,114,101,103,32,60,32,114,101,103,95,99,111,117,110,116,0,0,0,0,0,0,83,65,80,0,0,0,0,0,40,98,108,105,112,95,108,111,110,103,41,32,40,116,105,109,101,32,62,62,32,66,76,73,80,95,66,85,70,70,69,82,95,65,67,67,85,82,65,67,89,41,32,60,32,98,108,105,112,95,98,117,102,45,62,98,117,102,102,101,114,95,115,105,122,101,95,0,0,0,0,0,115,105,122,101,32,37,32,112,97,103,101,95,115,105,122,101,32,61,61,32,48,0,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,48,0,0,87,97,118,101,32,49,0,0,102,97,108,115,101,0,0,0,65,116,97,114,105,32,88,76,0,0,0,0,0,0,0,0,87,97,118,101,32,49,0,0,87,97,118,101,32,52,0,0,40,117,110,115,105,103,110,101,100,41,32,111,112,99,111,100,101,32,60,61,32,48,120,70,70,0,0,0,0,0,0,0,111,115,99,45,62,108,97,115,116,95,116,105,109,101,32,62,61,32,101,110,100,95,116,105,109,101,0,0,0,0,0,0,70,77,32,52,0,0,0,0,99,111,117,110,116,32,61,61,32,40,108,111,110,103,41,32,115,97,109,112,108,101,95,98,117,102,95,115,105,122,101,0,87,97,118,101,0,0,0,0,82,79,77,32,100,97,116,97,32,109,105,115,115,105,110,103,0,0,0,0,0,0,0,0,102,97,108,115,101,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,72,101,115,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,101,110,100,95,116,105,109,101,32,62,61,32,108,97,115,116,95,116,105,109,101,0,0,0,114,98,0,0,0,0,0,0,66,101,101,112,101,114,0,0,101,110,100,95,116,105,109,101,32,62,61,32,108,97,115,116,95,116,105,109,101,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,45,114,101,109,97,105,110,32,60,61,32,101,110,118,95,112,101,114,105,111,100,0,0,0,68,65,84,69,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,72,101,115,95,65,112,117,46,99,112,112,0,0,0,0,0,0,0,99,108,111,99,107,115,95,101,109,117,108,97,116,101,100,0,86,111,105,99,101,32,52,0,40,117,110,115,105,103,110,101,100,41,32,105,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,0,0,78,65,77,69,0,0,0,0,48,0,0,0,0,0,0,0,65,85,84,72,79,82,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,116,105,109,101,0,0,0,0,0,0,0,70,77,32,49,0,0,0,0,71,97,109,101,32,71,101,97,114,0,0,0,0,0,0,0,73,110,118,97,108,105,100,32,102,97,115,116,112,108,97,121,32,118,97,108,117,101,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,70,109,101,55,95,65,112,117,46,104,0,0,0,0,83,101,103,97,32,77,97,115,116,101,114,32,83,121,115,116,101,109,0,0,0,0,0,0,116,121,112,101,0,0,0,0,70,65,83,84,80,76,65,89,0,0,0,0,0,0,0,0,75,83,83,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,86,103,109,95,69,109,117,95,73,109,112,108,46,99,112,112,0,0,100,97,116,97,32,33,61,32,102,105,108,101,95,100,97,116,97,46,98,101,103,105,110,40,41,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,32,60,32,40,117,110,115,105,103,110,101,100,41,32,109,101,45,62,118,111,105,99,101,95,99,111,117,110,116,40,41,0,0,0,0,0,70,77,32,51,0,0,0,0,103,109,101,95,110,101,119,95,101,109,117,32,99,97,108,108,101,100,33,32,116,121,112,101,32,61,32,37,115,10,0,0,68,83,80,32,51,0,0,0,83,113,117,97,114,101,32,49,0,0,0,0,0,0,0,0,83,84,69,82,69,79,0,0,77,83,88,0,0,0,0,0,98,114,114,95,111,102,102,115,101,116,32,61,61,32,98,114,114,95,98,108,111,99,107,95,115,105,122,101,0,0,0,0,114,101,103,32,43,32,40,114,95,116,48,111,117,116,32,43,32,48,120,70,48,32,45,32,48,120,49,48,48,48,48,41,32,60,32,48,120,49,48,48,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,110,101,115,95,83,112,99,46,99,112,112,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,68,117,97,108,95,82,101,115,97,109,112,108,101,114,46,99,112,112,0,0,0,0,0,0,0,0,87,97,118,101,32,51,0,0,85,110,115,117,112,112,111,114,116,101,100,32,112,108,97,121,101,114,32,116,121,112,101,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,97,112,95,65,112,117,46,104,0,69,109,117,108,97,116,105,111,110,32,101,114,114,111,114,32,40,105,108,108,101,103,97,108,32,105,110,115,116,114,117,99,116,105,111,110,41,0,0,0,71,66,83,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,98,108,97,114,103,103,95,99,111,109,109,111,110,46,104,0,0,0,75,83,83,88,0,0,0,0,105,110,32,117,115,101,32,98,121,116,101,115,32,32,32,32,32,61,32,37,49,48,108,117,10,0,0,0,0,0,0,0,83,113,117,97,114,101,32,49,0,0,0,0,0,0,0,0,91,103,109,101,95,111,112,101,110,95,116,121,112,101,93,32,105,102,32,102,105,108,101,116,121,112,101,10,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,111,115,99,95,105,110,100,101,120,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,0,0,68,105,103,105,109,117,115,105,99,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,66,108,105,112,95,66,117,102,102,101,114,46,104,0,0,0,0,0,67,111,114,114,117,112,116,32,102,105,108,101,32,40,105,110,118,97,108,105,100,32,108,111,97,100,47,105,110,105,116,47,112,108,97,121,32,97,100,100,114,101,115,115,41,0,0,0,115,116,97,114,116,32,37,32,112,97,103,101,95,115,105,122,101,32,61,61,32,48,0,0,75,83,67,67,0,0,0,0,72,69,83,0,0,0,0,0,101,110,100,95,116,105,109,101,32,62,61,32,108,97,115,116,95,116,105,109,101,0,0,0,91,103,109,101,95,111,112,101,110,95,102,105,108,101,93,32,103,109,101,95,105,100,101,110,116,105,102,121,95,101,120,116,101,110,115,105,111,110,32,114,101,116,117,114,110,101,100,32,116,121,112,101,32,61,32,37,115,10,0,0,0,0,0,0,83,113,117,97,114,101,32,51,0,0,0,0,0,0,0,0,115,105,122,101,32,37,32,112,97,103,101,95,115,105,122,101,32,61,61,32,48,0,0,0,37,115,58,32,0,0,0,0,84,89,80,69,0,0,0,0,85,110,107,110,111,119,110,32,102,105,108,101,32,118,101,114,115,105,111,110,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,71,98,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,110,100,101,120,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,87,97,118,101,32,51,0,0,80,67,32,69,110,103,105,110,101,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,98,97,110,107,32,60,32,48,120,49,48,48,0,110,111,105,115,101,95,108,102,115,114,0,0,0,0,0,0,112,97,116,104,32,38,38,32,111,117,116,0,0,0,0,0,70,77,32,51,0,0,0,0,98,108,105,112,95,98,117,102,46,115,97,109,112,108,101,115,95,97,118,97,105,108,40,41,32,61,61,32,112,97,105,114,95,99,111,117,110,116,0,0,83,113,117,97,114,101,32,50,0,0,0,0,0,0,0,0,73,110,118,97,108,105,100,32,116,114,97,99,107,32,99,111,117,110,116,0,0,0,0,0,83,113,117,97,114,101,32,53,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,71,98,95,65,112,117,46,99,112,112,0,0,0,0,0,0,0,0,115,105,122,101,32,37,32,112,97,103,101,95,115,105,122,101,32,61,61,32,48,0,0,0,72,69,83,77,0,0,0,0,40,99,101,110,116,101,114,32,38,38,32,108,101,102,116,32,38,38,32,114,105,103,104,116,41,32,124,124,32,40,33,99,101,110,116,101,114,32,38,38,32,33,108,101,102,116,32,38,38,32,33,114,105,103,104,116,41,0,0,0,0,0,0,0,110,32,62,61,32,48,0,0,37,115,10,0,0,0,0,0,91,103,109,101,95,111,112,101,110,95,102,105,108,101,93,32,99,97,108,108,101,100,33,32,112,97,116,104,32,61,32,37,115,10,0,0,0,0,0,0,87,97,118,101,32,51,0,0,40,99,101,110,116,101,114,32,38,38,32,108,101,102,116,32,38,38,32,114,105,103,104,116,41,32,124,124,32,40,33,99,101,110,116,101,114,32,38,38,32,33,108,101,102,116,32,38,38,32,33,114,105,103,104,116,41,0,0,0,0,0,0,0,99,108,111,99,107,95,114,97,116,101,32,62,32,115,97,109,112,108,101,95,114,97,116,101,0,0,0,0,0,0,0,0,102,105,110,97,108,95,101,110,100,95,116,105,109,101,32,62,61,32,108,97,115,116,95,116,105,109,101,0,0,0,0,0,83,79,78,71,83,0,0,0,40,117,110,115,105,103,110,101,100,41,32,97,100,100,114,32,60,32,114,101,103,95,99,111,117,110,116,0,0,0,0,0,115,116,97,116,101,32,61,61,32,38,115,116,97,116,101,95,0,0,0,0,0,0,0,0,40,99,104,46,99,101,110,116,101,114,32,38,38,32,99,104,46,108,101,102,116,32,38,38,32,99,104,46,114,105,103,104,116,41,32,124,124,32,40,33,99,104,46,99,101,110,116,101,114,32,38,38,32,33,99,104,46,108,101,102,116,32,38,38,32,33,99,104,46,114,105,103,104,116,41,0,0,0,0,0,86,111,105,99,101,32,51,0,37,115,10,0,0,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,71,100,51,32,0,0,0,0,73,110,118,97,108,105,100,32,109,117,115,105,99,32,97,100,100,114,101,115,115,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,72,101,115,95,67,112,117,46,104,0,65,89,0,0,0,0,0,0,91,103,109,101,95,111,112,101,110,95,100,97,116,97,93,32,104,101,97,100,101,114,32,58,32,37,115,10,0,0,0,0,40,115,104,111,114,116,41,32,105,32,61,61,32,45,48,120,56,48,48,48,0,0,0,0,86,71,77,0,0,0,0,0,91,103,109,101,95,111,112,101,110,95,100,97,116,97,93,32,99,97,108,108,32,103,109,101,95,105,100,101,110,116,105,102,121,95,104,101,97,100,101,114,33,10,0,0,0,0,0,0,87,97,118,101,32,49,0,0,77,85,83,73,67,0,0,0,83,113,117,97,114,101,32,52,0,0,0,0,0,0,0,0,114,97,119,95,116,114,97,99,107,95,99,111,117,110,116,95,0,0,0,0,0,0,0,0,72,101,97,100,101,114,32,97,100,100,101,100,32,98,121,32,89,77,65,77,80,0,0,0,90,88,32,83,112,101,99,116,114,117,109,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,65,121,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,0,82,101,97,100,32,101,114,114,111,114,0,0,0,0,0,0,86,71,90,0,0,0,0,0,37,115,58,32,0,0,0,0,73,110,118,97,108,105,100,32,112,108,97,121,32,97,100,100,114,101,115,115,0,0,0,0,83,113,117,97,114,101,32,51,0,0,0,0,0,0,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,48,0,0,85,110,107,110,111,119,110,32,80,101,114,115,111,110,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,83,109,115,95,65,112,117,46,99,112,112,0,0,0,0,0,0,0,77,105,115,115,105,110,103,32,116,114,97,99,107,32,100,97,116,97,0,0,0,0,0,0,91,103,109,101,95,111,112,101,110,95,100,97,116,97,93,32,115,105,122,101,61,37,100,10,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,89,109,50,54,49,50,95,69,109,117,46,99,112,112,0,0,0,0,83,101,103,97,32,83,77,83,47,71,101,110,101,115,105,115,0,0,0,0,0,0,0,0,80,76,65,89,69,82,0,0,83,97,119,32,87,97,118,101,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,75,115,115,95,83,99,99,95,65,112,117,46,104,0,0,0,0,0,69,109,117,108,97,116,105,111,110,32,101,114,114,111,114,32,40,105,108,108,101,103,97,108,32,105,110,115,116,114,117,99,116,105,111,110,41,0,0,0,85,110,107,110,111,119,110,32,80,117,98,108,105,115,104,101,114,0,0,0,0,0,0,0,90,88,65,89,69,77,85,76,0,0,0,0,0,0,0,0,85,110,107,110,111,119,110,32,115,116,114,101,97,109,32,101,118,101,110,116,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,71,109,101,95,70,105,108,101,46,99,112,112,0,0,0,0,0,0,40,100,97,116,97,32,124,124,32,33,115,105,122,101,41,32,38,38,32,111,117,116,0,0,70,77,32,50,0,0,0,0,40,99,111,117,110,116,32,38,32,49,41,32,61,61,32,48,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,65,121,95,65,112,117,46,99,112,112,0,0,0,0,0,0,0,0,86,103,109,32,0,0,0,0,120,105,100,54,0,0,0,0,68,83,80,32,50,0,0,0,73,110,118,97,108,105,100,32,105,110,105,116,32,97,100,100,114,101,115,115,0,0,0,0,40,115,105,122,101,32,38,32,49,41,32,61,61,32,48,0,83,99,97,110,108,105,110,101,32,105,110,116,101,114,114,117,112,116,32,117,110,115,117,112,112,111,114,116,101,100,0,0,85,110,107,110,111,119,110,32,71,97,109,101,0,0,0,0,33,115,97,109,112,108,101,95,114,97,116,101,40,41,0,0,82,65,77,32,91,105,32,43,32,114,111,109,95,97,100,100,114,93,32,61,61,32,40,117,105,110,116,56,95,116,41,32,100,97,116,97,0,0,0,0,85,115,101,32,102,117,108,108,32,101,109,117,108,97,116,111,114,32,102,111,114,32,112,108,97,121,98,97,99,107,0,0,67,111,114,114,117,112,116,32,83,80,67,32,102,105,108,101,0,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,103,109,101,46,99,112,112,0,0,0,87,97,118,101,32,50,0,0,40,117,110,115,105,103,110,101,100,41,32,111,112,99,111,100,101,32,60,61,32,48,120,70,70,0,0,0,0,0,0,0,37,115,58,32,0,0,0,0,73,78,73,84,0,0,0,0,87,97,118,101,32,56,0,0,67,111,114,114,117,112,116,32,102,105,108,101,0,0,0,0,65,89,0,0,0,0,0,0,77,105,115,115,105,110,103,32,102,105,108,101,32,100,97,116,97,0,0,0,0,0,0,0,85,110,107,110,111,119,110,32,83,111,110,103,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,77,117,115,105,99,95,69,109,117,46,104,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,32,108,111,110,103,41,32,112,111,115,32,60,61,32,40,117,110,115,105,103,110,101,100,32,108,111,110,103,41,32,102,105,108,101,95,115,105,122,101,32,45,32,50,0,0,0,0,101,109,117,95,116,105,109,101,32,62,61,32,111,117,116,95,116,105,109,101,0,0,0,0,115,121,115,116,101,109,32,98,121,116,101,115,32,32,32,32,32,61,32,37,49,48,108,117,10,0,0,0,0,0,0,0,91,103,109,101,95,111,112,101,110,95,100,97,116,97,93,32,99,97,108,108,101,100,33,10,0,0,0,0,0,0,0,0,116,105,109,101,32,62,61,32,108,97,115,116,95,116,105,109,101,0,0,0,0,0,0,0,83,80,67,0,0,0,0,0,112,114,103,95,114,101,97,100,101,114,0,0,0,0,0,0,83,65,80,13,10,0,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,116,105,109,101,0,0,0,0,0,0,0,98,97,100,95,97,114,114,97,121,95,110,101,119,95,108,101,110,103,116,104,0,0,0,0,87,97,118,101,32,55,0,0,101,110,100,95,116,105,109,101,32,62,61,32,108,97,115,116,95,116,105,109,101,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,78,101,115,95,67,112,117,46,99,112,112,0,0,0,0,0,0,0,69,120,116,114,97,32,102,105,108,101,32,100,97,116,97,0,71,89,77,0,0,0,0,0,115,116,100,58,58,98,97,100,95,116,121,112,101,105,100,0,71,97,109,101,32,66,111,121,0,0,0,0,0,0,0,0,101,110,100,95,116,105,109,101,32,62,61,32,108,97,115,116,95,100,109,99,95,116,105,109,101,0,0,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,65,121,95,69,109,117,46,99,112,112,0,0,0,0,0,0,0,0,111,117,116,95,99,111,117,110,116,32,37,32,115,116,101,114,101,111,32,61,61,32,48,0,91,103,109,101,95,105,100,101,110,116,105,102,121,95,102,105,108,101,93,32,99,97,108,108,101,100,33,32,112,97,116,104,32,61,32,37,115,10,0,0,83,113,117,97,114,101,32,50,0,0,0,0,0,0,0,0,97,100,100,114,32,37,32,112,97,103,101,95,115,105,122,101,32,61,61,32,48,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,83,117,112,101,114,32,78,105,110,116,101,110,100,111,0,0,116,111,116,97,108,95,115,97,109,112,108,101,115,32,37,32,50,32,61,61,32,48,0,0,87,97,118,101,32,54,0,0,87,97,118,101,32,50,0,0,77,117,108,116,105,112,108,101,32,68,65,84,65,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,0,0,0,83,101,103,97,32,71,101,110,101,115,105,115,0,0,0,0,71,66,83,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,114,101,103,32,60,61,32,112,97,103,101,95,99,111,117,110,116,0,0,0,0,108,97,115,116,95,116,105,109,101,32,62,61,32,116,105,109,101,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,110,100,101,120,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,33,98,117,102,95,114,101,109,97,105,110,0,0,0,0,0,91,103,109,101,95,105,100,101,110,116,105,102,121,95,101,120,116,101,110,115,105,111,110,93,32,99,97,108,108,101,100,33,33,33,32,101,120,116,32,61,32,37,115,10,0,0,0,0,70,77,32,50,0,0,0,0,42,40,118,111,108,97,116,105,108,101,32,99,104,97,114,42,41,32,38,105,32,33,61,32,48,0,0,0,0,0,0,0,89,77,50,52,49,51,32,70,77,32,115,111,117,110,100,32,105,115,110,39,116,32,115,117,112,112,111,114,116,101,100,0,110,101,119,95,99,111,117,110,116,32,60,32,114,101,115,97,109,112,108,101,114,95,115,105,122,101,0,0,0,0,0,0,83,78,69,83,45,83,80,67,55,48,48,32,83,111,117,110,100,32,70,105,108,101,32,68,97,116,97,0,0,0,0,0,87,97,118,101,32,53,0,0,66,97,110,107,32,100,97,116,97,32,109,105,115,115,105,110,103,0,0,0,0,0,0,0,115,116,97,114,116,32,37,32,112,97,103,101,95,115,105,122,101,32,61,61,32,48,0,0,73,110,118,97,108,105,100,32,115,105,122,101,0,0,0,0,80,97,99,107,101,100,32,71,89,77,32,102,105,108,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,110,100,101,120,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,65,121,95,65,112,117,46,104,0,0,99,117,114,114,101,110,116,95,116,114,97,99,107,40,41,32,62,61,32,48,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,68,97,116,97,95,82,101,97,100,101,114,46,99,112,112,0,0,0,87,97,118,101,32,50,0,0,102,97,108,115,101,0,0,0,58,32,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,105,110,100,101,120,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,98,108,97,114,103,103,95,101,110,100,105,97,110,46,104,0,0,0,115,97,109,112,108,101,95,114,97,116,101,0,0,0,0,0,78,111,105,115,101,0,0,0,40,117,110,115,105,103,110,101,100,41,32,97,100,100,114,32,60,32,114,101,103,95,99,111,117,110,116,0,0,0,0,0,91,103,109,101,95,105,100,101,110,116,105,102,121,95,104,101,97,100,101,114,93,32,114,101,116,117,114,110,32,110,117,108,108,10,0,0,0,0,0,0,86,111,105,99,101,32,49,0,87,97,118,101,32,52,0,0,69,120,99,101,115,115,105,118,101,32,100,97,116,97,32,115,105,122,101,0,0,0,0,0,73,110,118,97,108,105,100,32,97,100,100,114,101,115,115,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,67,108].concat([97,115,115,105,99,95,69,109,117,46,99,112,112,0,0,0,86,111,105,99,101,32,50,0,40,117,110,115,105,103,110,101,100,41,32,105,110,100,101,120,32,60,32,40,117,110,115,105,103,110,101,100,41,32,118,111,105,99,101,95,99,111,117,110,116,40,41,0,0,0,0,0,33,40,99,111,117,110,116,32,38,32,49,41,0,0,0,0,58,32,0,0,0,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,110,32,60,61,32,115,105,122,101,95,0,0,0,0,0,0,83,113,117,97,114,101,32,51,0,0,0,0,0,0,0,0,86,71,77,0,0,0,0,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,77,117,108,116,105,95,66,117,102,102,101,114,46,99,112,112,0,0,87,97,118,101,32,51,0,0,40,117,110,115,105,103,110,101,100,41,32,111,115,99,32,60,32,111,115,99,95,99,111,117,110,116,0,0,0,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,85,110,107,110,111,119,110,32,104,101,97,100,101,114,32,100,97,116,97,0,0,0,0,0,71,89,77,88,0,0,0,0,115,97,109,112,108,101,95,114,97,116,101,40,41,0,0,0,84,97,103,103,105,110,103,0,107,101,114,110,101,108,95,117,110,105,116,32,62,32,48,0,40,105,32,62,62,32,49,41,32,61,61,32,45,48,120,51,70,70,70,70,70,70,70,0,47,104,111,109,101,47,116,111,107,107,121,111,47,103,97,109,101,45,109,117,115,105,99,45,101,109,117,45,48,46,54,46,48,47,103,109,101,47,66,108,105,112,95,66,117,102,102,101,114,46,99,112,112,0,0,0,99,111,110,115,116,32,99,104,97,114,32,42,103,109,101,95,118,111,105,99,101,95,110,97,109,101,40,99,111,110,115,116,32,77,117,115,105,99,95,69,109,117,32,42,44,32,105,110,116,41,0,0,0,0,0,0,99,111,110,115,116,32,99,104,97,114,32,42,103,109,101,95,116,121,112,101,95,115,121,115,116,101,109,40,103,109,101,95,116,121,112,101,95,116,41,0,103,109,101,95,101,114,114,95,116,32,103,109,101,95,111,112,101,110,95,102,105,108,101,40,99,111,110,115,116,32,99,104,97,114,32,42,44,32,77,117,115,105,99,95,69,109,117,32,42,42,44,32,105,110,116,41,0,0,0,0,0,0,0,0,103,109,101,95,101,114,114,95,116,32,103,109,101,95,111,112,101,110,95,100,97,116,97,40,99,111,110,115,116,32,118,111,105,100,32,42,44,32,108,111,110,103,44,32,77,117,115,105,99,95,69,109,117,32,42,42,44,32,105,110,116,41,0,0,105,110,116,32,83,112,99,95,68,115,112,58,58,114,101,97,100,40,105,110,116,41,32,99,111,110,115,116,0,0,0,0,84,32,38,98,108,97,114,103,103,95,118,101,99,116,111,114,60,115,104,111,114,116,62,58,58,111,112,101,114,97,116,111,114,91,93,40,115,105,122,101,95,116,41,32,99,111,110,115,116,32,91,84,32,61,32,115,104,111,114,116,93,0,0,0,84,32,38,98,108,97,114,103,103,95,118,101,99,116,111,114,60,117,110,115,105,103,110,101,100,32,99,104,97,114,62,58,58,111,112,101,114,97,116,111,114,91,93,40,115,105,122,101,95,116,41,32,99,111,110,115,116,32,91,84,32,61,32,117,110,115,105,103,110,101,100,32,99,104,97,114,93,0,0,0,84,32,38,98,108,97,114,103,103,95,118,101,99,116,111,114,60,99,104,97,114,62,58,58,111,112,101,114,97,116,111,114,91,93,40,115,105,122,101,95,116,41,32,99,111,110,115,116,32,91,84,32,61,32,99,104,97,114,93,0,0,0,0,0,84,32,38,98,108,97,114,103,103,95,118,101,99,116,111,114,60,99,111,110,115,116,32,99,104,97,114,32,42,62,58,58,111,112,101,114,97,116,111,114,91,93,40,115,105,122,101,95,116,41,32,99,111,110,115,116,32,91,84,32,61,32,99,111,110,115,116,32,99,104,97,114,32,42,93,0,0,0,0,0,84,32,38,98,108,97,114,103,103,95,118,101,99,116,111,114,60,77,51,117,95,80,108,97,121,108,105,115,116,58,58,101,110,116,114,121,95,116,62,58,58,111,112,101,114,97,116,111,114,91,93,40,115,105,122,101,95,116,41,32,99,111,110,115,116,32,91,84,32,61,32,77,51,117,95,80,108,97,121,108,105,115,116,58,58,101,110,116,114,121,95,116,93,0,0,0,84,32,38,98,108,97,114,103,103,95,118,101,99,116,111,114,60,99,104,97,114,32,91,52,93,62,58,58,111,112,101,114,97,116,111,114,91,93,40,115,105,122,101,95,116,41,32,99,111,110,115,116,32,91,84,32,61,32,99,104,97,114,32,91,52,93,93,0,0,0,0,0,98,108,105,112,95,114,101,115,97,109,112,108,101,100,95,116,105,109,101,95,116,32,66,108,105,112,95,66,117,102,102,101,114,58,58,99,108,111,99,107,95,114,97,116,101,95,102,97,99,116,111,114,40,108,111,110,103,41,32,99,111,110,115,116,0,0,0,0,0,0,0,0,98,108,105,112,95,116,105,109,101,95,116,32,66,108,105,112,95,66,117,102,102,101,114,58,58,99,111,117,110,116,95,99,108,111,99,107,115,40,108,111,110,103,41,32,99,111,110,115,116,0,0,0,0,0,0,0,118,111,105,100,32,66,108,105,112,95,83,121,110,116,104,60,56,44,32,49,62,58,58,111,102,102,115,101,116,95,114,101,115,97,109,112,108,101,100,40,98,108,105,112,95,114,101,115,97,109,112,108,101,100,95,116,105,109,101,95,116,44,32,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,32,99,111,110,115,116,32,91,113,117,97,108,105,116,121,32,61,32,56,44,32,114,97,110,103,101,32,61,32,49,93,0,0,0,0,0,0,0,118,111,105,100,32,66,108,105,112,95,83,121,110,116,104,60,49,50,44,32,49,62,58,58,111,102,102,115,101,116,95,114,101,115,97,109,112,108,101,100,40,98,108,105,112,95,114,101,115,97,109,112,108,101,100,95,116,105,109,101,95,116,44,32,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,32,99,111,110,115,116,32,91,113,117,97,108,105,116,121,32,61,32,49,50,44,32,114,97,110,103,101,32,61,32,49,93,0,0,0,0,0,118,111,105,100,32,66,108,105,112,95,83,121,110,116,104,60,49,50,44,32,49,53,62,58,58,111,102,102,115,101,116,95,114,101,115,97,109,112,108,101,100,40,98,108,105,112,95,114,101,115,97,109,112,108,101,100,95,116,105,109,101,95,116,44,32,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,32,99,111,110,115,116,32,91,113,117,97,108,105,116,121,32,61,32,49,50,44,32,114,97,110,103,101,32,61,32,49,53,93,0,0,0,118,111,105,100,32,77,117,115,105,99,95,69,109,117,58,58,115,101,116,95,116,101,109,112,111,40,100,111,117,98,108,101,41,0,0,0,0,0,0,0,118,111,105,100,32,77,117,115,105,99,95,69,109,117,58,58,115,101,116,95,103,97,105,110,40,100,111,117,98,108,101,41,0,0,0,0,0,0,0,0,118,105,114,116,117,97,108,32,118,111,105,100,32,77,117,115,105,99,95,69,109,117,58,58,112,114,101,95,108,111,97,100,40,41,0,0,0,0,0,0,118,111,105,100,32,77,117,115,105,99,95,69,109,117,58,58,102,105,108,108,95,98,117,102,40,41,0,0,0,0,0,0,98,108,97,114,103,103,95,101,114,114,95,116,32,77,117,115,105,99,95,69,109,117,58,58,115,107,105,112,40,108,111,110,103,41,0,0,0,0,0,0,98,108,97,114,103,103,95,101,114,114,95,116,32,77,117,115,105,99,95,69,109,117,58,58,112,108,97,121,40,108,111,110,103,44,32,115,97,109,112,108,101,95,116,32,42,41,0,0,98,108,97,114,103,103,95,101,114,114,95,116,32,77,117,115,105,99,95,69,109,117,58,58,115,101,116,95,115,97,109,112,108,101,95,114,97,116,101,40,108,111,110,103,41,0,0,0,118,111,105,100,32,77,117,115,105,99,95,69,109,117,58,58,109,117,116,101,95,118,111,105,99,101,115,40,105,110,116,41,0,0,0,0,0,0,0,0,118,111,105,100,32,77,117,115,105,99,95,69,109,117,58,58,109,117,116,101,95,118,111,105,99,101,40,105,110,116,44,32,98,111,111,108,41,0,0,0,118,111,105,100,32,83,110,101,115,95,83,112,99,58,58,101,110,100,95,102,114,97,109,101,40,116,105,109,101,95,116,41,0,0,0,0,0,0,0,0,105,110,116,32,83,110,101,115,95,83,112,99,58,58,99,112,117,95,114,101,97,100,40,105,110,116,44,32,114,101,108,95,116,105,109,101,95,116,41,0,98,108,97,114,103,103,95,101,114,114,95,116,32,83,110,101,115,95,83,112,99,58,58,112,108,97,121,40,105,110,116,44,32,115,97,109,112,108,101,95,116,32,42,41,0,0,0,0,118,111,105,100,32,83,110,101,115,95,83,112,99,58,58,99,112,117,95,119,114,105,116,101,95,104,105,103,104,40,105,110,116,44,32,105,110,116,44,32,114,101,108,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,83,110,101,115,95,83,112,99,58,58,115,101,116,95,111,117,116,112,117,116,40,115,97,109,112,108,101,95,116,32,42,44,32,105,110,116,41,0,0,0,0,0,0,118,111,105,100,32,83,110,101,115,95,83,112,99,58,58,115,97,118,101,95,101,120,116,114,97,40,41,0,0,0,0,0,66,79,79,83,84,58,58,117,105,110,116,56,95,116,32,42,83,110,101,115,95,83,112,99,58,58,114,117,110,95,117,110,116,105,108,95,40,116,105,109,101,95,116,41,0,0,0,0,118,105,114,116,117,97,108,32,98,108,97,114,103,103,95,101,114,114,95,116,32,71,109,101,95,70,105,108,101,58,58,108,111,97,100,95,109,101,109,95,40,99,111,110,115,116,32,98,121,116,101,95,32,42,44,32,108,111,110,103,41,0,0,0,98,108,97,114,103,103,95,101,114,114,95,116,32,71,109,101,95,70,105,108,101,58,58,108,111,97,100,95,109,51,117,95,40,98,108,97,114,103,103,95,101,114,114,95,116,41,0,0,118,111,105,100,32,83,112,99,95,68,115,112,58,58,119,114,105,116,101,40,105,110,116,44,32,105,110,116,41,0,0,0,118,111,105,100,32,83,112,99,95,68,115,112,58,58,105,110,105,116,40,118,111,105,100,32,42,41,0,0,0,0,0,0,118,111,105,100,32,83,112,99,95,68,115,112,58,58,114,117,110,40,105,110,116,41,0,0,118,111,105,100,32,83,112,99,95,68,115,112,58,58,115,111,102,116,95,114,101,115,101,116,95,99,111,109,109,111,110,40,41,0,0,0,0,0,0,0,118,111,105,100,32,83,112,99,95,68,115,112,58,58,115,101,116,95,111,117,116,112,117,116,40,115,97,109,112,108,101,95,116,32,42,44,32,105,110,116,41,0,0,0,0,0,0,0,118,111,105,100,32,83,109,115,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,118,111,105,100,32,83,109,115,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,118,111,105,100,32,83,109,115,95,65,112,117,58,58,119,114,105,116,101,95,103,103,115,116,101,114,101,111,40,98,108,105,112,95,116,105,109,101,95,116,44,32,105,110,116,41,0,0,118,111,105,100,32,83,109,115,95,65,112,117,58,58,119,114,105,116,101,95,100,97,116,97,40,98,108,105,112,95,116,105,109,101,95,116,44,32,105,110,116,41,0,0,0,0,0,0,118,111,105,100,32,83,109,115,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,0,118,111,105,100,32,83,99,99,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,118,111,105,100,32,83,99,99,95,65,112,117,58,58,119,114,105,116,101,40,98,108,105,112,95,116,105,109,101,95,116,44,32,105,110,116,44,32,105,110,116,41,0,0,0,0,0,0,118,111,105,100,32,83,99,99,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,98,111,111,108,32,83,97,112,95,67,112,117,58,58,114,117,110,40,115,97,112,95,116,105,109,101,95,116,41,0,0,0,118,111,105,100,32,83,97,112,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,118,111,105,100,32,78,101,115,95,68,109,99,58,58,102,105,108,108,95,98,117,102,102,101,114,40,41,0,0,0,0,0,118,111,105,100,32,78,101,115,95,67,112,117,58,58,109,97,112,95,99,111,100,101,40,110,101,115,95,97,100,100,114,95,116,44,32,117,110,115,105,103,110,101,100,32,105,110,116,44,32,99,111,110,115,116,32,118,111,105,100,32,42,44,32,98,111,111,108,41,0,0,0,0,118,111,105,100,32,78,101,115,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,40,110,101,115,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,78,101,115,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,110,101,115,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,78,101,115,95,65,112,117,58,58,119,114,105,116,101,95,114,101,103,105,115,116,101,114,40,110,101,115,95,116,105,109,101,95,116,44,32,110,101,115,95,97,100,100,114,95,116,44,32,105,110,116,41,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,95,40,110,101,115,95,116,105,109,101,95,116,41,0,0,0,0,118,111,105,100,32,78,101,115,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,118,111,105,100,32,75,115,115,95,67,112,117,58,58,109,97,112,95,109,101,109,40,117,110,115,105,103,110,101,100,32,105,110,116,44,32,98,108,97,114,103,103,95,117,108,111,110,103,44,32,118,111,105,100,32,42,44,32,99,111,110,115,116,32,118,111,105,100,32,42,41,0,98,111,111,108,32,75,115,115,95,67,112,117,58,58,114,117,110,40,99,112,117,95,116,105,109,101,95,116,41,0,0,0,118,111,105,100,32,72,101,115,95,79,115,99,58,58,114,117,110,95,117,110,116,105,108,40,115,121,110,116,104,95,116,32,38,44,32,98,108,105,112,95,116,105,109,101,95,116,41,0,118,111,105,100,32,72,101,115,95,67,112,117,58,58,101,110,100,95,102,114,97,109,101,40,104,101,115,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,72,101,115,95,67,112,117,58,58,115,101,116,95,109,109,114,40,105,110,116,44,32,105,110,116,41,0,98,111,111,108,32,72,101,115,95,67,112,117,58,58,114,117,110,40,104,101,115,95,116,105,109,101,95,116,41,0,0,0,118,111,105,100,32,72,101,115,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,118,111,105,100,32,72,101,115,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,0,118,111,105,100,32,89,109,95,69,109,117,60,89,109,50,54,49,50,95,69,109,117,62,58,58,98,101,103,105,110,95,102,114,97,109,101,40,115,104,111,114,116,32,42,41,32,91,69,109,117,32,61,32,89,109,50,54,49,50,95,69,109,117,93,0,0,0,0,0,0,0,0,118,111,105,100,32,89,109,95,69,109,117,60,89,109,50,52,49,51,95,69,109,117,62,58,58,98,101,103,105,110,95,102,114,97,109,101,40,115,104,111,114,116,32,42,41,32,91,69,109,117,32,61,32,89,109,50,52,49,51,95,69,109,117,93,0,0,0,0,0,0,0,0,118,111,105,100,32,71,98,95,67,112,117,58,58,109,97,112,95,99,111,100,101,40,103,98,95,97,100,100,114,95,116,44,32,117,110,115,105,103,110,101,100,32,105,110,116,44,32,118,111,105,100,32,42,41,0,0,98,111,111,108,32,71,98,95,67,112,117,58,58,114,117,110,40,98,108,97,114,103,103,95,108,111,110,103,41,0,0,0,118,111,105,100,32,71,98,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,71,98,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,71,98,95,65,112,117,58,58,119,114,105,116,101,95,114,101,103,105,115,116,101,114,40,98,108,105,112,95,116,105,109,101,95,116,44,32,117,110,115,105,103,110,101,100,32,105,110,116,44,32,105,110,116,41,0,0,0,0,0,105,110,116,32,71,98,95,65,112,117,58,58,114,101,97,100,95,114,101,103,105,115,116,101,114,40,98,108,105,112,95,116,105,109,101,95,116,44,32,117,110,115,105,103,110,101,100,32,105,110,116,41,0,0,0,0,118,111,105,100,32,71,98,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,0,0,98,111,111,108,32,65,121,95,67,112,117,58,58,114,117,110,40,99,112,117,95,116,105,109,101,95,116,41,0,0,0,0,118,111,105,100,32,65,121,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,65,121,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,118,111,105,100,32,65,121,95,65,112,117,58,58,119,114,105,116,101,95,100,97,116,97,95,40,105,110,116,44,32,105,110,116,41,0,0,0,0,0,0,118,111,105,100,32,65,121,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,118,111,105,100,32,70,105,114,95,82,101,115,97,109,112,108,101,114,95,58,58,119,114,105,116,101,40,108,111,110,103,41,0,0,0,0,0,0,0,0,118,105,114,116,117,97,108,32,108,111,110,103,32,69,102,102,101,99,116,115,95,66,117,102,102,101,114,58,58,114,101,97,100,95,115,97,109,112,108,101,115,40,98,108,105,112,95,115,97,109,112,108,101,95,116,32,42,44,32,108,111,110,103,41,0,0,0,0,0,0,0,0,118,111,105,100,32,68,117,97,108,95,82,101,115,97,109,112,108,101,114,58,58,112,108,97,121,95,102,114,97,109,101,95,40,66,108,105,112,95,66,117,102,102,101,114,32,38,44,32,100,115,97,109,112,108,101,95,116,32,42,41,0,0,0,0,118,105,114,116,117,97,108,32,108,111,110,103,32,83,116,101,114,101,111,95,66,117,102,102,101,114,58,58,114,101,97,100,95,115,97,109,112,108,101,115,40,98,108,105,112,95,115,97,109,112,108,101,95,116,32,42,44,32,108,111,110,103,41,0,118,111,105,100,32,78,101,115,95,78,97,109,99,111,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,78,97,109,99,111,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,0,118,105,114,116,117,97,108,32,105,110,116,32,86,103,109,95,69,109,117,95,73,109,112,108,58,58,112,108,97,121,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,44,32,105,110,116,44,32,115,97,109,112,108,101,95,116,32,42,41,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,86,114,99,54,95,65,112,117,58,58,119,114,105,116,101,95,111,115,99,40,98,108,105,112,95,116,105,109,101,95,116,44,32,105,110,116,44,32,105,110,116,44,32,105,110,116,41,0,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,86,114,99,54,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,86,114,99,54,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,86,114,99,54,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,70,109,101,55,95,65,112,117,58,58,114,117,110,95,117,110,116,105,108,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,70,109,101,55,95,65,112,117,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,0,0,118,111,105,100,32,78,101,115,95,70,109,101,55,95,65,112,117,58,58,111,115,99,95,111,117,116,112,117,116,40,105,110,116,44,32,66,108,105,112,95,66,117,102,102,101,114,32,42,41,0,0,0,0,0,0,0,118,111,105,100,32,89,109,50,54,49,50,95,73,109,112,108,58,58,115,101,116,95,114,97,116,101,40,100,111,117,98,108,101,44,32,100,111,117,98,108,101,41,0,0,0,0,0,0,118,111,105,100,32,89,109,50,54,49,50,95,73,109,112,108,58,58,119,114,105,116,101,49,40,105,110,116,44,32,105,110,116,41,0,0,0,0,0,0,118,111,105,100,32,89,109,50,54,49,50,95,73,109,112,108,58,58,119,114,105,116,101,48,40,105,110,116,44,32,105,110,116,41,0,0,0,0,0,0,118,105,114,116,117,97,108,32,98,108,97,114,103,103,95,101,114,114,95,116,32,70,105,108,101,95,82,101,97,100,101,114,58,58,115,107,105,112,40,108,111,110,103,41,0,0,0,0,118,105,114,116,117,97,108,32,98,108,97,114,103,103,95,101,114,114,95,116,32,67,108,97,115,115,105,99,95,69,109,117,58,58,112,108,97,121,95,40,108,111,110,103,44,32,115,97,109,112,108,101,95,116,32,42,41,0,0,0,0,0,0,0,118,105,114,116,117,97,108,32,118,111,105,100,32,67,108,97,115,115,105,99,95,69,109,117,58,58,109,117,116,101,95,118,111,105,99,101,115,95,40,105,110,116,41,0,0,0,0,0,118,105,114,116,117,97,108,32,118,111,105,100,32,67,108,97,115,115,105,99,95,69,109,117,58,58,115,101,116,95,98,117,102,102,101,114,40,77,117,108,116,105,95,66,117,102,102,101,114,32,42,41,0,0,0,0,118,111,105,100,32,66,108,105,112,95,83,121,110,116,104,95,58,58,118,111,108,117,109,101,95,117,110,105,116,40,100,111,117,98,108,101,41,0,0,0,66,108,105,112,95,66,117,102,102,101,114,58,58,66,108,105,112,95,66,117,102,102,101,114,40,41,0,0,0,0,0,0,118,111,105,100,32,66,108,105,112,95,66,117,102,102,101,114,58,58,101,110,100,95,102,114,97,109,101,40,98,108,105,112,95,116,105,109,101,95,116,41,0,0,0,0,0,0,0,0,66,108,105,112,95,66,117,102,102,101,114,58,58,98,108,97,114,103,103,95,101,114,114,95,116,32,66,108,105,112,95,66,117,102,102,101,114,58,58,115,101,116,95,115,97,109,112,108,101,95,114,97,116,101,40,108,111,110,103,44,32,105,110,116,41,0,0,0,0,0,0,0,118,111,105,100,32,66,108,105,112,95,66,117,102,102,101,114,58,58,114,101,109,111,118,101,95,115,105,108,101,110,99,101,40,108,111,110,103,41,0,0,118,111,105,100,32,66,108,105,112,95,66,117,102,102,101,114,58,58,109,105,120,95,115,97,109,112,108,101,115,40,99,111,110,115,116,32,98,108,105,112,95,115,97,109,112,108,101,95,116,32,42,44,32,108,111,110,103,41,0,0,0,0,0,0,118,111,105,100,32,83,80,67,95,70,105,108,116,101,114,58,58,114,117,110,40,115,104,111,114,116,32,42,44,32,105,110,116,41,0,0,0,0,0,0,99,111,110,115,116,32,98,121,116,101,95,32,42,103,101,116,95,100,97,116,97,40,99,111,110,115,116,32,65,121,95,69,109,117,58,58,102,105,108,101,95,116,32,38,44,32,99,111,110,115,116,32,98,121,116,101,95,32,42,44,32,105,110,116,41,0,0,0,0,0,0,0,118,111,105,100,32,98,108,97,114,103,103,95,118,101,114,105,102,121,95,98,121,116,101,95,111,114,100,101,114,40,41,0,78,69,83,77,26,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,65,0,0,0,0,0,0,0,0,32,78,0,0,0,0,0,0,168,39,0,0,24,40,0,0,24,28,0,0,0,20,0,0,232,15,0,0,8,12,0,0,216,9,0,0,0,7,0,0,1,2,4,6,0,0,0,0,40,71,52,54,38,84,84,104,72,71,69,86,85,101,34,70,40,71,52,54,38,84,84,116,72,71,69,86,85,101,34,56,40,71,52,54,38,68,84,102,72,71,69,86,85,69,34,67,40,71,52,54,38,68,84,117,72,71,69,86,85,85,34,54,40,71,52,54,38,84,82,69,72,71,69,86,85,85,34,197,56,71,52,54,38,68,82,68,72,71,69,86,85,85,34,52,56,71,69,71,37,100,82,73,72,71,86,103,69,85,34,131,40,71,52,54,36,83,67,64,72,71,69,86,52,84,34,96,80,114,111,98,108,101,109,32,105,110,32,109,51,117,32,97,116,32,108,105,110,101,32,0,8,16,32,48,64,80,96,112,1,1,0,0,0,1,0,0,2,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,3,0,0,232,1,0,0,136,40,0,0,88,39,0,0,56,7,0,0,200,31,0,0,128,21,0,0,160,16,0,0,224,12,0,0,8,10,0,0,136,7,0,0,232,4,0,0,248,7,0,0,48,32,0,0,168,21,0,0,168,16,0,0,232,12,0,0,24,10,0,0,184,7,0,0,240,4,0,0,13,12,12,12,12,12,12,12,12,12,12,12,12,16,16,16,0,0,1,2,3,4,5,6,7,8,9,10,11,11,11,11,1,1,0,0,2,1,0,0,3,1,0,0,0,1,0,0,5,1,0,0,6,1,0,0,7,1,0,0,4,1,0,0,16,10,0,0,48,33,0,0,152,22,0,0,16,17,0,0,120,13,0,0,160,10,0,0,0,8,0,0,56,5,0,0,0,6,2,8,3,3,5,5,3,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,6,6,2,8,3,3,5,5,4,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,6,6,2,8,3,3,5,5,3,2,2,2,3,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,6,6,2,8,3,3,5,5,4,2,2,2,5,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4,3,6,2,6,4,4,4,4,2,5,2,5,5,5,5,5,2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4,3,5,2,5,4,4,4,4,2,4,2,4,4,4,4,4,2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,85,85,0,0,0,0,0,0,4,2,0,0,0,0,0,0,64,16,32,8,0,0,0,0,120,23,0,0,104,17,0,0,208,13,0,0,184,10,0,0,8,8,0,0,0,0,0,0,1,1,0,0,2,1,0,0,0,1,0,0,0,2,0,0,1,3,0,0,3,1,0,0,4,1,0,0,5,1,0,0,6,1,0,0,7,1,0,0,8,1,0,0,9,1,0,0,10,1,0,0,11,1,0,0,12,1,0,0,13,1,0,0,120,23,0,0,104,17,0,0,208,13,0,0,184,10,0,0,8,8,0,0,208,29,0,0,16,29,0,0,32,26,0,0,120,23,0,0,104,17,0,0,208,13,0,0,184,10,0,0,8,8,0,0,200,30,0,0,208,29,0,0,16,29,0,0,128,3,0,0,48,2,0,0,216,40,0,0,176,39,0,0,208,37,0,0,104,36,0,0,224,34,0,0,104,33,0,0,120,23,0,0,104,17,0,0,208,13,0,0,184,10,0,0,8,8,0,0,200,30,0,0,208,29,0,0,16,29,0,0,120,23,0,0,104,17,0,0,208,13,0,0,184,10,0,0,8,8,0,0,128,3,0,0,48,2,0,0,216,40,0,0,176,39,0,0,208,37,0,0,104,36,0,0,224,34,0,0,104,33,0,0,0,0,0,0,0,6,2,8,3,3,5,5,3,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,6,6,2,8,3,3,5,5,4,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,6,6,2,8,3,3,5,5,3,2,2,2,3,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,6,6,2,8,3,3,5,5,4,2,2,2,5,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4,3,6,2,6,4,4,4,4,2,5,2,5,5,5,5,5,2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4,3,5,2,5,4,4,4,4,2,4,2,4,4,4,4,4,2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6,3,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6,3,5,0,8,4,4,6,6,2,4,2,7,4,4,7,7,64,64,64,128,64,64,128,160,0,1,0,0,1,1,0,0,2,1,0,0,3,1,0,0,4,1,0,0,5,1,0,0,6,1,0,0,7,1,0,0,24,16,0,0,8,36,0,0,208,24,0,0,80,18,0,0,168,14,0,0,248,10,0,0,40,8,0,0,152,5,0,0,195,1,0,195,9,0,0,0,211,160,245,123,211,161,241,201,211,160,219,162,201,0,0,0,4,10,7,6,4,4,7,4,4,11,7,6,4,4,7,4,13,10,7,6,4,4,7,4,12,11,7,6,4,4,7,4,12,10,16,6,4,4,7,4,12,11,16,6,4,4,7,4,12,10,13,6,11,11,10,4,12,11,13,6,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,7,7,7,7,7,7,4,7,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,11,10,10,10,17,11,7,11,11,10,10,8,17,17,7,11,11,10,10,11,17,11,7,11,11,4,10,11,17,8,7,11,11,10,10,19,17,11,7,11,11,4,10,4,17,8,7,11,11,10,10,4,17,11,7,11,11,6,10,4,17,8,7,11,0,1,0,0,1,1,0,0,2,1,0,0,3,1,0,0,0,3,0,0,1,3,0,0,112,18,0,0,112,36,0,0,120,25,0,0,120,18,0,0,176,14,0,0,0,11,0,0,1,7,3,4,6,4,6,7,3,2,2,2,7,5,7,6,4,7,7,4,6,4,6,7,2,5,2,2,7,5,7,6,7,7,3,4,4,4,6,7,4,2,2,2,5,5,7,6,4,7,7,2,4,4,6,7,2,5,2,2,5,5,7,6,7,7,3,4,8,4,6,7,3,2,2,2,4,5,7,6,4,7,7,5,2,4,6,7,2,5,3,2,2,5,7,6,7,7,2,2,4,4,6,7,4,2,2,2,7,5,7,6,4,7,7,17,4,4,6,7,2,5,4,2,7,5,7,6,4,7,2,7,4,4,4,7,2,2,2,2,5,5,5,6,4,7,7,8,4,4,4,7,2,5,2,2,5,5,5,6,2,7,2,7,4,4,4,7,2,2,2,2,5,5,5,6,4,7,7,8,4,4,4,7,2,5,2,2,5,5,5,6,2,7,2,17,4,4,6,7,2,2,2,2,5,5,7,6,4,7,7,17,2,4,6,7,2,5,3,2,2,5,7,6,2,7,2,17,4,4,6,7,2,2,2,2,5,5,7,6,4,7,7,17,2,4,6,7,2,5,4,2,2,5,7,6,0,0,6,0,7,0,8,0,10,0,12,0,14,0,17,0,20,0,23,0,28,0,33,0,39,0,47,0,56,0,66,0,79,0,93,0,111,0,132,0,157,0,187,0,222,0,8,1,58,1,118,1,188,1,17,2,117,2,235,2,121,3,33,4,88,20,0,0,72,37,0,0,200,25,0,0,192,18,0,0,200,14,0,0,104,11,0,0,144,8,0,0,224,5,0,0,1,1,0,0,2,1,0,0,0,1,0,0,0,3,0,0,176,21,0,0,248,25,0,0,232,18,0,0,208,14,0,0,10,4,6,8,0,0,0,0,132,64,67,170,45,120,146,60,96,89,89,176,52,184,46,218,0,1,0,0,1,1,0,0,2,1,0,0,0,3,0,0,0,29,0,0,216,38,0,0,0,27,0,0,104,19,0,0,243,205,0,0,237,94,251,118,24,250,0,0,0,0,0,0,243,205,0,0,237,86,251,118,205,0,0,24,247,0,0,0,4,10,7,6,4,4,7,4,4,11,7,6,4,4,7,4,13,10,7,6,4,4,7,4,12,11,7,6,4,4,7,4,12,10,16,6,4,4,7,4,12,11,16,6,4,4,7,4,12,10,13,6,11,11,10,4,12,11,13,6,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,7,7,7,7,7,7,4,7,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4,4,4,4,4,7,4,11,10,10,10,17,11,7,11,11,10,10,8,17,17,7,11,11,10,10,11,17,11,7,11,11,4,10,11,17,8,7,11,11,10,10,19,17,11,7,11,11,4,10,4,17,8,7,11,11,10,10,4,17,11,7,11,11,6,10,4,17,8,7,11,0,0,0,0,56,94,0,0,152,0,0,0,50,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,94,0,0,44,0,0,0,186,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,94,0,0,34,1,0,0,238,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,94,0,0,44,0,0,0,184,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,94,0,0,34,0,0,0,168,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,97,0,0,106,1,0,0,38,1,0,0,142,0,0,0,218,0,0,0,90,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,97,0,0,106,1,0,0,76,1,0,0,142,0,0,0,218,0,0,0,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,97,0,0,106,1,0,0,170,0,0,0,142,0,0,0,218,0,0,0,42,0,0,0,2,0,0,0,14,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,97,0,0,106,1,0,0,196,0,0,0,142,0,0,0,218,0,0,0,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,97,0,0,106,1,0,0,160,0,0,0,142,0,0,0,218,0,0,0,90,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,97,0,0,106,1,0,0,94,0,0,0,142,0,0,0,218,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,97,0,0,106,1,0,0,164,0,0,0,142,0,0,0,218,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,97,0,0,106,1,0,0,96,0,0,0,142,0,0,0,218,0,0,0,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,97,0,0,140,0,0,0,254,0,0,0,242,0,0,0,22,0,0,0,82,0,0,0,116,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,97,0,0,72,0,0,0,0,1,0,0,242,0,0,0,42,0,0,0,82,0,0,0,2,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,58,0,0,0,2,0,0,0,60,0,0,0,32,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,97,0,0,252,0,0,0,36,0,0,0,242,0,0,0,42,0,0,0,82,0,0,0,2,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,0,0,10,1,0,0,8,0,0,0,242,0,0,0,6,0,0,0,82,0,0,0,6,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,98,0,0,4,0,0,0,232,0,0,0,242,0,0,0,38,0,0,0,82,0,0,0,130,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,98,0,0,102,0,0,0,112,1,0,0,242,0,0,0,42,0,0,0,62,0,0,0,38,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,98,0,0,32,0,0,0,158,0,0,0,112,0,0,0,50,0,0,0,82,0,0,0,32,0,0,0,180,0,0,0,26,0,0,0,126,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,2,0,0,0,36,0,0,0,72,0,0,0,20,0,0,0,16,0,0,0,30,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,98,0,0,78,1,0,0,192,0,0,0,242,0,0,0,30,0,0,0,82,0,0,0,66,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,98,0,0,54,0,0,0,66,0,0,0,242,0,0,0,68,0,0,0,82,0,0,0,126,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,98,0,0,38,0,0,0,42,1,0,0,242,0,0,0,4,0,0,0,82,0,0,0,30,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,98,0,0,48,0,0,0,64,1,0,0,242,0,0,0,42,0,0,0,12,0,0,0,108,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,98,0,0,136,0,0,0,182,0,0,0,74,0,0,0,42,0,0,0,82,0,0,0,2,0,0,0,154,0,0,0,236,0,0,0,212,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,98,0,0,124,0,0,0,36,1,0,0,242,0,0,0,10,0,0,0,82,0,0,0,50,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,98,0,0,78,0,0,0,114,0,0,0,242,0,0,0,42,0,0,0,44,0,0,0,84,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,46,0,0,0,20,0,0,0,32,0,0,0,48,0,0,0,14,0,0,0,52,0,0,0,80,0,0,0,20,0,0,0,18,0,0,0,36,0,0,0,56,0,0,0,2,0,0,0,176,254,255,255,152,98,0,0,138,0,0,0,24,0,0,0])
.concat([8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,98,0,0,72,1,0,0,172,0,0,0,242,0,0,0,42,0,0,0,110,0,0,0,74,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,58,0,0,0,58,0,0,0,60,0,0,0,6,0,0,0,40,0,0,0,8,0,0,0,62,0,0,0,78,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,98,0,0,230,0,0,0,114,1,0,0,242,0,0,0,42,0,0,0,10,0,0,0,14,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,4,0,0,0,32,0,0,0,72,0,0,0,20,0,0,0,20,0,0,0,44,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,98,0,0,128,0,0,0,12,0,0,0,92,0,0,0,34,0,0,0,82,0,0,0,46,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,2,0,0,0,74,0,0,0,72,0,0,0,20,0,0,0,16,0,0,0,30,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,99,0,0,82,1,0,0,6,1,0,0,54,1,0,0,26,0,0,0,82,0,0,0,92,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,20,0,0,0,66,0,0,0,72,0,0,0,20,0,0,0,4,0,0,0,8,0,0,0,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,99,0,0,14,1,0,0,6,0,0,0,220,0,0,0,54,0,0,0,82,0,0,0,20,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,10,0,0,0,14,0,0,0,72,0,0,0,20,0,0,0,2,0,0,0,54,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,99,0,0,166,0,0,0,194,0,0,0,242,0,0,0,42,0,0,0,36,0,0,0,98,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,58,0,0,0,60,0,0,0,60,0,0,0,32,0,0,0,72,0,0,0,18,0,0,0,48,0,0,0,68,0,0,0,20,0,0,0,4,0,0,0,192,254,255,255,88,99,0,0,222,0,0,0,146,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,99,0,0,228,0,0,0,104,1,0,0,206,0,0,0,18,0,0,0,82,0,0,0,76,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,6,0,0,0,56,0,0,0,72,0,0,0,20,0,0,0,10,0,0,0,68,0,0,0,122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,99,0,0,74,1,0,0,214,0,0,0,242,0,0,0,42,0,0,0,88,0,0,0,48,0,0,0,8,1,0,0,176,0,0,0,212,0,0,0,58,0,0,0,64,0,0,0,76,0,0,0,52,0,0,0,64,0,0,0,16,0,0,0,2,0,0,0,118,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,99,0,0,68,1,0,0,204,0,0,0,242,0,0,0,42,0,0,0,104,0,0,0,34,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,12,0,0,0,24,0,0,0,72,0,0,0,20,0,0,0,12,0,0,0,28,0,0,0,120,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,99,0,0,190,0,0,0,156,0,0,0,70,0,0,0,4,0,0,0,16,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,99,0,0,56,1,0,0,84,0,0,0,96,0,0,0,112,0,0,0,12,0,0,0,40,0,0,0,18,0,0,0,2,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,99,0,0,58,0,0,0,58,1,0,0,26,0,0,0,124,0,0,0,12,0,0,0,40,0,0,0,14,0,0,0,10,0,0,0,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,100,0,0,82,0,0,0,104,0,0,0,102,0,0,0,8,0,0,0,24,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,100,0,0,30,0,0,0,44,1,0,0,44,0,0,0,4,0,0,0,106,0,0,0,42,0,0,0,18,0,0,0,16,0,0,0,56,0,0,0,24,0,0,0,28,0,0,0,38,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,100,0,0,30,1,0,0,70,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,100,0,0,40,0,0,0,2,0,0,0,22,0,0,0,124,0,0,0,26,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,100,0,0,16,1,0,0,56,0,0,0,44,0,0,0,16,0,0,0,58,0,0,0,70,0,0,0,2,0,0,0,60,0,0,0,24,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,100,0,0,40,1,0,0,20,0,0,0,44,0,0,0,6,0,0,0,18,0,0,0,62,0,0,0,74,0,0,0,80,0,0,0,14,0,0,0,60,0,0,0,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,100,0,0,202,0,0,0,116,0,0,0,242,0,0,0,42,0,0,0,82,0,0,0,2,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,2,0,0,0,2,0,0,0,72,0,0,0,20,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,176,254,255,255,96,100,0,0,46,1,0,0,20,1,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,100,0,0,66,1,0,0,10,0,0,0,44,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,100,0,0,162,0,0,0,130,0,0,0,44,0,0,0,12,0,0,0,28,0,0,0,34,0,0,0,46,0,0,0,106,0,0,0,10,0,0,0,54,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,100,0,0,2,1,0,0,132,0,0,0,2,0,0,0,124,0,0,0,12,0,0,0,40,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,100,0,0,234,0,0,0,178,0,0,0,2,0,0,0,124,0,0,0,2,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,100,0,0,12,1,0,0,62,0,0,0,242,0,0,0,42,0,0,0,82,0,0,0,2,0,0,0,180,0,0,0,26,0,0,0,212,0,0,0,16,0,0,0,70,0,0,0,20,0,0,0,32,0,0,0,12,0,0,0,2,0,0,0,2,0,0,0,72,0,0,0,20,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,0,0,0,0,0,0,0,120,0,0,0,0,0,0,0,119,0,0,0,0,0,0,0,118,0,0,0,0,0,0,0,116,0,0,0,0,0,0,0,115,0,0,0,0,0,0,0,109,0,0,0,0,0,0,0,108,0,0,0,0,0,0,0,106,0,0,0,0,0,0,0,105,0,0,0,0,0,0,0,104,0,0,0,0,0,0,0,102,0,0,0,0,0,0,0,101,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,99,0,0,0,0,0,0,0,98,0,0,0,0,0,0,0,97,0,0,0,0,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,83,116,57,101,120,99,101,112,116,105,111,110,0,0,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,83,116,56,98,97,100,95,99,97,115,116,0,0,0,0,0,83,116,50,48,98,97,100,95,97,114,114,97,121,95,110,101,119,95,108,101,110,103,116,104,0,0,0,0,0,0,0,0,83,116,49,48,98,97,100,95,116,121,112,101,105,100,0,0,80,121,0,0,0,0,0,0,80,120,0,0,0,0,0,0,80,119,0,0,0,0,0,0,80,118,0,0,0,0,0,0,80,116,0,0,0,0,0,0,80,115,0,0,0,0,0,0,80,109,0,0,0,0,0,0,80,108,0,0,0,0,0,0,80,106,0,0,0,0,0,0,80,105,0,0,0,0,0,0,80,104,0,0,0,0,0,0,80,102,0,0,0,0,0,0,80,101,0,0,0,0,0,0,80,100,0,0,0,0,0,0,80,99,0,0,0,0,0,0,80,98,0,0,0,0,0,0,80,97,0,0,0,0,0,0,80,75,121,0,0,0,0,0,80,75,120,0,0,0,0,0,80,75,119,0,0,0,0,0,80,75,118,0,0,0,0,0,80,75,116,0,0,0,0,0,80,75,115,0,0,0,0,0,80,75,109,0,0,0,0,0,80,75,108,0,0,0,0,0,80,75,106,0,0,0,0,0,80,75,105,0,0,0,0,0,80,75,104,0,0,0,0,0,80,75,102,0,0,0,0,0,80,75,101,0,0,0,0,0,80,75,100,0,0,0,0,0,80,75,99,0,0,0,0,0,80,75,98,0,0,0,0,0,80,75,97,0,0,0,0,0,80,75,68,115,0,0,0,0,80,75,68,110,0,0,0,0,80,75,68,105,0,0,0,0,80,68,115,0,0,0,0,0,80,68,110,0,0,0,0,0,80,68,105,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,57,95,95,112,111,105,110,116,101,114,95,116,111,95,109,101,109,98,101,114,95,116,121,112,101,95,105,110,102,111,69,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,51,95,95,102,117,110,100,97,109,101,110,116,97,108,95,116,121,112,101,95,105,110,102,111,69,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,49,95,95,118,109,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,102,117,110,99,116,105,111,110,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,57,95,95,112,111,105,110,116,101,114,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,112,98,97,115,101,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,97,114,114,97,121,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,101,110,117,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,68,115,0,0,0,0,0,0,68,110,0,0,0,0,0,0,68,105,0,0,0,0,0,0,57,78,115,102,101,95,70,105,108,101,0,0,0,0,0,0,57,77,117,115,105,99,95,69,109,117,0,0,0,0,0,0,57,71,109,101,95,73,110,102,111,95,0,0,0,0,0,0,56,86,103,109,95,70,105,108,101,0,0,0,0,0,0,0,56,83,112,99,95,70,105,108,101,0,0,0,0,0,0,0,56,83,97,112,95,70,105,108,101,0,0,0,0,0,0,0,56,78,115,102,101,95,69,109,117,0,0,0,0,0,0,0,56,78,115,102,95,70,105,108,101,0,0,0,0,0,0,0,56,75,115,115,95,70,105,108,101,0,0,0,0,0,0,0,56,72,101,115,95,70,105,108,101,0,0,0,0,0,0,0,56,71,121,109,95,70,105,108,101,0,0,0,0,0,0,0,56,71,109,101,95,70,105,108,101,0,0,0,0,0,0,0,56,71,98,115,95,70,105,108,101,0,0,0,0,0,0,0,55,86,103,109,95,69,109,117,0,0,0,0,0,0,0,0,55,83,112,99,95,69,109,117,0,0,0,0,0,0,0,0,55,83,97,112,95,69,109,117,0,0,0,0,0,0,0,0,55,83,97,112,95,67,112,117,0,0,0,0,0,0,0,0,55,78,115,102,95,69,109,117,0,0,0,0,0,0,0,0,55,78,101,115,95,67,112,117,0,0,0,0,0,0,0,0,55,75,115,115,95,69,109,117,0,0,0,0,0,0,0,0,55,75,115,115,95,67,112,117,0,0,0,0,0,0,0,0,55,72,101,115,95,69,109,117,0,0,0,0,0,0,0,0,55,72,101,115,95,67,112,117,0,0,0,0,0,0,0,0,55,71,121,109,95,69,109,117,0,0,0,0,0,0,0,0,55,71,98,115,95,69,109,117,0,0,0,0,0,0,0,0,55,65,121,95,70,105,108,101,0,0,0,0,0,0,0,0,54,71,98,95,67,112,117,0,54,65,121,95,69,109,117,0,54,65,121,95,67,112,117,0,49,54,82,101,109,97,105,110,105,110,103,95,82,101,97,100,101,114,0,0,0,0,0,0,49,53,83,116,100,95,70,105,108,101,95,82,101,97,100,101,114,0,0,0,0,0,0,0,49,53,77,101,109,95,70,105,108,101,95,82,101,97,100,101,114,0,0,0,0,0,0,0,49,53,67,97,108,108,98,97,99,107,95,82,101,97,100,101,114,0,0,0,0,0,0,0,49,52,69,102,102,101,99,116,115,95,66,117,102,102,101,114,0,0,0,0,0,0,0,0,49,52,68,117,97,108,95,82,101,115,97,109,112,108,101,114,0,0,0,0,0,0,0,0,49,51,83,117,98,115,101,116,95,82,101,97,100,101,114,0,49,51,83,116,101,114,101,111,95,66,117,102,102,101,114,0,49,51,83,105,108,101,110,116,95,66,117,102,102,101,114,0,49,50,86,103,109,95,69,109,117,95,73,109,112,108,0,0,49,50,77,117,108,116,105,95,66,117,102,102,101,114,0,0,49,49,77,111,110,111,95,66,117,102,102,101,114,0,0,0,49,49,70,105,108,101,95,82,101,97,100,101,114,0,0,0,49,49,68,97,116,97,95,82,101,97,100,101,114,0,0,0,49,49,67,108,97,115,115,105,99,95,69,109,117,0,0,0,24,74,0,0,72,87,0,0,24,74,0,0,80,87,0,0,24,74,0,0,176,87,0,0,0,0,0,0,192,87,0,0,0,0,0,0,208,87,0,0,0,0,0,0,224,87,0,0,64,94,0,0,0,0,0,0,0,0,0,0,240,87,0,0,64,94,0,0,0,0,0,0,0,0,0,0,0,88,0,0,72,94,0,0,0,0,0,0,0,0,0,0,32,88,0,0,64,94,0,0,0,0,0,0,0,0,0,0,48,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,88,0,0,0,0,0,0,32,94,0,0,0,0,0,0,72,88,0,0,0,0,0,0,40,94,0,0,0,0,0,0,80,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,88,0,0,0,0,0,0,48,94,0,0,0,0,0,0,176,88,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,192,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,200,88,0,0,1,0,0,0,32,94,0,0,0,0,0,0,208,88,0,0,1,0,0,0,40,94,0,0,0,0,0,0,216,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,224,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,232,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,240,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,248,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,8,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,16,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,24,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,32,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,40,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,48,89,0,0,1,0,0,0,48,94,0,0,0,0,0,0,56,89,0,0,1,0,0,0,0,0,0,0,0,0,0,0,64,89,0,0,1,0,0,0,184,97,0,0,0,0,0,0,72,89,0,0,1,0,0,0,192,97,0,0,0,0,0,0,80,89,0,0,1,0,0,0,200,97,0,0,0,0,0,0,88,89,0,0,0,0,0,0,184,97,0,0,0,0,0,0,96,89,0,0,0,0,0,0,192,97,0,0,0,0,0,0,104,89,0,0,0,0,0,0,200,97,0,0,0,0,0,0,112,89,0,0,104,97,0,0,0,0,0,0,0,0,0,0,160,89,0,0,152,97,0,0,0,0,0,0,0,0,0,0,200,89,0,0,120,97,0,0,0,0,0,0,0,0,0,0,240,89,0,0,120,97,0,0,0,0,0,0,0,0,0,0,24,90,0,0,152,97,0,0,0,0,0,0,0,0,0,0,64,90,0,0,104,97,0,0,0,0,0,0,0,0,0,0,104,90,0,0,152,97,0,0,0,0,0,0,0,0,0,0,144,90,0,0,152,97,0,0,0,0,0,0,0,0,0,0,184,90,0,0,152,97,0,0,0,0,0,0,0,0,0,0,224,90,0,0,56,94,0,0,0,0,0,0,0,0,0,0,8,91,0,0,152,97,0,0,0,0,0,0,24,74,0,0,48,91,0,0,24,74,0,0,56,91,0,0,24,74,0,0,64,91,0,0,0,0,0,0,72,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,88,91,0,0,128,98,0,0,0,0,0,0,0,0,0,0,104,91,0,0,224,97,0,0,0,0,0,0,0,0,0,0,120,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,136,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,152,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,168,91,0,0,224,98,0,0,0,0,0,0,0,0,0,0,184,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,200,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,216,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,232,91,0,0,240,97,0,0,0,0,0,0,0,0,0,0,248,91,0,0,0,0,0,0,8,92,0,0,240,97,0,0,0,0,0,0,0,0,0,0,24,92,0,0,96,100,0,0,0,0,0,0,0,0,0,0,40,92,0,0,224,97,0,0,0,0,0,0,64,74,0,0,56,92,0,0,0,0,0,0,2,0,0,0,216,98,0,0,0,80,1,0,176,100,0,0,2,0,0,0,0,0,0,0,72,92,0,0,64,74,0,0,88,92,0,0,0,0,0,0,2,0,0,0,0,99,0,0,0,80,1,0,176,100,0,0,2,0,0,0,0,0,0,0,104,92,0,0,64,74,0,0,120,92,0,0,0,0,0,0,2,0,0,0,40,99,0,0,0,80,1,0,176,100,0,0,2,0,0,0,0,0,0,0,136,92,0,0,64,74,0,0,152,92,0,0,0,0,0,0,2,0,0,0,80,99,0,0,0,80,1,0,176,100,0,0,2,0,0,0,0,0,0,0,168,92,0,0,64,74,0,0,184,92,0,0,0,0,0,0,2,0,0,0,224,97,0,0,2,0,0,0,40,100,0,0,0,64,1,0,64,74,0,0,200,92,0,0,0,0,0,0,2,0,0,0,168,99,0,0,0,80,1,0,176,100,0,0,2,0,0,0,0,0,0,0,216,92,0,0,240,97,0,0,0,0,0,0,0,0,0,0,232,92,0,0,64,74,0,0,240,92,0,0,0,0,0,0,2,0,0,0,208,99,0,0,0,80,1,0,176,100,0,0,2,0,0,0,0,0,0,0,248,92,0,0,0,0,0,0,0,93,0,0,168,100,0,0,0,0,0,0,0,0,0,0,24,93,0,0,152,100,0,0,0,0,0,0,0,0,0,0,48,93,0,0,152,100,0,0,0,0,0,0,0,0,0,0,72,93,0,0,168,100,0,0,0,0,0,0,0,0,0,0,96,93,0,0,128,100,0,0,0,0,0,0,0,0,0,0,120,93,0,0,0,0,0,0,144,93,0,0,168,100,0,0,0,0,0,0,0,0,0,0,160,93,0,0,128,100,0,0,0,0,0,0,0,0,0,0,176,93,0,0,128,100,0,0,0,0,0,0,64,74,0,0,192,93,0,0,0,0,0,0,2,0,0,0,176,100,0,0,2,0,0,0,40,100,0,0,0,80,1,0,0,0,0,0,208,93,0,0,0,0,0,0,224,93,0,0,128,100,0,0,0,0,0,0,0,0,0,0,240,93,0,0,168,100,0,0,0,0,0,0,0,0,0,0,0,94,0,0,0,0,0,0,16,94,0,0,224,97,0,0,0,0,0,0,83,78,69,83,45,83,80,67,55,48,48,32,83,111,117,110,100,32,70,105,108,101,32,68,97,116,97,32,118,48,46,51,48,26,26,0,0,0,0,0,255,0,245,246,241,245,254,254,4,3,14,14,26,26,14,22,2,3,0,1,244,0,1,1,7,6,14,14,27,14,14,23,5,6,3,4,255,3,4,4,10,9,14,14,26,251,14,23,8,9,6,7,2,6,7,7,13,12,14,14,27,252,14,24,11,12,9,10,5,9,10,10,16,15,14,14,254,252,14,24,14,15,12,13,8,12,13,13,19,18,14,14,254,220,14,24,17,18,15,16,11,15,16,16,22,21,14,14,28,253,14,25,20,21,18,19,14,18,19,19,25,24,14,14,14,29,14,25,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,0,1,2,3,4,6,8,12,17,24,34,48,68,96,136,192,85,110,101,120,112,101,99,116,101,100,32,101,110,100,32,111,102,32,102,105,108,101,0,0,0,1,2,3,4,5,6,7,7,8,9,10,11,12,13,14,15,15,16,17,18,19,20,20,21,22,23,24,24,25,26,27,27,28,29,30,31,31,32,33,33,34,35,36,36,37,38,38,39,40,41,41,42,43,43,44,45,45,46,47,47,48,48,49,50,50,51,52,52,53,53,54,55,55,56,56,57,58,58,59,59,60,60,61,61,62,63,63,64,64,65,65,66,66,67,67,68,68,69,70,70,71,71,72,72,73,73,74,74,75,75,75,76,76,77,77,78,78,79,79,80,80,81,81,82,82,82,83,0,2,3,4,6,8,11,16,23,32,45,64,90,128,180,255,0,0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,64,50,39,31,24,19,15,12,9,7,5,4,3,2,1,0,21,1,25,61,42,62,38,2,4,0,8,0,16,0,32,0,64,0,96,0,128,0,160,0,202,0,254,0,124,1,252,1,250,2,248,3,242,7,228,15,114,1,25,5,110,1,25,5,106,1,24,5,102,1,24,5,98,1,24,5,95,1,24,5,91,1,24,5,87,1,23,5,83,1,23,5,80,1,23,5,76,1,22,5,72,1,22,5,69,1,21,5,65,1,20,5,62,1,20,5,58,1,19,5,55,1,18,5,51,1,17,5,48,1,17,5,44,1,16,5,41,1,15,5,37,1,14,5,34,1,13,5,30,1,12,5,27,1,11,5,24,1,10,5,20,1,8,5,17,1,7,5,14,1,6,5,11,1,4,5,7,1,3,5,4,1,2,5,1,1,0,5,254,0,255,4,251,0,253,4,248,0,251,4,245,0,250,4,242,0,248,4,239,0,246,4,236,0,245,4,233,0,243,4,230,0,241,4,227,0,239,4,224,0,237,4,221,0,235,4,218,0,233,4,215,0,231,4,212,0,229,4,210,0,227,4,207,0,224,4,204,0,222,4,201,0,220,4,199,0,217,4,196,0,215,4,193,0,213,4,191,0,210,4,188,0,208,4,186,0,205,4,183,0,203,4,180,0,200,4,178,0,197,4,175,0,195,4,173,0,192,4,171,0,189,4,168,0,186,4,166,0,183,4,163,0,181,4,161,0,178,4,159,0,175,4,156,0,172,4,154,0,169,4,152,0,166,4,150,0,162,4,147,0,159,4,145,0,156,4,143,0,153,4,141,0,150,4,139,0,146,4,137,0,143,4,134,0,140,4,132,0,136,4,130,0,133,4,128,0,129,4,126,0,126,4,124,0,122,4,122,0,119,4,120,0,115,4,118,0,112,4,117,0,108,4,115,0,104,4,113,0,101,4,111,0,97,4,109,0,93,4,107,0,89,4,106,0,85,4,104,0,82,4,102,0,78,4,100,0,74,4,99,0,70,4,97,0,66,4,95,0,62,4,94,0,58,4,92,0,54,4,90,0,50,4,89,0,46,4,87,0,42,4,86,0,37,4,84,0,33,4,83,0,29,4,81,0,25,4,80,0,21,4,78,0,16,4,77,0,12,4,76,0,8,4,74,0,3,4,73,0,255,3,71,0,251,3,70,0,246,3,69,0,242,3,67,0,237,3,66,0,233,3,65,0,229,3,64,0,224,3,62,0,220,3,61,0,215,3,60,0,210,3,59,0,206,3,58,0,201,3,56,0,197,3,55,0,192,3,54,0,187,3,53,0,183,3,52,0,178,3,51,0,173,3,50,0,169,3,49,0,164,3,48,0,159,3,47,0,155,3,46,0,150,3,45,0,145,3,44,0,140,3,43,0,136,3,42,0,131,3,41,0,126,3,40,0,121,3,39,0,116,3,38,0,112,3,37,0,107,3,36,0,102,3,36,0,97,3,35,0,92,3,34,0,87,3,33,0,83,3,32,0,78,3,32,0,73,3,31,0,68,3,30,0,63,3,29,0,58,3,29,0,53,3,28,0,48,3,27,0,43,3,27,0,38,3,26,0,34,3,25,0,29,3,24,0,24,3,24,0,19,3,23,0,14,3,23,0,9,3,22,0,4,3,21,0,255,2,21,0,250,2,20,0,245,2,20,0,240,2,19,0,235,2,19,0,230,2,18,0,225,2,17,0,220,2,17,0,216,2,16,0,211,2,16,0,206,2,15,0,201,2,15,0,196,2,15,0,191,2,14,0,186,2,14,0,181,2,13,0,176,2,13,0,171,2,12,0,166,2,12,0,162,2,11,0,157,2,11,0,152,2,11,0,147,2,10,0,142,2,10,0,137,2,10,0,132,2,9,0,128,2,9,0,123,2,9,0,118,2,8,0,113,2,8,0,108,2,8,0,103,2,7,0,99,2,7,0,94,2,7,0,89,2,6,0,84,2,6,0,80,2,6,0,75,2,6,0,70,2,5,0,65,2,5,0,61,2,5,0,56,2,5,0,51,2,4,0,47,2,4,0,42,2,4,0,38,2,4,0,33,2,4,0,28,2,3,0,24,2,3,0,19,2,3,0,15,2,3,0,10,2,3,0,5,2,2,0,1,2,2,0,252,1,2,0,248,1,2,0,243,1,2,0,239,1,2,0,235,1,2,0,230,1,1,0,226,1,1,0,221,1,1,0,217,1,1,0,213,1,1,0,208,1,1,0,204,1,1,0,200,1,1,0,195,1,1,0,191,1,1,0,187,1,1,0,183,1,0,0,178,1,0,0,174,1,0,0,170,1,0,0,166,1,0,0,162,1,0,0,158,1,0,0,154,1,0,0,149,1,0,0,145,1,0,0,141,1,0,0,137,1,0,0,133,1,0,0,129,1,0,0,125,1,0,0,122,1,0,0,118,1,172,1,124,1,84,1,64,1,30,1,254,0,226,0,214,0,190,0,160,0,142,0,128,0,106,0,84,0,72,0,54,0,142,1,98,1,60,1,42,1,20,1,236,0,210,0,198,0,176,0,148,0,132,0,118,0,98,0,78,0,66,0,50,0,64,5,0,0,0,0,0,0,26,0,0,0,38,0,0,0,240,10,0,0,1,0,0,0,0,1,0,0,0,2,0,0,0,4,0,0,0,0,0,0,168,30,0,0,1,0,0,0,30,0,0,0,6,0,0,0,168,29,0,0,1,0,0,0,168,30,0,0,1,0,0,0,30,0,0,0,6,0,0,0,200,28,0,0,1,0,0,0,64,36,0,0,1,0,0,0,40,0,0,0,16,0,0,0,144,34,0,0,0,0,0,0,96,18,0,0,0,0,0,0,12,0,0,0,4,0,0,0,216,17,0,0,1,0,0,0,0,17,0,0,0,0,0,0,34,0,0,0,32,0,0,0,152,16,0,0,1,0,0,0,200,21,0,0,0,1,0,0,10,0,0,0,20,0,0,0,240,20,0,0,3,0,0,0,128,25,0,0,0,1,0,0,8,0,0,0,2,0,0,0,112,24,0,0,1,0,0,0,152,36,0,0,1,0,0,0,14,0,0,0,28,0,0,0,72,35,0,0,0,0,0,0,96,35,0,0,0,0,0,0,36,0,0,0,18,0,0,0,168,36,0,0,1,0,0,0,128,63,0,255,191,255,63,0,255,191,127,255,159,255,191,255,255,0,0,191,0,119,128,255,255,255,255,255,255,255,255,255,10,254,20,2,40,4,80,6,160,8,60,10,14,12,26,14,12,16,24,18,48,20,96,22,192,24,72,26,16,28,32,30,69,139,90,154,228,130,27,120,0,0,170,150,137,14,224,128,42,73,61,186,20,160,172,197,0,0,81,187,156,78,123,255,244,253,87,50,55,217,66,34,0,0,91,60,159,27,135,154,111,39,175,123,229,104,10,217,0,0,154,197,156,78,123,255,234,33,120,79,221,237,36,20,0,0,119,177,209,54,193,103,82,87,70,61,89,244,135,164,0,0,126,68,156,78,123,255,117,245,6,151,16,195,36,187,0,0,123,122,224,96,18,15,247,116,28,229,57,61,115,193,0,0,122,179,255,78,123,255,80,29,0,0,0,0,0,0,22,0,0,0,24,0,0,0,136,28,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,6,12,2,0,0,3,0,0,7,12,2,0,0,3,0,0,0,0,0,15,15,11,0,0,7,0,0,0,0,0,0,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,160,64,64,112,192,0,96,11,160,75,75,123,203,11,107,0,11,64,64,112,192,0,96,11,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,128,128,128,128,0,0,11,0,128,128,128,128,0,0,11,0,208,208,208,208,0,0,11,0,208,208,208,208,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,15,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,6,12,2,0,0,3,0,0,7,12,2,0,0,3,0,0,0,0,0,15,15,11,0,0,7,0,0,0,0,0,0,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,16,64,64,112,192,0,96,11,160,64,64,112,192,0,96,11,160,75,75,123,203,11,107,0,11,64,64,112,192,0,96,11,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,128,128,128,128,0,0,11,0,128,128,128,128,0,0,11,0,208,208,208,208,0,0,11,0,208,208,208,208,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,15,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,7,0,0,0,255,15,0,0,255,15,0,0,255,7,0,0,255,7,0,0,255,7,0,0,255,3,0,0,255,3,0,0,255,3,0,0,255,1,0,0,255,1,0,0,255,1,0,0,255,0,0,0,255,0,0,0,255,0,0,0,127,0,0,0,127,0,0,0,127,0,0,0,63,0,0,0,63,0,0,0,63,0,0,0,31,0,0,0,31,0,0,0,31,0,0,0,15,0,0,0,15,0,0,0,15,0,0,0,7,0,0,0,7,0,0,0,7,0,0,0,1,0,0,0,0,0,0,0,34,0,0,0,22,0,0,0,26,0,0,0,28,0,0,0,14,0,0,0,2,0,0,0,30,0,0,0,24,0,0,0,0,1,2,3,4,6,12,24,31,4,1,0,0,0,0,0,128,191,0,0,191,0,63,0,0,191,127,255,159,0,191,0,255,0,0,191,119,243,241,0,0,0,0,0,0,0,0,0,172,221,218,72,54,2,207,22,44,4,229,44,172,221,218,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,4,4,4,5,5,6,6,7,8,8,8,8,1,1,1,1,2,2,2,2,2,3,3,3,4,4,4,5,5,6,6,7,8,8,9,10,11,12,13,14,16,16,16,16,2,2,2,2,2,3,3,3,4,4,4,5,5,6,6,7,8,8,9,10,11,12,13,14,16,17,19,20,22,22,22,22])
, "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function ___assert_func(filename, line, func, condition) {
      throw 'Assertion failed: ' + (condition ? Pointer_stringify(condition) : 'unknown condition') + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + new Error().stack;
    }
  Module["___assert_func"] = ___assert_func;
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  Module["_llvm_memset_p0i8_i32"] = _llvm_memset_p0i8_i32;
  var _floor=Math.floor;
  Module["_floor"] = _floor;
  Module["_memcpy"] = _memcpy; 
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;
  Module["_llvm_memmove_p0i8_p0i8_i32"] = _llvm_memmove_p0i8_p0i8_i32;
  var _cos=Math.cos;
  Module["_cos"] = _cos;
  var _llvm_pow_f64=Math.pow;
  Module["_llvm_pow_f64"] = _llvm_pow_f64;
  var _sin=Math.sin;
  Module["_sin"] = _sin;
  function ___gxx_personality_v0() {
    }
  Module["___gxx_personality_v0"] = ___gxx_personality_v0;
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module.print('exit(' + status + ') called');
      Module['exit'](status);
    }
  Module["__exit"] = __exit;function _exit(status) {
      __exit(status);
    }
  Module["_exit"] = _exit;function __ZSt9terminatev() {
      _exit(-1234);
    }
  Module["__ZSt9terminatev"] = __ZSt9terminatev;
  var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  Module["_llvm_memcpy_p0i8_p0i8_i32"] = _llvm_memcpy_p0i8_p0i8_i32;
  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }
  Module["___cxa_pure_virtual"] = ___cxa_pure_virtual;
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:35,EIDRM:36,ECHRNG:37,EL2NSYNC:38,EL3HLT:39,EL3RST:40,ELNRNG:41,EUNATCH:42,ENOCSI:43,EL2HLT:44,EDEADLK:45,ENOLCK:46,EBADE:50,EBADR:51,EXFULL:52,ENOANO:53,EBADRQC:54,EBADSLT:55,EDEADLOCK:56,EBFONT:57,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:74,EDOTDOT:76,EBADMSG:77,ENOTUNIQ:80,EBADFD:81,EREMCHG:82,ELIBACC:83,ELIBBAD:84,ELIBSCN:85,ELIBMAX:86,ELIBEXEC:87,ENOSYS:88,ENOTEMPTY:90,ENAMETOOLONG:91,ELOOP:92,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:106,EPROTOTYPE:107,ENOTSOCK:108,ENOPROTOOPT:109,ESHUTDOWN:110,ECONNREFUSED:111,EADDRINUSE:112,ECONNABORTED:113,ENETUNREACH:114,ENETDOWN:115,ETIMEDOUT:116,EHOSTDOWN:117,EHOSTUNREACH:118,EINPROGRESS:119,EALREADY:120,EDESTADDRREQ:121,EMSGSIZE:122,EPROTONOSUPPORT:123,ESOCKTNOSUPPORT:124,EADDRNOTAVAIL:125,ENETRESET:126,EISCONN:127,ENOTCONN:128,ETOOMANYREFS:129,EUSERS:131,EDQUOT:132,ESTALE:133,ENOTSUP:134,ENOMEDIUM:135,EILSEQ:138,EOVERFLOW:139,ECANCELED:140,ENOTRECOVERABLE:141,EOWNERDEAD:142,ESTRPIPE:143};
  Module["ERRNO_CODES"] = ERRNO_CODES;
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"No message of desired type",36:"Identifier removed",37:"Channel number out of range",38:"Level 2 not synchronized",39:"Level 3 halted",40:"Level 3 reset",41:"Link number out of range",42:"Protocol driver not attached",43:"No CSI structure available",44:"Level 2 halted",45:"Deadlock condition",46:"No record locks available",50:"Invalid exchange",51:"Invalid request descriptor",52:"Exchange full",53:"No anode",54:"Invalid request code",55:"Invalid slot",56:"File locking deadlock error",57:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",74:"Multihop attempted",76:"Cross mount point (not really error)",77:"Trying to read unreadable message",80:"Given log. name not unique",81:"f.d. invalid for this operation",82:"Remote address changed",83:"Can   access a needed shared lib",84:"Accessing a corrupted shared lib",85:".lib section in a.out corrupted",86:"Attempting to link in too many libs",87:"Attempting to exec a shared library",88:"Function not implemented",90:"Directory not empty",91:"File or path name too long",92:"Too many symbolic links",95:"Operation not supported on transport endpoint",96:"Protocol family not supported",104:"Connection reset by peer",105:"No buffer space available",106:"Address family not supported by protocol family",107:"Protocol wrong type for socket",108:"Socket operation on non-socket",109:"Protocol not available",110:"Can't send after socket shutdown",111:"Connection refused",112:"Address already in use",113:"Connection aborted",114:"Network is unreachable",115:"Network interface is not configured",116:"Connection timed out",117:"Host is down",118:"Host is unreachable",119:"Connection already in progress",120:"Socket already connected",121:"Destination address required",122:"Message too long",123:"Unknown protocol",124:"Socket type not supported",125:"Address not available",126:"Connection reset by network",127:"Socket is already connected",128:"Socket is not connected",129:"Too many references",131:"Too many users",132:"Quota exceeded",133:"Stale file handle",134:"Not supported",135:"No medium (in tape drive)",138:"Illegal byte sequence",139:"Value too large for defined data type",140:"Operation canceled",141:"State not recoverable",142:"Previous owner died",143:"Streams pipe error"};
  Module["ERRNO_MESSAGES"] = ERRNO_MESSAGES;
  var ___errno_state=0;
  Module["___errno_state"] = ___errno_state;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  Module["___setErrNo"] = ___setErrNo;
  var VFS=undefined;
  Module["VFS"] = VFS;
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path, ext) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var f = PATH.splitPath(path)[2];
        if (ext && f.substr(-1 * ext.length) === ext) {
          f = f.substr(0, f.length - ext.length);
        }
        return f;
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.filter(function(p, index) {
          if (typeof p !== 'string') {
            throw new TypeError('Arguments to path.join must be strings');
          }
          return p;
        }).join('/'));
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  Module["PATH"] = PATH;
  var TTY={ttys:[],register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          // this wouldn't be required if the library wasn't eval'd at first...
          if (!TTY.utf8) {
            TTY.utf8 = new Runtime.UTF8Processor();
          }
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              if (process.stdin.destroyed) {
                return undefined;
              }
              result = process.stdin.read();
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  Module["TTY"] = TTY;
  var MEMFS={mount:function (mount) {
        return MEMFS.create_node(null, '/', 0040000 | 0777, 0);
      },create_node:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          };
          node.stream_ops = {
            llseek: MEMFS.stream_ops.llseek
          };
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          };
          node.stream_ops = {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap
          };
          node.contents = [];
        } else if (FS.isLink(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          };
          node.stream_ops = {};
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          };
          node.stream_ops = FS.chrdev_stream_ops;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.create_node(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.create_node(parent, newname, 0777 | 0120000, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          var size = Math.min(contents.length - position, length);
          if (contents.subarray) { // typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          stream.node.timestamp = Date.now();
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 0x02)) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            assert(contents.buffer === buffer || contents.buffer === buffer.buffer);
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  Module["MEMFS"] = MEMFS;
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  Module["_stdin"] = _stdin;
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  Module["_stdout"] = _stdout;
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  Module["_stderr"] = _stderr;
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }
  Module["_fflush"] = _fflush;var FS={root:null,nodes:[null],devices:[null],streams:[null],nextInode:1,name_table:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        },handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + new Error().stack;
        return ___setErrNo(e.errno);
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.name_table.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.name_table[hash];
        FS.name_table[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.name_table[hash] === node) {
          FS.name_table[hash] = node.name_next;
        } else {
          var current = FS.name_table[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.name_table[hash]; node; node = node.name_next) {
          if (node.parent.id === parent.id && node.name === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        var node = {
          id: FS.nextInode++,
          name: name,
          mode: mode,
          node_ops: {},
          stream_ops: {},
          rdev: rdev,
          parent: null,
          mount: null
        };
        if (!parent) {
          parent = node;  // root node sets parent to itself
        }
        node.parent = parent;
        node.mount = parent.mount;
        // compatibility
        var readMode = 292 | 73;
        var writeMode = 146;
        // NOTE we must use Object.defineProperties instead of individual calls to
        // Object.defineProperty in order to make closure compiler happy
        Object.defineProperties(node, {
          read: {
            get: function() { return (node.mode & readMode) === readMode; },
            set: function(val) { val ? node.mode |= readMode : node.mode &= ~readMode; }
          },
          write: {
            get: function() { return (node.mode & writeMode) === writeMode; },
            set: function(val) { val ? node.mode |= writeMode : node.mode &= ~writeMode; }
          },
          isFolder: {
            get: function() { return FS.isDir(node.mode); },
          },
          isDevice: {
            get: function() { return FS.isChrdev(node.mode); },
          },
        });
        FS.hashAddNode(node);
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 0170000) === 0100000;
      },isDir:function (mode) {
        return (mode & 0170000) === 0040000;
      },isLink:function (mode) {
        return (mode & 0170000) === 0120000;
      },isChrdev:function (mode) {
        return (mode & 0170000) === 0020000;
      },isBlkdev:function (mode) {
        return (mode & 0170000) === 0060000;
      },isFIFO:function (mode) {
        return (mode & 0170000) === 0010000;
      },cwd:function () {
        return FS.currentPath;
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.currentPath, path);
        opts = opts || { recurse_count: 0 };
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            return path ? PATH.join(node.mount.mountpoint, path) : node.mount.mountpoint;
          }
          path = path ? PATH.join(node.name, path) : node.name;
          node = node.parent;
        }
      },flagModes:{"r":0,"rs":8192,"r+":2,"w":1537,"wx":3585,"xw":3585,"w+":1538,"wx+":3586,"xw+":3586,"a":521,"ax":2569,"xa":2569,"a+":522,"ax+":2570,"xa+":2570},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 3;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 1024)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayMknod:function (mode) {
        switch (mode & 0170000) {
          case 0100000:
          case 0020000:
          case 0060000:
          case 0010000:
          case 0140000:
            return 0;
          default:
            return ERRNO_CODES.EINVAL;
        }
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.currentPath) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 3) !== 0 ||  // opening for write
              (flags & 1024)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        // compatibility
        Object.defineProperties(stream, {
          object: {
            get: function() { return stream.node; },
            set: function(val) { stream.node = val; }
          },
          isRead: {
            get: function() { return (stream.flags & 3) !== 1; }
          },
          isWrite: {
            get: function() { return (stream.flags & 3) !== 0; }
          },
          isAppend: {
            get: function() { return (stream.flags & 8); }
          }
        });
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join(parent, part);
          try {
            FS.mkdir(current, 0777);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(path, mode | 146);
          var stream = FS.open(path, 'w');
          FS.write(stream, data, 0, data.length, 0);
          FS.close(stream);
          FS.chmod(path, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = input && output ? 0777 : (input ? 0333 : 0555);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = PATH.resolve(PATH.join(parent, name));
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp', 0777);
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev', 0777);
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', 0666, FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', 0666, FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', 0666, FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm', 0777);
        FS.mkdir('/dev/shm/tmp', 0777);
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },staticInit:function () {
        FS.name_table = new Array(4096);
        FS.root = FS.createNode(null, '/', 0040000 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },mount:function (type, opts, mountpoint) {
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
        }
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode &= 4095;
        mode |= 0100000;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode &= 511 | 0001000;
        mode |= 0040000;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        mode |= 0020000;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        path = PATH.normalize(path);
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 512)) {
          mode = (mode & 4095) | 0100000;
        } else {
          mode = 0;
        }
        var node;
        try {
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 0200000)
          });
          node = lookup.node;
          path = lookup.path;
        } catch (e) {
          // ignore
        }
        // perhaps we need to create the node
        if ((flags & 512)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 2048)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~1024;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 1024)) {
          FS.truncate(node, 0);
        }
        // register the stream with the filesystem
        var stream = FS.createStream({
          path: path,
          node: node,
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 8) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 3) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.errnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      }};
  Module["FS"] = FS;
  var ___dirent_struct_layout={__size__:1040,d_ino:0,d_name:4,d_off:1028,d_reclen:1032,d_type:1036};
  Module["___dirent_struct_layout"] = ___dirent_struct_layout;function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  Module["_open"] = _open;function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 1024;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 8;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  Module["_fopen"] = _fopen;
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  Module["_lseek"] = _lseek;function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var ret = _lseek(stream, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStream(stream);
      stream.eof = false;
      return 0;
    }
  Module["_fseek"] = _fseek;
  function _recv(fd, buf, len, flags) {
      var info = FS.getStream(fd);
      if (!info) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (!info.hasData()) {
        if (info.socket.readyState === WebSocket.CLOSING || info.socket.readyState === WebSocket.CLOSED) {
          // socket has closed
          return 0;
        } else {
          // else, our socket is in a valid state but truly has nothing available
          ___setErrNo(ERRNO_CODES.EAGAIN);
          return -1;
        }
      }
      var buffer = info.inQueue.shift();
      if (len < buffer.length) {
        if (info.stream) {
          // This is tcp (reliable), so if not all was read, keep it
          info.inQueue.unshift(buffer.subarray(len));
        }
        buffer = buffer.subarray(0, len);
      }
      HEAPU8.set(buffer, buf);
      return buffer.length;
    }
  Module["_recv"] = _recv;
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  Module["_pread"] = _pread;function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (stream && ('socket' in stream)) {
        return _recv(fildes, buf, nbyte, 0);
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  Module["_read"] = _read;function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop()
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }
  Module["_fread"] = _fread;
  function _feof(stream) {
      // int feof(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/feof.html
      stream = FS.getStream(stream);
      return Number(stream && stream.eof);
    }
  Module["_feof"] = _feof;
  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStream(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }
  Module["_ftell"] = _ftell;
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);;
        return -1;
      }
    }
  Module["_close"] = _close;
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }
  Module["_fsync"] = _fsync;function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }
  Module["_fclose"] = _fclose;
  var _fabs=Math.abs;
  Module["_fabs"] = _fabs;
  function _fmod(x, y) {
      return x % y;
    }
  Module["_fmod"] = _fmod;
  function ___cxa_guard_acquire(variable) {
      if (!HEAP8[(variable)]) { // ignore SAFE_HEAP stuff because llvm mixes i64 and i8 here
        HEAP8[(variable)]=1;
        return 1;
      }
      return 0;
    }
  Module["___cxa_guard_acquire"] = ___cxa_guard_acquire;
  function ___cxa_guard_release() {}
  Module["___cxa_guard_release"] = ___cxa_guard_release;
  function _send(fd, buf, len, flags) {
      var info = FS.getStream(fd);
      if (!info) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (info.socket.readyState === WebSocket.CLOSING || info.socket.readyState === WebSocket.CLOSED) {
        ___setErrNo(ERRNO_CODES.ENOTCONN);
        return -1;
      } else if (info.socket.readyState === WebSocket.CONNECTING) {
        ___setErrNo(ERRNO_CODES.EAGAIN);
        return -1;
      }
      info.sender(HEAPU8.subarray(buf, buf+len));
      return len;
    }
  Module["_send"] = _send;
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  Module["_pwrite"] = _pwrite;function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (stream && ('socket' in stream)) {
        return _send(fildes, buf, nbyte, 0);
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  Module["_write"] = _write;function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_fwrite"] = _fwrite;
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }
  Module["__reallyNegative"] = __reallyNegative;function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }
  Module["__formatString"] = __formatString;function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }
  Module["_fprintf"] = _fprintf;function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }
  Module["_printf"] = _printf;
  function _strrchr(ptr, chr) {
      var ptr2 = ptr + _strlen(ptr);
      do {
        if (HEAP8[(ptr2)] == chr) return ptr2;
        ptr2--;
      } while (ptr2 >= ptr);
      return 0;
    }
  Module["_strrchr"] = _strrchr;
  function _strncmp(px, py, n) {
      var i = 0;
      while (i < n) {
        var x = HEAPU8[(((px)+(i))|0)];
        var y = HEAPU8[(((py)+(i))|0)];
        if (x == y && x == 0) return 0;
        if (x == 0) return -1;
        if (y == 0) return 1;
        if (x == y) {
          i ++;
          continue;
        } else {
          return x > y ? 1 : -1;
        }
      }
      return 0;
    }
  Module["_strncmp"] = _strncmp;function _strcmp(px, py) {
      return _strncmp(px, py, TOTAL_MEMORY);
    }
  Module["_strcmp"] = _strcmp;
  function _toupper(chr) {
      if (chr >= 97 && chr <= 122) {
        return chr - 97 + 65;
      } else {
        return chr;
      }
    }
  Module["_toupper"] = _toupper;
  var _llvm_memset_p0i8_i64=_memset;
  Module["_llvm_memset_p0i8_i64"] = _llvm_memset_p0i8_i64;
  function _log10(x) {
      return Math.log(x) / Math.LN10;
    }
  Module["_log10"] = _log10;
  Module["_memcmp"] = _memcmp;
  Module["_strncpy"] = _strncpy;
  function _abort() {
      Module['abort']();
    }
  Module["_abort"] = _abort;
  function ___errno_location() {
      return ___errno_state;
    }
  Module["___errno_location"] = ___errno_location;var ___errno=___errno_location;
  Module["___errno"] = ___errno;
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  Module["_sbrk"] = _sbrk;
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  Module["_sysconf"] = _sysconf;
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  Module["_time"] = _time;
  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }
  Module["___cxa_allocate_exception"] = ___cxa_allocate_exception;
  function _llvm_eh_exception() {
      return HEAP32[((_llvm_eh_exception.buf)>>2)];
    }
  Module["_llvm_eh_exception"] = _llvm_eh_exception;
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  Module["__ZSt18uncaught_exceptionv"] = __ZSt18uncaught_exceptionv;
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }
  Module["___cxa_is_number_type"] = ___cxa_is_number_type;function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }
  Module["___cxa_does_inherit"] = ___cxa_does_inherit;
  function ___resumeException(ptr) {
      if (HEAP32[((_llvm_eh_exception.buf)>>2)] == 0) HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr;
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";;
    }
  Module["___resumeException"] = ___resumeException;function ___cxa_find_matching_catch(thrown, throwntype) {
      if (thrown == -1) thrown = HEAP32[((_llvm_eh_exception.buf)>>2)];
      if (throwntype == -1) throwntype = HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)];
      var typeArray = Array.prototype.slice.call(arguments, 2);
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }
  Module["___cxa_find_matching_catch"] = ___cxa_find_matching_catch;function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr
      HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)]=type
      HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)]=destructor
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";;
    }
  Module["___cxa_throw"] = ___cxa_throw;
  function ___cxa_call_unexpected(exception) {
      Module.printErr('Unexpected exception thrown, this is not properly supported - aborting');
      ABORT = true;
      throw exception;
    }
  Module["___cxa_call_unexpected"] = ___cxa_call_unexpected;
  function ___cxa_begin_catch(ptr) {
      __ZSt18uncaught_exceptionv.uncaught_exception--;
      return ptr;
    }
  Module["___cxa_begin_catch"] = ___cxa_begin_catch;
  function ___cxa_free_exception(ptr) {
      try {
        return _free(ptr);
      } catch(e) { // XXX FIXME
      }
    }
  Module["___cxa_free_exception"] = ___cxa_free_exception;function ___cxa_end_catch() {
      if (___cxa_end_catch.rethrown) {
        ___cxa_end_catch.rethrown = false;
        return;
      }
      // Clear state flag.
      asm['setThrew'](0);
      // Clear type.
      HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)]=0
      // Call destructor if one is registered then clear it.
      var ptr = HEAP32[((_llvm_eh_exception.buf)>>2)];
      var destructor = HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)];
      if (destructor) {
        Runtime.dynCall('vi', destructor, [ptr]);
        HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)]=0
      }
      // Free ptr if it isn't null.
      if (ptr) {
        ___cxa_free_exception(ptr);
        HEAP32[((_llvm_eh_exception.buf)>>2)]=0
      }
    }
  Module["___cxa_end_catch"] = ___cxa_end_catch;
  var _environ=allocate(1, "i32*", ALLOC_STATIC);
  Module["_environ"] = _environ;var ___environ=_environ;
  Module["___environ"] = ___environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = 'root';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/emscripten';
        ENV['LANG'] = 'en_US.UTF-8';
        ENV['_'] = './this.program';
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        HEAP32[((envPtr)>>2)]=poolPtr
        HEAP32[((_environ)>>2)]=envPtr;
      } else {
        envPtr = HEAP32[((_environ)>>2)];
        poolPtr = HEAP32[((envPtr)>>2)];
      }
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        for (var j = 0; j < line.length; j++) {
          HEAP8[(((poolPtr)+(j))|0)]=line.charCodeAt(j);
        }
        HEAP8[(((poolPtr)+(j))|0)]=0;
        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
        poolPtr += line.length + 1;
      }
      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
    }
  Module["___buildEnvironment"] = ___buildEnvironment;var ENV={};
  Module["ENV"] = ENV;function _getenv(name) {
      // char *getenv(const char *name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
      if (name === 0) return 0;
      name = Pointer_stringify(name);
      if (!ENV.hasOwnProperty(name)) return 0;
      if (_getenv.ret) _free(_getenv.ret);
      _getenv.ret = allocate(intArrayFromString(ENV[name]), 'i8', ALLOC_NORMAL);
      return _getenv.ret;
    }
  Module["_getenv"] = _getenv;
  function _strchr(ptr, chr) {
      ptr--;
      do {
        ptr++;
        var val = HEAP8[(ptr)];
        if (val == chr) return ptr;
      } while (val);
      return 0;
    }
  Module["_strchr"] = _strchr;
  var _llvm_va_start=undefined;
  Module["_llvm_va_start"] = _llvm_va_start;
  function _llvm_va_end() {}
  Module["_llvm_va_end"] = _llvm_va_end;
  function _vfprintf(s, f, va_arg) {
      return _fprintf(s, f, HEAP32[((va_arg)>>2)]);
    }
  Module["_vfprintf"] = _vfprintf;
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          for (var i = 0; i < msg.length; i++) {
            HEAP8[(((strerrbuf)+(i))|0)]=msg.charCodeAt(i)
          }
          HEAP8[(((strerrbuf)+(i))|0)]=0
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }
  Module["_strerror_r"] = _strerror_r;function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }
  Module["_strerror"] = _strerror;
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }
  Module["_fputc"] = _fputc;
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }
  Module["_isspace"] = _isspace;
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x = event.pageX - (window.scrollX + rect.left);
          var y = event.pageY - (window.scrollY + rect.top);
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
  Module["Browser"] = Browser;
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
_llvm_eh_exception.buf = allocate(12, "void*", ALLOC_STATIC);
___buildEnvironment(ENV);
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var Math_min = Math.min;
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vif(index,a1,a2) {
  try {
    Module["dynCall_vif"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_i(index) {
  try {
    return Module["dynCall_i"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.__ZTIy|0;var n=env.__ZTIs|0;var o=env.__ZTIm|0;var p=env.__ZTIi|0;var q=env.__ZTIj|0;var r=env.__ZTIe|0;var s=env.__ZTIa|0;var t=env.__ZTIc|0;var u=env.__ZTIx|0;var v=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var w=env.___progname|0;var x=env.__ZTIl|0;var y=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var z=env.__ZTIf|0;var A=env.__ZTVN10__cxxabiv119__pointer_type_infoE|0;var B=env.__ZTIt|0;var C=env.__ZTIh|0;var D=env.__ZTId|0;var E=env._stderr|0;var F=+env.NaN;var G=+env.Infinity;var H=0;var I=0;var J=0;var K=0;var L=0,M=0,N=0,O=0,P=0.0,Q=0,R=0,S=0,T=0.0;var U=0;var V=0;var W=0;var X=0;var Y=0;var Z=0;var _=0;var $=0;var aa=0;var ab=0;var ac=global.Math.floor;var ad=global.Math.abs;var ae=global.Math.sqrt;var af=global.Math.pow;var ag=global.Math.cos;var ah=global.Math.sin;var ai=global.Math.tan;var aj=global.Math.acos;var ak=global.Math.asin;var al=global.Math.atan;var am=global.Math.atan2;var an=global.Math.exp;var ao=global.Math.log;var ap=global.Math.ceil;var aq=global.Math.imul;var ar=env.abort;var as=env.assert;var at=env.asmPrintInt;var au=env.asmPrintFloat;var av=env.min;var aw=env.invoke_viiiii;var ax=env.invoke_vif;var ay=env.invoke_i;var az=env.invoke_vi;var aA=env.invoke_vii;var aB=env.invoke_iiii;var aC=env.invoke_ii;var aD=env.invoke_viii;var aE=env.invoke_v;var aF=env.invoke_iiiii;var aG=env.invoke_viiiiii;var aH=env.invoke_iii;var aI=env.invoke_viiii;var aJ=env._strncmp;var aK=env._lseek;var aL=env._feof;var aM=env._sysconf;var aN=env.___cxa_free_exception;var aO=env.___cxa_throw;var aP=env._fread;var aQ=env._strerror;var aR=env._fwrite;var aS=env._abort;var aT=env._fprintf;var aU=env._llvm_eh_exception;var aV=env._toupper;var aW=env._close;var aX=env._pread;var aY=env._fflush;var aZ=env._fopen;var a_=env._open;var a$=env._strchr;var a0=env._fputc;var a1=env.___buildEnvironment;var a2=env._fabs;var a3=env._floor;var a4=env.___setErrNo;var a5=env.___assert_func;var a6=env._fseek;var a7=env._send;var a8=env._write;var a9=env._ftell;var ba=env._exit;var bb=env._strrchr;var bc=env._log10;var bd=env._sin;var be=env._printf;var bf=env._llvm_va_end;var bg=env.___cxa_pure_virtual;var bh=env._read;var bi=env._fclose;var bj=env.__reallyNegative;var bk=env._time;var bl=env.__formatString;var bm=env.___cxa_does_inherit;var bn=env._getenv;var bo=env.___cxa_guard_acquire;var bp=env.__ZSt9terminatev;var bq=env._vfprintf;var br=env.___cxa_find_matching_catch;var bs=env._recv;var bt=env.__ZSt18uncaught_exceptionv;var bu=env._cos;var bv=env._pwrite;var bw=env._llvm_pow_f64;var bx=env._fsync;var by=env._strerror_r;var bz=env.___cxa_allocate_exception;var bA=env.___cxa_begin_catch;var bB=env.___errno_location;var bC=env.___gxx_personality_v0;var bD=env._isspace;var bE=env.___cxa_call_unexpected;var bF=env.___cxa_is_number_type;var bG=env._sbrk;var bH=env._fmod;var bI=env.___cxa_guard_release;var bJ=env.__exit;var bK=env.___resumeException;var bL=env._strcmp;var bM=env.___cxa_end_catch;
// EMSCRIPTEN_START_FUNCS
function b_(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7>>3<<3;return b|0}function b$(){return i|0}function b0(a){a=a|0;i=a}function b1(a,b){a=a|0;b=b|0;if((H|0)==0){H=a;I=b}}function b2(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function b3(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function b4(a){a=a|0;U=a}function b5(a){a=a|0;V=a}function b6(a){a=a|0;W=a}function b7(a){a=a|0;X=a}function b8(a){a=a|0;Y=a}function b9(a){a=a|0;Z=a}function ca(a){a=a|0;_=a}function cb(a){a=a|0;$=a}function cc(a){a=a|0;aa=a}function cd(a){a=a|0;ab=a}function ce(){c[v+8>>2]=362;c[v+12>>2]=200;c[v+16>>2]=142;c[v+20>>2]=218;c[v+24>>2]=42;c[v+28>>2]=4;c[v+32>>2]=6;c[v+36>>2]=8;c[A+8>>2]=362;c[A+12>>2]=88;c[A+16>>2]=142;c[A+20>>2]=218;c[A+24>>2]=94;c[y+8>>2]=362;c[y+12>>2]=280;c[y+16>>2]=142;c[y+20>>2]=218;c[y+24>>2]=42;c[y+28>>2]=6;c[y+32>>2]=8;c[y+36>>2]=18;c[m>>2]=18968;c[m+4>>2]=22328;c[u>>2]=18968;c[u+4>>2]=22336;c[B>>2]=18968;c[B+4>>2]=22360;c[n>>2]=18968;c[n+4>>2]=22368;c[o>>2]=18968;c[o+4>>2]=22376;c[x>>2]=18968;c[x+4>>2]=22384;c[q>>2]=18968;c[q+4>>2]=22392;c[p>>2]=18968;c[p+4>>2]=22400;c[C>>2]=18968;c[C+4>>2]=22408;c[z>>2]=18968;c[z+4>>2]=22416;c[r>>2]=18968;c[r+4>>2]=22424;c[D>>2]=18968;c[D+4>>2]=22432;c[t>>2]=18968;c[t+4>>2]=22440;c[s>>2]=18968;c[s+4>>2]=22456;c[6030]=y+8;c[6032]=y+8;c[6034]=v+8;c[6038]=v+8;c[6042]=v+8;c[6046]=v+8;c[6050]=A+8;c[6053]=m;c[6054]=A+8;c[6057]=u;c[6058]=A+8;c[6062]=A+8;c[6066]=A+8;c[6069]=B;c[6070]=A+8;c[6073]=n;c[6074]=A+8;c[6077]=o;c[6078]=A+8;c[6081]=x;c[6082]=A+8;c[6085]=q;c[6086]=A+8;c[6089]=p;c[6090]=A+8;c[6093]=C;c[6094]=A+8;c[6097]=z;c[6098]=A+8;c[6101]=r;c[6102]=A+8;c[6105]=D;c[6106]=A+8;c[6109]=t;c[6110]=A+8;c[6114]=A+8;c[6117]=s;c[6118]=A+8;c[6121]=m;c[6122]=A+8;c[6125]=u;c[6126]=A+8;c[6130]=A+8;c[6134]=A+8;c[6137]=B;c[6138]=A+8;c[6141]=n;c[6142]=A+8;c[6145]=o;c[6146]=A+8;c[6149]=x;c[6150]=A+8;c[6153]=q;c[6154]=A+8;c[6157]=p;c[6158]=A+8;c[6161]=C;c[6162]=A+8;c[6165]=z;c[6166]=A+8;c[6169]=r;c[6170]=A+8;c[6173]=D;c[6174]=A+8;c[6177]=t;c[6178]=A+8;c[6182]=A+8;c[6185]=s;c[6186]=A+8;c[6190]=A+8;c[6194]=A+8;c[6198]=A+8;c[6202]=A+8;c[6206]=A+8;c[6210]=v+8;c[6214]=v+8;c[6218]=v+8;c[6222]=v+8;c[6226]=v+8;c[6230]=v+8;c[6234]=v+8;c[6238]=v+8;c[6242]=v+8;c[6246]=v+8;c[6250]=v+8;c[6260]=v+8;c[6264]=v+8;c[6268]=v+8;c[6272]=v+8;c[6276]=v+8;c[6280]=v+8;c[6284]=v+8;c[6288]=v+8;c[6292]=v+8;c[6296]=v+8;c[6300]=v+8;c[6304]=y+8;c[6306]=v+8;c[6310]=v+8;c[6314]=v+8;c[6326]=y+8;c[6336]=y+8;c[6346]=y+8;c[6356]=y+8;c[6374]=v+8;c[6378]=y+8;c[6388]=y+8;c[6390]=v+8;c[6394]=v+8;c[6398]=v+8;c[6402]=v+8;c[6406]=v+8;c[6410]=y+8;c[6412]=v+8;c[6416]=v+8;c[6420]=v+8;c[6432]=y+8;c[6434]=v+8;c[6438]=v+8;c[6442]=y+8;c[6444]=v+8}function cf(a){a=a|0;return(c[a+4>>2]|0)>>>16|0}function cg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=a;c[b+32>>2]=d;a=31;if((d|0)<=0){e=a;f=b+20|0;c[f>>2]=e;return}a=13;g=(d<<16|0)/(c[b+24>>2]|0)|0;do{d=g>>1;g=d;if((d|0)!=0){d=a-1|0;a=d;h=(d|0)!=0}else{h=0}}while(h);e=a;f=b+20|0;c[f>>2]=e;return}function ch(a,b){a=a|0;b=b|0;var d=0;d=a;a=aq(b,c[d>>2]|0)|0;return a+(c[d+4>>2]|0)|0}function ci(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;return}function cj(a,b){a=a|0;b=+b;c[a+8>>2]=~~(b*1073741824.0+.5);return}function ck(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;c[e+24>>2]=b;c[e+28>>2]=d;h[e+16>>3]=0.0;c[e+32>>2]=0;c[e>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;return}function cl(a){a=a|0;var b=0;b=a;if((c[b+12>>2]|0)==1){return}vk(c[b+8>>2]|0);return}function cm(a){a=a|0;var b=0;b=a;ct(b);c[b>>2]=0;c[b+8>>2]=b+44;c[b+12>>2]=1;wg(b+44|0,0,76);return}function cn(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;c[d+4>>2]=0;c[d+16>>2]=0;c[d+40>>2]=0;if((c[d+8>>2]|0)==0){return}if((b|0)!=0){e=c[d+12>>2]|0}else{e=cf(d)|0}wg(c[d+8>>2]|0,0,e+18<<2|0);return}function co(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;c[d+28>>2]=a;c[d>>2]=cv(d,a)|0;return}function cp(a,b){a=a|0;b=b|0;var d=0;d=a;a=(ch(d,b)|0)>>>16;return a-((c[d+4>>2]|0)>>>16)|0}function cq(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)==0){return}cx(b,d);a=(cf(b)|0)+18|0;wi(c[b+8>>2]|0,(c[b+8>>2]|0)+(d<<2)|0,a<<2|0);wg((c[b+8>>2]|0)+(a<<2)|0,0,d<<2|0);return}function cr(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0.0,i=0.0;e=b;b=d;d=a;f=144.0/+(b|0)+.85;i=+(c[d+12>>2]|0)*.5;if((c[d+16>>2]|0)!=0){f=i/+(c[d+16>>2]|0)}cs(e,b,64.0*f,+h[d>>3],+(c[d+8>>2]|0)*f/i);i=3.141592653589793/+(b-1|0);d=b;while(1){b=d;d=b-1|0;if((b|0)==0){break}f=.5400000214576721- +ag(+(+(d|0)*i))*.46000000834465027;b=e+(d<<2)|0;g[b>>2]=+g[b>>2]*f}return}function cs(a,b,c,d,e){a=a|0;b=b|0;c=+c;d=+d;e=+e;var f=0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0;f=a;a=b;h=d;d=e;if(d>=.999){d=.999}if(h<-300.0){h=-300.0}if(h>5.0){h=5.0}e=+af(10.0,+(1220703125.0e-14*h/(1.0-d)));h=+af(+e,+(4096.0-4096.0*d));i=.0003834951969714103/c;b=0;while(1){if((b|0)>=(a|0)){break}c=+((b-a<<1)+1|0)*i;j=c*4096.0;k=j*d;l=4096.0;if(k!=0.0){l=l*(+ah(+k)/k)}m=+ag(+c);n=e*(e-m-m)+1.0;if(n>1.0e-13){m=+ag(+(j-c))*e;o=(m- +ag(+j))*h;j=o- +ag(+(k-c))*e;l=l*d+(j+ +ag(+k))/n}g[f+(b<<2)>>2]=l;b=b+1|0}return}function ct(a){a=a|0;var b=0;b=a;c[b>>2]=2147483647;c[b+4>>2]=0;c[b+8>>2]=0;c[b+12>>2]=0;c[b+24>>2]=0;c[b+16>>2]=0;c[b+20>>2]=0;c[b+28>>2]=0;c[b+32>>2]=16;c[b+36>>2]=0;b=-2147483646;if((b>>1|0)!=-1073741823){a5(10608,45,15896,10584)}b=98304;if(((b&65535)<<16>>16|0)==-32768){return}else{a5(10608,49,15896,7344);return}}function cu(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;d=a;if((c[d+12>>2]|0)==1){a5(10608,83,15976,5168);return 0}a=65453;if((b|0)!=0){f=((aq(e,b+1|0)|0)+999|0)/1e3|0;if((f|0)>=(a|0)){a5(10608,95,15976,5168);return 0}a=f}do{if((c[d+12>>2]|0)!=(a|0)){f=vl(c[d+8>>2]|0,a+18<<2)|0;if((f|0)!=0){c[d+8>>2]=f;break}g=4080;h=g;return h|0}}while(0);c[d+12>>2]=a;if((c[d+12>>2]|0)==1){a5(10608,107,15976,3168);return 0}c[d+24>>2]=e;c[d+36>>2]=((a*1e3|0|0)/(e|0)|0)-1;if((b|0)!=0){if((c[d+36>>2]|0)!=(b|0)){a5(10608,113,15976,2544);return 0}}if((c[d+28>>2]|0)!=0){co(d,c[d+28>>2]|0)}cg(d,c[d+32>>2]|0);cn(d,1);g=0;h=g;return h|0}function cv(a,b){a=a|0;b=b|0;var d=0;d=a;a=~~+ac(+(+(c[d+24>>2]|0)/+(b|0)*65536.0+.5));do{if((a|0)<=0){if((c[d+24>>2]|0)==0){break}a5(10608,127,11376,1816);return 0}}while(0);d=a;return d|0}function cw(a,b){a=a|0;b=b|0;var d=0;d=a;a=aq(b,c[d>>2]|0)|0;b=d+4|0;c[b>>2]=(c[b>>2]|0)+a;a=cf(d)|0;if((a|0)<=(c[d+12>>2]|0)){return}else{a5(10608,147,15928,1184);return}}function cx(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(cf(b)|0)){a5(10608,152,16048,752)}a=b+4|0;c[a>>2]=(c[a>>2]|0)-(d<<16);return}function cy(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((c[b>>2]|0)==0){a5(10608,167,11448,5168);return 0}if((d|0)>(c[b+12>>2]|0)){d=c[b+12>>2]|0}return(((d<<16)-(c[b+4>>2]|0)+(c[b>>2]|0)-1|0)>>>0)/((c[b>>2]|0)>>>0)|0|0}function cz(a,b){a=a|0;b=b|0;return}function cA(a){a=a|0;return(c[a+28>>2]<<5)+1|0}function cB(a,b){a=a|0;b=+b;var d=0;d=a;h[d>>3]=b;c[d+8>>2]=0;c[d+12>>2]=44100;c[d+16>>2]=0;return}function cC(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;c[e+8>>2]=b;c[e+12>>2]=d;return 0}function cD(a){a=a|0;return a+144|0}function cE(a){a=a|0;var d=0,e=0,f=0,g=0,h=0;d=a;a=cA(d)|0;e=64;while(1){f=e;e=f-1|0;if((f|0)<32){break}f=62-e|0;g=c[d+32>>2]|0;h=1;while(1){if((h|0)>=(a|0)){break}g=g-(b[(c[d+24>>2]|0)+(h+e<<1)>>1]|0)|0;g=g-(b[(c[d+24>>2]|0)+(h+f<<1)>>1]|0)|0;h=h+64|0}if((e|0)==(f|0)){g=(g|0)/2|0}h=(c[d+24>>2]|0)+(a-64+e<<1)|0;b[h>>1]=(b[h>>1]|0)+((g&65535)<<16>>16)&65535}return}function cF(a,d){a=a|0;d=d|0;var e=0,f=0,j=0,k=0,l=0.0,m=0.0,n=0.0;e=i;i=i+2432|0;f=e|0;j=a;a=(c[j+28>>2]|0)-1<<5;cr(d,f+256|0,a);d=64;while(1){k=d;d=k-1|0;if((k|0)==0){break}g[f+(a+64+d<<2)>>2]=+g[f+(a+64-1-d<<2)>>2]}d=0;while(1){if((d|0)>=64){break}g[f+(d<<2)>>2]=0.0;d=d+1|0}l=0.0;d=0;while(1){if((d|0)>=(a|0)){break}l=l+ +g[f+(d+64<<2)>>2];d=d+1|0}m=16384.0/l;c[j+32>>2]=32768;l=0.0;n=0.0;a=cA(j)|0;d=0;while(1){if((d|0)>=(a|0)){break}k=~~+ac(+((n-l)*m+.5));b[(c[j+24>>2]|0)+(d<<1)>>1]=k;l=l+ +g[f+(d<<2)>>2];n=n+ +g[f+(d+64<<2)>>2];d=d+1|0}cE(j);n=+h[j+16>>3];if(n==0.0){i=e;return}h[j+16>>3]=0.0;cM(j,n);i=e;return}function cG(a,b){a=a|0;b=+b;cB(a,b);return}function cH(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;g=d;d=e;e=a;a=cf(e)|0;if((a|0)>(d|0)){a=d}if((a|0)==0){h=a;return h|0}d=c[e+20>>2]|0;i=c[e+8>>2]|0;j=c[e+16>>2]|0;if((f|0)!=0){f=a;while(1){if((f|0)==0){break}k=j>>14;if(((k&65535)<<16>>16|0)!=(k|0)){k=32767-(k>>24)|0}b[g>>1]=k&65535;g=g+4|0;k=i;i=k+4|0;j=j+((c[k>>2]|0)-(j>>d))|0;f=f-1|0}}else{f=a;while(1){if((f|0)==0){break}k=j>>14;if(((k&65535)<<16>>16|0)!=(k|0)){k=32767-(k>>24)|0}l=g;g=l+2|0;b[l>>1]=k&65535;k=i;i=k+4|0;j=j+((c[k>>2]|0)-(j>>d))|0;f=f-1|0}}c[e+16>>2]=j;cq(e,a);h=a;return h|0}function cI(a,b,c){a=a|0;b=b|0;c=c|0;return cC(a,b,c)|0}function cJ(a){a=a|0;var b=0;b=a;hO(b);c[b>>2]=22232;c[b+316>>2]=0;c[b+320>>2]=0;c[b+332>>2]=0;return}function cK(a){a=a|0;vk(a);return}function cL(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+24|0;e=d|0;f=b;b=a;cz(b,f);a=c[(c[b>>2]|0)+76>>2]|0;cG(e,+h[f>>3]);bR[a&127](b,e);if((c[b+316>>2]|0)==0){i=d;return}e=c[b+316>>2]|0;a=c[(c[e>>2]|0)+24>>2]|0;f=~~+h[(cD(b)|0)+8>>3];bR[a&127](e,f);i=d;return}function cM(a,d){a=a|0;d=+d;var e=0,f=0,g=0.0,j=0,k=0,l=0,m=0;e=i;i=i+24|0;f=e|0;g=d;j=a;if(g==+h[j+16>>3]){i=e;return}if((c[j+32>>2]|0)==0){cG(f,-8.0);cF(j,f)}h[j+16>>3]=g;d=g*1073741824.0/+(c[j+32>>2]|0);if(d>0.0){f=0;while(1){if(d>=2.0){break}f=f+1|0;d=d*2.0}if((f|0)!=0){a=j+32|0;c[a>>2]=c[a>>2]>>f;if((c[j+32>>2]|0)<=0){a5(10608,381,15856,10568)}a=(1<<f-1)+32768|0;k=32768>>f;l=cA(j)|0;while(1){m=l;l=m-1|0;if((m|0)==0){break}b[(c[j+24>>2]|0)+(l<<1)>>1]=((b[(c[j+24>>2]|0)+(l<<1)>>1]|0)+a>>f)-k&65535}cE(j)}}c[j+8>>2]=~~+ac(+(d+.5));i=e;return}function cN(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=d;d=e;e=a;if((c[e+12>>2]|0)==1){a5(10608,443,16088,5168)}a=(c[e+8>>2]|0)+((c[e+4>>2]|0)>>>16<<2)+32|0;e=0;while(1){g=d;d=g-1|0;if((g|0)==0){break}g=f;f=g+2|0;h=b[g>>1]<<14;g=a;c[g>>2]=(c[g>>2]|0)+(h-e);e=h;a=a+4|0}f=a;c[f>>2]=(c[f>>2]|0)-e;return}function cO(a){a=a|0;var b=0;b=a;cP(b);cK(b);return}function cP(a){a=a|0;var b=0,d=0;b=a;c[b>>2]=22232;a=c[b+320>>2]|0;if((a|0)==0){d=b;hQ(d);return}bQ[c[(c[a>>2]|0)+4>>2]&511](a);d=b;hQ(d);return}function cQ(a,b){a=a|0;b=b|0;return}function cR(a,b){a=a|0;b=b|0;return 0}function cS(a,b){a=a|0;b=b|0;return}function cT(a,b){a=a|0;b=b|0;return}function cU(a){a=a|0;return}function cV(a,b){a=a|0;b=b|0;return}function cW(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function cX(a){a=a|0;return 0}function cY(a){a=a|0;return}function cZ(a){a=a|0;return c[a+232>>2]|0}function c_(a){a=a|0;return c[a+4>>2]|0}function c$(a){a=a|0;return c[a+12>>2]|0}function c0(a){a=a|0;return c[a>>2]|0}function c1(a){a=a|0;var b=0;b=a;return(c[b>>2]|0)+(c[b+4>>2]|0)|0}function c2(a){a=a|0;return vi(a)|0}function c3(a){a=a|0;vk(a);return}function c4(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;c[b+324>>2]=d;a=c[b+316>>2]|0;bR[c[(c[a>>2]|0)+20>>2]&127](a,d);return}function c5(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=a;c4(d,b);b=c[d+316>>2]|0;a=c[(c[b>>2]|0)+8>>2]|0;e=cZ(d)|0;f=bY[a&127](b,e)|0;if((f|0)!=0){g=f;h=g;return h|0}hK(d,cD(d)|0);c[d+328>>2]=c_(c[d+316>>2]|0)|0;g=0;h=g;return h|0}function c6(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;a=cR(d,b)|0;if((a|0)!=0){e=a;f=e;return f|0}a=c[d+316>>2]|0;bQ[c[(c[a>>2]|0)+28>>2]&511](a);e=0;f=e;return f|0}function c7(a){a=a|0;var b=0;b=a;hU(b,c[b+236>>2]|0);return}function c8(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0;h=b;b=d;d=f;f=g;g=a;a=f-b|0;c[g+12>>2]=0;c[g+16>>2]=0;c[g+20>>2]=0;c9(g|0);i=h;c[g+8>>2]=bT[c[(c[i>>2]|0)+16>>2]&63](i)|0;if((c[g+8>>2]|0)<=(b|0)){j=c[74]|0;k=j;return k|0}i=da(g|0,a+(c[g+8>>2]|0)+f|0)|0;if((i|0)==0){l=h;h=c[(c[l>>2]|0)+12>>2]|0;m=(c0(g|0)|0)+a|0;i=bS[h&255](l,m,c[g+8>>2]|0)|0}if((i|0)!=0){c9(g|0);j=i;k=j;return k|0}else{i=g+8|0;c[i>>2]=(c[i>>2]|0)-b;i=e;e=dh(g|0,a)|0;a=b;wh(i|0,e|0,a)|0;wg(c0(g|0)|0,d&255|0,f|0);wg((c1(g|0)|0)+(-f|0)|0,d&255|0,f|0);j=0;k=j;return k|0}return 0}function c9(a){a=a|0;var b=0;b=a;a=c[b>>2]|0;c[b>>2]=0;c[b+4>>2]=0;vk(a);return}function da(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=vl(c[b>>2]|0,d)|0;do{if((a|0)==0){if((d|0)==0){break}e=10344;f=e;return f|0}}while(0);c[b>>2]=a;c[b+4>>2]=d;e=0;f=e;return f|0}function db(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=b;b=d;d=a;c[d+12>>2]=e-b-8;a=aq((e+(c[d+8>>2]|0)+b-1|0)/(b|0)|0,b)|0;if((a|0)<=0){a=0}else{b=0;f=a-1|0;while(1){if((f>>>(b>>>0)|0)==0){break}b=b+1|0}c[d+16>>2]=(1<<b)-1}if((e|0)<0){e=0}c[d+20>>2]=a;if((da(d|0,a-(c[d+12>>2]|0)+8|0)|0)==0){return}return}function dc(a){a=a|0;dt(a);return}function dd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=a;a=b+20|0;c[e>>2]=c[a>>2];c[e+4>>2]=c[a+4>>2];c[e+8>>2]=c[a+8>>2];return}function de(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=a;if((c[b+316>>2]|0)==0){do{if((c[b+320>>2]|0)==0){a=c2(172)|0;e=0;if((a|0)==0){f=0}else{e=1;e=a;hp(e);f=e}e=f;c[b+320>>2]=e;if((e|0)==0){g=10344;h=g;return h|0}else{break}}}while(0);c[b+316>>2]=c[b+320>>2]}f=c[b+316>>2]|0;g=bS[c[(c[f>>2]|0)+16>>2]&255](f,d,50)|0;h=g;return h|0}function df(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+16|0;e=d|0;f=b;b=a;cQ(b,f);a=cZ(b)|0;while(1){g=a;a=g-1|0;if((g|0)==0){break}if((f&1<<a|0)!=0){bN[c[(c[b>>2]|0)+72>>2]&31](b,a,0,0,0)}else{g=c[b+316>>2]|0;if((c[b+332>>2]|0)!=0){h=c[(c[b+332>>2]|0)+(a<<2)>>2]|0}else{h=0}bZ[c[(c[g>>2]|0)+12>>2]&63](e,g,a,h);do{if((c[e>>2]|0)!=0){if((c[e+4>>2]|0)==0){j=321;break}if((c[e+8>>2]|0)!=0){j=324}else{j=321}}else{j=321}}while(0);L362:do{if((j|0)==321){j=0;do{if((c[e>>2]|0)==0){if((c[e+4>>2]|0)!=0){break}if((c[e+8>>2]|0)==0){j=324;break L362}}}while(0);a5(10208,70,15752,7112)}}while(0);if((j|0)==324){j=0}bN[c[(c[b>>2]|0)+72>>2]&31](b,a,c[e>>2]|0,c[e+4>>2]|0,c[e+8>>2]|0)}}i=d;return}function dg(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+8|0;f=e|0;g=b;b=d;d=a;a=g;while(1){if((a|0)==0){h=343;break}j=c[d+316>>2]|0;a=a-(bS[c[(c[j>>2]|0)+36>>2]&255](j,b+(g-a<<1)|0,a)|0)|0;if((a|0)!=0){j=c[d+328>>2]|0;if((j|0)!=(c_(c[d+316>>2]|0)|0)){c[d+328>>2]=c_(c[d+316>>2]|0)|0;c7(d)}j=c$(c[d+316>>2]|0)|0;c[f>>2]=(aq(j,c[d+324>>2]|0)|0)/1e3|0;k=bS[c[(c[d>>2]|0)+80>>2]&255](d,f,j)|0;if((k|0)!=0){h=336;break}if((c[f>>2]|0)==0){a5(10208,114,15688,5104);return 0}j=c[d+316>>2]|0;bR[c[(c[j>>2]|0)+32>>2]&127](j,c[f>>2]|0)}}if((h|0)==336){l=k;m=l;i=e;return m|0}else if((h|0)==343){l=0;m=l;i=e;return m|0}return 0}function dh(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if(d>>>0>(c[b+4>>2]|0)>>>0){a5(4016,58,10984,3064);return 0}return(c[b>>2]|0)+d|0}function di(a){a=a|0;var b=0;b=a;dc(b);c3(b);return}function dj(a){a=a|0;return}function dk(a){a=a|0;return}function dl(a,b){a=a|0;b=b|0;return}function dm(a){a=a|0;c[a>>2]=22192;return}function dn(a){a=a|0;return c[a+8>>2]|0}function dp(a){a=a|0;return c[a+8>>2]|0}function dq(a){a=a|0;return c[a+12>>2]|0}function dr(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;if((d|0)>(c[b+8>>2]|0)){e=26104;f=e;return f|0}else{c[b+12>>2]=d;e=0;f=e;return f|0}return 0}function ds(a){a=a|0;return c[a+12>>2]|0}function dt(a){a=a|0;dj(a);return}function du(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=d;d=a;a=bS[c[(c[d>>2]|0)+8>>2]&255](d,b,e)|0;if((a|0)==(e|0)){f=0;g=f;return g|0}do{if((a|0)>=0){if((a|0)>=(e|0)){break}f=26104;g=f;return g|0}}while(0);f=7576;g=f;return g|0}function dv(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+512|0;e=d|0;f=b;b=a;while(1){if((f|0)==0){g=391;break}a=512;if((a|0)>(f|0)){a=f}f=f-a|0;h=bS[c[(c[b>>2]|0)+12>>2]&255](b,e|0,a)|0;if((h|0)!=0){g=388;break}}if((g|0)==388){j=h;k=j;i=d;return k|0}else if((g|0)==391){j=0;k=j;i=d;return k|0}return 0}function dw(a){a=a|0;var b=0;b=a;a=bT[c[(c[b>>2]|0)+24>>2]&63](b)|0;return a-(bT[c[(c[b>>2]|0)+28>>2]&63](b)|0)|0}function dx(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=d;d=a;if((e|0)>(c[d+8>>2]|0)){e=c[d+8>>2]|0}a=d+8|0;c[a>>2]=(c[a>>2]|0)-e;a=c[d+4>>2]|0;return bS[c[(c[a>>2]|0)+8>>2]&255](a,b,e)|0}function dy(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=a;dm(f);c[f>>2]=21424;c[f+4>>2]=b;c[f+8>>2]=(c[f+4>>2]|0)+d;c[f+12>>2]=e;return}function dz(a){a=a|0;var b=0,d=0;b=a;a=(c[b+8>>2]|0)-(c[b+4>>2]|0)|0;d=c[b+12>>2]|0;return a+(bT[c[(c[d>>2]|0)+16>>2]&63](d)|0)|0}function dA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=d;d=a;a=(c[d+8>>2]|0)-(c[d+4>>2]|0)|0;if((a|0)==0){f=a;return f|0}if((a|0)>(e|0)){a=e}e=c[d+4>>2]|0;g=d+4|0;c[g>>2]=(c[g>>2]|0)+a;g=b;b=e;e=a;wh(g|0,b|0,e)|0;f=a;return f|0}function dB(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;d=a;a=dA(d,e,b)|0;f=b-a|0;do{if((f|0)!=0){b=c[d+12>>2]|0;f=bS[c[(c[b>>2]|0)+8>>2]&255](b,e+a|0,f)|0;if((f|0)>0){break}g=f;h=g;return h|0}}while(0);g=a+f|0;h=g;return h|0}function dC(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;d=a;a=dA(d,e,b)|0;f=b-a|0;if((f|0)!=0){b=c[d+12>>2]|0;g=bS[c[(c[b>>2]|0)+12>>2]&255](b,e+a|0,f)|0;h=g;return h|0}else{g=0;h=g;return h|0}return 0}function dD(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;dE(e);c[e>>2]=21520;c[e+4>>2]=b;c[e+8>>2]=d;c[e+12>>2]=0;return}function dE(a){a=a|0;var b=0;b=a;dm(b);c[b>>2]=22136;return}function dF(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=d;d=a;a=d;f=bT[c[(c[a>>2]|0)+16>>2]&63](a)|0;if((e|0)>(f|0)){e=f}f=b;b=(c[d+4>>2]|0)+(c[d+12>>2]|0)|0;a=e;wh(f|0,b|0,a)|0;a=d+12|0;c[a>>2]=(c[a>>2]|0)+e;return e|0}function dG(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=a;dm(f);c[f>>2]=21576;c[f+4>>2]=b;c[f+8>>2]=e;c[f+12>>2]=d;return}function dH(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=d;d=a;if((e|0)>(c[d+12>>2]|0)){e=c[d+12>>2]|0}if((dI(d,b,e)|0)==0){f=e;return f|0}e=-1;f=e;return f|0}function dI(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=d;d=a;if((e|0)>(c[d+12>>2]|0)){f=26104;g=f;return g|0}else{f=bS[c[d+4>>2]&255](c[d+8>>2]|0,b,e)|0;g=f;return g|0}return 0}function dJ(a){a=a|0;var b=0;b=a;dE(b);c[b>>2]=21464;c[b+4>>2]=0;return}function dK(a){a=a|0;var b=0;b=a;dT(b);vQ(b);return}function dL(a){a=a|0;var b=0;b=a;if((c[b+4>>2]|0)==0){return}bi(c[b+4>>2]|0)|0;c[b+4>>2]=0;return}function dM(a){a=a|0;dk(a);return}function dN(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;c[d+4>>2]=aZ(b|0,4960)|0;if((c[d+4>>2]|0)!=0){e=0;f=e;return f|0}else{e=3856;f=e;return f|0}return 0}function dO(a){a=a|0;var b=0,d=0;b=a;a=bT[c[(c[b>>2]|0)+28>>2]&63](b)|0;a6(c[b+4>>2]|0,0,2)|0;d=bT[c[(c[b>>2]|0)+28>>2]&63](b)|0;a6(c[b+4>>2]|0,a|0,0)|0;return d|0}function dP(a,b,d){a=a|0;b=b|0;d=d|0;return aP(b|0,1,d|0,c[a+4>>2]|0)|0}function dQ(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;do{if((c[b+316>>2]|0)!=0){e=463}else{if((d|0)==0){e=463;break}}}while(0);if((e|0)==463){a5(2464,45,15800,1680)}c[b+316>>2]=d;return}function dR(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=b;b=a;if((d|0)<0){a5(9888,57,15640,6856);return 0}if((d|0)!=0){a=c[(c[b>>2]|0)+32>>2]|0;e=(bT[c[(c[b>>2]|0)+28>>2]&63](b)|0)+d|0;f=bY[a&127](b,e)|0;g=f;return g|0}else{f=0;g=f;return g|0}return 0}function dS(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=d;d=a;dm(d);c[d>>2]=21712;c[d+4>>2]=e;a=e;c[d+8>>2]=bT[c[(c[a>>2]|0)+16>>2]&63](a)|0;if((c[d+8>>2]|0)<=(b|0)){return}c[d+8>>2]=b;return}function dT(a){a=a|0;var b=0;b=a;c[b>>2]=21464;dL(b);dM(b);return}function dU(a){a=a|0;return c[a+4>>2]|0}function dV(a){a=a|0;return+(+h[a+40>>3])}function dW(a){a=a|0;return c[a+8>>2]|0}function dX(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=d;d=a;if((e|0)==(aP(b|0,1,e|0,c[d+4>>2]|0)|0)){f=0;g=f;return g|0}if((aL(c[d+4>>2]|0)|0)!=0){f=26104;g=f;return g|0}else{f=2952;g=f;return g|0}return 0}function dY(a){a=a|0;return a9(c[a+4>>2]|0)|0}function dZ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;if((a6(c[b+4>>2]|0,d|0,0)|0)==0){e=0;f=e;return f|0}if((d|0)>(bT[c[(c[b>>2]|0)+24>>2]&63](b)|0)){e=26104;f=e;return f|0}else{e=2224;f=e;return f|0}return 0}function d_(a){a=a|0;dk(a);return}function d$(a){a=a|0;var b=0;b=a;d_(b);vQ(b);return}function d0(a){a=a|0;dM(a);return}function d1(a){a=a|0;var b=0;b=a;d0(b);vQ(b);return}function d2(a){a=a|0;ed(a);return}function d3(a){a=a|0;var b=0;b=a;d2(b);vQ(b);return}function d4(a){a=a|0;ec(a);return}function d5(a){a=a|0;var b=0;b=a;d4(b);vQ(b);return}function d6(a){a=a|0;eb(a);return}function d7(a){a=a|0;var b=0;b=a;d6(b);vQ(b);return}function d8(a){a=a|0;ea(a);return}function d9(a){a=a|0;var b=0;b=a;d8(b);vQ(b);return}function ea(a){a=a|0;dk(a);return}function eb(a){a=a|0;dM(a);return}function ec(a){a=a|0;dk(a);return}function ed(a){a=a|0;dk(a);return}function ee(a){a=a|0;ex(a);return}function ef(a){a=a|0;eE(a);return}function eg(a){a=a|0;eD(a);return}function eh(a){a=a|0;var b=0;b=a;ep(b);vQ(b);return}function ei(a){a=a|0;eF(a);return}function ej(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=ek(b+4|0,d+(d>>2)<<1)|0;if((a|0)!=0){e=a;f=e;return f|0}el(b,d);c[b+24>>2]=(c[b+16>>2]|0)+(c[b+16>>2]>>2);e=e6(b+32|0,c[b+24>>2]|0)|0;f=e;return f|0}function ek(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=vl(c[b>>2]|0,d<<1)|0;do{if((a|0)==0){if((d|0)==0){break}e=3768;f=e;return f|0}}while(0);c[b>>2]=a;c[b+4>>2]=d;e=0;f=e;return f|0}function el(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=d<<1;if((c[b+12>>2]|0)==(a|0)){return}if(a>>>0>(dU(b+4|0)|0)>>>0){return}else{c[b+12>>2]=a;c[b+16>>2]=(~~(+(d|0)*+dV(b+32|0))<<1)+2;em(b);return}}function em(a){a=a|0;var b=0;b=a;c[b+20>>2]=c[b+12>>2];e5(b+32|0);return}function en(a){a=a|0;var b=0;b=a;a=c[b+8>>2]|0;return(a-(eH(b|0,c[b+24>>2]|0)|0)|0)/2|0|0}function eo(a){a=a|0;var b=0;b=a;c[b>>2]=21680;ee(b+4|0);c[b+12>>2]=0;c[b+16>>2]=-1;c[b+20>>2]=-1;c[b+24>>2]=0;ef(b+32|0);return}function ep(a){a=a|0;var b=0;b=a;c[b>>2]=21680;ei(b+32|0);eg(b+4|0);return}function eq(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=b;b=d;d=a;a=c[d+12>>2]>>1;f=cy(e,a)|0;g=c[d+16>>2]|0;h=g-(en(d+32|0)|0)|0;g=c[(c[d>>2]|0)+8>>2]|0;i=dW(d+32|0)|0;j=bW[g&15](d,f,h,i)|0;if((j|0)>=(c[d+24>>2]|0)){a5(5720,65,14840,9616)}cw(e,f);if((cf(e)|0)!=(a|0)){a5(5720,68,14840,6608)}er(d+32|0,j);j=es(d+4|0)|0;f=eA(d+32|0,j,c[d+12>>2]|0)|0;if((f|0)==(c[d+12>>2]|0)){k=e;l=b;eB(d,k,l);m=e;n=a;cq(m,n);return}else{a5(5720,73,14840,4808);k=e;l=b;eB(d,k,l);m=e;n=a;cq(m,n);return}}function er(a,b){a=a|0;b=b|0;var d=0;d=a;a=d+8|0;c[a>>2]=(c[a>>2]|0)+(b<<1);b=c[d+8>>2]|0;if(b>>>0<=(ey(d|0)|0)>>>0){return}else{a5(1448,96,14728,984);return}}function es(a){a=a|0;return c[a>>2]|0}function et(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;c[b>>2]=c[d+8>>2];c[b+4>>2]=c[d+16>>2];return c[d+20>>2]|0}function eu(a){a=a|0;return c[a+4>>2]>>14|0}function ev(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;a=d|0;e=c[a>>2]|0;c[a>>2]=e+4;a=d+4|0;c[a>>2]=(c[a>>2]|0)+((c[e>>2]|0)-(c[d+4>>2]>>b));return}function ew(a,b){a=a|0;b=b|0;c[b+16>>2]=c[a+4>>2];return}function ex(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;return}function ey(a){a=a|0;var b=0;b=a;return(c[b>>2]|0)+(c[b+4>>2]<<1)|0}function ez(b){b=b|0;var c=0;c=b;h[c>>3]=-.15000000596046448;h[c+8>>3]=.15000000596046448;h[c+32>>3]=88.0;h[c+48>>3]=.11999999731779099;h[c+16>>3]=61.0;h[c+24>>3]=.10000000149011612;h[c+40>>3]=18.0;a[c+56|0]=0;return}function eA(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=d;d=e;e=a;a=f;g=es(e|0)|0;h=c[e+8>>2]|0;i=(c[e+28>>2]|0)>>>((c[e+16>>2]|0)>>>0);j=e+52+((c[e+16>>2]|0)*24|0)|0;k=(c[e+12>>2]|0)-(c[e+16>>2]|0)|0;l=c[e+32>>2]|0;d=d>>1;if(((h-g|0)/2|0|0)>=24){h=h-48|0;do{d=d-1|0;m=0;n=0;o=g;if((d|0)<0){p=620;break}p=6;while(1){if((p|0)==0){break}q=b[j>>1]|0;m=m+(aq(q,b[o>>1]|0)|0)|0;n=n+(aq(q,b[o+2>>1]|0)|0)|0;q=b[j+2>>1]|0;j=j+4|0;m=m+(aq(q,b[o+4>>1]|0)|0)|0;n=n+(aq(q,b[o+6>>1]|0)|0)|0;o=o+8|0;p=p-1|0}k=k-1|0;m=m>>15;n=n>>15;g=g+((i<<1&2)<<1)|0;i=i>>>1;g=g+(l<<1)|0;if((k|0)==0){j=e+52|0;i=c[e+28>>2]|0;k=c[e+12>>2]|0}b[a>>1]=m&65535;b[a+2>>1]=n&65535;a=a+4|0;}while(g>>>0<=h>>>0)}c[e+16>>2]=(c[e+12>>2]|0)-k;k=((c[e+8>>2]|0)-g|0)/2|0;c[e+8>>2]=eH(e|0,k)|0;wi(es(e|0)|0,g|0,k<<1|0);return(a-f|0)/2|0|0}function eB(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+8|0;g=f|0;h=d;d=e;e=a;a=et(g,h)|0;j=es(e+4|0)|0;k=c[e+12>>2]>>1;while(1){e=k;k=e-1|0;if((e|0)==0){break}e=eu(g)|0;l=(b[j>>1]<<1)+e|0;if(((l&65535)<<16>>16|0)!=(l|0)){l=32767-(l>>24)|0}ev(g,a);m=(b[j+2>>1]<<1)+e|0;if(((m&65535)<<16>>16|0)!=(m|0)){m=32767-(m>>24)|0}j=j+4|0;b[d>>1]=l&65535;b[d+2>>1]=m&65535;d=d+4|0}ew(g,h);i=f;return}function eC(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b;b=d;d=e;e=a;a=(c[e+12>>2]|0)-(c[e+20>>2]|0)|0;if((a|0)!=0){if((a|0)>(f|0)){a=f}f=f-a|0;g=b;h=eH(e+4|0,c[e+20>>2]|0)|0;i=a<<1;wh(g|0,h|0,i)|0;b=b+(a<<1)|0;i=e+20|0;c[i>>2]=(c[i>>2]|0)+a}while(1){if((f|0)<(c[e+12>>2]|0)){break}eq(e,d,b);b=b+(c[e+12>>2]<<1)|0;f=f-(c[e+12>>2]|0)|0}if((f|0)==0){return}eq(e,d,es(e+4|0)|0);c[e+20>>2]=f;d=b;a=es(e+4|0)|0;e=f<<1;wh(d|0,a|0,e)|0;b=b+(f<<1)|0;return}function eD(a){a=a|0;vk(c[a>>2]|0);return}function eE(a){a=a|0;var b=0;b=a;e3(b,12,b+52|0);return}function eF(a){a=a|0;e4(a);return}function eG(b,d){b=b|0;d=+d;var e=0,f=0,g=0.0,j=0;e=i;i=i+64|0;f=e|0;g=d;j=b;d=g;ez(f);h[f>>3]=-.6000000238418579*d;h[f+8>>3]=.6000000238418579*d;h[f+32>>3]=88.0;h[f+16>>3]=61.0;if(d>.5){d=.5}h[f+48>>3]=.5*d;h[f+24>>3]=.30000001192092896*d;h[f+40>>3]=18.0;a[f+56|0]=g>0.0|0;bR[c[(c[j>>2]|0)+44>>2]&127](j,f);i=e;return}function eH(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if(d>>>0>(c[b+4>>2]|0)>>>0){a5(2824,58,10920,2176);return 0}return(c[b>>2]|0)+(d<<1)|0}function eI(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=d&1;d=b;g$(d,2);c[d>>2]=21616;b=d+20|0;f=b+308|0;g=b;do{ct(g);g=g+44|0;}while((g|0)!=(f|0));ez(d+368|0);ee(d+448|0);ee(d+456|0);c[d+440>>2]=e&1?3:7;c[d+468>>2]=0;c[d+464>>2]=0;c[d+432>>2]=0;c[d+436>>2]=0;a[d+444|0]=0;eG(d,0.0);return}function eJ(a){a=a|0;var b=0;b=a;eZ(b);c3(b);return}function eK(a){a=a|0;return 8}function eL(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=a;a=b;b=c;do{if((d|0)<(b|0)){e=b}else{if((d|0)>(a|0)){e=a;break}else{e=d;break}}}while(0);return e|0}function eM(a){a=a|0;return c[a+24>>2]|0}function eN(a){a=a|0;return c[a+36>>2]|0}function eO(a){a=a|0;var b=0;b=a+4|0;c[b>>2]=(c[b>>2]|0)+1;return}function eP(a){a=a|0;return c[a+8>>2]|0}function eQ(a){a=a|0;var b=0;b=a;a=c[b+40>>2]|0;c[b+40>>2]=0;return a|0}function eR(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b;b=d;d=a;do{if((dU(d+456|0)|0)==0){a=ek(d+456|0,4096)|0;if((a|0)!=0){f=a;g=f;return g|0}else{break}}}while(0);do{if((dU(d+448|0)|0)==0){a=ek(d+448|0,16384)|0;if((a|0)!=0){f=a;g=f;return g|0}else{break}}}while(0);a=0;while(1){if((a|0)>=(c[d+440>>2]|0)){h=721;break}i=cu(d+20+(a*44|0)|0,e,b)|0;if((i|0)!=0){h=717;break}a=a+1|0}if((h|0)==721){bR[c[(c[d>>2]|0)+44>>2]&127](d,d+368|0);bQ[c[(c[d>>2]|0)+28>>2]&511](d);a=eM(d+20|0)|0;f=cC(d,a,eN(d+20|0)|0)|0;g=f;return g|0}else if((h|0)==717){f=i;g=f;return g|0}return 0}function eS(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=0;while(1){if((a|0)>=(c[b+440>>2]|0)){break}co(b+20+(a*44|0)|0,d);a=a+1|0}return}function eT(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=0;while(1){if((a|0)>=(c[b+440>>2]|0)){break}cg(b+20+(a*44|0)|0,d);a=a+1|0}return}function eU(a){a=a|0;var b=0;b=a;c[b+432>>2]=0;c[b+436>>2]=0;if((dU(b+456|0)|0)!=0){wg(eH(b+456|0,0)|0,0,8192)}if((dU(b+448|0)|0)!=0){wg(eH(b+448|0,0)|0,0,32768)}a=0;while(1){if((a|0)>=(c[b+440>>2]|0)){break}cn(b+20+(a*44|0)|0,1);a=a+1|0}return}function eV(b,d){b=b|0;d=d|0;var e=0,f=0,g=0.0;e=d;d=b;eO(d);do{if(!(a[d+424|0]&1)){if(!(a[e+56|0]&1)){break}if((dU(d+456|0)|0)==0){break}wg(eH(d+456|0,0)|0,0,8192);wg(eH(d+448|0,0)|0,0,32768)}}while(0);b=d+368|0;f=e;c[b>>2]=c[f>>2];c[b+4>>2]=c[f+4>>2];c[b+8>>2]=c[f+8>>2];c[b+12>>2]=c[f+12>>2];c[b+16>>2]=c[f+16>>2];c[b+20>>2]=c[f+20>>2];c[b+24>>2]=c[f+24>>2];c[b+28>>2]=c[f+28>>2];c[b+32>>2]=c[f+32>>2];c[b+36>>2]=c[f+36>>2];c[b+40>>2]=c[f+40>>2];c[b+44>>2]=c[f+44>>2];c[b+48>>2]=c[f+48>>2];c[b+52>>2]=c[f+52>>2];a[b+56|0]=a[f+56|0]|0;if(a[d+424|0]&1){c[d+472>>2]=32768-~~(+h[d+368>>3]*32768.0+.5);c[d+476>>2]=65536-(c[d+472>>2]|0);c[d+480>>2]=32768-~~(+h[d+376>>3]*32768.0+.5);c[d+484>>2]=65536-(c[d+480>>2]|0);c[d+508>>2]=~~(+h[d+416>>3]*32768.0+.5);c[d+496>>2]=~~(+h[d+392>>3]*32768.0+.5);g=+h[d+408>>3]*5.0e-4;f=~~(g*+(eP(d)|0));g=+h[d+400>>3]*.001;b=~~(g*+(eP(d)|0));c[d+500>>2]=eL(16384-(b-f<<1)|0,16382,0)|0;c[d+504>>2]=eL(16385-(b+f<<1)|0,16383,1)|0;g=+h[d+384>>3]*.001;b=~~(g*+(eP(d)|0));c[d+488>>2]=eL(4095-(b-f)|0,4095,0)|0;c[d+492>>2]=eL(4095-(b+f)|0,4095,0)|0;c[d+328>>2]=d+20;c[d+332>>2]=d+152;c[d+336>>2]=d+196;c[d+340>>2]=d+64;c[d+344>>2]=d+152;c[d+348>>2]=d+196;c[d+352>>2]=d+108;c[d+356>>2]=d+240;c[d+360>>2]=d+284}else{f=0;while(1){if(f>>>0>=3){break}b=d+328+(f*12|0)|0;c[b>>2]=d+20;c[b+4>>2]=d+64;c[b+8>>2]=d+108;f=f+1|0}}if((c[d+440>>2]|0)>=7){return}f=0;while(1){if((f|0)>=3){break}b=d+328+(f*12|0)|0;c[b+4>>2]=c[b>>2];c[b+8>>2]=c[b>>2];f=f+1|0}return}function eW(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;b=2;if((d|0)!=0){do{if((d&512|0)==0){if(((d&255|0)%3|0|0)==0){break}b=d&1}}while(0)}else{b=(f|0)%5|0;if((b|0)>2){b=2}}f=a;a=e+328+(b*12|0)|0;c[f>>2]=c[a>>2];c[f+4>>2]=c[a+4>>2];c[f+8>>2]=c[a+8>>2];return}function eX(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=d;d=b;b=0;f=0;while(1){if((f|0)>=(c[d+440>>2]|0)){break}b=b|(eQ(d+20+(f*44|0)|0)|0)<<f;cw(d+20+(f*44|0)|0,e);f=f+1|0}do{if((b&(a[d+424|0]&1?120:6)|0)!=0){if((c[d+440>>2]|0)!=7){break}f=cf(d+20|0)|0;c[d+432>>2]=f+(eK(d+20|0)|0)}}while(0);do{if(!(a[d+444|0]&1)){if(a[d+424|0]&1){break}g=d+368|0;h=g+56|0;i=a[h]|0;j=i&1;k=d+444|0;l=j&1;a[k]=l;return}}while(0);b=cf(d+20|0)|0;c[d+436>>2]=b+(eK(d+20|0)|0);g=d+368|0;h=g+56|0;i=a[h]|0;j=i&1;k=d+444|0;l=j&1;a[k]=l;return}function eY(a){a=a|0;return(cf(a+20|0)|0)<<1|0}function eZ(a){a=a|0;var b=0,d=0;b=a;c[b>>2]=21616;eg(b+456|0);eg(b+448|0);a=b+20|0;d=a+308|0;do{d=d-44|0;cl(d);}while((d|0)!=(a|0));dj(b);return}function e_(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=e;e=a;a=d;d=c[e+128>>2]|0;g=c[e+116>>2]|0;h=c[e+124>>2]|0;i=c[e+160>>2]|0;j=c[e+168>>2]|0;k=c[e+204>>2]|0;l=c[e+212>>2]|0;m=c[e+248>>2]|0;n=c[e+256>>2]|0;o=c[e+292>>2]|0;p=c[e+300>>2]|0;q=c[e+28>>2]|0;r=c[e+36>>2]|0;s=c[e+72>>2]|0;t=c[e+80>>2]|0;u=es(e+448|0)|0;v=es(e+456|0)|0;w=c[e+468>>2]|0;x=c[e+464>>2]|0;while(1){y=f;f=y-1|0;if((y|0)==0){break}y=r>>14;z=t>>14;A=q;q=A+4|0;r=r+((c[A>>2]|0)-(r>>d))|0;A=s;s=A+4|0;t=t+((c[A>>2]|0)-(t>>d))|0;A=(aq(y,c[e+472>>2]|0)|0)>>15;B=A+((aq(z,c[e+480>>2]|0)|0)>>15)+(j>>14)|0;A=B+(b[u+((x+(c[e+500>>2]|0)&16383)<<1)>>1]|0)|0;B=(aq(y,c[e+476>>2]|0)|0)>>15;y=B+((aq(z,c[e+484>>2]|0)|0)>>15)+(l>>14)|0;z=y+(b[u+((x+(c[e+504>>2]|0)&16383)<<1)>>1]|0)|0;y=i;i=y+4|0;j=j+((c[y>>2]|0)-(j>>d))|0;y=k;k=y+4|0;l=l+((c[y>>2]|0)-(l>>d))|0;y=c[e+508>>2]|0;b[u+(x<<1)>>1]=(aq(A,y)|0)>>15&65535;b[u+(x+1<<1)>>1]=(aq(z,y)|0)>>15&65535;x=x+2&16383;y=h>>14;B=g;g=B+4|0;h=h+((c[B>>2]|0)-(h>>d))|0;B=A+y+(n>>14)+((aq(c[e+496>>2]|0,b[v+((w+(c[e+488>>2]|0)&4095)<<1)>>1]|0)|0)>>15)|0;A=z+y+(p>>14)+((aq(c[e+496>>2]|0,b[v+((w+(c[e+492>>2]|0)&4095)<<1)>>1]|0)|0)>>15)|0;z=m;m=z+4|0;n=n+((c[z>>2]|0)-(n>>d))|0;z=o;o=z+4|0;p=p+((c[z>>2]|0)-(p>>d))|0;b[v+(w<<1)>>1]=y&65535;w=w+1&4095;if(((B&65535)<<16>>16|0)!=(B|0)){B=32767-(B>>24)|0}b[a>>1]=B&65535;b[a+2>>1]=A&65535;a=a+4|0;if(((A&65535)<<16>>16|0)!=(A|0)){b[a-2>>1]=32767-(A>>24)&65535}}c[e+464>>2]=x;c[e+468>>2]=w;c[e+168>>2]=j;c[e+212>>2]=l;c[e+256>>2]=n;c[e+300>>2]=p;c[e+36>>2]=r;c[e+80>>2]=t;c[e+124>>2]=h;return}function e$(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;d=a;if(((b|0)%2|0|0)!=0){a5(4472,251,14768,9296);return 0}a=cf(d+20|0)|0;if((a|0)>(b>>1|0)){a=b>>1}b=a;while(1){if((a|0)==0){break}f=c[d+440>>2]|0;g=a;if((c[d+436>>2]|0)!=0){if((g|0)>(c[d+436>>2]|0)){g=c[d+436>>2]|0}if((c[d+432>>2]|0)!=0){e_(d,e,g)}else{e2(d,e,g);f=3}}else{if((c[d+432>>2]|0)!=0){e0(d,e,g);f=3}else{e1(d,e,g);f=1}}e=e+(g<<1<<1)|0;a=a-g|0;h=d+432|0;c[h>>2]=(c[h>>2]|0)-g;if((c[d+432>>2]|0)<0){c[d+432>>2]=0}h=d+436|0;c[h>>2]=(c[h>>2]|0)-g;if((c[d+436>>2]|0)<0){c[d+436>>2]=0}h=0;while(1){if((h|0)>=(c[d+440>>2]|0)){break}if((h|0)<(f|0)){cq(d+20+(h*44|0)|0,g)}else{cx(d+20+(h*44|0)|0,g)}h=h+1|0}}return b<<1|0}function e0(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;f=e;e=a;a=d;d=c[e+40>>2]|0;g=c[e+28>>2]|0;h=c[e+36>>2]|0;i=c[e+72>>2]|0;j=c[e+80>>2]|0;k=c[e+116>>2]|0;l=c[e+124>>2]|0;while(1){m=f;f=m-1|0;if((m|0)==0){break}m=h>>14;n=g;g=n+4|0;h=h+((c[n>>2]|0)-(h>>d))|0;n=m+(j>>14)|0;o=m+(l>>14)|0;m=i;i=m+4|0;j=j+((c[m>>2]|0)-(j>>d))|0;m=k;k=m+4|0;l=l+((c[m>>2]|0)-(l>>d))|0;if(((n&65535)<<16>>16|0)!=(n|0)){n=32767-(n>>24)|0}b[a>>1]=n&65535;b[a+2>>1]=o&65535;a=a+4|0;if(((o&65535)<<16>>16|0)!=(o|0)){b[a-2>>1]=32767-(o>>24)&65535}}c[e+124>>2]=l;c[e+80>>2]=j;c[e+36>>2]=h;return}function e1(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=e;e=a;a=d;d=c[e+40>>2]|0;g=c[e+28>>2]|0;h=c[e+36>>2]|0;i=f>>1;while(1){if((i|0)==0){break}j=h>>14;k=g;g=k+4|0;h=h+((c[k>>2]|0)-(h>>d))|0;k=h>>14;l=g;g=l+4|0;h=h+((c[l>>2]|0)-(h>>d))|0;if(((j&65535)<<16>>16|0)!=(j|0)){j=32767-(j>>24)|0}c[a>>2]=j&65535|j<<16;if(((k&65535)<<16>>16|0)!=(k|0)){k=32767-(k>>24)|0}c[a+4>>2]=k&65535|k<<16;a=a+8|0;i=i-1|0}if((f&1|0)==0){m=h;n=e+20|0;o=n|0;p=o+16|0;c[p>>2]=m;return}f=h>>14;i=g;g=i+4|0;h=h+((c[i>>2]|0)-(h>>d))|0;b[a>>1]=f&65535;b[a+2>>1]=f&65535;if(((f&65535)<<16>>16|0)!=(f|0)){f=32767-(f>>24)|0;b[a>>1]=f&65535;b[a+2>>1]=f&65535}m=h;n=e+20|0;o=n|0;p=o+16|0;c[p>>2]=m;return}function e2(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;f=e;e=a;a=d;d=c[e+128>>2]|0;g=c[e+116>>2]|0;h=c[e+124>>2]|0;i=c[e+28>>2]|0;j=c[e+36>>2]|0;k=c[e+72>>2]|0;l=c[e+80>>2]|0;m=es(e+448|0)|0;n=es(e+456|0)|0;o=c[e+468>>2]|0;p=c[e+464>>2]|0;while(1){q=f;f=q-1|0;if((q|0)==0){break}q=j>>14;r=l>>14;s=i;i=s+4|0;j=j+((c[s>>2]|0)-(j>>d))|0;s=k;k=s+4|0;l=l+((c[s>>2]|0)-(l>>d))|0;s=(aq(q,c[e+472>>2]|0)|0)>>15;t=s+((aq(r,c[e+480>>2]|0)|0)>>15)|0;s=t+(b[m+((p+(c[e+500>>2]|0)&16383)<<1)>>1]|0)|0;t=(aq(q,c[e+476>>2]|0)|0)>>15;q=t+((aq(r,c[e+484>>2]|0)|0)>>15)|0;r=q+(b[m+((p+(c[e+504>>2]|0)&16383)<<1)>>1]|0)|0;q=c[e+508>>2]|0;b[m+(p<<1)>>1]=(aq(s,q)|0)>>15&65535;b[m+(p+1<<1)>>1]=(aq(r,q)|0)>>15&65535;p=p+2&16383;q=h>>14;t=g;g=t+4|0;h=h+((c[t>>2]|0)-(h>>d))|0;t=s+q+((aq(c[e+496>>2]|0,b[n+((o+(c[e+488>>2]|0)&4095)<<1)>>1]|0)|0)>>15)|0;s=r+q+((aq(c[e+496>>2]|0,b[n+((o+(c[e+492>>2]|0)&4095)<<1)>>1]|0)|0)>>15)|0;b[n+(o<<1)>>1]=q&65535;o=o+1&4095;if(((t&65535)<<16>>16|0)!=(t|0)){t=32767-(t>>24)|0}b[a>>1]=t&65535;b[a+2>>1]=s&65535;a=a+4|0;if(((s&65535)<<16>>16|0)!=(s|0)){b[a-2>>1]=32767-(s>>24)&65535}}c[e+464>>2]=p;c[e+468>>2]=o;c[e+36>>2]=j;c[e+80>>2]=l;c[e+124>>2]=h;return}function e3(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=a;ee(b|0);c[b+20>>2]=e;c[b+24>>2]=(e<<1)-2;c[b+48>>2]=d;c[b+8>>2]=0;c[b+12>>2]=1;c[b+16>>2]=0;c[b+28>>2]=0;c[b+32>>2]=2;h[b+40>>3]=1.0;return}function e4(a){a=a|0;eg(a|0);return}function e5(a){a=a|0;var b=0;b=a;c[b+16>>2]=0;if((dU(b|0)|0)==0){return}c[b+8>>2]=eH(b|0,c[b+24>>2]|0)|0;a=es(b|0)|0;wg(a|0,0,c[b+24>>2]<<1|0);return}function e6(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;a=ek(d|0,b+(c[d+24>>2]|0)|0)|0;if((a|0)!=0){e=a;f=e;return f|0}e5(d);e=0;f=e;return f|0}function e7(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=b;b=a;a=(d|0)/(c[b+36>>2]|0)|0;e=(aq(a,c[b+12>>2]|0)|0)<<1;d=d-(aq(a,c[b+36>>2]|0)|0)|0;a=(c[b+28>>2]|0)>>>((c[b+16>>2]|0)>>>0);f=(c[b+12>>2]|0)-(c[b+16>>2]|0)|0;while(1){if((d|0)<0){break}d=d-((c[b+32>>2]|0)+((a&1)<<1))|0;a=a>>>1;g=f-1|0;f=g;if((g|0)==0){a=c[b+28>>2]|0;f=c[b+12>>2]|0}e=e+2|0}return e|0}function e8(a){a=a|0;var b=0;b=a;return(d[b|0]|0)<<24|(d[b+1|0]|0)<<16|(d[b+2|0]|0)<<8|(d[b+3|0]|0)|0}function e9(a,b,d,e){a=a|0;b=+b;d=+d;e=+e;var f=0.0,g=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0,n=0,o=0;f=d;d=e;g=a;h[g+40>>3]=b;b=0.0;e=2.0;i=0.0;c[g+12>>2]=-1;a=1;while(1){if((a|0)>32){break}i=i+ +h[g+40>>3];j=+ac(+(i+.5));k=+ad(+(i-j));if(k<e){c[g+12>>2]=a;b=j/+(c[g+12>>2]|0);e=k}a=a+1|0}c[g+28>>2]=0;c[g+32>>2]=~~+ac(+b)<<1;h[g+40>>3]=b;b=+bH(+b,1.0);if(+h[g+40>>3]<1.0){l=1.0}else{l=1.0/+h[g+40>>3]}e=l;l=0.0;c[g+36>>2]=0;a=0;while(1){if((a|0)>=(c[g+12>>2]|0)){break}m=~~(+(c[g+20>>2]|0)*e+1.0)&-2;n=c[g+20>>2]|0;o=c[g+48>>2]|0;fa(f,m,l,e,32767.0*d*e,n,o+((aq(a,c[g+20>>2]|0)|0)<<1)|0);l=l+b;o=g+36|0;c[o>>2]=(c[o>>2]|0)+(c[g+32>>2]|0);if(l>=.9999999){l=l-1.0;o=g+28|0;c[o>>2]=c[o>>2]|1<<a;o=g+36|0;c[o>>2]=(c[o>>2]|0)+1}a=a+1|0}e5(g);return+(+h[g+40>>3])}function fa(a,c,d,e,f,g,h){a=+a;c=c|0;d=+d;e=+e;f=+f;g=g|0;h=h|0;var i=0.0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0;i=a;a=f;j=g;g=h;f=.01227184630308513*e;e=512.0/+(c|0);k=+af(+i,256.0);a=a/512.0;l=(+(((j|0)/2|0)-1|0)+d)*(-0.0-f);while(1){c=j;j=c-1|0;if((c|0)==0){break}c=g;g=c+2|0;b[c>>1]=0;d=l*e;if(+ad(+d)<3.141592653589793){m=i*+ag(+l);n=1.0-m-k*+ag(+(256.0*l));o=a*(n+k*i*+ag(+(255.0*l)))/(1.0-m-m+i*i)-a;b[g-2>>1]=~~(+ag(+d)*o+o)}l=l+f}return}function fb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=a;a=0;e=(c[b+28>>2]|0)>>>((c[b+16>>2]|0)>>>0);f=(c[b+12>>2]|0)-(c[b+16>>2]|0)|0;while(1){g=d-2|0;d=g;if((g|0)<=0){break}a=a+((c[b+32>>2]|0)+((e&1)<<1))|0;e=e>>>1;g=f-1|0;f=g;if((g|0)==0){e=c[b+28>>2]|0;f=c[b+12>>2]|0}d=d-2|0}d=c[b+8>>2]|0;f=a-((d-(eH(b|0,(c[b+20>>2]|0)-1<<1)|0)|0)/2|0)|0;if((f|0)>=0){h=f;return h|0}f=0;h=f;return h|0}function fc(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;a=c[b+8>>2]|0;e=(a-(es(b|0)|0)|0)/2|0;a=e-(c[b+20>>2]<<1)|0;if((d|0)>(a|0)){d=a}e=e-d|0;c[b+8>>2]=eH(b|0,e)|0;a=es(b|0)|0;wi(a|0,eH(b|0,d)|0,e<<1|0);return d|0}function fd(){if((a[29784]|0)!=0){return 29320}if((bo(29784)|0)==0){return 29320}c[7330]=c[96];c[7331]=c[94];c[7332]=c[92];c[7333]=c[90];c[7334]=c[88];c[7335]=c[86];c[7336]=c[84];c[7337]=c[82];c[7338]=c[80];c[7339]=c[78];c[7340]=c[76];c[7341]=0;return 29320}function fe(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;be(2880,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d;e=e8(a)|0;if((e|0)==1397638483){f=504}else if((e|0)==1449618720){f=10392}else if((e|0)==1515733337){f=8576}else if((e|0)==1314080325){f=1328}else if((e|0)==1195528961){f=5904}else if((e|0)==1396789261){f=864}else if((e|0)==1197034840){f=4376}else if((e|0)==1263747907|(e|0)==1263752024){f=2712}else if((e|0)==1212502861){f=3456}else if((e|0)==1313166157){f=2032}else{be(10112,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d;f=28832}i=b;return f|0}function ff(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;i=i+8|0;d=b|0;e=a;be(9496,(a=i,i=i+8|0,c[a>>2]=e,a)|0)|0;i=a;a=bb(e|0,46)|0;if((a|0)!=0){e=a+1|0}fg(e,6,d|0);e=fd()|0;while(1){if((c[e>>2]|0)==0){f=965;break}if((bL(d|0,c[(c[e>>2]|0)+16>>2]|0)|0)==0){f=962;break}e=e+4|0}if((f|0)==962){g=c[e>>2]|0;h=g;i=b;return h|0}else if((f|0)==965){g=0;h=g;i=b;return h|0}return 0}function fg(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;e=b;b=c;c=d;d=0;while(1){if((d|0)>=(b|0)){f=975;break}g=(aV(a[e+d|0]|0)|0)&255;a[c+d|0]=g;if(g<<24>>24==0){f=972;break}d=d+1|0}if((f|0)==975){a[c]=0;return}else if((f|0)==972){return}}function fh(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+16|0;e=d|0;f=d+8|0;g=a;a=b;be(9184,(b=i,i=i+8|0,c[b>>2]=g,b)|0)|0;i=b;c[a>>2]=ff(g)|0;do{if((c[a>>2]|0)==0){dJ(f);b=dN(f,g)|0;do{if((b|0)!=0){h=b;j=1}else{k=dX(f,e|0,4)|0;if((k|0)!=0){h=k;j=1;break}c[a>>2]=ff(fe(e|0)|0)|0;j=0}}while(0);dT(f);b=j;if((b|0)==0){break}else if((b|0)==1){l=h;i=d;return l|0}else{return 0}}}while(0);h=0;l=h;i=d;return l|0}function fi(a){a=a|0;return c[a+4>>2]|0}function fj(a){a=a|0;var b=0;b=a;a=c[b+16>>2]|0;c[b+16>>2]=0;return a|0}function fk(a){a=a|0;return c[a+8>>2]|0}function fl(a,b){a=a|0;b=b|0;return gu(a,b)|0}function fm(a){a=a|0;var b=0;b=a;if((b|0)==0){return}bQ[c[(c[b>>2]|0)+4>>2]&511](b);return}function fn(a){a=a|0;return fi(a)|0}function fo(a){a=a|0;return fj(a)|0}function fp(a){a=a|0;return fk(a)|0}function fq(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;g=a;a=b;b=d;d=e;be(8792,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e;if((g|0)!=0){h=1020}else{if((a|0)!=0){h=1022}else{h=1020}}do{if((h|0)==1020){if((b|0)==0){h=1022;break}}}while(0);if((h|0)==1022){a5(8448,147,10824,8112);return 0}h=0;be(7760,(e=i,i=i+8|0,c[e>>2]=a,e)|0)|0;i=e;if((a|0)>=4){be(7376,(e=i,i=i+1|0,i=i+7>>3<<3,c[e>>2]=0,e)|0)|0;i=e;j=fe(g)|0;k=j;be(7312,(e=i,i=i+8|0,c[e>>2]=k,e)|0)|0;i=e;h=ff(j)|0}if((h|0)==0){l=c[74]|0;m=l;i=f;return m|0}j=fr(h,d)|0;if((j|0)==0){l=7208;m=l;i=f;return m|0}d=fs(j,g,a)|0;if((d|0)!=0){a=j;if((a|0)!=0){bQ[c[(c[a>>2]|0)+4>>2]&511](a)}}else{c[b>>2]=j}l=d;m=l;i=f;return m|0}function fr(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;e=a;a=b;be(5512,(b=i,i=i+8|0,c[b>>2]=c[e>>2],b)|0)|0;i=b;if((e|0)!=0){if((a|0)==-1){f=bP[c[e+12>>2]&63]()|0;g=f;i=d;return g|0}b=bP[c[e+8>>2]&63]()|0;if((b|0)!=0){if((c[e+20>>2]&1|0)!=0){h=c2(512)|0;j=0;if((h|0)==0){k=0}else{j=1;j=h;eI(j,0);k=j}c[b+312>>2]=k;if((c[b+312>>2]|0)!=0){k=b;bR[c[(c[k>>2]|0)+36>>2]&127](k,c[b+312>>2]|0)}}if((c[e+20>>2]&1|0)!=0){if((c[b+312>>2]|0)!=0){l=1058}}else{l=1058}do{if((l|0)==1058){if((hR(b,a)|0)!=0){break}f=b;g=f;i=d;return g|0}}while(0);a=b;if((a|0)!=0){bQ[c[(c[a>>2]|0)+4>>2]&511](a)}}}f=0;g=f;i=d;return g|0}function fs(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=i;i=i+16|0;e=d|0;dD(e,b,c);c=gl(a,e)|0;d6(e);i=d;return c|0}function ft(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=a;a=b;b=d;be(6872,(d=i,i=i+8|0,c[d>>2]=j,d)|0)|0;i=d;do{if((j|0)!=0){if((a|0)==0){k=1081;break}}else{k=1081}}while(0);if((k|0)==1081){a5(8448,178,10760,6584);return 0}c[a>>2]=0;dJ(f);k=dN(f,j)|0;if((k|0)!=0){l=k;m=1;dT(f);n=l;i=e;return n|0}k=0;o=ff(j)|0;be(6288,(d=i,i=i+8|0,c[d>>2]=c[o>>2],d)|0)|0;i=d;o=0;if((o|0)==0){be(6024,(d=i,i=i+1|0,i=i+7>>3<<3,c[d>>2]=0,d)|0)|0;i=d;k=4;d=dX(f,g|0,4)|0;if((d|0)!=0){l=d;m=1;dT(f);n=l;i=e;return n|0}o=ff(fe(g|0)|0)|0}if((o|0)==0){l=c[74]|0;m=1;dT(f);n=l;i=e;return n|0}d=fr(o,b)|0;if((d|0)==0){l=7208;m=1;dT(f);n=l;i=e;return n|0}dy(h,g|0,k,f);k=gl(d,h)|0;dL(f);if((k|0)!=0){g=d;if((g|0)!=0){bQ[c[(c[g>>2]|0)+4>>2]&511](g)}}else{c[a>>2]=d}l=k;m=1;d4(h);dT(f);n=l;i=e;return n|0}function fu(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e|0;dG(f,b,c,d);d=gl(a,f)|0;d8(f);i=e;return d|0}function fv(a){a=a|0;return c[a+20>>2]|0}function fw(a,b){a=a|0;b=b|0;c[a+20>>2]=b;return}function fx(a,b){a=a|0;b=b|0;c[a+24>>2]=b;return}function fy(b){b=b|0;return a[b+273|0]&1|0}function fz(b,c){b=b|0;c=c|0;a[b+288|0]=c&1&1;return}function fA(a){a=a|0;return(c[a+4>>2]|0)!=1|0}function fB(a){a=a|0;return c[a+228>>2]|0}function fC(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b;c[e>>2]=0;b=fD(1936)|0;f=0;if((b|0)==0){g=0}else{f=1;g=b}b=g;if((b|0)==0){h=7208;i=h;return i|0}g=gr(a,b+128|0,d)|0;if((g|0)!=0){fE(b);h=g;i=h;return i|0}c[b>>2]=c[b+132>>2];c[b+4>>2]=c[b+136>>2];c[b+8>>2]=c[b+140>>2];c[b+16>>2]=-1;c[b+20>>2]=-1;c[b+24>>2]=-1;c[b+28>>2]=-1;c[b+32>>2]=-1;c[b+36>>2]=-1;c[b+40>>2]=-1;c[b+44>>2]=-1;c[b+48>>2]=-1;c[b+52>>2]=-1;c[b+56>>2]=-1;c[b+60>>2]=-1;c[b+92>>2]=28832;c[b+96>>2]=28832;c[b+100>>2]=28832;c[b+104>>2]=28832;c[b+108>>2]=28832;c[b+112>>2]=28832;c[b+116>>2]=28832;c[b+120>>2]=28832;c[b+124>>2]=28832;c[b+64>>2]=b+144;c[b+68>>2]=b+400;c[b+72>>2]=b+656;c[b+76>>2]=b+912;c[b+80>>2]=b+1168;c[b+84>>2]=b+1424;c[b+88>>2]=b+1680;c[b+12>>2]=c[b>>2];if((c[b+12>>2]|0)<=0){c[b+12>>2]=(c[b+4>>2]|0)+(c[b+8>>2]<<1);if((c[b+12>>2]|0)<=0){c[b+12>>2]=15e4}}c[e>>2]=b;h=0;i=h;return i|0}function fD(a){a=a|0;return vi(a)|0}function fE(a){a=a|0;var b=0;b=a;if((b|0)==0){return}fF(b);return}function fF(a){a=a|0;vk(a);return}function fG(a,b){a=a|0;b=+b;var d=0;d=a;if((c[d+312>>2]|0)==0){return}eG(c[d+312>>2]|0,b);return}function fH(a){a=a|0;return fv(a)|0}function fI(a,b){a=a|0;b=b|0;fw(a,b);return}function fJ(a,b){a=a|0;b=b|0;fx(a,b);return}function fK(a,b){a=a|0;b=b|0;return hM(a,b)|0}function fL(a,b,c){a=a|0;b=b|0;c=c|0;return is(a,b,c)|0}function fM(a,b){a=a|0;b=b|0;h3(a,b,8e3);return}function fN(a){a=a|0;return(fy(a)|0)&1|0}function fO(a){a=a|0;return h0(a)|0}function fP(a,b){a=a|0;b=b|0;return h1(a,b)|0}function fQ(a){a=a|0;return cZ(a)|0}function fR(a,b){a=a|0;b=b|0;fz(a,(b|0)!=0);return}function fS(a,b){a=a|0;b=+b;hV(a,b);return}function fT(a,b,c){a=a|0;b=b|0;c=c|0;hT(a,b,(c|0)!=0);return}function fU(a,b){a=a|0;b=b|0;hU(a,b);return}function fV(a,b){a=a|0;b=b|0;fW(a,(b|0)!=0);return}function fW(a,b){a=a|0;b=b|0;var d=0;d=a;bR[c[(c[d>>2]|0)+48>>2]&127](d,b&1);return}function fX(a){a=a|0;f_(a);return}function fY(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=i;i=i+80|0;d=c|0;e=a;a=b;b=d;f=cD(e)|0;wh(b|0,f|0,80)|0;h[d>>3]=+h[a>>3];h[d+8>>3]=+h[a+8>>3];hK(e,d);i=c;return}function fZ(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=i;i=i+80|0;d=c|0;e=a;wg(d|0,0,80);h[d>>3]=+h[(cD(e)|0)>>3];h[d+8>>3]=+h[(cD(e)|0)+8>>3];e=b;b=d;wh(e|0,b|0,80)|0;i=c;return}function f_(a){a=a|0;var b=0;b=a;f$(b+28|0);bQ[c[(c[b>>2]|0)+32>>2]&511](b);c[b+8>>2]=c[b+12>>2];return}function f$(a){a=a|0;var b=0;b=a;c[b+16>>2]=0;gJ(b|0);gK(b+8|0);return}function f0(a){a=a|0;var b=0;b=a;f_(b);c[b+8>>2]=0;c[b+12>>2]=0;c9(b+132|0);return}function f1(a){a=a|0;gS(a);return}function f2(a){a=a|0;gf(a);return}function f3(a){a=a|0;gs(a);return}function f4(a){a=a|0;gR(a);return}function f5(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;if(a>>>0>=(cZ(d)|0)>>>0){a5(8448,399,10664,5456);return 0}return c[(fB(d)|0)+(a<<2)>>2]|0}function f6(a){a=a|0;var b=0;b=a;if((b|0)==0){a5(8448,405,10720,5336);return 0}return c[b>>2]|0}function f7(a){a=a|0;var b=0;b=a;c[b>>2]=20240;f1(b+28|0);f2(b+132|0);c[b+4>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;bQ[c[(c[b>>2]|0)+8>>2]&511](b);f8();return}function f8(){var b=0,d=0;b=i;i=i+8|0;d=b|0;c[d>>2]=1;if((a[d]|0)!=0){i=b;return}else{a5(1e4,62,16264,9552);i=b;return}}function f9(a){a=a|0;var b=0;b=a;ga(b);cK(b);return}function ga(a){a=a|0;var b=0;b=a;c[b>>2]=20240;if((c[b+24>>2]|0)!=0){bQ[c[b+24>>2]&511](c[b+20>>2]|0)}f3(b+132|0);f4(b+28|0);return}function gb(a){a=a|0;return}function gc(a){a=a|0;return c[a+4>>2]|0}function gd(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;c[d+12>>2]=a;c[d+8>>2]=a;return}function ge(a){a=a|0;return a+20|0}function gf(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;return}function gg(a){a=a|0;return c[a+4>>2]|0}function gh(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=b;b=a;a=d;e=da(b+132|0,bT[c[(c[a>>2]|0)+16>>2]&63](a)|0)|0;if((e|0)!=0){f=e;g=f;return g|0}e=d;d=c[(c[e>>2]|0)+12>>2]|0;a=c0(b+132|0)|0;h=gc(b+132|0)|0;i=bS[d&255](e,a,h)|0;if((i|0)!=0){f=i;g=f;return g|0}i=c[(c[b>>2]|0)+16>>2]|0;h=c0(b+132|0)|0;a=gc(b+132|0)|0;f=bS[i&255](b,h,a)|0;g=f;return g|0}function gi(a){a=a|0;var b=0;b=a;bQ[c[(c[b>>2]|0)+8>>2]&511](b);return}function gj(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;if((fk(b)|0)==0){gd(b,c[(fi(b)|0)+4>>2]|0)}if((d|0)!=0){bQ[c[(c[b>>2]|0)+8>>2]&511](b);e=d;return e|0}else{bQ[c[(c[b>>2]|0)+28>>2]&511](b);e=d;return e|0}return 0}function gk(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;bQ[c[(c[e>>2]|0)+24>>2]&511](e);return gj(e,bS[c[(c[e>>2]|0)+16>>2]&255](e,b,d)|0)|0}function gl(a,b){a=a|0;b=b|0;var d=0;d=a;bQ[c[(c[d>>2]|0)+24>>2]&511](d);return gj(d,bY[c[(c[d>>2]|0)+12>>2]&127](d,b)|0)|0}function gm(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=b;b=c;c=d;do{if((b|0)!=0){if((a[b]|0)==0){break}while(1){if((c|0)!=0){f=((a[b]|0)-1|0)>>>0<=31}else{f=0}if(!f){break}b=b+1|0;c=c-1|0}if((c|0)>255){c=255}d=0;while(1){if((d|0)<(c|0)){g=(a[b+d|0]|0)!=0}else{g=0}if(!g){break}d=d+1|0}while(1){if((d|0)!=0){h=(a[b+(d-1)|0]|0)>>>0<=32}else{h=0}if(!h){break}d=d-1|0}a[e+d|0]=0;i=e;j=b;k=d;wh(i|0,j|0,k)|0;do{if((bL(e|0,4240)|0)!=0){if((bL(e|0,3272)|0)==0){break}if((bL(e|0,2560)|0)==0){break}return}}while(0);a[e|0]=0;return}}while(0);return}function gn(a,b){a=a|0;b=b|0;gm(a,b,255);return}function go(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=d;d=b;b=c[e>>2]|0;if(b>>>0>=(fk(d)|0)>>>0){f=1912;g=f;return g|0}b=c[e>>2]|0;do{if(b>>>0<(gp(d+28|0)|0)>>>0){h=gq(d+28|0,c[e>>2]|0)|0;c[e>>2]=0;if((c[h+16>>2]|0)>=0){c[e>>2]=c[h+16>>2];if((c[(c[d+4>>2]|0)+20>>2]&2|0)==0){i=e;c[i>>2]=(c[i>>2]|0)-(a[h+12|0]&1)}}if((c[e>>2]|0)<(c[d+12>>2]|0)){break}f=1224;g=f;return g|0}}while(0);f=0;g=f;return g|0}function gp(a){a=a|0;return gg(a|0)|0}function gq(a,b){a=a|0;b=b|0;return gw(a|0,b)|0}function gr(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+8|0;g=f|0;h=d;d=e;e=b;c[h>>2]=fk(e)|0;c[h+4>>2]=-1;c[h+12>>2]=-1;c[h+8>>2]=-1;a[h+528|0]=0;a[h+272|0]=0;a[h+784|0]=0;a[h+1040|0]=0;a[h+1296|0]=0;a[h+1552|0]=0;a[h+16|0]=0;gn(h+16|0,c[(fi(e)|0)>>2]|0);c[g>>2]=d;b=go(e,g)|0;if((b|0)!=0){j=b;k=j;i=f;return k|0}b=bS[c[(c[e>>2]|0)+20>>2]&255](e,h,c[g>>2]|0)|0;if((b|0)!=0){j=b;k=j;i=f;return k|0}if((gp(e+28|0)|0)!=0){b=ge(e+28|0)|0;gn(h+272|0,c[b>>2]|0);gn(h+784|0,c[b+8>>2]|0);gn(h+784|0,c[b+4>>2]|0);gn(h+1552|0,c[b+12>>2]|0);b=gq(e+28|0,d)|0;gn(h+528|0,c[b+8>>2]|0);if((c[b+20>>2]|0)>=0){c[h+4>>2]=(c[b+20>>2]|0)*1e3|0}if((c[b+24>>2]|0)>=0){c[h+8>>2]=(c[b+24>>2]|0)*1e3|0}if((c[b+28>>2]|0)>=0){c[h+12>>2]=(c[b+28>>2]|0)*1e3|0}}j=0;k=j;i=f;return k|0}function gs(a){a=a|0;vk(c[a>>2]|0);return}function gt(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;f=e|0;g=b;b=a;if((g|0)==(c0(b+132|0)|0)){a5(8056,55,12544,5424);return 0}dD(f,g,d);d=bY[c[(c[b>>2]|0)+12>>2]&127](b,f)|0;d6(f);i=e;return d|0}function gu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+8|0;e=d|0;f=a;bQ[c[(c[f>>2]|0)+24>>2]&511](f);dJ(e);a=dN(e,b)|0;if((a|0)!=0){g=a;h=1;dT(e);j=g;i=d;return j|0}g=gj(f,bY[c[(c[f>>2]|0)+12>>2]&127](f,e)|0)|0;h=1;dT(e);j=g;i=d;return j|0}function gv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e|0;dy(f,b,c,d);d=gl(a,f)|0;d4(f);i=e;return d|0}function gw(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if(d>>>0>(c[b+4>>2]|0)>>>0){a5(432,58,11208,10360);return 0}return(c[b>>2]|0)+(d*40|0)|0}function gx(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;return}function gy(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;return}function gz(a){a=a|0;return c[a+16>>2]|0}function gA(a,b){a=a|0;b=b|0;c[a+16>>2]=b;return}function gB(a){a=a|0;var b=0;b=a;return(c[b>>2]|0)+(c[b+4>>2]|0)|0}function gC(a){a=a|0;return c[a>>2]|0}function gD(a){a=a|0;gG(a);return}function gE(a){a=a|0;gF(a);return}function gF(a){a=a|0;vk(c[a>>2]|0);return}function gG(a){a=a|0;vk(c[a>>2]|0);return}function gH(a){a=a|0;gy(a);return}function gI(a){a=a|0;gx(a);return}function gJ(a){a=a|0;var b=0;b=a;a=c[b>>2]|0;c[b>>2]=0;c[b+4>>2]=0;vk(a);return}function gK(a){a=a|0;var b=0;b=a;a=c[b>>2]|0;c[b>>2]=0;c[b+4>>2]=0;vk(a);return}function gL(a,b){a=a|0;b=b|0;var c=0;c=a;return gT(c,gU(c+28|0,b)|0)|0}function gM(a,b){a=a|0;b=b|0;var c=0;c=a;return gT(c,gN(c+28|0,b)|0)|0}function gN(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=b;b=a;a=d;e=g3(b+8|0,(bT[c[(c[a>>2]|0)+16>>2]&63](a)|0)+1|0)|0;if((e|0)!=0){f=e;g=f;return g|0}e=d;d=c[(c[e>>2]|0)+12>>2]|0;a=gC(b+8|0)|0;h=(gZ(b+8|0)|0)-1|0;i=bS[d&255](e,a,h)|0;if((i|0)!=0){f=i;g=f;return g|0}f=g2(b)|0;g=f;return g|0}function gO(a,b){a=a|0;b=b|0;return gL(a,b)|0}function gP(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b;c[d+20>>2]=28816;c[d+24>>2]=28816;c[d+28>>2]=28816;c[d+32>>2]=28816;c[d+36>>2]=28816;a[(gB(d+8|0)|0)-1|0]=10;c[d+16>>2]=0;b=1;e=0;f=0;g=gC(d+8|0)|0;L1483:while(1){if(g>>>0>=(gB(d+8|0)|0)>>>0){h=1437;break}e=e+1|0;i=g;while(1){if((a[g]|0)!=13){j=(a[g]|0)!=10}else{j=0}if(!j){break}if((a[g]|0)==0){h=1415;break L1483}g=g+1|0}do{if((a[g|0]|0)==13){if((a[g+1|0]|0)!=10){break}k=g;g=k+1|0;a[k]=0}}while(0);k=g;g=k+1|0;a[k]=0;if((a[i]|0)==35){gQ(i,d+20|0,b&1);b=0}else{if((a[i]|0)!=0){if((gg(d|0)|0)<=(f|0)){l=g0(d|0,(f<<1)+64|0)|0;if((l|0)!=0){h=1426;break}}if((g1(i,gw(d|0,f)|0)|0)!=0){if((c[d+16>>2]|0)==0){c[d+16>>2]=e}}else{f=f+1|0}b=0}}}if((h|0)==1415){m=4096;n=m;return n|0}else if((h|0)==1437){if((f|0)<=0){m=4096;n=m;return n|0}if((a[c[d+24>>2]|0]|a[c[d+28>>2]|0]|a[c[d+32>>2]|0]|a[c[d+36>>2]|0]|0)==0){c[d+20>>2]=28816}m=g0(d|0,f)|0;n=m;return n|0}else if((h|0)==1426){m=l;n=m;return n|0}return 0}function gQ(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=b;b=d;d=e&1;f=g_(f+1|0)|0;e=f;while(1){if((a[f]|0)!=0){g=(a[f]|0)!=58}else{g=0}if(!g){break}f=f+1|0}if((a[f]|0)==58){g=g_(f+1|0)|0;do{if((a[g]|0)!=0){a[f]=0;if((bL(1800,e|0)|0)!=0){if((bL(1168,e|0)|0)!=0){if((bL(744,e|0)|0)!=0){if((bL(10560,e|0)|0)!=0){g=0}else{c[b+16>>2]=g}}else{c[b+12>>2]=g}}else{c[b+8>>2]=g}}else{c[b+4>>2]=g}if((g|0)==0){a[f]=58;break}return}}while(0)}if(!(d&1)){return}c[b>>2]=e;return}function gR(a){a=a|0;var b=0;b=a;gD(b+8|0);gE(b|0);return}function gS(a){a=a|0;var b=0;b=a;gH(b|0);gI(b+8|0);return}function gT(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=d;d=b;if((c[d+12>>2]|0)==0){a5(616,25,12608,7456);return 0}if((e|0)!=0){f=e;return f|0}if((gp(d+28|0)|0)!=0){c[d+8>>2]=gp(d+28|0)|0}b=gz(d+28|0)|0;if((b|0)!=0){g=d+132|0;h=g-1|0;g=h;a[h]=0;do{h=g-1|0;g=h;a[h]=((b|0)%10|0)+48&255;h=(b|0)/10|0;b=h;}while((h|0)>0);g=g-23|0;b=g;wh(b|0,16592,23)|0;gA(d,g)}f=e;return f|0}function gU(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0;c=i;i=i+8|0;d=c|0;dJ(d);e=dN(d,b)|0;if((e|0)!=0){f=e;g=1;dT(d);h=f;i=c;return h|0}f=gN(a,d)|0;g=1;dT(d);h=f;i=c;return h|0}function gV(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=i;i=i+16|0;e=d|0;dD(e,b,c);c=gM(a,e)|0;d6(e);i=d;return c|0}function gW(a,b){a=a|0;b=b|0;return 0}function gX(a){a=a|0;return a-48|0}function gY(a){a=a|0;var b=0,c=0;b=a;b=b-48|0;if(b>>>0<=9){c=b;return c|0}b=(b-17&223)+10|0;c=b;return c|0}function gZ(a){a=a|0;return c[a+4>>2]|0}function g_(b){b=b|0;var c=0;c=b;while(1){if((a[c]|0)!=32){break}c=c+1|0}return c|0}function g$(a,b){a=a|0;b=b|0;var d=0;d=a;c[d>>2]=22008;c[d+16>>2]=b;c[d+12>>2]=0;c[d+8>>2]=0;c[d+4>>2]=1;return}function g0(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=vl(c[b>>2]|0,d*40|0)|0;do{if((a|0)==0){if((d|0)==0){break}e=3200;f=e;return f|0}}while(0);c[b>>2]=a;c[b+4>>2]=d;e=0;f=e;return f|0}function g1(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+8|0;f=e|0;g=b;b=d;c[f>>2]=0;c[b>>2]=g;c[b+4>>2]=28816;g=g5(g,b)|0;c[b+16>>2]=-1;a[b+12|0]=0;g=g6(g,b,f)|0;c[b+8>>2]=g;g=g7(g)|0;c[b+20>>2]=-1;g=g8(g,b+20|0,f)|0;c[b+24>>2]=-1;c[b+28>>2]=-1;if((a[g]|0)==45){c[b+28>>2]=c[b+20>>2];g=g+1|0}else{g=g9(g,b+28|0)|0;if((c[b+28>>2]|0)>=0){c[b+24>>2]=0;if((a[g]|0)==45){g=g+1|0;c[b+24>>2]=c[b+28>>2];c[b+28>>2]=(c[b+20>>2]|0)-(c[b+24>>2]|0)}}}g=ha(g,f)|0;c[b+32>>2]=-1;g=g8(g,b+32|0,f)|0;c[b+36>>2]=-1;g=hb(g,b+36|0,f)|0;i=e;return c[f>>2]|0}function g2(a){a=a|0;var b=0,c=0;b=a;a=gP(b)|0;if((a|0)==0){c=a;return c|0}gJ(b|0);gK(b+8|0);c=a;return c|0}function g3(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=vl(c[b>>2]|0,d)|0;do{if((a|0)==0){if((d|0)==0){break}e=3200;f=e;return f|0}}while(0);c[b>>2]=a;c[b+4>>2]=d;e=0;f=e;return f|0}function g4(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=c;c=a;a=g3(c+8|0,d+1|0)|0;if((a|0)!=0){e=a;f=e;return f|0}a=gC(c+8|0)|0;g=b;b=d;wh(a|0,g|0,b)|0;e=g2(c)|0;f=e;return f|0}function g5(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=b;b=d;c[b>>2]=e;c[b+4>>2]=28816;d=e;L1659:while(1){f=a[e]|0;if((f|0)==0){g=1574;break}e=e+1|0;if((f|0)==44){h=g_(e)|0;if((a[h]|0)==36){g=1578;break}if((gX(a[h]|0)|0)>>>0<=9){g=1578;break}}do{if((f|0)==58){if((a[e|0]|0)!=58){break}if((a[e+1|0]|0)==0){break}if((a[e+2|0]|0)!=44){g=1584;break L1659}}}while(0);if((f|0)==92){f=a[e]|0;if((f|0)==0){g=1594;break}e=e+1|0}i=d;d=i+1|0;a[i]=f&255}if((g|0)==1584){i=e+1|0;e=i;c[b+4>>2]=i;while(1){i=a[e]|0;f=i;if((i|0)!=0){j=(f|0)!=44}else{j=0}if(!j){break}e=e+1|0}if((f|0)==44){f=e;e=f+1|0;a[f]=0;e=g_(e)|0}k=d;a[k]=0;l=e;return l|0}else if((g|0)==1578){e=h;k=d;a[k]=0;l=e;return l|0}else if((g|0)==1574){k=d;a[k]=0;l=e;return l|0}else if((g|0)==1594){k=d;a[k]=0;l=e;return l|0}return 0}function g6(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=b;b=d;d=e;if((a[f]|0)!=36){f=hc(f,b+16|0)|0;if((c[b+16>>2]|0)>=0){a[b+12|0]=1}g=f;h=d;i=ha(g,h)|0;return i|0}f=f+1|0;e=0;while(1){j=gY(a[f]|0)|0;if((j|0)>15){break}f=f+1|0;e=(e<<4)+j|0;c[b+16>>2]=e}g=f;h=d;i=ha(g,h)|0;return i|0}function g7(b){b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0;c=b;b=c;while(1){d=a[c]|0;if((d|0)==0){e=1616;break}c=c+1|0;if((d|0)==44){f=g_(c)|0;if((a[f]|0)==44){e=1621;break}if((a[f]|0)==45){e=1621;break}if((gX(a[f]|0)|0)>>>0<=9){e=1621;break}}if((d|0)==92){d=a[c]|0;if((d|0)==0){e=1625;break}c=c+1|0}g=b;b=g+1|0;a[g]=d&255}if((e|0)==1625){h=b;a[h]=0;i=c;return i|0}else if((e|0)==1621){c=f;h=b;a[h]=0;i=c;return i|0}else if((e|0)==1616){h=b;a[h]=0;i=c;return i|0}return 0}function g8(a,b,c){a=a|0;b=b|0;c=c|0;return ha(g9(a,b)|0,c)|0}function g9(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+8|0;f=e|0;g=b;b=d;c[b>>2]=-1;c[f>>2]=-1;g=hc(g,f)|0;if((c[f>>2]|0)<0){h=g;i=e;return h|0}c[b>>2]=c[f>>2];if((a[g]|0)==58){c[f>>2]=-1;g=hc(g+1|0,f)|0;if((c[f>>2]|0)>=0){c[b>>2]=((c[b>>2]|0)*60|0)+(c[f>>2]|0)}}h=g;i=e;return h|0}function ha(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;while(1){e=g_(e)|0;if((a[e]|0)==0){f=1644;break}if((a[e]|0)==44){f=1646;break}c[b>>2]=1;e=e+1|0}if((f|0)==1646){e=e+1|0;g=e;h=g_(g)|0;return h|0}else if((f|0)==1644){g=e;h=g_(g)|0;return h|0}return 0}function hb(a,b,c){a=a|0;b=b|0;c=c|0;return ha(hc(a,b)|0,c)|0}function hc(b,d){b=b|0;d=d|0;var e=0,f=0;e=b;b=d;d=0;while(1){f=gX(a[e]|0)|0;if(f>>>0>9){break}e=e+1|0;d=(d*10|0)+f|0;c[b>>2]=d}return e|0}function hd(a){a=a|0;var b=0;b=a;g$(b,1);c[b>>2]=21816;c[b+24>>2]=0;c[b+20>>2]=0;c[b+28>>2]=0;return}function he(a){a=a|0;var b=0;b=a;g$(b,1);c[b>>2]=22072;ct(b+20|0);c[b+64>>2]=b+20;c[b+68>>2]=b+20;c[b+72>>2]=b+20;return}function hf(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=e;e=a;a=d;d=c[e+40>>2]|0;g=c[e+28>>2]|0;h=c[e+36>>2]|0;while(1){if((f|0)==0){break}i=h>>14;if(((i&65535)<<16>>16|0)!=(i|0)){i=32767-(i>>24)|0}j=g;g=j+4|0;h=h+((c[j>>2]|0)-(h>>d))|0;b[a>>1]=i&65535;b[a+2>>1]=i&65535;a=a+4|0;f=f-1|0}c[e+36>>2]=h;return}function hg(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;f=e;e=a;a=d;d=c[e+84>>2]|0;g=c[e+72>>2]|0;h=c[e+80>>2]|0;i=c[e+116>>2]|0;j=c[e+124>>2]|0;k=c[e+28>>2]|0;l=c[e+36>>2]|0;while(1){if((f|0)==0){break}m=l>>14;n=m+(h>>14)|0;o=m+(j>>14)|0;if(((n&65535)<<16>>16|0)!=(n|0)){n=32767-(n>>24)|0}m=k;k=m+4|0;l=l+((c[m>>2]|0)-(l>>d))|0;if(((o&65535)<<16>>16|0)!=(o|0)){o=32767-(o>>24)|0}m=g;g=m+4|0;h=h+((c[m>>2]|0)-(h>>d))|0;m=i;i=m+4|0;j=j+((c[m>>2]|0)-(j>>d))|0;b[a>>1]=n&65535;b[a+2>>1]=o&65535;a=a+4|0;f=f-1|0}c[e+36>>2]=l;c[e+124>>2]=j;c[e+80>>2]=h;return}function hh(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;d=a;a=cu(d+20|0,b,c)|0;if((a|0)!=0){e=a;f=e;return f|0}a=eM(d+20|0)|0;e=cC(d,a,eN(d+20|0)|0)|0;f=e;return f|0}function hi(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=c;c=a;a=0;while(1){if((a|0)>=3){e=1696;break}f=cu(c+20+(a*44|0)|0,d,b)|0;if((f|0)!=0){e=1692;break}a=a+1|0}if((e|0)==1696){a=eM(c+20|0)|0;g=cC(c,a,eN(c+20|0)|0)|0;h=g;return h|0}else if((e|0)==1692){g=f;h=g;return h|0}return 0}function hj(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;a=0;while(1){if((a|0)>=3){break}co(b+20+(a*44|0)|0,c);a=a+1|0}return}function hk(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;a=0;while(1){if(a>>>0>=3){break}cg(b+20+(a*44|0)|0,c);a=a+1|0}return}function hl(a){a=a|0;var b=0;b=a;c[b+164>>2]=0;c[b+168>>2]=0;a=0;while(1){if((a|0)>=3){break}cn(b+20+(a*44|0)|0,1);a=a+1|0}return}function hm(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;c[b+164>>2]=0;a=0;while(1){if(a>>>0>=3){break}e=(eQ(b+20+(a*44|0)|0)|0)<<a;f=b+164|0;c[f>>2]=c[f>>2]|e;cw(b+20+(a*44|0)|0,d);a=a+1|0}return}function hn(a){a=a|0;var b=0;b=a;ho(b);c3(b);return}function ho(a){a=a|0;var b=0;b=a;c[b>>2]=22072;cl(b+20|0);dj(b);return}function hp(a){a=a|0;var b=0,d=0,e=0;b=a;g$(b,2);c[b>>2]=21752;a=b+20|0;d=a+132|0;e=a;do{ct(e);e=e+44|0;}while((e|0)!=(d|0));c[b+152>>2]=b+20;c[b+156>>2]=b+64;c[b+160>>2]=b+108;return}function hq(a){a=a|0;var b=0;b=a;hr(b);c3(b);return}function hr(a){a=a|0;var b=0,d=0;b=a;c[b>>2]=21752;a=b+20|0;d=a+132|0;do{d=d-44|0;cl(d);}while((d|0)!=(a|0));dj(b);return}function hs(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=b;b=d;d=a;if((b&1|0)!=0){a5(10400,108,14904,10320);return 0}b=(b>>>0)/2|0;a=cf(d+20|0)|0;if((b|0)>(a|0)){b=a}if((b|0)==0){f=b;g=f<<1;return g|0}a=c[d+164>>2]|c[d+168>>2];if((a|0)<=1){hf(d,e,b);cq(d+20|0,b);cx(d+64|0,b);cx(d+108|0,b)}else{if((a&1|0)!=0){hg(d,e,b);cq(d+20|0,b);cq(d+64|0,b);cq(d+108|0,b)}else{ht(d,e,b);cx(d+20|0,b);cq(d+64|0,b);cq(d+108|0,b)}}if((cf(d+20|0)|0)==0){c[d+168>>2]=c[d+164>>2];c[d+164>>2]=0}f=b;g=f<<1;return g|0}function ht(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;f=e;e=a;a=d;d=c[e+84>>2]|0;g=c[e+72>>2]|0;h=c[e+80>>2]|0;i=c[e+116>>2]|0;j=c[e+124>>2]|0;while(1){if((f|0)==0){break}k=h>>14;if(((k&65535)<<16>>16|0)!=(k|0)){k=32767-(k>>24)|0}l=j>>14;if(((l&65535)<<16>>16|0)!=(l|0)){l=32767-(l>>24)|0}m=g;g=m+4|0;h=h+((c[m>>2]|0)-(h>>d))|0;m=i;i=m+4|0;j=j+((c[m>>2]|0)-(j>>d))|0;b[a>>1]=k&65535;b[a+2>>1]=l&65535;a=a+4|0;f=f-1|0}c[e+124>>2]=j;c[e+80>>2]=h;return}function hu(a,b){a=a|0;b=b|0;c[a+228>>2]=b;return}function hv(a){a=a|0;return c[a+256>>2]|0}function hw(a){a=a|0;dj(a);return}function hx(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=a;a=b+64|0;c[e>>2]=c[a>>2];c[e+4>>2]=c[a+4>>2];c[e+8>>2]=c[a+8>>2];return}function hy(a,b){a=a|0;b=b|0;co(a+20|0,b);return}function hz(a,b){a=a|0;b=b|0;cg(a+20|0,b);return}function hA(a){a=a|0;cn(a+20|0,1);return}function hB(a,b){a=a|0;b=b|0;cw(a+20|0,b);return}function hC(a,b,c){a=a|0;b=b|0;c=c|0;return cH(a+20|0,b,c,0)|0}function hD(a){a=a|0;return cf(a+20|0)|0}function hE(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=a;a=b+152|0;c[e>>2]=c[a>>2];c[e+4>>2]=c[a+4>>2];c[e+8>>2]=c[a+8>>2];return}function hF(a){a=a|0;return(cf(a+20|0)|0)<<1|0}function hG(){hH(29376,-8.0,180.0);return}function hH(a,b,c){a=a|0;b=+b;c=+c;wg(a|0,0,80);h[a>>3]=b;h[a+8>>3]=c;return}function hI(b){b=b|0;var d=0;d=b;c[d+260>>2]=-1;c[d+264>>2]=0;c[d+268>>2]=0;a[d+272|0]=1;a[d+273|0]=1;c[d+276>>2]=1073741824;c[d+280>>2]=1;c[d+292>>2]=0;c[d+296>>2]=0;c[d+300>>2]=0;fj(d)|0;return}function hJ(a){a=a|0;var b=0;b=a;c[b+232>>2]=0;hI(b);f0(b);return}function hK(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;a=b+144|0;e=d;wh(a|0,e|0,80)|0;bR[c[(c[b>>2]|0)+44>>2]&127](b,d);return}function hL(a){a=a|0;var b=0;b=a;hV(b,+h[b+240>>3]);c7(b);return}function hM(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+8|0;f=e|0;g=d;d=b;hI(d);c[f>>2]=g;b=go(d,f)|0;if((b|0)!=0){h=b;j=h;i=e;return j|0}c[d+260>>2]=g;g=bY[c[(c[d>>2]|0)+60>>2]&127](d,c[f>>2]|0)|0;if((g|0)!=0){h=g;j=h;i=e;return j|0}a[d+272|0]=0;a[d+273|0]=0;if(!(a[d+288|0]&1)){g=c[d+224>>2]<<1;f=aq(g,hv(d)|0)|0;while(1){if((c[d+268>>2]|0)>=(f|0)){break}h6(d);if((c[d+300>>2]|a[d+272|0]&1|0)!=0){g=1817;break}}c[d+268>>2]=c[d+300>>2];c[d+264>>2]=0;c[d+292>>2]=0;c[d+296>>2]=0}if(fy(d)|0){k=fj(d)|0}else{k=0}h=k;j=h;i=e;return j|0}function hN(a){a=a|0;var b=0;b=a;hw(b);c3(b);return}function hO(b){b=b|0;var d=0;d=b;f7(d);c[d>>2]=19344;ee(d+304|0);c[d+312>>2]=0;c[d+256>>2]=0;c[d+236>>2]=0;h[d+240>>3]=1.0;h[d+248>>3]=1.0;c[d+224>>2]=2;c[d+284>>2]=3;a[d+288|0]=0;h[d+144>>3]=-1.0;h[d+152>>3]=60.0;hu(d,16424);hJ(d);return}function hP(a){a=a|0;var b=0;b=a;hQ(b);cK(b);return}function hQ(a){a=a|0;var b=0;b=a;c[b>>2]=19344;a=c[b+312>>2]|0;if((a|0)!=0){bQ[c[(c[a>>2]|0)+4>>2]&511](a)}eg(b+304|0);ga(b);return}function hR(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;if((hv(b)|0)!=0){a5(1112,80,12104,728);return 0}a=bY[c[(c[b>>2]|0)+40>>2]&127](b,d)|0;if((a|0)!=0){e=a;f=e;return f|0}a=ek(b+304|0,2048)|0;if((a|0)!=0){e=a;f=e;return f|0}c[b+256>>2]=d;e=0;f=e;return f|0}function hS(a){a=a|0;var b=0;b=a;if((hv(b)|0)==0){a5(1112,89,11944,10544)}gi(b);return}function hT(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=b;b=a;if(e>>>0>=(cZ(b)|0)>>>0){a5(1112,101,12192,10272)}a=1<<e;e=c[b+236>>2]|a;if(d&1){f=e;hU(b,f);return}e=e^a;f=e;hU(b,f);return}function hU(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((hv(b)|0)==0){a5(1112,111,12152,10544)}c[b+236>>2]=d;bR[c[(c[b>>2]|0)+52>>2]&127](b,d);return}function hV(a,b){a=a|0;b=+b;var d=0.0,e=0;d=b;e=a;if((hv(e)|0)==0){a5(1112,118,11864,10544)}if(d<.02){d=.02}if(d>4.0){d=4.0}h[e+240>>3]=d;bO[c[(c[e>>2]|0)+56>>2]&31](e,d);return}function hW(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function hX(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=a;a=b;b=c;c=(d|0)/(a|0)|0;e=(aq(d-(aq(c,a)|0)|0,b)|0)/(a|0)|0;return b-e+(e>>1)>>c|0}function hY(a){a=a|0;return c[a+260>>2]|0}function hZ(a,c){a=a|0;c=c|0;var d=0,e=0,f=0;d=a;a=c;c=b[d>>1]|0;b[d>>1]=16;e=d+(a<<1)|0;do{f=e-2|0;e=f;}while(((b[f>>1]|0)+8|0)>>>0<=16);b[d>>1]=c;return a-((e-d|0)/2|0)|0}function h_(b,c){b=b|0;c=c|0;var d=0;d=c;c=b;if((d|0)==0){return}a[c+272|0]=1;gA(c,d);return}function h$(a,b){a=a|0;b=b|0;var c=0,d=0;c=b;b=a;a=(c|0)/1e3|0;c=c-(a*1e3|0)|0;d=aq(a,hv(b)|0)|0;return d+((aq(c,hv(b)|0)|0)/1e3|0)<<1|0}function h0(a){a=a|0;var b=0,d=0,e=0;b=a;a=(hv(b)|0)<<1;d=(c[b+264>>2]|0)/(a|0)|0;e=c[b+264>>2]|0;return(d*1e3|0)+(((e-(aq(d,a)|0)|0)*1e3|0|0)/(a|0)|0)|0}function h1(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;a=h$(d,b)|0;do{if((a|0)<(c[d+264>>2]|0)){b=hM(d,c[d+260>>2]|0)|0;if((b|0)!=0){e=b;f=e;return f|0}else{break}}}while(0);e=h7(d,a-(c[d+264>>2]|0)|0)|0;f=e;return f|0}function h2(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=d;d=b;do{if((e|0)>3e4){b=c[d+236>>2]|0;hU(d,-1);while(1){if((e|0)>15e3){f=a[d+272|0]&1^1}else{f=0}if(!f){g=1940;break}h=c[(c[d>>2]|0)+64>>2]|0;i=es(d+304|0)|0;j=bS[h&255](d,2048,i)|0;if((j|0)!=0){break}e=e-2048|0}if((g|0)==1940){hU(d,b);break}k=j;l=k;return l|0}}while(0);while(1){if((e|0)!=0){m=a[d+272|0]&1^1}else{m=0}if(!m){g=1952;break}j=2048;if((j|0)>(e|0)){j=e}e=e-j|0;f=c[(c[d>>2]|0)+64>>2]|0;i=es(d+304|0)|0;n=bS[f&255](d,j,i)|0;if((n|0)!=0){g=1949;break}}if((g|0)==1952){k=0;l=k;return l|0}else if((g|0)==1949){k=n;l=k;return l|0}return 0}function h3(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;c[e+280>>2]=(aq(hv(e)|0,d)|0)/2048e3|0;c[e+276>>2]=h$(e,b)|0;return}function h4(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;g=e;e=f;f=d;d=0;while(1){if((d|0)>=(g|0)){break}h=hX(((c[f+264>>2]|0)+d-(c[f+276>>2]|0)|0)/512|0,c[f+280>>2]|0,16384)|0;if((h|0)<64){a[f+272|0]=1;a[f+273|0]=1}i=e+(d<<1)|0;j=hW(512,g-d|0)|0;while(1){if((j|0)==0){break}b[i>>1]=(aq(b[i>>1]|0,h)|0)>>14&65535;i=i+2|0;j=j-1|0}d=d+512|0}return}function h5(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;b=e+268|0;c[b>>2]=(c[b>>2]|0)+f;do{if((c[e+260>>2]|0)>=0){if(a[e+272|0]&1){break}h_(e,bS[c[(c[e>>2]|0)+64>>2]&255](e,f,d)|0);return}}while(0);wg(d|0,0,f<<1|0);return}function h6(b){b=b|0;var d=0;d=b;if((c[d+300>>2]|0)!=0){a5(1112,315,11984,9480)}do{if(!(a[d+272|0]&1)){h5(d,2048,es(d+304|0)|0);b=hZ(es(d+304|0)|0,2048)|0;if((b|0)>=2048){break}c[d+292>>2]=(c[d+268>>2]|0)-b;c[d+300>>2]=2048;return}}while(0);b=d+296|0;c[b>>2]=(c[b>>2]|0)+2048;return}function h7(b,d){b=b|0;d=d|0;var e=0,f=0;e=d;d=b;if((hY(d)|0)<0){a5(1112,198,12016,9864);return 0}b=d+264|0;c[b>>2]=(c[b>>2]|0)+e;b=hW(e,c[d+296>>2]|0)|0;f=d+296|0;c[f>>2]=(c[f>>2]|0)-b;e=e-b|0;b=hW(e,c[d+300>>2]|0)|0;f=d+300|0;c[f>>2]=(c[f>>2]|0)-b;e=e-b|0;do{if((e|0)!=0){if(a[d+272|0]&1){break}b=d+268|0;c[b>>2]=(c[b>>2]|0)+e;h_(d,bY[c[(c[d>>2]|0)+68>>2]&127](d,e)|0)}}while(0);if((c[d+296>>2]|c[d+300>>2]|0)!=0){return 0}e=d+273|0;a[e]=(a[e]&1|a[d+272|0]&1|0)!=0|0;return 0}function h8(a,b){a=a|0;b=b|0;return 0}function h9(a,b){a=a|0;b=b|0;return}function ia(a,b){a=a|0;b=b|0;return}function ib(a,b){a=a|0;b=+b;return}function ic(a,b){a=a|0;b=b|0;return 8392|0}function id(a,b,c){a=a|0;b=b|0;c=c|0;return 8392|0}function ie(a,b){a=a|0;b=b|0;return}function ig(a,b){a=a|0;b=b|0;return}function ih(a){a=a|0;gi(a);return}function ii(a){a=a|0;gb(a);return}function ij(a){a=a|0;ik(a);return}function ik(a){a=a|0;hQ(a);return}function il(){hG();return}function im(b){b=b|0;var c=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;c=b;io(c+472|0);b=8;while(1){e=b;b=e-1|0;if((e|0)==0){break}e=c+88+(b*48|0)|0;f=d[26304+b|0]|0;g=3;while(1){h=g-1|0;g=h;if((h|0)<0){break}h=f&1;i=(f>>1&1)-h|0;h=h*15|0;j=16;while(1){k=j-1|0;j=k;if((k|0)<0){break}k=e;e=k+1|0;a[k]=a[26256+h|0]|0;h=h+i|0}f=f>>2}}ip(c,0);iq(c,1.0);ir(c);return}function io(a){a=a|0;iD(a);return}function ip(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;iH(b,0,c);iH(b,1,c);iH(b,2,c);return}function iq(a,b){a=a|0;b=+b;iE(a+472|0,.000915032679738562*b);return}function ir(d){d=d|0;var e=0,f=0;e=d;c[e+48>>2]=0;c[e+68>>2]=0;c[e+72>>2]=1;d=e+48|0;do{d=d-16|0;c[d>>2]=16;c[d+4>>2]=0;b[d+8>>1]=0;b[d+10>>1]=0;}while((d|0)!=(e|0));d=16;while(1){f=d-1|0;d=f;if((f|0)<0){break}a[e+52+d|0]=0}a[e+59|0]=-1;iu(e,13,0);return}function is(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;f=d;d=e;e=b;if(a[e+273|0]&1){wg(d|0,0,f<<1|0);g=f;h=e+264|0;i=c[h>>2]|0;j=i+g|0;c[h>>2]=j;return 0}if((hY(e)|0)<0){a5(1112,338,12056,9864);return 0}if(((f|0)%2|0|0)!=0){a5(1112,339,12056,9160);return 0}if((c[e+268>>2]|0)<(c[e+264>>2]|0)){a5(1112,341,12056,8736);return 0}b=0;if((c[e+296>>2]|0)!=0){k=aq(c[e+284>>2]|0,(c[e+264>>2]|0)+f-(c[e+292>>2]|0)|0)|0;l=k+(c[e+292>>2]|0)|0;while(1){if((c[e+268>>2]|0)<(l|0)){m=(c[e+300>>2]|a[e+272|0]&1|0)!=0^1}else{m=0}if(!m){break}h6(e)}b=hW(c[e+296>>2]|0,f)|0;wg(d|0,0,b<<1|0);m=e+296|0;c[m>>2]=(c[m>>2]|0)-b;m=(c[e+268>>2]|0)-(c[e+292>>2]|0)|0;if((m|0)>((hv(e)|0)*12|0|0)){a[e+272|0]=1;a[e+273|0]=1;c[e+296>>2]=0;c[e+300>>2]=0}}if((c[e+300>>2]|0)!=0){m=hW(c[e+300>>2]|0,f-b|0)|0;l=d+(b<<1)|0;k=es(e+304|0)|0;n=k+(2048-(c[e+300>>2]|0)<<1)|0;k=m<<1;wh(l|0,n|0,k)|0;k=e+300|0;c[k>>2]=(c[k>>2]|0)-m;b=b+m|0}m=f-b|0;if((m|0)!=0){h5(e,m,d+(b<<1)|0);k=e+273|0;a[k]=(a[k]&1|a[e+272|0]&1|0)!=0|0;if(a[e+288|0]&1){if((c[e+264>>2]|0)>(c[e+276>>2]|0)){o=2056}}else{o=2056}if((o|0)==2056){o=hZ(d+(b<<1)|0,m)|0;if((o|0)<(m|0)){c[e+292>>2]=(c[e+268>>2]|0)-o}if(((c[e+268>>2]|0)-(c[e+292>>2]|0)|0)>=2048){h6(e)}}}if((c[e+264>>2]|0)>(c[e+276>>2]|0)){h4(e,f,d)}g=f;h=e+264|0;i=c[h>>2]|0;j=i+g|0;c[h>>2]=j;return 0}function it(a){a=a|0;var b=0;b=a;ij(b);cK(b);return}function iu(b,e,f){b=b|0;e=e|0;f=f|0;var g=0;g=e;e=f;f=b;if(g>>>0>=16){a5(8168,122,14640,10080)}if((g|0)==13){if((e&8|0)==0){e=(e&4|0)!=0?15:9}c[f+80>>2]=f+88+((e-7|0)*48|0);c[f+84>>2]=-48;c[f+76>>2]=0}a[f+52+g|0]=e&255;e=g>>1;if((e|0)>=3){return}g=((a[f+52+((e<<1)+1)|0]&15)<<12)+((d[f+52+(e<<1)|0]|0)<<4)|0;if((g|0)==0){g=16}b=f+(e<<4)|0;e=b+4|0;f=(c[e>>2]|0)+(g-(c[b>>2]|0))|0;c[e>>2]=f;if((f|0)<0){c[b+4>>2]=0}c[b>>2]=g;return}function iv(a){a=a|0;c[a+40>>2]=1;return}function iw(a){a=a|0;return c[a+28>>2]|0}function ix(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=e;e=aq(b,c[f>>2]|0)|0;iG(a,e+(c[f+4>>2]|0)|0,d,f);return}function iy(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;g=f;f=e;if((g|0)<(c[f+48>>2]|0)){a5(8168,166,14560,7016)}e=(a[f+58|0]&31)<<5;if((e|0)==0){e=32}h=c[f+68>>2]|0;i=c[f+72>>2]|0;j=(d[f+64|0]<<8)+(d[f+63|0]|0)<<5;if((j|0)==0){j=32}if((c[f+76>>2]|0)==0){c[f+76>>2]=j}k=0;while(1){if((k|0)>=3){break}l=f+(k<<4)|0;m=d[f+59|0]>>k;n=c[l+12>>2]|0;if((n|0)!=0){iv(n);o=0;p=(((iw(n)|0)+16384|0)>>>0)/32768|0;do{if((c[l>>2]|0)<=(p|0)){if((m&1|0)!=0){break}o=1;m=m|1}}while(0);p=c[f+48>>2]|0;q=g;r=d[f+52+(k+8)|0]|0;s=d[26256+(r&15)|0]>>o;t=c[f+84>>2]|0;if((r&16|0)!=0){s=d[(c[f+80>>2]|0)+t|0]>>o;do{if((a[f+65|0]&1|0)!=0){if((t|0)<-32){u=2114;break}if((s|0)==0){m=9}}else{u=2114}}while(0);if((u|0)==2114){u=0;q=p+(c[f+76>>2]|0)|0;if((q|0)>=(g|0)){q=g}}}else{if((s|0)==0){m=9}}r=c[l>>2]|0;v=p+(c[l+4>>2]|0)|0;if((m&1|0)!=0){w=(g-v+r-1|0)/(r|0)|0;v=v+(aq(w,r)|0)|0;x=l+10|0;b[x>>1]=(b[x>>1]^w&1)&65535}w=g;x=1;if((m&8|0)==0){w=p+h|0;x=i}while(1){y=0;if(((m|b[l+10>>1])&1&(m>>3|x)|0)!=0){y=s}z=y-(b[l+8>>1]|0)|0;if((z|0)!=0){b[l+8>>1]=y&65535;ix(f+472|0,p,z,n)}if((w|0)<(q|0)){u=2135}else{if((v|0)<(q|0)){u=2135}}if((u|0)==2135){u=0;z=(y<<1)-s|0;y=(z|0)!=0|0;A=b[l+10>>1]|m&1;do{B=q;if((q|0)>(v|0)){B=v}if((A&y|0)!=0){while(1){if((w|0)>(B|0)){break}C=x+1|0;x=-(x&1)&73728^x>>>1;if((C&2|0)!=0){z=-z|0;ix(f+472|0,w,z,n)}w=w+e|0}}else{C=B-w|0;if((C|0)>=0){w=w+(e+(aq((C|0)/(e|0)|0,e)|0))|0}}B=q;if((q|0)>(w|0)){B=w}if((x&y|0)!=0){while(1){if((v|0)>=(B|0)){break}z=-z|0;ix(f+472|0,v,z,n);v=v+r|0}A=(-z|0)>>>31}else{while(1){if((v|0)>=(B|0)){break}v=v+r|0;A=A^1}}if((v|0)<(q|0)){D=1}else{D=(w|0)<(q|0)}}while(D);b[l+8>>1]=z+s>>1&65535;if((m&1|0)==0){b[l+10>>1]=A&65535}}if((q|0)>=(g|0)){break}y=t+1|0;t=y;if((y|0)>=0){t=t-32|0}s=d[(c[f+80>>2]|0)+t|0]>>o;p=q;q=q+j|0;if((q|0)>(g|0)){q=g}}c[l+4>>2]=v-g;if((m&8|0)==0){c[f+68>>2]=w-g;c[f+72>>2]=x}}k=k+1|0}k=g-(c[f+48>>2]|0)-(c[f+76>>2]|0)|0;if((k|0)>=0){D=(k+j|0)/(j|0)|0;e=f+84|0;c[e>>2]=(c[e>>2]|0)+D;if((c[f+84>>2]|0)>=0){c[f+84>>2]=(c[f+84>>2]&31)-32}k=k-(aq(D,j)|0)|0;if((-k|0)>(j|0)){a5(8168,388,14560,5016)}}c[f+76>>2]=-k;if((c[f+76>>2]|0)<=0){a5(8168,391,14560,4e3)}if((c[f+84>>2]|0)<0){E=g;F=f+48|0;c[F>>2]=E;return}else{a5(8168,392,14560,3048);E=g;F=f+48|0;c[F>>2]=E;return}}function iz(){return}function iA(a,d,e){a=a|0;d=d|0;e=e|0;var f=0;f=a;a=d+88+(e*116|0)|0;if((c[a+64>>2]|0)!=3){return}c[a+56>>2]=0;c[a+68>>2]=c[f+134572+(b[f+15772+(c[a+68>>2]>>16<<1)>>1]<<2)>>2]&c[a+104>>2];c[a+104>>2]=-1;c[a+72>>2]=c[a+80>>2];c[a+76>>2]=268435456;c[a+64>>2]=0;return}function iB(a,d,e){a=a|0;d=d|0;e=e|0;var f=0;f=d+88+(e*116|0)|0;if((c[f+64>>2]|0)==3){return}if((c[f+68>>2]|0)<268435456){c[f+68>>2]=(b[a+15772+(c[f+68>>2]>>16<<1)>>1]<<16)+268435456}c[f+72>>2]=c[f+92>>2];c[f+76>>2]=536870912;c[f+64>>2]=3;return}function iC(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;c[d+32>>2]=0;c[d+36>>2]=2147483647;c[d+28>>2]=a;if((a&4|0)==0){return}c[d+32>>2]=4095;c[d+36>>2]=4095;return}function iD(a){a=a|0;var b=0;b=a;ck(b|0,b+40|0,12);return}function iE(a,b){a=a|0;b=+b;cM(a|0,b*1.0);return}function iF(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=b;b=d;d=a;a=e&3;if((a|0)==3){f=1;g=f;return g|0}h=d+40+((a+((e&256|0)!=0?3:0)|0)*556|0)|0;a=h+88+((e>>2&3)*116|0)|0;i=e&240;if((i|0)==48){e=b&15;c[a+4>>2]=e;if((e|0)!=0){e=a+4|0;c[e>>2]=c[e>>2]<<1}else{c[a+4>>2]=1}c[a>>2]=d+14524+((b>>4&7)<<7);c[h+148>>2]=-1}else if((i|0)==80){c[a+20>>2]=3-(b>>6);c[h+148>>2]=-1;e=b&31;b=e;if((e|0)!=0){c[a+40>>2]=d+13628+(b<<1<<2)}else{c[a+40>>2]=d+15612}c[a+80>>2]=c[(c[a+40>>2]|0)+(c[a+24>>2]<<2)>>2];if((c[a+64>>2]|0)==0){c[a+72>>2]=c[a+80>>2]}}else if((i|0)==112){e=b&31;b=e;if((e|0)!=0){c[a+48>>2]=d+14140+(b<<1<<2)}else{c[a+48>>2]=d+15612}c[a+88>>2]=c[(c[a+48>>2]|0)+(c[a+24>>2]<<2)>>2];do{if((c[a+64>>2]|0)==2){if((c[a+68>>2]|0)>=536870912){break}c[a+72>>2]=c[a+88>>2]}}while(0)}else if((i|0)==96){e=b&128;c[a+112>>2]=e;if((e|0)!=0){c[a+108>>2]=c[h+36>>2]}else{c[a+108>>2]=31}h=b&31;b=h;if((h|0)!=0){c[a+44>>2]=d+14140+(b<<1<<2)}else{c[a+44>>2]=d+15612}c[a+84>>2]=c[(c[a+44>>2]|0)+(c[a+24>>2]<<2)>>2];if((c[a+64>>2]|0)==1){c[a+72>>2]=c[a+84>>2]}}else if((i|0)==64){c[a+8>>2]=b&127;iz();c[a+12>>2]=c[a+8>>2]<<5}else if((i|0)==128){c[a+16>>2]=c[d+15548+(b>>4<<2)>>2];c[a+52>>2]=d+14140+(((b&15)<<2)+2<<2);c[a+92>>2]=c[(c[a+52>>2]|0)+(c[a+24>>2]<<2)>>2];do{if((c[a+64>>2]|0)==3){if((c[a+68>>2]|0)>=536870912){break}c[a+72>>2]=c[a+92>>2]}}while(0)}else if((i|0)==144){if((b&8|0)!=0){j=b&15}else{j=0}iC(a,j)}f=0;g=f;return g|0}function iG(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;g=d;d=e;e=f;f=a;if((g>>>16|0)>=(c[e+12>>2]|0)){a5(2408,342,11624,1696)}d=aq(d,c[f+8>>2]|0)|0;a=(c[e+8>>2]|0)+(g>>>16<<2)|0;e=g>>>10&63;g=f+168+(-e<<1)|0;h=b[g>>1]|0;i=aq(h,d)|0;j=i+(c[a+8>>2]|0)|0;i=aq(b[g+128>>1]|0,d)|0;k=i+(c[a+12>>2]|0)|0;h=b[g+256>>1]|0;c[a+8>>2]=j;c[a+12>>2]=k;k=aq(h,d)|0;j=k+(c[a+16>>2]|0)|0;k=aq(b[g+384>>1]|0,d)|0;i=k+(c[a+20>>2]|0)|0;h=b[g+512>>1]|0;c[a+16>>2]=j;c[a+20>>2]=i;i=aq(h,d)|0;j=i+(c[a+24>>2]|0)|0;i=aq(b[g+640>>1]|0,d)|0;k=i+(c[a+28>>2]|0)|0;g=f+40+(e<<1)|0;h=b[g+640>>1]|0;c[a+24>>2]=j;c[a+28>>2]=k;k=aq(h,d)|0;j=k+(c[a+32>>2]|0)|0;k=aq(b[g+512>>1]|0,d)|0;e=k+(c[a+36>>2]|0)|0;h=b[g+384>>1]|0;c[a+32>>2]=j;c[a+36>>2]=e;e=aq(h,d)|0;j=e+(c[a+40>>2]|0)|0;e=aq(b[g+256>>1]|0,d)|0;k=e+(c[a+44>>2]|0)|0;h=b[g+128>>1]|0;c[a+40>>2]=j;c[a+44>>2]=k;k=aq(h,d)|0;h=k+(c[a+48>>2]|0)|0;k=aq(b[g>>1]|0,d)|0;d=k+(c[a+52>>2]|0)|0;c[a+48>>2]=h;c[a+52>>2]=d;return}function iH(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=3){a5(1064,86,14680,696)}c[a+(e<<4)+12>>2]=d;return}function iI(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=b;b=e;e=a;a=f&3;if((a|0)==3){g=1;h=g;return h|0}i=e+40+((a+((f&256|0)!=0?3:0)|0)*556|0)|0;j=f&252;if((j|0)==168){if((f|0)<256){a=a+1|0;iz();c[e+1192+(a<<2)>>2]=(c[e+1192+(a<<2)>>2]&1792)+b;c[e+1224+(a<<2)>>2]=c[e+1208+(a<<2)>>2]<<2|(d[26272+(c[e+1192+(a<<2)>>2]>>7)|0]|0);c[e+1300>>2]=-1}}else if((j|0)==172){if((f|0)<256){a=a+1|0;iz();c[e+1192+(a<<2)>>2]=(c[e+1192+(a<<2)>>2]&255)+((b&7)<<8);c[e+1208+(a<<2)>>2]=(b&56)>>3;c[e+1224+(a<<2)>>2]=c[e+1208+(a<<2)>>2]<<2|(d[26272+(c[e+1192+(a<<2)>>2]>>7)|0]|0);c[e+1300>>2]=-1}}else if((j|0)==160){iz();c[i+40>>2]=(c[i+40>>2]&1792)+b;c[i+72>>2]=c[i+56>>2]<<2|(d[26272+(c[i+40>>2]>>7)|0]|0);c[i+148>>2]=-1}else if((j|0)==164){iz();c[i+40>>2]=(c[i+40>>2]&255)+((b&7)<<8);c[i+56>>2]=(b&56)>>3;c[i+72>>2]=c[i+56>>2]<<2|(d[26272+(c[i+40>>2]>>7)|0]|0);c[i+148>>2]=-1}else if((j|0)==176){if((c[i+24>>2]|0)!=(b&7|0)){iz();c[i+24>>2]=b&7;c[i+192>>2]=0;c[i+308>>2]=0;c[i+424>>2]=0;c[i+540>>2]=0}c[i+28>>2]=9-(b>>3&7)}else if((j|0)==180){iz();c[i+16>>2]=-(b>>7&1);c[i+20>>2]=-(b>>6&1);c[i+36>>2]=d[28584+(b>>4&3)|0]|0;c[i+32>>2]=d[28576+(b&7)|0]|0;b=0;while(1){if((b|0)>=4){break}j=i+88+(b*116|0)|0;if((c[j+112>>2]|0)!=0){k=c[i+36>>2]|0}else{k=31}c[j+108>>2]=k;b=b+1|0}}g=0;h=g;return h|0}function iJ(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=d;d=a;a=b;if((a|0)==34){if((e&8|0)!=0){c[d+13624>>2]=c[d+15740+((e&7)<<2)>>2]}else{c[d+13620>>2]=0;c[d+13624>>2]=0}}else if((a|0)==36){c[d+8>>2]=c[d+8>>2]&3|e<<2;if((c[d+12>>2]|0)!=(1024-(c[d+8>>2]|0)<<12|0)){b=1024-(c[d+8>>2]|0)<<12;c[d+12>>2]=b;c[d+16>>2]=b}}else if((a|0)==37){c[d+8>>2]=c[d+8>>2]&1020|e&3;if((c[d+12>>2]|0)!=(1024-(c[d+8>>2]|0)<<12|0)){b=1024-(c[d+8>>2]|0)<<12;c[d+12>>2]=b;c[d+16>>2]=b}}else if((a|0)==38){c[d+20>>2]=e;if((c[d+24>>2]|0)!=(256-(c[d+20>>2]|0)<<16|0)){b=256-(c[d+20>>2]|0)<<16;c[d+24>>2]=b;c[d+28>>2]=b}}else if((a|0)==39){if(((e^c[d+32>>2])&64|0)!=0){iz();c[d+1300>>2]=-1}b=d+4|0;c[b>>2]=c[b>>2]&(~e>>4&e>>2);c[d+32>>2]=e}else if((a|0)==40){b=e&3;if((b|0)==3){f=1;g=f;return g|0}if((e&4|0)!=0){b=b+3|0}h=d+40+(b*556|0)|0;iz();if((e&16|0)!=0){iA(d,h,0)}else{iB(d,h,0)}if((e&32|0)!=0){iA(d,h,2)}else{iB(d,h,2)}if((e&64|0)!=0){iA(d,h,1)}else{iB(d,h,1)}if((e&128|0)!=0){iA(d,h,3)}else{iB(d,h,3)}}else if((a|0)==43){if((c[d+36>>2]^e&128|0)!=0){iz()}c[d+36>>2]=e&128}f=0;g=f;return g|0}function iK(a){a=a|0;var b=0,d=0,e=0;b=a;c[b+13620>>2]=0;c[b+8>>2]=0;c[b+12>>2]=0;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;c[b+28>>2]=0;c[b+36>>2]=0;c[b+4>>2]=0;a=0;while(1){if((a|0)>=6){break}d=b+40+(a*556|0)|0;c[d+16>>2]=-1;c[d+20>>2]=-1;c[d+24>>2]=0;c[d+28>>2]=31;c[d+32>>2]=0;c[d+36>>2]=0;e=0;while(1){if((e|0)>=4){break}c[d+(e<<2)>>2]=0;c[d+40+(e<<2)>>2]=0;c[d+56+(e<<2)>>2]=0;c[d+72+(e<<2)>>2]=0;c[d+88+(e*116|0)+56>>2]=0;c[d+88+(e*116|0)+60>>2]=0;c[d+88+(e*116|0)+68>>2]=536870912;c[d+88+(e*116|0)+72>>2]=0;c[d+88+(e*116|0)+76>>2]=0;c[d+88+(e*116|0)+64>>2]=3;c[d+88+(e*116|0)+104>>2]=0;e=e+1|0}a=a+1|0}a=0;while(1){if((a|0)>=256){break}c[b+3376+(a<<2)>>2]=-1;c[b+4400+(a<<2)>>2]=-1;a=a+1|0}a=182;while(1){if((a|0)<180){break}iV(b,a,192);iW(b,a,192);a=a-1|0}a=178;while(1){if((a|0)<34){break}iV(b,a,0);iW(b,a,0);a=a-1|0}iV(b,42,128);return}function iL(a,e,f){a=a|0;e=+e;f=+f;var g=0.0,h=0,i=0,j=0,k=0;g=e;e=f;h=a;if(g==0.0){a5(7792,633,15512,10056)}if(e<=g){a5(7792,634,15512,6984)}f=e/g/144.0;if(+ad(+(f-1.0))<1.0e-7){f=1.0}c[h>>2]=~~(f*4096.0);a=0;while(1){if((a|0)>=12288){break}if((a|0)>=3328){c[h+36268+(a<<2)>>2]=0;c[h+36268+(a+12288<<2)>>2]=0}else{e=268435455.0;e=e/+af(10.0,+(+(a|0)*.0234375/20.0));c[h+36268+(a<<2)>>2]=~~e;c[h+36268+(a+12288<<2)>>2]=-(c[h+36268+(a<<2)>>2]|0)}a=a+1|0}b[h+9524>>1]=3328;b[h+5428>>1]=3328;a=1;while(1){if((a|0)>1024){break}e=+ah(+(+(a|0)*6.283185307179586/4096.0));e=+bc(+(1.0/e))*20.0;i=~~(e/.0234375);if((i|0)>3328){i=3328}j=i&65535;b[h+5428+(2048-a<<1)>>1]=j;b[h+5428+(a<<1)>>1]=j;j=i+12288&65535;b[h+5428+(4096-a<<1)>>1]=j;b[h+5428+(a+2048<<1)>>1]=j;a=a+1|0}a=0;while(1){if((a|0)>=1024){break}e=+ah(+(+(a|0)*6.283185307179586/1024.0));e=e+1.0;e=e/2.0;e=e*503.4666666666667;b[h+32172+(a<<1)>>1]=~~e&65535;e=+ah(+(+(a|0)*6.283185307179586/1024.0));e=e*511.0;b[h+34220+(a<<1)>>1]=~~e&65535;a=a+1|0}a=0;while(1){if((a|0)>=4096){break}e=+af(+(+(4095-a|0)/4096.0),8.0);e=e*4096.0;b[h+15772+(a<<1)>>1]=~~e&65535;e=+af(+(+(a|0)/4096.0),1.0);e=e*4096.0;b[h+15772+(a+4096<<1)>>1]=~~e&65535;a=a+1|0}a=0;while(1){if((a|0)>=8){break}b[h+15772+(a+8192<<1)>>1]=0;a=a+1|0}b[h+32156>>1]=4095;j=4095;a=0;while(1){if((a|0)>=4096){break}while(1){if((j|0)!=0){k=(b[h+15772+(j<<1)>>1]|0)<(a|0)}else{k=0}if(!k){break}j=j-1|0}c[h+134572+(a<<2)>>2]=j<<16;a=a+1|0}a=0;while(1){if((a|0)>=15){break}e=+(a*3|0|0);e=e/.0234375;c[h+15548+(a<<2)>>2]=(~~e<<16)+268435456;a=a+1|0}c[h+15608>>2]=536805376;a=0;while(1){if((a|0)>=2048){break}e=+(a|0)*f;e=e*4096.0;e=e/2.0;c[h+150956+(a<<2)>>2]=~~e;a=a+1|0}a=0;while(1){if((a|0)>=4){break}c[h+13628+(a<<2)>>2]=0;c[h+14140+(a<<2)>>2]=0;a=a+1|0}a=0;while(1){if((a|0)>=60){break}e=f;e=e*(+(a&3|0)*.25+1.0);e=e*+(1<<(a>>2)|0);e=e*268435456.0;c[h+13628+(a+4<<2)>>2]=~~(e/399128.0);c[h+14140+(a+4<<2)>>2]=~~(e/5514396.0);a=a+1|0}a=64;while(1){if((a|0)>=96){break}c[h+13628+(a<<2)>>2]=c[h+13880>>2];c[h+14140+(a<<2)>>2]=c[h+14392>>2];c[h+15612+(a-64<<2)>>2]=0;a=a+1|0}a=96;while(1){if((a|0)>=128){break}c[h+13628+(a<<2)>>2]=0;a=a+1|0}a=0;while(1){if((a|0)>=4){break}j=0;while(1){if((j|0)>=32){break}e=+((d[28640+((a<<5)+j)|0]|0)>>>0)*f*32.0;c[h+14524+(a<<7)+(j<<2)>>2]=~~e;c[h+14524+(a+4<<7)+(j<<2)>>2]=~~(-0.0-e);j=j+1|0}a=a+1|0}c[h+15740>>2]=~~(1068373114.88/g);c[h+15744>>2]=~~(1492501135.36/g);c[h+15748>>2]=~~(1615981445.12/g);c[h+15752>>2]=~~(1709933854.72/g);c[h+15756>>2]=~~(1846835937.28/g);c[h+15760>>2]=~~(2585033441.28/g);c[h+15764>>2]=~~(12911745433.6/g);c[h+15768>>2]=~~(19381039923.2/g);iK(h);return}function iM(a,b){a=a|0;b=b|0;c[(c[a>>2]|0)+5424>>2]=b;return}function iN(a,b,d){a=a|0;b=+b;d=+d;var e=0.0,f=0,g=0,h=0;e=b;b=d;f=a;do{if((c[f>>2]|0)==0){c[f>>2]=vi(159148)|0;if((c[f>>2]|0)!=0){c[(c[f>>2]|0)+5424>>2]=0;break}g=5e3;h=g;return h|0}}while(0);wg(c[f>>2]|0,0,5424);iL(c[f>>2]|0,e,b);g=0;h=g;return h|0}function iO(a){a=a|0;vk(c[a>>2]|0);return}function iP(a){a=a|0;iK(c[a>>2]|0);return}function iQ(a,b,d){a=a|0;b=b|0;d=d|0;iV(c[a>>2]|0,b,d);return}function iR(a,b,d){a=a|0;b=b|0;d=d|0;iW(c[a>>2]|0,b,d);return}function iS(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;a=b;do{b=6;if((b|0)>(a|0)){b=a}a=a-b|0;e=aq(b,c[d>>2]|0)|0;if((c[d+32>>2]&1|0)!=0){b=d+16|0;f=(c[b>>2]|0)-e|0;c[b>>2]=f;if((f|0)<=0){f=d+4|0;c[f>>2]=c[f>>2]|(c[d+32>>2]&4)>>2;f=d+16|0;c[f>>2]=(c[f>>2]|0)+(c[d+12>>2]|0);if((c[d+32>>2]&128|0)!=0){iA(d,d+1152|0,0);iA(d,d+1152|0,1);iA(d,d+1152|0,2);iA(d,d+1152|0,3)}}}if((c[d+32>>2]&2|0)!=0){f=d+28|0;b=(c[f>>2]|0)-e|0;c[f>>2]=b;if((b|0)<=0){b=d+4|0;c[b>>2]=c[b>>2]|(c[d+32>>2]&8)>>2;b=d+28|0;c[b>>2]=(c[b>>2]|0)+(c[d+24>>2]|0)}}}while((a|0)>0);return}function iT(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=b;b=d;d=a;if((e|0)<=0){return}if((c[d+32>>2]&3|0)!=0){iS(d,e)}a=0;while(1){if((a|0)>=6){break}f=d+40+(a*556|0)|0;if((c[f+148>>2]|0)==-1){g=0;do{if((a|0)==2){if((c[d+32>>2]&64|0)==0){break}g=2}}while(0);h=0;while(1){if((h|0)>=4){break}i=f+88+(h*116|0)|0;j=c[f+72+(g<<2)>>2]>>c[i+20>>2];c[i+60>>2]=aq(((c[d+150956+(c[f+40+(g<<2)>>2]<<2)>>2]|0)>>>((7-(c[f+56+(g<<2)>>2]|0)|0)>>>0))+(c[(c[i>>2]|0)+(c[f+72+(g<<2)>>2]<<2)>>2]|0)|0,c[i+4>>2]|0)|0;if((c[i+24>>2]|0)!=(j|0)){c[i+24>>2]=j;c[i+80>>2]=c[(c[i+40>>2]|0)+(j<<2)>>2];c[i+84>>2]=c[(c[i+44>>2]|0)+(j<<2)>>2];c[i+88>>2]=c[(c[i+48>>2]|0)+(j<<2)>>2];c[i+92>>2]=c[(c[i+52>>2]|0)+(j<<2)>>2];if((c[i+64>>2]|0)==0){c[i+72>>2]=c[i+80>>2]}else{if((c[i+64>>2]|0)==1){c[i+72>>2]=c[i+84>>2]}else{if((c[i+68>>2]|0)<536870912){if((c[i+64>>2]|0)==2){c[i+72>>2]=c[i+88>>2]}else{if((c[i+64>>2]|0)==3){c[i+72>>2]=c[i+92>>2]}}}}}}if((g|0)!=0){g=g^2^g>>1}h=h+1|0}}a=a+1|0}a=0;while(1){if((a|0)>=6){break}do{if((c[d+5424>>2]&1<<a|0)==0){if((a|0)==5){if((c[d+36>>2]|0)!=0){break}}bZ[c[28544+(c[d+40+(a*556|0)+24>>2]<<2)>>2]&63](d+5428|0,d+40+(a*556|0)|0,b,e)}}while(0);a=a+1|0}a=aq(c[d+13624>>2]|0,e)|0;e=d+13620|0;c[e>>2]=(c[e>>2]|0)+a;return}function iU(a,b,d){a=a|0;b=b|0;d=d|0;iT(c[a>>2]|0,b,d);return}function iV(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=b;b=d;d=a;if(b>>>0>255){a5(7792,850,15600,3976)}if((e|0)<48){c[d+3376+(e<<2)>>2]=b;a=e;f=b;iJ(d,a,f)|0;return}if((c[d+3376+(e<<2)>>2]|0)!=(b|0)){c[d+3376+(e<<2)>>2]=b;if((e|0)<160){f=e;a=b;iF(d,f,a)|0}else{a=e;e=b;iI(d,a,e)|0}}return}function iW(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=b;b=d;d=a;if(b>>>0>255){a5(7792,870,15560,3976)}if((e|0)<48){return}if((c[d+4400+(e<<2)>>2]|0)==(b|0)){return}c[d+4400+(e<<2)>>2]=b;if((e|0)<160){a=e+256|0;f=b;iF(d,a,f)|0}else{f=e+256|0;e=b;iI(d,f,e)|0}return}function iX(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=c[a+4>>2]|0;h=c[a+144>>2]|0;i=c[a+376>>2]|0;j=c[a+260>>2]|0;k=c[a+492>>2]|0;l=c[g+8196>>2]|0;m=(c[g+8192>>2]|0)+l|0;if(((c[a+504>>2]|0)-536870912|0)==0){return}do{n=b[g+26744+((m>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=h+(t+f>>c[a+28>>2])|0;f=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(n>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=i+f|0;p=j+(c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(n>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)|0;p=k+(c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(n>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)|0;r=c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(n>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0;r=r>>16;s=((aq(b[g+28792+((m>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;m=m+l|0;h=h+((aq(c[a+148>>2]|0,s)|0)>>>8)|0;i=i+((aq(c[a+380>>2]|0,s)|0)>>>8)|0;j=j+((aq(c[a+264>>2]|0,s)|0)>>>8)|0;k=k+((aq(c[a+496>>2]|0,s)|0)>>>8)|0;s=(b[d>>1]|0)+(r&c[a+16>>2])|0;n=(b[d+2>>1]|0)+(r&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=s&65535;b[d+2>>1]=n&65535;d=d+4|0;n=e-1|0;e=n;}while((n|0)!=0);c[a+4>>2]=f;c[a+144>>2]=h;c[a+376>>2]=i;c[a+260>>2]=j;c[a+492>>2]=k;return}function iY(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=c[a+4>>2]|0;h=c[a+144>>2]|0;i=c[a+376>>2]|0;j=c[a+260>>2]|0;k=c[a+492>>2]|0;l=c[g+8196>>2]|0;m=(c[g+8192>>2]|0)+l|0;if(((c[a+504>>2]|0)-536870912|0)==0){return}do{n=b[g+26744+((m>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=h+(t+f>>c[a+28>>2])|0;f=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(n>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=j+f+(c[o+((b[g+((i>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(n>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)|0;p=k+(c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(n>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)|0;r=c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(n>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0;r=r>>16;s=((aq(b[g+28792+((m>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;m=m+l|0;h=h+((aq(c[a+148>>2]|0,s)|0)>>>8)|0;i=i+((aq(c[a+380>>2]|0,s)|0)>>>8)|0;j=j+((aq(c[a+264>>2]|0,s)|0)>>>8)|0;k=k+((aq(c[a+496>>2]|0,s)|0)>>>8)|0;s=(b[d>>1]|0)+(r&c[a+16>>2])|0;n=(b[d+2>>1]|0)+(r&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=s&65535;b[d+2>>1]=n&65535;d=d+4|0;n=e-1|0;e=n;}while((n|0)!=0);c[a+4>>2]=f;c[a+144>>2]=h;c[a+376>>2]=i;c[a+260>>2]=j;c[a+492>>2]=k;return}function iZ(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=c[a+4>>2]|0;h=c[a+144>>2]|0;i=c[a+376>>2]|0;j=c[a+260>>2]|0;k=c[a+492>>2]|0;l=c[g+8196>>2]|0;m=(c[g+8192>>2]|0)+l|0;if(((c[a+504>>2]|0)-536870912|0)==0){return}do{n=b[g+26744+((m>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=h+(t+f>>c[a+28>>2])|0;f=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(n>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=j+(c[o+((b[g+((i>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(n>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)|0;p=k+f+(c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(n>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)|0;r=c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(n>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0;r=r>>16;s=((aq(b[g+28792+((m>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;m=m+l|0;h=h+((aq(c[a+148>>2]|0,s)|0)>>>8)|0;i=i+((aq(c[a+380>>2]|0,s)|0)>>>8)|0;j=j+((aq(c[a+264>>2]|0,s)|0)>>>8)|0;k=k+((aq(c[a+496>>2]|0,s)|0)>>>8)|0;s=(b[d>>1]|0)+(r&c[a+16>>2])|0;n=(b[d+2>>1]|0)+(r&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=s&65535;b[d+2>>1]=n&65535;d=d+4|0;n=e-1|0;e=n;}while((n|0)!=0);c[a+4>>2]=f;c[a+144>>2]=h;c[a+376>>2]=i;c[a+260>>2]=j;c[a+492>>2]=k;return}function i_(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=c[a+4>>2]|0;h=c[a+144>>2]|0;i=c[a+376>>2]|0;j=c[a+260>>2]|0;k=c[a+492>>2]|0;l=c[g+8196>>2]|0;m=(c[g+8192>>2]|0)+l|0;if(((c[a+504>>2]|0)-536870912|0)==0){return}do{n=b[g+26744+((m>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=h+(t+f>>c[a+28>>2])|0;f=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(n>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=i+f|0;p=k+(c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(n>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((j>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(n>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)|0;r=c[o+((b[g+((p>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(n>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0;r=r>>16;s=((aq(b[g+28792+((m>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;m=m+l|0;h=h+((aq(c[a+148>>2]|0,s)|0)>>>8)|0;i=i+((aq(c[a+380>>2]|0,s)|0)>>>8)|0;j=j+((aq(c[a+264>>2]|0,s)|0)>>>8)|0;k=k+((aq(c[a+496>>2]|0,s)|0)>>>8)|0;s=(b[d>>1]|0)+(r&c[a+16>>2])|0;n=(b[d+2>>1]|0)+(r&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=s&65535;b[d+2>>1]=n&65535;d=d+4|0;n=e-1|0;e=n;}while((n|0)!=0);c[a+4>>2]=f;c[a+144>>2]=h;c[a+376>>2]=i;c[a+260>>2]=j;c[a+492>>2]=k;return}function i$(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=(c[a+504>>2]|0)-536870912|0;f=f|(c[a+388>>2]|0)-536870912;h=c[a+4>>2]|0;i=c[a+144>>2]|0;j=c[a+376>>2]|0;k=c[a+260>>2]|0;l=c[a+492>>2]|0;m=c[g+8196>>2]|0;n=(c[g+8192>>2]|0)+m|0;if((f|0)==0){return}do{f=b[g+26744+((n>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=i+(t+h>>c[a+28>>2])|0;h=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(f>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=(c[o+((b[g+((l+(c[o+((b[g+((k>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(f>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(f>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((j+h>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(f>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)|0;p=p>>16;q=((aq(b[g+28792+((n>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;n=n+m|0;i=i+((aq(c[a+148>>2]|0,q)|0)>>>8)|0;j=j+((aq(c[a+380>>2]|0,q)|0)>>>8)|0;k=k+((aq(c[a+264>>2]|0,q)|0)>>>8)|0;l=l+((aq(c[a+496>>2]|0,q)|0)>>>8)|0;q=(b[d>>1]|0)+(p&c[a+16>>2])|0;f=(b[d+2>>1]|0)+(p&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=q&65535;b[d+2>>1]=f&65535;d=d+4|0;f=e-1|0;e=f;}while((f|0)!=0);c[a+4>>2]=h;c[a+144>>2]=i;c[a+376>>2]=j;c[a+260>>2]=k;c[a+492>>2]=l;return}function i0(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=(c[a+504>>2]|0)-536870912|0;f=f|(c[a+272>>2]|0)-536870912;f=f|(c[a+388>>2]|0)-536870912;h=c[a+4>>2]|0;i=c[a+144>>2]|0;j=c[a+376>>2]|0;k=c[a+260>>2]|0;l=c[a+492>>2]|0;m=c[g+8196>>2]|0;n=(c[g+8192>>2]|0)+m|0;if((f|0)==0){return}do{f=b[g+26744+((n>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=i+(t+h>>c[a+28>>2])|0;h=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(f>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=h;u=(c[o+((b[g+((l+p>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(f>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((j+p>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(f>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((k+p>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(f>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)|0;u=u>>16;r=((aq(b[g+28792+((n>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;n=n+m|0;i=i+((aq(c[a+148>>2]|0,r)|0)>>>8)|0;j=j+((aq(c[a+380>>2]|0,r)|0)>>>8)|0;k=k+((aq(c[a+264>>2]|0,r)|0)>>>8)|0;l=l+((aq(c[a+496>>2]|0,r)|0)>>>8)|0;r=(b[d>>1]|0)+(u&c[a+16>>2])|0;f=(b[d+2>>1]|0)+(u&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=r&65535;b[d+2>>1]=f&65535;d=d+4|0;f=e-1|0;e=f;}while((f|0)!=0);c[a+4>>2]=h;c[a+144>>2]=i;c[a+376>>2]=j;c[a+260>>2]=k;c[a+492>>2]=l;return}function i1(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=(c[a+504>>2]|0)-536870912|0;f=f|(c[a+272>>2]|0)-536870912;f=f|(c[a+388>>2]|0)-536870912;h=c[a+4>>2]|0;i=c[a+144>>2]|0;j=c[a+376>>2]|0;k=c[a+260>>2]|0;l=c[a+492>>2]|0;m=c[g+8196>>2]|0;n=(c[g+8192>>2]|0)+m|0;if((f|0)==0){return}do{f=b[g+26744+((n>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=i+(t+h>>c[a+28>>2])|0;h=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(f>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=(c[o+((b[g+((l>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(f>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((j+h>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(f>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((k>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(f>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)|0;p=p>>16;r=((aq(b[g+28792+((n>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;n=n+m|0;i=i+((aq(c[a+148>>2]|0,r)|0)>>>8)|0;j=j+((aq(c[a+380>>2]|0,r)|0)>>>8)|0;k=k+((aq(c[a+264>>2]|0,r)|0)>>>8)|0;l=l+((aq(c[a+496>>2]|0,r)|0)>>>8)|0;r=(b[d>>1]|0)+(p&c[a+16>>2])|0;f=(b[d+2>>1]|0)+(p&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=r&65535;b[d+2>>1]=f&65535;d=d+4|0;f=e-1|0;e=f;}while((f|0)!=0);c[a+4>>2]=h;c[a+144>>2]=i;c[a+376>>2]=j;c[a+260>>2]=k;c[a+492>>2]=l;return}function i2(a){a=a|0;var b=0;b=a;c[b+16>>2]=0;c[b>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;c[b+12>>2]=0;return}function i3(a){a=a|0;var b=0;b=a;c[b+24>>2]=0;c[b+28>>2]=0;c[b+32>>2]=0;c[b+20>>2]=3;c[b+16>>2]=c[b+12>>2];return}function i4(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=a;a=d;d=e;e=f;f=(c[a+504>>2]|0)-536870912|0;f=f|(c[a+156>>2]|0)-536870912;f=f|(c[a+272>>2]|0)-536870912;f=f|(c[a+388>>2]|0)-536870912;h=c[a+4>>2]|0;i=c[a+144>>2]|0;j=c[a+376>>2]|0;k=c[a+260>>2]|0;l=c[a+492>>2]|0;m=c[g+8196>>2]|0;n=(c[g+8192>>2]|0)+m|0;if((f|0)==0){return}do{f=b[g+26744+((n>>18&1023)<<1)>>1]|0;o=g+10344|0;p=(b[o+(c[a+156>>2]>>16<<1)>>1]|0)+(c[a+100>>2]|0)|0;q=(b[o+(c[a+388>>2]>>16<<1)>>1]|0)+(c[a+332>>2]|0)|0;r=(b[o+(c[a+272>>2]>>16<<1)>>1]|0)+(c[a+216>>2]|0)|0;s=(b[o+(c[a+504>>2]>>16<<1)>>1]|0)+(c[a+448>>2]|0)|0;o=g+30840|0;t=c[a>>2]|0;u=i+(t+h>>c[a+28>>2])|0;h=t;t=c[o+((b[g+((u>>14&4095)<<1)>>1]|0)+((p^c[a+120>>2])+(f>>c[a+196>>2])&p-(c[a+124>>2]|0)>>31)<<2)>>2]|0;p=(c[o+((b[g+((l>>14&4095)<<1)>>1]|0)+((s^c[a+468>>2])+(f>>c[a+544>>2])&s-(c[a+472>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((j>>14&4095)<<1)>>1]|0)+((q^c[a+352>>2])+(f>>c[a+428>>2])&q-(c[a+356>>2]|0)>>31)<<2)>>2]|0)+(c[o+((b[g+((k>>14&4095)<<1)>>1]|0)+((r^c[a+236>>2])+(f>>c[a+312>>2])&r-(c[a+240>>2]|0)>>31)<<2)>>2]|0)+h|0;p=p>>16;r=((aq(b[g+28792+((n>>18&1023)<<1)>>1]|0,c[a+32>>2]|0)|0)>>10)+256|0;n=n+m|0;i=i+((aq(c[a+148>>2]|0,r)|0)>>>8)|0;j=j+((aq(c[a+380>>2]|0,r)|0)>>>8)|0;k=k+((aq(c[a+264>>2]|0,r)|0)>>>8)|0;l=l+((aq(c[a+496>>2]|0,r)|0)>>>8)|0;r=(b[d>>1]|0)+(p&c[a+16>>2])|0;f=(b[d+2>>1]|0)+(p&c[a+20>>2])|0;i5(a+88|0);i5(a+204|0);i5(a+320|0);i5(a+436|0);c[a>>2]=t;b[d>>1]=r&65535;b[d+2>>1]=f&65535;d=d+4|0;f=e-1|0;e=f;}while((f|0)!=0);c[a+4>>2]=h;c[a+144>>2]=i;c[a+376>>2]=j;c[a+260>>2]=k;c[a+492>>2]=l;return}function i5(a){a=a|0;var b=0,d=0,e=0;b=a;a=c[b+76>>2]|0;d=b+68|0;e=(c[d>>2]|0)+(c[b+72>>2]|0)|0;c[d>>2]=e;if((e|0)<(a|0)){return}i6(b);return}function i6(a){a=a|0;var b=0,d=0;b=a;a=c[b+64>>2]|0;if((a|0)==1){c[b+68>>2]=c[b+16>>2];c[b+72>>2]=c[b+88>>2];c[b+76>>2]=536870912;c[b+64>>2]=2;return}else if((a|0)==2){do{if((c[b+28>>2]&8|0)!=0){d=c[b+28>>2]&1;if((d|0)==0){c[b+68>>2]=0;c[b+72>>2]=c[b+80>>2];c[b+76>>2]=268435456;c[b+64>>2]=0}iC(b,c[b+28>>2]<<1&4);if((d|0)!=0){break}return}}while(0)}else if((a|0)==0){c[b+68>>2]=268435456;c[b+72>>2]=c[b+84>>2];c[b+76>>2]=c[b+16>>2];c[b+64>>2]=1;return}else if((a|0)!=3){return}c[b+68>>2]=536870912;c[b+72>>2]=0;c[b+76>>2]=536870913;return}function i7(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=b;b=d;d=a;do{if((c[d+32>>2]|0)!=0){if((c[d+36>>2]|0)<=128){break}if((c[d+40>>2]|0)!=0){f=c[d+32>>2]|0}else{f=-(c[d+32>>2]|0)|0}a=f;g=a-(c[d+28>>2]|0)|0;if((g|0)!=0){c[d+28>>2]=a;ix(c[d+44>>2]|0,e,g,c[d+16>>2]|0)}e=e+(c[d+24>>2]|0)|0;if((e|0)<(b|0)){g=c[d+16>>2]|0;h=a<<1;do{h=-h|0;i9(c[d+44>>2]|0,e,h,g);e=e+(c[d+36>>2]|0)|0;a=d+40|0;c[a>>2]=c[a>>2]^1;}while((e|0)<(b|0));if((c[d+40>>2]|0)!=0){i=c[d+32>>2]|0}else{i=-(c[d+32>>2]|0)|0}c[d+28>>2]=i}j=e;k=b;l=j-k|0;m=d;n=m+24|0;c[n>>2]=l;return}}while(0);if((c[d+28>>2]|0)!=0){ix(c[d+44>>2]|0,e,-(c[d+28>>2]|0)|0,c[d+16>>2]|0);c[d+28>>2]=0}e=e+(c[d+24>>2]|0)|0;if((c[d+36>>2]|0)!=0){if((e|0)<(b|0)){i=(b-e+(c[d+36>>2]|0)-1|0)/(c[d+36>>2]|0)|0;c[d+40>>2]=(c[d+40>>2]|0)+i&1;e=e+(aq(i,c[d+36>>2]|0)|0)|0}}else{e=b}j=e;k=b;l=j-k|0;m=d;n=m+24|0;c[n>>2]=l;return}function i8(a){a=a|0;return}function i9(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=e;e=aq(b,c[f>>2]|0)|0;iG(a,e+(c[f+4>>2]|0)|0,d,f);return}function ja(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=b;b=d;d=a;a=c[d+32>>2]|0;if((c[d+40>>2]&1|0)!=0){a=-a|0}f=a-(c[d+28>>2]|0)|0;if((f|0)!=0){c[d+28>>2]=a;jb(d+48|0,e,f,c[d+16>>2]|0)}e=e+(c[d+24>>2]|0)|0;if((c[d+32>>2]|0)==0){e=b}if((e|0)>=(b|0)){g=e;h=b;i=g-h|0;j=d;k=j+24|0;c[k>>2]=i;return}f=c[d+16>>2]|0;l=c[d+40>>2]|0;m=a<<1;a=c[c[d+36>>2]>>2]<<1;if((a|0)==0){a=16}do{n=l+1|0;l=c[d+44>>2]&-(l&1)^l>>>1;if((n&2|0)!=0){m=-m|0;jc(d+48|0,e,m,f)}e=e+a|0;}while((e|0)<(b|0));c[d+40>>2]=l;c[d+28>>2]=m>>1;g=e;h=b;i=g-h|0;j=d;k=j+24|0;c[k>>2]=i;return}function jb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=e;e=aq(b,c[f>>2]|0)|0;jA(a,e+(c[f+4>>2]|0)|0,d,f);return}function jc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=e;e=aq(b,c[f>>2]|0)|0;jA(a,e+(c[f+4>>2]|0)|0,d,f);return}function jd(a){a=a|0;var b=0,d=0,e=0;b=a;a=b+16|0;d=a+144|0;e=a;do{je(e);e=e+48|0;}while((e|0)!=(d|0));io(b+160|0);jf(b+984|0);d=0;while(1){if((d|0)>=3){break}c[b+16+(d*48|0)+44>>2]=b+160;c[b+(d<<2)>>2]=b+16+(d*48|0);d=d+1|0}c[b+12>>2]=b+984;jg(b,1.0);jh(b,0,0);return}function je(a){a=a|0;jx(a);return}function jf(a){a=a|0;ju(a);return}function jg(a,b){a=a|0;b=+b;var c=0.0,d=0;c=b;d=a;c=c*.00166015625;iE(d+160|0,c);ji(d+1032|0,c);return}function jh(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=b;b=d;d=a;c[d+976>>2]=0;c[d+980>>2]=0;if((e|0)!=0){if((b|0)==0){f=2686}}else{f=2686}if((f|0)==2686){e=9;b=16}c[d+1596>>2]=1<<b-1;c[d+1592>>2]=0;while(1){f=b;b=f-1|0;if((f|0)==0){break}c[d+1592>>2]=c[d+1592>>2]<<1|e&1;e=e>>>1}jn(d+16|0);jn(d+64|0);jn(d+112|0);jo(d+984|0);return}function ji(a,b){a=a|0;b=+b;cM(a|0,b*1.0);return}function jj(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;jk(b+160|0,c);jl(b+1032|0,c);return}function jk(a,b){a=a|0;b=b|0;cF(a|0,b);return}function jl(a,b){a=a|0;b=b|0;cF(a|0,b);return}function jm(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b;b=c;c=d;d=a;a=0;while(1){if((a|0)>=4){break}jp(d,a,e,b,c);a=a+1|0}return}function jn(a){a=a|0;var b=0;b=a;c[b+36>>2]=0;c[b+40>>2]=0;i3(b);return}function jo(a){a=a|0;var b=0;b=a;c[b+36>>2]=27456;c[b+40>>2]=32768;c[b+44>>2]=36864;i3(b);return}function jp(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=b;b=d;d=e;e=f;f=a;if(g>>>0>=4){a5(7680,194,13008,9968)}do{if((b|0)!=0){if((d|0)==0){h=2708;break}if((e|0)!=0){h=2711}else{h=2708}}else{h=2708}}while(0);L2989:do{if((h|0)==2708){do{if((b|0)==0){if((d|0)!=0){break}if((e|0)==0){h=2711;break L2989}}}while(0);a5(7680,195,13008,6920)}}while(0);h=c[f+(g<<2)>>2]|0;c[h+4>>2]=e;c[h+8>>2]=d;c[h+12>>2]=b;c[h+16>>2]=c[h+(c[h+20>>2]<<2)>>2];return}function jq(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;if((d|0)<(c[b+976>>2]|0)){a5(7680,236,12832,4976)}if((d|0)<=(c[b+976>>2]|0)){return}a=0;while(1){if((a|0)>=4){break}e=c[b+(a<<2)>>2]|0;if((c[e+16>>2]|0)!=0){iv(c[e+16>>2]|0);if((a|0)<3){i7(b+16+(a*48|0)|0,c[b+976>>2]|0,d)}else{ja(b+984|0,c[b+976>>2]|0,d)}}a=a+1|0}c[b+976>>2]=d;return}function jr(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+976>>2]|0)){jq(b,d)}if((c[b+976>>2]|0)<(d|0)){a5(7680,263,12872,3952)}a=b+976|0;c[a>>2]=(c[a>>2]|0)-d;return}function js(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;d=a;if(b>>>0>255){a5(7680,269,12912,3024)}jq(d,e);a=0;while(1){if((a|0)>=4){break}f=c[d+(a<<2)>>2]|0;g=b>>a;h=c[f+16>>2]|0;c[f+20>>2]=g>>3&2|g&1;c[f+16>>2]=c[f+(c[f+20>>2]<<2)>>2];do{if((c[f+16>>2]|0)!=(h|0)){if((c[f+28>>2]|0)==0){break}if((h|0)!=0){iv(h);ix(d+160|0,e,-(c[f+28>>2]|0)|0,h)}c[f+28>>2]=0}}while(0);a=a+1|0}return}function jt(b){b=b|0;var e=0,f=0,g=0;e=b;c[e+520>>2]=e+524;b=256;while(1){f=b-1|0;b=f;if((f|0)<0){break}f=1;g=b;while(1){if((g|0)==0){break}f=f^g;g=g>>1}g=b&168|(f&1)<<2;a[e+b|0]=g&255;a[e+(b+256)|0]=(g|1)&255}b=e|0;a[b]=(d[b]|0|64)&255;b=e+256|0;a[b]=(d[b]|0|64)&255;return}function ju(a){a=a|0;var b=0;b=a;i2(b);jv(b+48|0);return}function jv(a){a=a|0;jw(a);return}function jw(a){a=a|0;var b=0;b=a;ck(b|0,b+40|0,8);return}function jx(a){a=a|0;i2(a);return}function jy(a,b){a=a|0;b=b|0;var d=0;d=a;c[d+512>>2]=b;c[d+520>>2]=d+524;c[d+528>>2]=0;c[d+524>>2]=0;c[d+516>>2]=0;wg(d+532|0,0,30);return}function jz(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0;f=e;e=a;if(f>>>0>255){a5(7680,299,12960,3024)}jq(e,b);if((f&128|0)!=0){c[e+980>>2]=f}b=c[e+980>>2]>>5&3;if((c[e+980>>2]&16|0)!=0){c[(c[e+(b<<2)>>2]|0)+32>>2]=d[26288+(f&15)|0]|0;return}if((b|0)<3){a=e+16+(b*48|0)|0;if((f&128|0)!=0){c[a+36>>2]=c[a+36>>2]&65280|f<<4&255}else{c[a+36>>2]=c[a+36>>2]&255|f<<8&16128}}else{a=f&3;if((a|0)<3){c[e+1020>>2]=27456+(a<<2)}else{c[e+1020>>2]=e+148}if((f&4|0)!=0){g=c[e+1592>>2]|0}else{g=c[e+1596>>2]|0}c[e+1028>>2]=g;c[e+1024>>2]=32768}return}function jA(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;g=d;d=e;e=f;f=a;if((g>>>16|0)>=(c[e+12>>2]|0)){a5(2296,342,11504,1608)}d=aq(d,c[f+8>>2]|0)|0;a=(c[e+8>>2]|0)+(g>>>16<<2)|0;e=g>>>10&63;g=f+168+(-e<<1)|0;h=b[g>>1]|0;i=aq(h,d)|0;j=i+(c[a+16>>2]|0)|0;i=aq(b[g+128>>1]|0,d)|0;k=i+(c[a+20>>2]|0)|0;h=b[g+256>>1]|0;c[a+16>>2]=j;c[a+20>>2]=k;k=aq(h,d)|0;j=k+(c[a+24>>2]|0)|0;k=aq(b[g+384>>1]|0,d)|0;i=k+(c[a+28>>2]|0)|0;g=f+40+(e<<1)|0;h=b[g+384>>1]|0;c[a+24>>2]=j;c[a+28>>2]=i;i=aq(h,d)|0;j=i+(c[a+32>>2]|0)|0;i=aq(b[g+256>>1]|0,d)|0;e=i+(c[a+36>>2]|0)|0;h=b[g+128>>1]|0;c[a+32>>2]=j;c[a+36>>2]=e;e=aq(h,d)|0;h=e+(c[a+40>>2]|0)|0;e=aq(b[g>>1]|0,d)|0;d=e+(c[a+44>>2]|0)|0;c[a+40>>2]=h;c[a+44>>2]=d;return}function jB(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0;h=i;i=i+16|0;j=h|0;k=h+8|0;l=f;jC(l,g);g=j;f=l+524|0;c[g>>2]=c[f>>2];c[g+4>>2]=c[f+4>>2];c[l+520>>2]=j;f=0;g=k;m=l+540|0;wh(g|0,m|0,8)|0;m=c[j+4>>2]|0;g=c[l+512>>2]|0;n=e[l+532>>1]|0;o=e[l+534>>1]|0;p=e[l+536>>1]|0;q=e[l+538>>1]|0;r=d[l+547|0]|0;L3094:while(1){s=d[g+n|0]|0;n=n+1|0;t=d[18512+s|0]|0;u=m+t|0;m=u;if((u|0)>=0){if((m|0)>=(t|0)){v=2800;break}}t=d[g+n|0]|0;u=s;L3102:do{if((u|0)==58){w=jD(g+n|0)|0;n=n+2|0;a[k+6|0]=a[g+w|0]|0;continue L3094}else if((u|0)==8){w=d[l+554|0]|0;a[l+554|0]=a[k+6|0]|0;a[k+6|0]=w&255;w=d[l+555|0]|0;a[l+555|0]=r&255;r=w;continue L3094}else if((u|0)==62){n=n+1|0;a[k+6|0]=t&255;continue L3094}else if((u|0)==46){n=n+1|0;a[k+4|0]=t&255;continue L3094}else if((u|0)==32){n=n+1|0;if((r&64|0)!=0){v=2791;break}else{n=n+((t&255)<<24>>24)|0;continue L3094}}else if((u|0)==16){w=(d[k+1|0]|0)-1|0;a[k+1|0]=w&255;n=n+1|0;if((w|0)!=0){n=n+((t&255)<<24>>24)|0;continue L3094}else{v=2791;break}}else if((u|0)==0|(u|0)==64|(u|0)==73|(u|0)==82|(u|0)==91|(u|0)==100|(u|0)==109|(u|0)==127){continue L3094}else if((u|0)==40){n=n+1|0;if((r&64|0)!=0){n=n+((t&255)<<24>>24)|0;continue L3094}else{v=2791;break}}else if((u|0)==48){n=n+1|0;if((r&1|0)!=0){v=2791;break}else{n=n+((t&255)<<24>>24)|0;continue L3094}}else if((u|0)==211){n=n+1|0;j4(l,m+(c[j>>2]|0)|0,t+((d[k+6|0]|0)<<8)|0,d[k+6|0]|0);continue L3094}else if((u|0)==24){n=n+1|0;n=n+((t&255)<<24>>24)|0;continue L3094}else if((u|0)==224){if((r&4|0)!=0){m=m-6|0;continue L3094}else{v=2874;break}}else if((u|0)==232){if((r&4|0)!=0){v=2874;break}else{m=m-6|0;continue L3094}}else if((u|0)==240){if((r&128|0)!=0){m=m-6|0;continue L3094}else{v=2874;break}}else if((u|0)==248){if((r&128|0)!=0){v=2874;break}else{m=m-6|0;continue L3094}}else if((u|0)==201){v=2874}else if((u|0)==196){if((r&64|0)!=0){v=2792;break}else{v=2900;break}}else if((u|0)==204){if((r&64|0)!=0){v=2900;break}else{v=2792;break}}else if((u|0)==212){if((r&1|0)!=0){v=2792;break}else{v=2900;break}}else if((u|0)==220){if((r&1|0)!=0){v=2900;break}else{v=2792;break}}else if((u|0)==202){if((r&64|0)!=0){n=jD(g+n|0)|0;continue L3094}else{v=2793;break}}else if((u|0)==210){if((r&1|0)!=0){v=2793;break}else{n=jD(g+n|0)|0;continue L3094}}else if((u|0)==56){n=n+1|0;if((r&1|0)!=0){n=n+((t&255)<<24>>24)|0;continue L3094}else{v=2791;break}}else if((u|0)==194){if((r&64|0)!=0){v=2793;break}else{n=jD(g+n|0)|0;continue L3094}}else if((u|0)==250){if((r&128|0)!=0){n=jD(g+n|0)|0;continue L3094}else{v=2793;break}}else if((u|0)==195){n=jD(g+n|0)|0;continue L3094}else if((u|0)==233){n=e[k+4>>1]|0;continue L3094}else if((u|0)==192){if((r&64|0)!=0){m=m-6|0;continue L3094}else{v=2874;break}}else if((u|0)==200){if((r&64|0)!=0){v=2874;break}else{m=m-6|0;continue L3094}}else if((u|0)==208){if((r&1|0)!=0){m=m-6|0;continue L3094}else{v=2874;break}}else if((u|0)==216){if((r&1|0)!=0){v=2874;break}else{m=m-6|0;continue L3094}}else if((u|0)==222|(u|0)==206){v=2913}else if((u|0)==144|(u|0)==145|(u|0)==146|(u|0)==147|(u|0)==148|(u|0)==149|(u|0)==151|(u|0)==128|(u|0)==129|(u|0)==130|(u|0)==131|(u|0)==132|(u|0)==133|(u|0)==135){r=r&-2;v=2915}else if((u|0)==152|(u|0)==153|(u|0)==154|(u|0)==155|(u|0)==156|(u|0)==157|(u|0)==159|(u|0)==136|(u|0)==137|(u|0)==138|(u|0)==139|(u|0)==140|(u|0)==141|(u|0)==143){v=2915}else if((u|0)==190){t=d[g+(e[k+4>>1]|0)|0]|0;v=2922}else if((u|0)==254){n=n+1|0;v=2922}else if((u|0)==184|(u|0)==185|(u|0)==186|(u|0)==187|(u|0)==188|(u|0)==189|(u|0)==191){t=d[k-184+(s^1)|0]|0;v=2922}else if((u|0)==57){t=o;v=2927}else if((u|0)==9|(u|0)==25|(u|0)==41){t=e[k-1+(s>>>3)>>1]|0;v=2927}else if((u|0)==39){w=d[k+6|0]|0;if((w|0)>153){r=r|1}x=96&-(r&1);if((r&16|0)!=0){v=2932}else{if((w&15|0)>9){v=2932}}if((v|0)==2932){v=0;x=x|6}if((r&2|0)!=0){x=-x|0}w=w+x|0;r=r&3|((d[k+6|0]|0)^w)&16|(d[l+(w&255)|0]|0);a[k+6|0]=w&255;continue L3094}else if((u|0)==218){if((r&1|0)!=0){n=jD(g+n|0)|0;continue L3094}else{v=2793;break}}else if((u|0)==226){if((r&4|0)!=0){v=2793;break}else{n=jD(g+n|0)|0;continue L3094}}else if((u|0)==234){if((r&4|0)!=0){n=jD(g+n|0)|0;continue L3094}else{v=2793;break}}else if((u|0)==242){if((r&128|0)!=0){v=2793;break}else{n=jD(g+n|0)|0;continue L3094}}else if((u|0)==228){if((r&4|0)!=0){v=2792;break}else{v=2900;break}}else if((u|0)==236){if((r&4|0)!=0){v=2900;break}else{v=2792;break}}else if((u|0)==244){if((r&128|0)!=0){v=2792;break}else{v=2900;break}}else if((u|0)==252){if((r&128|0)!=0){v=2900;break}else{v=2792;break}}else if((u|0)==205){v=2900}else if((u|0)==255){if((n-1|0)>>>0>65535){n=n-1&65535;m=m-11|0;continue L3094}else{v=2904;break}}else if((u|0)==199|(u|0)==207|(u|0)==215|(u|0)==223|(u|0)==231|(u|0)==239|(u|0)==247){v=2904}else if((u|0)==245){t=((d[k+6|0]|0)<<8)+r|0;v=2907}else if((u|0)==197|(u|0)==213|(u|0)==229){t=e[k-24+(s>>>3)>>1]|0;v=2907}else if((u|0)==241){r=d[g+o|0]|0;a[k+6|0]=a[g+(o+1)|0]|0;o=o+2&65535;continue L3094}else if((u|0)==193|(u|0)==209|(u|0)==225){b[k-24+(s>>>3)>>1]=(jD(g+o|0)|0)&65535;o=o+2&65535;continue L3094}else if((u|0)==150|(u|0)==134){r=r&-2;v=2911}else if((u|0)==158|(u|0)==142){v=2911}else if((u|0)==214|(u|0)==198){r=r&-2;v=2913}else if((u|0)==52){t=(d[g+(e[k+4>>1]|0)|0]|0)+1|0;a[g+(e[k+4>>1]|0)|0]=t&255;v=2938}else if((u|0)==4|(u|0)==12|(u|0)==20|(u|0)==28|(u|0)==36|(u|0)==44|(u|0)==60){w=k+(s>>>3^1)|0;x=(a[w]|0)+1&255;a[w]=x;t=x&255;v=2938}else if((u|0)==53){t=(d[g+(e[k+4>>1]|0)|0]|0)-1|0;a[g+(e[k+4>>1]|0)|0]=t&255;v=2943}else if((u|0)==5|(u|0)==13|(u|0)==21|(u|0)==29|(u|0)==37|(u|0)==45|(u|0)==61){x=k+(s>>>3^1)|0;w=(a[x]|0)-1&255;a[x]=w;t=w&255;v=2943}else if((u|0)==3|(u|0)==19|(u|0)==35){w=k+(s>>>3)|0;b[w>>1]=(b[w>>1]|0)+1&65535;continue L3094}else if((u|0)==51){o=o+1&65535;continue L3094}else if((u|0)==11|(u|0)==27|(u|0)==43){w=k-1+(s>>>3)|0;b[w>>1]=(b[w>>1]|0)-1&65535;continue L3094}else if((u|0)==59){o=o-1&65535;continue L3094}else if((u|0)==166){t=d[g+(e[k+4>>1]|0)|0]|0;v=2953}else if((u|0)==230){n=n+1|0;v=2953}else if((u|0)==160|(u|0)==161|(u|0)==162|(u|0)==163|(u|0)==164|(u|0)==165|(u|0)==167){t=d[k-160+(s^1)|0]|0;v=2953}else if((u|0)==182){t=d[g+(e[k+4>>1]|0)|0]|0;v=2957}else if((u|0)==246){n=n+1|0;v=2957}else if((u|0)==176|(u|0)==177|(u|0)==178|(u|0)==179|(u|0)==180|(u|0)==181|(u|0)==183){t=d[k-176+(s^1)|0]|0;v=2957}else if((u|0)==174){t=d[g+(e[k+4>>1]|0)|0]|0;v=2961}else if((u|0)==238){n=n+1|0;v=2961}else if((u|0)==168|(u|0)==169|(u|0)==170|(u|0)==171|(u|0)==172|(u|0)==173|(u|0)==175){t=d[k-168+(s^1)|0]|0;v=2961}else if((u|0)==112|(u|0)==113|(u|0)==114|(u|0)==115|(u|0)==116|(u|0)==117|(u|0)==119){a[g+(e[k+4>>1]|0)|0]=a[k-112+(s^1)|0]|0;continue L3094}else if((u|0)==65|(u|0)==66|(u|0)==67|(u|0)==68|(u|0)==69|(u|0)==71|(u|0)==72|(u|0)==74|(u|0)==75|(u|0)==76|(u|0)==77|(u|0)==79|(u|0)==80|(u|0)==81|(u|0)==83|(u|0)==84|(u|0)==85|(u|0)==87|(u|0)==88|(u|0)==89|(u|0)==90|(u|0)==92|(u|0)==93|(u|0)==95|(u|0)==96|(u|0)==97|(u|0)==98|(u|0)==99|(u|0)==101|(u|0)==103|(u|0)==104|(u|0)==105|(u|0)==106|(u|0)==107|(u|0)==108|(u|0)==111|(u|0)==120|(u|0)==121|(u|0)==122|(u|0)==123|(u|0)==124|(u|0)==125){a[k+(s>>>3&7^1)|0]=a[k+(s&7^1)|0]|0;continue L3094}else if((u|0)==6|(u|0)==14|(u|0)==22|(u|0)==30|(u|0)==38){a[k+(s>>>3^1)|0]=t&255;n=n+1|0;continue L3094}else if((u|0)==54){n=n+1|0;a[g+(e[k+4>>1]|0)|0]=t&255;continue L3094}else if((u|0)==70|(u|0)==78|(u|0)==86|(u|0)==94|(u|0)==102|(u|0)==110|(u|0)==126){a[k-8+(s>>>3^1)|0]=a[g+(e[k+4>>1]|0)|0]|0;continue L3094}else if((u|0)==1|(u|0)==17|(u|0)==33){b[k+(s>>>3)>>1]=(jD(g+n|0)|0)&65535;n=n+2|0;continue L3094}else if((u|0)==49){o=jD(g+n|0)|0;n=n+2|0;continue L3094}else if((u|0)==42){w=jD(g+n|0)|0;n=n+2|0;b[k+4>>1]=(jD(g+w|0)|0)&65535;continue L3094}else if((u|0)==50){w=jD(g+n|0)|0;n=n+2|0;a[g+w|0]=a[k+6|0]|0;continue L3094}else if((u|0)==34){w=jD(g+n|0)|0;n=n+2|0;jE(g+w|0,e[k+4>>1]|0);continue L3094}else if((u|0)==2|(u|0)==18){a[g+(e[k+(s>>>3)>>1]|0)|0]=a[k+6|0]|0;continue L3094}else if((u|0)==10|(u|0)==26){a[k+6|0]=a[g+(e[k-1+(s>>>3)>>1]|0)|0]|0;continue L3094}else if((u|0)==249){o=e[k+4>>1]|0;continue L3094}else if((u|0)==7){w=d[k+6|0]|0;w=w<<1|w>>>7;r=r&196|w&41;a[k+6|0]=w&255;continue L3094}else if((u|0)==15){w=d[k+6|0]|0;r=r&196|w&1;w=w<<7|w>>>1;r=r|w&40;a[k+6|0]=w&255;continue L3094}else if((u|0)==23){w=(d[k+6|0]|0)<<1|r&1;r=r&196|w&40|w>>>8;a[k+6|0]=w&255;continue L3094}else if((u|0)==31){w=r<<7|(d[k+6|0]|0)>>1;r=r&196|w&40|a[k+6|0]&1;a[k+6|0]=w&255;continue L3094}else if((u|0)==47){w=~(d[k+6|0]|0);r=r&197|w&40|18;a[k+6|0]=w&255;continue L3094}else if((u|0)==63){r=r&197^1|r<<4&16|a[k+6|0]&40;continue L3094}else if((u|0)==55){r=r&196|1|a[k+6|0]&40;continue L3094}else if((u|0)==219){n=n+1|0;a[k+6|0]=(jX(l,t+((d[k+6|0]|0)<<8)|0)|0)&255;continue L3094}else if((u|0)==227){w=jD(g+o|0)|0;jE(g+o|0,e[k+4>>1]|0);b[k+4>>1]=w&65535;continue L3094}else if((u|0)==235){w=e[k+4>>1]|0;b[k+4>>1]=b[k+2>>1]|0;b[k+2>>1]=w&65535;continue L3094}else if((u|0)==217){w=e[l+548>>1]|0;b[l+548>>1]=b[k>>1]|0;b[k>>1]=w&65535;w=e[l+550>>1]|0;b[l+550>>1]=b[k+2>>1]|0;b[k+2>>1]=w&65535;w=e[l+552>>1]|0;b[l+552>>1]=b[k+4>>1]|0;b[k+4>>1]=w&65535;continue L3094}else if((u|0)==243){a[l+556|0]=0;a[l+557|0]=0;continue L3094}else if((u|0)==251){a[l+556|0]=1;a[l+557|0]=1;continue L3094}else if((u|0)==118){v=2988;break L3094}else if((u|0)==203){n=n+1|0;w=t;if((w|0)==6){m=m+7|0;t=e[k+4>>1]|0;v=2991;break}else if((w|0)==0|(w|0)==1|(w|0)==2|(w|0)==3|(w|0)==4|(w|0)==5|(w|0)==7){x=k+(t^1)|0;y=d[x]|0;y=y<<1&255|y>>>7;r=d[l+y|0]|0|y&1;a[x]=y&255;continue L3094}else if((w|0)==22){m=m+7|0;t=e[k+4>>1]|0;v=2994;break}else if((w|0)==16|(w|0)==17|(w|0)==18|(w|0)==19|(w|0)==20|(w|0)==21|(w|0)==23){y=k-16+(t^1)|0;x=(d[y]|0)<<1|r&1;r=d[l+x|0]|0;a[y]=x&255;continue L3094}else if((w|0)==38){m=m+7|0;t=e[k+4>>1]|0;v=2997;break}else if((w|0)==32|(w|0)==33|(w|0)==34|(w|0)==35|(w|0)==36|(w|0)==37|(w|0)==39){x=k-32+(t^1)|0;y=(d[x]|0)<<1;r=d[l+y|0]|0;a[x]=y&255;continue L3094}else if((w|0)==54){m=m+7|0;t=e[k+4>>1]|0;v=3e3;break}else if((w|0)==48|(w|0)==49|(w|0)==50|(w|0)==51|(w|0)==52|(w|0)==53|(w|0)==55){y=k-48+(t^1)|0;x=(d[y]|0)<<1|1;r=d[l+x|0]|0;a[y]=x&255;continue L3094}else if((w|0)==14){m=m+7|0;t=e[k+4>>1]|0;v=3003;break}else if((w|0)==8|(w|0)==9|(w|0)==10|(w|0)==11|(w|0)==12|(w|0)==13|(w|0)==15){x=k-8+(t^1)|0;y=d[x]|0;r=y&1;y=y<<7&255|y>>>1;r=r|(d[l+y|0]|0);a[x]=y&255;continue L3094}else if((w|0)==30){m=m+7|0;t=e[k+4>>1]|0;v=3006;break}else if((w|0)==24|(w|0)==25|(w|0)==26|(w|0)==27|(w|0)==28|(w|0)==29|(w|0)==31){y=k-24+(t^1)|0;x=d[y]|0;z=x&1;x=r<<7&255|x>>>1;r=d[l+x|0]|0|z;a[y]=x&255;continue L3094}else if((w|0)==46){t=e[k+4>>1]|0;m=m+7|0;v=3009;break}else if((w|0)==40|(w|0)==41|(w|0)==42|(w|0)==43|(w|0)==44|(w|0)==45|(w|0)==47){x=k-40+(t^1)|0;y=d[x]|0;r=y&1;y=y&128|y>>>1;r=r|(d[l+y|0]|0);a[x]=y&255;continue L3094}else if((w|0)==62){m=m+7|0;t=e[k+4>>1]|0;v=3012;break}else if((w|0)==56|(w|0)==57|(w|0)==58|(w|0)==59|(w|0)==60|(w|0)==61|(w|0)==63){y=k-56+(t^1)|0;x=d[y]|0;r=x&1;x=x>>>1;r=r|(d[l+x|0]|0);a[y]=x&255;continue L3094}else if((w|0)==70|(w|0)==78|(w|0)==86|(w|0)==94|(w|0)==102|(w|0)==110|(w|0)==118|(w|0)==126){m=m+4|0;A=d[g+(e[k+4>>1]|0)|0]|0;r=r&1}else if((w|0)==64|(w|0)==65|(w|0)==66|(w|0)==67|(w|0)==68|(w|0)==69|(w|0)==71|(w|0)==72|(w|0)==73|(w|0)==74|(w|0)==75|(w|0)==76|(w|0)==77|(w|0)==79|(w|0)==80|(w|0)==81|(w|0)==82|(w|0)==83|(w|0)==84|(w|0)==85|(w|0)==87|(w|0)==88|(w|0)==89|(w|0)==90|(w|0)==91|(w|0)==92|(w|0)==93|(w|0)==95|(w|0)==96|(w|0)==97|(w|0)==98|(w|0)==99|(w|0)==100|(w|0)==101|(w|0)==103|(w|0)==104|(w|0)==105|(w|0)==106|(w|0)==107|(w|0)==108|(w|0)==109|(w|0)==111|(w|0)==112|(w|0)==113|(w|0)==114|(w|0)==115|(w|0)==116|(w|0)==117|(w|0)==119|(w|0)==120|(w|0)==121|(w|0)==122|(w|0)==123|(w|0)==124|(w|0)==125|(w|0)==127){A=d[k+(t&7^1)|0]|0;r=r&1|A&40}else if((w|0)==134|(w|0)==142|(w|0)==150|(w|0)==158|(w|0)==166|(w|0)==174|(w|0)==182|(w|0)==190|(w|0)==198|(w|0)==206|(w|0)==214|(w|0)==222|(w|0)==230|(w|0)==238|(w|0)==246|(w|0)==254){m=m+7|0;x=d[g+(e[k+4>>1]|0)|0]|0;y=1<<(t>>>3&7);x=x|y;if((t&64|0)==0){x=x^y}a[g+(e[k+4>>1]|0)|0]=x&255;continue L3094}else if((w|0)==192|(w|0)==193|(w|0)==194|(w|0)==195|(w|0)==196|(w|0)==197|(w|0)==199|(w|0)==200|(w|0)==201|(w|0)==202|(w|0)==203|(w|0)==204|(w|0)==205|(w|0)==207|(w|0)==208|(w|0)==209|(w|0)==210|(w|0)==211|(w|0)==212|(w|0)==213|(w|0)==215|(w|0)==216|(w|0)==217|(w|0)==218|(w|0)==219|(w|0)==220|(w|0)==221|(w|0)==223|(w|0)==224|(w|0)==225|(w|0)==226|(w|0)==227|(w|0)==228|(w|0)==229|(w|0)==231|(w|0)==232|(w|0)==233|(w|0)==234|(w|0)==235|(w|0)==236|(w|0)==237|(w|0)==239|(w|0)==240|(w|0)==241|(w|0)==242|(w|0)==243|(w|0)==244|(w|0)==245|(w|0)==247|(w|0)==248|(w|0)==249|(w|0)==250|(w|0)==251|(w|0)==252|(w|0)==253|(w|0)==255){x=k+(t&7^1)|0;a[x]=(d[x]|0|1<<(t>>>3&7))&255;continue L3094}else if((w|0)==128|(w|0)==129|(w|0)==130|(w|0)==131|(w|0)==132|(w|0)==133|(w|0)==135|(w|0)==136|(w|0)==137|(w|0)==138|(w|0)==139|(w|0)==140|(w|0)==141|(w|0)==143|(w|0)==144|(w|0)==145|(w|0)==146|(w|0)==147|(w|0)==148|(w|0)==149|(w|0)==151|(w|0)==152|(w|0)==153|(w|0)==154|(w|0)==155|(w|0)==156|(w|0)==157|(w|0)==159|(w|0)==160|(w|0)==161|(w|0)==162|(w|0)==163|(w|0)==164|(w|0)==165|(w|0)==167|(w|0)==168|(w|0)==169|(w|0)==170|(w|0)==171|(w|0)==172|(w|0)==173|(w|0)==175|(w|0)==176|(w|0)==177|(w|0)==178|(w|0)==179|(w|0)==180|(w|0)==181|(w|0)==183|(w|0)==184|(w|0)==185|(w|0)==186|(w|0)==187|(w|0)==188|(w|0)==189|(w|0)==191){w=k+(t&7^1)|0;a[w]=(d[w]|0)&~(1<<(t>>>3&7))&255;continue L3094}else{v=3022;break L3094}w=A&1<<(t>>>3&7);r=r|(w&128|16|w-1>>8&68);continue L3094}else if((u|0)==237){n=n+1|0;m=m+((d[28160+t|0]|0)>>4)|0;w=t;do{if((w|0)==114|(w|0)==122){B=o;if(!0){v=3027;break}v=3026}else if((w|0)==66|(w|0)==82|(w|0)==98|(w|0)==74|(w|0)==90|(w|0)==106){v=3026}else if((w|0)==64|(w|0)==72|(w|0)==80|(w|0)==88|(w|0)==96|(w|0)==104|(w|0)==112|(w|0)==120){x=jX(l,e[k>>1]|0)|0;a[k-8+(t>>>3^1)|0]=x&255;r=r&1|(d[l+x|0]|0);continue L3094}else if((w|0)==113){a[k+7|0]=0;v=3034}else if((w|0)==65|(w|0)==73|(w|0)==81|(w|0)==89|(w|0)==97|(w|0)==105|(w|0)==121){v=3034}else if((w|0)==115){C=o;if(!0){v=3038;break}v=3037}else if((w|0)==67|(w|0)==83){v=3037}else if((w|0)==75|(w|0)==91){x=jD(g+n|0)|0;n=n+2|0;b[k-9+(t>>>3)>>1]=(jD(g+x|0)|0)&65535;continue L3094}else if((w|0)==123){x=jD(g+n|0)|0;n=n+2|0;o=jD(g+x|0)|0;continue L3094}else if((w|0)==103){x=d[g+(e[k+4>>1]|0)|0]|0;a[g+(e[k+4>>1]|0)|0]=((d[k+6|0]|0)<<4|x>>>4)&255;x=a[k+6|0]&240|x&15;r=r&1|(d[l+x|0]|0);a[k+6|0]=x&255;continue L3094}else if((w|0)==111){x=d[g+(e[k+4>>1]|0)|0]|0;a[g+(e[k+4>>1]|0)|0]=(x<<4|a[k+6|0]&15)&255;x=a[k+6|0]&240|x>>>4;r=r&1|(d[l+x|0]|0);a[k+6|0]=x&255;continue L3094}else if((w|0)==68|(w|0)==76|(w|0)==84|(w|0)==92|(w|0)==100|(w|0)==108|(w|0)==116|(w|0)==124){s=16;r=r&-2;t=d[k+6|0]|0;a[k+6|0]=0;v=2916;break L3102}else if((w|0)==169|(w|0)==185){D=-1;if(!0){v=3047;break}v=3046}else if((w|0)==161|(w|0)==177){v=3046}else if((w|0)==168|(w|0)==184){E=-1;if(!0){v=3058;break}v=3057}else if((w|0)==160|(w|0)==176){v=3057}else if((w|0)==171|(w|0)==187){F=-1;if(!0){v=3066;break}v=3065}else if((w|0)==163|(w|0)==179){v=3065}else if((w|0)==170|(w|0)==186){G=-1;if(!0){v=3073;break}v=3072}else if((w|0)==162|(w|0)==178){v=3072}else if((w|0)==71){a[l+559|0]=a[k+6|0]|0;continue L3094}else if((w|0)==79){a[l+558|0]=a[k+6|0]|0;f=1;continue L3094}else if((w|0)==87){a[k+6|0]=a[l+559|0]|0;v=3081}else if((w|0)==95){a[k+6|0]=a[l+558|0]|0;f=1;v=3081}else if((w|0)==69|(w|0)==77|(w|0)==85|(w|0)==93|(w|0)==101|(w|0)==109|(w|0)==117|(w|0)==125){a[l+556|0]=a[l+557|0]|0;v=2874;break L3102}else if((w|0)==70|(w|0)==78|(w|0)==102|(w|0)==110){a[l+560|0]=0;continue L3094}else if((w|0)==86|(w|0)==118){a[l+560|0]=1;continue L3094}else if((w|0)==94|(w|0)==126){a[l+560|0]=2;continue L3094}else{f=1;continue L3094}}while(0);if((v|0)==3026){v=0;B=e[k+((t>>>3&6)>>>0)>>1]|0;v=3027}else if((v|0)==3034){v=0;j4(l,m+(c[j>>2]|0)|0,e[k>>1]|0,d[k-8+(t>>>3^1)|0]|0);continue L3094}else if((v|0)==3037){v=0;C=e[k-8+(t>>>3)>>1]|0;v=3038}else if((v|0)==3046){v=0;D=1;v=3047}else if((v|0)==3057){v=0;E=1;v=3058}else if((v|0)==3065){v=0;F=1;v=3066}else if((v|0)==3072){v=0;G=1;v=3073}else if((v|0)==3081){v=0;r=r&1|(d[l+(d[k+6|0]|0)|0]|0)&-5|(d[l+557|0]|0)<<2&4;continue L3094}if((v|0)==3027){v=0;w=B+(r&1)|0;r=~t>>>2&2;if((r|0)!=0){w=-w|0}w=w+(e[k+4>>1]|0)|0;B=B^(e[k+4>>1]|0);B=B^w;r=r|(w>>>16&1|B>>>8&16|w>>>8&168|(B+32768|0)>>>14&4);b[k+4>>1]=w&65535;if((w&65535)<<16>>16!=0){continue L3094}else{r=r|64;continue L3094}}else if((v|0)==3038){v=0;w=jD(g+n|0)|0;n=n+2|0;jE(g+w|0,C);continue L3094}else if((v|0)==3047){v=0;w=e[k+4>>1]|0;b[k+4>>1]=w+D&65535;x=d[g+w|0]|0;w=(d[k+6|0]|0)-x|0;r=r&1|2|((x^(d[k+6|0]|0))&16^w)&144;if((w&255)<<24>>24==0){r=r|64}w=w-((r&16)>>4)|0;r=r|w&8;r=r|w<<4&32;w=k|0;x=(b[w>>1]|0)-1&65535;b[w>>1]=x;if(x<<16>>16==0){continue L3094}r=r|4;do{if((r&64|0)==0){if(t>>>0<176){break}n=n-2|0;m=m+5|0;continue L3094}}while(0);continue L3094}else if((v|0)==3058){v=0;x=e[k+4>>1]|0;b[k+4>>1]=x+E&65535;w=d[g+x|0]|0;x=e[k+2>>1]|0;b[k+2>>1]=x+E&65535;a[g+x|0]=w&255;w=w+(d[k+6|0]|0)|0;r=r&193|w&8|w<<4&32;w=k|0;x=(b[w>>1]|0)-1&65535;b[w>>1]=x;if(x<<16>>16==0){continue L3094}r=r|4;if(t>>>0<176){continue L3094}else{n=n-2|0;m=m+5|0;continue L3094}}else if((v|0)==3066){v=0;x=e[k+4>>1]|0;b[k+4>>1]=x+F&65535;w=d[g+x|0]|0;x=k+1|0;y=(a[x]|0)-1&255;a[x]=y;x=y&255;r=w>>6&2|(d[l+x|0]|0)&-5;do{if((x|0)!=0){if(t>>>0<176){break}n=n-2|0;m=m+5|0}}while(0);j4(l,m+(c[j>>2]|0)|0,e[k>>1]|0,w);continue L3094}else if((v|0)==3073){v=0;x=e[k+4>>1]|0;b[k+4>>1]=x+G&65535;y=jX(l,e[k>>1]|0)|0;z=k+1|0;H=(a[z]|0)-1&255;a[z]=H;z=H&255;r=y>>6&2|(d[l+z|0]|0)&-5;do{if((z|0)!=0){if(t>>>0<176){break}n=n-2|0;m=m+5|0}}while(0);a[g+x|0]=y&255;continue L3094}}else if((u|0)==221){I=p;v=3089}else if((u|0)==253){I=q;v=3089}else{v=3168;break L3094}}while(0);L3406:do{if((v|0)==2791){v=0;m=m-5|0;continue L3094}else if((v|0)==2792){v=0;m=m-7|0;v=2793}else if((v|0)==2874){v=0;n=jD(g+o|0)|0;o=o+2&65535;continue L3094}else if((v|0)==2913){v=0;n=n+1|0;v=2916}else if((v|0)==2915){v=0;t=d[k+(s&7^1)|0]|0;v=2916}else if((v|0)==2927){v=0;u=(e[k+4>>1]|0)+t|0;t=t^(e[k+4>>1]|0);b[k+4>>1]=u&65535;r=r&196|u>>>16|u>>>8&40|(t^u)>>>8&16;continue L3094}else if((v|0)==2900){v=0;u=n+2|0;n=jD(g+n|0)|0;o=o-2&65535;jE(g+o|0,u);continue L3094}else if((v|0)==2904){v=0;t=n;n=s&56;v=2907}else if((v|0)==2911){v=0;t=d[g+(e[k+4>>1]|0)|0]|0;v=2916}else if((v|0)==3089){v=0;n=n+1|0;u=d[g+n|0]|0;m=m+(a[28160+t|0]&15)|0;z=t;do{if((z|0)==150|(z|0)==134){r=r&-2;v=3091}else if((z|0)==158|(z|0)==142){v=3091}else if((z|0)==148|(z|0)==132){r=r&-2;v=3093}else if((z|0)==156|(z|0)==140){v=3093}else if((z|0)==149|(z|0)==133){r=r&-2;v=3095}else if((z|0)==157|(z|0)==141){v=3095}else if((z|0)==57){J=o;v=3099}else if((z|0)==41){J=I;v=3099}else if((z|0)==9|(z|0)==25){J=e[k-1+(t>>>3)>>1]|0;v=3099}else if((z|0)==166){n=n+1|0;t=d[g+(I+((u&255)<<24>>24)&65535)|0]|0;v=2953;break L3406}else if((z|0)==164){t=I>>>8;v=2953;break L3406}else if((z|0)==165){t=I&255;v=2953;break L3406}else if((z|0)==182){n=n+1|0;t=d[g+(I+((u&255)<<24>>24)&65535)|0]|0;v=2957;break L3406}else if((z|0)==180){t=I>>>8;v=2957;break L3406}else if((z|0)==181){t=I&255;v=2957;break L3406}else if((z|0)==174){n=n+1|0;t=d[g+(I+((u&255)<<24>>24)&65535)|0]|0;v=2961;break L3406}else if((z|0)==172){t=I>>>8;v=2961;break L3406}else if((z|0)==173){t=I&255;v=2961;break L3406}else if((z|0)==190){n=n+1|0;t=d[g+(I+((u&255)<<24>>24)&65535)|0]|0;v=2922;break L3406}else if((z|0)==188){t=I>>>8;v=2922;break L3406}else if((z|0)==189){t=I&255;v=2922;break L3406}else if((z|0)==112|(z|0)==113|(z|0)==114|(z|0)==115|(z|0)==116|(z|0)==117|(z|0)==119){t=d[k-112+(t^1)|0]|0;if(!0){v=3115;break}v=3114}else if((z|0)==54){v=3114}else if((z|0)==68|(z|0)==76|(z|0)==84|(z|0)==92|(z|0)==124){a[k-8+(t>>>3^1)|0]=I>>>8&255;continue L3094}else if((z|0)==100|(z|0)==109){continue L3094}else if((z|0)==69|(z|0)==77|(z|0)==85|(z|0)==93|(z|0)==125){a[k-8+(t>>>3^1)|0]=I&255;continue L3094}else if((z|0)==70|(z|0)==78|(z|0)==86|(z|0)==94|(z|0)==102|(z|0)==110|(z|0)==126){n=n+1|0;a[k-8+(t>>>3^1)|0]=a[g+(I+((u&255)<<24>>24)&65535)|0]|0;continue L3094}else if((z|0)==38){n=n+1|0;v=3123}else if((z|0)==101){u=I&255;v=3123}else if((z|0)==96|(z|0)==97|(z|0)==98|(z|0)==99|(z|0)==103){u=d[k-96+(t^1)|0]|0;v=3123}else if((z|0)==46){n=n+1|0;v=3127}else if((z|0)==108){u=I>>>8;v=3127}else if((z|0)==104|(z|0)==105|(z|0)==106|(z|0)==107|(z|0)==111){u=d[k-104+(t^1)|0]|0;v=3127}else if((z|0)==249){o=I;continue L3094}else if((z|0)==34){w=jD(g+n|0)|0;n=n+2|0;jE(g+w|0,I);continue L3094}else if((z|0)==33){I=jD(g+n|0)|0;n=n+2|0}else if((z|0)==42){I=jD(g+(jD(g+n|0)|0)|0)|0;n=n+2|0}else if((z|0)==203){t=I+((u&255)<<24>>24)&65535;n=n+1|0;u=d[g+n|0]|0;n=n+1|0;w=u;if((w|0)==6){v=2991;break L3406}else if((w|0)==22){v=2994;break L3406}else if((w|0)==38){v=2997;break L3406}else if((w|0)==54){v=3e3;break L3406}else if((w|0)==14){v=3003;break L3406}else if((w|0)==30){v=3006;break L3406}else if((w|0)==46){v=3009;break L3406}else if((w|0)==62){v=3012;break L3406}else if((w|0)==70|(w|0)==78|(w|0)==86|(w|0)==94|(w|0)==102|(w|0)==110|(w|0)==118|(w|0)==126){H=(d[g+t|0]|0)&1<<(u>>>3&7);r=r&1|16|H&128|H-1>>8&68;continue L3094}else if((w|0)==134|(w|0)==142|(w|0)==150|(w|0)==158|(w|0)==166|(w|0)==174|(w|0)==182|(w|0)==190|(w|0)==198|(w|0)==206|(w|0)==214|(w|0)==222|(w|0)==230|(w|0)==238|(w|0)==246|(w|0)==254){w=d[g+t|0]|0;H=1<<(u>>>3&7);w=w|H;if((u&64|0)==0){w=w^H}a[g+t|0]=w&255;continue L3094}else{f=1;continue L3094}}else if((z|0)==35){I=I+1&65535}else if((z|0)==43){I=I-1&65535}else if((z|0)==52){I=I+((u&255)<<24>>24)&65535;n=n+1|0;t=(d[g+I|0]|0)+1|0;a[g+I|0]=t&255;v=2938;break L3406}else if((z|0)==53){I=I+((u&255)<<24>>24)&65535;n=n+1|0;t=(d[g+I|0]|0)-1|0;a[g+I|0]=t&255;v=2943;break L3406}else if((z|0)==36){I=I+256&65535;t=I>>>8;v=3155}else if((z|0)==44){t=I+1&255;I=I&65280|t;v=3155}else if((z|0)==37){I=I-256&65535;t=I>>>8;v=3160}else if((z|0)==45){t=I-1&255;I=I&65280|t;v=3160}else if((z|0)==229){t=I;v=2907;break L3406}else if((z|0)==225){I=jD(g+o|0)|0;o=o+2&65535}else if((z|0)==233){n=I;continue L3094}else if((z|0)==227){w=jD(g+o|0)|0;jE(g+o|0,I);I=w}else{f=1;n=n-1|0;continue L3094}}while(0);if((v|0)==3091){v=0;n=n+1|0;s=t;t=d[g+(I+((u&255)<<24>>24)&65535)|0]|0;v=2916;break}else if((v|0)==3093){v=0;s=t;t=I>>>8;v=2916;break}else if((v|0)==3095){v=0;s=t;t=I&255;v=2916;break}else if((v|0)==3099){v=0;z=I+J|0;J=J^I;I=z&65535;r=r&196|z>>>16|z>>>8&40|(J^z)>>>8&16}else if((v|0)==3114){v=0;n=n+1|0;t=d[g+n|0]|0;v=3115}else if((v|0)==3123){v=0;I=I&255|u<<8}else if((v|0)==3127){v=0;I=I&65280|u}else if((v|0)==3155){v=0;if((s|0)==221){p=I;v=2938;break}else{q=I;v=2938;break}}else if((v|0)==3160){v=0;if((s|0)==221){p=I;v=2943;break}else{q=I;v=2943;break}}if((v|0)==3115){v=0;n=n+1|0;a[g+(I+((u&255)<<24>>24)&65535)|0]=t&255;continue L3094}if((s|0)==221){p=I;continue L3094}else{q=I;continue L3094}}}while(0);if((v|0)==2793){v=0;n=n+2|0;continue}else if((v|0)==2916){v=0;z=t+(r&1)|0;t=t^(d[k+6|0]|0);r=s>>>3&2;if((r|0)!=0){z=-z|0}z=z+(d[k+6|0]|0)|0;t=t^z;r=r|(t&16|(t+128|0)>>>6&4|(d[l+(z&511)|0]|0)&-5);a[k+6|0]=z&255;continue}else if((v|0)==2922){v=0;z=(d[k+6|0]|0)-t|0;r=2|t&40|z>>8&1;t=t^(d[k+6|0]|0);r=r|(((z^(d[k+6|0]|0))&t)>>>5&4|(t&16^z)&144);if((z&255)<<24>>24!=0){continue}else{r=r|64;continue}}else if((v|0)==2907){v=0;o=o-2&65535;jE(g+o|0,t);continue}else if((v|0)==2938){v=0;r=r&1|(t&15)-1&16|(d[l+(t&255)|0]|0)&-5;if((t|0)!=128){continue}else{r=r|4;continue}}else if((v|0)==2943){v=0;r=r&1|2|(t&15)+1&16|(d[l+(t&255)|0]|0)&-5;if((t|0)!=127){continue}else{r=r|4;continue}}else if((v|0)==2953){v=0;z=k+6|0;a[z]=(d[z]|0)&t&255;r=d[l+(d[k+6|0]|0)|0]|0|16;continue}else if((v|0)==2957){v=0;z=k+6|0;a[z]=(d[z]|0|t)&255;r=d[l+(d[k+6|0]|0)|0]|0;continue}else if((v|0)==2961){v=0;z=k+6|0;a[z]=((d[z]|0)^t)&255;r=d[l+(d[k+6|0]|0)|0]|0;continue}else if((v|0)==2991){v=0;z=d[g+t|0]|0;z=z<<1&255|z>>>7;r=d[l+z|0]|0|z&1;a[g+t|0]=z&255;continue}else if((v|0)==2994){v=0;z=(d[g+t|0]|0)<<1|r&1;r=d[l+z|0]|0;a[g+t|0]=z&255;continue}else if((v|0)==2997){v=0;z=(d[g+t|0]|0)<<1;r=d[l+z|0]|0;a[g+t|0]=z&255;continue}else if((v|0)==3e3){v=0;z=(d[g+t|0]|0)<<1|1;r=d[l+z|0]|0;a[g+t|0]=z&255;continue}else if((v|0)==3003){v=0;z=d[g+t|0]|0;r=z&1;z=z<<7&255|z>>>1;r=r|(d[l+z|0]|0);a[g+t|0]=z&255;continue}else if((v|0)==3006){v=0;z=d[g+t|0]|0;y=z&1;z=r<<7&255|z>>>1;r=d[l+z|0]|0|y;a[g+t|0]=z&255;continue}else if((v|0)==3009){v=0;z=d[g+t|0]|0;r=z&1;z=z&128|z>>>1;r=r|(d[l+z|0]|0);a[g+t|0]=z&255;continue}else if((v|0)==3012){v=0;z=d[g+t|0]|0;r=z&1;z=z>>>1;r=r|(d[l+z|0]|0);a[g+t|0]=z&255;continue}}if((v|0)==2800){m=m-t|0;K=n;L=K-1|0;n=L;M=m;N=j+4|0;c[N>>2]=M;O=r;P=O&255;Q=k;R=Q+7|0;a[R]=P;S=p;T=S&65535;U=l+532|0;V=U+4|0;b[V>>1]=T;W=q;X=W&65535;Y=l+532|0;Z=Y+6|0;b[Z>>1]=X;_=o;$=_&65535;aa=l+532|0;ab=aa+2|0;b[ab>>1]=$;ac=n;ad=ac&65535;ae=l+532|0;af=ae|0;b[af>>1]=ad;ag=l+532|0;ah=ag+8|0;ai=ah;aj=k;ak=ai;al=aj;wh(ak|0,al|0,8)|0;am=l+524|0;an=am;ao=j;c[an>>2]=c[ao>>2];c[an+4>>2]=c[ao+4>>2];ap=l+524|0;aq=l+520|0;c[aq>>2]=ap;ar=f;as=ar&1;i=h;return as|0}else if((v|0)==2988){m=m&3;K=n;L=K-1|0;n=L;M=m;N=j+4|0;c[N>>2]=M;O=r;P=O&255;Q=k;R=Q+7|0;a[R]=P;S=p;T=S&65535;U=l+532|0;V=U+4|0;b[V>>1]=T;W=q;X=W&65535;Y=l+532|0;Z=Y+6|0;b[Z>>1]=X;_=o;$=_&65535;aa=l+532|0;ab=aa+2|0;b[ab>>1]=$;ac=n;ad=ac&65535;ae=l+532|0;af=ae|0;b[af>>1]=ad;ag=l+532|0;ah=ag+8|0;ai=ah;aj=k;ak=ai;al=aj;wh(ak|0,al|0,8)|0;am=l+524|0;an=am;ao=j;c[an>>2]=c[ao>>2];c[an+4>>2]=c[ao+4>>2];ap=l+524|0;aq=l+520|0;c[aq>>2]=ap;ar=f;as=ar&1;i=h;return as|0}else if((v|0)==3022){a5(7520,1025,14528,9952);return 0}else if((v|0)==3168){a5(7520,1648,14528,9952);return 0}return 0}function jC(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=(c[c[b+520>>2]>>2]|0)-d|0;c[c[b+520>>2]>>2]=d;d=(c[b+520>>2]|0)+4|0;c[d>>2]=(c[d>>2]|0)+a;return}function jD(a){a=a|0;var b=0;b=a;return(d[b+1|0]|0)<<8|(d[b|0]|0)|0}function jE(b,c){b=b|0;c=c|0;var d=0;d=b;b=c;a[d+1|0]=b>>>8&255;a[d|0]=b&255;return}function jF(a,b){a=a|0;b=b|0;c[a+4>>2]=b;return}function jG(a,b){a=a|0;b=b|0;c[a+332>>2]=b;return}function jH(a,b){a=a|0;b=b|0;c[a+284>>2]=b;return}function jI(a,b){a=a|0;b=b|0;c[a+232>>2]=b;return}function jJ(a){a=a|0;return+(+h[a+248>>3])}function jK(a){a=a|0;return c[a+324>>2]|0}function jL(a){a=a|0;cP(a);return}function jM(a,b,c){a=a|0;b=b|0;c=c|0;jN(a+900|0,b,c);return 0}function jN(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;a=b;b=d;gn(a+528|0,ka(e,(c[e+8>>2]|0)+(b<<2)|0,1)|0);d=ka(e,(c[e+8>>2]|0)+(b<<2)+2|0,6)|0;if((d|0)!=0){c[a+4>>2]=(jZ(d+4|0)|0)*20|0}gn(a+784|0,ka(e,(c[e>>2]|0)+12|0,1)|0);gn(a+1296|0,ka(e,(c[e>>2]|0)+14|0,1)|0);return}function jO(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;f=a;a=jP(b,e,f+900|0)|0;if((a|0)!=0){g=a;h=g;return h|0}gd(f,(d[(c[f+900>>2]|0)+16|0]|0)+1|0);if((d[(c[f+900>>2]|0)+8|0]|0|0)>2){gA(f,3912)}jI(f,4);iq(f+66992|0,+jJ(f));g=c5(f,3546900)|0;h=g;return h|0}function jP(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;f=a;a=b;b=e;c[b>>2]=f;c[b+4>>2]=f+a;if((a|0)<20){g=c[74]|0;h=g;return h|0}a=f;if((wk(a|0,8016,8)|0)!=0){g=c[74]|0;h=g;return h|0}c[b+8>>2]=ka(b,a+18|0,(d[a+16|0]|0)+1<<2)|0;if((c[b+8>>2]|0)!=0){g=0;h=g;return h|0}else{g=7736;h=g;return h|0}return 0}function jQ(a,b){a=a|0;b=b|0;jR(a+66992|0,b);return}function jR(a,b){a=a|0;b=b|0;jk(a+472|0,b);return}function jS(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;f=b;b=d;d=a;if((f|0)>=3){c[d+920>>2]=b;return}else{iH(d+66992|0,f,b);return}}function jT(a,b){a=a|0;b=+b;var d=0;d=a;c[d+912>>2]=~~(+((jK(d)|0)/50|0|0)/b);return}function jU(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=e;e=d;d=c6(e,f)|0;if((d|0)!=0){g=d;h=g;return h|0}wg(e+1198|0,-55|0,256);wg(e+1454|0,-1|0,16128);wg(e+17582|0,0,49408);wg(e+942|0,-1|0,256);wg(e+66734|0,-1|0,256);d=ka(e+900|0,(c[e+908>>2]|0)+(f<<2)+2|0,14)|0;if((d|0)==0){g=3e3;h=g;return h|0}f=ka(e+900|0,d+10|0,6)|0;if((f|0)==0){g=3e3;h=g;return h|0}i=ka(e+900|0,d+12|0,8)|0;if((i|0)==0){g=3e3;h=g;return h|0}jy(e+336|0,e+1198|0);b[e+870>>1]=(jZ(f)|0)&65535;j=a[d+8|0]|0;a[e+881|0]=j;a[e+879|0]=j;a[e+877|0]=j;a[e+882|0]=j;j=a[d+9|0]|0;a[e+880|0]=j;a[e+878|0]=j;a[e+876|0]=j;a[e+883|0]=j;j=e+884|0;d=e+876|0;b[j>>1]=b[d>>1]|0;b[j+2>>1]=b[d+2>>1]|0;b[j+4>>1]=b[d+4>>1]|0;b[j+6>>1]=b[d+6>>1]|0;d=b[e+880>>1]|0;b[e+874>>1]=d;b[e+872>>1]=d;d=jZ(i)|0;if((d|0)==0){g=3e3;h=g;return h|0}j=jZ(f+2|0)|0;if((j|0)==0){j=d}do{i=i+2|0;k=jZ(i)|0;i=i+2|0;if((d+k|0)>>>0>65536){gA(e,2272);k=65536-d|0}l=ka(e+900|0,i,0)|0;i=i+2|0;if(k>>>0>((c[e+904>>2]|0)-l|0)>>>0){gA(e,1584);k=(c[e+904>>2]|0)-l|0}do{if(d>>>0<16384){if(d>>>0<1024){break}}}while(0);m=e+1198+d|0;n=l;o=k;wh(m|0,n|0,o)|0;if(((c[e+904>>2]|0)-i|0)<8){p=3241;break}o=jZ(i)|0;d=o;}while((o|0)!=0);if((p|0)==3241){gA(e,1584)}p=e+1198|0;wh(p|0,18480,10)|0;p=jZ(f+4|0)|0;if((p|0)!=0){f=e+1198|0;wh(f|0,18496,13)|0;a[e+1207|0]=p&255;a[e+1208|0]=p>>>8&255}a[e+1200|0]=j&255;a[e+1201|0]=j>>>8&255;a[e+1254|0]=-5;j=e+66734|0;p=e+1198|0;wh(j|0,p|0,128)|0;c[e+924>>2]=165;c[e+928>>2]=0;ir(e+66992|0);c[e+916>>2]=c[e+912>>2];c4(e,3546900);hV(e,+j_(e));a[e+940|0]=0;a[e+941|0]=0;c[e+936>>2]=0;g=0;h=g;return h|0}function jV(a){a=a|0;var b=0;b=a;jt(b+336|0);cJ(b);c[b>>2]=21320;im(b+66992|0);c[b+920>>2]=0;jF(b,c[96]|0);hu(b,18464);jG(b,18448);jH(b,6);return}function jW(a){a=a|0;var b=0;b=a;jL(b);cK(b);return}function jX(a,b){a=a|0;b=b|0;var c=0;if((b&255|0)==254){c=255}else{c=255}return c|0}function jY(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function jZ(a){a=a|0;var b=0;b=a;return(d[b|0]|0)<<8|(d[b+1|0]|0)|0}function j_(a){a=a|0;return+(+h[a+240>>3])}function j$(a,b){a=a|0;b=b|0;var d=0;d=a;c[(c[d+520>>2]|0)+4>>2]=b-(c[c[d+520>>2]>>2]|0);return}function j0(a){a=a|0;var b=0;b=a;return(c[(c[b+520>>2]|0)+4>>2]|0)+(c[c[b+520>>2]>>2]|0)|0}function j1(a,b){a=a|0;b=b|0;var d=0;d=(c[a+520>>2]|0)+4|0;c[d>>2]=(c[d>>2]|0)+b;return}function j2(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=d;d=e;e=f;f=b;do{if(!(a[f+941|0]&1)){b=d&65279;if((b|0)==65277){a[f+940|0]=1;c[f+932>>2]=e&15;return}else if((b|0)==48893){a[f+940|0]=1;j3(f+66992|0,g,c[f+932>>2]|0,e);return}else{break}}}while(0);do{if(!(a[f+940|0]&1)){b=d>>>8;do{if((b|0)==246){h=e&192;if((h|0)==192){c[f+932>>2]=c[f+936>>2]&15;break}else if((h|0)==128){j3(f+66992|0,g,c[f+932>>2]|0,c[f+936>>2]|0);break}else{i=3295;break}}else if((b|0)==244){c[f+936>>2]=e}else{i=3295}}while(0);if((i|0)==3295){break}if(a[f+941|0]&1){return}a[f+941|0]=1;c4(f,2e6);hV(f,+j_(f));return}}while(0);return}function j3(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=a;iy(e,b);iu(e,c,d);return}function j4(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;g=d;d=e;e=f;f=b-336|0;do{if((d&255|0)==254){if(a[f+941|0]&1){break}b=c[f+924>>2]|0;e=e&16;if((c[f+928>>2]|0)!=(e|0)){c[f+928>>2]=e;c[f+924>>2]=-b;a[f+940|0]=1;if((c[f+920>>2]|0)!=0){ix(f+67464|0,g,b,c[f+920>>2]|0)}}return}}while(0);j2(f,g,d,e);return}function j5(f,g,h){f=f|0;g=g|0;h=h|0;var i=0,j=0;h=g;g=f;j$(g+336|0,0);if((a[g+940|0]&1|a[g+941|0]&1|0)==0){f=h;c[f>>2]=(c[f>>2]|0)/2|0}while(1){f=j0(g+336|0)|0;if((f|0)>=(c[h>>2]|0)){break}jB(g+336|0,jY(c[h>>2]|0,c[g+916>>2]|0)|0)|0;f=j0(g+336|0)|0;if((f|0)>=(c[g+916>>2]|0)){f=g+916|0;c[f>>2]=(c[f>>2]|0)+(c[g+912>>2]|0);if((a[g+892|0]|0)!=0){if((d[g+1198+(e[g+868>>1]|0)|0]|0)==118){f=g+868|0;b[f>>1]=(b[f>>1]|0)+1&65535}a[g+893|0]=0;a[g+892|0]=0;f=e[g+868>>1]>>8&255;i=g+870|0;j=(b[i>>1]|0)-1&65535;b[i>>1]=j;a[g+1198+(j&65535)|0]=f;f=b[g+868>>1]&255;j=g+870|0;i=(b[j>>1]|0)-1&65535;b[j>>1]=i;a[g+1198+(i&65535)|0]=f;b[g+868>>1]=56;j1(g+336|0,12);if((d[g+896|0]|0)==2){j1(g+336|0,6);f=(d[g+895|0]<<8)+255|0;b[g+868>>1]=(d[g+1198+(f+1&65535)|0]<<8)+(d[g+1198+f|0]|0)&65535}}}}c[h>>2]=j0(g+336|0)|0;f=g+916|0;c[f>>2]=(c[f>>2]|0)-(c[h>>2]|0);j1(g+336|0,-(c[h>>2]|0)|0);kb(g+66992|0,c[h>>2]|0);return 0}function j6(a){a=a|0;return vi(a)|0}function j7(a){a=a|0;ke(a);return}function j8(a){a=a|0;var b=0;b=a;hO(b);c[b>>2]=19432;return}function j9(a){a=a|0;kk(a);return}function ka(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=a;a=b;b=a-(c[e>>2]|0)|0;f=(c[e+4>>2]|0)-(c[e>>2]|0)|0;if(b>>>0>(f-2|0)>>>0){a5(9104,52,16192,8680);return 0}e=((jZ(a)|0)&65535)<<16>>16;do{if((e|0)!=0){if((b+e|0)>>>0>(f-d|0)>>>0){break}g=a+e|0;h=g;return h|0}}while(0);g=0;h=g;return h|0}function kb(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+48>>2]|0)){iy(b,d)}if((c[b+48>>2]|0)<(d|0)){a5(9816,102,14600,9424)}a=b+48|0;c[a>>2]=(c[a>>2]|0)-d;return}function kc(){var a=0,b=0,c=0;a=j6(68280)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;jV(b);c=b}return c|0}function kd(){var a=0,b=0,c=0;a=j6(328)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;j7(b);c=b}return c|0}function ke(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=21232;jF(b,c[96]|0);return}function kf(a){a=a|0;var b=0;b=a;j9(b);cK(b);return}function kg(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((a|0)<(c|0)){d=c}else{d=a}return d|0}function kh(a,b){a=a|0;b=+b;var d=0.0,e=0;d=b;e=a;c[e+24>>2]=16384;if(d==1.0){return}c[e+24>>2]=~~(+(c[e+24>>2]|0)/d);return}function ki(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;f=a;a=jP(b,e,f+316|0)|0;if((a|0)!=0){g=a;h=g;return h|0}gd(f,(d[(c[f+316>>2]|0)+16|0]|0)+1|0);g=0;h=g;return h|0}function kj(a,b,c){a=a|0;b=b|0;c=c|0;jN(a+316|0,b,c);return 0}function kk(a){a=a|0;ik(a);return}function kl(a){a=a|0;var b=0,d=0;b=a;io(b+376|0);jv(b+1192|0);c[b+96>>2]=b+376;c[b+164>>2]=b+376;c[b+228>>2]=b+1192;c[b+320>>2]=b+1192;c[b>>2]=b+44;c[b+4>>2]=b+112;c[b+8>>2]=b+180;c[b+12>>2]=b+268;a=0;while(1){if((a|0)>=4){break}d=c[b+(a<<2)>>2]|0;c[d+24>>2]=b+328+(a*5|0);c[d+16>>2]=0;c[d>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;a=a+1|0}kh(b,1.0);km(b,1.0);kn(b);return}function km(a,b){a=a|0;b=+b;var c=0;c=a;h[c+32>>3]=625.0e-6*b;kq(c);return}function kn(b){b=b|0;var d=0;d=b;c[d+16>>2]=0;c[d+20>>2]=0;c[d+40>>2]=0;kN(d+44|0);kN(d+112|0);kG(d+180|0);kr(d+268|0);c[d+324>>2]=1;c[d+232>>2]=0;a[d+348|0]=119;kq(d);a[d+350|0]=1;kt(d,0,65318,0);b=d+236|0;wh(b|0,18432,32)|0;return}function ko(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;jk(b+376|0,c);jl(b+1192|0,c);return}function kp(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b;b=c;c=d;d=a;a=0;while(1){if((a|0)>=4){break}ks(d,a,e,b,c);a=a+1|0}return}function kq(a){a=a|0;var b=0,c=0.0,e=0.0;b=a;a=d[b+348|0]|0;c=+((kg(a&7,a>>4&7)|0)+1|0);e=c*+h[b+32>>3];iE(b+376|0,e);ji(b+1192|0,e);return}function kr(a){a=a|0;var b=0;b=a;c[b+48>>2]=0;kG(b);return}function ks(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=b;b=d;d=e;e=f;f=a;if(g>>>0>=4){a5(6704,59,14448,9784)}do{if((b|0)!=0){if((d|0)==0){h=3423;break}if((e|0)!=0){h=3426}else{h=3423}}else{h=3423}}while(0);L3804:do{if((h|0)==3423){do{if((b|0)==0){if((d|0)!=0){break}if((e|0)==0){h=3426;break L3804}}}while(0);a5(6704,60,14448,6792)}}while(0);h=c[f+(g<<2)>>2]|0;c[h+4>>2]=e;c[h+8>>2]=d;c[h+12>>2]=b;c[h+16>>2]=c[h+(c[h+20>>2]<<2)>>2];return}function kt(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0;h=e;e=f;f=g;g=b;if(f>>>0>=256){a5(6704,202,14328,2248)}b=e-65296|0;if(b>>>0>=48){return}kA(g,h);i=d[g+328+b|0]|0;a[g+328+b|0]=f&255;if(e>>>0<65316){kW(g,(b|0)/5|0,b,f);return}do{if((e|0)==65316){if((f|0)==(i|0)){j=3451;break}b=0;while(1){if((b|0)>=4){break}k=c[g+(b<<2)>>2]|0;l=c[k+32>>2]|0;c[k+32>>2]=0;do{if((l|0)!=0){if((c[k+44>>2]|0)==0){break}if((c[k+16>>2]|0)==0){break}jb(g+1192|0,h,-l|0,c[k+16>>2]|0)}}while(0);b=b+1|0}if((c[g+192>>2]|0)!=0){jb(g+1192|0,h,30,c[g+192>>2]|0)}kq(g);if((c[g+192>>2]|0)!=0){jb(g+1192|0,h,-30,c[g+192>>2]|0)}}else{j=3451}}while(0);if((j|0)==3451){do{if((e|0)==65317){j=3453}else{if((e|0)==65318){j=3453;break}if(e>>>0>=65328){b=(e&15)<<1;a[g+236+b|0]=f>>4&255;a[g+236+(b+1)|0]=f&15}}}while(0);if((j|0)==3453){j=(a[g+350|0]&128|0)!=0?-1:0;b=(d[g+349|0]|0)&j;k=0;while(1){if((k|0)>=4){break}l=c[g+(k<<2)>>2]|0;m=l+44|0;c[m>>2]=c[m>>2]&j;m=b>>k;n=c[l+16>>2]|0;c[l+20>>2]=m>>3&2|m&1;c[l+16>>2]=c[l+(c[l+20>>2]<<2)>>2];if((c[l+16>>2]|0)!=(n|0)){m=c[l+32>>2]|0;c[l+32>>2]=0;do{if((m|0)!=0){if((n|0)==0){break}jb(g+1192|0,h,-m|0,n)}}while(0)}k=k+1|0}do{if((e|0)==65318){if((f|0)==(i|0)){break}if((f&128|0)==0){k=0;while(1){if(k>>>0>=32){break}if((k|0)!=22){kt(g,h,k+65296|0,d[27688+k|0]|0)}k=k+1|0}}}}while(0)}}return}function ku(a,b){a=a|0;b=b|0;var d=0;d=b;return(c[(c[a+20>>2]|0)+(d>>>13<<2)>>2]|0)+((d>>>0)%8192|0)|0}function kv(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;c[(c[a+20>>2]|0)+(e<<2)>>2]=d+(-(e<<13&8191)|0);return}function kw(a,b){a=a|0;b=b|0;var c=0,e=0,f=0;c=b;b=a;a=d[ku(b+336|0,c)|0]|0;if((c-65296|0)>>>0<48){a=kC(b+25136|0,kx(b)|0,c)|0;e=a;return e|0}do{if((c-32768|0)>>>0<8192){f=3490}else{if((c-57344|0)>>>0<7936){f=3490;break}}}while(0);e=a;return e|0}function kx(a){a=a|0;var b=0;b=a;a=c[b+424>>2]|0;return a-(kF(b+336|0)|0)|0}function ky(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0;e=c;c=d;d=b;b=e-40960|0;if(b>>>0>24575){if((e^8192)>>>0<=8191){k8(d,c)}else{if((e-32768|0)>>>0<8192){f=3516}else{if((e-57344|0)>>>0<7936){f=3516}}}return}a[d+548+b|0]=c&255;if((e^57344)>>>0<=8063){if((e-65296|0)>>>0<48){kt(d+25136|0,kx(d)|0,e,c)}else{if((e^65286)>>>0<2){la(d)}else{if((e|0)==65280){a[d+548+b|0]=0}else{a[d+548+b|0]=-1}}}}return}function kz(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;c[b+20>>2]=b+24;c[b+60>>2]=0;a=0;while(1){if((a|0)>=9){break}kv(b,a,d);a=a+1|0}wg(b|0,0,16);f8();return}function kA(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=d;d=b;if((e|0)<(c[d+20>>2]|0)){a5(6704,131,14248,4936)}if((e|0)==(c[d+20>>2]|0)){return}while(1){b=c[d+16>>2]|0;if((b|0)>(e|0)){b=e}f=0;while(1){if((f|0)>=4){break}g=c[d+(f<<2)>>2]|0;if((c[g+16>>2]|0)!=0){iv(c[g+16>>2]|0);h=0;do{if((c[g+44>>2]|0)!=0){if((c[g+36>>2]|0)==0){break}if((a[(c[g+24>>2]|0)+4|0]&64|0)!=0){if((c[g+40>>2]|0)==0){break}}h=-1}}while(0);g=f;if((g|0)==0){kO(d+44|0,c[d+20>>2]|0,b,h)}else if((g|0)==1){kO(d+112|0,c[d+20>>2]|0,b,h)}else if((g|0)==2){kQ(d+180|0,c[d+20>>2]|0,b,h)}else if((g|0)==3){kP(d+268|0,c[d+20>>2]|0,b,h)}}f=f+1|0}c[d+20>>2]=b;if((b|0)==(e|0)){break}f=d+16|0;c[f>>2]=(c[f>>2]|0)+(c[d+24>>2]|0);kH(d+44|0);kH(d+112|0);kH(d+180|0);kH(d+268|0);c[d+40>>2]=(c[d+40>>2]|0)+1&3;if((c[d+40>>2]|0)==0){kI(d+44|0);kI(d+112|0);kI(d+268|0)}if((c[d+40>>2]&1|0)!=0){kK(d+44|0)}}return}function kB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=a;if((d|0)>(c[b+20>>2]|0)){kA(b,d)}if((c[b+16>>2]|0)<(d|0)){a5(6704,193,14288,3880)}a=b+16|0;c[a>>2]=(c[a>>2]|0)-d;if((c[b+20>>2]|0)>=(d|0)){e=d;f=b+20|0;g=c[f>>2]|0;h=g-e|0;c[f>>2]=h;return}else{a5(6704,196,14288,2976);e=d;f=b+20|0;g=c[f>>2]|0;h=g-e|0;c[f>>2]=h;return}}function kC(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0;g=f;f=b;kA(f,e);e=g-65296|0;if(e>>>0>=48){a5(6704,291,14392,1544);return 0}b=d[f+328+e|0]|0;if((g|0)!=65318){h=b;return h|0}b=b&128|112;g=0;while(1){if((g|0)>=4){break}e=c[f+(g<<2)>>2]|0;do{if((c[e+44>>2]|0)!=0){if((c[e+40>>2]|0)==0){if((a[(c[e+24>>2]|0)+4|0]&64|0)!=0){break}}b=b|1<<g}}while(0);g=g+1|0}h=b;return h|0}function kD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b;b=c;c=d;d=a;if(((e>>>0)%8192|0|0)!=0){a5(6432|0,74,14160|0,9712|0)}if(((b>>>0)%8192|0|0)!=0){a5(6432|0,75,14160|0,6760|0)}a=(e>>>0)/8192|0;e=(b>>>0)/8192|0;while(1){b=e;e=b-1|0;if((b|0)==0){break}kv(d,a+e|0,c+(e<<13)|0)}return}function kE(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0;h=i;i=i+48|0;j=h|0;k=h+40|0;l=f;c[l+60>>2]=((g+4|0)>>>0)/4|0;c[l+20>>2]=j;g=j;f=l+24|0;wh(g|0,f|0,40)|0;f=k;g=l|0;wh(f|0,g|0,8)|0;g=c[l+8>>2]|0;f=e[l+12>>1]|0;m=d[l+7|0]|0;L4031:while(1){n=c[j+(g>>>13<<2)>>2]|0;n=n+(g&8191)|0;o=n;n=o+1|0;p=d[o]|0;g=g+1|0;o=j+36|0;q=(c[o>>2]|0)-1|0;c[o>>2]=q;if((q|0)==0){r=3600;break}q=d[n]|0;o=p;do{if((o|0)==33){b[k+4>>1]=(jD(n)|0)&65535;g=g+2|0;continue L4031}else if((o|0)==40){g=g+1|0;if((m&128|0)!=0){g=g+((q&255)<<24>>24)&65535;continue L4031}else{continue L4031}}else if((o|0)==240){s=q|65280;g=g+1|0;r=3616}else if((o|0)==32){g=g+1|0;if((m&128|0)!=0){continue L4031}else{g=g+((q&255)<<24>>24)&65535;continue L4031}}else if((o|0)==233){g=e[k+4>>1]|0;continue L4031}else if((o|0)==210){g=g+2|0;if((m&16|0)!=0){continue L4031}else{r=3902;break}}else if((o|0)==218){g=g+2|0;if((m&16|0)!=0){r=3902;break}else{continue L4031}}else if((o|0)==47){a[k+6|0]=~(d[k+6|0]|0)&255;m=m|96;continue L4031}else if((o|0)==63){m=(m^16)&-97;continue L4031}else if((o|0)==195){g=jD(n)|0;continue L4031}else if((o|0)==194){g=g+2|0;if((m&128|0)!=0){continue L4031}else{r=3902;break}}else if((o|0)==202){g=g+2|0;if((m&128|0)!=0){r=3902;break}else{continue L4031}}else if((o|0)==55){m=(m|16)&-97;continue L4031}else if((o|0)==243){continue L4031}else if((o|0)==251){continue L4031}else if((o|0)==221|(o|0)==211|(o|0)==219|(o|0)==227|(o|0)==228|(o|0)==235|(o|0)==236|(o|0)==244|(o|0)==253|(o|0)==252|(o|0)==16|(o|0)==39|(o|0)==191|(o|0)==237|(o|0)==118){r=3914;break L4031}else if((o|0)==242){s=d[k|0]|0|65280;r=3616}else if((o|0)==10){s=e[k>>1]|0;r=3616}else if((o|0)==58){s=e[k+4>>1]|0;b[k+4>>1]=s-1&65535;r=3616}else if((o|0)==26){s=e[k+2>>1]|0;r=3616}else if((o|0)==42){s=e[k+4>>1]|0;b[k+4>>1]=s+1&65535;r=3616}else if((o|0)==250){s=jD(n)|0;g=g+2|0;r=3616}else if((o|0)==190){if((l|0)==0){t=0}else{t=l-336|0}q=kw(t,e[k+4>>1]|0)|0;r=3632}else if((o|0)==184|(o|0)==185|(o|0)==186|(o|0)==187|(o|0)==188|(o|0)==189){q=d[k+(p&7^1)|0]|0;r=3632}else if((o|0)==254){g=g+1|0;r=3632}else if((o|0)==70|(o|0)==78|(o|0)==86|(o|0)==94|(o|0)==102|(o|0)==110|(o|0)==126){u=e[k+4>>1]|0;a[k+(p>>>3&7^1)|0]=a[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;if((u-65296|0)>>>0<48){if((l|0)==0){v=0}else{v=l-336|0}if((l|0)==0){w=0}else{w=l-336|0}a[k+(p>>>3&7^1)|0]=(kC(v+25136|0,(c[w+424>>2]|0)-(c[j+36>>2]<<2)|0,u)|0)&255}continue L4031}else if((o|0)==196){g=g+2|0;if((m&128|0)!=0){continue L4031}else{r=3649;break}}else if((o|0)==205){r=3650}else if((o|0)==200){if((m&128|0)!=0){r=3661;break}else{continue L4031}}else if((o|0)==201){r=3661}else if((o|0)==0|(o|0)==64|(o|0)==73|(o|0)==82|(o|0)==91|(o|0)==100|(o|0)==109|(o|0)==127){continue L4031}else if((o|0)==203){g=g+1|0;u=q;if((u|0)==70|(u|0)==78|(u|0)==86|(u|0)==94|(u|0)==102|(u|0)==110|(u|0)==118|(u|0)==126){x=e[k+4>>1]|0;y=d[(c[j+(x>>>13<<2)>>2]|0)+(x&8191)|0]|0;if((x-65296|0)>>>0<48){if((l|0)==0){z=0}else{z=l-336|0}if((l|0)==0){A=0}else{A=l-336|0}y=kC(z+25136|0,(c[A+424>>2]|0)-(c[j+36>>2]<<2)|0,x)|0}r=3682}else if((u|0)==64|(u|0)==65|(u|0)==66|(u|0)==67|(u|0)==68|(u|0)==69|(u|0)==71|(u|0)==72|(u|0)==73|(u|0)==74|(u|0)==75|(u|0)==76|(u|0)==77|(u|0)==79|(u|0)==80|(u|0)==81|(u|0)==82|(u|0)==83|(u|0)==84|(u|0)==85|(u|0)==87|(u|0)==88|(u|0)==89|(u|0)==90|(u|0)==91|(u|0)==92|(u|0)==93|(u|0)==95|(u|0)==96|(u|0)==97|(u|0)==98|(u|0)==99|(u|0)==100|(u|0)==101|(u|0)==103|(u|0)==104|(u|0)==105|(u|0)==106|(u|0)==107|(u|0)==108|(u|0)==109|(u|0)==111|(u|0)==112|(u|0)==113|(u|0)==114|(u|0)==115|(u|0)==116|(u|0)==117|(u|0)==119|(u|0)==120|(u|0)==121|(u|0)==122|(u|0)==123|(u|0)==124|(u|0)==125|(u|0)==127){y=d[k+(q&7^1)|0]|0;r=3682}else if((u|0)==134|(u|0)==142|(u|0)==150|(u|0)==158|(u|0)==166|(u|0)==174|(u|0)==182|(u|0)==190|(u|0)==198|(u|0)==206|(u|0)==214|(u|0)==222|(u|0)==230|(u|0)==238|(u|0)==246|(u|0)==254){if((l|0)==0){B=0}else{B=l-336|0}x=kw(B,e[k+4>>1]|0)|0;C=1<<(q>>>3&7);x=x&~C;if((q&64|0)==0){C=0}if((l|0)==0){D=0}else{D=l-336|0}ky(D,e[k+4>>1]|0,x|C);continue L4031}else if((u|0)==192|(u|0)==193|(u|0)==194|(u|0)==195|(u|0)==196|(u|0)==197|(u|0)==199|(u|0)==200|(u|0)==201|(u|0)==202|(u|0)==203|(u|0)==204|(u|0)==205|(u|0)==207|(u|0)==208|(u|0)==209|(u|0)==210|(u|0)==211|(u|0)==212|(u|0)==213|(u|0)==215|(u|0)==216|(u|0)==217|(u|0)==218|(u|0)==219|(u|0)==220|(u|0)==221|(u|0)==223|(u|0)==224|(u|0)==225|(u|0)==226|(u|0)==227|(u|0)==228|(u|0)==229|(u|0)==231|(u|0)==232|(u|0)==233|(u|0)==234|(u|0)==235|(u|0)==236|(u|0)==237|(u|0)==239|(u|0)==240|(u|0)==241|(u|0)==242|(u|0)==243|(u|0)==244|(u|0)==245|(u|0)==247|(u|0)==248|(u|0)==249|(u|0)==250|(u|0)==251|(u|0)==252|(u|0)==253|(u|0)==255){C=k+(q&7^1)|0;a[C]=(d[C]|0|1<<(q>>>3&7))&255;continue L4031}else if((u|0)==128|(u|0)==129|(u|0)==130|(u|0)==131|(u|0)==132|(u|0)==133|(u|0)==135|(u|0)==136|(u|0)==137|(u|0)==138|(u|0)==139|(u|0)==140|(u|0)==141|(u|0)==143|(u|0)==144|(u|0)==145|(u|0)==146|(u|0)==147|(u|0)==148|(u|0)==149|(u|0)==151|(u|0)==152|(u|0)==153|(u|0)==154|(u|0)==155|(u|0)==156|(u|0)==157|(u|0)==159|(u|0)==160|(u|0)==161|(u|0)==162|(u|0)==163|(u|0)==164|(u|0)==165|(u|0)==167|(u|0)==168|(u|0)==169|(u|0)==170|(u|0)==171|(u|0)==172|(u|0)==173|(u|0)==175|(u|0)==176|(u|0)==177|(u|0)==178|(u|0)==179|(u|0)==180|(u|0)==181|(u|0)==183|(u|0)==184|(u|0)==185|(u|0)==186|(u|0)==187|(u|0)==188|(u|0)==189|(u|0)==191){C=k+(q&7^1)|0;a[C]=(d[C]|0)&~(1<<(q>>>3&7))&255;continue L4031}else if((u|0)==54){if((l|0)==0){E=0}else{E=l-336|0}F=kw(E,e[k+4>>1]|0)|0;r=3699}else if((u|0)==48|(u|0)==49|(u|0)==50|(u|0)==51|(u|0)==52|(u|0)==53|(u|0)==55){F=d[k+(q&7^1)|0]|0;r=3699}else if((u|0)==6|(u|0)==22|(u|0)==38){if((l|0)==0){G=0}else{G=l-336|0}p=kw(G,e[k+4>>1]|0)|0;r=3714;break}else if((u|0)==32|(u|0)==33|(u|0)==34|(u|0)==35|(u|0)==36|(u|0)==37|(u|0)==39|(u|0)==0|(u|0)==1|(u|0)==2|(u|0)==3|(u|0)==4|(u|0)==5|(u|0)==7|(u|0)==16|(u|0)==17|(u|0)==18|(u|0)==19|(u|0)==20|(u|0)==21|(u|0)==23){p=d[k+(q&7^1)|0]|0;r=3714;break}else if((u|0)==62){q=q+16|0;r=3706}else if((u|0)==30|(u|0)==14|(u|0)==46){r=3706}else if((u|0)==56|(u|0)==57|(u|0)==58|(u|0)==59|(u|0)==60|(u|0)==61|(u|0)==63){q=q+16|0;r=3711}else if((u|0)==24|(u|0)==25|(u|0)==26|(u|0)==27|(u|0)==28|(u|0)==29|(u|0)==31|(u|0)==8|(u|0)==9|(u|0)==10|(u|0)==11|(u|0)==12|(u|0)==13|(u|0)==15|(u|0)==40|(u|0)==41|(u|0)==42|(u|0)==43|(u|0)==44|(u|0)==45|(u|0)==47){r=3711}else{r=3712;break L4031}if((r|0)==3682){r=0;m=m&-65;m=m|160;m=m^y<<(~q>>>3&7)&128;continue L4031}else if((r|0)==3699){r=0;p=F>>4|F<<4;m=0;r=3723;break}else if((r|0)==3706){r=0;if((l|0)==0){H=0}else{H=l-336|0}p=kw(H,e[k+4>>1]|0)|0;r=3718;break}else if((r|0)==3711){r=0;p=d[k+(q&7^1)|0]|0;r=3718;break}}else if((o|0)==7|(o|0)==23){q=p;p=d[k+6|0]|0;r=3714}else if((o|0)==15|(o|0)==31){q=p;p=d[k+6|0]|0;r=3718}else if((o|0)==112|(o|0)==113|(o|0)==114|(o|0)==115|(o|0)==116|(o|0)==117|(o|0)==119){p=d[k+(p&7^1)|0]|0;r=3729}else if((o|0)==65|(o|0)==66|(o|0)==67|(o|0)==68|(o|0)==69|(o|0)==71|(o|0)==72|(o|0)==74|(o|0)==75|(o|0)==76|(o|0)==77|(o|0)==79|(o|0)==80|(o|0)==81|(o|0)==83|(o|0)==84|(o|0)==85|(o|0)==87|(o|0)==88|(o|0)==89|(o|0)==90|(o|0)==92|(o|0)==93|(o|0)==95|(o|0)==96|(o|0)==97|(o|0)==98|(o|0)==99|(o|0)==101|(o|0)==103|(o|0)==104|(o|0)==105|(o|0)==106|(o|0)==107|(o|0)==108|(o|0)==111|(o|0)==120|(o|0)==121|(o|0)==122|(o|0)==123|(o|0)==124|(o|0)==125){a[k+(p>>>3&7^1)|0]=a[k+(p&7^1)|0]|0;continue L4031}else if((o|0)==8){q=jD(n)|0;g=g+2|0;if((l|0)==0){I=0}else{I=l-336|0}ky(I,q,f&255);q=q+1|0;if((l|0)==0){J=0}else{J=l-336|0}ky(J,q,f>>>8);continue L4031}else if((o|0)==249){f=e[k+4>>1]|0;continue L4031}else if((o|0)==49){f=jD(n)|0;g=g+2|0;continue L4031}else if((o|0)==1|(o|0)==17){b[k+(p>>>4<<1)>>1]=(jD(n)|0)&65535;g=g+2|0;continue L4031}else if((o|0)==224){K=q|65280;g=g+1|0;r=3751}else if((o|0)==226){K=d[k|0]|0|65280;r=3751}else if((o|0)==50){K=e[k+4>>1]|0;b[k+4>>1]=K-1&65535;r=3751}else if((o|0)==2){K=e[k>>1]|0;r=3751}else if((o|0)==18){K=e[k+2>>1]|0;r=3751}else if((o|0)==34){K=e[k+4>>1]|0;b[k+4>>1]=K+1&65535;r=3751}else if((o|0)==234){K=jD(n)|0;g=g+2|0;r=3751}else if((o|0)==6){a[k+1|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==14){a[k|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==22){a[k+3|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==30){a[k+2|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==38){a[k+5|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==46){a[k+4|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==54){if((l|0)==0){L=0}else{L=l-336|0}ky(L,e[k+4>>1]|0,q);g=g+1|0;continue L4031}else if((o|0)==62){a[k+6|0]=q&255;g=g+1|0;continue L4031}else if((o|0)==3|(o|0)==19|(o|0)==35){u=k+(p>>>4<<1)|0;b[u>>1]=(b[u>>1]|0)+1&65535;continue L4031}else if((o|0)==51){f=f+1&65535;continue L4031}else if((o|0)==11|(o|0)==27|(o|0)==43){u=k+(p>>>4<<1)|0;b[u>>1]=(b[u>>1]|0)-1&65535;continue L4031}else if((o|0)==59){f=f-1&65535;continue L4031}else if((o|0)==52){p=e[k+4>>1]|0;if((l|0)==0){M=0}else{M=l-336|0}q=kw(M,p)|0;q=q+1|0;if((l|0)==0){N=0}else{N=l-336|0}ky(N,p,q&255);r=3778}else if((o|0)==4|(o|0)==12|(o|0)==20|(o|0)==28|(o|0)==36|(o|0)==44|(o|0)==60){p=p>>>3&7;u=(d[k+(p^1)|0]|0)+1|0;q=u;a[k+(p^1)|0]=u&255;r=3778}else if((o|0)==53){p=e[k+4>>1]|0;if((l|0)==0){O=0}else{O=l-336|0}q=kw(O,p)|0;q=q-1|0;if((l|0)==0){P=0}else{P=l-336|0}ky(P,p,q&255);r=3787}else if((o|0)==5|(o|0)==13|(o|0)==21|(o|0)==29|(o|0)==37|(o|0)==45|(o|0)==61){p=p>>>3&7;q=(d[k+(p^1)|0]|0)-1|0;a[k+(p^1)|0]=q&255;r=3787}else if((o|0)==248){Q=(q&255)<<24>>24;g=g+1|0;m=0;Q=Q+f|0;R=f;r=3795}else if((o|0)==232){Q=(q&255)<<24>>24;g=g+1|0;m=0;Q=Q+f|0;R=f;f=Q&65535;r=3796}else if((o|0)==57){Q=f;r=3794}else if((o|0)==9|(o|0)==25|(o|0)==41){Q=e[k+(p>>>4<<1)>>1]|0;r=3794}else if((o|0)==134){if((l|0)==0){S=0}else{S=l-336|0}q=kw(S,e[k+4>>1]|0)|0;r=3803}else if((o|0)==128|(o|0)==129|(o|0)==130|(o|0)==131|(o|0)==132|(o|0)==133|(o|0)==135){q=d[k+(p&7^1)|0]|0;r=3803}else if((o|0)==198){g=g+1|0;r=3803}else if((o|0)==142){if((l|0)==0){T=0}else{T=l-336|0}q=kw(T,e[k+4>>1]|0)|0;r=3812}else if((o|0)==136|(o|0)==137|(o|0)==138|(o|0)==139|(o|0)==140|(o|0)==141|(o|0)==143){q=d[k+(p&7^1)|0]|0;r=3812}else if((o|0)==206){g=g+1|0;r=3812}else if((o|0)==150){if((l|0)==0){U=0}else{U=l-336|0}q=kw(U,e[k+4>>1]|0)|0;r=3819}else if((o|0)==144|(o|0)==145|(o|0)==146|(o|0)==147|(o|0)==148|(o|0)==149|(o|0)==151){q=d[k+(p&7^1)|0]|0;r=3819}else if((o|0)==214){g=g+1|0;r=3819}else if((o|0)==158){if((l|0)==0){V=0}else{V=l-336|0}q=kw(V,e[k+4>>1]|0)|0;r=3826}else if((o|0)==152|(o|0)==153|(o|0)==154|(o|0)==155|(o|0)==156|(o|0)==157|(o|0)==159){q=d[k+(p&7^1)|0]|0;r=3826}else if((o|0)==222){g=g+1|0;r=3826}else if((o|0)==160|(o|0)==161|(o|0)==162|(o|0)==163|(o|0)==164|(o|0)==165){q=d[k+(p&7^1)|0]|0;r=3833}else if((o|0)==166){if((l|0)==0){W=0}else{W=l-336|0}q=kw(W,e[k+4>>1]|0)|0;g=g-1|0;r=3832}else if((o|0)==230){r=3832}else if((o|0)==167){r=3834}else if((o|0)==176|(o|0)==177|(o|0)==178|(o|0)==179|(o|0)==180|(o|0)==181){q=d[k+(p&7^1)|0]|0;r=3841}else if((o|0)==182){if((l|0)==0){X=0}else{X=l-336|0}q=kw(X,e[k+4>>1]|0)|0;g=g-1|0;r=3840}else if((o|0)==246){r=3840}else if((o|0)==183){r=3842}else if((o|0)==168|(o|0)==169|(o|0)==170|(o|0)==171|(o|0)==172|(o|0)==173){q=d[k+(p&7^1)|0]|0;r=3849}else if((o|0)==174){if((l|0)==0){Y=0}else{Y=l-336|0}q=kw(Y,e[k+4>>1]|0)|0;g=g-1|0;r=3848}else if((o|0)==238){r=3848}else if((o|0)==175){a[k+6|0]=0;m=128;continue L4031}else if((o|0)==241|(o|0)==193|(o|0)==209|(o|0)==225){if((l|0)==0){Z=0}else{Z=l-336|0}q=kw(Z,f)|0;if((l|0)==0){_=0}else{_=l-336|0}b[k+((p>>>4&3)<<1)>>1]=q+((kw(_,f+1|0)|0)<<8)&65535;f=f+2&65535;if((p|0)!=241){continue L4031}else{m=a[k+7|0]&240;continue L4031}}else if((o|0)==197){q=e[k>>1]|0;r=3651}else if((o|0)==213){q=e[k+2>>1]|0;r=3651}else if((o|0)==229){q=e[k+4>>1]|0;r=3651}else if((o|0)==245){q=m<<8|(d[k+6|0]|0);r=3651}else if((o|0)==255){if((g|0)==61454){r=3865;break L4031}r=3867}else if((o|0)==199|(o|0)==207|(o|0)==215|(o|0)==223|(o|0)==231|(o|0)==239|(o|0)==247){r=3867}else if((o|0)==204){g=g+2|0;if((m&128|0)!=0){r=3649;break}else{continue L4031}}else if((o|0)==212){g=g+2|0;if((m&16|0)!=0){continue L4031}else{r=3649;break}}else if((o|0)==220){g=g+2|0;if((m&16|0)!=0){r=3649;break}else{continue L4031}}else if((o|0)==217){r=3662}else if((o|0)==192){if((m&128|0)!=0){continue L4031}else{r=3662;break}}else if((o|0)==208){if((m&16|0)!=0){continue L4031}else{r=3662;break}}else if((o|0)==216){if((m&16|0)!=0){r=3662;break}else{continue L4031}}else if((o|0)==24){g=g+1|0;g=g+((q&255)<<24>>24)&65535;continue L4031}else if((o|0)==48){g=g+1|0;if((m&16|0)!=0){continue L4031}else{g=g+((q&255)<<24>>24)&65535;continue L4031}}else if((o|0)==56){g=g+1|0;if((m&16|0)!=0){g=g+((q&255)<<24>>24)&65535;continue L4031}else{continue L4031}}else{r=3915;break L4031}}while(0);if((r|0)==3902){r=0;g=g-2|0;g=jD(n)|0;continue}else if((r|0)==3616){r=0;a[k+6|0]=a[(c[j+(s>>>13<<2)>>2]|0)+(s&8191)|0]|0;if((s-65296|0)>>>0<48){if((l|0)==0){$=0}else{$=l-336|0}if((l|0)==0){aa=0}else{aa=l-336|0}a[k+6|0]=(kC($+25136|0,(c[aa+424>>2]|0)-(c[j+36>>2]<<2)|0,s)|0)&255}continue}else if((r|0)==3632){r=0;p=d[k+6|0]|0;q=p-q|0;r=3633}else if((r|0)==3649){r=0;g=g-2|0;r=3650}else if((r|0)==3661){r=0;r=3662}else if((r|0)==3714){r=0;p=p<<1;p=p|(q&m)>>>4&1;m=p>>>4&16;if(q>>>0<16){p=p|p>>>8}r=3723}else if((r|0)==3718){r=0;p=p|(q&m)<<4;m=p<<4&16;if(q>>>0<16){p=p|p<<8}p=p>>>1;if((q&32|0)!=0){p=p|p<<1&128}r=3723}else if((r|0)==3751){r=0;if((l|0)==0){ab=0}else{ab=l-336|0}ky(ab,K,d[k+6|0]|0);continue}else if((r|0)==3778){r=0;m=m&16|(q&15)-1&32|q>>>1&128;continue}else if((r|0)==3787){r=0;m=m&16|64|(q&15)+49&32;if((q&255|0)!=0){continue}else{m=m|128;continue}}else if((r|0)==3794){r=0;R=e[k+4>>1]|0;Q=Q+R|0;m=m&128;r=3795}else if((r|0)==3812){r=0;q=q+(m>>>4&1)|0;q=q&255;r=3803}else if((r|0)==3826){r=0;q=q+(m>>>4&1)|0;q=q&255;r=3819}else if((r|0)==3832){r=0;g=g+1|0;r=3833}else if((r|0)==3840){r=0;g=g+1|0;r=3841}else if((r|0)==3848){r=0;g=g+1|0;r=3849}else if((r|0)==3867){r=0;q=g;g=(p&56)+(c[l+16>>2]|0)|0;r=3651}do{if((r|0)==3650){r=0;q=g+2|0;g=jD(n)|0;r=3651}else if((r|0)==3662){r=0;if((l|0)==0){ac=0}else{ac=l-336|0}g=kw(ac,f)|0;if((l|0)==0){ad=0}else{ad=l-336|0}g=g+((kw(ad,f+1|0)|0)<<8)|0;f=f+2&65535;continue L4031}else if((r|0)==3723){r=0;q=q&7;if((p&255|0)==0){m=m|128}if((q|0)==6){r=3729;break}else{a[k+(q^1)|0]=p&255;continue L4031}}else if((r|0)==3795){r=0;b[k+4>>1]=Q&65535;r=3796}else if((r|0)==3803){r=0;m=d[k+6|0]|0;q=q+m|0;m=(q&15)-(m&15)&32;m=m|q>>>4&16;a[k+6|0]=q&255;if((q&255|0)!=0){continue L4031}else{m=m|128;continue L4031}}else if((r|0)==3819){r=0;p=d[k+6|0]|0;q=p-q|0;a[k+6|0]=q&255;r=3633}else if((r|0)==3833){r=0;o=k+6|0;a[o]=(d[o]|0)&q&255;r=3834}else if((r|0)==3841){r=0;o=k+6|0;a[o]=(d[o]|0|q)&255;r=3842}else if((r|0)==3849){r=0;q=q^(d[k+6|0]|0);a[k+6|0]=q&255;q=q-1|0;m=q>>>1&128;continue L4031}}while(0);if((r|0)==3633){r=0;m=(p&15)-(q&15)&32;m=m|q>>>4&16;m=m|64;if((q&255|0)!=0){continue}else{m=m|128;continue}}else if((r|0)==3651){r=0;f=f-1&65535;if((l|0)==0){ae=0}else{ae=l-336|0}ky(ae,f,q>>>8);f=f-1&65535;if((l|0)==0){af=0}else{af=l-336|0}ky(af,f,q&255);continue}else if((r|0)==3729){r=0;if((l|0)==0){ag=0}else{ag=l-336|0}ky(ag,e[k+4>>1]|0,p&255);continue}else if((r|0)==3796){r=0;m=m|Q>>>12&16;m=m|((Q&4095)-(R&4095)|0)>>>7&32;continue}else if((r|0)==3834){r=0;m=32|(d[k+6|0]|0)-1>>1&128;continue}else if((r|0)==3842){r=0;m=(d[k+6|0]|0)-1>>1&128;continue}}if((r|0)==3600){ah=g;ai=ah-1|0;g=ai;aj=l|0;ak=aj;al=k;am=ak;an=al;wh(am|0,an|0,8)|0;ao=g;ap=l|0;aq=ap+8|0;c[aq>>2]=ao;ar=f;as=ar&65535;at=l|0;au=at+12|0;b[au>>1]=as;av=m;aw=av&255;ax=l|0;ay=ax;az=ay+7|0;a[az]=aw;aA=l+24|0;aB=l+20|0;c[aB>>2]=aA;aC=l+24|0;aD=aC;aE=j;wh(aD|0,aE|0,40)|0;aF=j+36|0;aG=c[aF>>2]|0;aH=(aG|0)>0;i=h;return aH|0}else if((r|0)==3914){R=j+36|0;c[R>>2]=(c[R>>2]|0)+1;ah=g;ai=ah-1|0;g=ai;aj=l|0;ak=aj;al=k;am=ak;an=al;wh(am|0,an|0,8)|0;ao=g;ap=l|0;aq=ap+8|0;c[aq>>2]=ao;ar=f;as=ar&65535;at=l|0;au=at+12|0;b[au>>1]=as;av=m;aw=av&255;ax=l|0;ay=ax;az=ay+7|0;a[az]=aw;aA=l+24|0;aB=l+20|0;c[aB>>2]=aA;aC=l+24|0;aD=aC;aE=j;wh(aD|0,aE|0,40)|0;aF=j+36|0;aG=c[aF>>2]|0;aH=(aG|0)>0;i=h;return aH|0}else if((r|0)==3915){a5(6432,1041,14216,4872);return 0}else if((r|0)==3712){a5(6432,452,14216,4872);return 0}else if((r|0)==3865){ah=g;ai=ah-1|0;g=ai;aj=l|0;ak=aj;al=k;am=ak;an=al;wh(am|0,an|0,8)|0;ao=g;ap=l|0;aq=ap+8|0;c[aq>>2]=ao;ar=f;as=ar&65535;at=l|0;au=at+12|0;b[au>>1]=as;av=m;aw=av&255;ax=l|0;ay=ax;az=ay+7|0;a[az]=aw;aA=l+24|0;aB=l+20|0;c[aB>>2]=aA;aC=l+24|0;aD=aC;aE=j;wh(aD|0,aE|0,40)|0;aF=j+36|0;aG=c[aF>>2]|0;aH=(aG|0)>0;i=h;return aH|0}return 0}function kF(a){a=a|0;return c[(c[a+20>>2]|0)+36>>2]<<2|0}function kG(a){a=a|0;var b=0;b=a;c[b+28>>2]=0;c[b+32>>2]=0;c[b+40>>2]=0;c[b+20>>2]=3;c[b+16>>2]=c[b+(c[b+20>>2]<<2)>>2];return}function kH(b){b=b|0;var d=0;d=b;if((a[(c[d+24>>2]|0)+4|0]&64|0)==0){return}if((c[d+40>>2]|0)==0){return}b=d+40|0;c[b>>2]=(c[b>>2]|0)-1;return}function kI(b){b=b|0;var e=0,f=0;e=b;if((c[e+48>>2]|0)==0){return}b=e+48|0;f=(c[b>>2]|0)-1|0;c[b>>2]=f;if((f|0)!=0){return}c[e+48>>2]=a[(c[e+24>>2]|0)+2|0]&7;f=(c[e+36>>2]|0)-1+((d[(c[e+24>>2]|0)+2|0]|0)>>2&2)|0;if(f>>>0<15){c[e+36>>2]=f}return}function kJ(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=f;f=b;b=e;do{if((b|0)==4){if((g&128|0)==0){break}c[f+48>>2]=a[(c[f+24>>2]|0)+2|0]&7;c[f+36>>2]=(d[(c[f+24>>2]|0)+2|0]|0)>>4;c[f+44>>2]=1;if((c[f+40>>2]|0)==0){c[f+40>>2]=64}h=1;i=h;return i|0}else if((b|0)==2){if((g>>4|0)==0){c[f+44>>2]=0}}else if((b|0)==1){c[f+40>>2]=64-(a[(c[f+24>>2]|0)+1|0]&63)}}while(0);h=0;i=h;return i|0}function kK(b){b=b|0;var e=0,f=0,g=0;e=b;b=(a[c[e+24>>2]|0]&112)>>4;if((b|0)==0){return}if((c[e+56>>2]|0)==0){return}f=e+56|0;g=(c[f>>2]|0)-1|0;c[f>>2]=g;if((g|0)!=0){return}c[e+56>>2]=b;a[(c[e+24>>2]|0)+3|0]=c[e+60>>2]&255;a[(c[e+24>>2]|0)+4|0]=((d[(c[e+24>>2]|0)+4|0]|0)&-8|c[e+60>>2]>>8&7)&255;b=c[e+60>>2]>>(a[c[e+24>>2]|0]&7);if((a[c[e+24>>2]|0]&8|0)!=0){b=-b|0}g=e+60|0;c[g>>2]=(c[g>>2]|0)+b;if((c[e+60>>2]|0)<0){c[e+60>>2]=0}else{if((c[e+60>>2]|0)>=2048){c[e+56>>2]=0;c[e+60>>2]=2048}}return}function kL(b){b=b|0;var e=0;e=b;return((a[(c[e+24>>2]|0)+4|0]&7)<<8)+(d[(c[e+24>>2]|0)+3|0]|0)|0}function kM(a,b){a=a|0;b=b|0;return aq(b,c[a>>2]|0)|0}function kN(a){a=a|0;var b=0;b=a;c[b+64>>2]=0;c[b+60>>2]=0;c[b+56>>2]=0;kr(b);return}function kO(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=b;b=e;e=f;f=a;if((c[f+60>>2]|0)==2048){e=0}a=d[16456+((d[(c[f+24>>2]|0)+1|0]|0)>>6)|0]|0;h=c[f+36>>2]&e;if((c[f+64>>2]|0)>=(a|0)){h=-h|0}i=kL(f)|0;if((i-1|0)>>>0>2040){h=c[f+36>>2]>>1;e=0}j=h-(c[f+32>>2]|0)|0;if((j|0)!=0){c[f+32>>2]=h;ix(c[f+52>>2]|0,g,j,c[f+16>>2]|0)}g=g+(c[f+28>>2]|0)|0;if((e|0)==0){g=b}if((g|0)>=(b|0)){k=g;l=b;m=k-l|0;n=f;o=n+28|0;c[o>>2]=m;return}e=2048-i<<2;i=c[f+16>>2]|0;j=c[f+64>>2]|0;p=h<<1;do{j=j+1&7;if((j|0)==0){q=3985}else{if((j|0)==(a|0)){q=3985}}if((q|0)==3985){q=0;p=-p|0;i9(c[f+52>>2]|0,g,p,i)}g=g+e|0;}while((g|0)<(b|0));c[f+64>>2]=j;c[f+32>>2]=p>>1;k=g;l=b;m=k-l|0;n=f;o=n+28|0;c[o>>2]=m;return}function kP(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;h=e;e=f;f=g;g=b;b=c[g+36>>2]&f;i=13-(a[(c[g+24>>2]|0)+3|0]&8)|0;if(((c[g+56>>2]|0)>>>(i>>>0)&2|0)!=0){b=-b|0}j=b-(c[g+32>>2]|0)|0;if((j|0)!=0){c[g+32>>2]=b;jb(c[g+52>>2]|0,h,j,c[g+16>>2]|0)}h=h+(c[g+28>>2]|0)|0;if((f|0)==0){h=e}if((h|0)>=(e|0)){k=h;l=e;m=k-l|0;n=g;o=n+28|0;c[o>>2]=m;return}f=(d[16616+(a[(c[g+24>>2]|0)+3|0]&7)|0]|0)<<((d[(c[g+24>>2]|0)+3|0]|0)>>4);j=c[g+16>>2]|0;p=kM(j,f)|0;q=ch(j,h)|0;r=c[g+56>>2]|0;s=b<<1;do{b=(r>>>(i>>>0))+1|0;h=h+f|0;r=r<<1;if((b&2|0)!=0){s=-s|0;r=r|1;jA(c[g+52>>2]|0,q,s,j)}q=q+p|0;}while((h|0)<(e|0));c[g+56>>2]=r;c[g+32>>2]=s>>1;k=h;l=e;m=k-l|0;n=g;o=n+28|0;c[o>>2]=m;return}function kQ(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;g=b;b=e;e=f;f=a;a=(c[f+36>>2]|0)-1&7;h=((d[f+56+(c[f+52>>2]|0)|0]|0)>>a&e)<<1;i=kL(f)|0;if((i-1|0)>>>0>2044){h=30>>a&e;e=0}j=h-(c[f+32>>2]|0)|0;if((j|0)!=0){c[f+32>>2]=h;jb(c[f+48>>2]|0,g,j,c[f+16>>2]|0)}g=g+(c[f+28>>2]|0)|0;if((e|0)==0){g=b}if((g|0)>=(b|0)){k=g;l=b;m=k-l|0;n=f;o=n+28|0;c[o>>2]=m;return}e=c[f+16>>2]|0;j=2048-i<<1;i=(c[f+52>>2]|0)+1&31;do{h=(d[f+56+i|0]|0)>>a<<1;i=i+1&31;p=h-(c[f+32>>2]|0)|0;if((p|0)!=0){c[f+32>>2]=h;jc(c[f+48>>2]|0,g,p,e)}g=g+j|0;}while((g|0)<(b|0));c[f+52>>2]=i-1&31;k=g;l=b;m=k-l|0;n=f;o=n+28|0;c[o>>2]=m;return}function kR(a,b,e){a=a|0;b=b|0;e=e|0;var f=0;f=e;e=a;a=b;if((a|0)==4){if((f&128&(d[c[e+24>>2]|0]|0)|0)!=0){c[e+52>>2]=0;c[e+44>>2]=1;if((c[e+40>>2]|0)==0){c[e+40>>2]=256}}return}else if((a|0)==1){c[e+40>>2]=256-(d[(c[e+24>>2]|0)+1|0]|0);return}else if((a|0)==0){if((f&128|0)==0){c[e+44>>2]=0}return}else if((a|0)==2){c[e+36>>2]=f>>5&3;return}else{return}}function kS(a){a=a|0;var b=0;b=a;c[b+16>>2]=0;c[b+20>>2]=b+24;return}function kT(a,b){a=a|0;b=b|0;c[a+224>>2]=b;return}function kU(a,b){a=a|0;b=b|0;return b&c[a+16>>2]|0}function kV(a){a=a|0;return c[a+20>>2]|0}function kW(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=d;d=e;e=f;f=b;d=d-(g*5|0)|0;b=f+112|0;h=g;if((h|0)==0){b=f+44|0}else if((h|0)==3){if(kJ(f+268|0,d,e)|0){c[f+324>>2]=32767}return}else if((h|0)==2){kR(f+180|0,d,e);return}else if((h|0)!=1){return}do{if(kJ(b,d,e)|0){if((g|0)!=0){break}c[f+104>>2]=kL(f+44|0)|0;do{if((a[f+328|0]&112|0)!=0){if((a[f+328|0]&7|0)==0){break}c[f+100>>2]=1;kK(f+44|0)}}while(0)}}while(0);return}function kX(){hH(29696,-47.0,2.0e3);return}function kY(){hH(29616,0.0,300.0);return}function kZ(a){a=a|0;ls(a);return}function k_(a){a=a|0;lq(a);return}function k$(a){a=a|0;var b=0;b=a;k0(b+400|0);hJ(b);return}function k0(a){a=a|0;c9(a|0);return}function k1(a,b,c){a=a|0;b=b|0;c=c|0;k2(a+436|0,b);return 0}function k2(a,b){a=a|0;b=b|0;var c=0;c=a;a=b;gm(a+272|0,c+16|0,32);gm(a+784|0,c+48|0,32);gm(a+1040|0,c+80|0,32);return}function k3(b,c){b=b|0;c=c|0;var e=0,f=0,g=0,h=0;e=b;b=k4(e+400|0,c,112,e+436|0,0)|0;if((b|0)!=0){f=b;g=f;return g|0}gd(e,d[e+440|0]|0);b=k5(e+436|0)|0;if((b|0)!=0){f=b;g=f;return g|0}if((d[e+439|0]|0|0)!=1){gA(e,2928)}if((a[e+451|0]&120|0)!=0){gA(e,2200)}b=jD(e+442|0)|0;if((d[e+443|0]|0|(d[e+445|0]|0)|(d[e+447|0]|0)|0)>127){h=4085}else{if(b>>>0<1024){h=4085}}if((h|0)==4085){gA(e,1512)}jI(e,4);km(e+25136|0,+jJ(e));f=c5(e,4194304)|0;g=f;return g|0}function k4(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return c8(a,b,c,d,e,16392)|0}function k5(a){a=a|0;var b=0,d=0;if((wk(a|0,9384,3)|0)!=0){b=c[74]|0;d=b;return d|0}else{b=0;d=b;return d|0}return 0}function k6(a,b){a=a|0;b=b|0;ko(a+25136|0,b);return}function k7(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ks(a+25136|0,b,c,d,e);return}function k8(a,b){a=a|0;b=b|0;var c=0;c=a;a=kU(c+400|0,b<<14)|0;do{if((a|0)==0){if((kV(c+400|0)|0)<=16384){break}return}}while(0);kD(c+336|0,16384,16384,k9(c+400|0,a)|0);return}function k9(a,b){a=a|0;b=b|0;var d=0;d=a;a=kU(d,b)|0;b=a-(c[d+12>>2]|0)|0;if(b>>>0>((gc(d|0)|0)-16392|0)>>>0){b=0}return dh(d|0,b)|0}function la(b){b=b|0;var e=0,f=0.0;e=b;if((a[e+451|0]&4|0)!=0){c[e+428>>2]=256-(d[e+24874|0]|0)<<(d[18424+(a[e+24875|0]&3)|0]|0)-((d[e+451|0]|0)>>7)}else{c[e+428>>2]=70224}if(+j_(e)==1.0){return}f=+(c[e+428>>2]|0);c[e+428>>2]=~~(f/+j_(e));return}function lb(a,d){a=a|0;d=d|0;var e=0;e=a;c[e+344>>2]=d;d=e+348|0;a=(b[d>>1]|0)-1&65535;b[d>>1]=a;ky(e,a&65535,240);a=e+348|0;d=(b[a>>1]|0)-1&65535;b[a>>1]=d;ky(e,d&65535,13);return}function lc(a,b){a=a|0;b=+b;var c=0;c=a;kh(c+25136|0,b);la(c);return}function ld(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+80|0;d=b|0;e=a;kS(e+336|0);cJ(e);c[e>>2]=21128;kZ(e+400|0);kl(e+25136|0);jF(e,c[94]|0);hu(e,18408);jG(e,18392);jH(e,6);kT(e,21);le(e,1.2);hH(d,-1.0,120.0);hK(e,d);i=b;return}function le(a,b){a=a|0;b=+b;var c=0;c=a;if((hv(c)|0)!=0){a5(8624,222,11904,8336)}h[c+248>>3]=b;return}function lf(a){a=a|0;var b=0;b=a;lg(b);cK(b);return}function lg(a){a=a|0;var b=0;b=a;c[b>>2]=21128;k_(b+400|0);cP(b);return}function lh(e,f){e=e|0;f=f|0;var g=0,h=0,i=0;g=f;f=e;e=c6(f,g)|0;if((e|0)!=0){h=e;i=h;return i|0}wg(f+548|0,0,16384);wg(f+16932|0,-1|0,8064);wg(f+24996|0,0,136);a[f+24868|0]=0;kn(f+25136|0);e=0;while(1){if((e|0)>=48){break}kt(f+25136|0,0,e+65296|0,d[28592+e|0]|0);e=e+1|0}e=jD(f+442|0)|0;li(f+400|0,e);c[f+352>>2]=e;kz(f+336|0,lj(f+400|0)|0);kD(f+336|0,40960,24576,f+548|0);kD(f+336|0,0,16384,k9(f+400|0,0)|0);k8(f,(kV(f+400|0)|0)>16384|0);a[f+24874|0]=a[f+450|0]|0;a[f+24875|0]=a[f+451|0]|0;la(f);c[f+432>>2]=c[f+428>>2];a[f+342|0]=g&255;c[f+344>>2]=61453;b[f+348>>1]=(jD(f+448|0)|0)&65535;c[f+424>>2]=0;lb(f,jD(f+444|0)|0);h=0;i=h;return i|0}function li(a,b){a=a|0;b=b|0;db(a,b,16384);return}function lj(a){a=a|0;return c0(a|0)|0}function lk(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;d=b;b=a;c[b+424>>2]=0;while(1){if((c[b+424>>2]|0)>=(c[d>>2]|0)){break}a=(c[d>>2]|0)-(c[b+424>>2]|0)|0;c[b+424>>2]=c[d>>2];e=(kE(b+336|0,a)|0)&1;a=kF(b+336|0)|0;f=b+424|0;c[f>>2]=(c[f>>2]|0)-a;if(e&1){if((c[b+344>>2]|0)==61453){if((c[b+432>>2]|0)>(c[d>>2]|0)){g=4173;break}if((c[b+424>>2]|0)<(c[b+432>>2]|0)){c[b+424>>2]=c[b+432>>2]}e=b+432|0;c[e>>2]=(c[e>>2]|0)+(c[b+428>>2]|0);lb(b,jD(b+446|0)|0)}else{if((c[b+344>>2]|0)>65535){e=b+344|0;c[e>>2]=c[e>>2]&65535}else{gA(b,1008);c[b+344>>2]=(c[b+344>>2]|0)+1&65535;e=b+424|0;c[e>>2]=(c[e>>2]|0)+6}}}}if((g|0)==4173){c[b+424>>2]=c[d>>2]}c[d>>2]=c[b+424>>2];d=b+432|0;c[d>>2]=(c[d>>2]|0)-(c[b+424>>2]|0);if((c[b+432>>2]|0)>=0){h=b+25136|0;i=b+424|0;j=c[i>>2]|0;kB(h,j);return 0}c[b+432>>2]=0;h=b+25136|0;i=b+424|0;j=c[i>>2]|0;kB(h,j);return 0}function ll(a){a=a|0;lz(a);return}function lm(a){a=a|0;lp(a);return}function ln(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;e=a;a=b;b=bS[c[(c[a>>2]|0)+12>>2]&255](a,e+316|0,112)|0;if((b|0)==0){gd(e,d[e+320|0]|0);f=k5(e+316|0)|0;g=f;return g|0}if((b|0)==26104){h=c[74]|0}else{h=b}f=h;g=f;return g|0}function lo(a,b,c){a=a|0;b=b|0;c=c|0;k2(a+316|0,b);return 0}function lp(a){a=a|0;ik(a);return}function lq(a){a=a|0;lr(a);return}function lr(a){a=a|0;f3(a|0);return}function ls(a){a=a|0;lt(a);return}function lt(a){a=a|0;f2(a|0);return}function lu(){kX();kY();return}function lv(a){a=a|0;lV(a);return}function lw(a){a=a|0;lC(a-320|0);return}function lx(){var a=0,b=0,c=0;a=j6(26888)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;ld(b);c=b}return c|0}function ly(){var a=0,b=0,c=0;a=j6(432)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;ll(b);c=b}return c|0}function lz(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=20296;jF(b,c[94]|0);return}function lA(a){a=a|0;var b=0;b=a;lm(b);cK(b);return}function lB(a){a=a|0;var b=0;b=a;hO(b);eo(b+320|0);c[b>>2]=21016;c[b+320>>2]=21100;ct(b+1648|0);lv(b+1692|0);jv(b+1696|0);jd(b+2256|0);c[b+1176>>2]=0;c[b+1184>>2]=0;jF(b,c[92]|0);hu(b,18360);jH(b,1);return}function lC(a){a=a|0;var b=0;b=a;lS(b);cK(b);return}function lD(a,b){a=a|0;b=b|0;var c=0,e=0,f=0;c=a;a=b;b=0;while(1){if(c>>>0>=a>>>0){break}e=c;c=e+1|0;f=d[e]|0;if((f|0)==1|(f|0)==2){c=c+2|0}else if((f|0)==3){c=c+1|0}else if((f|0)==0){b=b+1|0}}return b|0}function lE(a){a=a|0;var b=0;b=a;return(d[b+3|0]|0)<<24|(d[b+2|0]|0)<<16|(d[b+1|0]|0)<<8|(d[b|0]|0)|0}function lF(a){a=a|0;lS(a-320|0);return}function lG(a,b,c){a=a|0;b=b|0;c=c|0;c=a;lH(c+1196|0,lI(c)|0,b);return 0}function lH(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;a=b;b=d;if((wk(e|0,10536,4)|0)!=0){return}a=(a*50|0|0)/3|0;d=lE(e+420|0)|0;if((d|0)!=0){c[b+8>>2]=(d*50|0|0)/3|0;c[b+12>>2]=a-(c[b+8>>2]|0)}else{c[b+4>>2]=a;c[b+8>>2]=a;c[b+12>>2]=0}if((bL(e+4|0,8608)|0)!=0){gm(b+528|0,e+4|0,32)}if((bL(e+36|0,8320)|0)!=0){gm(b+272|0,e+36|0,32)}if((bL(e+68|0,7992)|0)!=0){gm(b+1040|0,e+68|0,32)}if((bL(e+132|0,7664)|0)!=0){gm(b+1552|0,e+132|0,32)}if((bL(e+164|0,7480)|0)!=0){gm(b+1296|0,e+164|0,256)}return}function lI(a){a=a|0;var b=0;b=a;return lD(c[b+1176>>2]|0,c[b+1188>>2]|0)|0}function lJ(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0;c=i;i=i+24|0;d=c|0;e=b;b=a;lK(d,-32.0,8e3,e,0);jj(b+2256|0,d);jl(b+1696|0,d);jg(b+2256|0,+jJ(b)*.405);ji(b+1696|0,+jJ(b)*.00146484375);h[b+1624>>3]=+(e|0)*+lL(b+320|0,1.6666666666666667,.99,+jJ(b)*3.0);d=cu(b+1648|0,e,66)|0;if((d|0)!=0){f=d;g=f;i=c;return g|0}co(b+1648|0,3580020);d=iN(b+1692|0,+h[b+1624>>3],7671471.428571428)|0;if((d|0)!=0){f=d;g=f;i=c;return g|0}d=ej(b+320|0,~~(+(e|0)*.06666666666666667))|0;if((d|0)!=0){f=d;g=f;i=c;return g|0}f=0;g=f;i=c;return g|0}function lK(a,b,c,d,e){a=a|0;b=+b;c=c|0;d=d|0;e=e|0;lU(a,b,c,d,e);return}function lL(a,b,c,d){a=a|0;b=+b;c=+c;d=+d;return+(+e9(a+32|0,b,c,d*.5))}function lM(a,b){a=a|0;b=+b;var d=0;d=a;if(b<.25){hV(d,.25);return}if((eM(d+1648|0)|0)==0){return}c[d+1632>>2]=~~(59667.0/+j_(d));b=+(hv(d)|0);el(d+320|0,~~(b/(+j_(d)*60.0)));return}function lN(b,c){b=b|0;c=c|0;var d=0,e=0;d=c;c=b;cQ(c,d);iM(c+1692|0,d);a[c+1645|0]=(d&64|0)!=0|0;b=c+2256|0;if((d&128|0)!=0){e=0;lO(b,e);return}else{e=c+1648|0;lO(b,e);return}}function lO(a,b){a=a|0;b=b|0;var c=0;c=b;jm(a,c,c,c);return}function lP(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;i=i+8|0;f=e|0;g=b;b=d;d=a;c[f>>2]=0;a=lQ(g,b,f)|0;if((a|0)!=0){h=a;j=h;i=e;return j|0}jI(d,8);c[d+1176>>2]=g+(c[f>>2]|0);c[d+1188>>2]=g+b;c[d+1180>>2]=0;if((c[f>>2]|0)!=0){f=d+1196|0;b=g;wh(f|0,b|0,428)|0}else{wg(d+1196|0,0,428)}h=0;j=h;i=e;return j|0}function lQ(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;f=a;a=b;b=e;if((a|0)<4){g=c[74]|0;h=g;return h|0}do{if((wk(f|0,10536,4)|0)==0){if((a|0)<429){g=c[74]|0;h=g;return h|0}if((wk(f+424|0,28840,4)|0)!=0){g=9752;h=g;return h|0}if((b|0)!=0){c[b>>2]=428}}else{if((d[f]|0|0)<=3){break}g=c[74]|0;h=g;return h|0}}while(0);g=0;h=g;return h|0}function lR(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=b;b=cR(e,d)|0;if((b|0)!=0){f=b;g=f;return g|0}c[e+1184>>2]=c[e+1176>>2];c[e+1192>>2]=lE(e+1616|0)|0;c[e+1640>>2]=0;a[e+1644|0]=0;c[e+1636>>2]=-1;iP(e+1692|0);jh(e+2256|0,0,0);cn(e+1648|0,1);em(e+320|0);f=0;g=f;return g|0}function lS(a){a=a|0;var b=0;b=a;c[b>>2]=21016;c[b+320>>2]=21100;i8(b+2256|0);iO(b+1692|0);cl(b+1648|0);ep(b+320|0);hQ(b);return}function lT(b){b=b|0;a[b+272|0]=1;return}function lU(a,b,d,e,f){a=a|0;b=+b;d=d|0;e=e|0;f=f|0;var g=0;g=a;h[g>>3]=b;c[g+8>>2]=d;c[g+12>>2]=e;c[g+16>>2]=f;return}function lV(a){a=a|0;c[a>>2]=0;return}function lW(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0;e=b;b=a;a=0;f=c[b+1184>>2]|0;while(1){g=f;f=g+1|0;h=d[g]|0;g=h;if((h|0)==0){break}h=f;f=h+1|0;if((g|0)<=2){f=f+1|0}do{if((g|0)==1){if((d[h]|0|0)!=42){break}a=a+1|0}}while(0)}f=e;h=0;do{if((c[b+1640>>2]|0)!=0){i=4408}else{if((a|0)==0){i=4408;break}if((e|0)>=(a|0)){i=4408;break}f=a;h=a-e|0}}while(0);if((i|0)==4408){do{if((c[b+1640>>2]|0)!=0){if((a|0)!=0){break}if((e|0)>=(c[b+1640>>2]|0)){break}f=c[b+1640>>2]|0}}while(0)}a=((kM(b+1648|0,c[b+1632>>2]|0)|0)>>>0)/(f>>>0)|0;f=ch(b+1648|0,0)|0;i=f+(aq(a,h)|0)+(a>>>1)|0;h=c[b+1636>>2]|0;if((h|0)<0){h=d[b+3856|0]|0}f=0;while(1){if((f|0)>=(e|0)){break}g=(d[b+3856+f|0]|0)-h|0;h=h+g|0;jA(b+1696|0,i,g,b+1648|0);i=i+a|0;f=f+1|0}c[b+1636>>2]=h;return}function lX(b){b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=b;b=0;f=c[e+1184>>2]|0;do{if((c[e+1192>>2]|0)!=0){g=e+1192|0;h=(c[g>>2]|0)-1|0;c[g>>2]=h;if((h|0)!=0){break}c[e+1180>>2]=f}}while(0);while(1){h=f;f=h+1|0;g=d[h]|0;h=g;if((g|0)==0){break}g=f;f=g+1|0;i=d[g]|0;if((h|0)==1){g=f;f=g+1|0;j=d[g]|0;if((i|0)!=42){if((i|0)==43){a[e+1644|0]=(j&128|0)!=0|0}iQ(e+1692|0,i,j)}else{if((b|0)<1024){a[e+3856+b|0]=j&255;b=b+(a[e+1644|0]&1)|0}}}else{if((h|0)==2){j=f;f=j+1|0;iR(e+1692|0,i,d[j]|0)}else{if((h|0)==3){jz(e+2256|0,0,i)}else{f=f-1|0}}}}if(f>>>0>=(c[e+1188>>2]|0)>>>0){if((c[e+1180>>2]|0)!=0){f=c[e+1180>>2]|0}else{lT(e)}}c[e+1184>>2]=f;if((b|0)==0){k=b;l=e+1640|0;c[l>>2]=k;return}if(a[e+1645|0]&1){k=b;l=e+1640|0;c[l>>2]=k;return}lW(e,b);k=b;l=e+1640|0;c[l>>2]=k;return}function lY(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=c;c=d;d=a;if(!(fy(d)|0)){lX(d)}jr(d+2256|0,b);wg(c|0,0,e<<1|0);iU(d+1692|0,e>>1,c);return e|0}function lZ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return lY(a-320|0,b,c,d)|0}function l_(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=a;eC(d+320|0,b,c,d+1648|0);return 0}function l$(a){a=a|0;l8(a);return}function l0(a){a=a|0;l3(a);return}function l1(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=d;d=a;c[d+316>>2]=e;c[d+320>>2]=e+b;c[d+324>>2]=0;return lQ(e,b,d+324|0)|0}function l2(a,b,d){a=a|0;b=b|0;d=d|0;d=a;a=lD((c[d+316>>2]|0)+(c[d+324>>2]|0)|0,c[d+320>>2]|0)|0;lH(c[d+316>>2]|0,a,b);return 0}function l3(a){a=a|0;ik(a);return}function l4(a){a=a|0;var b=0;b=a;jv(b+536|0);a=b+528|0;do{a=a-88|0;c[a+60>>2]=0;c[a+64>>2]=0;c[a+68>>2]=0;c[a+72>>2]=0;c[a+76>>2]=0;}while((a|0)!=(b|0));l5(b);return}function l5(b){b=b|0;var d=0;d=b;c[d+528>>2]=0;c[d+532>>2]=255;b=d+528|0;do{b=b-88|0;wg(b|0,0,60);c[b+80>>2]=1;a[b+84|0]=64;a[b+54|0]=-1;}while((b|0)!=(d|0));return}function l6(){var a=0,b=0,c=0;a=j6(4880)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;lB(b);c=b}return c|0}function l7(){var a=0,b=0,c=0;a=j6(328)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;l$(b);c=b}return c|0}function l8(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=20152;jF(b,c[92]|0);return}function l9(a){a=a|0;var b=0;b=a;l0(b);cK(b);return}function ma(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0;g=b;b=a;if(g>>>0>=6){a5(5048,58,13936,9448)}c[b+(g*88|0)+68>>2]=d;c[b+(g*88|0)+72>>2]=e;c[b+(g*88|0)+76>>2]=f;f=b+528|0;do{f=f-88|0;mb(b,f);}while((f|0)!=(b|0));return}function mb(e,f){e=e|0;f=f|0;var g=0,h=0,i=0;g=f;f=e;e=(a[g+84|0]&31)-60|0;h=e+(d[g+54|0]>>3&30)+(c[f+532>>2]>>3&30)|0;if((h|0)<0){h=0}i=e+(d[g+54|0]<<1&30)+(c[f+532>>2]<<1&30)|0;if((i|0)<0){i=0}h=b[18296+(h<<1)>>1]|0;i=b[18296+(i<<1)>>1]|0;c[g+60>>2]=c[g+68>>2];c[g+64>>2]=0;if((h|0)!=(i|0)){c[g+60>>2]=c[g+72>>2];c[g+64>>2]=c[g+76>>2]}f=g+36|0;c[f>>2]=(c[f>>2]|0)+(h-(b[g+32>>1]|0)<<4);f=g+40|0;c[f>>2]=(c[f>>2]|0)+(i-(b[g+34>>1]|0)<<4);b[g+32>>1]=h&65535;b[g+34>>1]=i&65535;return}function mc(a,b){a=a|0;b=b|0;var d=0;d=b;return(c[(c[a+8212>>2]|0)+(d>>>13<<2)>>2]|0)+((d>>>0)%8192|0)|0}function md(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0;h=e;e=f;f=g;g=b;if((e|0)==2048){c[g+528>>2]=f&7;return}if((e|0)==2049){if((c[g+532>>2]|0)!=(f|0)){c[g+532>>2]=f;b=g+528|0;do{b=b-88|0;mf(b,g+536|0,h);mb(g,g|0);}while((b|0)!=(g|0))}}else{if((c[g+528>>2]|0)<6){b=g+((c[g+528>>2]|0)*88|0)|0;mf(b,g+536|0,h);h=e;if((h|0)==2050){c[b+48>>2]=c[b+48>>2]&3840|f}else if((h|0)==2051){c[b+48>>2]=c[b+48>>2]&255|(f&15)<<8}else if((h|0)==2052){if((a[b+84|0]&64&~f|0)!=0){a[b+53|0]=0}a[b+84|0]=f&255;mb(g,b)}else if((h|0)==2053){a[b+54|0]=f&255;mb(g,b)}else if((h|0)==2054){f=f&31;if((a[b+84|0]&64|0)!=0){if((a[b+84|0]&128|0)!=0){a[b+55|0]=f&255}}else{a[b+(d[b+53|0]|0)|0]=f&255;a[b+53|0]=(d[b+53|0]|0)+1&31}}else if((h|0)==2055){if(b>>>0>=(g+352|0)>>>0){a[b+52|0]=f&255}}else if((h|0)==2057){do{if((f&128|0)==0){if((f&3|0)==0){break}}}while(0)}}}return}function me(a,b){a=a|0;b=b|0;var c=0,e=0;c=b;b=a;a=d[mc(b+336|0,c)|0]|0;if((d[b+8536+(c>>>13)|0]|0|0)!=255){e=a;return e|0}a=mW(b,c)|0;e=a;return e|0}function mf(e,f,g){e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;h=f;f=g;g=e;e=c[g+60>>2]|0;if((e|0)==0){i=f;j=g+56|0;c[j>>2]=i;return}if((a[g+84|0]&128|0)==0){i=f;j=g+56|0;c[j>>2]=i;return}k=d[g+55|0]|0;l=b[g+32>>1]|0;m=aq(k,l)|0;n=m-(c[g+36>>2]|0)|0;if((n|0)!=0){jb(h,c[g+56>>2]|0,n,e)}iv(e);n=c[g+64>>2]|0;m=b[g+34>>1]|0;if((n|0)!=0){o=aq(k,m)|0;p=o-(c[g+40>>2]|0)|0;if((p|0)!=0){jb(h,c[g+56>>2]|0,p,n)}iv(n)}p=(c[g+56>>2]|0)+(c[g+44>>2]|0)|0;if((p|0)<(f|0)){if((a[g+52|0]&128|0)!=0){if((l|m|0)!=0){o=32-(a[g+52|0]&31)<<6;q=c[g+80>>2]|0;do{r=31&-(q>>>1&1);q=q>>>1^57352&-(q&1);s=r-k|0;if((s|0)!=0){k=r;jb(h,p,aq(s,l)|0,e);if((n|0)!=0){jb(h,p,aq(s,m)|0,n)}}p=p+o|0;}while((p|0)<(f|0));c[g+80>>2]=q;if((q|0)==0){a5(5048,127,13744,6568)}}}else{if((a[g+84|0]&64|0)==0){q=(d[g+53|0]|0)+1&31;o=c[g+48>>2]<<1;do{if((o|0)>=14){if((l|m|0)==0){t=4594;break}do{s=d[g+q|0]|0;q=q+1&31;r=s-k|0;if((r|0)!=0){k=s;jb(h,p,aq(r,l)|0,e);if((n|0)!=0){jb(h,p,aq(r,m)|0,n)}}p=p+o|0;}while((p|0)<(f|0))}else{t=4594}}while(0);if((t|0)==4594){if((o|0)==0){o=1}t=(f-p+o-1|0)/(o|0)|0;q=q+t|0;p=p+(aq(t,o)|0)|0}a[g+53|0]=q-1&31}}}p=p-f|0;if((p|0)<0){p=0}c[g+44>>2]=p;a[g+55|0]=k&255;c[g+36>>2]=aq(k,l)|0;c[g+40>>2]=aq(k,m)|0;i=f;j=g+56|0;c[j>>2]=i;return}function mg(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;a=b+528|0;do{a=a-88|0;if((d|0)>(c[a+56>>2]|0)){mf(a,b+536|0,d)}if((c[a+56>>2]|0)<(d|0)){a5(5048,311,13896,4768)}e=a+56|0;c[e>>2]=(c[e>>2]|0)-d;}while((a|0)!=(b|0));return}function mh(b,e,f){b=b|0;e=e|0;f=f|0;var g=0;g=e;e=f;f=b;b=c[f+8604+(g>>>13<<2)>>2]|0;g=g&8191;if((b|0)!=0){a[b+g|0]=e&255;return}if((d[f+8536+(g>>>13)|0]|0|0)==255){mV(f,g,e)}return}function mi(d){d=d|0;var e=0;e=d;c[e+8212>>2]=e+8216;c[e+8256>>2]=0;c[e+8252>>2]=0;c[e+8260>>2]=1073741824;c[e+8264>>2]=1073741824;a[e+8197|0]=4;a[e+8198|0]=0;b[e+8192>>1]=0;a[e+8194|0]=0;a[e+8195|0]=0;a[e+8196|0]=0;f8();return}function mj(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=d;d=a;c[d+8604+(e<<2)>>2]=0;if((b|0)<128){f=ms(d+8640|0,b<<13)|0;g=f;return g|0}a=0;h=b;if((h|0)==249|(h|0)==250|(h|0)==251){a=d+9848+(b-249<<13)|0}else if((h|0)==248){a=d+336|0}else{f=mt(d+8640|0)|0;g=f;return g|0}c[d+8604+(e<<2)>>2]=a;f=a;g=f;return g|0}function mk(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=d;d=e;e=b;if(f>>>0>8){a5(4880,71,13832,9392)}if(d>>>0>=256){a5(4880,72,13832,6544)}a[e+8200+f|0]=d&255;if((e|0)==0){g=0}else{g=e-336|0}b=(mj(g,f,d)|0)+(-(f<<13&8191)|0)|0;c[(c[e+8212>>2]|0)+(f<<2)>>2]=b;return}
function ml(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0;h=i;i=i+48|0;j=h|0;k=f;f=0;mr(k,g);g=j;l=k+8216|0;wh(g|0,l|0,44)|0;c[k+8212>>2]=j;l=c[j+40>>2]|0;g=e[k+8192>>1]|0;m=d[k+8194|0]|0;n=d[k+8195|0]|0;o=d[k+8196|0]|0;p=(d[k+8198|0]|0)+1|256;q=d[k+8197|0]|0;r=q&76;s=q<<8;t=s;s=s|~q&2;L5202:while(1){q=c[k+8264>>2]|0;do{if((r&4|0)==0){if((q|0)<=(c[k+8260>>2]|0)){break}q=c[k+8260>>2]|0}}while(0);q=c[j+(g>>>13<<2)>>2]|0;q=q+(g&8191)|0;u=q;q=u+1|0;v=d[u]|0;g=g+1|0;u=d[18040+v|0]|0;w=l+u|0;l=w;do{if((w|0)>=0){if((l|0)<(u|0)){x=4658;break}else{l=l-u|0;x=5112;break}}else{x=4658}}while(0);L5215:do{if((x|0)==4658){x=0;u=d[q]|0;w=v;do{if((w|0)==74){t=0;x=4933}else if((w|0)==106){x=4933}else if((w|0)==10){s=m<<1;t=s;m=s&255;continue L5202}else if((w|0)==42){s=m<<1;y=t>>>8&1;t=s;s=s|y;m=s&255;continue L5202}else if((w|0)==94){u=u+n|0;x=4937}else if((w|0)==78){x=4937}else if((w|0)==110){x=4938}else if((w|0)==12|(w|0)==28){z=jD(q)|0;g=g+1|0;x=4786}else if((w|0)==4|(w|0)==20){z=u+8192|0;x=4786}else if((w|0)==228){u=d[k+u|0]|0;x=4830}else if((w|0)==224){x=4830}else if((w|0)==163){s=d[k+((d[q+1|0]|0)+n&255)|0]|0;x=4781}else if((w|0)==237){x=4907}else if((w|0)==233){x=4912}else if((w|0)==97){u=u+n&255;x=4915}else if((w|0)==114){x=4915}else if((w|0)==113){u=(d[k+u|0]|0)+o+((d[k+(u+1&255)|0]|0)<<8)|0;x=4923}else if((w|0)==117){u=u+n&255;x=4918}else if((w|0)==83){y=u;g=g+1|0;A=0;while(1){if((A|0)>=8){break}if((y&1<<A|0)!=0){mk(k,A,m)}A=A+1|0}continue L5202}else if((w|0)==67){g=g+1|0;A=k+8200|0;do{if((u&1|0)!=0){m=d[A]|0}A=A+1|0;y=u>>>1;u=y;}while((y|0)!=0);continue L5202}else if((w|0)==3|(w|0)==19|(w|0)==35){A=v>>>4;if((A|0)!=0){A=A+1|0}g=g+1|0;c[j+40>>2]=l;if((k|0)==0){B=0}else{B=k-336|0}mL(B,A,u);l=c[j+40>>2]|0;continue L5202}else if((w|0)==234){continue L5202}else if((w|0)==84){f=1;continue L5202}else if((w|0)==212){continue L5202}else if((w|0)==244){f=1;continue L5202}else if((w|0)==227){C=0;x=5078}else if((w|0)==243){C=1;x=5078}else if((w|0)==211){D=1;E=0;x=5082}else if((w|0)==195){D=-1;E=-1;x=5082}else if((w|0)==115){D=1;E=1;x=5082}else if((w|0)==221){u=u+n|0;x=4846}else if((w|0)==205){x=4847}else if((w|0)==201){x=4852}else if((w|0)==180){u=u+n&255;x=4812}else if((w|0)==164){x=4812}else if((w|0)==160){x=4813}else if((w|0)==188){u=u+n|0;x=4815}else if((w|0)==204){A=jD(q)|0;g=g+1|0;c[j+40>>2]=l;if((k|0)==0){F=0}else{F=k-336|0}u=me(F,A)|0;l=c[j+40>>2]|0;x=4838}else if((w|0)==196){u=d[k+u|0]|0;x=4837}else if((w|0)==217){u=u+o|0;x=4846}else if((w|0)==222){u=n+(jD(q)|0)|0;x=4983}else if((w|0)==206){u=jD(q)|0;x=4983}else if((w|0)==168){o=m;s=m;continue L5202}else if((w|0)==152){m=o;s=o;continue L5202}else if((w|0)==170){n=m;s=m;continue L5202}else if((w|0)==138){m=n;s=n;continue L5202}else if((w|0)==154){p=n+1|256;continue L5202}else if((w|0)==186){A=p-1&255;s=A;n=A;continue L5202}else if((w|0)==2){A=n;n=o;o=A;continue L5202}else if((w|0)==34){A=m;m=n;n=A;continue L5202}else if((w|0)==66){A=m;m=o;o=A;continue L5202}else if((w|0)==98){m=0;continue L5202}else if((w|0)==130){n=0;continue L5202}else if((w|0)==194){o=0;continue L5202}else if((w|0)==72){p=p-1|256;a[k+p|0]=m&255;continue L5202}else if((w|0)==218){p=p-1|256;a[k+p|0]=n&255;continue L5202}else if((w|0)==90){p=p-1|256;a[k+p|0]=o&255;continue L5202}else if((w|0)==192){x=4837}else if((w|0)==193){u=u+n&255;x=4840}else if((w|0)==210){x=4840}else if((w|0)==209){u=(d[k+u|0]|0)+o+((d[k+(u+1&255)|0]|0)<<8)|0;x=4848}else if((w|0)==213){u=u+n&255;x=4843}else if((w|0)==41){x=4867}else if((w|0)==65){u=u+n&255;x=4870}else if((w|0)==82){x=4870}else if((w|0)==81){u=(d[k+u|0]|0)+o+((d[k+(u+1&255)|0]|0)<<8)|0;x=4878}else if((w|0)==135|(w|0)==151|(w|0)==167|(w|0)==183|(w|0)==199|(w|0)==215|(w|0)==231|(w|0)==247){g=g+1|0;A=k+u|0;a[A]=(d[A]|0|1<<(v>>>4)-8)&255;continue L5202}else if((w|0)==158){u=u+n|0;x=4798}else if((w|0)==156){x=4798}else if((w|0)==172){x=4815}else if((w|0)==140){G=o;x=4821}else if((w|0)==116){u=u+n&255;x=4803}else if((w|0)==100){x=4803}else if((w|0)==148){u=u+n&255;x=4805}else if((w|0)==147){H=d[q+1|0]|0;x=4775}else if((w|0)==131){s=d[k+(d[q+1|0]|0)|0]|0;x=4781}else if((w|0)==166){x=4809}else if((w|0)==162){x=4810}else if((w|0)==33){u=u+n&255;x=4855}else if((w|0)==50){x=4855}else if((w|0)==49){u=(d[k+u|0]|0)+o+((d[k+(u+1&255)|0]|0)<<8)|0;x=4863}else if((w|0)==53){u=u+n&255;x=4858}else if((w|0)==37){x=4858}else if((w|0)==85){u=u+n&255;x=4873}else if((w|0)==69){x=4873}else if((w|0)==89){u=u+o|0;x=4876}else if((w|0)==93){u=u+n|0;x=4876}else if((w|0)==77){x=4877}else if((w|0)==5){x=4888}else if((w|0)==25){u=u+o|0;x=4891}else if((w|0)==29){u=u+n|0;x=4891}else if((w|0)==13){x=4892}else if((w|0)==253){u=u+n|0;x=4906}else if((w|0)==57){u=u+o|0;x=4861}else if((w|0)==61){u=u+n|0;x=4861}else if((w|0)==45){x=4862}else if((w|0)==142){G=n;x=4821}else if((w|0)==236){A=jD(q)|0;g=g+1|0;c[j+40>>2]=l;if((k|0)==0){I=0}else{I=k-336|0}u=me(I,A)|0;l=c[j+40>>2]|0;x=4831}else if((w|0)==197){x=4843}else if((w|0)==64){A=d[k+p|0]|0;g=d[k+(256|p-255)|0]|0;g=g|(d[k+(256|p-254)|0]|0)<<8;p=p-253|256;u=r;r=A&76;s=A<<8;t=s;s=s|~A&2;a[k+8197|0]=r&255;if(((u^r)&4|0)!=0){A=c[k+8264>>2]|0;do{if((r&4|0)==0){if((A|0)<=(c[k+8260>>2]|0)){break}A=c[k+8260>>2]|0}}while(0);y=(c[j+36>>2]|0)-A|0;c[j+36>>2]=A;l=l+y|0}continue L5202}else if((w|0)==104){y=d[k+p|0]|0;s=y;m=y;p=p-255|256;continue L5202}else if((w|0)==250){y=d[k+p|0]|0;s=y;n=y;p=p-255|256;continue L5202}else if((w|0)==122){y=d[k+p|0]|0;s=y;o=y;p=p-255|256;continue L5202}else if((w|0)==40){y=d[k+p|0]|0;p=p-255|256;J=r^y;r=y&76;s=y<<8;t=s;s=s|~y&2;if((J&4|0)==0){continue L5202}if((r&4|0)!=0){x=5050;break}else{x=5037;break}}else if((w|0)==8){J=r&76;J=J|(s>>>8|s)&128;J=J|t>>>8&1;if((s&255|0)==0){J=J|2}p=p-1|256;a[k+p|0]=(J|16)&255;continue L5202}else if((w|0)==56){t=-1;continue L5202}else if((w|0)==24){t=0;continue L5202}else if((w|0)==184){r=r&-65;continue L5202}else if((w|0)==216){r=r&-9;continue L5202}else if((w|0)==248){r=r|8;continue L5202}else if((w|0)==88){if((r&4|0)!=0){r=r&-5;x=5037;break}else{continue L5202}}else if((w|0)==120){if((r&4|0)!=0){continue L5202}else{r=r|4;x=5050;break}}else if((w|0)==62){u=u+n|0;x=4947}else if((w|0)==30){u=u+n|0;x=4945}else if((w|0)==14){x=4945}else if((w|0)==46){x=4946}else if((w|0)==126){u=u+n|0;x=4939}else if((w|0)==118){u=u+n&255;x=4960}else if((w|0)==86){u=u+n&255;x=4958}else if((w|0)==70){x=4958}else if((w|0)==102){x=4959}else if((w|0)==54){u=u+n&255;x=4965}else if((w|0)==22){u=u+n&255;x=4963}else if((w|0)==6){x=4963}else if((w|0)==38){x=4964}else if((w|0)==26){J=m+1|0;s=J;m=J&255;continue L5202}else if((w|0)==232){J=n+1|0;s=J;n=J&255;continue L5202}else if((w|0)==200){J=o+1|0;s=J;o=J&255;continue L5202}else if((w|0)==58){J=m-1|0;s=J;m=J&255;continue L5202}else if((w|0)==202){J=n-1|0;s=J;n=J&255;continue L5202}else if((w|0)==136){J=o-1|0;s=J;o=J&255;continue L5202}else if((w|0)==246){u=u+n&255;x=4973}else if((w|0)==230){x=4973}else if((w|0)==214){u=u+n&255;x=4975}else if((w|0)==198){x=4975}else if((w|0)==254){u=n+(jD(q)|0)|0;x=4980}else if((w|0)==238){u=jD(q)|0;x=4980}else if((w|0)==240){g=g+1|0;if((s&255)<<24>>24!=0){x=4651;break}else{g=g+((u&255)<<24>>24)&65535;continue L5202}}else if((w|0)==208){g=g+1|0;if((s&255)<<24>>24!=0){g=g+((u&255)<<24>>24)&65535;continue L5202}else{x=4651;break}}else if((w|0)==16){g=g+1|0;if((s&32896|0)!=0){x=4651;break}else{g=g+((u&255)<<24>>24)&65535;continue L5202}}else if((w|0)==144){g=g+1|0;if((t&256|0)!=0){x=4651;break}else{g=g+((u&255)<<24>>24)&65535;continue L5202}}else if((w|0)==48){g=g+1|0;if((s&32896|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L5202}else{x=4651;break}}else if((w|0)==80){g=g+1|0;if((r&64|0)!=0){x=4651;break}else{g=g+((u&255)<<24>>24)&65535;continue L5202}}else if((w|0)==112){g=g+1|0;if((r&64|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L5202}else{x=4651;break}}else if((w|0)==176){g=g+1|0;if((t&256|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L5202}else{x=4651;break}}else if((w|0)==128){x=4687}else if((w|0)==255){if((g|0)!=8192){x=4691;break}l=0;x=5112;break L5215}else if((w|0)==15|(w|0)==31|(w|0)==47|(w|0)==63|(w|0)==79|(w|0)==95|(w|0)==111|(w|0)==127|(w|0)==143|(w|0)==159|(w|0)==175|(w|0)==191|(w|0)==207|(w|0)==223|(w|0)==239){x=4691}else if((w|0)==76){g=jD(q)|0;continue L5202}else if((w|0)==124){u=u+n|0;x=4696}else if((w|0)==108){x=4696}else if((w|0)==68){a[k+(256|p-1)|0]=g>>>8&255;p=p-2|256;a[k+p|0]=g&255;x=4687}else if((w|0)==32){J=g+1|0;g=jD(q)|0;a[k+(256|p-1)|0]=J>>>8&255;p=p-2|256;a[k+p|0]=J&255;continue L5202}else if((w|0)==96){g=(d[k+(256|p-255)|0]|0)<<8;g=g+((d[k+p|0]|0)+1)|0;p=p-254|256;continue L5202}else if((w|0)==0){g=g+1|0;K=6;break L5215}else if((w|0)==189){J=(jD(q)|0)+n|0;g=g+2|0;s=d[(c[j+(J>>>13<<2)>>2]|0)+(J&8191)|0]|0;if((d[k+8200+(J>>>13)|0]|0|0)==255){c[j+40>>2]=l;if((k|0)==0){L=0}else{L=k-336|0}s=mW(L,J)|0;l=c[j+40>>2]|0}m=s;continue L5202}else if((w|0)==157){J=(jD(q)|0)+n|0;g=g+2|0;if((k|0)==0){M=0}else{M=k-336|0}y=c[M+8604+(J>>>13<<2)>>2]|0;J=J&8191;if((y|0)!=0){a[y+J|0]=m&255}else{if((d[k+8200+(J>>>13)|0]|0|0)==255){c[j+40>>2]=l;if((k|0)==0){N=0}else{N=k-336|0}mV(N,J,m);l=c[j+40>>2]|0}}continue L5202}else if((w|0)==149){u=u+n&255;x=4720}else if((w|0)==133){x=4720}else if((w|0)==174){J=jD(q)|0;g=g+2|0;s=d[(c[j+(J>>>13<<2)>>2]|0)+(J&8191)|0]|0;if((d[k+8200+(J>>>13)|0]|0|0)==255){c[j+40>>2]=l;if((k|0)==0){O=0}else{O=k-336|0}s=mW(O,J)|0;l=c[j+40>>2]|0}n=s;continue L5202}else if((w|0)==165){J=d[k+u|0]|0;s=J;m=J;g=g+1|0;continue L5202}else if((w|0)==145){P=(d[k+(u+1&255)|0]|0)<<8;P=P+((d[k+u|0]|0)+o)|0;g=g+1|0;x=4733}else if((w|0)==129){u=u+n&255;x=4730}else if((w|0)==146){x=4730}else if((w|0)==153){u=u+o|0;x=4732}else if((w|0)==141){x=4732}else if((w|0)==161){u=u+n&255;x=4746}else if((w|0)==178){x=4746}else if((w|0)==177){Q=(d[k+u|0]|0)+o|0;Q=Q+((d[k+(u+1&255)|0]|0)<<8)|0;g=g+1|0;x=4750}else if((w|0)==185){u=u+o|0;x=4749}else if((w|0)==173){x=4749}else if((w|0)==190){J=(jD(q)|0)+o|0;g=g+2|0;c[j+40>>2]=l;if((k|0)==0){R=0}else{R=k-336|0}y=me(R,J)|0;s=y;n=y;l=c[j+40>>2]|0;continue L5202}else if((w|0)==181){y=d[k+(u+n&255)|0]|0;s=y;m=y;g=g+1|0;continue L5202}else if((w|0)==169){g=g+1|0;m=u;s=u;continue L5202}else if((w|0)==60){u=u+n|0;x=4763}else if((w|0)==44){x=4763}else if((w|0)==52){u=u+n&255;x=4768}else if((w|0)==36){x=4768}else if((w|0)==137){x=4769}else if((w|0)==179){H=(d[q+1|0]|0)+n|0;x=4775}else if((w|0)==73){x=4882}else if((w|0)==1){u=u+n&255;x=4885}else if((w|0)==18){x=4885}else if((w|0)==17){u=(d[k+u|0]|0)+o+((d[k+(u+1&255)|0]|0)<<8)|0;x=4893}else if((w|0)==21){u=u+n&255;x=4888}else if((w|0)==7|(w|0)==23|(w|0)==39|(w|0)==55|(w|0)==71|(w|0)==87|(w|0)==103|(w|0)==119){g=g+1|0;y=k+u|0;a[y]=(d[y]|0)&~(1<<(v>>>4))&255;continue L5202}else if((w|0)==101){x=4918}else if((w|0)==121){u=u+o|0;x=4921}else if((w|0)==125){u=u+n|0;x=4921}else if((w|0)==109){x=4922}else if((w|0)==105){x=4927}else if((w|0)==9){x=4897}else if((w|0)==225){u=u+n&255;x=4900}else if((w|0)==242){x=4900}else if((w|0)==241){u=(d[k+u|0]|0)+o+((d[k+(u+1&255)|0]|0)<<8)|0;x=4908}else if((w|0)==245){u=u+n&255;x=4903}else if((w|0)==229){x=4903}else if((w|0)==249){u=u+o|0;x=4906}else if((w|0)==132){x=4805}else if((w|0)==150){u=u+o&255;x=4807}else if((w|0)==134){x=4807}else if((w|0)==182){u=u+o&255;x=4809}else{if(v>>>0>255){a5(4880,1235,13864,4736);return 0}f=1;continue L5202}}while(0);do{if((x|0)==4933){x=0;s=t>>>1&128;t=m<<8;s=s|m>>>1;m=s;continue L5202}else if((x|0)==4937){x=0;t=0;x=4938}else if((x|0)==4786){x=0;c[j+40>>2]=l;if((k|0)==0){S=0}else{S=k-336|0}s=m|(me(S,z)|0);if((v&16|0)!=0){s=s^m}r=r&-65;r=r|s&64;g=g+1|0;if((k|0)==0){T=0}else{T=k-336|0}mh(T,z,s);l=c[j+40>>2]|0;continue L5202}else if((x|0)==4830){x=0;x=4831}else if((x|0)==4775){x=0;H=H+((d[q+2|0]|0)<<8)|0;g=g+1|0;c[j+40>>2]=l;if((k|0)==0){U=0}else{U=k-336|0}s=me(U,H)|0;l=c[j+40>>2]|0;x=4781}else if((x|0)==4906){x=0;x=4907}else if((x|0)==4915){x=0;u=((d[k+(u+1&255)|0]|0)<<8)+(d[k+u|0]|0)|0;x=4923}else if((x|0)==5050){x=0;a[k+8197|0]=r&255;w=(c[j+36>>2]|0)-(c[k+8264>>2]|0)|0;c[j+36>>2]=c[k+8264>>2];l=l+w|0;if((l|0)<0){continue L5202}else{continue L5202}}else if((x|0)==5078){x=0;D=C^1;V=D;E=C;x=5083}else if((x|0)==5082){x=0;C=0;V=0;x=5083}else if((x|0)==4846){x=0;x=4847}else if((x|0)==4812){x=0;u=d[k+u|0]|0;x=4813}else if((x|0)==4980){x=0;s=1;x=4984}else if((x|0)==4983){x=0;s=-1;x=4984}else if((x|0)==4837){x=0;x=4838}else if((x|0)==4840){x=0;u=((d[k+(u+1&255)|0]|0)<<8)+(d[k+u|0]|0)|0;x=4848}else if((x|0)==4870){x=0;u=((d[k+(u+1&255)|0]|0)<<8)+(d[k+u|0]|0)|0;x=4878}else if((x|0)==4798){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;g=g+1|0;c[j+40>>2]=l;if((k|0)==0){W=0}else{W=k-336|0}mh(W,u,0);l=c[j+40>>2]|0;continue L5202}else if((x|0)==4815){x=0;w=u+((d[q+1|0]|0)<<8)|0;g=g+2|0;c[j+40>>2]=l;if((k|0)==0){X=0}else{X=k-336|0}y=me(X,w)|0;s=y;o=y;l=c[j+40>>2]|0;continue L5202}else if((x|0)==4803){x=0;g=g+1|0;a[k+u|0]=0;continue L5202}else if((x|0)==4809){x=0;u=d[k+u|0]|0;x=4810}else if((x|0)==4855){x=0;u=((d[k+(u+1&255)|0]|0)<<8)+(d[k+u|0]|0)|0;x=4863}else if((x|0)==4858){x=0;u=d[k+u|0]|0;x=4868}else if((x|0)==4873){x=0;u=d[k+u|0]|0;x=4883}else if((x|0)==4876){x=0;x=4877}else if((x|0)==4888){x=0;u=d[k+u|0]|0;x=4898}else if((x|0)==4891){x=0;x=4892}else if((x|0)==4861){x=0;x=4862}else if((x|0)==4821){x=0;y=jD(q)|0;g=g+2|0;c[j+40>>2]=l;if((k|0)==0){Y=0}else{Y=k-336|0}mh(Y,y,G);l=c[j+40>>2]|0;continue L5202}else if((x|0)==4843){x=0;u=d[k+u|0]|0;x=4853}else if((x|0)==5037){x=0;a[k+8197|0]=r&255;y=(c[j+36>>2]|0)-(c[k+8260>>2]|0)|0;do{if((y|0)<=0){if((l+(c[j+36>>2]|0)|0)<(c[k+8260>>2]|0)){continue L5202}else{break}}else{c[j+36>>2]=c[k+8260>>2];l=l+y|0;if((l|0)<0){continue L5202}if((y|0)>=(l+1|0)){w=j+36|0;c[w>>2]=(c[w>>2]|0)+(l+1);l=-1;c[k+8260>>2]=c[j+36>>2];continue L5202}else{break}}}while(0);continue L5202}else if((x|0)==4945){x=0;t=0;x=4946}else if((x|0)==4958){x=0;t=0;x=4959}else if((x|0)==4963){x=0;t=0;x=4964}else if((x|0)==4973){x=0;s=1;x=4976}else if((x|0)==4975){x=0;s=-1;x=4976}else if((x|0)==4687){x=0;g=g+1|0;g=g+((u&255)<<24>>24)&65535;continue L5202}else if((x|0)==4691){x=0;y=(d[k+u|0]|0)*257|0;y=y^255;g=g+1|0;u=d[q+1|0]|0;g=g+1|0;if((y&1<<(v>>>4)|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L5202}else{x=4651;break}}else if((x|0)==4696){x=0;u=u+((d[q+1|0]|0)<<8)|0;g=jD((c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0)|0;continue L5202}else if((x|0)==4720){x=0;g=g+1|0;a[k+u|0]=m&255;continue L5202}else if((x|0)==4730){x=0;P=(d[k+(u+1&255)|0]|0)<<8;P=P+(d[k+u|0]|0)|0;g=g+1|0;x=4733}else if((x|0)==4732){x=0;P=u+((d[q+1|0]|0)<<8)|0;g=g+2|0;x=4733}else if((x|0)==4746){x=0;Q=(d[k+(u+1&255)|0]|0)<<8;Q=Q+(d[k+u|0]|0)|0;g=g+1|0;x=4750}else if((x|0)==4749){x=0;Q=u+((d[q+1|0]|0)<<8)|0;g=g+2|0;x=4750}else if((x|0)==4763){x=0;g=g+1|0;y=u+((d[q+1|0]|0)<<8)|0;c[j+40>>2]=l;if((k|0)==0){Z=0}else{Z=k-336|0}s=me(Z,y)|0;l=c[j+40>>2]|0;x=4770}else if((x|0)==4768){x=0;u=d[k+u|0]|0;x=4769}else if((x|0)==4885){x=0;u=((d[k+(u+1&255)|0]|0)<<8)+(d[k+u|0]|0)|0;x=4893}else if((x|0)==4918){x=0;u=d[k+u|0]|0;x=4928}else if((x|0)==4921){x=0;x=4922}else if((x|0)==4900){x=0;u=((d[k+(u+1&255)|0]|0)<<8)+(d[k+u|0]|0)|0;x=4908}else if((x|0)==4903){x=0;u=d[k+u|0]|0;x=4913}else if((x|0)==4805){x=0;g=g+1|0;a[k+u|0]=o&255;continue L5202}else if((x|0)==4807){x=0;g=g+1|0;a[k+u|0]=n&255;continue L5202}}while(0);if((x|0)==4651){x=0;l=l-2|0;continue L5202}else if((x|0)==4938){x=0;x=4939}else if((x|0)==4831){x=0;s=n-u|0;g=g+1|0;t=~s;s=s&255;continue L5202}else if((x|0)==4907){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;x=4908}else if((x|0)==5083){x=0;y=jD(q|0)|0;A=jD(q+2|0)|0;w=jD(q+4|0)|0;if((w|0)==0){w=65536}g=g+6|0;a[k+(256|p-1)|0]=o&255;a[k+(256|p-2)|0]=m&255;a[k+(256|p-3)|0]=n&255;c[j+40>>2]=l;do{if((k|0)==0){_=0}else{_=k-336|0}J=me(_,y)|0;y=y+D|0;y=y&65535;$=j+40|0;c[$>>2]=(c[$>>2]|0)+6;if((C|0)!=0){D=-D|0}if((k|0)==0){aa=0}else{aa=k-336|0}mh(aa,A,J);A=A+E|0;A=A&65535;if((V|0)!=0){E=-E|0}J=w-1|0;w=J;}while((J|0)!=0);l=c[j+40>>2]|0;continue L5202}else if((x|0)==4847){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;x=4848}else if((x|0)==4813){x=0;g=g+1|0;o=u;s=u;continue L5202}else if((x|0)==4984){x=0;c[j+40>>2]=l;if((k|0)==0){ab=0}else{ab=k-336|0}s=s+(me(ab,u)|0)|0;g=g+2|0;if((k|0)==0){ac=0}else{ac=k-336|0}mh(ac,u,s&255);l=c[j+40>>2]|0;continue L5202}else if((x|0)==4838){x=0;s=o-u|0;g=g+1|0;t=~s;s=s&255;continue L5202}else if((x|0)==4781){x=0;g=g+2|0;r=r&-65;r=r|s&64;if((s&u|0)!=0){continue L5202}else{s=s<<8;continue L5202}}else if((x|0)==4810){x=0;g=g+1|0;n=u;s=u;continue L5202}else if((x|0)==4877){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;x=4878}else if((x|0)==4892){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;x=4893}else if((x|0)==4862){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;x=4863}else if((x|0)==4946){x=0;x=4947}else if((x|0)==4959){x=0;x=4960}else if((x|0)==4964){x=0;x=4965}else if((x|0)==4976){x=0;s=s+(d[k+u|0]|0)|0;x=4977}else if((x|0)==4733){x=0;if((k|0)==0){ad=0}else{ad=k-336|0}w=c[ad+8604+(P>>>13<<2)>>2]|0;P=P&8191;if((w|0)!=0){a[w+P|0]=m&255}else{if((d[k+8200+(P>>>13)|0]|0|0)==255){c[j+40>>2]=l;if((k|0)==0){ae=0}else{ae=k-336|0}mV(ae,P,m);l=c[j+40>>2]|0}}continue L5202}else if((x|0)==4750){x=0;s=d[(c[j+(Q>>>13<<2)>>2]|0)+(Q&8191)|0]|0;if((d[k+8200+(Q>>>13)|0]|0|0)==255){c[j+40>>2]=l;if((k|0)==0){af=0}else{af=k-336|0}s=mW(af,Q)|0;l=c[j+40>>2]|0}m=s;continue L5202}else if((x|0)==4769){x=0;s=u;x=4770}else if((x|0)==4922){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;x=4923}if((x|0)==4939){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;c[j+40>>2]=l;if((k|0)==0){ag=0}else{ag=k-336|0}w=me(ag,u)|0;s=t>>>1&128|w>>1;t=w<<8;x=4951}else if((x|0)==4908){x=0;c[j+40>>2]=l;if((k|0)==0){ah=0}else{ah=k-336|0}u=me(ah,u)|0;l=c[j+40>>2]|0;x=4912}else if((x|0)==4848){x=0;c[j+40>>2]=l;if((k|0)==0){ai=0}else{ai=k-336|0}u=me(ai,u)|0;l=c[j+40>>2]|0;x=4852}else if((x|0)==4878){x=0;c[j+40>>2]=l;if((k|0)==0){aj=0}else{aj=k-336|0}u=me(aj,u)|0;l=c[j+40>>2]|0;x=4882}else if((x|0)==4893){x=0;c[j+40>>2]=l;if((k|0)==0){ak=0}else{ak=k-336|0}u=me(ak,u)|0;l=c[j+40>>2]|0;x=4897}else if((x|0)==4863){x=0;c[j+40>>2]=l;if((k|0)==0){al=0}else{al=k-336|0}u=me(al,u)|0;l=c[j+40>>2]|0;x=4867}else if((x|0)==4947){x=0;g=g+1|0;u=u+((d[q+1|0]|0)<<8)|0;s=t>>>8&1;c[j+40>>2]=l;if((k|0)==0){am=0}else{am=k-336|0}w=(me(am,u)|0)<<1;t=w;s=s|w;x=4951}else if((x|0)==4960){x=0;w=d[k+u|0]|0;s=t>>>1&128|w>>1;t=w<<8;x=4977}else if((x|0)==4965){x=0;s=t>>>8&1;w=(d[k+u|0]|0)<<1;t=w;s=s|w;x=4977}else if((x|0)==4770){x=0;g=g+1|0;r=r&-65;r=r|s&64;if((s&m|0)!=0){continue L5202}else{s=s<<8;continue L5202}}else if((x|0)==4923){x=0;c[j+40>>2]=l;if((k|0)==0){an=0}else{an=k-336|0}u=me(an,u)|0;l=c[j+40>>2]|0;x=4927}if((x|0)==4912){x=0;x=4913}else if((x|0)==4852){x=0;x=4853}else if((x|0)==4867){x=0;x=4868}else if((x|0)==4951){x=0;g=g+1|0;if((k|0)==0){ao=0}else{ao=k-336|0}mh(ao,u,s&255);l=c[j+40>>2]|0;continue L5202}else if((x|0)==4977){x=0;g=g+1|0;a[k+u|0]=s&255;continue L5202}else if((x|0)==4882){x=0;x=4883}else if((x|0)==4927){x=0;x=4928}else if((x|0)==4897){x=0;x=4898}if((x|0)==4913){x=0;u=u^255}else if((x|0)==4868){x=0;w=m&u;m=w;s=w;g=g+1|0;continue L5202}else if((x|0)==4853){x=0;s=m-u|0;g=g+1|0;t=~s;s=s&255;continue L5202}else if((x|0)==4883){x=0;w=m^u;m=w;s=w;g=g+1|0;continue L5202}else if((x|0)==4928){x=0}else if((x|0)==4898){x=0;w=m|u;m=w;s=w;g=g+1|0;continue L5202}w=t>>>8&1;r=r&-65;r=r|(m^128)+w+((u&255)<<24>>24)>>2&64;A=m+u+w|0;s=A;t=A;g=g+1|0;m=s&255;continue L5202}}while(0);do{if((x|0)==5112){x=0;g=g-1|0;c[j+40>>2]=l;if((k|0)==0){ap=0}else{ap=k-336|0}K=mY(ap)|0;l=c[j+40>>2]|0;if((K|0)>0){break}if((l|0)>=0){break L5202}continue L5202}}while(0);l=l+7|0;a[k+(256|p-1)|0]=g>>>8&255;a[k+(256|p-2)|0]=g&255;g=jD((c[j+28>>2]|0)+8176+K|0)|0;p=p-3|256;u=r&76;u=u|(s>>>8|s)&128;u=u|t>>>8&1;if((s&255|0)==0){u=u|2}if((K|0)==6){u=u|16}a[k+p|0]=u&255;r=r&-9;r=r|4;a[k+8197|0]=r&255;u=(c[j+36>>2]|0)-(c[k+8264>>2]|0)|0;c[j+36>>2]=c[k+8264>>2];l=l+u|0}c[j+40>>2]=l;b[k+8192>>1]=g&65535;a[k+8198|0]=p-1&255;a[k+8194|0]=m&255;a[k+8195|0]=n&255;a[k+8196|0]=o&255;o=r&76;o=o|(s>>>8|s)&128;o=o|t>>>8&1;if((s&255|0)==0){o=o|2}a[k+8197|0]=o&255;o=k+8216|0;s=j;wh(o|0,s|0,44)|0;c[k+8212>>2]=k+8216;i=h;return f&1|0}function mm(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;do{if((d|0)<(f|0)){if((a[e+8197|0]&4|0)!=0){break}f=d}}while(0);d=(c[(c[e+8212>>2]|0)+36>>2]|0)-f|0;c[(c[e+8212>>2]|0)+36>>2]=f;return d|0}function mn(a,b){a=a|0;b=b|0;return b&c[a+16>>2]|0}function mo(a){a=a|0;var b=0;b=a;c[b+8212>>2]=b+8216;return}function mp(a){a=a|0;return c[a+8>>2]|0}function mq(a){a=a|0;var b=0;b=a;c[b+8716>>2]=(aq(c[b+8720>>2]|0,c[b+8704>>2]|0)|0)+1;return}function mr(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;c[d+8264>>2]=a;b=mm(d,a,c[d+8260>>2]|0)|0;a=(c[d+8212>>2]|0)+40|0;c[a>>2]=(c[a>>2]|0)+b;return}function ms(a,b){a=a|0;b=b|0;var d=0;d=a;a=mn(d,b)|0;b=a-(c[d+12>>2]|0)|0;if(b>>>0>((gc(d|0)|0)-8200|0)>>>0){b=0}return dh(d|0,b)|0}function mt(a){a=a|0;return c0(a|0)|0}function mu(a){a=a|0;nb(a);return}function mv(a){a=a|0;na(a);return}function mw(a){a=a|0;var b=0;b=a;mx(b+8640|0);hJ(b);return}function mx(a){a=a|0;c9(a|0);return}function my(a,b,c){a=a|0;b=b|0;c=c|0;mz((mA(a+8640|0)|0)+32|0,b);return 0}function mz(a,b){a=a|0;b=b|0;var c=0;c=a;a=b;if((d[c]|0|0)<32){return}c=m9(c,a+272|0)|0;c=m9(c,a+784|0)|0;c=m9(c,a+1040|0)|0;return}function mA(a){a=a|0;return(c0(a|0)|0)+8200|0}function mB(a,b){a=a|0;b=b|0;var c=0,e=0,f=0,g=0;c=a;a=mC(c+8640|0,b,32,c+8664|0,255)|0;if((a|0)!=0){e=a;f=e;return f|0}a=mD(c+8664|0)|0;if((a|0)!=0){e=a;f=e;return f|0}if((d[c+8668|0]|0|0)!=0){gA(c,2152)}if((wk(c+8680|0,1440,4)|0)!=0){gA(c,960)}if((wk(c+8692|0,28808,4)|0)!=0){gA(c,10512)}a=lE(c+8688|0)|0;b=lE(c+8684|0)|0;if((a&-1048576|0)!=0){gA(c,10192);a=a&1048575}if((a+b|0)>>>0>1048576){gA(c,9736)}if((b|0)!=(mp(c+8640|0)|0)){do{if((b|0)<=((mp(c+8640|0)|0)-4|0)){if((wk((mA(c+8640|0)|0)+b|0,1440,4)|0)!=0){g=5170;break}gA(c,9336)}else{g=5170}}while(0);if((g|0)==5170){if((b|0)<(mp(c+8640|0)|0)){gA(c,9016)}else{gA(c,8584)}}}mE(c+8640|0,a);jI(c,6);mF(c+8752|0,+jJ(c));e=c5(c,7159091)|0;f=e;return f|0}function mC(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return c8(a,b,c,d,e,8200)|0}function mD(a){a=a|0;var b=0,d=0;if((wk(a|0,6784,4)|0)!=0){b=c[74]|0;d=b;return d|0}else{b=0;d=b;return d|0}return 0}function mE(a,b){a=a|0;b=b|0;db(a,b,8192);return}function mF(a,b){a=a|0;b=+b;ji(a+536|0,91552734375.0e-16*b);return}function mG(a,b){a=a|0;b=b|0;mH(a+8752|0,b);return}function mH(a,b){a=a|0;b=b|0;jl(a+536|0,b);return}function mI(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ma(a+8752|0,b,c,d,e);return}function mJ(a,b){a=a|0;b=+b;var d=0.0,e=0;d=b;e=a;c[e+8696>>2]=~~(119210.0/d);c[e+8704>>2]=~~(1024.0/d);mq(e);return}function mK(e,f){e=e|0;f=f|0;var g=0,h=0,i=0;g=f;f=e;e=c6(f,g)|0;if((e|0)!=0){h=e;i=h;return i|0}wg(f+336|0,0,8192);wg(f+9848|0,0,24584);l5(f+8752|0);mi(f+336|0);e=0;while(1){if(e>>>0>=8){break}mk(f+336|0,e,d[f+8672+e|0]|0);e=e+1|0}mk(f+336|0,8,255);a[f+8744|0]=6;c[f+8736>>2]=1073741824;c[f+8740>>2]=1073741824;a[f+8724|0]=0;c[f+8720>>2]=128;c[f+8712>>2]=c[f+8716>>2];a[f+8725|0]=0;c[f+8708>>2]=0;a[f+8732|0]=0;a[f+8733|0]=0;c[f+8728>>2]=0;a[f+847|0]=31;a[f+846|0]=-2;a[f+8534|0]=-3;b[f+8528>>1]=(jD(f+8670|0)|0)&65535;a[f+8530|0]=g&255;mq(f);c[f+8700>>2]=0;h=0;i=h;return i|0}function mL(b,c,e){b=b|0;c=c|0;e=e|0;var f=0;f=e;e=b;b=c;if((b|0)==2){if((d[e+8732|0]|0|0)==5){if((f&4|0)!=0){gA(e,8288)}mR(e,mS(e+336|0)|0);a[e+8733|0]=f&255;mU(e)}return}else if((b|0)==0){a[e+8732|0]=f&31;return}else if((b|0)==3){return}else{return}}function mM(a){a=a|0;var b=0;b=a;mo(b+336|0);cJ(b);c[b>>2]=20912;mu(b+8640|0);l4(b+8752|0);c[b+8720>>2]=0;jF(b,c[90]|0);hu(b,18016);jG(b,17992);jH(b,6);le(b,1.11);return}function mN(a){a=a|0;var b=0;b=a;mO(b);cK(b);return}function mO(a){a=a|0;var b=0;b=a;c[b>>2]=20912;mv(b+8640|0);cP(b);return}function mP(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function mQ(a,b){a=a|0;b=b|0;var d=0;d=a;if((c[d>>2]|0)>=1073741824){return}a=d;c[a>>2]=(c[a>>2]|0)-b;if((c[d>>2]|0)<0){c[d>>2]=0}return}function mR(b,d){b=b|0;d=d|0;var e=0,f=0;e=d;d=b;while(1){if((c[d+8728>>2]|0)>=(e|0)){break}b=d+8728|0;c[b>>2]=(c[b>>2]|0)+(c[d+8696>>2]|0)}b=e-(c[d+8708>>2]|0)|0;if((b|0)<=0){return}if((a[d+8724|0]|0)!=0){f=d+8712|0;c[f>>2]=(c[f>>2]|0)-b;if((c[d+8712>>2]|0)<=0){b=d+8712|0;c[b>>2]=(c[b>>2]|0)+(c[d+8716>>2]|0)}}c[d+8708>>2]=e;return}function mS(a){a=a|0;var b=0;b=a;return(c[(c[b+8212>>2]|0)+40>>2]|0)+(c[(c[b+8212>>2]|0)+36>>2]|0)|0}function mT(a){a=a|0;return c[a+8264>>2]|0}function mU(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=mS(d+336|0)|0;if((c[d+8736>>2]|0)>(b|0)){c[d+8736>>2]=1073741824;do{if((a[d+8724|0]|0)!=0){if((a[d+8725|0]|0)!=0){break}c[d+8736>>2]=b+(c[d+8712>>2]|0)}}while(0)}if((c[d+8740>>2]|0)>(b|0)){c[d+8740>>2]=1073741824;if((a[d+8733|0]&8|0)!=0){c[d+8740>>2]=c[d+8728>>2]}}b=1073741824;if((a[d+8744|0]&4|0)==0){b=c[d+8736>>2]|0}if((a[d+8744|0]&2|0)!=0){e=d;f=e+336|0;g=f;h=b;mX(g,h);return}b=mP(b,c[d+8740>>2]|0)|0;e=d;f=e+336|0;g=f;h=b;mX(g,h);return}function mV(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0;g=e;e=f;f=b;if((g-2048|0)>>>0<=9){b=mS(f+336|0)|0;md(f+8752|0,mP(b,(mT(f+336|0)|0)+8|0)|0,g,e);return}b=mS(f+336|0)|0;h=g;if((h|0)==3072){mR(f,b);c[f+8720>>2]=(e&127)+1;mq(f);c[f+8712>>2]=c[f+8716>>2]}else if((h|0)==3073){e=e&1;if((d[f+8724|0]|0)==(e|0)){return}mR(f,b);a[f+8724|0]=e&255;if((e|0)!=0){c[f+8712>>2]=c[f+8716>>2]}}else if((h|0)==5123){mR(f,b);if((a[f+8724|0]|0)!=0){c[f+8712>>2]=c[f+8716>>2]}a[f+8725|0]=0}else if((h|0)==5122){mR(f,b);a[f+8744|0]=e&255;do{if((e&248|0)!=0){if((e&248|0)==248){break}}}while(0)}else if((h|0)==0|(h|0)==2|(h|0)==3){mL(f,g,e);return}else if((h|0)==4096|(h|0)==1026|(h|0)==1027|(h|0)==1028|(h|0)==1029){return}else{return}mU(f);return}function mW(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;e=b;b=a;a=mS(b+336|0)|0;e=e&8191;f=e;if((f|0)==5123){e=0;if((c[b+8736>>2]|0)<=(a|0)){e=e|4}if((c[b+8740>>2]|0)<=(a|0)){e=e|2}g=e;h=g;return h|0}else if((f|0)==3073|(f|0)==3072){mR(b,a);g=(((c[b+8712>>2]|0)-1|0)>>>0)/((c[b+8704>>2]|0)>>>0)|0;h=g;return h|0}else if((f|0)==2|(f|0)==3){g=0;h=g;return h|0}else if((f|0)==5122){g=d[b+8744|0]|0;h=g;return h|0}else if((f|0)==0){if((c[b+8740>>2]|0)>(a|0)){g=0;h=g;return h|0}else{c[b+8740>>2]=1073741824;mR(b,a);mU(b);g=32;h=g;return h|0}}g=255;h=g;return h|0}function mX(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;a=c[d+8264>>2]|0;e=b;c[d+8260>>2]=e;b=mm(d,a,e)|0;e=(c[d+8212>>2]|0)+40|0;c[e>>2]=(c[e>>2]|0)+b;return}function mY(b){b=b|0;var d=0,e=0,f=0;d=b;if((a[d+8533|0]&4|0)==0){b=mS(d+336|0)|0;do{if((c[d+8736>>2]|0)<=(b|0)){if((a[d+8744|0]&4|0)!=0){break}a[d+8725|0]=1;c[d+8736>>2]=1073741824;mU(d);e=10;f=e;return f|0}}while(0);do{if((c[d+8740>>2]|0)<=(b|0)){if((a[d+8744|0]&2|0)!=0){break}e=8;f=e;return f|0}}while(0)}e=0;f=e;return f|0}function mZ(a,b,d){a=a|0;b=b|0;d=d|0;d=a;a=c[b>>2]|0;if(ml(d+336|0,a)|0){gA(d,7952)}mR(d,a);b=d+8708|0;c[b>>2]=(c[b>>2]|0)-a;b=d+8728|0;c[b>>2]=(c[b>>2]|0)-a;m0(d+336|0,a);mQ(d+8736|0,a);mQ(d+8740|0,a);mg(d+8752|0,a);return 0}function m_(a){a=a|0;m3(a);return}function m$(a){a=a|0;m8(a);return}function m0(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((c[b+8212>>2]|0)!=(b+8216|0)){a5(7256,118,13792,7088)}a=b+8252|0;c[a>>2]=(c[a>>2]|0)-d;if((c[b+8260>>2]|0)<1073741824){a=b+8260|0;c[a>>2]=(c[a>>2]|0)-d}if((c[b+8264>>2]|0)>=1073741824){return}a=b+8264|0;c[a>>2]=(c[a>>2]|0)-d;return}function m1(){var a=0,b=0,c=0;a=j6(34432)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;mM(b);c=b}return c|0}function m2(){var a=0,b=0,c=0;a=j6(528)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;m_(b);c=b}return c|0}function m3(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=20064;jF(b,c[90]|0);return}function m4(b){b=b|0;var e=0,f=0,g=0;e=b;c[e+516>>2]=e+520;b=256;while(1){f=b-1|0;b=f;if((f|0)<0){break}f=1;g=b;while(1){if((g|0)==0){break}f=f^g;g=g>>1}g=b&168|(f&1)<<2;a[e+b|0]=g&255;a[e+(b+256)|0]=(g|1)&255}b=e|0;a[b]=(d[b]|0|64)&255;b=e+256|0;a[b]=(d[b]|0|64)&255;return}function m5(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=b;b=a;a=f<<13&8191;c[(c[b+516>>2]|0)+36+(f<<2)>>2]=d+(-a|0);c[(c[b+516>>2]|0)+(f<<2)>>2]=e+(-a|0);return}function m6(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=a;a=b;b=bS[c[(c[a>>2]|0)+12>>2]&255](a,d+316|0,208)|0;if((b|0)==0){e=mD(d+316|0)|0;f=e;return f|0}if((b|0)==26104){g=c[74]|0}else{g=b}e=g;f=e;return f|0}function m7(a,b,c){a=a|0;b=b|0;c=c|0;mz(a+380|0,b);return 0}function m8(a){a=a|0;ik(a);return}function m9(b,c){b=b|0;c=c|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=b;b=c;do{if((e|0)!=0){c=32;do{if((a[e+31|0]|0)!=0){if((a[e+47|0]|0)!=0){break}c=48}}while(0);f=0;f=0;while(1){if((f|0)<(c|0)){g=(a[e+f|0]|0)!=0}else{g=0}if(!g){break}if(((d[e+f|0]|0)+1&255|0)<33){h=5421;break}f=f+1|0}if((h|0)==5421){i=0;j=i;return j|0}while(1){if((f|0)>=(c|0)){h=5430;break}if((a[e+f|0]|0)!=0){break}f=f+1|0}if((h|0)==5430){gm(b,e,c);e=e+c|0;break}i=0;j=i;return j|0}}while(0);i=e;j=i;return j|0}function na(a){a=a|0;lr(a);return}function nb(a){a=a|0;lt(a);return}function nc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=d;d=a;c[d+516>>2]=d+520;c[d+596>>2]=0;c[d+592>>2]=0;c[d+512>>2]=0;a=0;while(1){if((a|0)>=9){break}m5(d,a,e,b);a=a+1|0}wg(d+600|0,0,30);return}function nd(a){a=a|0;var b=0;b=a;m$(b);cK(b);return}function ne(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=b;b=c;c=d;d=e;e=a;if(((f>>>0)%8192|0|0)!=0){a5(4144|0,103,13640|0,9240|0)}if(((b>>>0)%8192|0|0)!=0){a5(4144|0,104,13640|0,6368|0)}a=(f>>>0)/8192|0;f=(b>>>0)/8192|0;while(1){b=f;f=b-1|0;if((b|0)==0){break}b=f<<13;m5(e,a+f|0,c+b|0,d+b|0)}return}function nf(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0;h=i;i=i+88|0;j=h|0;k=h+80|0;l=f;nh(l,g);g=j;f=l+520|0;wh(g|0,f|0,80)|0;c[l+516>>2]=j;f=0;g=k;m=l+608|0;wh(g|0,m|0,8)|0;m=c[j+76>>2]|0;g=e[l+600>>1]|0;n=e[l+602>>1]|0;o=e[l+604>>1]|0;p=e[l+606>>1]|0;q=d[l+615|0]|0;L6120:while(1){r=c[j+(g>>>13<<2)>>2]|0;r=r+(g&8191)|0;s=r;r=s+1|0;t=d[s]|0;g=g+1|0;u=d[17736+t|0]|0;s=m+u|0;m=s;if((s|0)>=0){if((m|0)>=(u|0)){v=5469;break}}u=d[(c[j+(g>>>13<<2)>>2]|0)+(g&8191)|0]|0;s=t;L6128:do{if((s|0)==46){g=g+1|0;a[k+4|0]=u&255;continue L6120}else if((s|0)==16){w=(d[k+1|0]|0)-1|0;a[k+1|0]=w&255;g=g+1|0;if((w|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L6120}else{v=5460;break}}else if((s|0)==56){g=g+1|0;if((q&1|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L6120}else{v=5460;break}}else if((s|0)==0|(s|0)==64|(s|0)==73|(s|0)==82|(s|0)==91|(s|0)==100|(s|0)==109|(s|0)==127){continue L6120}else if((s|0)==32){g=g+1|0;if((q&64|0)!=0){v=5460;break}else{g=g+((u&255)<<24>>24)&65535;continue L6120}}else if((s|0)==202){if((q&64|0)!=0){g=jD(r)|0;continue L6120}else{v=5462;break}}else if((s|0)==210){if((q&1|0)!=0){v=5462;break}else{g=jD(r)|0;continue L6120}}else if((s|0)==248){if((q&128|0)!=0){v=5543;break}else{m=m-6|0;continue L6120}}else if((s|0)==58){w=jD(r)|0;g=g+2|0;a[k+6|0]=a[(c[j+(w>>>13<<2)>>2]|0)+(w&8191)|0]|0;continue L6120}else if((s|0)==55){q=q&196|1|a[k+6|0]&40;continue L6120}else if((s|0)==219){g=g+1|0;a[k+6|0]=(ny(l,m+(c[j+72>>2]|0)|0,u+((d[k+6|0]|0)<<8)|0)|0)&255;continue L6120}else if((s|0)==227){w=jD((c[j+(n>>>13<<2)>>2]|0)+(n&8191)|0)|0;jE((c[j+36+(n>>>13<<2)>>2]|0)+(n&8191)|0,e[k+4>>1]|0);b[k+4>>1]=w&65535;continue L6120}else if((s|0)==242){if((q&128|0)!=0){v=5462;break}else{g=jD(r)|0;continue L6120}}else if((s|0)==184|(s|0)==185|(s|0)==186|(s|0)==187|(s|0)==188|(s|0)==189|(s|0)==191){u=d[k-184+(t^1)|0]|0;v=5591}else if((s|0)==57){u=n;v=5596}else if((s|0)==9|(s|0)==25|(s|0)==41){u=e[k-1+(t>>>3)>>1]|0;v=5596}else if((s|0)==39){w=d[k+6|0]|0;if((w|0)>153){q=q|1}x=96&-(q&1);if((q&16|0)!=0){v=5601}else{if((w&15|0)>9){v=5601}}if((v|0)==5601){v=0;x=x|6}if((q&2|0)!=0){x=-x|0}w=w+x|0;q=q&3|((d[k+6|0]|0)^w)&16|(d[l+(w&255)|0]|0);a[k+6|0]=w&255;continue L6120}else if((s|0)==190){u=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;v=5591}else if((s|0)==201){v=5543}else if((s|0)==196){if((q&64|0)!=0){v=5461;break}else{v=5569;break}}else if((s|0)==42){w=jD(r)|0;g=g+2|0;b[k+4>>1]=(jD((c[j+(w>>>13<<2)>>2]|0)+(w&8191)|0)|0)&65535;continue L6120}else if((s|0)==50){w=jD(r)|0;g=g+2|0;c[j+76>>2]=m;nJ(l,w,d[k+6|0]|0);continue L6120}else if((s|0)==34){w=jD(r)|0;g=g+2|0;jE((c[j+36+(w>>>13<<2)>>2]|0)+(w&8191)|0,e[k+4>>1]|0);continue L6120}else if((s|0)==2|(s|0)==18){c[j+76>>2]=m;nJ(l,e[k+(t>>>3)>>1]|0,d[k+6|0]|0);continue L6120}else if((s|0)==10|(s|0)==26){a[k+6|0]=a[(c[j+((e[k-1+(t>>>3)>>1]|0)>>13<<2)>>2]|0)+(b[k-1+(t>>>3)>>1]&8191)|0]|0;continue L6120}else if((s|0)==249){n=e[k+4>>1]|0;continue L6120}else if((s|0)==237){g=g+1|0;m=m+((d[27904+u|0]|0)>>4)|0;w=u;do{if((w|0)==114|(w|0)==122){y=n;if(!0){v=5696;break}v=5695}else if((w|0)==66|(w|0)==82|(w|0)==98|(w|0)==74|(w|0)==90|(w|0)==106){v=5695}else if((w|0)==64|(w|0)==72|(w|0)==80|(w|0)==88|(w|0)==96|(w|0)==104|(w|0)==112|(w|0)==120){x=ny(l,m+(c[j+72>>2]|0)|0,e[k>>1]|0)|0;a[k-8+(u>>>3^1)|0]=x&255;q=q&1|(d[l+x|0]|0);continue L6120}else if((w|0)==113){a[k+7|0]=0;v=5703}else if((w|0)==65|(w|0)==73|(w|0)==81|(w|0)==89|(w|0)==97|(w|0)==105|(w|0)==121){v=5703}else if((w|0)==115){z=n;if(!0){v=5707;break}v=5706}else if((w|0)==67|(w|0)==83){v=5706}else if((w|0)==75|(w|0)==91){x=jD(r+1|0)|0;g=g+2|0;b[k-9+(u>>>3)>>1]=(jD((c[j+(x>>>13<<2)>>2]|0)+(x&8191)|0)|0)&65535;continue L6120}else if((w|0)==123){x=jD(r+1|0)|0;g=g+2|0;n=jD((c[j+(x>>>13<<2)>>2]|0)+(x&8191)|0)|0;continue L6120}else if((w|0)==103){x=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,(d[k+6|0]|0)<<4|x>>>4);x=a[k+6|0]&240|x&15;q=q&1|(d[l+x|0]|0);a[k+6|0]=x&255;continue L6120}else if((w|0)==111){x=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,x<<4|a[k+6|0]&15);x=a[k+6|0]&240|x>>>4;q=q&1|(d[l+x|0]|0);a[k+6|0]=x&255;continue L6120}else if((w|0)==70|(w|0)==78|(w|0)==102|(w|0)==110){a[l+628|0]=0;continue L6120}else if((w|0)==86|(w|0)==118){a[l+628|0]=1;continue L6120}else if((w|0)==94|(w|0)==126){a[l+628|0]=2;continue L6120}else if((w|0)==68|(w|0)==76|(w|0)==84|(w|0)==92|(w|0)==100|(w|0)==108|(w|0)==116|(w|0)==124){t=16;q=q&-2;u=d[k+6|0]|0;a[k+6|0]=0;v=5585;break L6128}else if((w|0)==169|(w|0)==185){A=-1;if(!0){v=5716;break}v=5715}else if((w|0)==161|(w|0)==177){v=5715}else if((w|0)==168|(w|0)==184){B=-1;if(!0){v=5727;break}v=5726}else if((w|0)==160|(w|0)==176){v=5726}else if((w|0)==171|(w|0)==187){C=-1;if(!0){v=5735;break}v=5734}else if((w|0)==163|(w|0)==179){v=5734}else if((w|0)==170|(w|0)==186){D=-1;if(!0){v=5742;break}v=5741}else if((w|0)==162|(w|0)==178){v=5741}else if((w|0)==71){a[l+627|0]=a[k+6|0]|0;continue L6120}else if((w|0)==79){a[l+626|0]=a[k+6|0]|0;f=1;continue L6120}else if((w|0)==87){a[k+6|0]=a[l+627|0]|0;v=5750}else if((w|0)==95){a[k+6|0]=a[l+626|0]|0;f=1;v=5750}else if((w|0)==69|(w|0)==77|(w|0)==85|(w|0)==93|(w|0)==101|(w|0)==109|(w|0)==117|(w|0)==125){a[l+624|0]=a[l+625|0]|0;v=5543;break L6128}else{f=1;continue L6120}}while(0);if((v|0)==5695){v=0;y=e[k+((u>>>3&6)>>>0)>>1]|0;v=5696}else if((v|0)==5703){v=0;nK(l,m+(c[j+72>>2]|0)|0,e[k>>1]|0,d[k-8+(u>>>3^1)|0]|0);continue L6120}else if((v|0)==5706){v=0;z=e[k-8+(u>>>3)>>1]|0;v=5707}else if((v|0)==5715){v=0;A=1;v=5716}else if((v|0)==5726){v=0;B=1;v=5727}else if((v|0)==5734){v=0;C=1;v=5735}else if((v|0)==5741){v=0;D=1;v=5742}else if((v|0)==5750){v=0;q=q&1|(d[l+(d[k+6|0]|0)|0]|0)&-5|(d[l+625|0]|0)<<2&4;continue L6120}if((v|0)==5696){v=0;w=y+(q&1)|0;q=~u>>>2&2;if((q|0)!=0){w=-w|0}w=w+(e[k+4>>1]|0)|0;y=y^(e[k+4>>1]|0);y=y^w;q=q|(w>>>16&1|y>>>8&16|w>>>8&168|(y+32768|0)>>>14&4);b[k+4>>1]=w&65535;if((w&65535)<<16>>16!=0){continue L6120}else{q=q|64;continue L6120}}else if((v|0)==5707){v=0;w=jD(r+1|0)|0;g=g+2|0;jE((c[j+36+(w>>>13<<2)>>2]|0)+(w&8191)|0,z);continue L6120}else if((v|0)==5716){v=0;w=e[k+4>>1]|0;b[k+4>>1]=w+A&65535;x=d[(c[j+(w>>>13<<2)>>2]|0)+(w&8191)|0]|0;w=(d[k+6|0]|0)-x|0;q=q&1|2|((x^(d[k+6|0]|0))&16^w)&144;if((w&255)<<24>>24==0){q=q|64}w=w-((q&16)>>4)|0;q=q|w&8;q=q|w<<4&32;w=k|0;x=(b[w>>1]|0)-1&65535;b[w>>1]=x;if(x<<16>>16==0){continue L6120}q=q|4;do{if((q&64|0)==0){if(u>>>0<176){break}g=g-2|0;m=m+5|0;continue L6120}}while(0);continue L6120}else if((v|0)==5727){v=0;x=e[k+4>>1]|0;b[k+4>>1]=x+B&65535;w=d[(c[j+(x>>>13<<2)>>2]|0)+(x&8191)|0]|0;x=e[k+2>>1]|0;b[k+2>>1]=x+B&65535;c[j+76>>2]=m;nJ(l,x,w);w=w+(d[k+6|0]|0)|0;q=q&193|w&8|w<<4&32;w=k|0;x=(b[w>>1]|0)-1&65535;b[w>>1]=x;if(x<<16>>16==0){continue L6120}q=q|4;if(u>>>0<176){continue L6120}else{g=g-2|0;m=m+5|0;continue L6120}}else if((v|0)==5735){v=0;x=e[k+4>>1]|0;b[k+4>>1]=x+C&65535;w=d[(c[j+(x>>>13<<2)>>2]|0)+(x&8191)|0]|0;x=k+1|0;E=(a[x]|0)-1&255;a[x]=E;x=E&255;q=w>>6&2|(d[l+x|0]|0)&-5;do{if((x|0)!=0){if(u>>>0<176){break}g=g-2|0;m=m+5|0}}while(0);nK(l,m+(c[j+72>>2]|0)|0,e[k>>1]|0,w);continue L6120}else if((v|0)==5742){v=0;x=e[k+4>>1]|0;b[k+4>>1]=x+D&65535;E=ny(l,m+(c[j+72>>2]|0)|0,e[k>>1]|0)|0;F=k+1|0;G=(a[F]|0)-1&255;a[F]=G;F=G&255;q=E>>6&2|(d[l+F|0]|0)&-5;do{if((F|0)!=0){if(u>>>0<176){break}g=g-2|0;m=m+5|0}}while(0);c[j+76>>2]=m;nJ(l,x,E);continue L6120}}else if((s|0)==199|(s|0)==207|(s|0)==215|(s|0)==223|(s|0)==231|(s|0)==239|(s|0)==247){v=5573}else if((s|0)==245){u=((d[k+6|0]|0)<<8)+q|0;v=5576}else if((s|0)==197|(s|0)==213|(s|0)==229){u=e[k-24+(t>>>3)>>1]|0;v=5576}else if((s|0)==254){g=g+1|0;v=5591}else if((s|0)==221){H=o;v=5758}else if((s|0)==253){H=p;v=5758}else if((s|0)==48){g=g+1|0;if((q&1|0)!=0){v=5460;break}else{g=g+((u&255)<<24>>24)&65535;continue L6120}}else if((s|0)==8){F=d[l+622|0]|0;a[l+622|0]=a[k+6|0]|0;a[k+6|0]=F&255;F=d[l+623|0]|0;a[l+623|0]=q&255;q=F;continue L6120}else if((s|0)==5|(s|0)==13|(s|0)==21|(s|0)==29|(s|0)==37|(s|0)==45|(s|0)==61){F=k+(t>>>3^1)|0;w=(a[F]|0)-1&255;a[F]=w;u=w&255;v=5612}else if((s|0)==204){if((q&64|0)!=0){v=5569;break}else{v=5461;break}}else if((s|0)==212){if((q&1|0)!=0){v=5461;break}else{v=5569;break}}else if((s|0)==224){if((q&4|0)!=0){m=m-6|0;continue L6120}else{v=5543;break}}else if((s|0)==232){if((q&4|0)!=0){v=5543;break}else{m=m-6|0;continue L6120}}else if((s|0)==241){q=d[(c[j+(n>>>13<<2)>>2]|0)+(n&8191)|0]|0;a[k+6|0]=a[(c[j+((n+1|0)>>>13<<2)>>2]|0)+(n+1&8191)|0]|0;n=n+2&65535;continue L6120}else if((s|0)==193|(s|0)==209|(s|0)==225){b[k-24+(t>>>3)>>1]=(jD((c[j+(n>>>13<<2)>>2]|0)+(n&8191)|0)|0)&65535;n=n+2&65535;continue L6120}else if((s|0)==150|(s|0)==134){q=q&-2;v=5580}else if((s|0)==158|(s|0)==142){v=5580}else if((s|0)==214|(s|0)==198){q=q&-2;v=5582}else if((s|0)==222|(s|0)==206){v=5582}else if((s|0)==144|(s|0)==145|(s|0)==146|(s|0)==147|(s|0)==148|(s|0)==149|(s|0)==151|(s|0)==128|(s|0)==129|(s|0)==130|(s|0)==131|(s|0)==132|(s|0)==133|(s|0)==135){q=q&-2;v=5584}else if((s|0)==152|(s|0)==153|(s|0)==154|(s|0)==155|(s|0)==156|(s|0)==157|(s|0)==159|(s|0)==136|(s|0)==137|(s|0)==138|(s|0)==139|(s|0)==140|(s|0)==141|(s|0)==143){v=5584}else if((s|0)==250){if((q&128|0)!=0){g=jD(r)|0;continue L6120}else{v=5462;break}}else if((s|0)==194){if((q&64|0)!=0){v=5462;break}else{g=jD(r)|0;continue L6120}}else if((s|0)==226){if((q&4|0)!=0){v=5462;break}else{g=jD(r)|0;continue L6120}}else if((s|0)==228){if((q&4|0)!=0){v=5461;break}else{v=5569;break}}else if((s|0)==236){if((q&4|0)!=0){v=5569;break}else{v=5461;break}}else if((s|0)==216){if((q&1|0)!=0){v=5543;break}else{m=m-6|0;continue L6120}}else if((s|0)==24){g=g+1|0;g=g+((u&255)<<24>>24)&65535;continue L6120}else if((s|0)==255){if(g>>>0>65535){v=5571;break L6120}v=5573}else if((s|0)==52){u=(d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0)+1|0;c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,u);v=5607}else if((s|0)==4|(s|0)==12|(s|0)==20|(s|0)==28|(s|0)==36|(s|0)==44|(s|0)==60){w=k+(t>>>3^1)|0;F=(a[w]|0)+1&255;a[w]=F;u=F&255;v=5607}else if((s|0)==53){u=(d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0)-1|0;c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,u);v=5612}else if((s|0)==234){if((q&4|0)!=0){g=jD(r)|0;continue L6120}else{v=5462;break}}else if((s|0)==3|(s|0)==19|(s|0)==35){F=k+(t>>>3)|0;b[F>>1]=(b[F>>1]|0)+1&65535;continue L6120}else if((s|0)==51){n=n+1&65535;continue L6120}else if((s|0)==11|(s|0)==27|(s|0)==43){F=k-1+(t>>>3)|0;b[F>>1]=(b[F>>1]|0)-1&65535;continue L6120}else if((s|0)==59){n=n-1&65535;continue L6120}else if((s|0)==166){u=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;v=5622}else if((s|0)==230){g=g+1|0;v=5622}else if((s|0)==62){g=g+1|0;a[k+6|0]=u&255;continue L6120}else if((s|0)==174){u=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;v=5630}else if((s|0)==238){g=g+1|0;v=5630}else if((s|0)==168|(s|0)==169|(s|0)==170|(s|0)==171|(s|0)==172|(s|0)==173|(s|0)==175){u=d[k-168+(t^1)|0]|0;v=5630}else if((s|0)==112|(s|0)==113|(s|0)==114|(s|0)==115|(s|0)==116|(s|0)==117|(s|0)==119){c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,d[k-112+(t^1)|0]|0);continue L6120}else if((s|0)==65|(s|0)==66|(s|0)==67|(s|0)==68|(s|0)==69|(s|0)==71|(s|0)==72|(s|0)==74|(s|0)==75|(s|0)==76|(s|0)==77|(s|0)==79|(s|0)==80|(s|0)==81|(s|0)==83|(s|0)==84|(s|0)==85|(s|0)==87|(s|0)==88|(s|0)==89|(s|0)==90|(s|0)==92|(s|0)==93|(s|0)==95|(s|0)==96|(s|0)==97|(s|0)==98|(s|0)==99|(s|0)==101|(s|0)==103|(s|0)==104|(s|0)==105|(s|0)==106|(s|0)==107|(s|0)==108|(s|0)==111|(s|0)==120|(s|0)==121|(s|0)==122|(s|0)==123|(s|0)==124|(s|0)==125){a[k+(t>>>3&7^1)|0]=a[k+(t&7^1)|0]|0;continue L6120}else if((s|0)==192){if((q&64|0)!=0){m=m-6|0;continue L6120}else{v=5543;break}}else if((s|0)==200){if((q&64|0)!=0){v=5543;break}else{m=m-6|0;continue L6120}}else if((s|0)==240){if((q&128|0)!=0){m=m-6|0;continue L6120}else{v=5543;break}}else if((s|0)==40){g=g+1|0;if((q&64|0)!=0){g=g+((u&255)<<24>>24)&65535;continue L6120}else{v=5460;break}}else if((s|0)==211){g=g+1|0;nK(l,m+(c[j+72>>2]|0)|0,u+((d[k+6|0]|0)<<8)|0,d[k+6|0]|0);continue L6120}else if((s|0)==235){F=e[k+4>>1]|0;b[k+4>>1]=b[k+2>>1]|0;b[k+2>>1]=F&65535;continue L6120}else if((s|0)==217){F=e[l+616>>1]|0;b[l+616>>1]=b[k>>1]|0;b[k>>1]=F&65535;F=e[l+618>>1]|0;b[l+618>>1]=b[k+2>>1]|0;b[k+2>>1]=F&65535;F=e[l+620>>1]|0;b[l+620>>1]=b[k+4>>1]|0;b[k+4>>1]=F&65535;continue L6120}else if((s|0)==243){a[l+624|0]=0;a[l+625|0]=0;continue L6120}else if((s|0)==251){a[l+624|0]=1;a[l+625|0]=1;continue L6120}else if((s|0)==118){v=5657;break L6120}else if((s|0)==203){g=g+1|0;F=u;if((F|0)==48|(F|0)==49|(F|0)==50|(F|0)==51|(F|0)==52|(F|0)==53|(F|0)==55){w=k-48+(u^1)|0;G=(d[w]|0)<<1|1;q=d[l+G|0]|0;a[w]=G&255;continue L6120}else if((F|0)==14){m=m+7|0;u=e[k+4>>1]|0;v=5672;break}else if((F|0)==8|(F|0)==9|(F|0)==10|(F|0)==11|(F|0)==12|(F|0)==13|(F|0)==15){G=k-8+(u^1)|0;w=d[G]|0;q=w&1;w=w<<7&255|w>>>1;q=q|(d[l+w|0]|0);a[G]=w&255;continue L6120}else if((F|0)==30){m=m+7|0;u=e[k+4>>1]|0;v=5675;break}else if((F|0)==128|(F|0)==129|(F|0)==130|(F|0)==131|(F|0)==132|(F|0)==133|(F|0)==135|(F|0)==136|(F|0)==137|(F|0)==138|(F|0)==139|(F|0)==140|(F|0)==141|(F|0)==143|(F|0)==144|(F|0)==145|(F|0)==146|(F|0)==147|(F|0)==148|(F|0)==149|(F|0)==151|(F|0)==152|(F|0)==153|(F|0)==154|(F|0)==155|(F|0)==156|(F|0)==157|(F|0)==159|(F|0)==160|(F|0)==161|(F|0)==162|(F|0)==163|(F|0)==164|(F|0)==165|(F|0)==167|(F|0)==168|(F|0)==169|(F|0)==170|(F|0)==171|(F|0)==172|(F|0)==173|(F|0)==175|(F|0)==176|(F|0)==177|(F|0)==178|(F|0)==179|(F|0)==180|(F|0)==181|(F|0)==183|(F|0)==184|(F|0)==185|(F|0)==186|(F|0)==187|(F|0)==188|(F|0)==189|(F|0)==191){w=k+(u&7^1)|0;a[w]=(d[w]|0)&~(1<<(u>>>3&7))&255;continue L6120}else if((F|0)==24|(F|0)==25|(F|0)==26|(F|0)==27|(F|0)==28|(F|0)==29|(F|0)==31){w=k-24+(u^1)|0;G=d[w]|0;I=G&1;G=q<<7&255|G>>>1;q=d[l+G|0]|0|I;a[w]=G&255;continue L6120}else if((F|0)==46){u=e[k+4>>1]|0;m=m+7|0;v=5678;break}else if((F|0)==40|(F|0)==41|(F|0)==42|(F|0)==43|(F|0)==44|(F|0)==45|(F|0)==47){G=k-40+(u^1)|0;w=d[G]|0;q=w&1;w=w&128|w>>>1;q=q|(d[l+w|0]|0);a[G]=w&255;continue L6120}else if((F|0)==62){m=m+7|0;u=e[k+4>>1]|0;v=5681;break}else if((F|0)==56|(F|0)==57|(F|0)==58|(F|0)==59|(F|0)==60|(F|0)==61|(F|0)==63){w=k-56+(u^1)|0;G=d[w]|0;q=G&1;G=G>>>1;q=q|(d[l+G|0]|0);a[w]=G&255;continue L6120}else if((F|0)==70|(F|0)==78|(F|0)==86|(F|0)==94|(F|0)==102|(F|0)==110|(F|0)==118|(F|0)==126){m=m+4|0;J=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;q=q&1}else if((F|0)==64|(F|0)==65|(F|0)==66|(F|0)==67|(F|0)==68|(F|0)==69|(F|0)==71|(F|0)==72|(F|0)==73|(F|0)==74|(F|0)==75|(F|0)==76|(F|0)==77|(F|0)==79|(F|0)==80|(F|0)==81|(F|0)==82|(F|0)==83|(F|0)==84|(F|0)==85|(F|0)==87|(F|0)==88|(F|0)==89|(F|0)==90|(F|0)==91|(F|0)==92|(F|0)==93|(F|0)==95|(F|0)==96|(F|0)==97|(F|0)==98|(F|0)==99|(F|0)==100|(F|0)==101|(F|0)==103|(F|0)==104|(F|0)==105|(F|0)==106|(F|0)==107|(F|0)==108|(F|0)==109|(F|0)==111|(F|0)==112|(F|0)==113|(F|0)==114|(F|0)==115|(F|0)==116|(F|0)==117|(F|0)==119|(F|0)==120|(F|0)==121|(F|0)==122|(F|0)==123|(F|0)==124|(F|0)==125|(F|0)==127){J=d[k+(u&7^1)|0]|0;q=q&1|J&40}else if((F|0)==134|(F|0)==142|(F|0)==150|(F|0)==158|(F|0)==166|(F|0)==174|(F|0)==182|(F|0)==190|(F|0)==198|(F|0)==206|(F|0)==214|(F|0)==222|(F|0)==230|(F|0)==238|(F|0)==246|(F|0)==254){m=m+7|0;G=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;w=1<<(u>>>3&7);G=G|w;if((u&64|0)==0){G=G^w}c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,G);continue L6120}else if((F|0)==192|(F|0)==193|(F|0)==194|(F|0)==195|(F|0)==196|(F|0)==197|(F|0)==199|(F|0)==200|(F|0)==201|(F|0)==202|(F|0)==203|(F|0)==204|(F|0)==205|(F|0)==207|(F|0)==208|(F|0)==209|(F|0)==210|(F|0)==211|(F|0)==212|(F|0)==213|(F|0)==215|(F|0)==216|(F|0)==217|(F|0)==218|(F|0)==219|(F|0)==220|(F|0)==221|(F|0)==223|(F|0)==224|(F|0)==225|(F|0)==226|(F|0)==227|(F|0)==228|(F|0)==229|(F|0)==231|(F|0)==232|(F|0)==233|(F|0)==234|(F|0)==235|(F|0)==236|(F|0)==237|(F|0)==239|(F|0)==240|(F|0)==241|(F|0)==242|(F|0)==243|(F|0)==244|(F|0)==245|(F|0)==247|(F|0)==248|(F|0)==249|(F|0)==250|(F|0)==251|(F|0)==252|(F|0)==253|(F|0)==255){G=k+(u&7^1)|0;a[G]=(d[G]|0|1<<(u>>>3&7))&255;continue L6120}else if((F|0)==6){m=m+7|0;u=e[k+4>>1]|0;v=5660;break}else if((F|0)==54){m=m+7|0;u=e[k+4>>1]|0;v=5669;break}else if((F|0)==0|(F|0)==1|(F|0)==2|(F|0)==3|(F|0)==4|(F|0)==5|(F|0)==7){G=k+(u^1)|0;w=d[G]|0;w=w<<1&255|w>>>7;q=d[l+w|0]|0|w&1;a[G]=w&255;continue L6120}else if((F|0)==22){m=m+7|0;u=e[k+4>>1]|0;v=5663;break}else if((F|0)==16|(F|0)==17|(F|0)==18|(F|0)==19|(F|0)==20|(F|0)==21|(F|0)==23){w=k-16+(u^1)|0;G=(d[w]|0)<<1|q&1;q=d[l+G|0]|0;a[w]=G&255;continue L6120}else if((F|0)==38){m=m+7|0;u=e[k+4>>1]|0;v=5666;break}else if((F|0)==32|(F|0)==33|(F|0)==34|(F|0)==35|(F|0)==36|(F|0)==37|(F|0)==39){F=k-32+(u^1)|0;G=(d[F]|0)<<1;q=d[l+G|0]|0;a[F]=G&255;continue L6120}else{v=5691;break L6120}G=J&1<<(u>>>3&7);q=q|(G&128|16|G-1>>8&68);continue L6120}else if((s|0)==208){if((q&1|0)!=0){m=m-6|0;continue L6120}else{v=5543;break}}else if((s|0)==195){g=jD(r)|0;continue L6120}else if((s|0)==233){g=e[k+4>>1]|0;continue L6120}else if((s|0)==160|(s|0)==161|(s|0)==162|(s|0)==163|(s|0)==164|(s|0)==165|(s|0)==167){u=d[k-160+(t^1)|0]|0;v=5622}else if((s|0)==182){u=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;v=5626}else if((s|0)==246){g=g+1|0;v=5626}else if((s|0)==176|(s|0)==177|(s|0)==178|(s|0)==179|(s|0)==180|(s|0)==181|(s|0)==183){u=d[k-176+(t^1)|0]|0;v=5626}else if((s|0)==220){if((q&1|0)!=0){v=5569;break}else{v=5461;break}}else if((s|0)==7){G=d[k+6|0]|0;G=G<<1|G>>>7;q=q&196|G&41;a[k+6|0]=G&255;continue L6120}else if((s|0)==15){G=d[k+6|0]|0;q=q&196|G&1;G=G<<7|G>>>1;q=q|G&40;a[k+6|0]=G&255;continue L6120}else if((s|0)==23){G=(d[k+6|0]|0)<<1|q&1;q=q&196|G&40|G>>>8;a[k+6|0]=G&255;continue L6120}else if((s|0)==31){G=q<<7|(d[k+6|0]|0)>>1;q=q&196|G&40|a[k+6|0]&1;a[k+6|0]=G&255;continue L6120}else if((s|0)==47){G=~(d[k+6|0]|0);q=q&197|G&40|18;a[k+6|0]=G&255;continue L6120}else if((s|0)==63){q=q&197^1|q<<4&16|a[k+6|0]&40;continue L6120}else if((s|0)==6|(s|0)==14|(s|0)==22|(s|0)==30|(s|0)==38){a[k+(t>>>3^1)|0]=u&255;g=g+1|0;continue L6120}else if((s|0)==54){g=g+1|0;c[j+76>>2]=m;nJ(l,e[k+4>>1]|0,u);continue L6120}else if((s|0)==70|(s|0)==78|(s|0)==86|(s|0)==94|(s|0)==102|(s|0)==110|(s|0)==126){a[k-8+(t>>>3^1)|0]=a[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;continue L6120}else if((s|0)==1|(s|0)==17|(s|0)==33){b[k+(t>>>3)>>1]=(jD(r)|0)&65535;g=g+2|0;continue L6120}else if((s|0)==49){n=jD(r)|0;g=g+2|0;continue L6120}else if((s|0)==218){if((q&1|0)!=0){g=jD(r)|0;continue L6120}else{v=5462;break}}else if((s|0)==244){if((q&128|0)!=0){v=5461;break}else{v=5569;break}}else if((s|0)==252){if((q&128|0)!=0){v=5569;break}else{v=5461;break}}else if((s|0)==205){v=5569}else{v=5837;break L6120}}while(0);L6430:do{if((v|0)==5460){v=0;m=m-5|0;continue L6120}else if((v|0)==5461){v=0;m=m-7|0;v=5462}else if((v|0)==5543){v=0;g=jD((c[j+(n>>>13<<2)>>2]|0)+(n&8191)|0)|0;n=n+2&65535;continue L6120}else if((v|0)==5573){v=0;u=g;g=t&56;v=5576}else if((v|0)==5758){v=0;g=g+1|0;s=d[(c[j+(g>>>13<<2)>>2]|0)+(g&8191)|0]|0;m=m+(a[27904+u|0]&15)|0;G=u;do{if((G|0)==150|(G|0)==134){q=q&-2;v=5760}else if((G|0)==158|(G|0)==142){v=5760}else if((G|0)==148|(G|0)==132){q=q&-2;v=5762}else if((G|0)==156|(G|0)==140){v=5762}else if((G|0)==149|(G|0)==133){q=q&-2;v=5764}else if((G|0)==157|(G|0)==141){v=5764}else if((G|0)==57){K=n;v=5768}else if((G|0)==41){K=H;v=5768}else if((G|0)==9|(G|0)==25){K=e[k-1+(u>>>3)>>1]|0;v=5768}else if((G|0)==166){g=g+1|0;u=d[(c[j+((H+((s&255)<<24>>24)&65535)>>13<<2)>>2]|0)+(H+((s&255)<<24>>24)&65535&8191)|0]|0;v=5622;break L6430}else if((G|0)==164){u=H>>>8;v=5622;break L6430}else if((G|0)==165){u=H&255;v=5622;break L6430}else if((G|0)==182){g=g+1|0;u=d[(c[j+((H+((s&255)<<24>>24)&65535)>>13<<2)>>2]|0)+(H+((s&255)<<24>>24)&65535&8191)|0]|0;v=5626;break L6430}else if((G|0)==180){u=H>>>8;v=5626;break L6430}else if((G|0)==181){u=H&255;v=5626;break L6430}else if((G|0)==174){g=g+1|0;u=d[(c[j+((H+((s&255)<<24>>24)&65535)>>13<<2)>>2]|0)+(H+((s&255)<<24>>24)&65535&8191)|0]|0;v=5630;break L6430}else if((G|0)==172){u=H>>>8;v=5630;break L6430}else if((G|0)==173){u=H&255;v=5630;break L6430}else if((G|0)==190){g=g+1|0;u=d[(c[j+((H+((s&255)<<24>>24)&65535)>>13<<2)>>2]|0)+(H+((s&255)<<24>>24)&65535&8191)|0]|0;v=5591;break L6430}else if((G|0)==188){u=H>>>8;v=5591;break L6430}else if((G|0)==189){u=H&255;v=5591;break L6430}else if((G|0)==112|(G|0)==113|(G|0)==114|(G|0)==115|(G|0)==116|(G|0)==117|(G|0)==119){u=d[k-112+(u^1)|0]|0;if(!0){v=5784;break}v=5783}else if((G|0)==54){v=5783}else if((G|0)==68|(G|0)==76|(G|0)==84|(G|0)==92|(G|0)==124){a[k-8+(u>>>3^1)|0]=H>>>8&255;continue L6120}else if((G|0)==100|(G|0)==109){continue L6120}else if((G|0)==69|(G|0)==77|(G|0)==85|(G|0)==93|(G|0)==125){a[k-8+(u>>>3^1)|0]=H&255;continue L6120}else if((G|0)==70|(G|0)==78|(G|0)==86|(G|0)==94|(G|0)==102|(G|0)==110|(G|0)==126){g=g+1|0;a[k-8+(u>>>3^1)|0]=a[(c[j+((H+((s&255)<<24>>24)&65535)>>13<<2)>>2]|0)+(H+((s&255)<<24>>24)&65535&8191)|0]|0;continue L6120}else if((G|0)==38){g=g+1|0;v=5792}else if((G|0)==101){s=H&255;v=5792}else if((G|0)==96|(G|0)==97|(G|0)==98|(G|0)==99|(G|0)==103){s=d[k-96+(u^1)|0]|0;v=5792}else if((G|0)==46){g=g+1|0;v=5796}else if((G|0)==108){s=H>>>8;v=5796}else if((G|0)==104|(G|0)==105|(G|0)==106|(G|0)==107|(G|0)==111){s=d[k-104+(u^1)|0]|0;v=5796}else if((G|0)==249){n=H;continue L6120}else if((G|0)==34){F=jD(r+1|0)|0;g=g+2|0;jE((c[j+36+(F>>>13<<2)>>2]|0)+(F&8191)|0,H);continue L6120}else if((G|0)==33){H=jD(r+1|0)|0;g=g+2|0}else if((G|0)==42){F=jD(r+1|0)|0;H=jD((c[j+(F>>>13<<2)>>2]|0)+(F&8191)|0)|0;g=g+2|0}else if((G|0)==203){u=H+((s&255)<<24>>24)&65535;g=g+1|0;s=d[(c[j+(g>>>13<<2)>>2]|0)+(g&8191)|0]|0;g=g+1|0;F=s;if((F|0)==6){v=5660;break L6430}else if((F|0)==22){v=5663;break L6430}else if((F|0)==38){v=5666;break L6430}else if((F|0)==54){v=5669;break L6430}else if((F|0)==14){v=5672;break L6430}else if((F|0)==30){v=5675;break L6430}else if((F|0)==46){v=5678;break L6430}else if((F|0)==62){v=5681;break L6430}else if((F|0)==70|(F|0)==78|(F|0)==86|(F|0)==94|(F|0)==102|(F|0)==110|(F|0)==118|(F|0)==126){w=(d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0)&1<<(s>>>3&7);q=q&1|16|w&128|w-1>>8&68;continue L6120}else if((F|0)==134|(F|0)==142|(F|0)==150|(F|0)==158|(F|0)==166|(F|0)==174|(F|0)==182|(F|0)==190|(F|0)==198|(F|0)==206|(F|0)==214|(F|0)==222|(F|0)==230|(F|0)==238|(F|0)==246|(F|0)==254){F=d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;w=1<<(s>>>3&7);F=F|w;if((s&64|0)==0){F=F^w}c[j+76>>2]=m;nJ(l,u,F);continue L6120}else{f=1;continue L6120}}else if((G|0)==35){H=H+1&65535}else if((G|0)==43){H=H-1&65535}else if((G|0)==52){H=H+((s&255)<<24>>24)&65535;g=g+1|0;u=(d[(c[j+(H>>>13<<2)>>2]|0)+(H&8191)|0]|0)+1|0;c[j+76>>2]=m;nJ(l,H,u);v=5607;break L6430}else if((G|0)==53){H=H+((s&255)<<24>>24)&65535;g=g+1|0;u=(d[(c[j+(H>>>13<<2)>>2]|0)+(H&8191)|0]|0)-1|0;c[j+76>>2]=m;nJ(l,H,u);v=5612;break L6430}else if((G|0)==36){H=H+256&65535;u=H>>>8;v=5824}else if((G|0)==44){u=H+1&255;H=H&65280|u;v=5824}else if((G|0)==37){H=H-256&65535;u=H>>>8;v=5829}else if((G|0)==45){u=H-1&255;H=H&65280|u;v=5829}else if((G|0)==229){u=H;v=5576;break L6430}else if((G|0)==225){H=jD((c[j+(n>>>13<<2)>>2]|0)+(n&8191)|0)|0;n=n+2&65535}else if((G|0)==233){g=H;continue L6120}else if((G|0)==227){F=jD((c[j+(n>>>13<<2)>>2]|0)+(n&8191)|0)|0;jE((c[j+36+(n>>>13<<2)>>2]|0)+(n&8191)|0,H);H=F}else{f=1;g=g-1|0;continue L6120}}while(0);if((v|0)==5760){v=0;g=g+1|0;t=u;u=d[(c[j+((H+((s&255)<<24>>24)&65535)>>13<<2)>>2]|0)+(H+((s&255)<<24>>24)&65535&8191)|0]|0;v=5585;break}else if((v|0)==5762){v=0;t=u;u=H>>>8;v=5585;break}else if((v|0)==5764){v=0;t=u;u=H&255;v=5585;break}else if((v|0)==5768){v=0;G=H+K|0;K=K^H;H=G&65535;q=q&196|G>>>16|G>>>8&40|(K^G)>>>8&16}else if((v|0)==5783){v=0;g=g+1|0;u=d[(c[j+(g>>>13<<2)>>2]|0)+(g&8191)|0]|0;v=5784}else if((v|0)==5792){v=0;H=H&255|s<<8}else if((v|0)==5796){v=0;H=H&65280|s}else if((v|0)==5824){v=0;if((t|0)==221){o=H;v=5607;break}else{p=H;v=5607;break}}else if((v|0)==5829){v=0;if((t|0)==221){o=H;v=5612;break}else{p=H;v=5612;break}}if((v|0)==5784){v=0;g=g+1|0;c[j+76>>2]=m;nJ(l,H+((s&255)<<24>>24)&65535,u);continue L6120}if((t|0)==221){o=H;continue L6120}else{p=H;continue L6120}}else if((v|0)==5596){v=0;G=(e[k+4>>1]|0)+u|0;u=u^(e[k+4>>1]|0);b[k+4>>1]=G&65535;q=q&196|G>>>16|G>>>8&40|(u^G)>>>8&16;continue L6120}else if((v|0)==5580){v=0;u=d[(c[j+((e[k+4>>1]|0)>>13<<2)>>2]|0)+(b[k+4>>1]&8191)|0]|0;v=5585}else if((v|0)==5582){v=0;g=g+1|0;v=5585}else if((v|0)==5584){v=0;u=d[k+(t&7^1)|0]|0;v=5585}else if((v|0)==5569){v=0;G=g+2|0;g=jD(r)|0;n=n-2&65535;jE((c[j+36+(n>>>13<<2)>>2]|0)+(n&8191)|0,G);continue L6120}}while(0);if((v|0)==5462){v=0;g=g+2|0;continue}else if((v|0)==5591){v=0;r=(d[k+6|0]|0)-u|0;q=2|u&40|r>>8&1;u=u^(d[k+6|0]|0);q=q|(((r^(d[k+6|0]|0))&u)>>>5&4|(u&16^r)&144);if((r&255)<<24>>24!=0){continue}else{q=q|64;continue}}else if((v|0)==5576){v=0;n=n-2&65535;jE((c[j+36+(n>>>13<<2)>>2]|0)+(n&8191)|0,u);continue}else if((v|0)==5669){v=0;r=(d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0)<<1|1;q=d[l+r|0]|0;c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5672){v=0;r=d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;q=r&1;r=r<<7&255|r>>>1;q=q|(d[l+r|0]|0);c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5612){v=0;q=q&1|2|(u&15)+1&16|(d[l+(u&255)|0]|0)&-5;if((u|0)!=127){continue}else{q=q|4;continue}}else if((v|0)==5630){v=0;r=k+6|0;a[r]=((d[r]|0)^u)&255;q=d[l+(d[k+6|0]|0)|0]|0;continue}else if((v|0)==5607){v=0;q=q&1|(u&15)-1&16|(d[l+(u&255)|0]|0)&-5;if((u|0)!=128){continue}else{q=q|4;continue}}else if((v|0)==5585){v=0;r=u+(q&1)|0;u=u^(d[k+6|0]|0);q=t>>>3&2;if((q|0)!=0){r=-r|0}r=r+(d[k+6|0]|0)|0;u=u^r;q=q|(u&16|(u+128|0)>>>6&4|(d[l+(r&511)|0]|0)&-5);a[k+6|0]=r&255;continue}else if((v|0)==5675){v=0;r=d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;G=r&1;r=q<<7&255|r>>>1;q=d[l+r|0]|0|G;c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5678){v=0;r=d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;q=r&1;r=r&128|r>>>1;q=q|(d[l+r|0]|0);c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5681){v=0;r=d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;q=r&1;r=r>>>1;q=q|(d[l+r|0]|0);c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5660){v=0;r=d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0;r=r<<1&255|r>>>7;q=d[l+r|0]|0|r&1;c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5663){v=0;r=(d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0)<<1|q&1;q=d[l+r|0]|0;c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5666){v=0;r=(d[(c[j+(u>>>13<<2)>>2]|0)+(u&8191)|0]|0)<<1;q=d[l+r|0]|0;c[j+76>>2]=m;nJ(l,u,r);continue}else if((v|0)==5622){v=0;r=k+6|0;a[r]=(d[r]|0)&u&255;q=d[l+(d[k+6|0]|0)|0]|0|16;continue}else if((v|0)==5626){v=0;r=k+6|0;a[r]=(d[r]|0|u)&255;q=d[l+(d[k+6|0]|0)|0]|0;continue}}if((v|0)==5469){m=m-u|0;L=g;M=L-1|0;g=M;N=m;O=j+76|0;c[O>>2]=N;P=q;Q=P&255;R=k;S=R+7|0;a[S]=Q;T=o;U=T&65535;V=l+600|0;W=V+4|0;b[W>>1]=U;X=p;Y=X&65535;Z=l+600|0;_=Z+6|0;b[_>>1]=Y;$=n;aa=$&65535;ab=l+600|0;ac=ab+2|0;b[ac>>1]=aa;ad=g;ae=ad&65535;af=l+600|0;ag=af|0;b[ag>>1]=ae;ah=l+600|0;ai=ah+8|0;aj=ai;ak=k;al=aj;am=ak;wh(al|0,am|0,8)|0;an=l+520|0;ao=an;ap=j;wh(ao|0,ap|0,80)|0;aq=l+520|0;ar=l+516|0;c[ar>>2]=aq;as=f;at=as&1;i=h;return at|0}else if((v|0)==5837){a5(4144,1686,13712,4696);return 0}else if((v|0)==5571){m=m-11|0;L=g;M=L-1|0;g=M;N=m;O=j+76|0;c[O>>2]=N;P=q;Q=P&255;R=k;S=R+7|0;a[S]=Q;T=o;U=T&65535;V=l+600|0;W=V+4|0;b[W>>1]=U;X=p;Y=X&65535;Z=l+600|0;_=Z+6|0;b[_>>1]=Y;$=n;aa=$&65535;ab=l+600|0;ac=ab+2|0;b[ac>>1]=aa;ad=g;ae=ad&65535;af=l+600|0;ag=af|0;b[ag>>1]=ae;ah=l+600|0;ai=ah+8|0;aj=ai;ak=k;al=aj;am=ak;wh(al|0,am|0,8)|0;an=l+520|0;ao=an;ap=j;wh(ao|0,ap|0,80)|0;aq=l+520|0;ar=l+516|0;c[ar>>2]=aq;as=f;at=as&1;i=h;return at|0}else if((v|0)==5691){a5(4144,1059,13712,4696);return 0}else if((v|0)==5657){m=m&3;L=g;M=L-1|0;g=M;N=m;O=j+76|0;c[O>>2]=N;P=q;Q=P&255;R=k;S=R+7|0;a[S]=Q;T=o;U=T&65535;V=l+600|0;W=V+4|0;b[W>>1]=U;X=p;Y=X&65535;Z=l+600|0;_=Z+6|0;b[_>>1]=Y;$=n;aa=$&65535;ab=l+600|0;ac=ab+2|0;b[ac>>1]=aa;ad=g;ae=ad&65535;af=l+600|0;ag=af|0;b[ag>>1]=ae;ah=l+600|0;ai=ah+8|0;aj=ai;ak=k;al=aj;am=ak;wh(al|0,am|0,8)|0;an=l+520|0;ao=an;ap=j;wh(ao|0,ap|0,80)|0;aq=l+520|0;ar=l+516|0;c[ar>>2]=aq;as=f;at=as&1;i=h;return at|0}return 0}function ng(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function nh(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=(c[(c[b+516>>2]|0)+72>>2]|0)-d|0;c[(c[b+516>>2]|0)+72>>2]=d;d=(c[b+516>>2]|0)+76|0;c[d>>2]=(c[d>>2]|0)+a;return}function ni(b,d){b=b|0;d=+d;var e=0;e=b;c[e+1036>>2]=~~(+(((a[e+1007|0]&64|0)!=0?71590:59659)|0)/d);return}function nj(a){a=a|0;nV(a);return}function nk(a){a=a|0;var b=0;b=a;a=c[b+68920>>2]|0;if((a|0)!=0){i8(a);vQ(a)}c[b+68920>>2]=0;hJ(b);return}function nl(a,b,c){a=a|0;b=b|0;c=c|0;nm(a+992|0,b);return 0}function nm(b,c){b=b|0;c=c|0;var d=0;d=b;b=c;c=5576;if((a[d+15|0]&2|0)!=0){c=5312;if((a[d+15|0]&4|0)!=0){c=5216}}gn(b+16|0,c);return}function nn(b){b=b|0;var d=0,e=0.0;d=b;e=+jJ(d)*1.4;if(a[d+1024|0]&1){e=e*1.5}iq(d+66840|0,e);no(d+68128|0,e);if((c[d+68920>>2]|0)==0){return}jg(c[d+68920>>2]|0,e);return}function no(a,b){a=a|0;b=+b;ji(a+232|0,262451171875.0e-17*b);return}function np(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0;f=b;wg(f+992|0,0,32);b=mC(f+968|0,e,16,f+992|0,0)|0;if((b|0)!=0){g=b;h=g;return h|0}b=nq(f+992|0)|0;if((b|0)!=0){g=b;h=g;return h|0}if((d[f+995|0]|0)==67){if((a[f+1006|0]|0)!=0){a[f+1006|0]=0;gA(f,936)}if((d[f+1007|0]&-16|0)!=0){b=f+1007|0;a[b]=d[b]&15;gA(f,936)}}else{b=f+1008|0;e=mA(f+968|0)|0;i=ng(16,d[f+1006|0]|0)|0;wh(b|0,e|0,i)|0;if((d[f+1006|0]|0)>16){gA(f,936)}}if((a[f+1007|0]&9|0)!=0){gA(f,672)}c[f+1028>>2]=49152;if((a[f+1007|0]&4|0)!=0){c[f+1028>>2]=0}do{if((a[f+1007|0]&2|0)!=0){if((c[f+68920>>2]|0)!=0){break}i=vI(1600)|0;jd(i);c[f+68920>>2]=i;if((i|0)==0){g=10496;h=g;return h|0}else{break}}}while(0);jI(f,8);g=c5(f,3579545)|0;h=g;return h|0}function nq(a){a=a|0;var b=0,d=0,e=0;b=a;do{if((wk(b|0,6248,4)|0)!=0){if((wk(b|0,5968,4)|0)==0){break}d=c[74]|0;e=d;return e|0}}while(0);d=0;e=d;return e|0}function nr(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;jR(b+66840|0,d);ns(b+68128|0,d);if((c[b+68920>>2]|0)==0){return}jj(c[b+68920>>2]|0,d);return}function ns(a,b){a=a|0;b=b|0;jl(a+232|0,b);return}function nt(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0;g=b;b=d;d=a;a=g-3|0;if((a|0)>=0){nx(d+68128|0,a,b)}else{iH(d+66840|0,g,b)}if((c[d+68920>>2]|0)==0){return}if((g|0)>=4){return}jp(c[d+68920>>2]|0,g,b,e,f);return}function nu(a){a=a|0;var b=0;b=a;m4(b+336|0);cJ(b);c[b>>2]=20808;mu(b+968|0);im(b+66840|0);nj(b+68128|0);c[b+68920>>2]=0;jF(b,c[88]|0);jH(b,6);hu(b,17680);jG(b,17648);wg(b+68924|0,-1|0,256);return}function nv(a){a=a|0;var b=0;b=a;nw(b);cK(b);return}function nw(a){a=a|0;var b=0;b=a;c[b>>2]=20808;bQ[c[(c[b>>2]|0)+8>>2]&511](b);mv(b+968|0);cP(b);return}function nx(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=5){a5(7896,66,13176,6488)}c[a+(e<<4)+12>>2]=d;return}function ny(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function nz(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function nA(a){a=a|0;return 16384>>((d[a+1005|0]|0)>>7&1)|0}function nB(a){a=a|0;var b=0;b=a;return(c[(c[b+516>>2]|0)+76>>2]|0)+(c[(c[b+516>>2]|0)+72>>2]|0)|0}function nC(a,b){a=a|0;b=b|0;var d=0;d=b;return(c[(c[a+516>>2]|0)+36+(d>>>13<<2)>>2]|0)+(d&8191)|0}function nD(a,b){a=a|0;b=b|0;var d=0;d=a;c[(c[d+516>>2]|0)+76>>2]=b-(c[(c[d+516>>2]|0)+72>>2]|0);return}function nE(a,b){a=a|0;b=b|0;var d=0;d=(c[a+516>>2]|0)+76|0;c[d>>2]=(c[d>>2]|0)+b;return}function nF(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;g=f;f=e;e=c6(f,g)|0;if((e|0)!=0){h=e;i=h;return i|0}wg(f+1048|0,-55|0,16384);wg(f+17432|0,0,49408);e=f+1049|0;wh(e|0,17720,13)|0;e=f+1195|0;a[e]=a[17712]|0;a[e+1|0]=a[17713|0]|0;a[e+2|0]=a[17714|0]|0;a[e+3|0]=a[17715|0]|0;a[e+4|0]=a[17716|0]|0;a[e+5|0]=a[17717|0]|0;e=jD(f+996|0)|0;j=jD(f+998|0)|0;k=nz(j,mp(f+968|0)|0)|0;k=nz(k,65536-e|0)|0;if((k|0)!=(j|0)){gA(f,10168)}j=f+1048+e|0;e=mA(f+968|0)|0;l=e+(d[f+1006|0]|0)|0;e=k;wh(j|0,l|0,e)|0;mE(f+968|0,(-k|0)-(d[f+1006|0]|0)|0);e=nA(f)|0;l=((mp(f+968|0)|0)-k+e-1|0)/(e|0)|0;c[f+1032>>2]=a[f+1005|0]&127;if((c[f+1032>>2]|0)>(l|0)){c[f+1032>>2]=l;gA(f,9688)}a[f+66583|0]=-1;nc(f+336|0,f+69180|0,f+68924|0);ne(f+336|0,0,65536,f+1048|0,f+1048|0);ir(f+66840|0);nG(f+68128|0);if((c[f+68920>>2]|0)!=0){jh(c[f+68920>>2]|0,0,0)}b[f+938>>1]=-3200;l=f+938|0;e=(b[l>>1]|0)-1&65535;b[l>>1]=e;a[f+1048+(e&65535)|0]=-1;e=f+938|0;l=(b[e>>1]|0)-1&65535;b[e>>1]=l;a[f+1048+(l&65535)|0]=-1;a[f+950|0]=g&255;b[f+936>>1]=(jD(f+1e3|0)|0)&65535;c[f+1040>>2]=c[f+1036>>2];a[f+1024|0]=0;a[f+1025|0]=0;nn(f);c[f+1044>>2]=0;h=0;i=h;return i|0}function nG(a){a=a|0;var b=0;b=a;c[b+80>>2]=0;a=0;while(1){if((a|0)>=5){break}wg(b+(a<<4)|0,0,12);a=a+1|0}wg(b+84|0,0,144);return}function nH(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0;f=e;e=a;a=nA(e)|0;g=32768;do{if((b|0)!=0){if((a|0)!=8192){break}g=40960}}while(0);f=f-(d[e+1004|0]|0)|0;if(f>>>0>=(c[e+1032>>2]|0)>>>0){b=e+1048+g|0;ne(e+336|0,g,a,b,b);return}b=aq(f,a)|0;f=0;while(1){if(f>>>0>=a>>>0){break}ne(e+336|0,g+f|0,8192,e+69180|0,ms(e+968|0,b+f|0)|0);f=f+8192|0}return}function nI(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;e=c;c=d;d=b;c=c&255;b=e;if((b|0)==36864){nH(d,0,c);return}else if((b|0)==45056){nH(d,1,c);return}else{b=e&57343^38912;if((b|0)>=144){return}a[d+1024|0]=1;nM(d+68128|0,nB(d+336|0)|0,b,c);return}}function nJ(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b;b=d;d=e;a[nC(f,b)|0]=d&255;if((b&c[f-336+1028>>2]|0)!=32768){return}nI(f-336|0,b,d);return}function nK(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;g=d;d=f;d=d&255;f=b-336|0;b=e&255;do{if((b|0)==254){nH(f,0,d);return}else if((b|0)==161){j3(f+66840|0,g,c[f+1044>>2]|0,d);return}else if((b|0)==160){c[f+1044>>2]=d&15;return}else if((b|0)==126|(b|0)==127){if((c[f+68920>>2]|0)!=0){jz(c[f+68920>>2]|0,g,d);return}else{return}}else if((b|0)==241){if((d|0)==0){break}return}else if((b|0)==6){do{if((c[f+68920>>2]|0)!=0){if((a[f+1007|0]&4|0)==0){break}js(c[f+68920>>2]|0,g,d);return}}while(0);return}else if(!((b|0)==240|(b|0)==168)){return}}while(0);return}function nL(d,f,g){d=d|0;f=f|0;g=g|0;var h=0;g=f;f=d;while(1){d=nB(f+336|0)|0;if((d|0)>=(c[g>>2]|0)){break}d=ng(c[g>>2]|0,c[f+1040>>2]|0)|0;nf(f+336|0,ng(c[g>>2]|0,c[f+1040>>2]|0)|0)|0;if((e[f+936>>1]|0|0)==65535){nD(f+336|0,d)}d=nB(f+336|0)|0;if((d|0)>=(c[f+1040>>2]|0)){d=f+1040|0;c[d>>2]=(c[d>>2]|0)+(c[f+1036>>2]|0);if((e[f+936>>1]|0|0)==65535){if(!(a[f+1025|0]&1)){a[f+1025|0]=1;if(a[f+1024|0]&1){nn(f)}}d=f+938|0;h=(b[d>>1]|0)-1&65535;b[d>>1]=h;a[f+1048+(h&65535)|0]=-1;h=f+938|0;d=(b[h>>1]|0)-1&65535;b[h>>1]=d;a[f+1048+(d&65535)|0]=-1;b[f+936>>1]=(jD(f+1002|0)|0)&65535}}}c[g>>2]=nB(f+336|0)|0;d=f+1040|0;c[d>>2]=(c[d>>2]|0)-(c[g>>2]|0);nE(f+336|0,-(c[g>>2]|0)|0);kb(f+66840|0,c[g>>2]|0);nN(f+68128|0,c[g>>2]|0);if((c[f+68920>>2]|0)==0){return 0}jr(c[f+68920>>2]|0,c[g>>2]|0);return 0}function nM(b,c,d,e){b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=d;d=b;if(f>>>0>=144){a5(7896,72,13128,7056)}nW(d,c);a[d+84+f|0]=e&255;return}function nN(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+80>>2]|0)){nW(b,d)}a=b+80|0;c[a>>2]=(c[a>>2]|0)-d;if((c[b+80>>2]|0)>=0){return}else{a5(7896,82,13088,7648);return}}function nO(){return+.75}function nP(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=0;while(1){if((a|0)>=5){break}c[b+(a<<4)+12>>2]=d;a=a+1|0}return}function nQ(a){a=a|0;n7(a);return}function nR(a){a=a|0;nU(a);return}function nS(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=a;a=b;b=bS[c[(c[a>>2]|0)+12>>2]&255](a,d+316|0,16)|0;if((b|0)==0){e=nq(d+316|0)|0;f=e;return f|0}if((b|0)==26104){g=c[74]|0}else{g=b}e=g;f=e;return f|0}function nT(a,b,c){a=a|0;b=b|0;c=c|0;nm(a+316|0,b);return 0}function nU(a){a=a|0;ik(a);return}function nV(a){a=a|0;var b=0;b=a;jv(b+232|0);nP(b,0);return}function nW(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=e;e=b;b=0;while(1){if((b|0)>=5){break}g=e+(b<<4)|0;h=c[g+12>>2]|0;if((h|0)!=0){iv(h);i=((a[e+84+((b<<1)+129)|0]&15)<<8)+(d[e+84+((b<<1)+128)|0]|0)+1|0;j=0;if((d[e+227|0]&1<<b|0)!=0){if((i|0)>((((iw(h)|0)+524288|0)>>>0)/262144|0|0)){j=(a[e+84+(b+138)|0]&15)<<3}}k=e+84+(b<<5)|0;if((b|0)==4){k=k-32|0}l=aq(a[k+(c[g+4>>2]|0)|0]|0,j)|0;m=l-(c[g+8>>2]|0)|0;if((m|0)!=0){c[g+8>>2]=l;jb(e+232|0,c[e+80>>2]|0,m,h)}m=(c[e+80>>2]|0)+(c[g>>2]|0)|0;if((m|0)<(f|0)){if((j|0)!=0){l=c[g+4>>2]|0;n=a[k+l|0]|0;l=l+1&31;do{o=a[k+l|0]|0;l=l+1&31;p=o-n|0;if((p|0)!=0){n=o;jb(e+232|0,m,aq(p,j)|0,h)}m=m+i|0;}while((m|0)<(f|0));h=l-1&31;l=h;c[g+4>>2]=h;c[g+8>>2]=aq(a[k+l|0]|0,j)|0}else{h=(f-m+i-1|0)/(i|0)|0;c[g+4>>2]=(c[g+4>>2]|0)+h&31;m=m+(aq(h,i)|0)|0}}c[g>>2]=m-f}b=b+1|0}c[e+80>>2]=f;return}function nX(a){a=a|0;var b=0;b=a;nY(b+20|0,b+1992|0);nY(b+64|0,b+1992|0);nZ(b+112|0);n_(b+712|0);n$(b+1304|0);io(b+1992|0);h[b+1936>>3]=1.0;c[b+1372>>2]=b;c[b+1364>>2]=0;c[b+1984>>2]=0;c[b>>2]=b+20;c[b+4>>2]=b+64;c[b+8>>2]=b+712;c[b+12>>2]=b+112;c[b+16>>2]=b+1304;n0(b,0);n1(b,1.0);n2(b,0,0);return}function nY(a,b){a=a|0;b=b|0;oo(a,b);return}function nZ(a){a=a|0;ov(a);return}function n_(a){a=a|0;ou(a);return}function n$(a){a=a|0;ot(a);return}function n0(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;a=0;while(1){if((a|0)>=5){break}n9(b,a,c);a=a+1|0}return}function n1(b,c){b=b|0;c=+c;var d=0.0,e=0;d=c;e=b;a[e+1363|0]=0;iE(e+1992|0,.00752*d);ji(e+744|0,.00851*d);ji(e+152|0,.00494*d);ji(e+1376|0,.00335*d);return}function n2(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=e;e=b;a[e+1362|0]=d&1&1;oa(e,+h[e+1936>>3]);ob(e+20|0);ob(e+64|0);oc(e+712|0);od(e+112|0);o9(e+1304|0);c[e+1944>>2]=0;c[e+1948>>2]=0;c[e+1972>>2]=0;a[e+1980|0]=0;c[e+1952>>2]=1073741824;c[e+1964>>2]=1;oi(e,0,16407,0);oi(e,0,16405,0);d=16384;while(1){if(d>>>0>16403){break}oi(e,0,d,(d&3|0)!=0?0:16);d=d+1|0}c[e+1352>>2]=f;if(!(a[e+1363|0]&1)){c[e+732>>2]=15}if(a[e+1363|0]&1){return}c[e+1324>>2]=f;return}function n3(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;jk(b+1992|0,c);jl(b+744|0,c);jl(b+152|0,c);jl(b+1376|0,c);return}function n4(b,d){b=b|0;d=+d;var e=0;e=b;a[e+1363|0]=1;iE(e+1992|0,.007514724138480537*d);d=+nO()*.002376237623762376;ji(e+744|0,3.0*d);ji(e+152|0,2.0*d);ji(e+1376|0,d);c[e+40>>2]=0;c[e+84>>2]=0;c[e+732>>2]=0;c[e+132>>2]=0;c[e+1324>>2]=0;return}function n5(){var a=0,b=0,c=0;a=j6(77376)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;nu(b);c=b}return c|0}function n6(){var a=0,b=0,c=0;a=j6(336)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;nQ(b);c=b}return c|0}function n7(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=19976;jF(b,c[88]|0);return}function n8(a){a=a|0;var b=0;b=a;nR(b);cK(b);return}function n9(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=5){a5(568,143,13592,10464)}c[(c[a+(e<<2)>>2]|0)+8>>2]=d;return}function oa(b,d){b=b|0;d=+d;var e=0.0,f=0;e=d;f=b;h[f+1936>>3]=e;c[f+1960>>2]=a[f+1362|0]&1?8314:7458;if(e==1.0){return}c[f+1960>>2]=~~(+(c[f+1960>>2]|0)/e)&-2;return}function ob(a){a=a|0;var b=0;b=a;c[b+36>>2]=0;os(b);return}function oc(a){a=a|0;var b=0;b=a;c[b+28>>2]=0;c[b+24>>2]=1;on(b);return}function od(a){a=a|0;var b=0;b=a;c[b+32>>2]=16384;os(b);return}function oe(b){b=b|0;var d=0;d=b;b=c[d+1356>>2]|0;if((a[d+1361|0]&1|a[d+1980|0]&1|0)!=0){b=0}else{if((b|0)>(c[d+1956>>2]|0)){b=c[d+1956>>2]|0}}if((b|0)==(c[d+1952>>2]|0)){return}c[d+1952>>2]=b;if((c[d+1984>>2]|0)!=0){bQ[c[d+1984>>2]&511](c[d+1988>>2]|0)}return}function of(a){a=a|0;return om(a+1304|0)|0}function og(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;a=c[d+8>>2]|0;e=c[d+20>>2]|0;c[d+20>>2]=0;if((a|0)==0){return}if((e|0)==0){return}ix(c[d+40>>2]|0,b,-e|0,a);return}function oh(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;a=c[d+8>>2]|0;e=c[d+20>>2]|0;c[d+20>>2]=0;if((a|0)==0){return}if((e|0)==0){return}jb(d+32|0,b,-e|0,a);return}function oi(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0;h=e;e=f;f=g;g=b;if(e>>>0<=32){a5(3800,285,13488,2784)}if(f>>>0>255){a5(3800,286,13488,2064)}if((e-16384|0)>>>0>23){return}ok(g,h);if(e>>>0<16404){b=(e-16384|0)>>>2;i=c[g+(b<<2)>>2]|0;j=e&3;a[i+j|0]=f&255;a[i+4+j|0]=1;if((b|0)==4){pc(g+1304|0,j,f)}else{if((j|0)==3){if((c[g+1972>>2]>>b&1|0)!=0){c[i+12>>2]=d[27720+(f>>3&31)|0]|0}if((b|0)<2){c[i+32>>2]=7}}}return}if((e|0)==16405){i=5;while(1){b=i;i=b-1|0;if((b|0)==0){break}if((f>>i&1|0)==0){c[(c[g+(i<<2)>>2]|0)+12>>2]=0}}i=a[g+1361|0]&1;a[g+1361|0]=0;b=c[g+1972>>2]|0;c[g+1972>>2]=f;if((f&16|0)!=0){if((b&16|0)==0){pd(g+1304|0)}}else{c[g+1356>>2]=1073741824;i=1}if(i&1){oe(g)}}else{if((e|0)==16407){c[g+1976>>2]=f;e=((f&64|0)!=0^1)&1;i=g+1980|0;a[i]=(a[i]&1&(e&1)|0)!=0|0;c[g+1956>>2]=1073741824;c[g+1964>>2]=c[g+1964>>2]&1;c[g+1968>>2]=0;if((f&128|0)==0){c[g+1968>>2]=1;f=g+1964|0;c[f>>2]=(c[f>>2]|0)+(c[g+1960>>2]|0);if(e&1){c[g+1956>>2]=h+(c[g+1964>>2]|0)+((c[g+1960>>2]|0)*3|0)+1}}oe(g)}}return}function oj(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)<(c[b+1948>>2]|0)){a5(3800,139,13408,9072)}if((d|0)<=(of(b)|0)){return}a=c[b+1948>>2]|0;c[b+1948>>2]=d;pg(b+1304|0,a,d);return}function ok(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=d;d=b;if((e|0)<(c[d+1944>>2]|0)){a5(3800,150,13552,6264)}if((e|0)==(c[d+1944>>2]|0)){return}if((c[d+1948>>2]|0)<(e|0)){b=c[d+1948>>2]|0;c[d+1948>>2]=e;pg(d+1304|0,b,e)}while(1){b=(c[d+1944>>2]|0)+(c[d+1964>>2]|0)|0;if((b|0)>(e|0)){b=e}f=d+1964|0;c[f>>2]=(c[f>>2]|0)-(b-(c[d+1944>>2]|0));o2(d+20|0,c[d+1944>>2]|0,b);o2(d+64|0,c[d+1944>>2]|0,b);o8(d+712|0,c[d+1944>>2]|0,b);ph(d+112|0,c[d+1944>>2]|0,b);c[d+1944>>2]=b;if((b|0)==(e|0)){break}c[d+1964>>2]=c[d+1960>>2];f=d+1968|0;g=c[f>>2]|0;c[f>>2]=g+1;if((g|0)==2){h=6288}else if((g|0)==0){if((c[d+1976>>2]&192|0)==0){c[d+1956>>2]=b+(c[d+1960>>2]<<2)+2;a[d+1980|0]=1}h=6288}else if((g|0)==1){if(!(a[d+1362|0]&1)){b=d+1964|0;c[b>>2]=(c[b>>2]|0)-2}}else if((g|0)==3){c[d+1968>>2]=0;if((c[d+1976>>2]&128|0)!=0){g=d+1964|0;c[g>>2]=(c[g>>2]|0)+((c[d+1960>>2]|0)-(a[d+1362|0]&1?2:6))}}if((h|0)==6288){h=0;oV(d+20|0,32);oV(d+64|0,32);oV(d+112|0,32);oV(d+712|0,128);o1(d+20|0,-1);o1(d+64|0,0);do{if(a[d+1362|0]&1){if((c[d+1968>>2]|0)!=3){break}g=d+1964|0;c[g>>2]=(c[g>>2]|0)-2}}while(0)}o4(d+712|0);oW(d+20|0);oW(d+64|0);oW(d+112|0)}return}function ol(b,d){b=b|0;d=d|0;var e=0;e=d;d=b;if((e|0)>(c[d+1944>>2]|0)){ok(d,e)}if(a[d+1363|0]&1){og(d+20|0,c[d+1944>>2]|0);og(d+64|0,c[d+1944>>2]|0);oh(d+712|0,c[d+1944>>2]|0);op(d+112|0,c[d+1944>>2]|0);oq(d+1304|0,c[d+1944>>2]|0)}b=d+1944|0;c[b>>2]=(c[b>>2]|0)-e;if((c[d+1944>>2]|0)<0){a5(3800,254,13448,4672)}b=d+1948|0;c[b>>2]=(c[b>>2]|0)-e;if((c[d+1948>>2]|0)<0){a5(3800,257,13448,3712)}if((c[d+1956>>2]|0)!=1073741824){b=d+1956|0;c[b>>2]=(c[b>>2]|0)-e}if((c[d+1356>>2]|0)!=1073741824){b=d+1356|0;c[b>>2]=(c[b>>2]|0)-e}if((c[d+1952>>2]|0)==1073741824){return}b=d+1952|0;c[b>>2]=(c[b>>2]|0)-e;if((c[d+1952>>2]|0)<0){c[d+1952>>2]=0}return}function om(a){a=a|0;var b=0,d=0,e=0;b=a;if((c[b+12>>2]|0)==0){d=1073741824;e=d;return e|0}else{a=(c[(c[b+68>>2]|0)+1948>>2]|0)+(c[b+16>>2]|0)|0;d=a+(aq((c[b+36>>2]|0)-1|0,c[b+28>>2]|0)|0)|0;e=d;return e|0}return 0}function on(a){a=a|0;var b=0;b=a;c[b+16>>2]=0;c[b+20>>2]=0;return}function oo(a,b){a=a|0;b=b|0;c[a+40>>2]=b;return}function op(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;a=c[d+8>>2]|0;e=c[d+20>>2]|0;c[d+20>>2]=0;if((a|0)==0){return}if((e|0)==0){return}jb(d+40|0,b,-e|0,a);return}function oq(a,b){a=a|0;b=b|0;var d=0,e=0;d=a;a=c[d+8>>2]|0;e=c[d+20>>2]|0;c[d+20>>2]=0;if((a|0)==0){return}if((e|0)==0){return}jb(d+72|0,b,-e|0,a);return}function or(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=d;d=b;ok(d,e-1|0);b=(a[d+1361|0]&1)<<7|(a[d+1980|0]&1)<<6;f=0;while(1){if((f|0)>=5){break}if((c[(c[d+(f<<2)>>2]|0)+12>>2]|0)!=0){b=b|1<<f}f=f+1|0}ok(d,e);if(!(a[d+1980|0]&1)){g=b;return g|0}b=b|64;a[d+1980|0]=0;oe(d);g=b;return g|0}function os(a){a=a|0;var b=0;b=a;c[b+24>>2]=0;c[b+28>>2]=0;on(b);return}function ot(a){a=a|0;jv(a+72|0);return}function ou(a){a=a|0;jv(a+32|0);return}function ov(a){a=a|0;jv(a+40|0);return}function ow(a,b){a=a|0;b=b|0;var d=0;d=b;return(c[(c[a+2056>>2]|0)+(d>>>11<<2)>>2]|0)+((d>>>0)%2048|0)|0}function ox(a){a=a|0;var b=0;b=a;return(c[(c[b+2056>>2]|0)+136>>2]|0)+(c[(c[b+2056>>2]|0)+132>>2]|0)|0}function oy(a,b){a=a|0;b=b|0;return b&c[a+16>>2]|0}function oz(a){a=a|0;return c[a+20>>2]|0}function oA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;c[(c[a+2056>>2]|0)+(e<<2)>>2]=d+(-(e<<11&2047)|0);return}function oB(a,b){a=a|0;b=b|0;var e=0,f=0,g=0;e=b;b=a;a=d[b+336+(e&2047)|0]|0;do{if((e&57344|0)!=0){a=d[ow(b+336|0,e)|0]|0;if(e>>>0>32767){break}a=d[b+5576+(e&8191)|0]|0;if(e>>>0>24575){break}if((e|0)==16405){f=or(b+2640|0,ox(b+336|0)|0)|0;g=f;return g|0}do{if((e|0)==18432){if((c[b+2628>>2]|0)==0){break}f=oC(c[b+2628>>2]|0)|0;g=f;return g|0}}while(0);a=e>>>8;}}while(0);f=a;g=f;return g|0}function oC(a){a=a|0;return d[oJ(a)|0]|0|0}function oD(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;e=c;c=d;d=b;b=e^24576;if(b>>>0<8192){a[d+5576+b|0]=c&255;return}if((e&57344|0)==0){a[d+336+(e&2047)|0]=c&255;return}if((e-16384|0)>>>0<=23){oi(d+2640|0,ox(d+336|0)|0,e,c);return}b=e-24568|0;if(b>>>0>=8){p7(d,e,c);return}e=oy(d+2604|0,c<<12)|0;if((e|0)>=(oz(d+2604|0)|0)){gA(d,3736)}oG(d+336|0,b+8<<12,4096,oE(d+2604|0,e)|0,0);return}function oE(a,b){a=a|0;b=b|0;var d=0;d=a;a=oy(d,b)|0;b=a-(c[d+12>>2]|0)|0;if(b>>>0>((gc(d|0)|0)-4104|0)>>>0){b=0}return dh(d|0,b)|0}function oF(d,e){d=d|0;e=e|0;var f=0;f=e;e=d;c[e+2056>>2]=e+2060;a[e+2053|0]=4;a[e+2054|0]=-1;b[e+2048>>1]=0;a[e+2050|0]=0;a[e+2051|0]=0;a[e+2052|0]=0;c[e+2196>>2]=0;c[e+2192>>2]=0;c[e+2200>>2]=1073741824;c[e+2204>>2]=1073741824;c[e+2208>>2]=0;oA(e,32,f);oG(e,8192,57344,f,1);oG(e,0,8192,e|0,1);f8();return}function oG(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=b;b=c;c=d;d=e&1;e=a;if(((f>>>0)%2048|0|0)!=0){a5(8960|0,92,13336|0,6224|0)}if(((b>>>0)%2048|0|0)!=0){a5(8960|0,93,13336|0,4648|0)}if((f+b|0)>>>0>65536){a5(8960|0,94,13336|0,3688|0)}a=(f>>>0)/2048|0;f=(b>>>0)/2048|0;while(1){if((f|0)==0){break}b=a;a=b+1|0;oA(e,b,c);if(!(d&1)){c=c+2048|0}f=f-1|0}return}function oH(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;h=i;i=i+144|0;j=h|0;k=f;oL(k,g);g=j;f=k+2060|0;wh(g|0,f|0,140)|0;c[k+2056>>2]=j;f=c[j+136>>2]|0;g=e[k+2048>>1]|0;l=d[k+2050|0]|0;m=d[k+2051|0]|0;n=d[k+2052|0]|0;o=(d[k+2054|0]|0)+1|256;p=d[k+2053|0]|0;q=p&76;r=p<<8;s=r;r=r|~p&2;L80:while(1){p=c[j+(g>>>11<<2)>>2]|0;p=p+(g&2047)|0;t=p;p=t+1|0;u=d[t]|0;g=g+1|0;t=d[17384+u|0]|0;v=f+t|0;f=v;do{if((v|0)>=0){if((f|0)<(t|0)){w=70;break}f=f-t|0;g=g-1|0;c[j+136>>2]=f;x=-1;f=c[j+136>>2]|0;if((x|0)>=0){break}if((f|0)>=0){w=360;break L80}continue L80}else{w=70}}while(0);L94:do{if((w|0)==70){w=0;t=d[p]|0;v=u;do{if((v|0)==165){y=d[k+t|0]|0;r=y;l=y;g=g+1|0;continue L80}else if((v|0)==208){y=(t&255)<<24>>24;z=g+1|0;g=z;if((r&255)<<24>>24!=0){g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}else{w=66;break}}else if((v|0)==181){y=d[k+(t+m&255)|0]|0;r=y;l=y;g=g+1|0;continue L80}else if((v|0)==32){y=g+1|0;g=jD(p)|0;a[k+(256|o-1)|0]=y>>>8&255;o=o-2|256;a[k+o|0]=y&255;continue L80}else if((v|0)==76){g=jD(p)|0;continue L80}else if((v|0)==232){y=m+1|0;r=y;m=y&255;continue L80}else if((v|0)==16){y=(t&255)<<24>>24;z=g+1|0;g=z;if((r&32896|0)!=0){w=66;break}else{g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}}else if((v|0)==193){y=t+m|0;t=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;w=93}else if((v|0)==209){y=(d[k+t|0]|0)+n|0;t=y+((d[k+(t+1&255)|0]|0)<<8)|0;f=f+(y>>>8)|0;w=93}else if((v|0)==213){t=t+m&255;w=88}else if((v|0)==197){w=88}else if((v|0)==217){t=t+n|0;w=91}else if((v|0)==221){t=t+m|0;w=91}else if((v|0)==205){w=92}else if((v|0)==201){w=94}else if((v|0)==48){y=(t&255)<<24>>24;z=g+1|0;g=z;if((r&32896|0)!=0){g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}else{w=66;break}}else if((v|0)==240){y=(t&255)<<24>>24;z=g+1|0;g=z;if((r&255)<<24>>24!=0){w=66;break}else{g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}}else if((v|0)==149){t=t+m&255;w=103}else if((v|0)==133){w=103}else if((v|0)==200){y=n+1|0;r=y;n=y&255;continue L80}else if((v|0)==168){n=l;r=l;continue L80}else if((v|0)==152){l=n;r=n;continue L80}else if((v|0)==173){y=jD(p)|0;g=g+2|0;c[j+136>>2]=f;r=oB(k-336|0,y)|0;f=c[j+136>>2]|0;l=r;continue L80}else if((v|0)==96){g=(d[k+o|0]|0)+1|0;g=g+((d[k+(256|o-255)|0]|0)<<8)|0;o=o-254|256;continue L80}else if((v|0)==153){A=n+(jD(p)|0)|0;g=g+2|0;if(A>>>0<=2047){a[k+A|0]=l&255;continue L80}else{w=118;break}}else if((v|0)==141){A=jD(p)|0;g=g+2|0;if(A>>>0<=2047){a[k+A|0]=l&255;continue L80}else{w=118;break}}else if((v|0)==157){A=m+(jD(p)|0)|0;g=g+2|0;if(A>>>0<=2047){a[k+A|0]=l&255;continue L80}else{w=118;break}}else if((v|0)==145){A=(d[k+t|0]|0)+n+((d[k+(t+1&255)|0]|0)<<8)|0;g=g+1|0;w=118}else if((v|0)==129){y=t+m|0;A=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;g=g+1|0;w=118}else if((v|0)==169){g=g+1|0;l=t;r=t;continue L80}else if((v|0)==161){y=t+m|0;B=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;g=g+1|0;w=132}else if((v|0)==177){B=(d[k+t|0]|0)+n|0;f=f+(B>>>8)|0;B=B+((d[k+(t+1&255)|0]|0)<<8)|0;g=g+1|0;y=d[(c[j+(B>>>11<<2)>>2]|0)+(B&2047)|0]|0;r=y;l=y;if((B^32768)>>>0<=40959){continue L80}else{w=132;break}}else if((v|0)==185){f=f+((t+n|0)>>>8)|0;B=(jD(p)|0)+n|0;g=g+2|0;y=d[(c[j+(B>>>11<<2)>>2]|0)+(B&2047)|0]|0;r=y;l=y;if((B^32768)>>>0<=40959){continue L80}else{w=132;break}}else if((v|0)==189){f=f+((t+m|0)>>>8)|0;B=(jD(p)|0)+m|0;g=g+2|0;y=d[(c[j+(B>>>11<<2)>>2]|0)+(B&2047)|0]|0;r=y;l=y;if((B^32768)>>>0<=40959){continue L80}else{w=132;break}}else if((v|0)==80){y=(t&255)<<24>>24;z=g+1|0;g=z;if((q&64|0)!=0){w=66;break}else{g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}}else if((v|0)==112){y=(t&255)<<24>>24;z=g+1|0;g=z;if((q&64|0)!=0){g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}else{w=66;break}}else if((v|0)==176){y=(t&255)<<24>>24;z=g+1|0;g=z;if((s&256|0)!=0){g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}else{w=66;break}}else if((v|0)==144){y=(t&255)<<24>>24;z=g+1|0;g=z;if((s&256|0)!=0){w=66;break}else{g=g+y&65535;f=f+(((z&255)+y|0)>>>8&1)|0;continue L80}}else if((v|0)==148){t=t+m&255;w=146}else if((v|0)==132){w=146}else if((v|0)==150){t=t+n&255;w=148}else if((v|0)==134){w=148}else if((v|0)==182){t=t+n&255;w=150}else if((v|0)==166){w=150}else if((v|0)==162){w=151}else if((v|0)==180){t=t+m&255;w=153}else if((v|0)==164){w=153}else if((v|0)==160){w=154}else if((v|0)==188){t=t+m|0;f=f+(t>>>8)|0;w=156}else if((v|0)==172){w=156}else if((v|0)==190){t=t+n|0;f=f+(t>>>8)|0;w=158}else if((v|0)==174){w=158}else if((v|0)==140){C=n;w=161}else if((v|0)==142){C=m;w=161}else if((v|0)==236){y=jD(p)|0;g=g+1|0;c[j+136>>2]=f;t=oB(k-336|0,y)|0;f=c[j+136>>2]|0;w=167}else if((v|0)==228){t=d[k+t|0]|0;w=166}else if((v|0)==224){w=166}else if((v|0)==204){y=jD(p)|0;g=g+1|0;c[j+136>>2]=f;t=oB(k-336|0,y)|0;f=c[j+136>>2]|0;w=171}else if((v|0)==196){t=d[k+t|0]|0;w=170}else if((v|0)==192){w=170}else if((v|0)==33){y=t+m|0;t=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;w=180}else if((v|0)==49){y=(d[k+t|0]|0)+n|0;t=y+((d[k+(t+1&255)|0]|0)<<8)|0;f=f+(y>>>8)|0;w=180}else if((v|0)==53){t=t+m&255;w=175}else if((v|0)==37){w=175}else if((v|0)==57){t=t+n|0;w=178}else if((v|0)==61){t=t+m|0;w=178}else if((v|0)==45){w=179}else if((v|0)==41){w=181}else if((v|0)==65){y=t+m|0;t=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;w=191}else if((v|0)==81){y=(d[k+t|0]|0)+n|0;t=y+((d[k+(t+1&255)|0]|0)<<8)|0;f=f+(y>>>8)|0;w=191}else if((v|0)==85){t=t+m&255;w=186}else if((v|0)==69){w=186}else if((v|0)==89){t=t+n|0;w=189}else if((v|0)==93){t=t+m|0;w=189}else if((v|0)==77){w=190}else if((v|0)==73){w=192}else if((v|0)==1){y=t+m|0;t=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;w=202}else if((v|0)==17){y=(d[k+t|0]|0)+n|0;t=y+((d[k+(t+1&255)|0]|0)<<8)|0;f=f+(y>>>8)|0;w=202}else if((v|0)==21){t=t+m&255;w=197}else if((v|0)==5){w=197}else if((v|0)==25){t=t+n|0;w=200}else if((v|0)==29){t=t+m|0;w=200}else if((v|0)==13){w=201}else if((v|0)==9){w=203}else if((v|0)==44){y=jD(p)|0;g=g+2|0;q=q&-65;c[j+136>>2]=f;r=oB(k-336|0,y)|0;f=c[j+136>>2]|0;q=q|r&64;if((l&r|0)!=0){continue L80}else{r=r<<8;continue L80}}else if((v|0)==36){r=d[k+t|0]|0;g=g+1|0;q=q&-65;q=q|r&64;if((l&r|0)!=0){continue L80}else{r=r<<8;continue L80}}else if((v|0)==225){y=t+m|0;t=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;w=219}else if((v|0)==241){y=(d[k+t|0]|0)+n|0;t=y+((d[k+(t+1&255)|0]|0)<<8)|0;f=f+(y>>>8)|0;w=219}else if((v|0)==245){t=t+m&255;w=214}else if((v|0)==229){w=214}else if((v|0)==249){t=t+n|0;w=217}else if((v|0)==253){t=t+m|0;w=217}else if((v|0)==237){w=218}else if((v|0)==233){w=220}else if((v|0)==235){w=222}else if((v|0)==97){y=t+m|0;t=((d[k+(y+1&255)|0]|0)<<8)+(d[k+(y&255)|0]|0)|0;w=231}else if((v|0)==113){y=(d[k+t|0]|0)+n|0;t=y+((d[k+(t+1&255)|0]|0)<<8)|0;f=f+(y>>>8)|0;w=231}else if((v|0)==117){t=t+m&255;w=226}else if((v|0)==101){w=226}else if((v|0)==121){t=t+n|0;w=229}else if((v|0)==125){t=t+m|0;w=229}else if((v|0)==109){w=230}else if((v|0)==105){w=232}else if((v|0)==74){s=0;w=236}else if((v|0)==106){w=236}else if((v|0)==10){r=l<<1;s=r;l=r&255;continue L80}else if((v|0)==42){r=l<<1;y=s>>>8&1;s=r;r=r|y;l=r&255;continue L80}else if((v|0)==94){t=t+m|0;w=240}else if((v|0)==78){w=240}else if((v|0)==110){w=241}else if((v|0)==62){t=t+m|0;w=247}else if((v|0)==30){t=t+m|0;w=245}else if((v|0)==14){w=245}else if((v|0)==46){w=246}else if((v|0)==126){t=t+m|0;w=242}else if((v|0)==118){t=t+m&255;w=254}else if((v|0)==86){t=t+m&255;w=252}else if((v|0)==70){w=252}else if((v|0)==102){w=253}else if((v|0)==54){t=t+m&255;w=259}else if((v|0)==22){t=t+m&255;w=257}else if((v|0)==6){w=257}else if((v|0)==38){w=258}else if((v|0)==202){y=m-1|0;r=y;m=y&255;continue L80}else if((v|0)==136){y=n-1|0;r=y;n=y&255;continue L80}else if((v|0)==246){t=t+m&255;w=263}else if((v|0)==230){w=263}else if((v|0)==214){t=t+m&255;w=265}else if((v|0)==198){w=265}else if((v|0)==254){t=m+(jD(p)|0)|0;w=270}else if((v|0)==238){t=jD(p)|0;w=270}else if((v|0)==222){t=m+(jD(p)|0)|0;w=273}else if((v|0)==206){t=jD(p)|0;w=273}else if((v|0)==170){m=l;r=l;continue L80}else if((v|0)==138){l=m;r=m;continue L80}else if((v|0)==154){o=m+1|256;continue L80}else if((v|0)==186){y=o-1&255;r=y;m=y;continue L80}else if((v|0)==72){o=o-1|256;a[k+o|0]=l&255;continue L80}else if((v|0)==104){y=d[k+o|0]|0;r=y;l=y;o=o-255|256;continue L80}else if((v|0)==64){y=d[k+o|0]|0;g=d[k+(256|o-255)|0]|0;g=g|(d[k+(256|o-254)|0]|0)<<8;o=o-253|256;t=q;q=y&76;r=y<<8;s=r;r=r|~y&2;if(((t^q)&4|0)==0){continue L80}a[k+2053|0]=q&255;y=(c[j+132>>2]|0)-(c[k+2200>>2]|0)|0;if((y|0)<=0){continue L80}if((q&4|0)!=0){continue L80}else{f=f+y|0;c[j+132>>2]=c[k+2200>>2];continue L80}}else if((v|0)==40){y=d[k+o|0]|0;o=o-255|256;z=q^y;q=y&76;r=y<<8;s=r;r=r|~y&2;if((z&4|0)==0){continue L80}if((q&4|0)!=0){w=325;break}else{w=312;break}}else if((v|0)==8){z=q&76;z=z|(r>>>8|r)&128;z=z|s>>>8&1;if((r&255|0)==0){z=z|2}o=o-1|256;a[k+o|0]=(z|48)&255;continue L80}else if((v|0)==108){t=jD(p)|0;z=c[j+(t>>>11<<2)>>2]|0;g=d[z+(t&2047)|0]|0;t=t&65280|t+1&255;g=g|(d[z+(t&2047)|0]|0)<<8;continue L80}else if((v|0)==0){g=g+1|0;x=4;break L94}else if((v|0)==56){s=-1;continue L80}else if((v|0)==24){s=0;continue L80}else if((v|0)==184){q=q&-65;continue L80}else if((v|0)==216){q=q&-9;continue L80}else if((v|0)==248){q=q|8;continue L80}else if((v|0)==88){if((q&4|0)!=0){q=q&-5;w=312;break}else{continue L80}}else if((v|0)==120){if((q&4|0)!=0){continue L80}else{q=q|4;w=325;break}}else if((v|0)==28|(v|0)==60|(v|0)==92|(v|0)==124|(v|0)==220|(v|0)==252){f=f+((t+m|0)>>>8)|0;w=329}else if((v|0)==12){w=329}else if((v|0)==116|(v|0)==4|(v|0)==20|(v|0)==52|(v|0)==68|(v|0)==84|(v|0)==100|(v|0)==128|(v|0)==130|(v|0)==137|(v|0)==194|(v|0)==212|(v|0)==226|(v|0)==244){w=330}else if((v|0)==234|(v|0)==26|(v|0)==58|(v|0)==90|(v|0)==122|(v|0)==218|(v|0)==250){continue L80}else if((v|0)==242){g=g-1|0;if(g>>>0<=65535){w=334;break L80}g=g&65535;continue L80}else if((v|0)==2|(v|0)==18|(v|0)==34|(v|0)==50|(v|0)==66|(v|0)==82|(v|0)==98|(v|0)==114|(v|0)==146|(v|0)==178|(v|0)==210){w=335;break L80}else if((v|0)==255){s=s|1;w=337}else{w=337}}while(0);if((w|0)==66){w=0;f=f-1|0;continue L80}else if((w|0)==88){w=0;t=d[k+t|0]|0;w=95}else if((w|0)==91){w=0;f=f+(t>>>8)|0;w=92}else if((w|0)==103){w=0;g=g+1|0;a[k+t|0]=l&255;continue L80}else if((w|0)==118){w=0;c[j+136>>2]=f;oD(k-336|0,A,l);f=c[j+136>>2]|0;continue L80}else if((w|0)==132){w=0;c[j+136>>2]=f;v=oB(k-336|0,B)|0;r=v;l=v;f=c[j+136>>2]|0;continue L80}else if((w|0)==146){w=0;g=g+1|0;a[k+t|0]=n&255;continue L80}else if((w|0)==148){w=0;g=g+1|0;a[k+t|0]=m&255;continue L80}else if((w|0)==150){w=0;t=d[k+t|0]|0;w=151}else if((w|0)==153){w=0;t=d[k+t|0]|0;w=154}else if((w|0)==156){w=0;v=t+((d[p+1|0]|0)<<8)|0;g=g+2|0;c[j+136>>2]=f;z=oB(k-336|0,v)|0;r=z;n=z;f=c[j+136>>2]|0;continue L80}else if((w|0)==158){w=0;z=t+((d[p+1|0]|0)<<8)|0;g=g+2|0;c[j+136>>2]=f;v=oB(k-336|0,z)|0;r=v;m=v;f=c[j+136>>2]|0;continue L80}else if((w|0)==161){w=0;v=jD(p)|0;g=g+2|0;if(v>>>0<=2047){a[k+v|0]=C&255;continue L80}else{c[j+136>>2]=f;oD(k-336|0,v,C);f=c[j+136>>2]|0;continue L80}}else if((w|0)==166){w=0;w=167}else if((w|0)==170){w=0;w=171}else if((w|0)==175){w=0;t=d[k+t|0]|0;w=182}else if((w|0)==178){w=0;f=f+(t>>>8)|0;w=179}else if((w|0)==186){w=0;t=d[k+t|0]|0;w=193}else if((w|0)==189){w=0;f=f+(t>>>8)|0;w=190}else if((w|0)==197){w=0;t=d[k+t|0]|0;w=204}else if((w|0)==200){w=0;f=f+(t>>>8)|0;w=201}else if((w|0)==214){w=0;t=d[k+t|0]|0;w=221}else if((w|0)==217){w=0;f=f+(t>>>8)|0;w=218}else if((w|0)==226){w=0;t=d[k+t|0]|0;w=233}else if((w|0)==229){w=0;f=f+(t>>>8)|0;w=230}else if((w|0)==236){w=0;r=s>>>1&128;s=l<<8;r=r|l>>>1;l=r;continue L80}else if((w|0)==240){w=0;s=0;w=241}else if((w|0)==245){w=0;s=0;w=246}else if((w|0)==252){w=0;s=0;w=253}else if((w|0)==257){w=0;s=0;w=258}else if((w|0)==263){w=0;r=1;w=266}else if((w|0)==265){w=0;r=-1;w=266}else if((w|0)==270){w=0;r=1;w=274}else if((w|0)==273){w=0;r=-1;w=274}else if((w|0)==312){w=0;a[k+2053|0]=q&255;v=(c[j+132>>2]|0)-(c[k+2200>>2]|0)|0;do{if((v|0)<=0){if((f+(c[j+132>>2]|0)|0)<(c[k+2200>>2]|0)){continue L80}else{break}}else{c[j+132>>2]=c[k+2200>>2];f=f+v|0;if((f|0)<0){continue L80}if((v|0)>=(f+1|0)){z=j+132|0;c[z>>2]=(c[z>>2]|0)+(f+1);f=-1;continue L80}else{break}}}while(0);continue L80}else if((w|0)==325){w=0;a[k+2053|0]=q&255;v=(c[j+132>>2]|0)-(c[k+2204>>2]|0)|0;c[j+132>>2]=c[k+2204>>2];f=f+v|0;if((f|0)<0){continue L80}else{continue L80}}else if((w|0)==329){w=0;g=g+1|0;w=330}else if((w|0)==337){w=0;v=d[p-1|0]|0;z=(d[17640+(v>>>2&7)|0]|0)>>(v<<1&6)&3;if((v|0)==156){z=2}g=g+z|0;z=k+2208|0;c[z>>2]=(c[z>>2]|0)+1;if((v>>>4|0)==11){if((v|0)==179){t=d[k+t|0]|0}if((v|0)!=183){f=f+((t+n|0)>>>8)|0}}continue L80}if((w|0)==92){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;w=93}else if((w|0)==151){w=0;g=g+1|0;m=t;r=t;continue L80}else if((w|0)==154){w=0;g=g+1|0;n=t;r=t;continue L80}else if((w|0)==167){w=0;r=m-t|0;g=g+1|0;s=~r;r=r&255;continue L80}else if((w|0)==171){w=0;r=n-t|0;g=g+1|0;s=~r;r=r&255;continue L80}else if((w|0)==179){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;w=180}else if((w|0)==190){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;w=191}else if((w|0)==201){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;w=202}else if((w|0)==218){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;w=219}else if((w|0)==230){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;w=231}else if((w|0)==241){w=0;w=242}else if((w|0)==246){w=0;w=247}else if((w|0)==253){w=0;w=254}else if((w|0)==258){w=0;w=259}else if((w|0)==266){w=0;r=r+(d[k+t|0]|0)|0;w=267}else if((w|0)==274){w=0;c[j+136>>2]=f;r=r+(oB(k-336|0,t)|0)|0;g=g+2|0;oD(k-336|0,t,r&255);f=c[j+136>>2]|0;continue L80}else if((w|0)==330){w=0;g=g+1|0;continue L80}if((w|0)==93){w=0;c[j+136>>2]=f;t=oB(k-336|0,t)|0;f=c[j+136>>2]|0;w=94}else if((w|0)==180){w=0;c[j+136>>2]=f;t=oB(k-336|0,t)|0;f=c[j+136>>2]|0;w=181}else if((w|0)==191){w=0;c[j+136>>2]=f;t=oB(k-336|0,t)|0;f=c[j+136>>2]|0;w=192}else if((w|0)==202){w=0;c[j+136>>2]=f;t=oB(k-336|0,t)|0;f=c[j+136>>2]|0;w=203}else if((w|0)==219){w=0;c[j+136>>2]=f;t=oB(k-336|0,t)|0;f=c[j+136>>2]|0;w=220}else if((w|0)==231){w=0;c[j+136>>2]=f;t=oB(k-336|0,t)|0;f=c[j+136>>2]|0;w=232}else if((w|0)==242){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;c[j+136>>2]=f;v=oB(k-336|0,t)|0;r=s>>>1&128|v>>1;s=v<<8;w=248}else if((w|0)==247){w=0;g=g+1|0;t=t+((d[p+1|0]|0)<<8)|0;r=s>>>8&1;c[j+136>>2]=f;v=(oB(k-336|0,t)|0)<<1;s=v;r=r|v;w=248}else if((w|0)==254){w=0;v=d[k+t|0]|0;r=s>>>1&128|v>>1;s=v<<8;w=267}else if((w|0)==259){w=0;r=s>>>8&1;v=(d[k+t|0]|0)<<1;s=v;r=r|v;w=267}if((w|0)==94){w=0;w=95}else if((w|0)==181){w=0;w=182}else if((w|0)==192){w=0;w=193}else if((w|0)==203){w=0;w=204}else if((w|0)==220){w=0;w=221}else if((w|0)==232){w=0;w=233}else if((w|0)==248){w=0;g=g+1|0;oD(k-336|0,t,r&255);f=c[j+136>>2]|0;continue L80}else if((w|0)==267){w=0;g=g+1|0;a[k+t|0]=r&255;continue L80}if((w|0)==95){w=0;r=l-t|0;g=g+1|0;s=~r;r=r&255;continue L80}else if((w|0)==182){w=0;v=l&t;l=v;r=v;g=g+1|0;continue L80}else if((w|0)==193){w=0;v=l^t;l=v;r=v;g=g+1|0;continue L80}else if((w|0)==204){w=0;v=l|t;l=v;r=v;g=g+1|0;continue L80}else if((w|0)==221){w=0;w=222}else if((w|0)==233){w=0}if((w|0)==222){w=0;t=t^255}v=s>>>8&1;q=q&-65;q=q|(l^128)+v+((t&255)<<24>>24)>>2&64;z=l+t+v|0;r=z;s=z;g=g+1|0;l=r&255;continue L80}}while(0);f=f+7|0;a[k+(256|o-1)|0]=g>>>8&255;a[k+(256|o-2)|0]=g&255;g=jD((c[j+124>>2]|0)+2042+x|0)|0;o=o-3|256;t=q&76;t=t|(r>>>8|r)&128;t=t|s>>>8&1;if((r&255|0)==0){t=t|2}t=t|32;if((x|0)!=0){t=t|16}a[k+o|0]=t&255;t=q|4;q=t;a[k+2053|0]=t&255;t=(c[j+132>>2]|0)-(c[k+2204>>2]|0)|0;if((t|0)>=0){continue}else{f=f+t|0;c[j+132>>2]=c[k+2204>>2];continue}}if((w|0)==334){w=335}c[j+136>>2]=f;b[k+2048>>1]=g&65535;a[k+2054|0]=o-1&255;a[k+2050|0]=l&255;a[k+2051|0]=m&255;a[k+2052|0]=n&255;n=q&76;n=n|(r>>>8|r)&128;n=n|s>>>8&1;if((r&255|0)==0){n=n|2}a[k+2053|0]=n&255;n=k+2060|0;r=j;wh(n|0,r|0,140)|0;c[k+2056>>2]=k+2060;i=h;return(f|0)<0|0}function oI(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;do{if((d|0)<(f|0)){if((a[e+2053|0]&4|0)!=0){break}f=d}}while(0);d=(c[(c[e+2056>>2]|0)+132>>2]|0)-f|0;c[(c[e+2056>>2]|0)+132>>2]=f;return d|0}function oJ(a){a=a|0;var b=0;b=a;a=c[b+100>>2]&127;if((c[b+100>>2]&128|0)!=0){c[b+100>>2]=a+1|128}return b+104+a|0}function oK(d){d=d|0;var e=0,f=0;e=d;c[e+96>>2]=0;c[e+100>>2]=0;d=0;while(1){if((d|0)>=128){break}a[e+104+d|0]=0;d=d+1|0}d=0;while(1){if((d|0)>=8){break}f=e+(d*12|0)|0;c[f>>2]=0;b[f+8>>1]=0;b[f+10>>1]=0;d=d+1|0}return}function oL(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;c[d+2204>>2]=a;b=oI(d,a,c[d+2200>>2]|0)|0;a=(c[d+2056>>2]|0)+136|0;c[a>>2]=(c[a>>2]|0)+b;return}function oM(a){a=a|0;var b=0;b=a;c[b+48>>2]=0;a=0;while(1){if((a|0)>=3){break}c[b+24+(a<<3)+4>>2]=0;a=a+1|0}wg(b|0,0,24);return}function oN(a){a=a|0;var b=0;b=a;oO(b+232|0);oP(b,0);oQ(b,1.0);oK(b);return}function oO(a){a=a|0;o$(a);return}function oP(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;a=0;while(1){if((a|0)>=8){break}oT(b,a,c);a=a+1|0}return}function oQ(a,b){a=a|0;b=+b;o0(a+232|0,.0125*b);return}function oR(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;g=f;f=e;e=(d[f+231|0]>>4&7)+1|0;h=8-e|0;while(1){if((h|0)>=8){break}i=f+(h*12|0)|0;j=c[i+4>>2]|0;do{if((j|0)!=0){iv(j);k=ch(j,c[f+96>>2]|0)|0;l=k+(c[i>>2]|0)|0;k=ch(j,g)|0;c[i>>2]=0;if(l>>>0<k>>>0){m=f+104+((h<<3)+64)|0;if((a[m+4|0]&224|0)==0){break}n=a[m+7|0]&15;if((n|0)==0){break}o=((a[m+4|0]&3)<<16)+(d[m+2|0]<<8)+(d[m|0]|0)|0;if((o|0)<(e<<6|0)){break}p=aq(((kM(j,983040)|0)>>>0)/(o>>>0)|0,e)|0;o=32-((d[m+4|0]>>2&7)<<2)|0;if((o|0)==0){break}q=b[i+8>>1]|0;r=b[i+10>>1]|0;do{s=r+(d[m+6|0]|0)|0;t=d[f+104+(s>>1)|0]>>(s<<2&4);r=r+1|0;t=aq(t&15,n)|0;s=t-q|0;if((s|0)!=0){q=t;o3(f+232|0,l,s,j)}l=l+p|0;if((r|0)>=(o|0)){r=0}}while(l>>>0<k>>>0);b[i+10>>1]=r&65535;b[i+8>>1]=q&65535}c[i>>2]=l-k}}while(0);h=h+1|0}c[f+96>>2]=g;return}function oS(f,g){f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;h=g;g=f;if((h|0)<(c[g+48>>2]|0)){a5(3552,43,15360,8936)}f=0;while(1){if((f|0)>=3){break}i=d[g+7|0]>>f;j=d[g+(f+8)|0]|0;k=d[26088+(j&15)|0]|0;l=c[g+24+(f<<3)>>2]|0;if((l|0)!=0){iv(l);do{if((i&9|0)<=1){if((j&31|0)==0){break}}}while(0);if((i&1|j&16|0)!=0){k=0}m=((a[g+((f<<1)+1)|0]&15)<<8<<4)+(d[g+(f<<1)|0]<<4)|0;if(m>>>0<50){k=0;if((m|0)==0){m=16}}n=k;if((a[g+14+f|0]|0)==0){n=0}o=n-(c[g+24+(f<<3)+4>>2]|0)|0;if((o|0)!=0){c[g+24+(f<<3)+4>>2]=n;ix(g+56|0,c[g+48>>2]|0,o,l)}o=(c[g+48>>2]|0)+(e[g+18+(f<<1)>>1]|0)|0;if((o|0)<(h|0)){p=(n<<1)-k|0;if((k|0)!=0){do{p=-p|0;i9(g+56|0,o,p,l);o=o+m|0;}while((o|0)<(h|0));c[g+24+(f<<3)+4>>2]=p+k>>1;a[g+14+f|0]=(p|0)>0|0}else{l=((h-o+m-1|0)>>>0)/(m>>>0)|0;j=g+14+f|0;a[j]=(d[j]^l&1)&255;o=o+(aq(l,m)|0)|0}}b[g+18+(f<<1)>>1]=o-h&65535}f=f+1|0}c[g+48>>2]=h;return}function oT(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=8){a5(3632,92,15016,2752)}c[a+(e*12|0)+4>>2]=d;return}function oU(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+96>>2]|0)){oR(b,d)}if((c[b+96>>2]|0)<(d|0)){a5(3464,72,14968,8880)}a=b+96|0;c[a>>2]=(c[a>>2]|0)-d;return}function oV(a,b){a=a|0;b=b|0;var e=0;e=a;if((c[e+12>>2]|0)==0){return}if(((d[e|0]|0)&b|0)!=0){return}b=e+12|0;c[b>>2]=(c[b>>2]|0)-1;return}function oW(b){b=b|0;var d=0,e=0,f=0;d=b;b=a[d|0]&15;if(a[d+7|0]&1){a[d+7|0]=0;c[d+28>>2]=b;c[d+24>>2]=15;return}e=d+28|0;f=(c[e>>2]|0)-1|0;c[e>>2]=f;if((f|0)<0){c[d+28>>2]=b;if((c[d+24>>2]|a[d|0]&32|0)!=0){c[d+24>>2]=(c[d+24>>2]|0)-1&15}}return}function oX(b){b=b|0;var d=0,e=0,f=0;d=b;if((c[d+12>>2]|0)==0){e=0;return e|0}if((a[d|0]&16|0)!=0){f=a[d|0]&15}else{f=c[d+24>>2]|0}e=f;return e|0}function oY(b){b=b|0;var c=0;c=b;return((a[c+3|0]&7)<<8)+(a[c+2|0]&255)|0}function oZ(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=b;b=e;e=a;a=d-f|0;if((a|0)<=0){g=f;return g|0}d=(a+b-1|0)/(b|0)|0;c[e+32>>2]=(c[e+32>>2]|0)+d&7;f=f+(aq(d,b)|0)|0;g=f;return g|0}function o_(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;a=d-(c[b+20>>2]|0)|0;c[b+20>>2]=d;return a|0}function o$(a){a=a|0;var b=0;b=a;ck(b|0,b+40|0,12);return}function o0(a,b){a=a|0;b=+b;cM(a|0,b*.06666666666666667);return}function o1(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0;f=e;e=b;b=d[e+1|0]|0;g=e+36|0;h=(c[g>>2]|0)-1|0;c[g>>2]=h;if((h|0)<0){a[e+5|0]=1;h=oY(e)|0;g=b&7;do{if((g|0)!=0){if((b&128|0)==0){break}if((h|0)<8){break}i=h>>g;if((b&8|0)!=0){i=f-i|0}if((h+i|0)<2048){h=h+i|0;a[e+2|0]=h&255;a[e+3|0]=((d[e+3|0]|0)&-8|h>>8&7)&255}}}while(0)}if(!(a[e+5|0]&1)){return}a[e+5|0]=0;c[e+36>>2]=b>>4&7;return}function o2(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;g=e;e=f;f=b;b=oY(f)|0;h=b+1<<1;if((c[f+8>>2]|0)==0){c[f+16>>2]=(oZ(f,g+(c[f+16>>2]|0)|0,e,h)|0)-e;return}iv(c[f+8>>2]|0);i=b>>(a[f+1|0]&7);if((a[f+1|0]&8|0)!=0){i=0}j=oX(f)|0;do{if((j|0)==0){k=518}else{if((b|0)<8){k=518;break}if((b+i|0)>=2048){k=518;break}l=(d[f|0]|0)>>6&3;m=1<<l;n=0;if((l|0)==3){m=2;n=j}if((c[f+32>>2]|0)<(m|0)){n=n^j}l=o_(f,n)|0;if((l|0)!=0){ix(c[f+40>>2]|0,g,l,c[f+8>>2]|0)}g=g+(c[f+16>>2]|0)|0;if((g|0)<(e|0)){l=c[f+8>>2]|0;o=c[f+40>>2]|0;p=(n<<1)-j|0;n=c[f+32>>2]|0;do{n=n+1&7;if((n|0)==0){k=531}else{if((n|0)==(m|0)){k=531}}if((k|0)==531){k=0;p=-p|0;i9(o,g,p,l)}g=g+h|0;}while((g|0)<(e|0));c[f+20>>2]=p+j>>1;c[f+32>>2]=n}}}while(0);if((k|0)==518){if((c[f+20>>2]|0)!=0){ix(c[f+40>>2]|0,g,-(c[f+20>>2]|0)|0,c[f+8>>2]|0);c[f+20>>2]=0}g=g+(c[f+16>>2]|0)|0;g=oZ(f,g,e,h)|0}c[f+16>>2]=g-e;return}function o3(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;g=d;d=e;e=f;f=a;if((g>>>16|0)>=(c[e+12>>2]|0)){a5(6120,342,11744,4576)}d=aq(d,c[f+8>>2]|0)|0;a=(c[e+8>>2]|0)+(g>>>16<<2)|0;e=g>>>10&63;g=f+168+(-e<<1)|0;h=b[g>>1]|0;i=aq(h,d)|0;j=i+(c[a+8>>2]|0)|0;i=aq(b[g+128>>1]|0,d)|0;k=i+(c[a+12>>2]|0)|0;h=b[g+256>>1]|0;c[a+8>>2]=j;c[a+12>>2]=k;k=aq(h,d)|0;j=k+(c[a+16>>2]|0)|0;k=aq(b[g+384>>1]|0,d)|0;i=k+(c[a+20>>2]|0)|0;h=b[g+512>>1]|0;c[a+16>>2]=j;c[a+20>>2]=i;i=aq(h,d)|0;j=i+(c[a+24>>2]|0)|0;i=aq(b[g+640>>1]|0,d)|0;k=i+(c[a+28>>2]|0)|0;g=f+40+(e<<1)|0;h=b[g+640>>1]|0;c[a+24>>2]=j;c[a+28>>2]=k;k=aq(h,d)|0;j=k+(c[a+32>>2]|0)|0;k=aq(b[g+512>>1]|0,d)|0;e=k+(c[a+36>>2]|0)|0;h=b[g+384>>1]|0;c[a+32>>2]=j;c[a+36>>2]=e;e=aq(h,d)|0;j=e+(c[a+40>>2]|0)|0;e=aq(b[g+256>>1]|0,d)|0;k=e+(c[a+44>>2]|0)|0;h=b[g+128>>1]|0;c[a+40>>2]=j;c[a+44>>2]=k;k=aq(h,d)|0;h=k+(c[a+48>>2]|0)|0;k=aq(b[g>>1]|0,d)|0;d=k+(c[a+52>>2]|0)|0;c[a+48>>2]=h;c[a+52>>2]=d;return}function o4(b){b=b|0;var d=0;d=b;if(a[d+7|0]&1){c[d+28>>2]=a[d|0]&127}else{if((c[d+28>>2]|0)!=0){b=d+28|0;c[b>>2]=(c[b>>2]|0)-1}}if((a[d|0]&128|0)!=0){return}a[d+7|0]=0;return}function o5(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=b;b=e;e=a;a=d-f|0;if((a|0)<=0){g=f;return g|0}d=(a+b-1|0)/(b|0)|0;c[e+24>>2]=(c[e+24>>2]|0)+1-d&31;a=e+24|0;c[a>>2]=(c[a>>2]|0)+1;f=f+(aq(d,b)|0)|0;g=f;return g|0}function o6(a){a=a|0;var b=0,d=0;b=a;a=16-(c[b+24>>2]|0)|0;if((a|0)>=0){d=a;return d|0}a=(c[b+24>>2]|0)-17|0;d=a;return d|0}function o7(a){a=a|0;var b=0;b=a;c[b+24>>2]=((d[b+2|0]|0)<<6)+16384;c[b+12>>2]=((d[b+3|0]|0)<<4)+1;return}function o8(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=b;b=d;d=a;a=(oY(d)|0)+1|0;if((c[d+8>>2]|0)==0){e=e+(c[d+16>>2]|0)|0;c[d+16>>2]=0;do{if((c[d+12>>2]|0)!=0){if((c[d+28>>2]|0)==0){break}if((a|0)<3){break}c[d+16>>2]=(o5(d,e,b,a)|0)-b}}while(0);return}iv(c[d+8>>2]|0);f=o_(d,o6(d)|0)|0;if((f|0)!=0){jb(d+32|0,e,f,c[d+8>>2]|0)}e=e+(c[d+16>>2]|0)|0;do{if((c[d+12>>2]|0)==0){g=576}else{if((c[d+28>>2]|0)==0){g=576;break}if((a|0)<3){g=576;break}if((e|0)<(b|0)){f=c[d+8>>2]|0;h=c[d+24>>2]|0;i=1;if((h|0)>16){h=h-16|0;i=-i|0}do{j=h-1|0;h=j;if((j|0)==0){h=16;i=-i|0}else{jc(d+32|0,e,i,f)}e=e+a|0;}while((e|0)<(b|0));if((i|0)<0){h=h+16|0}c[d+24>>2]=h;c[d+20>>2]=o6(d)|0}}}while(0);if((g|0)==576){e=b}c[d+16>>2]=e-b;return}function o9(b){b=b|0;var d=0;d=b;c[d+24>>2]=0;c[d+48>>2]=0;c[d+32>>2]=0;c[d+36>>2]=1;c[d+40>>2]=0;a[d+44|0]=0;a[d+45|0]=1;c[d+52>>2]=1073741824;a[d+57|0]=0;a[d+56|0]=0;on(d);c[d+28>>2]=428;return}function pa(b){b=b|0;var d=0,e=0;d=b;b=1073741824;do{if(a[d+56|0]&1){if((c[d+12>>2]|0)==0){break}e=(c[(c[d+68>>2]|0)+1948>>2]|0)+(c[d+16>>2]|0)|0;b=e+(aq(((c[d+12>>2]|0)-1<<3)+(c[d+36>>2]|0)-1|0,c[d+28>>2]|0)|0)+1|0}}while(0);if((b|0)==(c[d+52>>2]|0)){return}c[d+52>>2]=b;oe(c[d+68>>2]|0);return}function pb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=d;d=e;e=b;if((d|0)!=0){c[d>>2]=f}if((c[e+12>>2]|0)==0){g=0;h=g;return h|0}b=om(e)|0;i=f-b|0;if((i|0)<=0){g=0;h=g;return h|0}f=((i-1|0)/(c[e+28>>2]<<3|0)|0)+1|0;do{if((a[e|0]&64|0)==0){if((f|0)<=(c[e+12>>2]|0)){break}f=c[e+12>>2]|0}}while(0);if((d|0)!=0){c[d>>2]=b+(aq(f-1|0,c[e+28>>2]<<3)|0)+1}g=f;h=g;return h|0}function pc(e,f,g){e=e|0;f=f|0;g=g|0;var h=0;h=f;f=g;g=e;if((h|0)==0){c[g+28>>2]=b[27368+((a[g+58|0]&1)<<5)+((f&15)<<1)>>1]|0;a[g+56|0]=(f&192|0)==128|0;e=g+57|0;a[e]=(a[e]&1&(a[g+56|0]&1)|0)!=0|0;pa(g);return}if((h|0)==1){h=c[g+48>>2]|0;c[g+48>>2]=f&127;if(!(a[g+59|0]&1)){c[g+20>>2]=(c[g+48>>2]|0)-((d[26128+(c[g+48>>2]|0)|0]|0)-(d[26128+h|0]|0))}}return}function pd(a){a=a|0;var b=0;b=a;o7(b);pe(b);pa(b);return}function pe(b){b=b|0;var d=0,e=0;d=b;if(a[d+44|0]&1){return}if((c[d+12>>2]|0)==0){return}if((c[d+60>>2]|0)==0){a5(3392,380,13304,8856)}c[d+32>>2]=bY[c[d+60>>2]&127](c[d+64>>2]|0,(c[d+24>>2]|0)+32768|0)|0;c[d+24>>2]=(c[d+24>>2]|0)+1&32767;a[d+44|0]=1;b=d+12|0;e=(c[b>>2]|0)-1|0;c[b>>2]=e;if((e|0)==0){if((a[d|0]&64|0)!=0){o7(d)}else{e=(c[d+68>>2]|0)+1972|0;c[e>>2]=c[e>>2]&-17;a[d+57|0]=a[d+56|0]&1;c[d+52>>2]=1073741824;oe(c[d+68>>2]|0)}}return}function pf(b){b=b|0;var d=0,e=0,f=0;d=b;c[d+72>>2]=0;b=0;while(1){if((b|0)>=3){break}e=d+(b*24|0)|0;f=0;while(1){if((f|0)>=3){break}a[e+f|0]=0;f=f+1|0}c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=1;c[e+20>>2]=0;b=b+1|0}return}function pg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=d;d=e;e=b;b=o_(e,c[e+48>>2]|0)|0;if((c[e+8>>2]|0)!=0){iv(c[e+8>>2]|0);if((b|0)!=0){jb(e+72|0,f,b,c[e+8>>2]|0)}}else{a[e+45|0]=1}f=f+(c[e+16>>2]|0)|0;if((f|0)>=(d|0)){g=f;h=d;i=g-h|0;j=e;k=j+16|0;c[k>>2]=i;return}b=c[e+36>>2]|0;do{if(a[e+45|0]&1){if(a[e+44|0]&1){l=663;break}m=(d-f+(c[e+28>>2]|0)-1|0)/(c[e+28>>2]|0)|0;b=((b-1+8-((m|0)%8|0)|0)%8|0)+1|0;f=f+(aq(m,c[e+28>>2]|0)|0)|0}else{l=663}}while(0);if((l|0)==663){l=c[e+8>>2]|0;m=c[e+28>>2]|0;n=c[e+40>>2]|0;o=c[e+48>>2]|0;do{if(!(a[e+45|0]&1)){p=((n&1)<<2)-2|0;n=n>>1;if((o+p|0)>>>0<=127){o=o+p|0;jc(e+72|0,f,p,l)}}f=f+m|0;p=b-1|0;b=p;if((p|0)==0){b=8;if(a[e+44|0]&1){a[e+45|0]=0;n=c[e+32>>2]|0;a[e+44|0]=0;if((l|0)==0){a[e+45|0]=1}pe(e)}else{a[e+45|0]=1}}}while((f|0)<(d|0));c[e+48>>2]=o;c[e+20>>2]=o;c[e+40>>2]=n}c[e+36>>2]=b;g=f;h=d;i=g-h|0;j=e;k=j+16|0;c[k>>2]=i;return}function ph(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;g=e;e=f;f=d;d=b[26312+((a[f+2|0]&15)<<1)>>1]|0;if((c[f+8>>2]|0)==0){g=g+(c[f+16>>2]|0)|0;c[f+16>>2]=g+(aq((e-g+d-1|0)/(d|0)|0,d)|0)-e;return}iv(c[f+8>>2]|0);h=oX(f)|0;if((c[f+32>>2]&1|0)!=0){i=h}else{i=0}j=i;i=o_(f,j)|0;if((i|0)!=0){jb(f+40|0,g,i,c[f+8>>2]|0)}g=g+(c[f+16>>2]|0)|0;if((g|0)<(e|0)){if((h|0)!=0){i=c[f+8>>2]|0;k=kM(i,d)|0;l=ch(i,g)|0;m=c[f+32>>2]|0;n=(j<<1)-h|0;j=(a[f+2|0]&128|0)!=0?8:13;do{g=g+d|0;if((m+1&2|0)!=0){n=-n|0;jA(f+40|0,l,n,i)}l=l+k|0;m=(m<<j^m<<14)&16384|m>>1;}while((g|0)<(e|0));c[f+20>>2]=n+h>>1;c[f+32>>2]=m}else{g=g+(aq((e-g+d-1|0)/(d|0)|0,d)|0)|0;if((a[f+2|0]&128|0)==0){c[f+32>>2]=(c[f+32>>2]<<13^c[f+32>>2]<<14)&16384|c[f+32>>2]>>1}}}c[f+16>>2]=g-e;return}function pi(a){a=a|0;var b=0;b=a;jv(b+80|0);io(b+640|0);pj(b,0);pk(b,1.0);pf(b);return}function pj(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;a=0;while(1){if((a|0)>=3){break}pm(b,a,c);a=a+1|0}return}function pk(a,b){a=a|0;b=+b;var c=0.0,d=0;c=b;d=a;ji(d+80|0,.006238709677419354*c);iE(d+640|0,.0064466666666666665*c);return}function pl(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;g=e;e=f;f=b;b=c[g+4>>2]|0;if((b|0)==0){return}iv(b);h=a[g|0]&15;if((a[g+2|0]&128|0)==0){h=0}i=a[g|0]&128;j=((d[g|0]|0)>>4&7)+1|0;do{if((i|0)!=0){k=718}else{if((c[g+16>>2]|0)<(j|0)){k=718;break}l=0}}while(0);if((k|0)==718){l=h}k=l-(c[g+12>>2]|0)|0;l=c[f+72>>2]|0;if((k|0)!=0){m=g+12|0;c[m>>2]=(c[m>>2]|0)+k;ix(f+640|0,l,k,b)}l=l+(c[g+8>>2]|0)|0;c[g+8>>2]=0;k=pp(g)|0;if((h|0)==0){return}if((i|0)!=0){return}if((k|0)<=4){return}if((l|0)<(e|0)){i=c[g+16>>2]|0;do{i=i+1|0;if((i|0)==16){i=0;c[g+12>>2]=h;ix(f+640|0,l,h,b)}if((i|0)==(j|0)){c[g+12>>2]=0;ix(f+640|0,l,-h|0,b)}l=l+k|0;}while((l|0)<(e|0));c[g+16>>2]=i}c[g+8>>2]=l-e;return}function pm(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=3){a5(1376,78,15304,904)}c[a+(e*24|0)+4>>2]=d;return}function pn(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)<(c[b+72>>2]|0)){a5(3216,48,15208,8824)}pl(b,b|0,d);pl(b,b+24|0,d);ps(b,d);c[b+72>>2]=d;return}function po(d,e){d=d|0;e=e|0;var f=0,g=0,h=0;f=e;e=d;a[f+9|0]=c[e+68>>2]&255;d=0;while(1){if((d|0)>=3){break}g=e+(d*24|0)|0;h=0;while(1){if((h|0)>=3){break}a[f+(d*3|0)+h|0]=a[g+h|0]|0;h=h+1|0}b[f+10+(d<<1)>>1]=c[g+8>>2]&65535;a[f+16+d|0]=c[g+16>>2]&255;d=d+1|0}return}function pp(b){b=b|0;var c=0;c=b;return((a[c+2|0]&15)<<8)+(d[c+1|0]|0)+1|0}function pq(a){a=a|0;var b=0;b=a;c[b+2056>>2]=b+2060;return}function pr(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=a;c[e+1368>>2]=d;c[e+1364>>2]=b;return}function ps(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=d;d=b;b=d+48|0;f=c[b+4>>2]|0;if((f|0)==0){return}iv(f);g=c[b+20>>2]|0;h=a[b|0]&63;i=c[d+72>>2]|0;j=c[b+12>>2]|0;do{if((a[b+2|0]&128|0)!=0){if((h|g|0)==0){k=765;break}i=i+(c[b+8>>2]|0)|0;if((i|0)<(e|0)){l=(pp(b)|0)<<1;m=c[b+16>>2]|0;do{n=m-1|0;m=n;if((n|0)==0){m=7;g=0}n=(g>>3)-j|0;if((n|0)!=0){j=g>>3;jb(d+80|0,i,n,f)}i=i+l|0;g=g+h&255;}while((i|0)<(e|0));c[b+16>>2]=m;c[b+20>>2]=g}c[b+8>>2]=i-e}else{k=765}}while(0);if((k|0)==765){c[b+8>>2]=0;k=(g>>3)-j|0;j=g>>3;jb(d+80|0,i,k,f)}c[b+12>>2]=j;return}function pt(b,f){b=b|0;f=f|0;var g=0,h=0,i=0;g=f;f=b;pf(f);c[f+68>>2]=d[g+9|0]|0;b=0;while(1){if((b|0)>=3){break}h=f+(b*24|0)|0;i=0;while(1){if((i|0)>=3){break}a[h+i|0]=a[g+(b*3|0)+i|0]|0;i=i+1|0}c[h+8>>2]=e[g+10+(b<<1)>>1]|0;c[h+16>>2]=d[g+16+b|0]|0;b=b+1|0}if((c[f+64>>2]|0)!=0){return}c[f+64>>2]=1;return}function pu(){hH(29456,-1.0,80.0);return}function pv(){hH(29536,-15.0,80.0);return}function pw(a,b){a=a|0;b=b|0;return d[ow(a+336|0,b)|0]|0|0}function px(a){a=a|0;qn(a);return}function py(a){a=a|0;qm(a);return}function pz(a){a=a|0;var b=0;b=a;a=c[b+2632>>2]|0;if((a|0)!=0){pA(a)}c[b+2632>>2]=0;a=c[b+2628>>2]|0;if((a|0)!=0){pB(a)}c[b+2628>>2]=0;a=c[b+2636>>2]|0;if((a|0)!=0){pC(a)}c[b+2636>>2]=0;pD(b+2604|0);hJ(b);return}function pA(a){a=a|0;vk(a);return}function pB(a){a=a|0;vk(a);return}function pC(a){a=a|0;vk(a);return}function pD(a){a=a|0;c9(a|0);return}function pE(a,b,c){a=a|0;b=b|0;c=c|0;pF(a+5448|0,b);return 0}function pF(b,c){b=b|0;c=c|0;var d=0;d=b;b=c;gm(b+272|0,d+14|0,32);gm(b+784|0,d+46|0,32);gm(b+1040|0,d+78|0,32);if((a[d+123|0]|0)==0){return}gn(b+16|0,4136);return}function pG(b,d){b=b|0;d=+d;var e=0.0,f=0,g=0,i=0,j=0.0;e=d;f=b;b=jD(f+5558|0)|0;g=16666;h[f+2568>>3]=1789772.72727;c[f+2592>>2]=357366;if(a[f+2576|0]&1){c[f+2592>>2]=398964;h[f+2568>>3]=1662607.125;g=2e4;b=jD(f+5568|0)|0}if((b|0)==0){b=g}do{if((b|0)==(g|0)){if(e!=1.0){break}i=f+2640|0;j=e;oa(i,j);return}}while(0);c[f+2592>>2]=~~(+(b>>>0>>>0)*+h[f+2568>>3]/(e*83333.33333333333));i=f+2640|0;j=e;oa(i,j);return}function pH(b,c,d,e,f){b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;g=d;d=e;e=b;if(g>>>0>=3){a5(3216,57,15144,6056)}if(d>>>0>=3){a5(3216,58,15144,4536)}pn(e,c);a[e+(g*24|0)+d|0]=f&255;return}function pI(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+72>>2]|0)){pn(b,d)}if((c[b+72>>2]|0)<(d|0)){a5(3216,69,15256,3608)}a=b+72|0;c[a>>2]=(c[a>>2]|0)-d;return}function pJ(a){a=a|0;var b=0;b=a;pq(b+336|0);cJ(b);c[b>>2]=20704;px(b+2604|0);nX(b+2640|0);c[b+2632>>2]=0;c[b+2628>>2]=0;c[b+2636>>2]=0;jF(b,c[86]|0);jH(b,6);pr(b+2640|0,28,b);hK(b,29456);le(b,1.4);wg(b+13768|0,-14|0,2056);return}function pK(a){a=a|0;var b=0;b=a;pL(b);cK(b);return}function pL(a){a=a|0;var b=0;b=a;c[b>>2]=20704;bQ[c[(c[b>>2]|0)+8>>2]&511](b);py(b+2604|0);cP(b);return}function pM(a){a=a|0;return vi(a)|0}function pN(a){a=a|0;return vi(a)|0}function pO(a){a=a|0;return vi(a)|0}function pP(a){a=a|0;qd(a);return}function pQ(a,b){a=a|0;b=+b;iE(a+56|0,.001979166666666667*b);return}function pR(b,e){b=b|0;e=e|0;var f=0,g=0,i=0,j=0,k=0,l=0,m=0;f=b;b=pS(f+2604|0,e,128,f+5448|0,0)|0;if((b|0)!=0){g=b;i=g;return i|0}gd(f,d[f+5454|0]|0);b=pT(f+5448|0)|0;if((b|0)!=0){g=b;i=g;return i|0}if((d[f+5453|0]|0)!=1){gA(f,6408)}b=p_(f)|0;if((b|0)!=0){g=b;i=g;return i|0}b=jD(f+5456|0)|0;c[f+2556>>2]=jD(f+5458|0)|0;c[f+2560>>2]=jD(f+5460|0)|0;if((b|0)==0){b=32768}if((c[f+2556>>2]|0)==0){c[f+2556>>2]=32768}if((c[f+2560>>2]|0)==0){c[f+2560>>2]=32768}do{if(b>>>0>=32768){if((c[f+2556>>2]|0)>>>0<32768){break}pU(f+2604|0,(b>>>0)%4096|0);e=(oz(f+2604|0)|0)/4096|0;j=((b-32768|0)>>>0)/4096|0;k=0;while(1){if((k|0)>=8){break}l=k-j|0;if(l>>>0>=e>>>0){l=0}a[f+2548+k|0]=l&255;if((a[f+5560+k|0]|0)!=0){m=902;break}k=k+1|0}if((m|0)==902){k=f+2548|0;e=f+5560|0;wh(k|0,e|0,8)|0}a[f+2576|0]=(a[f+5570|0]&3|0)==1|0;a[f+5570|0]=0;hV(f,+j_(f));g=c5(f,~~(+h[f+2568>>3]+.5))|0;i=g;return i|0}}while(0);m=fj(f)|0;if((m|0)==0){m=6176}g=m;i=g;return i|0}function pS(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return c8(a,b,c,d,e,4104)|0}function pT(a){a=a|0;var b=0,d=0;if((wk(a|0,4416,5)|0)!=0){b=c[74]|0;d=b;return d|0}else{b=0;d=b;return d|0}return 0}function pU(a,b){a=a|0;b=b|0;db(a,b,4096);return}function pV(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;n3(b+2640|0,d);if((c[b+2628>>2]|0)!=0){pW(c[b+2628>>2]|0,d)}if((c[b+2632>>2]|0)!=0){pX(c[b+2632>>2]|0,d)}if((c[b+2636>>2]|0)==0){return}pY(c[b+2636>>2]|0,d);return}function pW(a,b){a=a|0;b=b|0;qc(a+232|0,b);return}function pX(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;jl(b+80|0,c);jk(b+640|0,c);return}function pY(a,b){a=a|0;b=b|0;jk(a+56|0,b);return}function pZ(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;f=b;b=d;d=a;if((f|0)<5){n9(d+2640|0,f,b);return}f=f-5|0;do{if((c[d+2636>>2]|0)!=0){if((f|0)>=3){break}p$(c[d+2636>>2]|0,f,b);return}}while(0);do{if((c[d+2632>>2]|0)!=0){if((f|0)>=3){f=f-3|0;break}a=f-1|0;f=a;if((a|0)<0){f=2}pm(c[d+2632>>2]|0,f,b);return}}while(0);if((c[d+2628>>2]|0)==0){return}if((f|0)>=8){return}oT(c[d+2628>>2]|0,f,b);return}function p_(b){b=b|0;var e=0,f=0.0,g=0,h=0,i=0,j=0,k=0,l=0;e=b;if(((d[e+5571|0]|0)&-50|0)!=0){gA(e,3088)}jI(e,5);hu(e,17112);jG(e,17136);f=+jJ(e);if((a[e+5571|0]&49|0)!=0){jI(e,8)}do{if((a[e+5571|0]&16|0)!=0){b=pM(1048)|0;g=0;if((b|0)==0){h=0}else{g=1;g=b;oN(g);h=g}c[e+2628>>2]=h;if((c[e+2628>>2]|0)==0){i=1360;j=i;return j|0}else{f=f*.75;jI(e,13);hu(e,17328);break}}}while(0);if((a[e+5571|0]&1|0)!=0){h=pN(1456)|0;g=0;if((h|0)==0){k=0}else{g=1;g=h;pi(g);k=g}c[e+2632>>2]=k;if((c[e+2632>>2]|0)==0){i=1360;j=i;return j|0}f=f*.75;jI(e,8);hu(e,17296);if((a[e+5571|0]&16|0)!=0){jI(e,16);hu(e,17232)}}do{if((a[e+5571|0]&32|0)!=0){k=pO(872)|0;g=0;if((k|0)==0){l=0}else{g=1;g=k;pP(g);l=g}c[e+2636>>2]=l;if((c[e+2636>>2]|0)==0){i=1360;j=i;return j|0}else{f=f*.75;jI(e,8);hu(e,17200);break}}}while(0);if((c[e+2628>>2]|0)!=0){oQ(c[e+2628>>2]|0,f)}if((c[e+2632>>2]|0)!=0){pk(c[e+2632>>2]|0,f)}if((c[e+2636>>2]|0)!=0){pQ(c[e+2636>>2]|0,f)}n1(e+2640|0,f);i=0;j=i;return j|0}function p$(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=3){a5(5256,77,15456,5128)}c[a+24+(e<<3)>>2]=d;return}function p0(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function p1(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function p2(a,b){a=a|0;b=b|0;c[a+100>>2]=b;return}function p3(b,c){b=b|0;c=c|0;a[b+17|0]=c&255;return}function p4(a,b){a=a|0;b=b|0;var d=0;d=a;c[(c[d+2056>>2]|0)+136>>2]=b-(c[(c[d+2056>>2]|0)+132>>2]|0);return}function p5(a){a=a|0;return c[a+2208>>2]|0}function p6(a){a=a|0;c[a+2208>>2]=0;return}function p7(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=b;b=d;d=a;do{if((c[d+2628>>2]|0)!=0){a=e;if((a|0)==18432){f=c[d+2628>>2]|0;p8(f,ox(d+336|0)|0,b);return}else if((a|0)==63488){p2(c[d+2628>>2]|0,b);return}else{break}}}while(0);do{if(e>>>0>=49152){if((c[d+2636>>2]|0)==0){break}a=e&57344;if((a|0)==57344){f=c[d+2636>>2]|0;p9(f,ox(d+336|0)|0,b);return}else if((a|0)==49152){p3(c[d+2636>>2]|0,b);return}else{break}}}while(0);if((c[d+2632>>2]|0)!=0){a=e&4095;f=((e-36864|0)>>>0)/4096|0;do{if(f>>>0<3){if(a>>>0>=3){break}g=c[d+2632>>2]|0;pH(g,ox(d+336|0)|0,f,a,b);return}}while(0)}do{if((e|0)!=32768){if((e|0)==32769){break}do{if((e|0)!=18432){if((e|0)==63488){break}if((e|0)!=65528){return}return}}while(0);return}}while(0);return}function p8(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;e=b;oR(e,c);a[oJ(e)|0]=d&255;return}function p9(b,c,e){b=b|0;c=c|0;e=e|0;var f=0;f=b;if((d[f+17|0]|0)>>>0>=14){return}else{oS(f,c);a[f+(d[f+17|0]|0)|0]=e&255;return}}function qa(e,f){e=e|0;f=f|0;var g=0,h=0,i=0;g=f;f=e;e=c6(f,g)|0;if((e|0)!=0){h=e;i=h;return i|0}wg(f+336|0,0,2048);wg(f+5576|0,0,8192);oF(f+336|0,f+13768|0);oG(f+336|0,24576,8192,f+5576|0,0);e=0;while(1){if((e|0)>=8){break}oD(f,e+24568|0,d[f+2548+e|0]|0);e=e+1|0}n2(f+2640|0,a[f+2576|0]&1,(a[f+5570|0]&32|0)!=0?63:0);oi(f+2640|0,0,16405,15);oi(f+2640|0,0,16407,(a[f+5570|0]&16|0)!=0?128:0);if((c[f+2628>>2]|0)!=0){oK(c[f+2628>>2]|0)}if((c[f+2632>>2]|0)!=0){pf(c[f+2632>>2]|0)}if((c[f+2636>>2]|0)!=0){oM(c[f+2636>>2]|0)}c[f+2600>>2]=4;c[f+2596>>2]=0;c[f+2588>>2]=(c[f+2592>>2]|0)/12|0;b[f+2578>>1]=24568;a[f+847|0]=95;a[f+846|0]=-9;a[f+2390|0]=-3;b[f+2384>>1]=c[f+2556>>2]&65535;a[f+2386|0]=g&255;a[f+2387|0]=a[f+2576|0]&1;h=0;i=h;return i|0}function qb(d,f,g){d=d|0;f=f|0;g=g|0;var h=0,i=0;g=f;f=d;p4(f+336|0,0);while(1){d=ox(f+336|0)|0;if((d|0)>=(c[g>>2]|0)){break}d=p0(c[f+2588>>2]|0,c[g>>2]|0)|0;d=p1(d,(ox(f+336|0)|0)+32767|0)|0;if(oH(f+336|0,d)|0){if((e[f+2384>>1]|0|0)!=24568){gA(f,5864);h=f+2384|0;b[h>>1]=(b[h>>1]|0)+1&65535}else{c[f+2600>>2]=1;if((e[f+2578>>1]|0|0)!=24568){h=f+2384|0;i=f+2578|0;b[h>>1]=b[i>>1]|0;b[h+2>>1]=b[i+2>>1]|0;b[h+4>>1]=b[i+4>>1]|0;b[h+6>>1]=b[i+6>>1]|0;b[f+2578>>1]=24568}else{p4(f+336|0,d)}}}d=ox(f+336|0)|0;if((d|0)>=(c[f+2588>>2]|0)){d=((c[f+2592>>2]|0)+(c[f+2596>>2]|0)|0)/12|0;c[f+2596>>2]=(c[f+2592>>2]|0)-(d*12|0);i=f+2588|0;c[i>>2]=(c[i>>2]|0)+d;do{if((c[f+2600>>2]|0)!=0){d=f+2600|0;i=(c[d>>2]|0)-1|0;c[d>>2]=i;if((i|0)!=0){break}if((e[f+2384>>1]|0|0)!=24568){i=f+2578|0;d=f+2384|0;b[i>>1]=b[d>>1]|0;b[i+2>>1]=b[d+2>>1]|0;b[i+4>>1]=b[d+4>>1]|0;b[i+6>>1]=b[d+6>>1]|0}b[f+2384>>1]=c[f+2560>>2]&65535;d=f+2390|0;i=a[d]|0;a[d]=i-1&255;a[f+336+((i&255)+256)|0]=95;i=f+2390|0;d=a[i]|0;a[i]=d-1&255;a[f+336+((d&255)+256)|0]=-9}}while(0)}}if((p5(f+336|0)|0)!=0){p6(f+336|0);gA(f,5864)}c[g>>2]=ox(f+336|0)|0;d=f+2588|0;c[d>>2]=(c[d>>2]|0)-(c[g>>2]|0);if((c[f+2588>>2]|0)<0){c[f+2588>>2]=0}ol(f+2640|0,c[g>>2]|0);if((c[f+2628>>2]|0)!=0){oU(c[f+2628>>2]|0,c[g>>2]|0)}if((c[f+2632>>2]|0)!=0){pI(c[f+2632>>2]|0,c[g>>2]|0)}if((c[f+2636>>2]|0)==0){return 0}qf(c[f+2636>>2]|0,c[g>>2]|0);return 0}function qc(a,b){a=a|0;b=b|0;cF(a|0,b);return}function qd(a){a=a|0;var b=0;b=a;io(b+56|0);qe(b,0);pQ(b,1.0);oM(b);return}function qe(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;a=0;while(1){if((a|0)>=3){break}p$(b,a,c);a=a+1|0}return}function qf(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+48>>2]|0)){oS(b,d)}if((c[b+48>>2]|0)<(d|0)){a5(5256,115,15408,5184)}a=b+48|0;c[a>>2]=(c[a>>2]|0)-d;return}function qg(){var a=0,b=0,c=0;a=j6(15824)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;pJ(b);c=b}return c|0}function qh(a){a=a|0;qw(a);return}function qi(a){a=a|0;ql(a);return}function qj(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;e=a;a=b;b=bS[c[(c[a>>2]|0)+12>>2]&255](a,e+316|0,128)|0;if((b|0)==0){if(((d[e+439|0]|0)&-50|0)!=0){gA(e,3088)}gd(e,d[e+322|0]|0);f=pT(e+316|0)|0;g=f;return g|0}if((b|0)==26104){h=c[74]|0}else{h=b}f=h;g=f;return g|0}function qk(a,b,c){a=a|0;b=b|0;c=c|0;pF(a+316|0,b);return 0}function ql(a){a=a|0;ik(a);return}function qm(a){a=a|0;lr(a);return}function qn(a){a=a|0;lt(a);return}function qo(){pu();pv();return}function qp(a){a=a|0;qI(a);return}function qq(a){a=a|0;qH(a);return}function qr(a){a=a|0;qV(a);return}function qs(a){a=a|0;qU(a);return}function qt(b,d){b=b|0;d=d|0;var e=0;e=b;a[e+1188|0]=d&1&1;a[e+6|0]=(gc(e+1168|0)|0)&255;do{if((a[e+6|0]|0)!=0){if(a[e+1188|0]&1){break}return}}while(0);a[e+6|0]=c[e+1184>>2]&255;return}function qu(b,c){b=b|0;c=c|0;var e=0,f=0;e=c;c=b;if(a[c+1188|0]&1){f=e;return f|0}if(e>>>0>=(gc(c+1168|0)|0)>>>0){f=e;return f|0}e=d[dh(c+1168|0,e)|0]|0;f=e;return f|0}function qv(){var a=0,b=0,c=0;a=j6(448)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;qh(b);c=b}return c|0}function qw(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=19888;jF(b,c[86]|0);return}function qx(a){a=a|0;var b=0;b=a;qi(b);cK(b);return}function qy(b){b=b|0;var c=0;c=b;gI(c+1152|0);qp(c+1160|0);f2(c+1168|0);qq(c+1176|0);a[c+1188|0]=0;return}function qz(a){a=a|0;var b=0;b=a;qs(b+1176|0);f3(b+1168|0);qr(b+1160|0);gD(b+1152|0);return}function qA(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function qB(a){a=a|0;var b=0;b=a;a=c[b>>2]|0;c[b>>2]=0;c[b+4>>2]=0;vk(a);return}function qC(a){a=a|0;var b=0;b=a;a=c[b>>2]|0;c[b>>2]=0;c[b+4>>2]=0;vk(a);return}function qD(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;g=i;i=i+80|0;h=g|0;j=g+8|0;k=g+16|0;l=g+32|0;m=g+40|0;n=g+48|0;o=g+64|0;p=e;e=f;f=b;b=p;q=bS[c[(c[b>>2]|0)+12>>2]&255](b,h|0,4)|0;if((q|0)!=0){if((q|0)==26104){r=c[74]|0}else{r=q}s=r;t=s;i=g;return t|0}if((wk(h|0,2800,4)|0)!=0){s=c[74]|0;t=s;i=g;return t|0}gK(f+1152|0);qB(f+1160|0);c9(f+1168|0);qC(f+1176|0);h=f|0;r=h;wh(r|0,16296,128)|0;r=0;while(1){if((r|0)==3){u=1352;break}q=p;v=bS[c[(c[q>>2]|0)+12>>2]&255](q,j|0,8)|0;if((v|0)!=0){u=1244;break}q=lE(j|0)|0;b=lE(j+4|0)|0;if((b|0)==1330007625){if((q|0)<8){u=1248;break}a[k+8|0]=1;a[k+9|0]=0;w=p;x=c[(c[w>>2]|0)+12>>2]|0;y=qA(q,16)|0;z=bS[x&255](w,k,y)|0;if((z|0)!=0){u=1251;break}if((q|0)>16){y=p;A=bY[c[(c[y>>2]|0)+20>>2]&127](y,q-16|0)|0;if((A|0)!=0){u=1256;break}}r=1;a[f+122|0]=a[k+6|0]|0;a[f+123|0]=a[k+7|0]|0;a[f+6|0]=a[k+8|0]|0;c[f+1184>>2]=d[k+8|0]|0;a[f+7|0]=a[k+9|0]|0;y=f+8|0;w=k|0;a[y]=a[w]|0;a[y+1|0]=a[w+1|0]|0;a[y+2|0]=a[w+2|0]|0;a[y+3|0]=a[w+3|0]|0;a[y+4|0]=a[w+4|0]|0;a[y+5|0]=a[w+5|0]|0}else if((b|0)==1263419714){if((q|0)>8){u=1261;break}w=p;B=bS[c[(c[w>>2]|0)+12>>2]&255](w,f+112|0,q)|0;if((B|0)!=0){u=1264;break}}else if((b|0)==1752462689){gI(l);qp(m);w=qJ(p,q,l,m)|0;if((w|0)!=0){s=w;C=1}else{w=qE(m)|0;if((w|0)>3){qK(c[(qY(m,3)|0)>>2]|0,f+896|0,256)}if((w|0)>2){qK(c[(qY(m,2)|0)>>2]|0,f+640|0,256)}if((w|0)>1){qK(c[(qY(m,1)|0)>>2]|0,f+384|0,256)}if((w|0)>0){qK(c[(qY(m,0)|0)>>2]|0,f+128|0,256)}C=6}qr(m);gD(l);w=C;if((w|0)==1){u=1365;break}else if((w|0)!=6){u=1375;break}}else if((b|0)==1701669236){D=qL(f+1176|0,(q|0)/4|0)|0;if((D|0)!=0){u=1301;break}w=p;y=c[(c[w>>2]|0)+12>>2]|0;x=qF(f+1176|0)|0;E=(qG(f+1176|0)|0)<<2;F=bS[y&255](w,x,E)|0;if((F|0)!=0){u=1305;break}}else if((b|0)==1818389620){G=qJ(p,q,f+1152|0,f+1160|0)|0;if((G|0)!=0){u=1310;break}}else if((b|0)==1953721456){H=da(f+1168|0,q)|0;if((H|0)!=0){u=1315;break}E=p;x=c[(c[E>>2]|0)+12>>2]|0;w=dh(f+1168|0,0)|0;I=bS[x&255](E,w,q)|0;if((I|0)!=0){u=1319;break}}else if((b|0)==1096040772){r=2;if((e|0)!=0){dS(n,p,q);dy(o,h,128,n);w=gl(e,o)|0;if((w|0)!=0){s=w;C=1}else{C=0}d4(o);d2(n);w=C;if((w|0)==1){u=1372;break}else if((w|0)!=0){u=1376;break}}else{w=p;J=bY[c[(c[w>>2]|0)+20>>2]&127](w,q)|0;if((J|0)!=0){u=1325;break}}}else if((b|0)==1145980238){r=3}else{b=p;K=bY[c[(c[b>>2]|0)+20>>2]&127](b,q)|0;if((K|0)!=0){u=1348;break}}}if((u|0)==1264){s=B;t=s;i=g;return t|0}else if((u|0)==1251){s=z;t=s;i=g;return t|0}else if((u|0)==1261){s=8560;t=s;i=g;return t|0}else if((u|0)==1244){s=v;t=s;i=g;return t|0}else if((u|0)==1248){s=8560;t=s;i=g;return t|0}else if((u|0)==1256){s=A;t=s;i=g;return t|0}else if((u|0)==1301){s=D;t=s;i=g;return t|0}else if((u|0)==1305){s=F;t=s;i=g;return t|0}else if((u|0)==1310){s=G;t=s;i=g;return t|0}else if((u|0)==1315){s=H;t=s;i=g;return t|0}else if((u|0)==1319){s=I;t=s;i=g;return t|0}else if((u|0)==1325){s=J;t=s;i=g;return t|0}else if((u|0)==1348){s=K;t=s;i=g;return t|0}else if((u|0)==1352){s=0;t=s;i=g;return t|0}else if((u|0)==1365){t=s;i=g;return t|0}else if((u|0)==1372){t=s;i=g;return t|0}else if((u|0)==1375){return 0}else if((u|0)==1376){return 0}return 0}function qE(a){a=a|0;return c[a+4>>2]|0}function qF(a){a=a|0;return c[a>>2]|0}function qG(a){a=a|0;return c[a+4>>2]|0}function qH(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;return}function qI(a){a=a|0;var b=0;b=a;c[b>>2]=0;c[b+4>>2]=0;return}function qJ(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;g=d;d=e;e=f;f=g3(d,g+1|0)|0;if((f|0)!=0){h=f;i=h;return i|0}a[re(d,g)|0]=0;f=b;b=c[(c[f>>2]|0)+12>>2]|0;j=re(d,0)|0;k=bS[b&255](f,j,g)|0;if((k|0)!=0){h=k;i=h;return i|0}k=q8(e,128)|0;if((k|0)!=0){h=k;i=h;return i|0}k=0;j=0;while(1){if((j|0)>=(g|0)){l=1409;break}if((qE(e)|0)<=(k|0)){m=q8(e,k<<1)|0;if((m|0)!=0){l=1399;break}}f=re(d,j)|0;b=k;k=b+1|0;c[(qY(e,b)|0)>>2]=f;while(1){if((j|0)<(g|0)){n=(a[re(d,j)|0]|0)!=0}else{n=0}if(!n){break}j=j+1|0}j=j+1|0}if((l|0)==1409){h=q8(e,k)|0;i=h;return i|0}else if((l|0)==1399){h=m;i=h;return i|0}return 0}function qK(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;e=c;c=d;a[e+(c-1)|0]=0;wl(e|0,b|0,c-1|0)|0;return}function qL(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=vl(c[b>>2]|0,d<<2)|0;do{if((a|0)==0){if((d|0)==0){break}e=3520;f=e;return f|0}}while(0);c[b>>2]=a;c[b+4>>2]=d;e=0;f=e;return f|0}function qM(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=a;a=qu(b,d)|0;if(a>>>0<(qG(b+1176|0)|0)>>>0){d=lE(qZ(b+1176|0,a)|0)|0;if((d|0)>0){c[e+4>>2]=d}}if(a>>>0<(qE(b+1160|0)|0)>>>0){gn(e+528|0,c[(qY(b+1160|0,a)|0)>>2]|0)}gm(e+272|0,b+128|0,256);gm(e+784|0,b+384|0,256);gm(e+1040|0,b+640|0,256);gm(e+1552|0,b+896|0,256);return 0}function qN(b){b=b|0;var c=0;c=b;if(!(a[c+17016|0]&1)){qO(c+15824|0)}pz(c);return}function qO(a){a=a|0;var b=0;b=a;gK(b+1152|0);qB(b+1160|0);c9(b+1168|0);qC(b+1176|0);return}function qP(a,b,c){a=a|0;b=b|0;c=c|0;return qM(a+15824|0,b,c)|0}function qQ(b,c){b=b|0;c=c|0;var d=0,e=0,f=0;d=c;c=b;if(a[c+17016|0]&1){e=pR(c,d)|0;f=e;return f|0}else{a[c+17016|0]=1;b=qD(c+15824|0,d,c)|0;a[c+17016|0]=0;qR(c,0);e=b;f=e;return f|0}return 0}function qR(a,b){a=a|0;b=b|0;var c=0;c=a;qt(c+15824|0,b&1);gd(c,d[c+15830|0]|0);return}function qS(a){a=a|0;var b=0;b=a;qR(b,1);cY(b);return}function qT(a,b){a=a|0;b=b|0;var c=0;c=a;return qa(c,qu(c+15824|0,b)|0)|0}function qU(a){a=a|0;vk(c[a>>2]|0);return}function qV(a){a=a|0;vk(c[a>>2]|0);return}function qW(a){a=a|0;q3(a);return}function qX(a){a=a|0;rd(a);return}function qY(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if(d>>>0>(c[b+4>>2]|0)>>>0){a5(5912,58,11128,4424);return 0}return(c[b>>2]|0)+(d<<2)|0}function qZ(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if(d>>>0>(c[b+4>>2]|0)>>>0){a5(5912,58,11304,4424);return 0}return(c[b>>2]|0)+(d<<2)|0}function q_(b){b=b|0;var d=0;d=b;pJ(d);c[d>>2]=19784;qy(d+15824|0);a[d+17016|0]=0;jF(d,c[84]|0);return}function q$(a){a=a|0;var b=0;b=a;q0(b);cK(b);return}function q0(a){a=a|0;var b=0;b=a;c[b>>2]=19784;qz(b+15824|0);pL(b);return}function q1(){var a=0,b=0,c=0;a=j6(17024)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;q_(b);c=b}return c|0}function q2(){var a=0,b=0,c=0;a=j6(1512)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;qW(b);c=b}return c|0}function q3(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=19256;qy(b+316|0);jF(b,c[84]|0);return}function q4(a){a=a|0;var b=0;b=a;qX(b);cK(b);return}function q5(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;e=b;b=c;c=d;d=1;do{f=0;g=0;do{f=f|(d&1)<<g;d=d>>>1^e&-(d&1);h=g;g=h+1|0;}while((h|0)<7);g=c;c=g+1|0;a[g]=f&255;g=b-1|0;b=g;}while((g|0)!=0);return}function q6(a,b){a=a|0;b=b|0;var c=0,e=0,f=0;c=a;a=qD(c+316|0,b,0)|0;if((a|0)!=0){e=a;f=e;return f|0}qt(c+316|0,0);gd(c,d[c+322|0]|0);e=0;f=e;return f|0}function q7(a,b,c){a=a|0;b=b|0;c=c|0;return qM(a+316|0,b,c)|0}function q8(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;a=vl(c[b>>2]|0,d<<2)|0;do{if((a|0)==0){if((d|0)==0){break}e=3520;f=e;return f|0}}while(0);c[b>>2]=a;c[b+4>>2]=d;e=0;f=e;return f|0}function q9(a){a=a|0;var b=0;b=a;io(b|0);q5(12,2,b+816|0);q5(264,64,b+818|0);q5(67584,16384,b+882|0);return}function ra(a){a=a|0;var b=0;b=a;c[b+80>>2]=0;a=0;while(1){if((a|0)>=4){break}rf(b,a,0);a=a+1|0}return}function rb(a,b){a=a|0;b=b|0;var d=0;d=a;c[d+80>>2]=b;c[d+84>>2]=0;c[d+88>>2]=0;c[d+92>>2]=0;c[d+96>>2]=0;c[d+100>>2]=0;b=0;while(1){if((b|0)>=4){break}wg(d+(b*20|0)|0,0,16);b=b+1|0}return}function rc(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;f=e;e=b;rh(e);b=c[e+80>>2]|0;g=b+882|0;h=131071;if((c[e+100>>2]&128|0)!=0){h=511;g=b+818|0}i=e+96|0;c[i>>2]=(c[i>>2]|0)%(h|0)|0;i=0;while(1){if((i|0)>=4){break}j=e+(i*20|0)|0;k=(c[e+84>>2]|0)+(c[j+8>>2]|0)|0;l=c[j+12>>2]|0;m=c[j+16>>2]|0;if((m|0)!=0){iv(m);n=d[j+1|0]|0;o=(n&15)<<1;do{if((o|0)!=0){if((n&16|0)!=0){p=1558;break}if((n&160|0)==160){if((l|0)<74){p=1558;break}}q=0;r=f;if((c[e+100>>2]&d[17096+i|0]|0)!=0){q=c[j+52>>2]|0;r=(c[e+84>>2]|0)+(c[j+48>>2]|0)|0;if((a[j+3|0]|0)!=0){s=j+4|0;c[s>>2]=(c[s>>2]|0)-o;o=-o|0}}if((k|0)<(f|0)){p=1569}else{if((r|0)<(f|0)){p=1569}}if((p|0)==1569){p=0;s=17088;t=16;u=a[j+2|0]&1;v=1;if((n&32|0)==0){s=g;t=h;u=c[e+96>>2]|0;if((n&64|0)!=0){s=b+816|0;t=15;u=c[e+92>>2]|0}v=(l|0)%(t|0)|0;u=(u+(c[j+8>>2]|0)|0)%(t|0)|0}v=v-t|0;w=377253537;x=0;if((n&128|0)==0){w=rg(w,((c[j+8>>2]|0)+(c[e+88>>2]|0)|0)%31|0)|0;x=(l|0)%31|0}y=c[j+4>>2]|0;do{if((r|0)<(k|0)){z=-y|0;if((o|0)<0){z=z+o|0}if((z|0)!=0){y=y+(z-o)|0;o=-o|0;ix(b|0,r,z,m)}}while(1){if((r|0)>(k|0)){break}r=r+q|0}z=f;if((z|0)>(r|0)){z=r}while(1){if((k|0)>=(z|0)){break}if((w&1|0)!=0){A=o&-(d[s+(u>>3)|0]>>(u&7)&1);B=u+v|0;u=B;if((B|0)<0){u=u+t|0}B=A-y|0;if((B|0)!=0){y=A;ix(b|0,k,B,m)}}w=rg(w,x)|0;k=k+l|0}if((k|0)<(f|0)){C=1}else{C=(r|0)<(f|0)}}while(C);a[j+2|0]=u&255;c[j+4>>2]=y}a[j+3|0]=0;if((o|0)<0){r=j+4|0;c[r>>2]=(c[r>>2]|0)-o;a[j+3|0]=1}}else{p=1558}}while(0);if((p|0)==1558){p=0;if((n&16|0)==0){o=o>>1}r=o-(c[j+4>>2]|0)|0;if((r|0)!=0){c[j+4>>2]=o;ix(b|0,c[e+84>>2]|0,r,m)}}}r=f-k|0;if((r|0)>0){x=(r+l-1|0)/(l|0)|0;r=j+2|0;a[r]=(d[r]^x)&255;k=k+(aq(x,l)|0)|0}c[j+8>>2]=k-f;i=i+1|0}i=f-(c[e+84>>2]|0)|0;c[e+84>>2]=f;c[e+92>>2]=((c[e+92>>2]|0)+i|0)%15|0;c[e+88>>2]=((c[e+88>>2]|0)+i|0)%31|0;f=e+96|0;c[f>>2]=(c[f>>2]|0)+i;return}function rd(a){a=a|0;var b=0;b=a;c[b>>2]=19256;qz(b+316|0);ik(b);return}function re(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if(d>>>0>(c[b+4>>2]|0)>>>0){a5(5912,58,11064,4424);return 0}return(c[b>>2]|0)+d|0}function rf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;if(e>>>0>=4){a5(5816,73,13256,4384)}c[a+(e*20|0)+16>>2]=d;return}function rg(a,b){a=a|0;b=b|0;var c=0;c=a;a=b;return c<<a&2147483647|c>>>((31-a|0)>>>0)|0}function rh(b){b=b|0;var e=0,f=0,g=0,h=0,i=0;e=b;b=28;if((c[e+100>>2]&1|0)!=0){b=114}f=0;while(1){if((f|0)>=4){break}g=e+(f*20|0)|0;h=d[g|0]|0;i=aq(h+1|0,b)|0;if((c[e+100>>2]&(d[17104+f|0]|0)|0)!=0){i=h+4|0;if((f&1|0)!=0){i=(h<<8)+(d[g-20|0]|0)+7|0;if((c[e+100>>2]&(d[17104+(f-1)|0]|0)|0)==0){i=aq(i-6|0,b)|0}(a[g-20+1|0]&31|0)>16}}c[g+12>>2]=i;f=f+1|0}return}function ri(a,b){a=a|0;b=b|0;var c=0;c=b;return d[a+1428+c|0]|0|0}function rj(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;g=e;e=f;f=b;rc(f,d);d=(g^53760)>>>1;if((d|0)<4){a[f+(d*20|0)+(g&1)|0]=e&255;return}if((g|0)==53768){c[f+100>>2]=e}else{if((g|0)==53769){c[f+8>>2]=0;c[f+28>>2]=0;c[f+48>>2]=0;c[f+68>>2]=0}}return}function rk(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;if((d|0)>(c[b+84>>2]|0)){rc(b,d)}a=b+84|0;c[a>>2]=(c[a>>2]|0)-d;return}function rl(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;e=c;c=d;d=b;a[d+1428+e|0]=c&255;if((e>>>8|0)!=210){return}rL(d,e,c);return}function rm(d,e){d=d|0;e=e|0;var f=0;f=d;c[f+8>>2]=f+12;c[f+28>>2]=e;a[f+5|0]=4;a[f+6|0]=-1;b[f>>1]=0;a[f+2|0]=0;a[f+3|0]=0;a[f+4|0]=0;c[f+16>>2]=0;c[f+12>>2]=0;c[f+20>>2]=1073741824;c[f+24>>2]=1073741824;f8();return}function rn(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;h=i;i=i+8|0;j=h|0;k=f;f=0;rs(k,g);g=j;l=k+12|0;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[k+8>>2]=j;l=c[j+4>>2]|0;g=c[k+28>>2]|0;m=e[k>>1]|0;n=d[k+2|0]|0;o=d[k+3|0]|0;p=d[k+4|0]|0;q=(d[k+6|0]|0)+1|256;r=d[k+5|0]|0;s=r&76;t=r<<8;u=t;t=t|~r&2;L1870:while(1){r=c[k+24>>2]|0;do{if((s&4|0)==0){if((r|0)<=(c[k+20>>2]|0)){break}r=c[k+20>>2]|0}}while(0);v=d[g+m|0]|0;m=m+1|0;r=g+m|0;w=d[16832+v|0]|0;x=l+w|0;l=x;do{if((x|0)>=0){if((l|0)<(w|0)){y=1673;break}l=l-w|0;m=m-1|0;c[j+4>>2]=l;z=-1;l=c[j+4>>2]|0;if((z|0)>=0){break}if((l|0)>=0){y=1953;break L1870}continue L1870}else{y=1673}}while(0);L1888:do{if((y|0)==1673){y=0;w=d[r]|0;x=v;do{if((x|0)==177){A=(d[g+w|0]|0)+p|0;l=l+(A>>>8)|0;A=A+((d[g+(w+1&255)|0]|0)<<8)|0;m=m+1|0;B=d[g+A|0]|0;t=B;n=B;if((A^32768)>>>0<=40959){continue L1870}else{y=1735;break}}else if((x|0)==162){y=1754}else if((x|0)==180){w=w+o&255;y=1756}else if((x|0)==148){w=w+o&255;y=1749}else if((x|0)==132){y=1749}else if((x|0)==185){l=l+((w+p|0)>>>8)|0;A=(jD(r)|0)+p|0;m=m+2|0;B=d[g+A|0]|0;t=B;n=B;if((A^32768)>>>0<=40959){continue L1870}else{y=1735;break}}else if((x|0)==164){y=1756}else if((x|0)==160){y=1757}else if((x|0)==188){w=w+o|0;l=l+(w>>>8)|0;y=1759}else if((x|0)==172){y=1759}else if((x|0)==190){w=w+p|0;l=l+(w>>>8)|0;y=1761}else if((x|0)==80){B=(w&255)<<24>>24;C=m+1|0;m=C;if((s&64|0)!=0){y=1666;break}else{m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}}else if((x|0)==181){B=d[g+(w+o&255)|0]|0;t=B;n=B;m=m+1|0;continue L1870}else if((x|0)==165){B=d[g+w|0]|0;t=B;n=B;m=m+1|0;continue L1870}else if((x|0)==208){B=(w&255)<<24>>24;C=m+1|0;m=C;if((t&255)<<24>>24!=0){m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}else{y=1666;break}}else if((x|0)==32){B=m+1|0;m=jD(r)|0;a[g+(256|q-1)|0]=B>>>8&255;q=q-2|256;a[g+q|0]=B&255;continue L1870}else if((x|0)==76){m=jD(r)|0;continue L1870}else if((x|0)==232){B=o+1|0;t=B;o=B&255;continue L1870}else if((x|0)==16){B=(w&255)<<24>>24;C=m+1|0;m=C;if((t&32896|0)!=0){y=1666;break}else{m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}}else if((x|0)==193){B=w+o|0;w=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;y=1696}else if((x|0)==209){B=(d[g+w|0]|0)+p|0;w=B+((d[g+(w+1&255)|0]|0)<<8)|0;l=l+(B>>>8)|0;y=1696}else if((x|0)==213){w=w+o&255;y=1691}else if((x|0)==197){y=1691}else if((x|0)==217){w=w+p|0;y=1694}else if((x|0)==221){w=w+o|0;y=1694}else if((x|0)==205){y=1695}else if((x|0)==201){y=1697}else if((x|0)==48){B=(w&255)<<24>>24;C=m+1|0;m=C;if((t&32896|0)!=0){m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}else{y=1666;break}}else if((x|0)==240){B=(w&255)<<24>>24;C=m+1|0;m=C;if((t&255)<<24>>24!=0){y=1666;break}else{m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}}else if((x|0)==149){w=w+o&255;y=1706}else if((x|0)==133){y=1706}else if((x|0)==200){B=p+1|0;t=B;p=B&255;continue L1870}else if((x|0)==168){p=n;t=n;continue L1870}else if((x|0)==152){n=p;t=p;continue L1870}else if((x|0)==173){m=m+2|0;t=ri(k-336|0,jD(r)|0)|0;n=t;continue L1870}else if((x|0)==96){m=(d[g+q|0]|0)+1|0;m=m+((d[g+(256|q-255)|0]|0)<<8)|0;q=q-254|256;continue L1870}else if((x|0)==153){D=p+(jD(r)|0)|0;m=m+2|0;if(D>>>0<=2047){a[g+D|0]=n&255;continue L1870}else{y=1721;break}}else if((x|0)==141){D=jD(r)|0;m=m+2|0;if(D>>>0<=2047){a[g+D|0]=n&255;continue L1870}else{y=1721;break}}else if((x|0)==157){D=o+(jD(r)|0)|0;m=m+2|0;if(D>>>0<=2047){a[g+D|0]=n&255;continue L1870}else{y=1721;break}}else if((x|0)==145){D=(d[g+w|0]|0)+p+((d[g+(w+1&255)|0]|0)<<8)|0;m=m+1|0;y=1721}else if((x|0)==129){B=w+o|0;D=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;m=m+1|0;y=1721}else if((x|0)==169){m=m+1|0;n=w;t=w;continue L1870}else if((x|0)==161){B=w+o|0;A=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;m=m+1|0;y=1735}else if((x|0)==150){w=w+p&255;y=1751}else if((x|0)==134){y=1751}else if((x|0)==174){y=1761}else if((x|0)==140){E=p;y=1764}else if((x|0)==182){w=w+p&255;y=1753}else if((x|0)==166){y=1753}else if((x|0)==176){B=(w&255)<<24>>24;C=m+1|0;m=C;if((u&256|0)!=0){m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}else{y=1666;break}}else if((x|0)==189){l=l+((w+o|0)>>>8)|0;A=(jD(r)|0)+o|0;m=m+2|0;B=d[g+A|0]|0;t=B;n=B;if((A^32768)>>>0<=40959){continue L1870}else{y=1735;break}}else if((x|0)==142){E=o;y=1764}else if((x|0)==236){B=jD(r)|0;m=m+1|0;c[j+4>>2]=l;w=ri(k-336|0,B)|0;l=c[j+4>>2]|0;y=1770}else if((x|0)==228){w=d[g+w|0]|0;y=1769}else if((x|0)==224){y=1769}else if((x|0)==112){B=(w&255)<<24>>24;C=m+1|0;m=C;if((s&64|0)!=0){m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}else{y=1666;break}}else if((x|0)==144){B=(w&255)<<24>>24;C=m+1|0;m=C;if((u&256|0)!=0){y=1666;break}else{m=m+B|0;l=l+(((C&255)+B|0)>>>8&1)|0;continue L1870}}else if((x|0)==204){B=jD(r)|0;m=m+1|0;c[j+4>>2]=l;w=ri(k-336|0,B)|0;l=c[j+4>>2]|0;y=1774}else if((x|0)==196){w=d[g+w|0]|0;y=1773}else if((x|0)==192){y=1773}else if((x|0)==33){B=w+o|0;w=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;y=1783}else if((x|0)==49){B=(d[g+w|0]|0)+p|0;w=B+((d[g+(w+1&255)|0]|0)<<8)|0;l=l+(B>>>8)|0;y=1783}else if((x|0)==53){w=w+o&255;y=1778}else if((x|0)==37){y=1778}else if((x|0)==57){w=w+p|0;y=1781}else if((x|0)==61){w=w+o|0;y=1781}else if((x|0)==45){y=1782}else if((x|0)==41){y=1784}else if((x|0)==65){B=w+o|0;w=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;y=1794}else if((x|0)==81){B=(d[g+w|0]|0)+p|0;w=B+((d[g+(w+1&255)|0]|0)<<8)|0;l=l+(B>>>8)|0;y=1794}else if((x|0)==85){w=w+o&255;y=1789}else if((x|0)==69){y=1789}else if((x|0)==89){w=w+p|0;y=1792}else if((x|0)==93){w=w+o|0;y=1792}else if((x|0)==77){y=1793}else if((x|0)==73){y=1795}else if((x|0)==1){B=w+o|0;w=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;y=1805}else if((x|0)==17){B=(d[g+w|0]|0)+p|0;w=B+((d[g+(w+1&255)|0]|0)<<8)|0;l=l+(B>>>8)|0;y=1805}else if((x|0)==21){w=w+o&255;y=1800}else if((x|0)==5){y=1800}else if((x|0)==25){w=w+p|0;y=1803}else if((x|0)==29){w=w+o|0;y=1803}else if((x|0)==13){y=1804}else if((x|0)==9){y=1806}else if((x|0)==44){m=m+2|0;s=s&-65;t=ri(k-336|0,jD(r)|0)|0;s=s|t&64;if((n&t|0)!=0){continue L1870}else{t=t<<8;continue L1870}}else if((x|0)==36){t=d[g+w|0]|0;m=m+1|0;s=s&-65;s=s|t&64;if((n&t|0)!=0){continue L1870}else{t=t<<8;continue L1870}}else if((x|0)==225){B=w+o|0;w=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;y=1822}else if((x|0)==241){B=(d[g+w|0]|0)+p|0;w=B+((d[g+(w+1&255)|0]|0)<<8)|0;l=l+(B>>>8)|0;y=1822}else if((x|0)==245){w=w+o&255;y=1817}else if((x|0)==229){y=1817}else if((x|0)==249){w=w+p|0;y=1820}else if((x|0)==253){w=w+o|0;y=1820}else if((x|0)==237){y=1821}else if((x|0)==233){y=1823}else if((x|0)==235){y=1825}else if((x|0)==97){B=w+o|0;w=((d[g+(B+1&255)|0]|0)<<8)+(d[g+(B&255)|0]|0)|0;y=1834}else if((x|0)==113){B=(d[g+w|0]|0)+p|0;w=B+((d[g+(w+1&255)|0]|0)<<8)|0;l=l+(B>>>8)|0;y=1834}else if((x|0)==117){w=w+o&255;y=1829}else if((x|0)==101){y=1829}else if((x|0)==121){w=w+p|0;y=1832}else if((x|0)==125){w=w+o|0;y=1832}else if((x|0)==109){y=1833}else if((x|0)==105){y=1835}else if((x|0)==74){u=0;y=1839}else if((x|0)==106){y=1839}else if((x|0)==10){t=n<<1;u=t;n=t&255;continue L1870}else if((x|0)==42){t=n<<1;B=u>>>8&1;u=t;t=t|B;n=t&255;continue L1870}else if((x|0)==94){w=w+o|0;y=1843}else if((x|0)==78){y=1843}else if((x|0)==110){y=1844}else if((x|0)==62){w=w+o|0;y=1850}else if((x|0)==30){w=w+o|0;y=1848}else if((x|0)==14){y=1848}else if((x|0)==46){y=1849}else if((x|0)==126){w=w+o|0;y=1845}else if((x|0)==118){w=w+o&255;y=1857}else if((x|0)==86){w=w+o&255;y=1855}else if((x|0)==70){y=1855}else if((x|0)==102){y=1856}else if((x|0)==54){w=w+o&255;y=1862}else if((x|0)==22){w=w+o&255;y=1860}else if((x|0)==6){y=1860}else if((x|0)==38){y=1861}else if((x|0)==202){B=o-1|0;t=B;o=B&255;continue L1870}else if((x|0)==136){B=p-1|0;t=B;p=B&255;continue L1870}else if((x|0)==246){w=w+o&255;y=1866}else if((x|0)==230){y=1866}else if((x|0)==214){w=w+o&255;y=1868}else if((x|0)==198){y=1868}else if((x|0)==254){w=o+(jD(r)|0)|0;y=1873}else if((x|0)==238){w=jD(r)|0;y=1873}else if((x|0)==222){w=o+(jD(r)|0)|0;y=1876}else if((x|0)==206){w=jD(r)|0;y=1876}else if((x|0)==170){o=n;t=n;continue L1870}else if((x|0)==138){n=o;t=o;continue L1870}else if((x|0)==154){q=o+1|256;continue L1870}else if((x|0)==186){B=q-1&255;t=B;o=B;continue L1870}else if((x|0)==72){q=q-1|256;a[g+q|0]=n&255;continue L1870}else if((x|0)==104){B=d[g+q|0]|0;t=B;n=B;q=q-255|256;continue L1870}else if((x|0)==64){B=d[g+q|0]|0;m=d[g+(256|q-255)|0]|0;m=m|(d[g+(256|q-254)|0]|0)<<8;q=q-253|256;w=s;s=B&76;t=B<<8;u=t;t=t|~B&2;a[k+5|0]=s&255;if(((w^s)&4|0)!=0){B=c[k+24>>2]|0;do{if((s&4|0)==0){if((B|0)<=(c[k+20>>2]|0)){break}B=c[k+20>>2]|0}}while(0);C=(c[j>>2]|0)-B|0;c[j>>2]=B;l=l+C|0}continue L1870}else if((x|0)==40){C=d[g+q|0]|0;q=q-255|256;F=s^C;s=C&76;t=C<<8;u=t;t=t|~C&2;if((F&4|0)==0){continue L1870}if((s&4|0)!=0){y=1927;break}else{y=1914;break}}else if((x|0)==8){F=s&76;F=F|(t>>>8|t)&128;F=F|u>>>8&1;if((t&255|0)==0){F=F|2}q=q-1|256;a[g+q|0]=(F|48)&255;continue L1870}else if((x|0)==108){w=jD(r)|0;m=d[g+w|0]|0;w=w&65280|w+1&255;m=m|(d[g+w|0]|0)<<8;continue L1870}else if((x|0)==0){if((m-1|0)>>>0>=65279){y=1939;break L1870}m=m+1|0;z=4;break L1888}else if((x|0)==56){u=-1;continue L1870}else if((x|0)==24){u=0;continue L1870}else if((x|0)==184){s=s&-65;continue L1870}else if((x|0)==216){s=s&-9;continue L1870}else if((x|0)==248){s=s|8;continue L1870}else if((x|0)==88){if((s&4|0)!=0){s=s&-5;y=1914;break}else{continue L1870}}else if((x|0)==120){if((s&4|0)!=0){continue L1870}else{s=s|4;y=1927;break}}else if((x|0)==28|(x|0)==60|(x|0)==92|(x|0)==124|(x|0)==220|(x|0)==252){l=l+((w+o|0)>>>8)|0;y=1931}else if((x|0)==12){y=1931}else if((x|0)==116|(x|0)==4|(x|0)==20|(x|0)==52|(x|0)==68|(x|0)==84|(x|0)==100|(x|0)==128|(x|0)==130|(x|0)==137|(x|0)==194|(x|0)==212|(x|0)==226|(x|0)==244){y=1932}else if((x|0)==234|(x|0)==26|(x|0)==58|(x|0)==90|(x|0)==122|(x|0)==218|(x|0)==250){continue L1870}else{y=1934;break L1870}}while(0);if((y|0)==1749){y=0;m=m+1|0;a[g+w|0]=p&255;continue L1870}else if((y|0)==1666){y=0;l=l-1|0;continue L1870}else if((y|0)==1756){y=0;w=d[g+w|0]|0;y=1757}else if((y|0)==1759){y=0;x=w+((d[r+1|0]|0)<<8)|0;m=m+2|0;c[j+4>>2]=l;F=ri(k-336|0,x)|0;t=F;p=F;l=c[j+4>>2]|0;continue L1870}else if((y|0)==1691){y=0;w=d[g+w|0]|0;y=1698}else if((y|0)==1694){y=0;l=l+(w>>>8)|0;y=1695}else if((y|0)==1706){y=0;m=m+1|0;a[g+w|0]=n&255;continue L1870}else if((y|0)==1721){y=0;c[j+4>>2]=l;rl(k-336|0,D,n);l=c[j+4>>2]|0;continue L1870}else if((y|0)==1751){y=0;m=m+1|0;a[g+w|0]=o&255;continue L1870}else if((y|0)==1761){y=0;F=w+((d[r+1|0]|0)<<8)|0;m=m+2|0;c[j+4>>2]=l;x=ri(k-336|0,F)|0;t=x;o=x;l=c[j+4>>2]|0;continue L1870}else if((y|0)==1753){y=0;w=d[g+w|0]|0;y=1754}else if((y|0)==1764){y=0;x=jD(r)|0;m=m+2|0;if(x>>>0<=2047){a[g+x|0]=E&255;continue L1870}else{c[j+4>>2]=l;rl(k-336|0,x,E);l=c[j+4>>2]|0;continue L1870}}else if((y|0)==1769){y=0;y=1770}else if((y|0)==1735){y=0;c[j+4>>2]=l;x=ri(k-336|0,A)|0;t=x;n=x;l=c[j+4>>2]|0;continue L1870}else if((y|0)==1773){y=0;y=1774}else if((y|0)==1778){y=0;w=d[g+w|0]|0;y=1785}else if((y|0)==1781){y=0;l=l+(w>>>8)|0;y=1782}else if((y|0)==1789){y=0;w=d[g+w|0]|0;y=1796}else if((y|0)==1792){y=0;l=l+(w>>>8)|0;y=1793}else if((y|0)==1800){y=0;w=d[g+w|0]|0;y=1807}else if((y|0)==1803){y=0;l=l+(w>>>8)|0;y=1804}else if((y|0)==1817){y=0;w=d[g+w|0]|0;y=1824}else if((y|0)==1820){y=0;l=l+(w>>>8)|0;y=1821}else if((y|0)==1829){y=0;w=d[g+w|0]|0;y=1836}else if((y|0)==1832){y=0;l=l+(w>>>8)|0;y=1833}else if((y|0)==1839){y=0;t=u>>>1&128;u=n<<8;t=t|n>>>1;n=t;continue L1870}else if((y|0)==1843){y=0;u=0;y=1844}else if((y|0)==1848){y=0;u=0;y=1849}else if((y|0)==1855){y=0;u=0;y=1856}else if((y|0)==1860){y=0;u=0;y=1861}else if((y|0)==1866){y=0;t=1;y=1869}else if((y|0)==1868){y=0;t=-1;y=1869}else if((y|0)==1873){y=0;t=1;y=1877}else if((y|0)==1876){y=0;t=-1;y=1877}else if((y|0)==1914){y=0;a[k+5|0]=s&255;x=(c[j>>2]|0)-(c[k+20>>2]|0)|0;do{if((x|0)<=0){if((l+(c[j>>2]|0)|0)<(c[k+20>>2]|0)){continue L1870}else{break}}else{c[j>>2]=c[k+20>>2];l=l+x|0;if((l|0)<0){continue L1870}if((x|0)>=(l+1|0)){F=j|0;c[F>>2]=(c[F>>2]|0)+(l+1);l=-1;c[k+20>>2]=c[j>>2];continue L1870}else{break}}}while(0);continue L1870}else if((y|0)==1927){y=0;a[k+5|0]=s&255;x=(c[j>>2]|0)-(c[k+24>>2]|0)|0;c[j>>2]=c[k+24>>2];l=l+x|0;if((l|0)<0){continue L1870}else{continue L1870}}else if((y|0)==1931){y=0;m=m+1|0;y=1932}if((y|0)==1754){y=0;m=m+1|0;o=w;t=w;continue L1870}else if((y|0)==1757){y=0;m=m+1|0;p=w;t=w;continue L1870}else if((y|0)==1695){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;y=1696}else if((y|0)==1770){y=0;t=o-w|0;m=m+1|0;u=~t;t=t&255;continue L1870}else if((y|0)==1774){y=0;t=p-w|0;m=m+1|0;u=~t;t=t&255;continue L1870}else if((y|0)==1782){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;y=1783}else if((y|0)==1793){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;y=1794}else if((y|0)==1804){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;y=1805}else if((y|0)==1821){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;y=1822}else if((y|0)==1833){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;y=1834}else if((y|0)==1844){y=0;y=1845}else if((y|0)==1849){y=0;y=1850}else if((y|0)==1856){y=0;y=1857}else if((y|0)==1861){y=0;y=1862}else if((y|0)==1869){y=0;t=t+(d[g+w|0]|0)|0;y=1870}else if((y|0)==1877){y=0;c[j+4>>2]=l;t=t+(ri(k-336|0,w)|0)|0;m=m+2|0;rl(k-336|0,w,t&255);l=c[j+4>>2]|0;continue L1870}else if((y|0)==1932){y=0;m=m+1|0;continue L1870}if((y|0)==1696){y=0;c[j+4>>2]=l;w=ri(k-336|0,w)|0;l=c[j+4>>2]|0;y=1697}else if((y|0)==1783){y=0;c[j+4>>2]=l;w=ri(k-336|0,w)|0;l=c[j+4>>2]|0;y=1784}else if((y|0)==1794){y=0;c[j+4>>2]=l;w=ri(k-336|0,w)|0;l=c[j+4>>2]|0;y=1795}else if((y|0)==1805){y=0;c[j+4>>2]=l;w=ri(k-336|0,w)|0;l=c[j+4>>2]|0;y=1806}else if((y|0)==1822){y=0;c[j+4>>2]=l;w=ri(k-336|0,w)|0;l=c[j+4>>2]|0;y=1823}else if((y|0)==1834){y=0;c[j+4>>2]=l;w=ri(k-336|0,w)|0;l=c[j+4>>2]|0;y=1835}else if((y|0)==1845){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;c[j+4>>2]=l;x=ri(k-336|0,w)|0;t=u>>>1&128|x>>1;u=x<<8;y=1851}else if((y|0)==1850){y=0;m=m+1|0;w=w+((d[r+1|0]|0)<<8)|0;t=u>>>8&1;c[j+4>>2]=l;x=(ri(k-336|0,w)|0)<<1;u=x;t=t|x;y=1851}else if((y|0)==1857){y=0;x=d[g+w|0]|0;t=u>>>1&128|x>>1;u=x<<8;y=1870}else if((y|0)==1862){y=0;t=u>>>8&1;x=(d[g+w|0]|0)<<1;u=x;t=t|x;y=1870}if((y|0)==1697){y=0;y=1698}else if((y|0)==1784){y=0;y=1785}else if((y|0)==1795){y=0;y=1796}else if((y|0)==1806){y=0;y=1807}else if((y|0)==1823){y=0;y=1824}else if((y|0)==1835){y=0;y=1836}else if((y|0)==1851){y=0;m=m+1|0;rl(k-336|0,w,t&255);l=c[j+4>>2]|0;continue L1870}else if((y|0)==1870){y=0;m=m+1|0;a[g+w|0]=t&255;continue L1870}if((y|0)==1698){y=0;t=n-w|0;m=m+1|0;u=~t;t=t&255;continue L1870}else if((y|0)==1785){y=0;x=n&w;n=x;t=x;m=m+1|0;continue L1870}else if((y|0)==1796){y=0;x=n^w;n=x;t=x;m=m+1|0;continue L1870}else if((y|0)==1807){y=0;x=n|w;n=x;t=x;m=m+1|0;continue L1870}else if((y|0)==1824){y=0;y=1825}else if((y|0)==1836){y=0}if((y|0)==1825){y=0;w=w^255}x=u>>>8&1;s=s&-65;s=s|(n^128)+x+((w&255)<<24>>24)>>2&64;F=n+w+x|0;t=F;u=F;m=m+1|0;n=t&255;continue L1870}}while(0);l=l+7|0;a[g+(256|q-1)|0]=m>>>8&255;a[g+(256|q-2)|0]=m&255;m=jD(g+65530+z|0)|0;q=q-3|256;w=s&76;w=w|(t>>>8|t)&128;w=w|u>>>8&1;if((t&255|0)==0){w=w|2}w=w|32;if((z|0)!=0){w=w|16}a[g+q|0]=w&255;s=s&-9;s=s|4;a[k+5|0]=s&255;w=(c[j>>2]|0)-(c[k+24>>2]|0)|0;c[j>>2]=c[k+24>>2];l=l+w|0}if((y|0)==1934){if(v>>>0>255){a5(2656,935,13224,8504);return 0}f=1;m=m-1|0}else if((y|0)==1939){m=m-1|0}c[j+4>>2]=l;b[k>>1]=m&65535;a[k+6|0]=q-1&255;a[k+2|0]=n&255;a[k+3|0]=o&255;a[k+4|0]=p&255;p=s&76;p=p|(t>>>8|t)&128;p=p|u>>>8&1;if((t&255|0)==0){p=p|2}a[k+5|0]=p&255;p=k+12|0;t=j;c[p>>2]=c[t>>2];c[p+4>>2]=c[t+4>>2];c[k+8>>2]=k+12;i=h;return f&1|0}function ro(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;do{if((d|0)<(f|0)){if((a[e+5|0]&4|0)!=0){break}f=d}}while(0);d=(c[c[e+8>>2]>>2]|0)-f|0;c[c[e+8>>2]>>2]=f;return d|0}function rp(a){a=a|0;var b=0;b=a;c[b+8>>2]=b+12;return}function rq(a,b){a=a|0;b=+b;c[a+952>>2]=~~(114.0/b);return}function rr(c,e){c=c|0;e=e|0;var f=0,g=0;f=c;b[f+336>>1]=e&65535;e=254;do{if((d[f+342|0]|0|0)==254){if((d[f+1939|0]|0|0)!=(e|0)){break}a[f+342|0]=-1}}while(0);c=f+342|0;g=a[c]|0;a[c]=g-1&255;a[f+1428+((g&255)+256)|0]=e&255;g=f+342|0;c=a[g]|0;a[g]=c-1&255;a[f+1428+((c&255)+256)|0]=e&255;e=f+342|0;c=a[e]|0;a[e]=c-1&255;a[f+1428+((c&255)+256)|0]=-2;return}function rs(a,b){a=a|0;b=b|0;var d=0;d=a;a=b;c[d+24>>2]=a;b=ro(d,a,c[d+20>>2]|0)|0;a=(c[d+8>>2]|0)+4|0;c[a>>2]=(c[a>>2]|0)+b;return}function rt(a){a=a|0;cP(a);return}function ru(a,b,c){a=a|0;b=b|0;c=c|0;rv(a+368|0,b);return 0}function rv(a,b){a=a|0;b=b|0;var c=0;c=a;a=b;gn(a+272|0,c+289|0);gn(a+784|0,c+33|0);gn(a+1040|0,c+545|0);return}function rw(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=d;d=e;e=b;c[e+948>>2]=f+d;c[e+372>>2]=0;c[e+388>>2]=66;a[e+400|0]=0;c[e+376>>2]=-1;c[e+380>>2]=-1;c[e+384>>2]=-1;c[e+396>>2]=312;b=rx(f,d,e+368|0)|0;if((b|0)!=0){g=b;h=g;return h|0}gA(e,c[e+372>>2]|0);gd(e,c[e+392>>2]|0);jI(e,4<<(a[e+400|0]&1));ry(e+67224|0,+jJ(e));g=c5(e,1773447)|0;h=g;return h|0}function rx(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;g=b;b=e;e=f;c[e+24>>2]=1;a[e+33|0]=0;a[e+289|0]=0;a[e+545|0]=0;do{if((b|0)>=16){if((wk(g|0,8872,5)|0)!=0){break}f=g+b-5|0;g=g+5|0;while(1){if(g>>>0<f>>>0){if((d[g|0]|0|0)!=255){h=1}else{h=(d[g+1|0]|0|0)!=255}i=h}else{i=0}if(!i){j=2052;break}k=g;while(1){if(k>>>0<f>>>0){l=(d[k]|0|0)!=13}else{l=0}if(!l){break}k=k+1|0}m=g;while(1){if(g>>>0<k>>>0){n=(d[g]|0|0)>32}else{n=0}if(!n){break}g=g+1|0}o=g-m|0;while(1){if(g>>>0<k>>>0){p=(d[g]|0|0)<=32}else{p=0}if(!p){break}g=g+1|0}if((o|0)>0){if((aJ(8544,m|0,o|0)|0)!=0){if((aJ(7872,m|0,o|0)|0)!=0){if((aJ(7432,m|0,o|0)|0)!=0){if((aJ(7048,m|0,o|0)|0)!=0){if((aJ(6400,m|0,o|0)|0)!=0){if((aJ(5568,m|0,o|0)|0)!=0){if((aJ(5344,m|0,o|0)|0)!=0){if((aJ(5176,m|0,o|0)|0)!=0){if((aJ(5160,m|0,o|0)|0)!=0){if((aJ(5040,m|0,o|0)|0)==0){rP(g,k,32,e+545|0)}}else{rP(g,k,256,e+289|0)}}else{rP(g,k,256,e+33|0)}}else{c[e+28>>2]=rI(g,k)|0;if((c[e+28>>2]|0)<=0){j=2033;break}}}else{a[e+32|0]=1}}else{q=d[g]|0;c[e+20>>2]=q;if((q|0)==68){j=2026;break}else if(!((q|0)==67|(q|0)==66)){j=2027;break}}}else{c[e+24>>2]=rI(g,k)|0;if((c[e+24>>2]|0)<=0){j=2021;break}}}else{c[e+16>>2]=rO(g)|0;if((c[e+16>>2]|0)>>>0>65535){j=2017;break}}}else{c[e+12>>2]=rO(g)|0;if((c[e+12>>2]|0)>>>0>65535){j=2013;break}}}else{c[e+8>>2]=rO(g)|0;if((c[e+8>>2]|0)>>>0>65535){j=2009;break}}}g=k+2|0}if((j|0)==2009){r=8248;s=r;return s|0}else if((j|0)==2026){r=6096;s=r;return s|0}else if((j|0)==2017){r=7232;s=r;return s|0}else if((j|0)==2052){do{if((d[g|0]|0|0)==255){if((d[g+1|0]|0|0)!=255){break}c[e>>2]=g+2;r=0;s=r;return s|0}}while(0);r=4848;s=r;return s|0}else if((j|0)==2027){r=5792;s=r;return s|0}else if((j|0)==2033){r=5232;s=r;return s|0}else if((j|0)==2013){r=7608;s=r;return s|0}else if((j|0)==2021){r=6664;s=r;return s|0}}}while(0);r=c[74]|0;s=r;return s|0}function ry(a,b){a=a|0;b=+b;iE(a|0,.008333333333333333*b);return}function rz(a,b){a=a|0;b=b|0;jk(a+67224|0,b);return}function rA(b,c,d,e,f){b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;g=c;c=b;b=g-4|0;if((b|0)>=0){rf(c+1068|0,b,f);return}else{rf(c+964|0,g,a[c+400|0]&1?e:d);return}}function rB(a,b){a=a|0;b=b|0;var c=0;c=a;rr(c,b);rn(c+336|0,2134080)|0;return}function rC(a){a=a|0;var b=0;b=a;rp(b+336|0);cJ(b);c[b>>2]=20600;ra(b+964|0);ra(b+1068|0);q9(b+67224|0);jF(b,c[82]|0);hu(b,16800);jG(b,16768);jH(b,6);return}function rD(a){a=a|0;var b=0;b=a;rt(b);cK(b);return}function rE(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function rF(a){a=a|0;var b=0;b=a;return aq(c[b+396>>2]|0,c[b+952>>2]|0)|0}function rG(a){a=a|0;var b=0;b=a;return(c[(c[b+8>>2]|0)+4>>2]|0)+(c[c[b+8>>2]>>2]|0)|0}function rH(a,b){a=a|0;b=b|0;var d=0;d=a;c[(c[d+8>>2]|0)+4>>2]=b-(c[c[d+8>>2]>>2]|0);return}function rI(a,b){a=a|0;b=b|0;var c=0,e=0,f=0,g=0,h=0,i=0;c=a;a=b;if(c>>>0>=a>>>0){e=-1;f=e;return f|0}b=0;while(1){if(c>>>0>=a>>>0){g=2108;break}h=c;c=h+1|0;i=(d[h]|0)-48|0;if(i>>>0>9){g=2106;break}b=(b*10|0)+i|0}if((g|0)==2106){e=-1;f=e;return f|0}else if((g|0)==2108){e=b;f=e;return f|0}return 0}function rJ(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=b;b=a;a=c6(b,e)|0;if((a|0)!=0){f=a;g=f;return g|0}wg(b+1172|0,0,66048);a=c[b+368>>2]|0;while(1){if(((c[b+948>>2]|0)-a|0)<5){break}h=jD(a)|0;i=jD(a+2|0)|0;a=a+4|0;if(i>>>0<h>>>0){j=2120;break}k=i-h+1|0;if((k|0)>((c[b+948>>2]|0)-a|0)){j=2122;break}i=b+1428+h|0;h=a;l=k;wh(i|0,h|0,l)|0;a=a+k|0;do{if(((c[b+948>>2]|0)-a|0)>=2){if((d[a|0]|0|0)!=255){break}if((d[a+1|0]|0|0)!=255){break}a=a+2|0}}while(0)}if((j|0)==2120){gA(b,872)}else if((j|0)==2122){gA(b,872)}rb(b+964|0,b+67224|0);rb(b+1068|0,b+67224|0);rm(b+336|0,b+1428|0);c[b+960>>2]=0;rK(b,e);c[b+960>>2]=-1;c[b+956>>2]=rF(b)|0;f=0;g=f;return g|0}function rK(b,d){b=b|0;d=d|0;var e=0;e=d;d=b;b=c[d+388>>2]|0;if((b|0)==67){a[d+338|0]=112;a[d+339|0]=c[d+384>>2]&255;a[d+340|0]=c[d+384>>2]>>8&255;rB(d,(c[d+380>>2]|0)+3|0);a[d+338|0]=0;a[d+339|0]=e&255;rB(d,(c[d+380>>2]|0)+3|0);return}else if((b|0)==66){a[d+338|0]=e&255;rB(d,c[d+376>>2]|0);return}else{return}}function rL(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;if((f^53760)>>>0<=9){b=rG(e+336|0)|0;rj(e+964|0,b&c[e+960>>2],f,d);return}do{if((f^53776)>>>0<=9){if(!(a[e+400|0]&1)){break}b=rG(e+336|0)|0;rj(e+1068|0,b&c[e+960>>2],f^16,d);return}}while(0);do{if((f&-17|0)==53775){if((d|0)!=3){break}return}}while(0);return}function rM(b,d,f){b=b|0;d=d|0;f=f|0;var g=0,h=0,i=0,j=0;f=d;d=b;rH(d+336|0,0);while(1){b=rG(d+336|0)|0;if((b|0)>=(c[f>>2]|0)){break}if(rn(d+336|0,c[f>>2]|0)|0){g=2156;break}if((e[d+336>>1]|0|0)>65279){g=2156;break}if((e[d+336>>1]|0|0)==65279){if((c[d+956>>2]|0)<=(c[f>>2]|0)){rH(d+336|0,c[d+956>>2]|0);b=rF(d)|0;h=d+956|0;c[h>>2]=(c[h>>2]|0)+b;rN(d)}else{rH(d+336|0,c[f>>2]|0)}}}if((g|0)==2156){i=520;j=i;return j|0}c[f>>2]=rG(d+336|0)|0;g=d+956|0;c[g>>2]=(c[g>>2]|0)-(c[f>>2]|0);if((c[d+956>>2]|0)<0){c[d+956>>2]=0}rk(d+964|0,c[f>>2]|0);if(a[d+400|0]&1){rk(d+1068|0,c[f>>2]|0)}i=0;j=i;return j|0}function rN(a){a=a|0;var b=0;b=a;a=c[b+388>>2]|0;if((a|0)==66){rr(b,c[b+380>>2]|0);return}else if((a|0)==67){rr(b,(c[b+380>>2]|0)+6|0);return}else{return}}function rO(a){a=a|0;var b=0,c=0,e=0,f=0,g=0,h=0,i=0;b=a;a=0;c=4;while(1){e=c;c=e-1|0;if((e|0)==0){f=2183;break}e=b;b=e+1|0;g=gY(d[e]|0)|0;if((g|0)>15){f=2181;break}a=(a<<4)+g|0}if((f|0)==2183){h=a;i=h;return i|0}else if((f|0)==2181){h=-1;i=h;return i|0}return 0}function rP(b,c,e,f){b=b|0;c=c|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=b;b=c;c=e;e=f;f=g;h=g;g=h+1|0;if((d[h]|0|0)==34){f=f+1|0;while(1){if(g>>>0<b>>>0){i=(d[g]|0|0)!=34}else{i=0}if(!i){break}g=g+1|0}}else{g=b}c=rE(c-1|0,g-f|0)|0;a[e+c|0]=0;g=e;e=f;f=c;wh(g|0,e|0,f)|0;return}function rQ(a){a=a|0;rU(a);return}function rR(a){a=a|0;r_(a);return}function rS(){var a=0,b=0,c=0;a=j6(84496)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;rC(b);c=b}return c|0}function rT(){var a=0,b=0,c=0;a=j6(896)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;rQ(b);c=b}return c|0}function rU(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=19696;jF(b,c[82]|0);return}function rV(a){a=a|0;var b=0;b=a;rR(b);cK(b);return}function rW(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;c[b+2008>>2]=d;if((d|0)==0){d=1}a=((d>>1)+4096|0)/(d|0)|0;if((a|0)<4){a=4}c[b+1920>>2]=a;c[b+1896>>2]=a<<3;c[b+1872>>2]=a<<3;return}function rX(a){a=a|0;return a+1580|0}function rY(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=a;a=rx(b,d,e+316|0)|0;if((a|0)!=0){f=a;g=f;return g|0}gd(e,c[e+340>>2]|0);f=0;g=f;return g|0}function rZ(a,b,c){a=a|0;b=b|0;c=c|0;rv(a+316|0,b);return 0}function r_(a){a=a|0;ik(a);return}function r$(b){b=b|0;var e=0,f=0;e=b;wg(e+1868|0,0,66640);sY(e|0,e+2716|0);c[e+2008>>2]=256;a[e+2138|0]=-1;a[e+2139|0]=-64;b=0;while(1){if((b|0)>=128){break}f=d[16464+b|0]|0;a[e+2204+(b<<1)|0]=f>>4&255;a[e+2204+((b<<1)+1)|0]=f&15;b=b+1|0}b=e+1612|0;wh(b|0,25832,256)|0;r0(e);return 0}function r0(a){a=a|0;var b=0;b=a;wg(b+2716|0,-1|0,65536);r4(b);r8(b,15);sK(b|0);return}function r1(a,b){a=a|0;b=b|0;var c=0;c=a+2076|0;a=b;wh(c|0,a|0,64)|0;return}function r2(b){b=b|0;var e=0,f=0;e=b;b=0;while(1){if((b|0)>=3){break}f=e+1868+(b*24|0)|0;c[f+8>>2]=((d[e+1940+(b+10)|0]|0)-1&255)+1;c[f+16>>2]=(d[e+1941|0]|0)>>b&1;c[f+20>>2]=a[e+1956+(b+13)|0]&15;b=b+1|0}rW(e,c[e+2008>>2]|0);return}function r3(b,c){b=b|0;c=c|0;var d=0,e=0;d=b;b=d+1940|0;e=c;wh(b|0,e|0,16)|0;e=d+1956|0;b=d+1940|0;wh(e|0,b|0,16)|0;a[d+1956|0]=0;a[d+1957|0]=0;a[d+1966|0]=0;a[d+1967|0]=0;a[d+1968|0]=0;return}function r4(a){a=a|0;var b=0;b=a;c[b+2072>>2]=0;r3(b,b+2956|0);wg(b+2460|0,-1|0,256);wg(b+68252|0,-1|0,256);return}function r5(b){b=b|0;var c=0;c=b;sj(c,a[c+1941|0]&128);r2(c);return}function r6(b){b=b|0;var d=0,e=0;d=b;c[d+2020>>2]=0;a[d+2004|0]=0;c[d+2e3>>2]=0;c[d+1996>>2]=0;c[d+1996>>2]=33;b=0;while(1){if((b|0)>=3){break}e=d+1868+(b*24|0)|0;c[e>>2]=1;c[e+12>>2]=0;b=b+1|0}r5(d);c[d+2024>>2]=0;r7(d);return}function r7(a){a=a|0;var d=0,e=0;d=a;a=d+2040|0;while(1){if(a>>>0>=(d+2056|0)>>>0){break}e=a;a=e+2|0;b[e>>1]=0}c[d+2036>>2]=a;c[d+2028>>2]=0;sA(d|0,0,0);return}function r8(b,d){b=b|0;d=d|0;var e=0;e=d;d=b;b=0;while(1){if((b|0)>=3){break}a[d+1956+(b+13)|0]=e&255;b=b+1|0}wg(d+1972|0,0,24);c[d+1972>>2]=65472;a[d+1940|0]=10;a[d+1941|0]=-80;b=0;while(1){if((b|0)>=4){break}a[d+1956+(b+4)|0]=0;b=b+1|0}r6(d);return}function r9(a){a=a|0;var b=0;b=a;r8(b,0);sL(b|0);return}function sa(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0;f=e;e=a;a=b;do{if((f|0)>=35){if((wk(a|0,25792,27)|0)!=0){break}if((f|0)<65920){g=8424;h=g;return h|0}else{c[e+1972>>2]=((d[a+38|0]|0)<<8)+(d[a+37|0]|0);c[e+1976>>2]=d[a+39|0]|0;c[e+1980>>2]=d[a+40|0]|0;c[e+1984>>2]=d[a+41|0]|0;c[e+1988>>2]=d[a+42|0]|0;c[e+1992>>2]=d[a+43|0]|0;b=e+2716|0;i=a+256|0;wh(b|0,i|0,65536)|0;r4(e);sM(e|0,a+65792|0);r6(e);g=0;h=g;return h|0}}}while(0);g=2528;h=g;return h|0}function sb(a){a=a|0;var b=0,c=0;b=a;if(((sc(b|0,108)|0)&32|0)!=0){return}a=(sc(b|0,109)|0)<<8;c=a+(((sc(b|0,125)|0)&15)<<11)|0;if((c|0)>65536){c=65536}wg(b+2716+a|0,-1|0,c-a|0);return}function sc(a,b){a=a|0;b=b|0;var c=0;c=b;if(c>>>0>=128){a5(1280,161,10888,824);return 0}return d[a+c|0]|0|0}function sd(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=d;d=e;e=a;if((d&1|0)!=0){a5(5664,279,12416,4336)}a=e+2024|0;c[a>>2]=c[a>>2]&31;if((f|0)==0){r7(e);return}a=f+(d<<1)|0;c[e+2028>>2]=f;c[e+2032>>2]=a;d=e+2040|0;while(1){if(d>>>0<(c[e+2036>>2]|0)>>>0){g=f>>>0<a>>>0}else{g=0}if(!g){break}h=d;d=h+2|0;i=f;f=i+2|0;b[i>>1]=b[h>>1]|0}if(f>>>0>=a>>>0){f=rX(e|0)|0;a=(rX(e|0)|0)+32|0;while(1){if(d>>>0>=(c[e+2036>>2]|0)>>>0){break}g=d;d=g+2|0;h=f;f=h+2|0;b[h>>1]=b[g>>1]|0}if(f>>>0>a>>>0){a5(5664,303,12416,3376)}}sA(e|0,f,(a-f|0)/2|0);return}function se(a){a=a|0;return c[a+1568>>2]|0}function sf(a){a=a|0;return c[a+2024>>2]>>5<<1|0}function sg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=d;d=b;b=a[d+e|0]|0;f=a[d+(e+1)|0]|0;g=aq(b,f)|0;if((g|0)<(c[d+1564>>2]|0)){b=b^b>>7;f=f^f>>7}g=d+308+((e>>4)*140|0)|0;e=c[g+136>>2]|0;c[g+128>>2]=b&e;c[g+132>>2]=f&e;return}function sh(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;a=b;b=((d-(c[a>>2]|0)|0)/(c[a+4>>2]|0)|0)+1|0;d=aq(b,c[a+4>>2]|0)|0;e=a|0;c[e>>2]=(c[e>>2]|0)+d;if((c[a+16>>2]|0)==0){f=a;return f|0}d=(c[a+12>>2]|0)+b|0;e=b-(((c[a+8>>2]|0)-(c[a+12>>2]|0)-1&255)+1)|0;if((e|0)>=0){b=(e|0)/(c[a+8>>2]|0)|0;c[a+20>>2]=(c[a+20>>2]|0)+1+b&15;d=e-(aq(b,c[a+8>>2]|0)|0)|0}c[a+12>>2]=d&255;f=a;return f|0}function si(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=b;b=a;if((d|0)<=128e3){e=d;f=sp(b,e,0)|0;return f|0}sd(b,0,0);a=d;d=(d&3)+64e3|0;a=a-d<<4;c[b+2012>>2]=0;c[b+2016>>2]=0;g=(c[b+1996>>2]|0)+(c[b+2e3>>2]|0)|0;c[b+1996>>2]=a-(c[b+2e3>>2]|0)+127;sx(b,a);c[b+1996>>2]=(c[b+1996>>2]|0)-127+g;sq(b|0,92,c[b+2016>>2]&~c[b+2012>>2]);sq(b|0,76,c[b+2012>>2]|0);sb(b);e=d;f=sp(b,e,0)|0;return f|0}function sj(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=b;b=a;if((c[b+2072>>2]|0)==(d|0)){return}c[b+2072>>2]=d;if((d|0)!=0){a=b+2140|0;e=b+68188|0;wh(a|0,e|0,64)|0}e=b+68188|0;if((d|0)!=0){f=b+2076|0}else{f=b+2140|0}b=f;wh(e|0,b|0,64)|0;return}function sk(b,d){b=b|0;d=d|0;var e=0;e=b;b=d-(a[e+1612+(a[e+1942|0]&127)|0]|0)-(c[e+1996>>2]|0)|0;if((b|0)>=0){d=(b&-32)+32|0;b=e+1996|0;c[b>>2]=(c[b>>2]|0)+d;sB(e|0,d)}return sc(e|0,a[e+1942|0]&127)|0}function sl(b,c){b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;d=c;c=b;if(((sc(c|0,108)|0)&32|0)==0){b=(sc(c|0,109)|0)<<8;e=((sc(c|0,125)|0)&15)<<11;if((e|0)!=0){f=e}else{f=4}do{if((b|0)<=(d|0)){if((d|0)>=(b+f|0)){break}if(a[c+2004|0]&1){break}a[c+2004|0]=1;g=1;h=g;return h|0}}while(0)}g=0;h=g;return h|0}function sm(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;g=d;d=e;e=f;f=b;b=e;if((b|0)==13|(b|0)==14|(b|0)==15){if((g|0)<4096){c[(sn(f,f+1868+((e-13|0)*24|0)|0,d-1|0)|0)+20>>2]=0}return}else if((b|0)==8|(b|0)==9){a[f+1956+e|0]=g&255;return}else if((b|0)==1){if((g&16|0)!=0){a[f+1960|0]=0;a[f+1961|0]=0}if((g&32|0)!=0){a[f+1962|0]=0;a[f+1963|0]=0}h=0;while(1){if((h|0)>=3){break}i=f+1868+(h*24|0)|0;j=g>>h&1;if((c[i+16>>2]|0)!=(j|0)){i=sn(f,i,d)|0;c[i+16>>2]=j;if((j|0)!=0){c[i+12>>2]=0;c[i+20>>2]=0}}h=h+1|0}sj(f,g&128);return}else if((b|0)==10|(b|0)==11|(b|0)==12){h=f+1868+((e-10|0)*24|0)|0;e=(g-1&255)+1|0;if((c[h+8>>2]|0)!=(e|0)){h=sn(f,h,d)|0;c[h+8>>2]=e}return}else if((b|0)==0){return}else{return}}function sn(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=b;b=d;if((b|0)<(c[e>>2]|0)){f=e;return f|0}e=sh(a,e,b)|0;f=e;return f|0}function so(a){a=a|0;var d=0,e=0,f=0,g=0,h=0;d=a;a=c[d+2032>>2]|0;e=se(d|0)|0;do{if((c[d+2028>>2]|0)>>>0<=e>>>0){if(e>>>0>a>>>0){break}a=e;e=rX(d|0)|0}}while(0);f=d+2040|0;g=c[d+2028>>2]|0;h=g+((sf(d)|0)<<1)|0;while(1){if(h>>>0>=a>>>0){break}g=f;f=g+2|0;b[g>>1]=b[h>>1]|0;h=h+2|0}h=rX(d|0)|0;while(1){if(h>>>0>=e>>>0){break}a=f;f=a+2|0;b[a>>1]=b[h>>1]|0;h=h+2|0}c[d+2036>>2]=f;if(f>>>0<=(d+2072|0)>>>0){return}else{a5(5664,334,12464,2616);return}}function sp(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=a;if((e&1|0)!=0){a5(5664,339,12312,2008);return 0}if((e|0)!=0){sd(b,d,e);sx(b,e<<4)}e=c[b+2020>>2]|0;c[b+2020>>2]=0;return e|0}function sq(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=d;d=e;e=b;if(f>>>0>=128){a5(1280,185,12656,824)}a[e+f|0]=d&255;b=f&15;if((b|0)<2){sg(e,b^f);return}if((b|0)==12){if((f|0)==76){c[e+300>>2]=d&255}if((f|0)==124){a[e+124|0]=0}}return}function sr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b;b=c;c=d;d=a;if((c|0)==3){ss(d,e,b);return}else{sm(d,e,b,c);return}}function ss(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0;g=e;e=b;b=f-(a[e+1612+(d[e+1942|0]|0)|0]|0)-(c[e+1996>>2]|0)|0;if((b|0)>=0){f=(b&-32)+32|0;b=e+1996|0;c[b>>2]=(c[b>>2]|0)+f;sB(e|0,f)}else{if((c[e+1996>>2]|0)==127){f=d[e+1942|0]|0;if((f|0)==76){b=g&~(sc(e|0,92)|0);h=e+2012|0;c[h>>2]=c[h>>2]|b}if((f|0)==92){f=e+2016|0;c[f>>2]=c[f>>2]|g;f=e+2012|0;c[f>>2]=c[f>>2]&~g}}}if((d[e+1942|0]|0)<=127){sq(e|0,d[e+1942|0]|0,g);return}else{return}}function st(b,c,d,e){b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=c;c=d;d=e;e=b;a[e+2716+c|0]=f&255;b=c-240|0;if((b|0)<0){return}if((b|0)<16){a[e+1940+b|0]=f&255;if((-788594688<<b|0)<0){sr(e,f,d,b)}}else{b=b-65232|0;if((b|0)>=0){sv(e,f,b,d)}}return}function su(a,b,c){a=a|0;b=b|0;c=c|0;var e=0,f=0;e=b;b=a;a=d[b+1956+e|0]|0;e=e-2|0;if(e>>>0>1){f=a;return f|0}a=d[b+1942|0]|0;if((e|0)==1){a=sk(b,c)|0}f=a;return f|0}function sv(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0;h=e;e=f;f=g;g=b;if((e|0)<64){a[g+2140+e|0]=h&255;if((c[g+2072>>2]|0)!=0){a[g+2716+(e+65472)|0]=a[g+2076+e|0]|0}return}if((d[g+2716+(e+65472)|0]|0|0)!=(h&255|0)){a5(2352,406,12360,8352)}a[g+2716+(e+65472)|0]=-1;st(g,h,e+65472-65536|0,f);return}function sw(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;f=b;b=e;e=a;a=d[e+2716+f|0]|0;g=f-240|0;if((g|0)<0){h=a;return h|0}g=g-16|0;if(g>>>0>=65280){g=g+3|0;if(g>>>0<3){f=e+1868+(g*24|0)|0;if((b|0)>=(c[f>>2]|0)){f=sh(e,f,b)|0}a=c[f+20>>2]|0;c[f+20>>2]=0}else{if((g|0)<0){a=su(e,g+13|0,b)|0}else{if((g-65283|0)>=256){a5(2352,498,12272,5616);return 0}a=sw(e,g-65283|0,b)|0}}}h=a;return h|0}function sx(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;if((d|0)>(c[b+2e3>>2]|0)){a=d;sy(b,a)|0}a=b+2e3|0;c[a>>2]=(c[a>>2]|0)-d;a=b+2024|0;c[a>>2]=(c[a>>2]|0)+d;do{if(-11<=(c[b+2e3>>2]|0)){if((c[b+2e3>>2]|0)>0){e=2515;break}}else{e=2515}}while(0);if((e|0)==2515){a5(2352,547,12232,4288)}e=0;while(1){if((e|0)>=3){break}sn(b,b+1868+(e*24|0)|0,0)|0;e=e+1|0}if((c[b+1996>>2]|0)<0){e=-29-(c[b+1996>>2]|0)|0;if((e|0)>=0){d=(e&-32)+32|0;e=b+1996|0;c[e>>2]=(c[e>>2]|0)+d;sB(b|0,d)}}if((c[b+2028>>2]|0)==0){return}so(b);return}
function sy(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;f=e;e=b;b=(c[e+2e3>>2]|0)-f|0;if((b|0)>0){a5(3328,163,12496,2600);return 0}c[e+2e3>>2]=f;g=e+1996|0;c[g>>2]=(c[g>>2]|0)+b;g=e+1868|0;c[g>>2]=(c[g>>2]|0)+b;g=e+1892|0;c[g>>2]=(c[g>>2]|0)+b;g=e+1916|0;c[g>>2]=(c[g>>2]|0)+b;g=e+2716|0;h=c[e+1976>>2]|0;i=c[e+1980>>2]|0;j=c[e+1984>>2]|0;k=g+(c[e+1972>>2]|0)|0;l=g+257+(c[e+1992>>2]|0)|0;m=c[e+1988>>2]|0;n=c[e+1988>>2]<<8;o=c[e+1988>>2]<<3&256;p=c[e+1988>>2]<<4&2048|~c[e+1988>>2]&2;L2863:while(1){q=d[k]|0;r=b+(d[e+2204+q|0]|0)|0;b=r;if((r|0)>0){s=2536;break}r=k+1|0;k=r;t=d[r]|0;r=q;do{if((r|0)==228){k=k+1|0;u=b|0;v=o+t|0;w=v-253|0;if(w>>>0<3){x=e+1868+(w*24|0)|0;if((u|0)>=(c[x>>2]|0)){x=sh(e,x,u)|0}w=c[x+20>>2]|0;p=w;h=w;c[x+20>>2]=0}else{x=d[g+v|0]|0;p=x;h=x;x=v-240|0;if(x>>>0<16){v=su(e,x,u)|0;p=v;h=v}}continue L2863}else if((r|0)==111){v=l-g|0;k=g+(jD(l)|0)|0;l=l+2|0;if((v|0)<511){continue L2863}else{k=g+((d[l-257|0]<<8)+(d[g+((v&255)+256)|0]|0))|0;l=l-256|0;continue L2863}}else if((r|0)==231){t=jD(g+((t+i&255)+o)|0)|0;s=2588}else if((r|0)==246){t=t+j|0;s=2586}else if((r|0)==245){t=t+i|0;s=2585}else if((r|0)==229){s=2585}else if((r|0)==230){t=i+o|0;k=k-1|0;s=2588}else if((r|0)==247){t=(jD(g+(t+o)|0)|0)+j|0;s=2588}else if((r|0)==244){t=t+i&255;t=t+o|0;s=2588}else if((r|0)==191){v=i+o|0;i=i+1&255;u=sw(e,v,b-1|0)|0;p=u;h=u;continue L2863}else if((r|0)==232){h=t;p=t}else if((r|0)==249){t=t+j&255;s=2592}else if((r|0)==196){k=k+1|0;u=o+t|0;a[g+u|0]=h&255;u=u-240|0;if(u>>>0<16){v=u-2|0;a[e+1940+u|0]=h&255;if((v|0)==1){ss(e,h,b)}else{if(v>>>0>1){sm(e,h,b,u)}}}continue L2863}else if((r|0)==205){s=2601}else if((r|0)==251){t=t+i&255;s=2603}else if((r|0)==235){s=2603}else if((r|0)==236){u=jD(k)|0;k=k+2|0;v=b|0;x=u;u=x-253|0;if(u>>>0<3){w=e+1868+(u*24|0)|0;if((v|0)>=(c[w>>2]|0)){w=sh(e,w,v)|0}u=c[w+20>>2]|0;p=u;j=u;c[w+20>>2]=0}else{w=d[g+x|0]|0;p=w;j=w;w=x-240|0;if(w>>>0<16){x=su(e,w,v)|0;p=x;j=x}}continue L2863}else if((r|0)==141){j=t;p=t}else if((r|0)==198){t=i+o|0;k=k-1|0;s=2628}else if((r|0)==215){t=(jD(g+(t+o)|0)|0)+j|0;s=2628}else if((r|0)==199){t=jD(g+((t+i&255)+o)|0)|0;s=2628}else if((r|0)==214){t=t+j|0;s=2626}else if((r|0)==213){t=t+i|0;s=2625}else if((r|0)==197){s=2625}else if((r|0)==212){t=t+i&255;t=t+o|0;s=2628}else if((r|0)==204){y=j;s=2631}else if((r|0)==201){y=i;s=2631}else if((r|0)==217){t=t+j&255;s=2633}else if((r|0)==216){s=2633}else if((r|0)==219){t=t+i&255;s=2635}else if((r|0)==250){x=b-2|0;v=o+t|0;w=v-253|0;if(w>>>0<3){u=e+1868+(w*24|0)|0;if((x|0)>=(c[u>>2]|0)){u=sh(e,u,x)|0}z=c[u+20>>2]|0;c[u+20>>2]=0}else{z=d[g+v|0]|0;u=v-240|0;if(u>>>0<16){z=su(e,u,x)|0}}t=z+8192|0;s=2567}else if((r|0)==208){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((p&255)<<24>>24!=0){continue L2863}else{k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}}else if((r|0)==143){s=2567}else if((r|0)==248){s=2592}else if((r|0)==233){t=jD(k)|0;k=k+1|0;t=sw(e,t,b|0)|0;s=2601}else if((r|0)==63){x=k-g+2|0;k=g+(jD(k)|0)|0;u=l-2|0;l=u;v=u-g|0;if((v|0)>256){jE(l,x)}else{a[g+((v&255)+256)|0]=x&255;a[l+1|0]=x>>8&255;l=l+256|0}continue L2863}else if((r|0)==240){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((p&255)<<24>>24!=0){k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}else{continue L2863}}else if((r|0)==203){s=2635}else if((r|0)==125){h=i;p=i;continue L2863}else if((r|0)==221){h=j;p=j;continue L2863}else if((r|0)==93){i=h;p=h;continue L2863}else if((r|0)==253){j=h;p=h;continue L2863}else if((r|0)==157){x=l-257-g|0;p=x;i=x;continue L2863}else if((r|0)==189){l=g+257+i|0;continue L2863}else if((r|0)==175){st(e,h+8192|0,o+i|0,b|0);i=i+1|0;continue L2863}else if((r|0)==38){t=i+o|0;k=k-1|0;s=2652}else if((r|0)==55){t=(jD(g+(t+o)|0)|0)+j|0;s=2652}else if((r|0)==39){t=jD(g+((t+i&255)+o)|0)|0;s=2652}else if((r|0)==54){t=t+j|0;s=2649}else if((r|0)==53){t=t+i|0;s=2648}else if((r|0)==37){s=2648}else if((r|0)==52){t=t+i&255;s=2651}else if((r|0)==36){s=2651}else if((r|0)==40){s=2653}else if((r|0)==57){t=sw(e,o+j|0,b-2|0)|0;A=i+o|0;s=2657}else if((r|0)==41){t=sw(e,o+t|0,b-3|0)|0;s=2656}else if((r|0)==56){s=2656}else if((r|0)==6){t=i+o|0;k=k-1|0;s=2667}else if((r|0)==23){t=(jD(g+(t+o)|0)|0)+j|0;s=2667}else if((r|0)==7){t=jD(g+((t+i&255)+o)|0)|0;s=2667}else if((r|0)==22){t=t+j|0;s=2664}else if((r|0)==21){t=t+i|0;s=2663}else if((r|0)==5){s=2663}else if((r|0)==20){t=t+i&255;s=2666}else if((r|0)==4){s=2666}else if((r|0)==8){s=2668}else if((r|0)==25){t=sw(e,o+j|0,b-2|0)|0;B=i+o|0;s=2672}else if((r|0)==9){t=sw(e,o+t|0,b-3|0)|0;s=2671}else if((r|0)==24){s=2671}else if((r|0)==70){t=i+o|0;k=k-1|0;s=2682}else if((r|0)==87){t=(jD(g+(t+o)|0)|0)+j|0;s=2682}else if((r|0)==71){t=jD(g+((t+i&255)+o)|0)|0;s=2682}else if((r|0)==86){t=t+j|0;s=2679}else if((r|0)==85){t=t+i|0;s=2678}else if((r|0)==69){s=2678}else if((r|0)==84){t=t+i&255;s=2681}else if((r|0)==68){s=2681}else if((r|0)==72){s=2683}else if((r|0)==89){t=sw(e,o+j|0,b-2|0)|0;C=i+o|0;s=2687}else if((r|0)==73){t=sw(e,o+t|0,b-3|0)|0;s=2686}else if((r|0)==88){s=2686}else if((r|0)==102){t=i+o|0;k=k-1|0;s=2697}else if((r|0)==119){t=(jD(g+(t+o)|0)|0)+j|0;s=2697}else if((r|0)==103){t=jD(g+((t+i&255)+o)|0)|0;s=2697}else if((r|0)==118){t=t+j|0;s=2694}else if((r|0)==117){t=t+i|0;s=2693}else if((r|0)==101){s=2693}else if((r|0)==116){t=t+i&255;s=2696}else if((r|0)==100){s=2696}else if((r|0)==104){s=2698}else if((r|0)==121){t=sw(e,o+j|0,b-2|0)|0;p=(sw(e,o+i|0,b-1|0)|0)-t|0;n=~p;p=p&255;continue L2863}else if((r|0)==105){t=sw(e,o+t|0,b-3|0)|0;s=2701}else if((r|0)==120){s=2701}else if((r|0)==62){t=t+o|0;s=2704}else if((r|0)==30){t=jD(k)|0;k=k+1|0;s=2704}else if((r|0)==200){s=2705}else if((r|0)==126){t=t+o|0;s=2708}else if((r|0)==94){t=jD(k)|0;k=k+1|0;s=2708}else if((r|0)==173){s=2709}else if((r|0)==185|(r|0)==153){k=k-1|0;t=sw(e,o+j|0,b-2|0)|0;D=i+o|0;s=2713}else if((r|0)==169|(r|0)==137){t=sw(e,o+t|0,b-3|0)|0;s=2712}else if((r|0)==184|(r|0)==152){s=2712}else if((r|0)==134|(r|0)==166){t=i+o|0;k=k-1|0;s=2723}else if((r|0)==151|(r|0)==183){t=(jD(g+(t+o)|0)|0)+j|0;s=2723}else if((r|0)==135|(r|0)==167){t=jD(g+((t+i&255)+o)|0)|0;s=2723}else if((r|0)==150|(r|0)==182){t=t+j|0;s=2720}else if((r|0)==149|(r|0)==181){t=t+i|0;s=2719}else if((r|0)==133|(r|0)==165){s=2719}else if((r|0)==148|(r|0)==180){t=t+i&255;s=2722}else if((r|0)==132|(r|0)==164){s=2722}else if((r|0)==168|(r|0)==136){s=2724}else if((r|0)==188){p=h+1|0;h=p&255;continue L2863}else if((r|0)==61){p=i+1|0;i=p&255;continue L2863}else if((r|0)==252){p=j+1|0;j=p&255;continue L2863}else if((r|0)==156){p=h-1|0;h=p&255;continue L2863}else if((r|0)==29){p=i-1|0;i=p&255;continue L2863}else if((r|0)==220){p=j-1|0;j=p&255;continue L2863}else if((r|0)==155|(r|0)==187){t=t+i&255;s=2737}else if((r|0)==139|(r|0)==171){s=2737}else if((r|0)==140|(r|0)==172){t=jD(k)|0;k=k+1|0;s=2739}else if((r|0)==92){n=0;s=2741}else if((r|0)==124){s=2741}else if((r|0)==28){n=0;s=2743}else if((r|0)==60){s=2743}else if((r|0)==11){n=0;t=t+o|0;s=2750}else if((r|0)==27){n=0;s=2746}else if((r|0)==59){s=2746}else if((r|0)==43){s=2747}else if((r|0)==12){n=0;s=2749}else if((r|0)==44){s=2749}else if((r|0)==75){n=0;t=t+o|0;s=2757}else if((r|0)==91){n=0;s=2753}else if((r|0)==123){s=2753}else if((r|0)==107){s=2754}else if((r|0)==76){n=0;s=2756}else if((r|0)==108){s=2756}else if((r|0)==159){x=h>>4|h<<4&255;h=x;p=x;continue L2863}else if((r|0)==186){h=sw(e,o+t|0,b-2|0)|0;p=h&127|h>>1;j=sw(e,o+(t+1&255)|0,b|0)|0;p=p|j}else if((r|0)==218){st(e,h,o+t|0,b-1|0);st(e,j+8192|0,o+(t+1&255)|0,b|0)}else if((r|0)==58|(r|0)==26){t=t+o|0;x=sw(e,t,b-3|0)|0;x=x+((q>>>4&2)-1)|0;p=(x>>1|x)&127;st(e,x,t,b-2|0);t=(t+1&255)+o|0;x=(x>>8)+(sw(e,t,b-1|0)|0)&255;p=p|x;st(e,x,t,b|0)}else if((r|0)==122|(r|0)==154){x=sw(e,o+t|0,b-2|0)|0;v=sw(e,o+(t+1&255)|0,b|0)|0;if((q|0)==154){x=(x^255)+1|0;v=v^255}x=x+h|0;u=j+v+(x>>8)|0;w=v^j^u;m=m&-73|w>>1&8|w+128>>2&64;n=u;h=x&255;u=u&255;j=u;p=(x>>1|x)&127|u}else if((r|0)==90){u=h-(sw(e,o+t|0,b-1|0)|0)|0;p=(u>>1|u)&127;u=j+(u>>8)|0;u=u-(sw(e,o+(t+1&255)|0,b|0)|0)|0;p=p|u;n=~u;p=p&255}else if((r|0)==207){u=aq(j,h)|0;h=u&255;p=(u>>>1|u)&127;j=u>>>8;p=p|j;continue L2863}else if((r|0)==158){u=(j<<8)+h|0;m=m&-73;if((j|0)>=(i|0)){m=m|64}if((j&15|0)>=(i&15|0)){m=m|8}if((j|0)<(i<<1|0)){h=(u>>>0)/(i>>>0)|0;j=u-(aq(h,i)|0)|0}else{h=255-(((u-(i<<9)|0)>>>0)/((256-i|0)>>>0)|0)|0;j=i+(((u-(i<<9)|0)>>>0)%((256-i|0)>>>0)|0)|0}p=h&255;h=h&255;continue L2863}else if((r|0)==223){if((h|0)>153){s=2777}else{if((n&256|0)!=0){s=2777}}if((s|0)==2777){s=0;h=h+96|0;n=256}if((h&15|0)>9){s=2780}else{if((m&8|0)!=0){s=2780}}if((s|0)==2780){s=0;h=h+6|0}p=h;h=h&255;continue L2863}else if((r|0)==190){if((h|0)>153){s=2784}else{if((n&256|0)==0){s=2784}}if((s|0)==2784){s=0;h=h-96|0;n=0}if((h&15|0)>9){s=2787}else{if((m&8|0)==0){s=2787}}if((s|0)==2787){s=0;h=h-6|0}p=h;h=h&255;continue L2863}else if((r|0)==47){k=k+((t&255)<<24>>24)|0}else if((r|0)==48){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((p&2176|0)!=0){continue L2863}else{k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}}else if((r|0)==16){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((p&2176|0)!=0){k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}else{continue L2863}}else if((r|0)==176){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((n&256|0)!=0){continue L2863}else{k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}}else if((r|0)==144){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((n&256|0)!=0){k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}else{continue L2863}}else if((r|0)==112){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((m&64|0)!=0){continue L2863}else{k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}}else if((r|0)==80){k=k+1|0;k=k+((t&255)<<24>>24)|0;if((m&64|0)!=0){k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}else{continue L2863}}else if((r|0)==3|(r|0)==35|(r|0)==67|(r|0)==99|(r|0)==131|(r|0)==163|(r|0)==195|(r|0)==227){k=k+1|0;if(((sw(e,o+t|0,b-4|0)|0)>>(q>>>5)&1|0)!=0){s=2533;break}else{b=b-2|0;break}}else if((r|0)==19|(r|0)==51|(r|0)==83|(r|0)==115|(r|0)==147|(r|0)==179|(r|0)==211|(r|0)==243){k=k+1|0;if(((sw(e,o+t|0,b-4|0)|0)>>(q>>>5)&1|0)!=0){b=b-2|0;break}else{s=2533;break}}else if((r|0)==222){t=t+i&255;s=2815}else if((r|0)==46){s=2815}else if((r|0)==110){u=(sw(e,o+t|0,b-4|0)|0)-1|0;st(e,u+8192|0,o+(t&255)|0,b-3|0);k=k+1|0;if((u|0)!=0){s=2533;break}else{b=b-2|0;break}}else if((r|0)==254){j=j-1&255;k=k+1|0;k=k+((t&255)<<24>>24)|0;if((j|0)!=0){continue L2863}else{k=k+(-((t&255)<<24>>24)|0)|0;b=b-2|0;continue L2863}}else if((r|0)==31){k=g+((jD(k)|0)+i)|0;s=2832}else if((r|0)==95){s=2832}else if((r|0)==15){u=k-g|0;k=g+(jD(g+65502|0)|0)|0;x=l-2|0;l=x;w=x-g|0;if((w|0)>256){jE(l,u)}else{a[g+((w&255)+256)|0]=u&255;a[l+1|0]=u>>8&255;l=l+256|0}u=m&-164;u=u|n>>8&1;u=u|o>>3&32;u=u|(p>>4|p)&128;if((p&255)<<24>>24==0){u=u|2}m=(m|16)&-5;w=l-1|0;l=w;a[w]=u&255;if((l-g|0)==256){l=l+256|0}continue L2863}else if((r|0)==79){u=k-g+1|0;k=g+(65280|t)|0;w=l-2|0;l=w;x=w-g|0;if((x|0)>256){jE(l,u)}else{a[g+((x&255)+256)|0]=u&255;a[l+1|0]=u>>8&255;l=l+256|0}continue L2863}else if((r|0)==1|(r|0)==17|(r|0)==33|(r|0)==49|(r|0)==65|(r|0)==81|(r|0)==97|(r|0)==113|(r|0)==129|(r|0)==145|(r|0)==161|(r|0)==177|(r|0)==193|(r|0)==209|(r|0)==225|(r|0)==241){u=k-g|0;k=g+(jD(g+(65502-(q>>>3))|0)|0)|0;x=l-2|0;l=x;w=x-g|0;if((w|0)>256){jE(l,u)}else{a[g+((w&255)+256)|0]=u&255;a[l+1|0]=u>>8&255;l=l+256|0}continue L2863}else if((r|0)==127){E=d[l]|0;k=g+(jD(l+1|0)|0)|0;l=l+3|0;s=2853}else if((r|0)==142){u=l;l=u+1|0;E=d[u]|0;if((l-g|0)==513){E=d[l-257|0]|0;l=l-256|0}s=2853}else if((r|0)==13){u=m&-164;u=u|n>>8&1;u=u|o>>3&32;u=u|(p>>4|p)&128;if((p&255)<<24>>24==0){u=u|2}w=l-1|0;l=w;a[w]=u&255;if((l-g|0)==256){l=l+256|0}continue L2863}else if((r|0)==45){u=l-1|0;l=u;a[u]=h&255;if((l-g|0)==256){l=l+256|0}continue L2863}else if((r|0)==77){u=l-1|0;l=u;a[u]=i&255;if((l-g|0)==256){l=l+256|0}continue L2863}else if((r|0)==109){u=l-1|0;l=u;a[u]=j&255;if((l-g|0)==256){l=l+256|0}continue L2863}else if((r|0)==174){u=l;l=u+1|0;h=d[u]|0;if((l-g|0)==513){h=d[l-257|0]|0;l=l-256|0}continue L2863}else if((r|0)==206){u=l;l=u+1|0;i=d[u]|0;if((l-g|0)==513){i=d[l-257|0]|0;l=l-256|0}continue L2863}else if((r|0)==238){u=l;l=u+1|0;j=d[u]|0;if((l-g|0)==513){j=d[l-257|0]|0;l=l-256|0}continue L2863}else if((r|0)==2|(r|0)==34|(r|0)==66|(r|0)==98|(r|0)==130|(r|0)==162|(r|0)==194|(r|0)==226|(r|0)==18|(r|0)==50|(r|0)==82|(r|0)==114|(r|0)==146|(r|0)==178|(r|0)==210|(r|0)==242){u=1<<(q>>>5);w=~u;if((q&16|0)!=0){u=0}t=t+o|0;st(e,(sw(e,t,b-1|0)|0)&w|u,t,b|0)}else if((r|0)==14|(r|0)==78){t=jD(k)|0;k=k+2|0;u=sw(e,t,b-2|0)|0;p=h-u&255;u=u&~h;if((q|0)==14){u=u|h}st(e,u,t,b|0);continue L2863}else if((r|0)==74){n=n&(sz(e,k,b|0)|0);k=k+2|0;continue L2863}else if((r|0)==106){n=n&~(sz(e,k,b|0)|0);k=k+2|0;continue L2863}else if((r|0)==10){n=n|(sz(e,k,b-1|0)|0);k=k+2|0;continue L2863}else if((r|0)==42){n=n|~(sz(e,k,b-1|0)|0);k=k+2|0;continue L2863}else if((r|0)==138){n=n^(sz(e,k,b-1|0)|0);k=k+2|0;continue L2863}else if((r|0)==234){t=jD(k)|0;k=k+2|0;u=sw(e,t&8191,b-1|0)|0;u=u^1<<(t>>>13);st(e,u,t&8191,b|0);continue L2863}else if((r|0)==202){t=jD(k)|0;k=k+2|0;u=sw(e,t&8191,b-2|0)|0;w=t>>>13;u=u&~(1<<w)|(n>>8&1)<<w;st(e,u+8192|0,t&8191,b|0);continue L2863}else if((r|0)==170){n=sz(e,k,b|0)|0;k=k+2|0;continue L2863}else if((r|0)==96){n=0;continue L2863}else if((r|0)==128){n=-1;continue L2863}else if((r|0)==237){n=n^256;continue L2863}else if((r|0)==224){m=m&-73;continue L2863}else if((r|0)==32){o=0;continue L2863}else if((r|0)==64){o=256;continue L2863}else if((r|0)==160){m=m|4;continue L2863}else if((r|0)==192){m=m&-5;continue L2863}else if((r|0)==0){continue L2863}else if((r|0)==255){u=k-g-1|0;if(u>>>0<65536){s=2902;break L2863}u=u&65535;k=g+u|0;continue L2863}else if((r|0)==239){s=2903;break L2863}else{s=2904;break L2863}}while(0);do{if((s|0)==2585){s=0;s=2586}else if((s|0)==2601){s=0;i=t;p=t}else if((s|0)==2603){s=0;k=k+1|0;r=b|0;u=o+t|0;w=u-253|0;if(w>>>0<3){x=e+1868+(w*24|0)|0;if((r|0)>=(c[x>>2]|0)){x=sh(e,x,r)|0}w=c[x+20>>2]|0;p=w;j=w;c[x+20>>2]=0}else{x=d[g+u|0]|0;p=x;j=x;x=u-240|0;if(x>>>0<16){u=su(e,x,r)|0;p=u;j=u}}continue L2863}else if((s|0)==2625){s=0;s=2626}else if((s|0)==2631){s=0;st(e,y,jD(k)|0,b|0);k=k+2|0;continue L2863}else if((s|0)==2633){s=0;st(e,i,t+o|0,b|0)}else if((s|0)==2567){s=0;u=d[k+1|0]|0;k=k+2|0;r=o+u|0;a[g+r|0]=t&255;r=r-240|0;if(r>>>0<16){a[e+1940+r|0]=t&255;if((-788594688<<r|0)<0){sr(e,t,b,r)}}continue L2863}else if((s|0)==2592){s=0;r=b|0;u=o+t|0;x=u-253|0;if(x>>>0<3){w=e+1868+(x*24|0)|0;if((r|0)>=(c[w>>2]|0)){w=sh(e,w,r)|0}x=c[w+20>>2]|0;p=x;i=x;c[w+20>>2]=0}else{w=d[g+u|0]|0;p=w;i=w;w=u-240|0;if(w>>>0<16){u=su(e,w,r)|0;p=u;i=u}}}else if((s|0)==2635){s=0;st(e,j,t+o|0,b|0)}else if((s|0)==2648){s=0;s=2649}else if((s|0)==2651){s=0;t=t+o|0;s=2652}else if((s|0)==2656){s=0;u=k+1|0;k=k+2|0;A=(d[u]|0)+o|0;s=2657}else if((s|0)==2663){s=0;s=2664}else if((s|0)==2666){s=0;t=t+o|0;s=2667}else if((s|0)==2671){s=0;u=k+1|0;k=k+2|0;B=(d[u]|0)+o|0;s=2672}else if((s|0)==2678){s=0;s=2679}else if((s|0)==2681){s=0;t=t+o|0;s=2682}else if((s|0)==2686){s=0;u=k+1|0;k=k+2|0;C=(d[u]|0)+o|0;s=2687}else if((s|0)==2693){s=0;s=2694}else if((s|0)==2696){s=0;t=t+o|0;s=2697}else if((s|0)==2701){s=0;u=k+1|0;k=u;p=(sw(e,o+(d[u]|0)|0,b-1|0)|0)-t|0;n=~p;p=p&255}else if((s|0)==2704){s=0;t=sw(e,t,b|0)|0;s=2705}else if((s|0)==2708){s=0;t=sw(e,t,b|0)|0;s=2709}else if((s|0)==2712){s=0;u=k+1|0;k=u;D=(d[u]|0)+o|0;s=2713}else if((s|0)==2719){s=0;s=2720}else if((s|0)==2722){s=0;t=t+o|0;s=2723}else if((s|0)==2737){s=0;t=t+o|0;s=2739}else if((s|0)==2741){s=0;p=n>>1&128|h>>1;n=h<<8;h=p;continue L2863}else if((s|0)==2743){s=0;u=n>>8&1;n=h<<1;p=n|u;h=p&255;continue L2863}else if((s|0)==2746){s=0;t=t+i&255;s=2747}else if((s|0)==2749){s=0;t=jD(k)|0;k=k+1|0;s=2750}else if((s|0)==2753){s=0;t=t+i&255;s=2754}else if((s|0)==2756){s=0;t=jD(k)|0;k=k+1|0;s=2757}else if((s|0)==2815){s=0;u=b-4|0;r=o+t|0;w=r-253|0;if(w>>>0<3){x=e+1868+(w*24|0)|0;if((u|0)>=(c[x>>2]|0)){x=sh(e,x,u)|0}F=c[x+20>>2]|0;c[x+20>>2]=0}else{F=d[g+r|0]|0;x=r-240|0;if(x>>>0<16){F=su(e,x,u)|0}}k=k+1|0;if((F|0)!=(h|0)){s=2533;break}else{b=b-2|0;break}}else if((s|0)==2832){s=0;k=g+(jD(k)|0)|0;continue L2863}else if((s|0)==2853){s=0;m=E;n=E<<8;o=E<<3&256;p=E<<4&2048|~E&2;continue L2863}}while(0);if((s|0)==2533){s=0;k=k+(a[k]|0)|0}else if((s|0)==2586){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2588}else if((s|0)==2626){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2628}else if((s|0)==2649){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2652}else if((s|0)==2657){s=0;p=t&(sw(e,A,b-1|0)|0);st(e,p,A,b|0);continue}else if((s|0)==2664){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2667}else if((s|0)==2672){s=0;p=t|(sw(e,B,b-1|0)|0);st(e,p,B,b|0);continue}else if((s|0)==2679){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2682}else if((s|0)==2687){s=0;p=t^(sw(e,C,b-1|0)|0);st(e,p,C,b|0);continue}else if((s|0)==2694){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2697}else if((s|0)==2705){s=0;p=i-t|0;n=~p;p=p&255}else if((s|0)==2709){s=0;p=j-t|0;n=~p;p=p&255}else if((s|0)==2713){s=0;p=sw(e,D,b-1|0)|0;s=2725}else if((s|0)==2720){s=0;u=k+1|0;k=u;t=t+(d[u]<<8)|0;s=2723}else if((s|0)==2739){s=0;p=(q>>>4&2)-1|0;p=p+(sw(e,t,b-1|0)|0)|0;st(e,p,t,b|0)}else if((s|0)==2747){s=0;t=t+o|0;s=2750}else if((s|0)==2754){s=0;t=t+o|0;s=2757}if((s|0)==2588){s=0;u=sw(e,t,b|0)|0;p=u;h=u}else if((s|0)==2628){s=0;st(e,h,t,b|0)}else if((s|0)==2652){s=0;t=sw(e,t,b|0)|0;s=2653}else if((s|0)==2667){s=0;t=sw(e,t,b|0)|0;s=2668}else if((s|0)==2682){s=0;t=sw(e,t,b|0)|0;s=2683}else if((s|0)==2697){s=0;t=sw(e,t,b|0)|0;s=2698}else if((s|0)==2723){s=0;t=sw(e,t,b|0)|0;s=2724}else if((s|0)==2750){s=0;p=n>>8&1;u=(sw(e,t,b-1|0)|0)<<1;n=u;p=p|u;st(e,p,t,b|0)}else if((s|0)==2757){s=0;u=sw(e,t,b-1|0)|0;p=n>>1&128|u>>1;n=u<<8;st(e,p,t,b|0)}if((s|0)==2653){s=0;u=h&t;h=u;p=u}else if((s|0)==2668){s=0;u=h|t;h=u;p=u}else if((s|0)==2683){s=0;u=h^t;h=u;p=u}else if((s|0)==2698){s=0;p=h-t|0;n=~p;p=p&255}else if((s|0)==2724){s=0;D=-1;p=h;s=2725}do{if((s|0)==2725){s=0;if(q>>>0>=160){t=t^255}u=t^p;p=p+(t+(n>>8&1))|0;u=u^p;m=m&-73|u>>1&8|u+128>>2&64;n=p;if((D|0)<0){h=p&255;break}else{st(e,p,D,b|0);break}}}while(0);k=k+1|0}if((s|0)==2536){b=b-(d[e+2204+(d[k]|0)|0]|0)|0}else if((s|0)==2902){s=2903}else if((s|0)==2904){a5(3328,1200,12496,1272);return 0}if((s|0)==2903){k=k-1|0;b=0;c[e+2020>>2]=1984}c[e+1972>>2]=k-g&65535;c[e+1992>>2]=l-257-g&255;c[e+1976>>2]=h&255;c[e+1980>>2]=i&255;c[e+1984>>2]=j&255;j=m&-164;j=j|n>>8&1;j=j|o>>3&32;j=j|(p>>4|p)&128;if((p&255)<<24>>24==0){j=j|2}c[e+1988>>2]=j&255;j=e+2e3|0;c[j>>2]=(c[j>>2]|0)+b;j=e+1996|0;c[j>>2]=(c[j>>2]|0)-b;j=e+1868|0;c[j>>2]=(c[j>>2]|0)-b;j=e+1892|0;c[j>>2]=(c[j>>2]|0)-b;j=e+1916|0;c[j>>2]=(c[j>>2]|0)-b;if((c[e+2e3>>2]|0)<=(f|0)){f=e+1868|0;e=f+72|0;f=e|0;e=f+4|0;return e|0}else{a5(3328,1220,12496,800);return 0}return 0}function sz(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=jD(b)|0;return(sw(a,d&8191,c|0)|0)>>(d>>>13)<<8&256|0}function sA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=d;d=a;if((b&1|0)!=0){a5(2096,78,12784,8272)}if((e|0)==0){e=d+1580|0;b=16}c[d+1576>>2]=e;c[d+1568>>2]=e;c[d+1572>>2]=e+(b<<1);return}function sB(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;g=e;e=(c[g+280>>2]|0)+f|0;f=e>>5;c[g+280>>2]=e&31;if((f|0)==0){return}e=c[g+1556>>2]|0;h=e+(d[g+93|0]<<8)|0;i=d[g+45|0]>>1|d[g+61|0];j=a[g+108|0]&31;k=a[g+12|0]|0;l=a[g+28|0]|0;m=aq(k,l)|0;if((m|0)<(c[g+1564>>2]|0)){k=-k|0}do{m=g+260|0;n=c[m>>2]^1;c[m>>2]=n;if((n|0)!=0){n=g+300|0;c[n>>2]=c[n>>2]&~c[g+264>>2];c[g+264>>2]=c[g+300>>2];c[g+304>>2]=d[g+92|0]|0}sE(g,1);sE(g,2);sE(g,3);if((c[c[g+1428+(j<<2)>>2]>>2]&c[28416+(j<<2)>>2]|0)==0){c[g+268>>2]=(c[g+268>>2]<<13^c[g+268>>2]<<14)&16384^c[g+268>>2]>>1}n=0;m=0;o=0;p=0;q=0;r=g+308|0;s=g|0;t=1;do{u=d[e+(c[r+104>>2]|0)|0]|0;v=c[r+112>>2]|0;w=(jD(s+2|0)|0)&16383;if((d[g+45|0]&t|0)!=0){w=w+((aq(n>>5,w)|0)>>10)|0}x=v-1|0;v=x;if((x|0)>=0){c[r+112>>2]=v;if((v|0)==4){c[r+104>>2]=jD(h+(d[s+4|0]<<2)|0)|0;c[r+108>>2]=1;c[r+96>>2]=r;u=0}c[r+120>>2]=0;c[r+124>>2]=0;c[r+100>>2]=(v&3|0)!=0?16384:0;w=0}v=c[r+120>>2]|0;x=0;a[s+8|0]=v>>4&255;if((v|0)!=0){y=(c[r+100>>2]|0)>>>3&510;z=26344+(y<<1)|0;A=27364+(-y<<1)|0;y=(c[r+96>>2]|0)+((c[r+100>>2]|0)>>>12<<2)|0;if((i&t|0)!=0){x=(c[g+268>>2]<<1&65535)<<16>>16;if((d[g+61|0]&t|0)==0){x=(aq(b[z>>1]|0,c[y>>2]|0)|0)>>11;x=x+((aq(b[z+2>>1]|0,c[y+4>>2]|0)|0)>>11)|0;x=x+((aq(b[A+2>>1]|0,c[y+8>>2]|0)|0)>>11)|0;x=(x&65535)<<16>>16;x=x+((aq(b[A>>1]|0,c[y+12>>2]|0)|0)>>11)|0;if(((x&65535)<<16>>16|0)!=(x|0)){x=x>>31^32767}x=x&-2}x=(aq(x,v)|0)>>11&-2}else{B=aq(b[z>>1]|0,c[y>>2]|0)|0;C=B+(aq(b[z+2>>1]|0,c[y+4>>2]|0)|0)|0;z=C+(aq(b[A+2>>1]|0,c[y+8>>2]|0)|0)|0;x=z+(aq(b[A>>1]|0,c[y+12>>2]|0)|0)>>11;x=(aq(x,v)|0)>>11}y=aq(x,c[r+128>>2]|0)|0;A=aq(x,c[r+132>>2]|0)|0;m=m+y|0;o=o+A|0;if((d[g+77|0]&t|0)!=0){p=p+y|0;q=q+A|0}}n=x;a[s+9|0]=x>>8&255;if((a[g+108|0]&128|0)!=0){D=2952}else{if((u&3|0)==1){D=2952}}if((D|0)==2952){D=0;c[r+116>>2]=0;v=0}if((c[g+260>>2]|0)!=0){if((c[g+304>>2]&t|0)!=0){c[r+116>>2]=0}if((c[g+264>>2]&t|0)!=0){c[r+112>>2]=5;c[r+116>>2]=1;x=g+124|0;a[x]=d[x]&~t&255}}L3391:do{if((c[r+112>>2]|0)!=0){D=2998}else{do{if((c[r+116>>2]|0)==0){v=v-8|0;c[r+120>>2]=v;if((v|0)<=0){c[r+120>>2]=0;break L3391}else{break}}else{x=d[s+5|0]|0;A=d[s+6|0]|0;if((x|0)>=128){if((c[r+116>>2]|0)>2){v=v-1|0;v=v-(v>>8)|0;E=A&31;c[r+124>>2]=v;if((c[c[g+1428+(E<<2)>>2]>>2]&c[28416+(E<<2)>>2]|0)!=0){D=2999;break L3391}else{c[r+120>>2]=v;D=2999;break L3391}}if((c[r+116>>2]|0)==2){v=v-1|0;v=v-(v>>8)|0;E=(x>>3&14)+16|0}else{E=((x&15)<<1)+1|0;v=v+((E|0)<31?32:1024)|0}}else{A=d[s+7|0]|0;x=A>>5;if((x|0)<4){v=A<<4;E=31}else{E=A&31;if((x|0)==4){v=v-32|0}else{if((x|0)<6){v=v-1|0;v=v-(v>>8)|0}else{v=v+32|0;do{if((x|0)>6){if((c[r+124>>2]|0)>>>0<1536){break}v=v-24|0}}while(0)}}}}do{if((v>>8|0)==(A>>5|0)){if((c[r+116>>2]|0)!=2){break}c[r+116>>2]=3}}while(0);c[r+124>>2]=v;if(v>>>0>2047){v=(v|0)<0?0:2047;if((c[r+116>>2]|0)==1){c[r+116>>2]=2}}if((c[c[g+1428+(E<<2)>>2]>>2]&c[28416+(E<<2)>>2]|0)==0){c[r+120>>2]=v}}}while(0);D=2998}}while(0);if((D|0)==2998){D=0;D=2999}if((D|0)==2999){D=0;v=c[r+100>>2]|0;A=(v&16383)+w|0;if((A|0)>32767){A=32767}c[r+100>>2]=A;if((v|0)>=16384){v=(d[e+((c[r+104>>2]|0)+(c[r+108>>2]|0)&65535)|0]<<8)+(d[e+((c[r+104>>2]|0)+(c[r+108>>2]|0)+1&65535)|0]|0)|0;A=c[r+108>>2]|0;x=A+2|0;A=x;if((x|0)>=9){x=(c[r+104>>2]|0)+9&65535;if((A|0)!=9){a5(2096,471,12720,5584)}if((u&1|0)!=0){x=jD(h+((d[s+4|0]<<2)+2)|0)|0;if((c[r+112>>2]|0)==0){y=g+124|0;a[y]=(d[y]|t)&255}}c[r+104>>2]=x;A=1}c[r+108>>2]=A;A=u>>4;x=d[16736+A|0]|0;y=d[A+16752|0]|0;A=c[r+96>>2]|0;z=A+16|0;while(1){if(A>>>0>=z>>>0){break}C=(v&65535)<<16>>16>>x<<y;B=u&12;F=c[A+44>>2]|0;G=c[A+40>>2]>>1;if((B|0)>=8){C=C+F|0;C=C-G|0;if((B|0)==8){C=C+(G>>4)|0;C=C+((F*-3|0)>>6)|0}else{C=C+((F*-13|0)>>7)|0;C=C+((G*3|0)>>4)|0}}else{if((B|0)!=0){C=C+(F>>1)|0;C=C+(-F>>5)|0}}if(((C&65535)<<16>>16|0)!=(C|0)){C=C>>31^32767}C=(C<<1&65535)<<16>>16;F=C;c[A>>2]=F;c[A+48>>2]=F;A=A+4|0;v=v<<4}if(A>>>0>=(r+48|0)>>>0){A=r|0}c[r+96>>2]=A}}t=t<<1;s=s+16|0;r=r+140|0;}while((t|0)<256);t=c[g+272>>2]|0;r=e+((d[g+109|0]<<8)+t&65535)|0;if((t|0)==0){c[g+276>>2]=(a[g+125|0]&15)<<11}t=t+4|0;if((t|0)>=(c[g+276>>2]|0)){t=0}c[g+272>>2]=t;t=((jD(r|0)|0)&65535)<<16>>16;s=((jD(r+2|0)|0)&65535)<<16>>16;n=c[g+256>>2]|0;v=n+8|0;n=v;if(v>>>0>=(g+192|0)>>>0){n=g+128|0}c[g+256>>2]=n;v=t;c[n+64>>2]=v;c[n>>2]=v;v=s;c[n+68>>2]=v;c[n+4>>2]=v;t=aq(t,a[g+127|0]|0)|0;s=aq(s,a[g+127|0]|0)|0;t=t+(aq(c[n+8>>2]|0,a[g+15|0]|0)|0)|0;s=s+(aq(c[n+12>>2]|0,a[g+15|0]|0)|0)|0;t=t+(aq(c[n+16>>2]|0,a[g+31|0]|0)|0)|0;s=s+(aq(c[n+20>>2]|0,a[g+31|0]|0)|0)|0;t=t+(aq(c[n+24>>2]|0,a[g+47|0]|0)|0)|0;s=s+(aq(c[n+28>>2]|0,a[g+47|0]|0)|0)|0;t=t+(aq(c[n+32>>2]|0,a[g+63|0]|0)|0)|0;s=s+(aq(c[n+36>>2]|0,a[g+63|0]|0)|0)|0;t=t+(aq(c[n+40>>2]|0,a[g+79|0]|0)|0)|0;s=s+(aq(c[n+44>>2]|0,a[g+79|0]|0)|0)|0;t=t+(aq(c[n+48>>2]|0,a[g+95|0]|0)|0)|0;s=s+(aq(c[n+52>>2]|0,a[g+95|0]|0)|0)|0;t=t+(aq(c[n+56>>2]|0,a[g+111|0]|0)|0)|0;s=s+(aq(c[n+60>>2]|0,a[g+111|0]|0)|0)|0;if((a[g+108|0]&32|0)==0){n=(p>>7)+((aq(t,a[g+13|0]|0)|0)>>14)|0;v=(q>>7)+((aq(s,a[g+13|0]|0)|0)>>14)|0;if(((n&65535)<<16>>16|0)!=(n|0)){n=n>>31^32767}if(((v&65535)<<16>>16|0)!=(v|0)){v=v>>31^32767}jE(r|0,n);jE(r+2|0,v)}v=aq(m,k)|0;r=v+(aq(t,a[g+44|0]|0)|0)>>14;t=aq(o,l)|0;v=t+(aq(s,a[g+60|0]|0)|0)>>14;if(((r&65535)<<16>>16|0)!=(r|0)){r=r>>31^32767}if(((v&65535)<<16>>16|0)!=(v|0)){v=v>>31^32767}if((a[g+108|0]&64|0)!=0){r=0;v=0}s=c[g+1568>>2]|0;b[s>>1]=r&65535;b[s+2>>1]=v&65535;s=s+4|0;if(s>>>0>=(c[g+1572>>2]|0)>>>0){s=g+1580|0;c[g+1572>>2]=g+1612}c[g+1568>>2]=s;s=f-1|0;f=s;}while((s|0)!=0);return}function sC(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function sD(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((a|0)<(c|0)){d=c}else{d=a}return d|0}function sE(a,b){a=a|0;b=b|0;var d=0,e=0;d=b;b=a;a=c[b+284+(d<<2)>>2]|0;e=a;a=e-1|0;if((e&7|0)==0){a=a-(6-d)|0}c[b+284+(d<<2)>>2]=a;return}function sF(a,b){a=a|0;b=b|0;c[a+1564>>2]=b&1?0:-16384;return}function sG(a){a=a|0;var b=0,d=0,e=0;b=a;c[b+284>>2]=1;c[b+288>>2]=0;c[b+292>>2]=-32;c[b+296>>2]=11;a=2;d=1;while(1){if((d|0)>=32){break}c[b+1428+(d<<2)>>2]=b+284+(a<<2);e=a-1|0;a=e;if((e|0)==0){a=3}d=d+1|0}c[b+1428>>2]=b+284;c[b+1548>>2]=b+292;return}function sH(a){a=a|0;return c[a+316>>2]|0}function sI(b,c){b=b|0;c=c|0;a[b+8|0]=c&1&1;return}function sJ(a,b){a=a|0;b=b|0;var d=0;d=b;b=a;c[b+1560>>2]=d;a=0;while(1){if((a|0)>=8){break}c[b+308+(a*140|0)+136>>2]=(d>>a&1)-1;sg(b,a<<4);a=a+1|0}return}function sK(a){a=a|0;sM(a,27752);return}function sL(b){b=b|0;var c=0;c=b;a[c+108|0]=-32;sZ(c);return}function sM(a,b){a=a|0;b=b|0;var e=0,f=0;e=a;a=e|0;f=b;wh(a|0,f|0,128)|0;wg(e+128|0,0,1428);f=8;while(1){a=f-1|0;f=a;if((a|0)<0){break}a=e+308+(f*140|0)|0;c[a+108>>2]=1;c[a+96>>2]=a}c[e+300>>2]=d[e+76|0]|0;sJ(e,c[e+1560>>2]|0);sZ(e);return}function sN(a){a=a|0;ta(a);return}function sO(a){a=a|0;tl(a);return}function sP(a){a=a|0;var b=0;b=a;a=sC(c[b+320>>2]|0,66048)|0;return(c[b+316>>2]|0)+a|0}function sQ(a){a=a|0;return sD(0,(c[a+320>>2]|0)-66048|0)|0}function sR(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;c=a;a=sH(c)|0;d=sP(c)|0;sS(a,d,sQ(c)|0,b);return 0}function sS(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;h=b;b=e;e=f;f=g;g=0;i=0;while(1){if((i|0)>=3){break}j=(d[h+169+i|0]|0)-48|0;if(j>>>0>9){k=3096;break}g=g*10|0;g=g+j|0;i=i+1|0}if((k|0)==3096){do{if((i|0)==1){if((a[h+176|0]|0)==0){if((a[h+177|0]|0)!=0){break}}g=0}}while(0)}if((g|0)!=0){if((g|0)>8191){k=3105}}else{k=3105}if((k|0)==3105){g=jD(h+169|0)|0}if((g|0)<8191){c[f+4>>2]=g*1e3|0}if((a[h+176|0]|0)<32){l=1}else{l=((a[h+176|0]|0)-48|0)>>>0<=9}g=l&1;gm(f+784|0,h+176+g|0,32-g|0);gm(f+528|0,h+46|0,32);gm(f+272|0,h+78|0,32);gm(f+1552|0,h+110|0,16);gm(f+1296|0,h+126|0,32);if((e|0)==0){return}tk(b,e,f);return}function sT(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0.0;c=b;b=a;a=r$(b+1956|0)|0;if((a|0)!=0){d=a;e=d;return e|0}fW(b,0);do{if((c|0)!=32e3){a=e6(b+328|0,3200)|0;if((a|0)!=0){d=a;e=d;return e|0}else{a=b+328|0;f=32.0e3/+(c|0);+e9(a,f,.9965,1.0);break}}}while(0);d=0;e=d;return e|0}function sU(a,b){a=a|0;b=b|0;var c=0;c=b&1;b=a;dl(b,c&1);sI(b+1920|0,c&1);return}function sV(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;cQ(b,c);sW(b+1956|0,c);return}function sW(a,b){a=a|0;b=b|0;sJ(a|0,b);return}function sX(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=b;b=d;d=a;c[d+316>>2]=e;c[d+320>>2]=b;jI(d,8);if((b|0)<65920){f=c[74]|0;g=f;return g|0}else{f=s2(e)|0;g=f;return g|0}return 0}function sY(a,b){a=a|0;b=b|0;var d=0;d=a;c[d+1556>>2]=b;sJ(d,0);sF(d,0);sA(d,0,0);sK(d);d=32768;if(((d&65535)<<16>>16|0)!=(d|0)){d=d>>31^32767}if((d|0)!=32767){a5(2096,658,12688,4272)}d=-32769;if(((d&65535)<<16>>16|0)!=(d|0)){d=d>>31^32767}if((d|0)==-32768){f8();return}else{a5(2096,659,12688,3312);f8();return}}function sZ(a){a=a|0;var b=0;b=a;if((c[b+1556>>2]|0)==0){a5(2096,667,12744,2592)}c[b+268>>2]=16384;c[b+256>>2]=b+128;c[b+260>>2]=1;c[b+272>>2]=0;c[b+280>>2]=0;sG(b);return}function s_(a){a=a|0;var b=0;b=a;hO(b);c[b>>2]=20512;sN(b+328|0);tn(b+1920|0);jF(b,c[80]|0);hu(b,16704);le(b,1.4);return}function s$(a){a=a|0;var b=0;b=a;s0(b);cK(b);return}function s0(a){a=a|0;var b=0;b=a;c[b>>2]=20512;sO(b+328|0);hQ(b);return}function s1(a,b){a=a|0;b=b|0;c[a>>2]=b;return}function s2(a){a=a|0;var b=0,d=0;if((wk(a|0,9648,27)|0)!=0){b=c[74]|0;d=b;return d|0}else{b=0;d=b;return d|0}return 0}function s3(a,b){a=a|0;b=+b;rW(a+1956|0,~~(b*256.0));return}function s4(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;a=cR(d,b)|0;if((a|0)!=0){e=a;f=e;return f|0}e5(d+328|0);tm(d+1920|0);a=sa(d+1956|0,c[d+316>>2]|0,c[d+320>>2]|0)|0;if((a|0)!=0){e=a;f=e;return f|0}s1(d+1920|0,~~(+jJ(d)*256.0));sb(d+1956|0);e=0;f=e;return f|0}function s5(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;d=b;b=c;c=a;a=sp(c+1956|0,d,b)|0;if((a|0)!=0){e=a;f=e;return f|0}tp(c+1920|0,b,d);e=0;f=e;return f|0}function s6(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+128|0;e=d|0;f=b;b=a;if((hv(b)|0)!=32e3){f=~~(+(f|0)*+dV(b+328|0))&-2;f=f-(fc(b+328|0,f)|0)|0}do{if((f|0)>0){a=si(b+1956|0,f)|0;if((a|0)!=0){g=a;h=g;i=d;return h|0}else{tm(b+1920|0);break}}}while(0);g=bS[c[(c[b>>2]|0)+64>>2]&255](b,64,e|0)|0;h=g;i=d;return h|0}function s7(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=b;b=c;c=a;if((hv(c)|0)==32e3){e=s5(c,d,b)|0;f=e;return f|0}a=d;while(1){if((a|0)<=0){g=3233;break}a=a-(s8(c+328|0,b+(d-a<<1)|0,a)|0)|0;if((a|0)>0){h=s9(c+328|0)|0;i=s5(c,h,dW(c+328|0)|0)|0;if((i|0)!=0){g=3229;break}er(c+328|0,h)}}if((g|0)==3229){e=i;f=e;return f|0}else if((g|0)==3233){e=0;f=e;return f|0}return 0}function s8(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=d;d=e;e=a;a=f;g=es(e|0)|0;h=c[e+8>>2]|0;i=(c[e+28>>2]|0)>>>((c[e+16>>2]|0)>>>0);j=e+52+((c[e+16>>2]|0)*48|0)|0;k=(c[e+12>>2]|0)-(c[e+16>>2]|0)|0;l=c[e+32>>2]|0;d=d>>1;if(((h-g|0)/2|0|0)>=48){h=h-96|0;do{d=d-1|0;m=0;n=0;o=g;if((d|0)<0){p=3241;break}p=12;while(1){if((p|0)==0){break}q=b[j>>1]|0;m=m+(aq(q,b[o>>1]|0)|0)|0;n=n+(aq(q,b[o+2>>1]|0)|0)|0;q=b[j+2>>1]|0;j=j+4|0;m=m+(aq(q,b[o+4>>1]|0)|0)|0;n=n+(aq(q,b[o+6>>1]|0)|0)|0;o=o+8|0;p=p-1|0}k=k-1|0;m=m>>15;n=n>>15;g=g+((i<<1&2)<<1)|0;i=i>>>1;g=g+(l<<1)|0;if((k|0)==0){j=e+52|0;i=c[e+28>>2]|0;k=c[e+12>>2]|0}b[a>>1]=m&65535;b[a+2>>1]=n&65535;a=a+4|0;}while(g>>>0<=h>>>0)}c[e+16>>2]=(c[e+12>>2]|0)-k;k=((c[e+8>>2]|0)-g|0)/2|0;c[e+8>>2]=eH(e|0,k)|0;wi(es(e|0)|0,g|0,k<<1|0);return(a-f|0)/2|0|0}function s9(a){a=a|0;var b=0;b=a;a=ey(b|0)|0;return(a-(c[b+8>>2]|0)|0)/2|0|0}function ta(a){a=a|0;var b=0;b=a;e3(b,24,b+52|0);return}function tb(a){a=a|0;tf(a);return}function tc(a){a=a|0;to(a);return}function td(){var a=0,b=0,c=0;a=j6(70464)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;s_(b);c=b}return c|0}function te(){var a=0,b=0,c=0;a=j6(584)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;tb(b);c=b}return c|0}function tf(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=19608;f2(b+572|0);jF(b,c[80]|0);return}function tg(a){a=a|0;var b=0;b=a;tc(b);cK(b);return}function th(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function ti(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=b;b=a;a=d;e=bT[c[(c[a>>2]|0)+16>>2]&63](a)|0;if((e|0)<65920){f=c[74]|0;g=f;return g|0}a=d;h=bS[c[(c[a>>2]|0)+12>>2]&255](a,b+316|0,256)|0;if((h|0)!=0){f=h;g=f;return g|0}h=s2(b+316|0)|0;if((h|0)!=0){f=h;g=f;return g|0}h=e-66048|0;do{if((h|0)>0){e=da(b+572|0,h)|0;if((e|0)!=0){f=e;g=f;return g|0}e=d;a=bY[c[(c[e>>2]|0)+20>>2]&127](e,65792)|0;if((a|0)!=0){f=a;g=f;return g|0}a=d;e=c[(c[a>>2]|0)+12>>2]|0;i=c0(b+572|0)|0;j=gc(b+572|0)|0;k=bS[e&255](a,i,j)|0;if((k|0)!=0){f=k;g=f;return g|0}else{break}}}while(0);f=0;g=f;return g|0}function tj(a,b,c){a=a|0;b=b|0;c=c|0;c=a;a=c0(c+572|0)|0;sS(c+316|0,a,gc(c+572|0)|0,b);return 0}function tk(b,c,e){b=b|0;c=c|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=i;i=i+264|0;g=f|0;h=b;b=c;c=e;e=h+b|0;do{if((b|0)>=8){if((wk(h|0,8232,4)|0)!=0){break}j=lE(h+4|0)|0;k=h+8|0;if((e-k|0)>(j|0)){e=k+j|0}j=0;l=0;while(1){if((e-k|0)<4){break}m=d[k|0]|0;n=((d[k+3|0]|0)<<8)+(d[k+2|0]|0)|0;if((d[k+1|0]|0|0)!=0){o=n}else{o=0}p=o;k=k+4|0;if((p|0)>(e-k|0)){q=3341;break}r=0;s=m;if((s|0)==1){r=c+528|0}else if((s|0)==2){r=c+272|0}else if((s|0)==3){r=c+784|0}else if((s|0)==4){r=c+1552|0}else if((s|0)==7){r=c+1296|0}else if((s|0)==20){j=n}else if((s|0)==19){l=th(p,256)|0;s=g+5|0;n=k;t=l;wh(s|0,n|0,t)|0}else{do{if((m|0)<1){q=3356}else{if((m|0)>7){if((m|0)<16){q=3356;break}}if((m|0)>20){if((m|0)<48){q=3356;break}}if((m|0)>54){q=3356}}}while(0);if((q|0)==3356){q=0}}if((r|0)!=0){gm(r,k,p)}k=k+p|0;m=k;while(1){if((k-h&3|0)!=0){u=k>>>0<e>>>0}else{u=0}if(!u){break}t=k;k=t+1|0;if((d[t]|0|0)!=0){q=3365;break}}if((q|0)==3365){q=0;k=m}}k=g+5|0;if((j|0)!=0){p=k-1|0;k=p;a[p]=32;p=4;while(1){r=p;p=r-1|0;if((r|0)==0){break}r=k-1|0;k=r;a[r]=((j|0)%10|0)+48&255;j=(j|0)/10|0}l=l+5|0}if((l|0)==0){i=f;return}gm(c+1040|0,k,l);i=f;return}}while(0);i=f;return}function tl(a){a=a|0;e4(a);return}function tm(a){a=a|0;wg(a+12|0,0,24);return}function tn(b){b=b|0;var d=0;d=b;a[d+8|0]=1;c[d>>2]=256;c[d+4>>2]=8;tm(d);return}function to(a){a=a|0;var b=0;b=a;c[b>>2]=19608;f3(b+572|0);ik(b);return}function tp(d,e,f){d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;g=e;e=f;f=d;if((e&1|0)!=0){a5(1856,32,16152,8144)}d=c[f>>2]|0;if(!(a[f+8|0]&1)){if((d|0)!=256){h=g+(e<<1)|0;while(1){if(g>>>0>=h>>>0){break}i=(aq(b[g>>1]|0,d)|0)>>8;if(((i&65535)<<16>>16|0)!=(i|0)){i=i>>31^32767}j=g;g=j+2|0;b[j>>1]=i&65535}}return}h=c[f+4>>2]|0;i=f+36|0;do{j=i-12|0;i=j;k=c[j+8>>2]|0;j=c[i+4>>2]|0;l=c[i>>2]|0;m=0;while(1){if((m|0)>=(e|0)){break}n=(b[g+(m<<1)>>1]|0)+l|0;l=(b[g+(m<<1)>>1]|0)*3|0;o=n-j|0;j=n;n=k>>10;k=k+((aq(o,d)|0)-(k>>h))|0;if(((n&65535)<<16>>16|0)!=(n|0)){n=n>>31^32767}b[g+(m<<1)>>1]=n&65535;m=m+2|0}c[i>>2]=l;c[i+4>>2]=j;c[i+8>>2]=k;g=g+2|0;}while((i|0)!=(f+12|0));return}function tq(b){b=b|0;var d=0,e=0,f=0;d=i;i=i+80|0;e=d|0;f=b;tI(f);c[f>>2]=20384;c[f+336>>2]=20480;a[f+3488|0]=0;c[f+3480>>2]=0;jF(f,c[78]|0);jG(f,16624);jH(f,1);hH(e,-14.0,80.0);hK(f,e);i=d;return}function tr(a){a=a|0;return c[a+1204>>2]|0}function ts(a,b){a=a|0;b=b|0;var d=0;d=a;c[d>>2]=b;c[d+4>>2]=0;return}function tt(a){a=a|0;return(c[a+4>>2]|0)!=-1|0}function tu(a){a=a|0;return(c[a+4>>2]|0)!=-1|0}function tv(a){a=a|0;tK(a-336|0);return}function tw(a){a=a|0;tJ(a);return}function tx(a){a=a|0;tw(a-336|0);return}function ty(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=b;b=a;if((d|0)!=0){c[d>>2]=0}a=(lE((tr(b)|0)+20|0)|0)-44|0;if((a|0)<0){e=0;f=e;return f|0}g=(c[b+1204>>2]|0)+64+a|0;a=tz(g,(c[b+1212>>2]|0)-g|0)|0;if((a|0)==0){e=0;f=e;return f|0}if((d|0)!=0){c[d>>2]=a+12}e=g;f=e;return f|0}function tz(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;do{if((a|0)<12){d=0}else{if((wk(c|0,7224,4)|0)!=0){d=0;break}if((lE(c+4|0)|0)>>>0>=512){d=0;break}b=lE(c+8|0)|0;if((b|0)>(a-12|0)){d=0;break}else{d=b;break}}}while(0);return d|0}function tA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;d=i;i=i+8|0;e=d|0;f=b;b=a;tB(tr(b)|0,f);a=ty(b,e)|0;if((a|0)==0){i=d;return 0}tC(a+12|0,a+(c[e>>2]|0)|0,f);i=d;return 0}function tB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=a;a=b;b=(((lE(d+24|0)|0)*10|0)>>>0)/441|0;if((b|0)<=0){return}e=lE(d+32|0)|0;do{if((e|0)>0){if((lE(d+28|0)|0)==0){f=3462;break}c[a+12>>2]=(e*10|0|0)/441|0;c[a+8>>2]=b-(c[a+12>>2]|0)}else{f=3462}}while(0);if((f|0)==3462){c[a+4>>2]=b;c[a+8>>2]=b;c[a+12>>2]=0}return}function tC(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=a;a=b;b=c;d=t2(d,a,b+528|0)|0;d=t2(d,a,b+272|0)|0;d=t2(d,a,b+16|0)|0;d=t2(d,a,b+784|0)|0;d=t3(d,a,b+1040|0)|0;d=t2(d,a,b+1552|0)|0;d=t3(d,a,b+1296|0)|0;return}function tD(a,b){a=a|0;b=+b;var d=0;d=a;if((c[d+3480>>2]|0)==0){return}c[d+3484>>2]=~~(44100.0*b+.5);c[d+1200>>2]=~~+ac(+(4096.0/+(c[d+3484>>2]|0)*+(c[d+3480>>2]|0)+.5));c[d+1196>>2]=~~+ac(+(+h[d+3472>>3]*4096.0/+(c[d+3484>>2]|0)+.5))+2;return}function tE(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=b;b=a;a=cu(b+1264|0,c,33)|0;if((a|0)!=0){d=a;e=d;return e|0}d=de(b,c)|0;e=d;return e|0}function tF(a,b){a=a|0;b=b|0;var c=0;c=b;b=a;jj(b+1312|0,c);jl(b+2912|0,c);return}function tG(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=b;if((f|0)>=4){return}jp(a+1312|0,f,c,d,e);return}function tH(b,c){b=b|0;c=c|0;var d=0,e=0,f=0.0;d=c;c=b;df(c,d);ts(c+2912|0,c+1264|0);if(!(a[c+3489|0]&1)){return}if((d&128|0)!=0){e=0}else{e=c+1264|0}lO(c+1312|0,e);if(tt(c+1240|0)|0){if((d&64|0)!=0){f=0.0}else{f=+jJ(c)*.001306640625}ji(c+2912|0,f);iM(c+1240|0,d)}if(tu(c+1252|0)|0){e=d&63;if((d&32|0)!=0){e=e|480}if((d&64|0)!=0){e=e|15872}uj(c+1252|0,e)}return}function tI(a){a=a|0;var b=0;b=a;cJ(b);eo(b+336|0);c[b>>2]=21880;c[b+336>>2]=21976;t8(b+1240|0);t9(b+1252|0);ct(b+1264|0);jd(b+1312|0);jv(b+2912|0);return}function tJ(a){a=a|0;var b=0;b=a;c[b>>2]=21880;c[b+336>>2]=21976;i8(b+1312|0);cl(b+1264|0);t4(b+1252|0);t5(b+1240|0);ep(b+336|0);cP(b);return}function tK(a){a=a|0;var b=0;b=a;tw(b);cK(b);return}function tL(a,b){a=a|0;b=b|0;c[a+4>>2]=b&1?0:-1;return}function tM(a,b){a=a|0;b=b|0;c[a+4>>2]=b&1?0:-1;return}function tN(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=d;d=e;e=b;if((d|0)<=64){g=c[74]|0;h=g;return h|0}b=f;i=tO(b)|0;if((i|0)!=0){g=i;h=g;return h|0}c[e+3480>>2]=lE(b+12|0)|0;if((c[e+3480>>2]|0)==0){c[e+3480>>2]=3579545}co(e+1264|0,c[e+3480>>2]|0);c[e+1204>>2]=f;c[e+1212>>2]=f+d;c[e+1208>>2]=c[e+1212>>2];if((lE(b+28|0)|0)!=0){d=(lE(b+28|0)|0)+28|0;c[e+1208>>2]=(c[e+1204>>2]|0)+d}jI(e,4);d=tP(e)|0;if((d|0)!=0){g=d;h=g;return h|0}hu(e,a[e+3489|0]&1?16672:16656);g=c5(e,c[e+3480>>2]|0)|0;h=g;return h|0}function tO(a){a=a|0;var b=0,d=0;if((wk(a|0,8224,4)|0)!=0){b=c[74]|0;d=b;return d|0}else{b=0;d=b;return d|0}return 0}function tP(b){b=b|0;var d=0,e=0,f=0,g=0,j=0.0,k=0.0,l=0,m=0;d=i;i=i+16|0;e=d|0;f=d+8|0;g=b;c[e>>2]=lE((tr(g)|0)+44|0)|0;c[f>>2]=lE((tr(g)|0)+16|0)|0;do{if((c[f>>2]|0)!=0){if((lE((tr(g)|0)+8|0)|0)>>>0>=272){break}uq(g,f,e)}}while(0);a[g+3489|0]=0;h[g+3472>>3]=+(eM(g+1264|0)|0)*1.5;do{if((c[e>>2]|0)!=0){a[g+3489|0]=1;if(a[g+3488|0]&1){h[g+3472>>3]=+(c[e>>2]|0)/144.0}b=g+336|0;j=+h[g+3472>>3];k=j/+(eM(g+1264|0)|0);j=+jJ(g)*3.0;+lL(b,k,.99,j);b=iN(g+1240|0,+h[g+3472>>3],+(c[e>>2]|0))|0;if((b|0)!=0){l=b;m=l;i=d;return m|0}else{tL(g+1240|0,1);jI(g,8);break}}}while(0);do{if(!(a[g+3489|0]&1)){if((c[f>>2]|0)==0){break}a[g+3489|0]=1;if(a[g+3488|0]&1){h[g+3472>>3]=+(c[f>>2]|0)/72.0}e=g+336|0;j=+h[g+3472>>3];k=j/+(eM(g+1264|0)|0);j=+jJ(g)*3.0;+lL(e,k,.99,j);e=ug(g+1252|0,+h[g+3472>>3],+(c[f>>2]|0))|0;if((e|0)==2){l=9584;m=l;i=d;return m|0}if((((e|0)!=0^1)&1|0)==0){l=9264;m=l;i=d;return m|0}else{tM(g+1252|0,1);jI(g,8);break}}}while(0);do{if(a[g+3489|0]&1){f=eN(g+1264|0)|0;e=ej(g+336|0,(aq(f,eM(g+1264|0)|0)|0)/1e3|0)|0;if((e|0)!=0){l=e;m=l;i=d;return m|0}else{jg(g+1312|0,+jJ(g)*.405);break}}else{tL(g+1240|0,0);tM(g+1252|0,0);jg(g+1312|0,+jJ(g))}}while(0);l=0;m=l;i=d;return m|0}function tQ(b,e){b=b|0;e=e|0;var f=0,g=0,h=0;f=b;b=c6(f,e)|0;if((b|0)!=0){g=b;h=g;return h|0}b=jD((tr(f)|0)+40|0)|0;jh(f+1312|0,b,d[(tr(f)|0)+42|0]|0);c[f+1236>>2]=-1;c[f+1220>>2]=(c[f+1204>>2]|0)+64;c[f+1224>>2]=c[f+1220>>2];c[f+1228>>2]=c[f+1220>>2];c[f+1232>>2]=-1;c[f+1216>>2]=0;if((lE((tr(f)|0)+8|0)|0)>>>0>=336){b=lE((tr(f)|0)+52|0)|0;if((b|0)!=0){e=f+1220|0;c[e>>2]=(c[e>>2]|0)+(b+52-64)}}if(a[f+3489|0]&1){if(tu(f+1252|0)|0){uh(f+1252|0)}if(tt(f+1240|0)|0){iP(f+1240|0)}c[f+1192>>2]=0;cn(f+1264|0,1);em(f+336|0)}g=0;h=g;return h|0}function tR(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=b;b=a;c[e>>2]=um(b,(aq(d,c[b+3484>>2]|0)|0)/1e3|0)|0;jr(b+1312|0,c[e>>2]|0);return 0}function tS(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;e=c;c=d;d=b;if(a[d+3489|0]&1){eC(d+336|0,e,c,d+1264|0);f=0;g=f;return g|0}else{f=dg(d,e,c)|0;g=f;return g|0}return 0}function tT(a){a=a|0;tX(a);return}function tU(a){a=a|0;ud(a);return}function tV(){var a=0,b=0,c=0;a=j6(3496)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;tq(b);c=b}return c|0}function tW(){var a=0,b=0,c=0;a=j6(392)|0;b=0;if((a|0)==0){c=0}else{b=1;b=a;tT(b);c=b}return c|0}function tX(a){a=a|0;var b=0;b=a;j8(b);c[b>>2]=19520;f2(b+380|0);jF(b,c[78]|0);return}function tY(a){a=a|0;var b=0;b=a;tU(b);cK(b);return}function tZ(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;if((c|0)<(a|0)){d=c}else{d=a}return d|0}function t_(a,b){a=a|0;b=b|0;var c=0,e=0,f=0;c=a;a=b;do{if((a-c|0)<2){e=3698;break}c=c+2|0;}while((d[c-2|0]|0|(d[c-1|0]|0)|0)!=0);if((e|0)==3698){f=c;return f|0}f=c;return f|0}function t$(a,b){a=a|0;b=b|0;return(aq(b,c[a+1200>>2]|0)|0)>>12|0}function t0(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;i=i+16|0;e=d|0;f=b;b=a;a=f;g=bT[c[(c[a>>2]|0)+16>>2]&63](a)|0;if((g|0)<=64){h=c[74]|0;j=h;i=d;return j|0}a=f;k=bS[c[(c[a>>2]|0)+12>>2]&255](a,b+316|0,64)|0;if((k|0)!=0){h=k;j=h;i=d;return j|0}k=tO(b+316|0)|0;if((k|0)!=0){h=k;j=h;i=d;return j|0}k=(lE(b+336|0)|0)-44|0;a=g-64-k|0;do{if((k|0)>0){if((a|0)<12){break}g=f;l=bY[c[(c[g>>2]|0)+20>>2]&127](g,k)|0;if((l|0)!=0){h=l;j=h;i=d;return j|0}l=f;g=bS[c[(c[l>>2]|0)+12>>2]&255](l,e|0,12)|0;if((g|0)!=0){h=g;j=h;i=d;return j|0}g=tz(e|0,a)|0;do{if((g|0)!=0){l=da(b+380|0,g)|0;if((l|0)!=0){h=l;j=h;i=d;return j|0}l=f;m=c[(c[l>>2]|0)+12>>2]|0;n=c0(b+380|0)|0;o=gc(b+380|0)|0;p=bS[m&255](l,n,o)|0;if((p|0)!=0){h=p;j=h;i=d;return j|0}else{break}}}while(0)}}while(0);h=0;j=h;i=d;return j|0}function t1(a,b,c){a=a|0;b=b|0;c=c|0;c=b;b=a;tB(b+316|0,c);if((gc(b+380|0)|0)==0){return 0}a=c0(b+380|0)|0;tC(a,c1(b+380|0)|0,c);return 0}function t2(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=b;return t_(t3(a,d,c)|0,d)|0}function t3(b,c,e){b=b|0;c=c|0;e=e|0;var f=0,g=0,h=0,i=0;f=b;b=e;e=t_(f,c)|0;c=((e-f|0)/2|0)-1|0;if((c|0)<=0){g=e;return g|0}c=tZ(c,255)|0;a[b+c|0]=0;h=0;while(1){if((h|0)>=(c|0)){break}if((a[f+((h<<1)+1)|0]|0)!=0){i=63}else{i=d[f+(h<<1)|0]|0}a[b+h|0]=i&255;h=h+1|0}g=e;return g|0}function t4(a){a=a|0;t7(a);return}function t5(a){a=a|0;t6(a);return}function t6(a){a=a|0;iO(a);return}function t7(a){a=a|0;uf(a);return}function t8(a){a=a|0;ub(a);return}function t9(a){a=a|0;ua(a);return}function ua(a){a=a|0;var b=0;b=a;ue(b);c[b+4>>2]=-1;c[b+8>>2]=0;return}function ub(a){a=a|0;var b=0;b=a;lV(b);c[b+4>>2]=-1;c[b+8>>2]=0;return}function uc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=d;d=a;a=t$(d,b)|0;b=c[d+1232>>2]|0;c[d+1232>>2]=e;if((b|0)>=0){jc(d+2912|0,a,e-b|0,d+1264|0);return}else{b=d+1232|0;c[b>>2]=c[b>>2]|c[d+1236>>2];return}}function ud(a){a=a|0;var b=0;b=a;c[b>>2]=19520;f3(b+380|0);ik(b);return}function ue(a){a=a|0;return}function uf(a){a=a|0;return}function ug(a,b,c){a=a|0;b=+b;c=+c;return 2}function uh(a){a=a|0;return}function ui(a,b,c){a=a|0;b=b|0;c=c|0;return}function uj(a,b){a=a|0;b=b|0;return}function uk(a){a=a|0;var b=0,c=0;b=a>>4;if((b|0)==3|(b|0)==4){c=2}else if((b|0)==12|(b|0)==13){c=4}else if((b|0)==5|(b|0)==10|(b|0)==11){c=3}else if((b|0)==14|(b|0)==15){c=5}else{c=1}return c|0}function ul(a,b){a=a|0;b=b|0;var d=0;d=a;a=aq(b,c[d+1196>>2]|0)|0;return a+(c[d+1192>>2]|0)>>12|0}function um(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=b;b=a;a=c[b+1216>>2]|0;f=c[b+1220>>2]|0;if(f>>>0>=(c[b+1212>>2]|0)>>>0){lT(b);if(f>>>0>(c[b+1212>>2]|0)>>>0){gA(b,1768)}}while(1){if((a|0)<(e|0)){g=f>>>0<(c[b+1212>>2]|0)>>>0}else{g=0}if(!g){break}h=f;f=h+1|0;i=d[h]|0;if((i|0)==98){a=a+735|0}else if((i|0)==102){f=c[b+1208>>2]|0}else if((i|0)==99){a=a+882|0}else if((i|0)==79){h=t$(b,a)|0;j=f;f=j+1|0;js(b+1312|0,h,d[j]|0)}else if((i|0)==80){j=t$(b,a)|0;h=f;f=h+1|0;jz(b+1312|0,j,d[h]|0)}else if((i|0)==97){a=a+(((d[f+1|0]|0)<<8)+(d[f|0]|0))|0;f=f+2|0}else if((i|0)==100){h=f;f=h+1|0;a=a+(d[h]|0)|0}else if((i|0)==81){if((un(b+1252|0,ul(b,a)|0)|0)!=0){ui(b+1252|0,d[f|0]|0,d[f+1|0]|0)}f=f+2|0}else if((i|0)==82){if((d[f|0]|0|0)==42){uc(b,a,d[f+1|0]|0)}else{if((uo(b+1240|0,ul(b,a)|0)|0)!=0){if((d[f|0]|0|0)==43){c[b+1236>>2]=((d[f+1|0]|0)>>7&1)-1;h=b+1232|0;c[h>>2]=c[h>>2]|c[b+1236>>2]}iQ(b+1240|0,d[f|0]|0,d[f+1|0]|0)}}f=f+2|0}else if((i|0)==83){if((uo(b+1240|0,ul(b,a)|0)|0)!=0){iR(b+1240|0,d[f|0]|0,d[f+1|0]|0)}f=f+2|0}else if((i|0)==103){h=d[f+1|0]|0;j=lE(f+2|0)|0;f=f+6|0;if((h|0)==0){c[b+1224>>2]=f}f=f+j|0}else if((i|0)==224){c[b+1228>>2]=(c[b+1224>>2]|0)+((d[f+3|0]|0)<<24)+((d[f+2|0]|0)<<16)+((d[f+1|0]|0)<<8)+(d[f|0]|0);f=f+4|0}else{i=d[f-1|0]|0;j=i&240;if((j|0)==128){h=b+1228|0;k=c[h>>2]|0;c[h>>2]=k+1;uc(b,a,d[k]|0);a=a+(i&15)|0}else if((j|0)==112){a=a+((i&15)+1)|0}else if((j|0)==80){f=f+2|0}else{f=f+((uk(i)|0)-1)|0;gA(b,8032)}}}a=a-e|0;c[b+1220>>2]=f;c[b+1216>>2]=a;return t$(b,e)|0}function un(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=a;a=d-(c[b+4>>2]|0)|0;do{if((a|0)>0){if((c[b+4>>2]|0)>=0){c[b+4>>2]=d;e=c[b+8>>2]|0;f=b+8|0;c[f>>2]=(c[f>>2]|0)+(a<<1<<1);uH(b,a,e);break}g=0;h=g;return h|0}}while(0);g=1;h=g;return h|0}function uo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;b=a;a=d-(c[b+4>>2]|0)|0;do{if((a|0)>0){if((c[b+4>>2]|0)>=0){c[b+4>>2]=d;e=c[b+8>>2]|0;f=b+8|0;c[f>>2]=(c[f>>2]|0)+(a<<1<<1);iU(b,a,e);break}g=0;h=g;return h|0}}while(0);g=1;h=g;return h|0}function up(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return uu(a-336|0,b,c,d)|0}function uq(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;f=b;b=e;e=a;a=(c[e+1204>>2]|0)+64|0;while(1){if(a>>>0>=(c[e+1212>>2]|0)>>>0){g=3867;break}h=d[a]|0;if((h|0)==81){g=3859;break}else if((h|0)==82|(h|0)==83){g=3860;break}else if((h|0)==102){g=3855;break}else if((h|0)==103){a=a+((lE(a+3|0)|0)+7)|0}else if((h|0)==84){g=3861;break}else if((h|0)==97){a=a+3|0}else if((h|0)==80|(h|0)==100){a=a+2|0}else{a=a+(uk(d[a]|0)|0)|0}}if((g|0)==3859){c[b>>2]=0;return}else if((g|0)==3860){c[b>>2]=c[f>>2];c[f>>2]=0;return}else if((g|0)==3855){return}else if((g|0)==3861){c[f>>2]=0;c[b>>2]=0;return}else if((g|0)==3867){return}}function ur(a){a=a|0;tJ(a);return}function us(a){a=a|0;ur(a-336|0);return}function ut(a){a=a|0;ux(a-336|0);return}function uu(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b;b=e;e=a;a=d>>1;d=((a<<12|0)/(c[e+1196>>2]|0)|0)-1|0;if((ul(e,d)|0)>(a|0)){a5(5368,243,15072,4200);return 0}g=a;while(1){h=ul(e,d)|0;g=h;if((h|0)>=(a|0)){break}d=d+1|0}if(tt(e+1240|0)|0){uv(e+1240|0,b);wg(b|0,0,g<<1<<1|0)}else{if(tu(e+1252|0)|0){uw(e+1252|0,b)}}um(e,d)|0;uo(e+1240|0,g)|0;un(e+1252|0,g)|0;b=aq(d,c[e+1196>>2]|0)|0;c[e+1192>>2]=b+(c[e+1192>>2]|0)-(g<<12);jr(e+1312|0,f);return g<<1|0}function uv(a,b){a=a|0;b=b|0;var d=0;d=a;if(!(tt(d)|0)){a5(5368,72,14016,3280)}c[d+8>>2]=b;c[d+4>>2]=0;return}function uw(a,b){a=a|0;b=b|0;var d=0;d=a;if(!(tu(d)|0)){a5(5368,72,14088,3280)}c[d+8>>2]=b;c[d+4>>2]=0;return}function ux(a){a=a|0;var b=0;b=a;ur(b);cK(b);return}function uy(a){a=a|0;return}function uz(a){a=a|0;return}function uA(a){a=a|0;return 3936|0}function uB(a){a=a|0;return}function uC(a){a=a|0;return 9040|0}function uD(a){a=a|0;return}function uE(a){a=a|0;return}function uF(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function uG(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function uH(a,b,c){a=a|0;b=b|0;c=c|0;return}function uI(a){a=a|0;c[a>>2]=18832;return}function uJ(a){a=a|0;c[a>>2]=18896;return}function uK(a,b,c){a=a|0;b=b|0;c=c|0;return(a|0)==(b|0)|0}function uL(a,b,c){a=a|0;b=b|0;c=c|0;return(a|0)==(b|0)|0}function uM(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;b=d+16|0;g=c[b>>2]|0;if((g|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((g|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function uN(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((c[d+8>>2]|0)!=(b|0)){return}b=d+16|0;g=c[b>>2]|0;if((g|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((g|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function uO(a,b,c){a=a|0;b=b|0;c=c|0;c=b|0;return(a|0)==(c|0)|(c|0)==25024|0}function uP(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;h=g}else{h=b}if(!((c[d+48>>2]|0)==1&(h|0)==1)){return}a[d+54|0]=1;return}function uQ(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;if((c[b+4>>2]|0)!=(d|0)){return}d=b+28|0;if((c[d>>2]|0)==1){return}c[d>>2]=e;return}function uR(a){a=a|0;vQ(a);return}function uS(a){a=a|0;vQ(a);return}function uT(a){a=a|0;vQ(a);return}function uU(a){a=a|0;uy(a|0);vQ(a);return}function uV(a){a=a|0;uy(a|0);return}function uW(a){a=a|0;uy(a|0);vQ(a);return}function uX(a){a=a|0;uy(a|0);vQ(a);return}function uY(a){a=a|0;uy(a|0);vQ(a);return}function uZ(a){a=a|0;uy(a|0);vQ(a);return}function u_(a){a=a|0;uy(a|0);vQ(a);return}function u$(a){a=a|0;uy(a|0);vQ(a);return}function u0(a){a=a|0;uy(a|0);vQ(a);return}function u1(a){a=a|0;uy(a|0);vQ(a);return}function u2(a){a=a|0;uy(a|0);vQ(a);return}function u3(a){a=a|0;uy(a|0);vQ(a);return}function u4(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+56|0;f=e|0;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=u9(b,24984,24952,-1)|0;b=h;if((h|0)==0){g=0;i=e;return g|0}wg(f|0,0,56);c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;bZ[c[(c[h>>2]|0)+28>>2]&63](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2];g=1;i=e;return g|0}function u5(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((b|0)!=(c[d+8>>2]|0)){g=c[b+8>>2]|0;bZ[c[(c[g>>2]|0)+28>>2]&63](g,d,e,f);return}g=d+16|0;b=c[g>>2]|0;if((b|0)==0){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function u6(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=c[a+4>>2]|0;g=f>>8;if((f&1|0)==0){h=g}else{h=c[(c[d>>2]|0)+g>>2]|0}g=c[a>>2]|0;bZ[c[(c[g>>2]|0)+28>>2]&63](g,b,d+h|0,(f&2|0)!=0?e:2);return}function u7(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;if((b|0)==(c[d+8>>2]|0)){g=d+16|0;h=c[g>>2]|0;if((h|0)==0){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((h|0)!=(e|0)){h=d+36|0;c[h>>2]=(c[h>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}h=d+24|0;if((c[h>>2]|0)!=2){return}c[h>>2]=f;return}h=c[b+12>>2]|0;g=b+16+(h<<3)|0;i=c[b+20>>2]|0;j=i>>8;if((i&1|0)==0){k=j}else{k=c[(c[e>>2]|0)+j>>2]|0}j=c[b+16>>2]|0;bZ[c[(c[j>>2]|0)+28>>2]&63](j,d,e+k|0,(i&2|0)!=0?f:2);if((h|0)<=1){return}h=d+54|0;i=e;k=b+24|0;while(1){b=c[k+4>>2]|0;j=b>>8;if((b&1|0)==0){l=j}else{l=c[(c[i>>2]|0)+j>>2]|0}j=c[k>>2]|0;bZ[c[(c[j>>2]|0)+28>>2]&63](j,d,e+l|0,(b&2|0)!=0?f:2);if((a[h]&1)!=0){m=4026;break}b=k+8|0;if(b>>>0<g>>>0){k=b}else{m=4027;break}}if((m|0)==4026){return}else if((m|0)==4027){return}}function u8(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+56|0;f=e|0;c[d>>2]=c[c[d>>2]>>2];g=b|0;do{if((a|0)==(g|0)|(g|0)==25024){h=1}else{if((b|0)==0){h=0;break}j=u9(b,24984,24920,-1)|0;if((j|0)==0){h=0;break}if((c[j+8>>2]&~c[a+8>>2]|0)!=0){h=0;break}k=c[a+12>>2]|0;l=j+12|0;if((k|0)==(c[l>>2]|0)|(k|0)==24104){h=1;break}if((k|0)==0){h=0;break}j=u9(k,24984,24952,-1)|0;if((j|0)==0){h=0;break}k=c[l>>2]|0;if((k|0)==0){h=0;break}l=u9(k,24984,24952,-1)|0;k=l;if((l|0)==0){h=0;break}wg(f|0,0,56);c[f>>2]=k;c[f+8>>2]=j;c[f+12>>2]=-1;c[f+48>>2]=1;bZ[c[(c[l>>2]|0)+28>>2]&63](k,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){h=0;break}c[d>>2]=c[f+16>>2];h=1}}while(0);i=e;return h|0}function u9(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+56|0;g=f|0;h=c[a>>2]|0;j=a+(c[h-8>>2]|0)|0;k=c[h-4>>2]|0;h=k;c[g>>2]=d;c[g+4>>2]=a;c[g+8>>2]=b;c[g+12>>2]=e;e=g+16|0;b=g+20|0;a=g+24|0;l=g+28|0;m=g+32|0;n=g+40|0;wg(e|0,0,39);if((k|0)==(d|0)){c[g+48>>2]=1;bX[c[(c[k>>2]|0)+20>>2]&7](h,g,j,j,1,0);i=f;return((c[a>>2]|0)==1?j:0)|0}bN[c[(c[k>>2]|0)+24>>2]&31](h,g,j,1,0);j=c[g+36>>2]|0;if((j|0)==0){if((c[n>>2]|0)!=1){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}o=(c[m>>2]|0)==1?c[b>>2]|0:0;i=f;return o|0}else if((j|0)==1){do{if((c[a>>2]|0)!=1){if((c[n>>2]|0)!=0){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}if((c[m>>2]|0)==1){break}else{o=0}i=f;return o|0}}while(0);o=c[e>>2]|0;i=f;return o|0}else{o=0;i=f;return o|0}return 0}function va(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){return}g=d+28|0;if((c[g>>2]|0)==1){return}c[g>>2]=f;return}if((c[d>>2]|0)!=(b|0)){return}do{if((c[d+16>>2]|0)!=(e|0)){b=d+20|0;if((c[b>>2]|0)==(e|0)){break}c[d+32>>2]=f;c[b>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){break}a[d+54|0]=1}}while(0);c[d+44>>2]=4;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function vb(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;h=b|0;if((h|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){return}i=d+28|0;if((c[i>>2]|0)==1){return}c[i>>2]=f;return}if((h|0)==(c[d>>2]|0)){do{if((c[d+16>>2]|0)!=(e|0)){h=d+20|0;if((c[h>>2]|0)==(e|0)){break}c[d+32>>2]=f;i=d+44|0;if((c[i>>2]|0)==4){return}j=c[b+12>>2]|0;k=b+16+(j<<3)|0;L4625:do{if((j|0)>0){l=d+52|0;m=d+53|0;n=d+54|0;o=b+8|0;p=d+24|0;q=e;r=0;s=b+16|0;t=0;L4627:while(1){a[l]=0;a[m]=0;u=c[s+4>>2]|0;v=u>>8;if((u&1|0)==0){w=v}else{w=c[(c[q>>2]|0)+v>>2]|0}v=c[s>>2]|0;bX[c[(c[v>>2]|0)+20>>2]&7](v,d,e,e+w|0,2-(u>>>1&1)|0,g);if((a[n]&1)!=0){x=t;y=r;break}do{if((a[m]&1)==0){z=t;A=r}else{if((a[l]&1)==0){if((c[o>>2]&1|0)==0){x=1;y=r;break L4627}else{z=1;A=r;break}}if((c[p>>2]|0)==1){B=4107;break L4625}if((c[o>>2]&2|0)==0){B=4107;break L4625}else{z=1;A=1}}}while(0);u=s+8|0;if(u>>>0<k>>>0){r=A;s=u;t=z}else{x=z;y=A;break}}if(y){C=x;B=4106}else{D=x;B=4103}}else{D=0;B=4103}}while(0);do{if((B|0)==4103){c[h>>2]=e;k=d+40|0;c[k>>2]=(c[k>>2]|0)+1;if((c[d+36>>2]|0)!=1){C=D;B=4106;break}if((c[d+24>>2]|0)!=2){C=D;B=4106;break}a[d+54|0]=1;if(D){B=4107}else{B=4108}}}while(0);if((B|0)==4106){if(C){B=4107}else{B=4108}}if((B|0)==4107){c[i>>2]=3;return}else if((B|0)==4108){c[i>>2]=4;return}}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}C=c[b+12>>2]|0;D=b+16+(C<<3)|0;x=c[b+20>>2]|0;y=x>>8;if((x&1|0)==0){E=y}else{E=c[(c[e>>2]|0)+y>>2]|0}y=c[b+16>>2]|0;bN[c[(c[y>>2]|0)+24>>2]&31](y,d,e+E|0,(x&2|0)!=0?f:2,g);x=b+24|0;if((C|0)<=1){return}C=c[b+8>>2]|0;do{if((C&2|0)==0){b=d+36|0;if((c[b>>2]|0)==1){break}if((C&1|0)==0){E=d+54|0;y=e;A=x;while(1){if((a[E]&1)!=0){B=4148;break}if((c[b>>2]|0)==1){B=4149;break}z=c[A+4>>2]|0;w=z>>8;if((z&1|0)==0){F=w}else{F=c[(c[y>>2]|0)+w>>2]|0}w=c[A>>2]|0;bN[c[(c[w>>2]|0)+24>>2]&31](w,d,e+F|0,(z&2|0)!=0?f:2,g);z=A+8|0;if(z>>>0<D>>>0){A=z}else{B=4150;break}}if((B|0)==4148){return}else if((B|0)==4149){return}else if((B|0)==4150){return}}A=d+24|0;y=d+54|0;E=e;i=x;while(1){if((a[y]&1)!=0){B=4145;break}if((c[b>>2]|0)==1){if((c[A>>2]|0)==1){B=4146;break}}z=c[i+4>>2]|0;w=z>>8;if((z&1|0)==0){G=w}else{G=c[(c[E>>2]|0)+w>>2]|0}w=c[i>>2]|0;bN[c[(c[w>>2]|0)+24>>2]&31](w,d,e+G|0,(z&2|0)!=0?f:2,g);z=i+8|0;if(z>>>0<D>>>0){i=z}else{B=4147;break}}if((B|0)==4145){return}else if((B|0)==4146){return}else if((B|0)==4147){return}}}while(0);G=d+54|0;F=e;C=x;while(1){if((a[G]&1)!=0){B=4143;break}x=c[C+4>>2]|0;i=x>>8;if((x&1|0)==0){H=i}else{H=c[(c[F>>2]|0)+i>>2]|0}i=c[C>>2]|0;bN[c[(c[i>>2]|0)+24>>2]&31](i,d,e+H|0,(x&2|0)!=0?f:2,g);x=C+8|0;if(x>>>0<D>>>0){C=x}else{B=4144;break}}if((B|0)==4143){return}else if((B|0)==4144){return}}function vc(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0;h=c[a+4>>2]|0;i=h>>8;if((h&1|0)==0){j=i}else{j=c[(c[e>>2]|0)+i>>2]|0}i=c[a>>2]|0;bX[c[(c[i>>2]|0)+20>>2]&7](i,b,d,e+j|0,(h&2|0)!=0?f:2,g);return}function vd(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=c[a+4>>2]|0;h=g>>8;if((g&1|0)==0){i=h}else{i=c[(c[d>>2]|0)+h>>2]|0}h=c[a>>2]|0;bN[c[(c[h>>2]|0)+24>>2]&31](h,b,d+i|0,(g&2|0)!=0?e:2,f);return}function ve(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0;h=b|0;if((h|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){return}i=d+28|0;if((c[i>>2]|0)==1){return}c[i>>2]=f;return}if((h|0)!=(c[d>>2]|0)){h=c[b+8>>2]|0;bN[c[(c[h>>2]|0)+24>>2]&31](h,d,e,f,g);return}do{if((c[d+16>>2]|0)!=(e|0)){h=d+20|0;if((c[h>>2]|0)==(e|0)){break}c[d+32>>2]=f;i=d+44|0;if((c[i>>2]|0)==4){return}j=d+52|0;a[j]=0;k=d+53|0;a[k]=0;l=c[b+8>>2]|0;bX[c[(c[l>>2]|0)+20>>2]&7](l,d,e,e,1,g);if((a[k]&1)==0){m=0;n=4169}else{if((a[j]&1)==0){m=1;n=4169}}L4735:do{if((n|0)==4169){c[h>>2]=e;j=d+40|0;c[j>>2]=(c[j>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){n=4172;break}a[d+54|0]=1;if(m){break L4735}}else{n=4172}}while(0);if((n|0)==4172){if(m){break}}c[i>>2]=4;return}}while(0);c[i>>2]=3;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function vf(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;if((b|0)!=(c[d+8>>2]|0)){i=d+52|0;j=a[i]&1;k=d+53|0;l=a[k]&1;m=c[b+12>>2]|0;n=b+16+(m<<3)|0;a[i]=0;a[k]=0;o=c[b+20>>2]|0;p=o>>8;if((o&1|0)==0){q=p}else{q=c[(c[f>>2]|0)+p>>2]|0}p=c[b+16>>2]|0;bX[c[(c[p>>2]|0)+20>>2]&7](p,d,e,f+q|0,(o&2|0)!=0?g:2,h);L4757:do{if((m|0)>1){o=d+24|0;q=b+8|0;p=d+54|0;r=f;s=b+24|0;do{if((a[p]&1)!=0){break L4757}do{if((a[i]&1)==0){if((a[k]&1)==0){break}if((c[q>>2]&1|0)==0){break L4757}}else{if((c[o>>2]|0)==1){break L4757}if((c[q>>2]&2|0)==0){break L4757}}}while(0);a[i]=0;a[k]=0;t=c[s+4>>2]|0;u=t>>8;if((t&1|0)==0){v=u}else{v=c[(c[r>>2]|0)+u>>2]|0}u=c[s>>2]|0;bX[c[(c[u>>2]|0)+20>>2]&7](u,d,e,f+v|0,(t&2|0)!=0?g:2,h);s=s+8|0;}while(s>>>0<n>>>0)}}while(0);a[i]=j;a[k]=l;return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;l=c[f>>2]|0;if((l|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((l|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;l=c[e>>2]|0;if((l|0)==2){c[e>>2]=g;w=g}else{w=l}if(!((c[d+48>>2]|0)==1&(w|0)==1)){return}a[d+54|0]=1;return}function vg(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;if((b|0)!=(c[d+8>>2]|0)){i=c[b+8>>2]|0;bX[c[(c[i>>2]|0)+20>>2]&7](i,d,e,f,g,h);return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;j=g}else{j=h}if(!((c[d+48>>2]|0)==1&(j|0)==1)){return}a[d+54|0]=1;return}function vh(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0;if((c[d+8>>2]|0)!=(b|0)){return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;i=g}else{i=b}if(!((c[d+48>>2]|0)==1&(i|0)==1)){return}a[d+54|0]=1;return}function vi(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[7212]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=28888+(h<<2)|0;j=28888+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[7212]=e&~(1<<g)}else{if(l>>>0<(c[7216]|0)>>>0){aS();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{aS();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[7214]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=28888+(p<<2)|0;m=28888+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[7212]=e&~(1<<r)}else{if(l>>>0<(c[7216]|0)>>>0){aS();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{aS();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[7214]|0;if((l|0)!=0){q=c[7217]|0;d=l>>>3;l=d<<1;f=28888+(l<<2)|0;k=c[7212]|0;h=1<<d;do{if((k&h|0)==0){c[7212]=k|h;s=f;t=28888+(l+2<<2)|0}else{d=28888+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[7216]|0)>>>0){s=g;t=d;break}aS();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[7214]=m;c[7217]=e;n=i;return n|0}l=c[7213]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[29152+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[7216]|0;if(r>>>0<i>>>0){aS();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){aS();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){aS();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){aS();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){aS();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{aS();return 0}}}while(0);L4924:do{if((e|0)!=0){f=d+28|0;i=29152+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[7213]=c[7213]&~(1<<c[f>>2]);break L4924}else{if(e>>>0<(c[7216]|0)>>>0){aS();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L4924}}}while(0);if(v>>>0<(c[7216]|0)>>>0){aS();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[7214]|0;if((f|0)!=0){e=c[7217]|0;i=f>>>3;f=i<<1;q=28888+(f<<2)|0;k=c[7212]|0;g=1<<i;do{if((k&g|0)==0){c[7212]=k|g;y=q;z=28888+(f+2<<2)|0}else{i=28888+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[7216]|0)>>>0){y=l;z=i;break}aS();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[7214]=p;c[7217]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[7213]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[29152+(A<<2)>>2]|0;L4972:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L4972}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[29152+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[7214]|0)-g|0)>>>0){o=g;break}q=K;m=c[7216]|0;if(q>>>0<m>>>0){aS();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){aS();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){aS();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){aS();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){aS();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{aS();return 0}}}while(0);L5022:do{if((e|0)!=0){i=K+28|0;m=29152+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[7213]=c[7213]&~(1<<c[i>>2]);break L5022}else{if(e>>>0<(c[7216]|0)>>>0){aS();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L5022}}}while(0);if(L>>>0<(c[7216]|0)>>>0){aS();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;m=28888+(e<<2)|0;r=c[7212]|0;j=1<<i;do{if((r&j|0)==0){c[7212]=r|j;O=m;P=28888+(e+2<<2)|0}else{i=28888+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[7216]|0)>>>0){O=d;P=i;break}aS();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=29152+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[7213]|0;l=1<<Q;if((m&l|0)==0){c[7213]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;m=c[j>>2]|0;while(1){if((c[m+4>>2]&-8|0)==(J|0)){break}S=m+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=4408;break}else{l=l<<1;m=j}}if((T|0)==4408){if(S>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[S>>2]=e;c[q+(g+24)>>2]=m;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}}l=m+8|0;j=c[l>>2]|0;i=c[7216]|0;if(m>>>0<i>>>0){aS();return 0}if(j>>>0<i>>>0){aS();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=j;c[q+(g+12)>>2]=m;c[q+(g+24)>>2]=0;break}}}while(0);q=K+8|0;if((q|0)==0){o=g;break}else{n=q}return n|0}}while(0);K=c[7214]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[7217]|0;if(S>>>0>15){R=J;c[7217]=R+o;c[7214]=S;c[R+(o+4)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[7214]=0;c[7217]=0;c[J+4>>2]=K|3;S=J+(K+4)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[7215]|0;if(o>>>0<J>>>0){S=J-o|0;c[7215]=S;J=c[7218]|0;K=J;c[7218]=K+o;c[K+(o+4)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[7196]|0)==0){J=aM(8)|0;if((J-1&J|0)==0){c[7198]=J;c[7197]=J;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS();return 0}}}while(0);J=o+48|0;S=c[7198]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[7322]|0;do{if((O|0)!=0){P=c[7320]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L5114:do{if((c[7323]&4|0)==0){O=c[7218]|0;L5116:do{if((O|0)==0){T=4438}else{L=O;P=29296;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=4438;break L5116}else{P=M}}if((P|0)==0){T=4438;break}L=R-(c[7215]|0)&Q;if(L>>>0>=2147483647){W=0;break}m=bG(L|0)|0;e=(m|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?m:-1;Y=e?L:0;Z=m;_=L;T=4447}}while(0);do{if((T|0)==4438){O=bG(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[7197]|0;m=L-1|0;if((m&g|0)==0){$=S}else{$=S-g+(m+g&-L)|0}L=c[7320]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647)){W=0;break}m=c[7322]|0;if((m|0)!=0){if(g>>>0<=L>>>0|g>>>0>m>>>0){W=0;break}}m=bG($|0)|0;g=(m|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=m;_=$;T=4447}}while(0);L5136:do{if((T|0)==4447){m=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=4458;break L5114}do{if((Z|0)!=-1&_>>>0<2147483647&_>>>0<J>>>0){g=c[7198]|0;O=K-_+g&-g;if(O>>>0>=2147483647){ac=_;break}if((bG(O|0)|0)==-1){bG(m|0)|0;W=Y;break L5136}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=4458;break L5114}}}while(0);c[7323]=c[7323]|4;ad=W;T=4455}else{ad=0;T=4455}}while(0);do{if((T|0)==4455){if(S>>>0>=2147483647){break}W=bG(S|0)|0;Z=bG(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)!=-1){aa=Z?ac:ad;ab=Y;T=4458}}}while(0);do{if((T|0)==4458){ad=(c[7320]|0)+aa|0;c[7320]=ad;if(ad>>>0>(c[7321]|0)>>>0){c[7321]=ad}ad=c[7218]|0;L5156:do{if((ad|0)==0){S=c[7216]|0;if((S|0)==0|ab>>>0<S>>>0){c[7216]=ab}c[7324]=ab;c[7325]=aa;c[7327]=0;c[7221]=c[7196];c[7220]=-1;S=0;do{Y=S<<1;ac=28888+(Y<<2)|0;c[28888+(Y+3<<2)>>2]=ac;c[28888+(Y+2<<2)>>2]=ac;S=S+1|0;}while(S>>>0<32);S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=aa-40-ae|0;c[7218]=ab+ae;c[7215]=S;c[ab+(ae+4)>>2]=S|1;c[ab+(aa-36)>>2]=40;c[7219]=c[7200]}else{S=29296;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=4470;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==4470){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa;ac=c[7218]|0;Y=(c[7215]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[7218]=Z+ai;c[7215]=W;c[Z+(ai+4)>>2]=W|1;c[Z+(Y+4)>>2]=40;c[7219]=c[7200];break L5156}}while(0);if(ab>>>0<(c[7216]|0)>>>0){c[7216]=ab}S=ab+aa|0;Y=29296;while(1){aj=Y|0;if((c[aj>>2]|0)==(S|0)){T=4480;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==4480){if((c[Y+12>>2]&8|0)!=0){break}c[aj>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa;S=ab+8|0;if((S&7|0)==0){ak=0}else{ak=-S&7}S=ab+(aa+8)|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(al+aa)|0;Z=S;W=ak+o|0;ac=ab+W|0;_=ac;K=S-(ab+ak)-o|0;c[ab+(ak+4)>>2]=o|3;do{if((Z|0)==(c[7218]|0)){J=(c[7215]|0)+K|0;c[7215]=J;c[7218]=_;c[ab+(W+4)>>2]=J|1}else{if((Z|0)==(c[7217]|0)){J=(c[7214]|0)+K|0;c[7214]=J;c[7217]=_;c[ab+(W+4)>>2]=J|1;c[ab+(J+W)>>2]=J;break}J=aa+4|0;X=c[ab+(J+al)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L5200:do{if(X>>>0<256){U=c[ab+((al|8)+aa)>>2]|0;Q=c[ab+(aa+12+al)>>2]|0;R=28888+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[7216]|0)>>>0){aS();return 0}if((c[U+12>>2]|0)==(Z|0)){break}aS();return 0}}while(0);if((Q|0)==(U|0)){c[7212]=c[7212]&~(1<<V);break}do{if((Q|0)==(R|0)){am=Q+8|0}else{if(Q>>>0<(c[7216]|0)>>>0){aS();return 0}m=Q+8|0;if((c[m>>2]|0)==(Z|0)){am=m;break}aS();return 0}}while(0);c[U+12>>2]=Q;c[am>>2]=U}else{R=S;m=c[ab+((al|24)+aa)>>2]|0;P=c[ab+(aa+12+al)>>2]|0;do{if((P|0)==(R|0)){O=al|16;g=ab+(J+O)|0;L=c[g>>2]|0;if((L|0)==0){e=ab+(O+aa)|0;O=c[e>>2]|0;if((O|0)==0){an=0;break}else{ao=O;ap=e}}else{ao=L;ap=g}while(1){g=ao+20|0;L=c[g>>2]|0;if((L|0)!=0){ao=L;ap=g;continue}g=ao+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{ao=L;ap=g}}if(ap>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[ap>>2]=0;an=ao;break}}else{g=c[ab+((al|8)+aa)>>2]|0;if(g>>>0<(c[7216]|0)>>>0){aS();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){aS();return 0}e=P+8|0;if((c[e>>2]|0)==(R|0)){c[L>>2]=P;c[e>>2]=g;an=P;break}else{aS();return 0}}}while(0);if((m|0)==0){break}P=ab+(aa+28+al)|0;U=29152+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=an;if((an|0)!=0){break}c[7213]=c[7213]&~(1<<c[P>>2]);break L5200}else{if(m>>>0<(c[7216]|0)>>>0){aS();return 0}Q=m+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=an}else{c[m+20>>2]=an}if((an|0)==0){break L5200}}}while(0);if(an>>>0<(c[7216]|0)>>>0){aS();return 0}c[an+24>>2]=m;R=al|16;P=c[ab+(R+aa)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[an+16>>2]=P;c[P+24>>2]=an;break}}}while(0);P=c[ab+(J+R)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[an+20>>2]=P;c[P+24>>2]=an;break}}}while(0);aq=ab+(($|al)+aa)|0;ar=$+K|0}else{aq=Z;ar=K}J=aq+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4)>>2]=ar|1;c[ab+(ar+W)>>2]=ar;J=ar>>>3;if(ar>>>0<256){V=J<<1;X=28888+(V<<2)|0;P=c[7212]|0;m=1<<J;do{if((P&m|0)==0){c[7212]=P|m;as=X;at=28888+(V+2<<2)|0}else{J=28888+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[7216]|0)>>>0){as=U;at=J;break}aS();return 0}}while(0);c[at>>2]=_;c[as+12>>2]=_;c[ab+(W+8)>>2]=as;c[ab+(W+12)>>2]=X;break}V=ac;m=ar>>>8;do{if((m|0)==0){au=0}else{if(ar>>>0>16777215){au=31;break}P=(m+1048320|0)>>>16&8;$=m<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=14-(J|P|$)+(U<<$>>>15)|0;au=ar>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=29152+(au<<2)|0;c[ab+(W+28)>>2]=au;c[ab+(W+20)>>2]=0;c[ab+(W+16)>>2]=0;X=c[7213]|0;Q=1<<au;if((X&Q|0)==0){c[7213]=X|Q;c[m>>2]=V;c[ab+(W+24)>>2]=m;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}if((au|0)==31){av=0}else{av=25-(au>>>1)|0}Q=ar<<av;X=c[m>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(ar|0)){break}aw=X+16+(Q>>>31<<2)|0;m=c[aw>>2]|0;if((m|0)==0){T=4553;break}else{Q=Q<<1;X=m}}if((T|0)==4553){if(aw>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[aw>>2]=V;c[ab+(W+24)>>2]=X;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}}Q=X+8|0;m=c[Q>>2]|0;$=c[7216]|0;if(X>>>0<$>>>0){aS();return 0}if(m>>>0<$>>>0){aS();return 0}else{c[m+12>>2]=V;c[Q>>2]=V;c[ab+(W+8)>>2]=m;c[ab+(W+12)>>2]=X;c[ab+(W+24)>>2]=0;break}}}while(0);n=ab+(ak|8)|0;return n|0}}while(0);Y=ad;W=29296;while(1){ax=c[W>>2]|0;if(ax>>>0<=Y>>>0){ay=c[W+4>>2]|0;az=ax+ay|0;if(az>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=ax+(ay-39)|0;if((W&7|0)==0){aA=0}else{aA=-W&7}W=ax+(ay-47+aA)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aB=0}else{aB=-_&7}_=aa-40-aB|0;c[7218]=ab+aB;c[7215]=_;c[ab+(aB+4)>>2]=_|1;c[ab+(aa-36)>>2]=40;c[7219]=c[7200];c[ac+4>>2]=27;c[W>>2]=c[7324];c[W+4>>2]=c[29300>>2];c[W+8>>2]=c[29304>>2];c[W+12>>2]=c[29308>>2];c[7324]=ab;c[7325]=aa;c[7327]=0;c[7326]=W;W=ac+28|0;c[W>>2]=7;if((ac+32|0)>>>0<az>>>0){_=W;while(1){W=_+4|0;c[W>>2]=7;if((_+8|0)>>>0<az>>>0){_=W}else{break}}}if((ac|0)==(Y|0)){break}_=ac-ad|0;W=Y+(_+4)|0;c[W>>2]=c[W>>2]&-2;c[ad+4>>2]=_|1;c[Y+_>>2]=_;W=_>>>3;if(_>>>0<256){K=W<<1;Z=28888+(K<<2)|0;S=c[7212]|0;m=1<<W;do{if((S&m|0)==0){c[7212]=S|m;aC=Z;aD=28888+(K+2<<2)|0}else{W=28888+(K+2<<2)|0;Q=c[W>>2]|0;if(Q>>>0>=(c[7216]|0)>>>0){aC=Q;aD=W;break}aS();return 0}}while(0);c[aD>>2]=ad;c[aC+12>>2]=ad;c[ad+8>>2]=aC;c[ad+12>>2]=Z;break}K=ad;m=_>>>8;do{if((m|0)==0){aE=0}else{if(_>>>0>16777215){aE=31;break}S=(m+1048320|0)>>>16&8;Y=m<<S;ac=(Y+520192|0)>>>16&4;W=Y<<ac;Y=(W+245760|0)>>>16&2;Q=14-(ac|S|Y)+(W<<Y>>>15)|0;aE=_>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=29152+(aE<<2)|0;c[ad+28>>2]=aE;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[7213]|0;Q=1<<aE;if((Z&Q|0)==0){c[7213]=Z|Q;c[m>>2]=K;c[ad+24>>2]=m;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aE|0)==31){aF=0}else{aF=25-(aE>>>1)|0}Q=_<<aF;Z=c[m>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(_|0)){break}aG=Z+16+(Q>>>31<<2)|0;m=c[aG>>2]|0;if((m|0)==0){T=4588;break}else{Q=Q<<1;Z=m}}if((T|0)==4588){if(aG>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[aG>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;_=c[Q>>2]|0;m=c[7216]|0;if(Z>>>0<m>>>0){aS();return 0}if(_>>>0<m>>>0){aS();return 0}else{c[_+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=_;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[7215]|0;if(ad>>>0<=o>>>0){break}_=ad-o|0;c[7215]=_;ad=c[7218]|0;Q=ad;c[7218]=Q+o;c[Q+(o+4)>>2]=_|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[(bB()|0)>>2]=12;n=0;return n|0}function vj(a,b){a=a|0;b=b|0;var d=0,e=0;do{if((a|0)==0){d=0}else{e=aq(b,a)|0;if((b|a)>>>0<=65535){d=e;break}d=((e>>>0)/(a>>>0)|0|0)==(b|0)?e:-1}}while(0);b=vi(d)|0;if((b|0)==0){return b|0}if((c[b-4>>2]&3|0)==0){return b|0}wg(b|0,0,d|0);return b|0}function vk(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[7216]|0;if(b>>>0<e>>>0){aS()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){aS()}h=f&-8;i=a+(h-8)|0;j=i;L5385:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){aS()}if((n|0)==(c[7217]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[7214]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=28888+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){aS()}if((c[k+12>>2]|0)==(n|0)){break}aS()}}while(0);if((s|0)==(k|0)){c[7212]=c[7212]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){aS()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}aS()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){aS()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){aS()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){aS()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{aS()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=29152+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[7213]=c[7213]&~(1<<c[v>>2]);q=n;r=o;break L5385}else{if(p>>>0<(c[7216]|0)>>>0){aS()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L5385}}}while(0);if(A>>>0<(c[7216]|0)>>>0){aS()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[7216]|0)>>>0){aS()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[7216]|0)>>>0){aS()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){aS()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){aS()}do{if((e&2|0)==0){if((j|0)==(c[7218]|0)){B=(c[7215]|0)+r|0;c[7215]=B;c[7218]=q;c[q+4>>2]=B|1;if((q|0)!=(c[7217]|0)){return}c[7217]=0;c[7214]=0;return}if((j|0)==(c[7217]|0)){B=(c[7214]|0)+r|0;c[7214]=B;c[7217]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L5487:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=28888+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[7216]|0)>>>0){aS()}if((c[u+12>>2]|0)==(j|0)){break}aS()}}while(0);if((g|0)==(u|0)){c[7212]=c[7212]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[7216]|0)>>>0){aS()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}aS()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[7216]|0)>>>0){aS()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[7216]|0)>>>0){aS()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){aS()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{aS()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=29152+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[7213]=c[7213]&~(1<<c[t>>2]);break L5487}else{if(f>>>0<(c[7216]|0)>>>0){aS()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L5487}}}while(0);if(E>>>0<(c[7216]|0)>>>0){aS()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[7216]|0)>>>0){aS()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[7216]|0)>>>0){aS()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[7217]|0)){H=B;break}c[7214]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=28888+(d<<2)|0;A=c[7212]|0;E=1<<r;do{if((A&E|0)==0){c[7212]=A|E;I=e;J=28888+(d+2<<2)|0}else{r=28888+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[7216]|0)>>>0){I=h;J=r;break}aS()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=29152+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[7213]|0;d=1<<K;do{if((r&d|0)==0){c[7213]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=4775;break}else{A=A<<1;J=E}}if((N|0)==4775){if(M>>>0<(c[7216]|0)>>>0){aS()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[7216]|0;if(J>>>0<E>>>0){aS()}if(B>>>0<E>>>0){aS()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[7220]|0)-1|0;c[7220]=q;if((q|0)==0){O=29304}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[7220]=-1;return}function vl(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;if((a|0)==0){d=vi(b)|0;return d|0}if(b>>>0>4294967231){c[(bB()|0)>>2]=12;d=0;return d|0}if(b>>>0<11){e=16}else{e=b+11&-8}f=vr(a-8|0,e)|0;if((f|0)!=0){d=f+8|0;return d|0}f=vi(b)|0;if((f|0)==0){d=0;return d|0}e=c[a-4>>2]|0;g=(e&-8)-((e&3|0)==0?8:4)|0;e=g>>>0<b>>>0?g:b;wh(f|0,a|0,e)|0;vk(a);d=f;return d|0}function vm(a,b){a=a|0;b=b|0;var d=0;if((a|0)==0){return 0}if(b>>>0>4294967231){c[(bB()|0)>>2]=12;return 0}if(b>>>0<11){d=16}else{d=b+11&-8}b=a-8|0;return((vr(b,d)|0)==(b|0)?a:0)|0}function vn(a,b){a=a|0;b=b|0;var c=0;if(a>>>0<9){c=vi(b)|0;return c|0}else{c=vo(a,b)|0;return c|0}return 0}function vo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;d=a>>>0<16?16:a;if((d-1&d|0)==0){e=d}else{a=16;while(1){if(a>>>0<d>>>0){a=a<<1}else{e=a;break}}}if((-64-e|0)>>>0<=b>>>0){c[(bB()|0)>>2]=12;f=0;return f|0}if(b>>>0<11){g=16}else{g=b+11&-8}b=vi(e+12+g|0)|0;if((b|0)==0){f=0;return f|0}a=b-8|0;d=a;h=e-1|0;do{if((b&h|0)==0){i=d}else{j=b+h&-e;k=j-8|0;l=a;if((k-l|0)>>>0>15){m=k}else{m=j+(e-8)|0}j=m;k=m-l|0;l=b-4|0;n=c[l>>2]|0;o=(n&-8)-k|0;if((n&3|0)==0){c[m>>2]=(c[a>>2]|0)+k;c[m+4>>2]=o;i=j;break}else{n=m+4|0;c[n>>2]=o|c[n>>2]&1|2;n=m+(o+4)|0;c[n>>2]=c[n>>2]|1;c[l>>2]=k|c[l>>2]&1|2;l=b+(k-4)|0;c[l>>2]=c[l>>2]|1;vH(d,k);i=j;break}}}while(0);d=i+4|0;b=c[d>>2]|0;do{if((b&3|0)!=0){m=b&-8;if(m>>>0<=(g+16|0)>>>0){break}a=m-g|0;e=i;c[d>>2]=g|b&1|2;c[e+(g|4)>>2]=a|3;h=e+(m|4)|0;c[h>>2]=c[h>>2]|1;vH(e+g|0,a)}}while(0);f=i+8|0;return f|0}function vp(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;do{if((b|0)==8){e=vi(d)|0}else{f=b>>>2;if((b&3|0)!=0|(f|0)==0){g=22;return g|0}if((f+1073741823&f|0)!=0){g=22;return g|0}if((-64-b|0)>>>0<d>>>0){g=12;return g|0}else{e=vo(b>>>0<16?16:b,d)|0;break}}}while(0);if((e|0)==0){g=12;return g|0}c[a>>2]=e;g=0;return g|0}function vq(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+8|0;f=e|0;c[f>>2]=b;b=vA(a,f,3,d)|0;i=e;return b|0}function vr(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=a+4|0;e=c[d>>2]|0;f=e&-8;g=a;h=g+f|0;i=h;j=c[7216]|0;if(g>>>0<j>>>0){aS();return 0}k=e&3;if(!((k|0)!=1&g>>>0<h>>>0)){aS();return 0}l=g+(f|4)|0;m=c[l>>2]|0;if((m&1|0)==0){aS();return 0}if((k|0)==0){if(b>>>0<256){n=0;return n|0}do{if(f>>>0>=(b+4|0)>>>0){if((f-b|0)>>>0>c[7198]<<1>>>0){break}else{n=a}return n|0}}while(0);n=0;return n|0}if(f>>>0>=b>>>0){k=f-b|0;if(k>>>0<=15){n=a;return n|0}c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;vH(g+b|0,k);n=a;return n|0}if((i|0)==(c[7218]|0)){k=(c[7215]|0)+f|0;if(k>>>0<=b>>>0){n=0;return n|0}l=k-b|0;c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=l|1;c[7218]=g+b;c[7215]=l;n=a;return n|0}if((i|0)==(c[7217]|0)){l=(c[7214]|0)+f|0;if(l>>>0<b>>>0){n=0;return n|0}k=l-b|0;if(k>>>0>15){c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|1;c[g+l>>2]=k;o=g+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=g+b|0;q=k}else{c[d>>2]=e&1|l|2;e=g+(l+4)|0;c[e>>2]=c[e>>2]|1;p=0;q=0}c[7214]=q;c[7217]=p;n=a;return n|0}if((m&2|0)!=0){n=0;return n|0}p=(m&-8)+f|0;if(p>>>0<b>>>0){n=0;return n|0}q=p-b|0;e=m>>>3;L5739:do{if(m>>>0<256){l=c[g+(f+8)>>2]|0;k=c[g+(f+12)>>2]|0;o=28888+(e<<1<<2)|0;do{if((l|0)!=(o|0)){if(l>>>0<j>>>0){aS();return 0}if((c[l+12>>2]|0)==(i|0)){break}aS();return 0}}while(0);if((k|0)==(l|0)){c[7212]=c[7212]&~(1<<e);break}do{if((k|0)==(o|0)){r=k+8|0}else{if(k>>>0<j>>>0){aS();return 0}s=k+8|0;if((c[s>>2]|0)==(i|0)){r=s;break}aS();return 0}}while(0);c[l+12>>2]=k;c[r>>2]=l}else{o=h;s=c[g+(f+24)>>2]|0;t=c[g+(f+12)>>2]|0;do{if((t|0)==(o|0)){u=g+(f+20)|0;v=c[u>>2]|0;if((v|0)==0){w=g+(f+16)|0;x=c[w>>2]|0;if((x|0)==0){y=0;break}else{z=x;A=w}}else{z=v;A=u}while(1){u=z+20|0;v=c[u>>2]|0;if((v|0)!=0){z=v;A=u;continue}u=z+16|0;v=c[u>>2]|0;if((v|0)==0){break}else{z=v;A=u}}if(A>>>0<j>>>0){aS();return 0}else{c[A>>2]=0;y=z;break}}else{u=c[g+(f+8)>>2]|0;if(u>>>0<j>>>0){aS();return 0}v=u+12|0;if((c[v>>2]|0)!=(o|0)){aS();return 0}w=t+8|0;if((c[w>>2]|0)==(o|0)){c[v>>2]=t;c[w>>2]=u;y=t;break}else{aS();return 0}}}while(0);if((s|0)==0){break}t=g+(f+28)|0;l=29152+(c[t>>2]<<2)|0;do{if((o|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[7213]=c[7213]&~(1<<c[t>>2]);break L5739}else{if(s>>>0<(c[7216]|0)>>>0){aS();return 0}k=s+16|0;if((c[k>>2]|0)==(o|0)){c[k>>2]=y}else{c[s+20>>2]=y}if((y|0)==0){break L5739}}}while(0);if(y>>>0<(c[7216]|0)>>>0){aS();return 0}c[y+24>>2]=s;o=c[g+(f+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[y+16>>2]=o;c[o+24>>2]=y;break}}}while(0);o=c[g+(f+20)>>2]|0;if((o|0)==0){break}if(o>>>0<(c[7216]|0)>>>0){aS();return 0}else{c[y+20>>2]=o;c[o+24>>2]=y;break}}}while(0);if(q>>>0<16){c[d>>2]=p|c[d>>2]&1|2;y=g+(p|4)|0;c[y>>2]=c[y>>2]|1;n=a;return n|0}else{c[d>>2]=c[d>>2]&1|b|2;c[g+(b+4)>>2]=q|3;d=g+(p|4)|0;c[d>>2]=c[d>>2]|1;vH(g+b|0,q);n=a;return n|0}return 0}function vs(a){a=a|0;var b=0,d=0,e=0;if((c[7196]|0)!=0){b=c[7197]|0;d=vn(b,a)|0;return d|0}e=aM(8)|0;if((e-1&e|0)!=0){aS();return 0}c[7198]=e;c[7197]=e;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;b=c[7197]|0;d=vn(b,a)|0;return d|0}function vt(a){a=a|0;var b=0;do{if((c[7196]|0)==0){b=aM(8)|0;if((b-1&b|0)==0){c[7198]=b;c[7197]=b;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS();return 0}}}while(0);b=c[7197]|0;return vn(b,a-1+b&-b)|0}function vu(){return c[7320]|0}function vv(){return c[7321]|0}function vw(){var a=0;a=c[7322]|0;return((a|0)==0?-1:a)|0}function vx(a){a=a|0;var b=0,d=0;if((a|0)==-1){b=0}else{d=c[7198]|0;b=a-1+d&-d}c[7322]=b;return b|0}function vy(a){a=a|0;var b=0,d=0,e=0;do{if((a|0)==0){b=0}else{d=c[a-4>>2]|0;e=d&3;if((e|0)==1){b=0;break}b=(d&-8)-((e|0)==0?8:4)|0}}while(0);return b|0}function vz(a,b,c){a=a|0;b=b|0;c=c|0;return vA(a,b,0,c)|0}function vA(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;do{if((c[7196]|0)==0){f=aM(8)|0;if((f-1&f|0)==0){c[7198]=f;c[7197]=f;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS();return 0}}}while(0);f=(a|0)==0;do{if((e|0)==0){if(f){g=vi(0)|0;return g|0}else{h=a<<2;if(h>>>0<11){i=0;j=16;break}i=0;j=h+11&-8;break}}else{if(f){g=e}else{i=e;j=0;break}return g|0}}while(0);do{if((d&1|0)==0){if(f){k=0;l=0;break}else{m=0;n=0}while(1){e=c[b+(n<<2)>>2]|0;if(e>>>0<11){o=16}else{o=e+11&-8}e=o+m|0;h=n+1|0;if((h|0)==(a|0)){k=0;l=e;break}else{m=e;n=h}}}else{h=c[b>>2]|0;if(h>>>0<11){p=16}else{p=h+11&-8}k=p;l=aq(p,a)|0}}while(0);p=vi(j-4+l|0)|0;if((p|0)==0){g=0;return g|0}n=p-8|0;m=c[p-4>>2]&-8;if((d&2|0)!=0){wg(p|0,0,-4-j+m|0)}if((i|0)==0){c[p+(l-4)>>2]=m-l|3;q=p+l|0;r=l}else{q=i;r=m}c[q>>2]=p;p=a-1|0;L5880:do{if((p|0)==0){s=n;t=r}else{if((k|0)==0){u=n;v=r;w=0}else{a=n;m=r;i=0;while(1){l=m-k|0;c[a+4>>2]=k|3;j=a+k|0;d=i+1|0;c[q+(d<<2)>>2]=a+(k+8);if((d|0)==(p|0)){s=j;t=l;break L5880}else{a=j;m=l;i=d}}}while(1){i=c[b+(w<<2)>>2]|0;if(i>>>0<11){x=16}else{x=i+11&-8}i=v-x|0;c[u+4>>2]=x|3;m=u+x|0;a=w+1|0;c[q+(a<<2)>>2]=u+(x+8);if((a|0)==(p|0)){s=m;t=i;break}else{u=m;v=i;w=a}}}}while(0);c[s+4>>2]=t|3;g=q;return g|0}function vB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=a+(b<<2)|0;if((b|0)==0){return 0}else{e=a}L5895:while(1){a=c[e>>2]|0;L5897:do{if((a|0)==0){f=e+4|0}else{b=a-8|0;g=b;h=a-4|0;i=c[h>>2]&-8;c[e>>2]=0;if(b>>>0<(c[7216]|0)>>>0){j=5052;break L5895}b=c[h>>2]|0;if((b&3|0)==1){j=5051;break L5895}k=e+4|0;l=b-8&-8;do{if((k|0)!=(d|0)){if((c[k>>2]|0)!=(a+(l+8)|0)){break}m=(c[a+(l|4)>>2]&-8)+i|0;c[h>>2]=b&1|m|2;n=a+(m-4)|0;c[n>>2]=c[n>>2]|1;c[k>>2]=a;f=k;break L5897}}while(0);vH(g,i);f=k}}while(0);if((f|0)==(d|0)){j=5053;break}else{e=f}}if((j|0)==5052){aS();return 0}else if((j|0)==5051){aS();return 0}else if((j|0)==5053){return 0}return 0}function vC(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;do{if((c[7196]|0)==0){b=aM(8)|0;if((b-1&b|0)==0){c[7198]=b;c[7197]=b;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS();return 0}}}while(0);if(a>>>0>=4294967232){d=0;return d|0}b=c[7218]|0;if((b|0)==0){d=0;return d|0}e=c[7215]|0;do{if(e>>>0>(a+40|0)>>>0){f=c[7198]|0;g=aq((((-41-a+e+f|0)>>>0)/(f>>>0)|0)-1|0,f)|0;h=b;i=29296;while(1){j=c[i>>2]|0;if(j>>>0<=h>>>0){if((j+(c[i+4>>2]|0)|0)>>>0>h>>>0){k=i;break}}j=c[i+8>>2]|0;if((j|0)==0){k=0;break}else{i=j}}if((c[k+12>>2]&8|0)!=0){break}i=bG(0)|0;h=k+4|0;if((i|0)!=((c[k>>2]|0)+(c[h>>2]|0)|0)){break}j=bG(-(g>>>0>2147483646?-2147483648-f|0:g)|0)|0;l=bG(0)|0;if(!((j|0)!=-1&l>>>0<i>>>0)){break}j=i-l|0;if((i|0)==(l|0)){break}c[h>>2]=(c[h>>2]|0)-j;c[7320]=(c[7320]|0)-j;h=c[7218]|0;l=(c[7215]|0)-j|0;j=h;i=h+8|0;if((i&7|0)==0){m=0}else{m=-i&7}i=l-m|0;c[7218]=j+m;c[7215]=i;c[j+(m+4)>>2]=i|1;c[j+(l+4)>>2]=40;c[7219]=c[7200];d=1;return d|0}}while(0);if((c[7215]|0)>>>0<=(c[7219]|0)>>>0){d=0;return d|0}c[7219]=-1;d=0;return d|0}function vD(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;do{if((c[7196]|0)==0){b=aM(8)|0;if((b-1&b|0)==0){c[7198]=b;c[7197]=b;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS()}}}while(0);b=c[7218]|0;if((b|0)==0){d=0;e=0;f=0;g=0;h=0;i=0;j=0}else{k=c[7215]|0;l=k+40|0;m=1;n=l;o=l;l=29296;while(1){p=c[l>>2]|0;q=p+8|0;if((q&7|0)==0){r=0}else{r=-q&7}q=p+(c[l+4>>2]|0)|0;s=m;t=n;u=o;v=p+r|0;while(1){if(v>>>0>=q>>>0|(v|0)==(b|0)){w=s;x=t;y=u;break}z=c[v+4>>2]|0;if((z|0)==7){w=s;x=t;y=u;break}A=z&-8;B=A+u|0;if((z&3|0)==1){C=A+t|0;D=s+1|0}else{C=t;D=s}z=v+A|0;if(z>>>0<p>>>0){w=D;x=C;y=B;break}else{s=D;t=C;u=B;v=z}}v=c[l+8>>2]|0;if((v|0)==0){break}else{m=w;n=x;o=y;l=v}}l=c[7320]|0;d=k;e=y;f=w;g=l-y|0;h=c[7321]|0;i=l-x|0;j=x}c[a>>2]=e;c[a+4>>2]=f;f=a+8|0;c[f>>2]=0;c[f+4>>2]=0;c[a+16>>2]=g;c[a+20>>2]=h;c[a+24>>2]=0;c[a+28>>2]=i;c[a+32>>2]=j;c[a+36>>2]=d;return}function vE(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;a=i;do{if((c[7196]|0)==0){b=aM(8)|0;if((b-1&b|0)==0){c[7198]=b;c[7197]=b;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS()}}}while(0);b=c[7218]|0;if((b|0)==0){d=0;e=0;f=0}else{g=c[7321]|0;h=c[7320]|0;j=h-40-(c[7215]|0)|0;k=29296;while(1){l=c[k>>2]|0;m=l+8|0;if((m&7|0)==0){n=0}else{n=-m&7}m=l+(c[k+4>>2]|0)|0;o=j;p=l+n|0;while(1){if(p>>>0>=m>>>0|(p|0)==(b|0)){q=o;break}r=c[p+4>>2]|0;if((r|0)==7){q=o;break}s=r&-8;t=o-((r&3|0)==1?s:0)|0;r=p+s|0;if(r>>>0<l>>>0){q=t;break}else{o=t;p=r}}p=c[k+8>>2]|0;if((p|0)==0){d=q;e=h;f=g;break}else{j=q;k=p}}}aT(c[E>>2]|0,3136,(k=i,i=i+8|0,c[k>>2]=f,k)|0)|0;i=k;aT(c[E>>2]|0,8760,(k=i,i=i+8|0,c[k>>2]=e,k)|0)|0;i=k;aT(c[E>>2]|0,5976,(k=i,i=i+8|0,c[k>>2]=d,k)|0)|0;i=k;i=a;return}function vF(a,b){a=a|0;b=b|0;var d=0,e=0;do{if((c[7196]|0)==0){d=aM(8)|0;if((d-1&d|0)==0){c[7198]=d;c[7197]=d;c[7199]=-1;c[7200]=-1;c[7201]=0;c[7323]=0;c[7196]=(bk(0)|0)&-16^1431655768;break}else{aS();return 0}}}while(0);if((a|0)==(-3|0)){c[7199]=b;e=1;return e|0}else if((a|0)==(-1|0)){c[7200]=b;e=1;return e|0}else if((a|0)==(-2|0)){if((c[7197]|0)>>>0>b>>>0){e=0;return e|0}if((b-1&b|0)!=0){e=0;return e|0}c[7198]=b;e=1;return e|0}else{e=0;return e|0}return 0}function vG(){return(S=c[7444]|0,c[7444]=S+0,S)|0}function vH(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;d=a;e=d+b|0;f=e;g=c[a+4>>2]|0;L6012:do{if((g&1|0)==0){h=c[a>>2]|0;if((g&3|0)==0){return}i=d+(-h|0)|0;j=i;k=h+b|0;l=c[7216]|0;if(i>>>0<l>>>0){aS()}if((j|0)==(c[7217]|0)){m=d+(b+4)|0;if((c[m>>2]&3|0)!=3){n=j;o=k;break}c[7214]=k;c[m>>2]=c[m>>2]&-2;c[d+(4-h)>>2]=k|1;c[e>>2]=k;return}m=h>>>3;if(h>>>0<256){p=c[d+(8-h)>>2]|0;q=c[d+(12-h)>>2]|0;r=28888+(m<<1<<2)|0;do{if((p|0)!=(r|0)){if(p>>>0<l>>>0){aS()}if((c[p+12>>2]|0)==(j|0)){break}aS()}}while(0);if((q|0)==(p|0)){c[7212]=c[7212]&~(1<<m);n=j;o=k;break}do{if((q|0)==(r|0)){s=q+8|0}else{if(q>>>0<l>>>0){aS()}t=q+8|0;if((c[t>>2]|0)==(j|0)){s=t;break}aS()}}while(0);c[p+12>>2]=q;c[s>>2]=p;n=j;o=k;break}r=i;m=c[d+(24-h)>>2]|0;t=c[d+(12-h)>>2]|0;do{if((t|0)==(r|0)){u=16-h|0;v=d+(u+4)|0;w=c[v>>2]|0;if((w|0)==0){x=d+u|0;u=c[x>>2]|0;if((u|0)==0){y=0;break}else{z=u;A=x}}else{z=w;A=v}while(1){v=z+20|0;w=c[v>>2]|0;if((w|0)!=0){z=w;A=v;continue}v=z+16|0;w=c[v>>2]|0;if((w|0)==0){break}else{z=w;A=v}}if(A>>>0<l>>>0){aS()}else{c[A>>2]=0;y=z;break}}else{v=c[d+(8-h)>>2]|0;if(v>>>0<l>>>0){aS()}w=v+12|0;if((c[w>>2]|0)!=(r|0)){aS()}x=t+8|0;if((c[x>>2]|0)==(r|0)){c[w>>2]=t;c[x>>2]=v;y=t;break}else{aS()}}}while(0);if((m|0)==0){n=j;o=k;break}t=d+(28-h)|0;l=29152+(c[t>>2]<<2)|0;do{if((r|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[7213]=c[7213]&~(1<<c[t>>2]);n=j;o=k;break L6012}else{if(m>>>0<(c[7216]|0)>>>0){aS()}i=m+16|0;if((c[i>>2]|0)==(r|0)){c[i>>2]=y}else{c[m+20>>2]=y}if((y|0)==0){n=j;o=k;break L6012}}}while(0);if(y>>>0<(c[7216]|0)>>>0){aS()}c[y+24>>2]=m;r=16-h|0;t=c[d+r>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[7216]|0)>>>0){aS()}else{c[y+16>>2]=t;c[t+24>>2]=y;break}}}while(0);t=c[d+(r+4)>>2]|0;if((t|0)==0){n=j;o=k;break}if(t>>>0<(c[7216]|0)>>>0){aS()}else{c[y+20>>2]=t;c[t+24>>2]=y;n=j;o=k;break}}else{n=a;o=b}}while(0);a=c[7216]|0;if(e>>>0<a>>>0){aS()}y=d+(b+4)|0;z=c[y>>2]|0;do{if((z&2|0)==0){if((f|0)==(c[7218]|0)){A=(c[7215]|0)+o|0;c[7215]=A;c[7218]=n;c[n+4>>2]=A|1;if((n|0)!=(c[7217]|0)){return}c[7217]=0;c[7214]=0;return}if((f|0)==(c[7217]|0)){A=(c[7214]|0)+o|0;c[7214]=A;c[7217]=n;c[n+4>>2]=A|1;c[n+A>>2]=A;return}A=(z&-8)+o|0;s=z>>>3;L6112:do{if(z>>>0<256){g=c[d+(b+8)>>2]|0;t=c[d+(b+12)>>2]|0;h=28888+(s<<1<<2)|0;do{if((g|0)!=(h|0)){if(g>>>0<a>>>0){aS()}if((c[g+12>>2]|0)==(f|0)){break}aS()}}while(0);if((t|0)==(g|0)){c[7212]=c[7212]&~(1<<s);break}do{if((t|0)==(h|0)){B=t+8|0}else{if(t>>>0<a>>>0){aS()}m=t+8|0;if((c[m>>2]|0)==(f|0)){B=m;break}aS()}}while(0);c[g+12>>2]=t;c[B>>2]=g}else{h=e;m=c[d+(b+24)>>2]|0;l=c[d+(b+12)>>2]|0;do{if((l|0)==(h|0)){i=d+(b+20)|0;p=c[i>>2]|0;if((p|0)==0){q=d+(b+16)|0;v=c[q>>2]|0;if((v|0)==0){C=0;break}else{D=v;E=q}}else{D=p;E=i}while(1){i=D+20|0;p=c[i>>2]|0;if((p|0)!=0){D=p;E=i;continue}i=D+16|0;p=c[i>>2]|0;if((p|0)==0){break}else{D=p;E=i}}if(E>>>0<a>>>0){aS()}else{c[E>>2]=0;C=D;break}}else{i=c[d+(b+8)>>2]|0;if(i>>>0<a>>>0){aS()}p=i+12|0;if((c[p>>2]|0)!=(h|0)){aS()}q=l+8|0;if((c[q>>2]|0)==(h|0)){c[p>>2]=l;c[q>>2]=i;C=l;break}else{aS()}}}while(0);if((m|0)==0){break}l=d+(b+28)|0;g=29152+(c[l>>2]<<2)|0;do{if((h|0)==(c[g>>2]|0)){c[g>>2]=C;if((C|0)!=0){break}c[7213]=c[7213]&~(1<<c[l>>2]);break L6112}else{if(m>>>0<(c[7216]|0)>>>0){aS()}t=m+16|0;if((c[t>>2]|0)==(h|0)){c[t>>2]=C}else{c[m+20>>2]=C}if((C|0)==0){break L6112}}}while(0);if(C>>>0<(c[7216]|0)>>>0){aS()}c[C+24>>2]=m;h=c[d+(b+16)>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[7216]|0)>>>0){aS()}else{c[C+16>>2]=h;c[h+24>>2]=C;break}}}while(0);h=c[d+(b+20)>>2]|0;if((h|0)==0){break}if(h>>>0<(c[7216]|0)>>>0){aS()}else{c[C+20>>2]=h;c[h+24>>2]=C;break}}}while(0);c[n+4>>2]=A|1;c[n+A>>2]=A;if((n|0)!=(c[7217]|0)){F=A;break}c[7214]=A;return}else{c[y>>2]=z&-2;c[n+4>>2]=o|1;c[n+o>>2]=o;F=o}}while(0);o=F>>>3;if(F>>>0<256){z=o<<1;y=28888+(z<<2)|0;C=c[7212]|0;b=1<<o;do{if((C&b|0)==0){c[7212]=C|b;G=y;H=28888+(z+2<<2)|0}else{o=28888+(z+2<<2)|0;d=c[o>>2]|0;if(d>>>0>=(c[7216]|0)>>>0){G=d;H=o;break}aS()}}while(0);c[H>>2]=n;c[G+12>>2]=n;c[n+8>>2]=G;c[n+12>>2]=y;return}y=n;G=F>>>8;do{if((G|0)==0){I=0}else{if(F>>>0>16777215){I=31;break}H=(G+1048320|0)>>>16&8;z=G<<H;b=(z+520192|0)>>>16&4;C=z<<b;z=(C+245760|0)>>>16&2;o=14-(b|H|z)+(C<<z>>>15)|0;I=F>>>((o+7|0)>>>0)&1|o<<1}}while(0);G=29152+(I<<2)|0;c[n+28>>2]=I;c[n+20>>2]=0;c[n+16>>2]=0;o=c[7213]|0;z=1<<I;if((o&z|0)==0){c[7213]=o|z;c[G>>2]=y;c[n+24>>2]=G;c[n+12>>2]=n;c[n+8>>2]=n;return}if((I|0)==31){J=0}else{J=25-(I>>>1)|0}I=F<<J;J=c[G>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(F|0)){break}K=J+16+(I>>>31<<2)|0;G=c[K>>2]|0;if((G|0)==0){L=5255;break}else{I=I<<1;J=G}}if((L|0)==5255){if(K>>>0<(c[7216]|0)>>>0){aS()}c[K>>2]=y;c[n+24>>2]=J;c[n+12>>2]=n;c[n+8>>2]=n;return}K=J+8|0;L=c[K>>2]|0;I=c[7216]|0;if(J>>>0<I>>>0){aS()}if(L>>>0<I>>>0){aS()}c[L+12>>2]=y;c[K>>2]=y;c[n+8>>2]=L;c[n+12>>2]=J;c[n+24>>2]=0;return}function vI(a){a=a|0;var b=0,d=0,e=0;b=(a|0)==0?1:a;while(1){d=vi(b)|0;if((d|0)!=0){e=5299;break}a=(S=c[7444]|0,c[7444]=S+0,S);if((a|0)==0){break}bV[a&3]()}if((e|0)==5299){return d|0}d=bz(4)|0;c[d>>2]=18800;aO(d|0,24136,44);return 0}function vJ(a,b){a=a|0;b=b|0;return vI(a)|0}function vK(a){a=a|0;return}function vL(a){a=a|0;return 4440|0}function vM(a){a=a|0;return 8904|0}function vN(a){a=a|0;return(S=c[7444]|0,c[7444]=a,S)|0}function vO(a){a=a|0;c[a>>2]=18800;return}function vP(a){a=a|0;c[a>>2]=18864;return}function vQ(a){a=a|0;if((a|0)!=0){vk(a)}return}function vR(a,b){a=a|0;b=b|0;vQ(a);return}function vS(a){a=a|0;vQ(a);return}function vT(a,b){a=a|0;b=b|0;vS(a);return}function vU(a){a=a|0;vQ(a);return}function vV(a){a=a|0;vQ(a);return}function vW(a,b,c){a=a|0;b=b|0;c=c|0;return vX(a,b,c,0,0,0)|0}function vX(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0;j=i;if((e|0)==0){k=-1;i=j;return k|0}l=c[44]|0;if((l|0)==0){c[7192]=1;c[44]=1;m=1;n=1;o=5325}else{p=c[7192]|0;q=c[98]|0;if((q|0)==-1|(p|0)!=0){m=p;n=l;o=5325}else{r=q;s=p;t=l}}if((o|0)==5325){l=(bn(2728)|0)!=0|0;c[98]=l;r=l;s=m;t=n}n=a[e]|0;if(n<<24>>24==45){u=h|2;o=5329}else{m=(r|0)!=0|n<<24>>24==43?h&-2:h;if(n<<24>>24==43){u=m;o=5329}else{v=e;w=m}}if((o|0)==5329){v=e+1|0;w=u}c[7194]=0;if((s|0)==0){x=t;o=5333}else{c[50]=-1;c[48]=-1;y=t;z=s;o=5332}while(1){if((o|0)==5333){o=0;s=c[40]|0;if((a[s]|0)==0){A=x}else{B=s;C=x;break}}else if((o|0)==5332){o=0;if((z|0)==0){x=y;o=5333;continue}else{A=y}}c[7192]=0;if((A|0)>=(b|0)){o=5335;break}D=d+(A<<2)|0;E=c[D>>2]|0;c[40]=E;if((a[E]|0)==45){F=E+1|0;G=a[F]|0;if(G<<24>>24!=0){o=5367;break}if((a$(v|0,45)|0)!=0){o=5367;break}}c[40]=28824;if((w&2|0)!=0){o=5352;break}if((w&1|0)==0){k=-1;o=5435;break}s=c[48]|0;do{if((s|0)==-1){c[48]=A;H=A;I=0}else{t=c[50]|0;if((t|0)==-1){H=A;I=0;break}u=t-s|0;e=A-t|0;m=(u|0)%(e|0)|0;if((m|0)==0){J=e}else{n=e;h=m;while(1){m=(n|0)%(h|0)|0;if((m|0)==0){J=h;break}else{n=h;h=m}}}h=(A-s|0)/(J|0)|0;do{if((J|0)>0){n=-u|0;if((h|0)>0){K=0}else{L=A;M=t;N=s;O=0;break}do{m=K+t|0;r=d+(m<<2)|0;l=0;p=m;m=c[r>>2]|0;while(1){q=((p|0)<(t|0)?e:n)+p|0;P=d+(q<<2)|0;Q=c[P>>2]|0;c[P>>2]=m;c[r>>2]=Q;P=l+1|0;if((P|0)<(h|0)){l=P;p=q;m=Q}else{break}}K=K+1|0;}while((K|0)<(J|0));L=c[44]|0;M=c[50]|0;N=c[48]|0;O=c[7192]|0}else{L=A;M=t;N=s;O=0}}while(0);c[48]=L-M+N;c[50]=-1;H=L;I=O}}while(0);s=H+1|0;c[44]=s;y=s;z=I;o=5332}do{if((o|0)==5435){i=j;return k|0}else if((o|0)==5352){c[44]=A+1;c[7194]=c[D>>2];k=1;i=j;return k|0}else if((o|0)==5367){I=c[48]|0;z=c[50]|0;if((I|0)!=-1&(z|0)==-1){c[50]=A;R=a[F]|0;S=A}else{R=G;S=z}if(R<<24>>24==0){B=E;C=A;break}c[40]=F;if((a[F]|0)!=45){B=F;C=A;break}if((a[E+2|0]|0)!=0){B=F;C=A;break}z=A+1|0;c[44]=z;c[40]=28824;if((S|0)!=-1){y=S-I|0;H=z-S|0;O=(y|0)%(H|0)|0;if((O|0)==0){T=H}else{L=H;N=O;while(1){O=(L|0)%(N|0)|0;if((O|0)==0){T=N;break}else{L=N;N=O}}}N=(z-I|0)/(T|0)|0;do{if((T|0)>0){L=-y|0;if((N|0)>0){U=0}else{V=S;W=I;X=z;break}do{O=U+S|0;M=d+(O<<2)|0;J=0;K=O;O=c[M>>2]|0;while(1){x=((K|0)<(S|0)?H:L)+K|0;s=d+(x<<2)|0;t=c[s>>2]|0;c[s>>2]=O;c[M>>2]=t;s=J+1|0;if((s|0)<(N|0)){J=s;K=x;O=t}else{break}}U=U+1|0;}while((U|0)<(T|0));V=c[50]|0;W=c[48]|0;X=c[44]|0}else{V=S;W=I;X=z}}while(0);c[44]=W-V+X}c[50]=-1;c[48]=-1;k=-1;i=j;return k|0}else if((o|0)==5335){c[40]=28824;z=c[50]|0;I=c[48]|0;do{if((z|0)==-1){if((I|0)==-1){break}c[44]=I}else{N=z-I|0;H=A-z|0;y=(N|0)%(H|0)|0;if((y|0)==0){Y=H}else{L=H;O=y;while(1){y=(L|0)%(O|0)|0;if((y|0)==0){Y=O;break}else{L=O;O=y}}}O=(A-I|0)/(Y|0)|0;do{if((Y|0)>0){L=-N|0;if((O|0)>0){Z=0}else{_=z;$=I;aa=A;break}do{y=Z+z|0;K=d+(y<<2)|0;J=0;M=y;y=c[K>>2]|0;while(1){t=((M|0)<(z|0)?H:L)+M|0;x=d+(t<<2)|0;s=c[x>>2]|0;c[x>>2]=y;c[K>>2]=s;x=J+1|0;if((x|0)<(O|0)){J=x;M=t;y=s}else{break}}Z=Z+1|0;}while((Z|0)<(Y|0));_=c[50]|0;$=c[48]|0;aa=c[44]|0}else{_=z;$=I;aa=A}}while(0);c[44]=$-_+aa}}while(0);c[50]=-1;c[48]=-1;k=-1;i=j;return k|0}}while(0);aa=(f|0)!=0;L6346:do{if(aa){if((B|0)==(c[d+(C<<2)>>2]|0)){ab=B;break}_=a[B]|0;do{if(_<<24>>24==45){c[40]=B+1;ac=0}else{if((w&4|0)==0){ab=B;break L6346}if(_<<24>>24==58){ac=0;break}ac=(a$(v|0,_<<24>>24|0)|0)!=0|0}}while(0);_=v1(d,v,f,g,ac)|0;if((_|0)==-1){ab=c[40]|0;break}c[40]=28824;k=_;i=j;return k|0}else{ab=B}}while(0);B=ab+1|0;c[40]=B;ac=a[ab]|0;ab=ac<<24>>24;if((ac<<24>>24|0)==45){if((a[B]|0)==0){o=5395}}else if((ac<<24>>24|0)==58){o=5398}else{o=5395}do{if((o|0)==5395){w=a$(v|0,ab|0)|0;if((w|0)==0){if(ac<<24>>24!=45){o=5398;break}if((a[B]|0)==0){k=-1}else{break}i=j;return k|0}C=a[w+1|0]|0;if(aa&ac<<24>>24==87&C<<24>>24==59){do{if((a[B]|0)==0){_=(c[44]|0)+1|0;c[44]=_;if((_|0)<(b|0)){c[40]=c[d+(_<<2)>>2];break}c[40]=28824;do{if((c[46]|0)!=0){if((a[v]|0)==58){break}v3(48,(ad=i,i=i+8|0,c[ad>>2]=ab,ad)|0);i=ad}}while(0);c[42]=ab;k=(a[v]|0)==58?58:63;i=j;return k|0}}while(0);_=v1(d,v,f,g,0)|0;c[40]=28824;k=_;i=j;return k|0}if(C<<24>>24!=58){if((a[B]|0)!=0){k=ab;i=j;return k|0}c[44]=(c[44]|0)+1;k=ab;i=j;return k|0}c[7194]=0;do{if((a[B]|0)==0){if((a[w+2|0]|0)==58){break}_=(c[44]|0)+1|0;c[44]=_;if((_|0)<(b|0)){c[7194]=c[d+(_<<2)>>2];break}c[40]=28824;do{if((c[46]|0)!=0){if((a[v]|0)==58){break}v3(48,(ad=i,i=i+8|0,c[ad>>2]=ab,ad)|0);i=ad}}while(0);c[42]=ab;k=(a[v]|0)==58?58:63;i=j;return k|0}else{c[7194]=B}}while(0);c[40]=28824;c[44]=(c[44]|0)+1;k=ab;i=j;return k|0}}while(0);do{if((o|0)==5398){if((a[B]|0)!=0){break}c[44]=(c[44]|0)+1}}while(0);do{if((c[46]|0)!=0){if((a[v]|0)==58){break}v3(272,(ad=i,i=i+8|0,c[ad>>2]=ab,ad)|0);i=ad}}while(0);c[42]=ab;k=63;i=j;return k|0}function vY(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return vX(a,b,c,d,e,1)|0}function vZ(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return vX(a,b,c,d,e,5)|0}function v_(a){a=a|0;return vI(a)|0}function v$(a,b){a=a|0;b=b|0;return v_(a)|0}function v0(){var a=0;a=bz(4)|0;c[a>>2]=18800;aO(a|0,24136,44)}function v1(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;h=i;j=c[40]|0;k=c[44]|0;l=k+1|0;c[44]=l;m=a$(j|0,61)|0;if((m|0)==0){n=wj(j|0)|0;o=0}else{n=m-j|0;o=m+1|0}m=c[e>>2]|0;L6426:do{if((m|0)!=0){L6428:do{if((g|0)!=0&(n|0)==1){p=0;q=m;while(1){if((a[j]|0)==(a[q]|0)){if((wj(q|0)|0)==1){r=p;break L6428}}p=p+1|0;q=c[e+(p<<4)>>2]|0;if((q|0)==0){break L6426}}}else{q=0;p=-1;s=m;while(1){if((aJ(j|0,s|0,n|0)|0)==0){if((wj(s|0)|0)==(n|0)){r=q;break L6428}if((p|0)==-1){t=q}else{break}}else{t=p}u=q+1|0;v=c[e+(u<<4)>>2]|0;if((v|0)==0){r=t;break L6428}else{q=u;p=t;s=v}}do{if((c[46]|0)!=0){if((a[d]|0)==58){break}v3(400,(w=i,i=i+16|0,c[w>>2]=n,c[w+8>>2]=j,w)|0);i=w}}while(0);c[42]=0;x=63;i=h;return x|0}}while(0);if((r|0)==-1){break}s=e+(r<<4)+4|0;p=c[s>>2]|0;q=(o|0)==0;if(!((p|0)!=0|q)){do{if((c[46]|0)!=0){if((a[d]|0)==58){break}v3(208,(w=i,i=i+16|0,c[w>>2]=n,c[w+8>>2]=j,w)|0);i=w}}while(0);if((c[e+(r<<4)+8>>2]|0)==0){y=c[e+(r<<4)+12>>2]|0}else{y=0}c[42]=y;x=(a[d]|0)==58?58:63;i=h;return x|0}do{if((p-1|0)>>>0<2){if(!q){c[7194]=o;break}if((p|0)!=1){break}c[44]=k+2;c[7194]=c[b+(l<<2)>>2]}}while(0);if(!((c[s>>2]|0)==1&(c[7194]|0)==0)){if((f|0)!=0){c[f>>2]=r}p=c[e+(r<<4)+8>>2]|0;q=c[e+(r<<4)+12>>2]|0;if((p|0)==0){x=q;i=h;return x|0}c[p>>2]=q;x=0;i=h;return x|0}do{if((c[46]|0)!=0){if((a[d]|0)==58){break}v3(8,(w=i,i=i+8|0,c[w>>2]=j,w)|0);i=w}}while(0);if((c[e+(r<<4)+8>>2]|0)==0){z=c[e+(r<<4)+12>>2]|0}else{z=0}c[42]=z;c[44]=(c[44]|0)-1;x=(a[d]|0)==58?58:63;i=h;return x|0}}while(0);if((g|0)!=0){c[44]=k;x=-1;i=h;return x|0}do{if((c[46]|0)!=0){if((a[d]|0)==58){break}v3(248,(w=i,i=i+8|0,c[w>>2]=j,w)|0);i=w}}while(0);c[42]=0;x=63;i=h;return x|0}function v2(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+16|0;e=d|0;f=e;c[f>>2]=b;c[f+4>>2]=0;v4(a,e|0);i=d;return}function v3(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+16|0;e=d|0;f=e;c[f>>2]=b;c[f+4>>2]=0;v5(a,e|0);i=d;return}function v4(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=c[(bB()|0)>>2]|0;f=c[w>>2]|0;aT(c[E>>2]|0,7600,(g=i,i=i+8|0,c[g>>2]=f,g)|0)|0;i=g;if((a|0)!=0){f=c[E>>2]|0;bq(f|0,a|0,b|0)|0;b=c[E>>2]|0;aR(9960,2,1,b|0)|0}b=c[E>>2]|0;a=aQ(e|0)|0;aT(b|0,6864,(g=i,i=i+8|0,c[g>>2]=a,g)|0)|0;i=g;i=d;return}function v5(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;e=c[w>>2]|0;aT(c[E>>2]|0,6392,(f=i,i=i+8|0,c[f>>2]=e,f)|0)|0;i=f;if((a|0)!=0){f=c[E>>2]|0;bq(f|0,a|0,b|0)|0}a0(10,c[E>>2]|0)|0;i=d;return}function v6(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0,y=0,z=0.0,A=0.0,B=0,C=0,D=0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0.0,O=0,P=0,Q=0.0,R=0.0,S=0.0;e=b;while(1){f=e+1|0;if((bD(a[e]|0)|0)==0){break}else{e=f}}g=a[e]|0;if((g<<24>>24|0)==45){i=f;j=1}else if((g<<24>>24|0)==43){i=f;j=0}else{i=e;j=0}e=-1;f=0;g=i;while(1){k=a[g]|0;if(((k<<24>>24)-48|0)>>>0<10){l=e}else{if(k<<24>>24!=46|(e|0)>-1){break}else{l=f}}e=l;f=f+1|0;g=g+1|0}l=g+(-f|0)|0;i=(e|0)<0;m=((i^1)<<31>>31)+f|0;n=(m|0)>18;o=(n?-18:-m|0)+(i?f:e)|0;e=n?18:m;do{if((e|0)==0){p=b;q=0.0}else{if((e|0)>9){m=l;n=e;f=0;while(1){i=a[m]|0;r=m+1|0;if(i<<24>>24==46){s=a[r]|0;t=m+2|0}else{s=i;t=r}u=(f*10|0)-48+(s<<24>>24)|0;r=n-1|0;if((r|0)>9){m=t;n=r;f=u}else{break}}v=+(u|0)*1.0e9;w=9;x=t;y=5528}else{if((e|0)>0){v=0.0;w=e;x=l;y=5528}else{z=0.0;A=0.0}}if((y|0)==5528){f=x;n=w;m=0;while(1){r=a[f]|0;i=f+1|0;if(r<<24>>24==46){B=a[i]|0;C=f+2|0}else{B=r;C=i}D=(m*10|0)-48+(B<<24>>24)|0;i=n-1|0;if((i|0)>0){f=C;n=i;m=D}else{break}}z=+(D|0);A=v}E=A+z;do{if((k<<24>>24|0)==69|(k<<24>>24|0)==101){m=g+1|0;n=a[m]|0;if((n<<24>>24|0)==43){F=g+2|0;G=0}else if((n<<24>>24|0)==45){F=g+2|0;G=1}else{F=m;G=0}m=a[F]|0;if(((m<<24>>24)-48|0)>>>0<10){H=F;I=0;J=m}else{K=0;L=F;M=G;break}while(1){m=(I*10|0)-48+(J<<24>>24)|0;n=H+1|0;f=a[n]|0;if(((f<<24>>24)-48|0)>>>0<10){H=n;I=m;J=f}else{K=m;L=n;M=G;break}}}else{K=0;L=g;M=0}}while(0);n=o+((M|0)==0?K:-K|0)|0;m=(n|0)<0?-n|0:n;if((m|0)>511){c[(bB()|0)>>2]=34;N=1.0;O=88;P=511;y=5545}else{if((m|0)==0){Q=1.0}else{N=1.0;O=88;P=m;y=5545}}if((y|0)==5545){while(1){y=0;if((P&1|0)==0){R=N}else{R=N*+h[O>>3]}m=P>>1;if((m|0)==0){Q=R;break}else{N=R;O=O+8|0;P=m;y=5545}}}if((n|0)>-1){p=L;q=E*Q;break}else{p=L;q=E/Q;break}}}while(0);if((d|0)!=0){c[d>>2]=p}if((j|0)==0){S=q;return+S}S=-0.0-q;return+S}function v7(a,b){a=a|0;b=b|0;return+(+v6(a,b))}function v8(a,b){a=a|0;b=b|0;return+(+v6(a,b))}function v9(a,b,c){a=a|0;b=b|0;c=c|0;return+(+v6(a,b))}function wa(a,b,c){a=a|0;b=b|0;c=c|0;return+(+v6(a,b))}function wb(a){a=a|0;return+(+v6(a,0))}function wc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e|0;e=f;c[e>>2]=d;c[e+4>>2]=0;we(a,b,f|0)}function wd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e|0;e=f;c[e>>2]=d;c[e+4>>2]=0;wf(a,b,f|0)}function we(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=c[(bB()|0)>>2]|0;f=c[w>>2]|0;aT(c[E>>2]|0,512,(g=i,i=i+8|0,c[g>>2]=f,g)|0)|0;i=g;if((b|0)!=0){f=c[E>>2]|0;bq(f|0,b|0,d|0)|0;d=c[E>>2]|0;aR(10336,2,1,d|0)|0}d=c[E>>2]|0;b=aQ(e|0)|0;aT(d|0,7200,(g=i,i=i+8|0,c[g>>2]=b,g)|0)|0;i=g;ba(a|0)}function wf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=c[w>>2]|0;aT(c[E>>2]|0,8536,(f=i,i=i+8|0,c[f>>2]=e,f)|0)|0;i=f;if((b|0)!=0){f=c[E>>2]|0;bq(f|0,b|0,d|0)|0}a0(10,c[E>>2]|0)|0;ba(a|0)}function wg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function wh(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function wi(b,c,d){b=b|0;c=c|0;d=d|0;if((c|0)<(b|0)&(b|0)<(c+d|0)){c=c+d|0;b=b+d|0;while((d|0)>0){b=b-1|0;c=c-1|0;d=d-1|0;a[b]=a[c]|0}}else{wh(b,c,d)|0}}function wj(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function wk(a,b,c){a=a|0;b=b|0;c=c|0;var e=0,f=0,g=0;while((e|0)<(c|0)){f=d[a+e|0]|0;g=d[b+e|0]|0;if((f|0)!=(g|0))return((f|0)>(g|0)?1:-1)|0;e=e+1|0}return 0}function wl(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0;while((e|0)<(d|0)){a[b+e|0]=f?0:a[c+e|0]|0;f=f?1:(a[c+e|0]|0)==0;e=e+1|0}return b|0}function wm(){bg()}function wn(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;bN[a&31](b|0,c|0,d|0,e|0,f|0)}function wo(a,b,c){a=a|0;b=b|0;c=+c;bO[a&31](b|0,+c)}function wp(a){a=a|0;return bP[a&63]()|0}function wq(a,b){a=a|0;b=b|0;bQ[a&511](b|0)}function wr(a,b,c){a=a|0;b=b|0;c=c|0;bR[a&127](b|0,c|0)}function ws(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return bS[a&255](b|0,c|0,d|0)|0}function wt(a,b){a=a|0;b=b|0;return bT[a&63](b|0)|0}function wu(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;bU[a&31](b|0,c|0,d|0)}function wv(a){a=a|0;bV[a&3]()}function ww(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return bW[a&15](b|0,c|0,d|0,e|0)|0}function wx(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;bX[a&7](b|0,c|0,d|0,e|0,f|0,g|0)}function wy(a,b,c){a=a|0;b=b|0;c=c|0;return bY[a&127](b|0,c|0)|0}function wz(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;bZ[a&63](b|0,c|0,d|0,e|0)}function wA(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ar(0)}function wB(a,b){a=a|0;b=+b;ar(1)}function wC(){ar(2);return 0}function wD(a){a=a|0;ar(3)}function wE(a,b){a=a|0;b=b|0;ar(4)}function wF(a,b,c){a=a|0;b=b|0;c=c|0;ar(5);return 0}function wG(a){a=a|0;ar(6);return 0}function wH(a,b,c){a=a|0;b=b|0;c=c|0;ar(7)}function wI(){ar(8)}function wJ(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ar(9);return 0}function wK(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;ar(10)}function wL(a,b){a=a|0;b=b|0;ar(11);return 0}function wM(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ar(12)}
// EMSCRIPTEN_END_FUNCS
var bN=[wA,wA,mI,wA,nt,wA,ve,wA,va,wA,k7,wA,jS,wA,vb,wA,pZ,wA,tG,wA,rA,wA,wA,wA,wA,wA,wA,wA,wA,wA,wA,wA];var bO=[wB,wB,pG,wB,rq,wB,lc,wB,s3,wB,mJ,wB,jT,wB,tD,wB,ib,wB,lM,wB,ni,wB,wB,wB,wB,wB,wB,wB,wB,wB,wB,wB];var bP=[wC,wC,m2,wC,rT,wC,tW,wC,m1,wC,n5,wC,rS,wC,l6,wC,te,wC,ly,wC,n6,wC,kc,wC,kd,wC,q1,wC,l7,wC,tV,wC,qv,wC,qg,wC,lx,wC,q2,wC,td,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC,wC];var bQ=[wD,wD,d3,wD,tc,wD,mN,wD,tY,wD,hN,wD,pK,wD,cP,wD,eU,wD,q9,wD,di,wD,jV,wD,tv,wD,hL,wD,cl,wD,eZ,wD,q0,wD,uB,wD,it,wD,m$,wD,d2,wD,i8,wD,vK,wD,dT,wD,l0,wD,uJ,wD,vP,wD,nR,wD,hq,wD,d6,wD,hl,wD,cO,wD,hr,wD,n8,wD,nu,wD,eh,wD,hQ,wD,f0,wD,kl,wD,tw,wD,cU,wD,d8,wD,dK,wD,ez,wD,u2,wD,jL,wD,pz,wD,uX,wD,uZ,wD,nw,wD,q0,wD,rR,wD,d9,wD,hA,wD,ld,wD,jd,wD,qN,wD,tK,wD,ux,wD,mO,wD,ra,wD,e4,wD,lm,wD,qS,wD,pL,wD,hn,wD,d1,wD,ci,wD,ga,wD,tx,wD,qX,wD,uD,wD,mM,wD,lw,wD,jt,wD,rt,wD,uy,wD,gi,wD,d5,wD,q$,wD,u1,wD,ho,wD,uU,wD,lS,wD,uT,wD,u0,wD,s$,wD,cm,wD,ii,wD,d$,wD,hS,wD,f9,wD,vV,wD,vU,wD,rC,wD,d4,wD,qx,wD,lC,wD,uY,wD,hd,wD,u$,wD,ur,wD,jW,wD,k$,wD,hQ,wD,qy,wD,cY,wD,kf,wD,pJ,wD,uE,wD,mw,wD,lF,wD,ga,wD,ct,wD,lg,wD,rt,wD,tg,wD,d_,wD,gb,wD,uS,wD,oN,wD,hJ,wD,uf,wD,eZ,wD,pL,wD,tn,wD,ij,wD,q4,wD,hP,wD,d0,wD,ue,wD,nv,wD,ih,wD,tU,wD,cP,wD,mO,wD,hr,wD,s_,wD,ut,wD,ep,wD,u_,wD,iO,wD,s0,wD,ep,wD,uI,wD,uz,wD,lA,wD,u3,wD,dc,wD,nd,wD,eJ,wD,us,wD,vO,wD,uR,wD,lg,wD,nk,wD,dT,wD,d7,wD,nX,wD,q_,wD,l9,wD,hw,wD,jL,wD,l4,wD,s0,wD,j9,wD,uW,wD,qi,wD,dJ,wD,nw,wD,lB,wD,tq,wD,pi,wD,im,wD,lS,wD,tw,wD,ho,wD,i2,wD,m4,wD,qz,wD,lf,wD,uV,wD,hp,wD,he,wD,rV,wD,rD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD,wD];var bR=[wE,wE,hk,wE,eI,wE,sU,wE,nr,wE,hB,wE,df,wE,cV,wE,dQ,wE,eT,wE,cL,wE,v4,wE,hm,wE,v3,wE,jQ,wE,pV,wE,dl,wE,hy,wE,tF,wE,eV,wE,sV,wE,eS,wE,rz,wE,hz,wE,tH,wE,v2,wE,ig,wE,mG,wE,eX,wE,ie,wE,cz,wE,cS,wE,ia,wE,v5,wE,k6,wE,hj,wE,lN,wE,cT,wE,h9,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE,wE];var bS=[wF,wF,rM,wF,dC,wF,t1,wF,dI,wF,rw,wF,l1,wF,ru,wF,hs,wF,cI,wF,my,wF,dx,wF,e$,wF,dF,wF,hh,wF,m7,wF,qP,wF,jM,wF,lP,wF,rZ,wF,qb,wF,u4,wF,tN,wF,pE,wF,kj,wF,lo,wF,uG,wF,hC,wF,tR,wF,hi,wF,cW,wF,rY,wF,uF,wF,qk,wF,l_,wF,dB,wF,dg,wF,sR,wF,k1,wF,s7,wF,tS,wF,gt,wF,tA,wF,uK,wF,ki,wF,uO,wF,nl,wF,u8,wF,dP,wF,lG,wF,mZ,wF,dH,wF,jO,wF,eR,wF,l2,wF,sX,wF,dX,wF,uL,wF,q7,wF,id,wF,j5,wF,lk,wF,du,wF,nT,wF,nL,wF,tj,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF,wF];var bT=[wG,wG,dY,wG,uA,wG,hF,wG,vM,wG,dq,wG,dw,wG,dp,wG,dz,wG,dO,wG,hD,wG,vL,wG,ds,wG,dn,wG,eY,wG,cX,wG,uC,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG,wG];var bU=[wH,wH,ck,wH,e3,wH,dS,wH,we,wH,wf,wH,dD,wH,wd,wH,wc,wH,wH,wH,wH,wH,wH,wH,wH,wH,wH,wH,wH,wH,wH,wH];var bV=[wI,wI,wm,wI];var bW=[wJ,wJ,uu,wJ,lY,wJ,lZ,wJ,up,wJ,wJ,wJ,wJ,wJ,wJ,wJ];var bX=[wK,wK,vf,wK,vg,wK,vh,wK];var bY=[wL,wL,ic,wL,m6,wL,t0,wL,dv,wL,ln,wL,dZ,wL,mK,wL,s6,wL,k3,wL,h2,wL,q6,wL,jU,wL,np,wL,pw,wL,qj,wL,rJ,wL,pR,wL,qT,wL,ti,wL,dR,wL,gh,wL,gW,wL,tE,wL,lR,wL,qQ,wL,tQ,wL,mB,wL,lh,wL,sT,wL,lJ,wL,s4,wL,h8,wL,nF,wL,nS,wL,de,wL,dr,wL,qa,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL,wL];var bZ=[wM,wM,i0,wM,eW,wM,dd,wM,u5,wM,u7,wM,hx,wM,i$,wM,hE,wM,uN,wM,dy,wM,iY,wM,i4,wM,iZ,wM,i_,wM,i1,wM,dG,wM,iX,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM,wM];return{__ZNK13Stereo_Buffer13samples_availEv:hF,__ZN13Subset_ReaderD0Ev:d3,__ZN7Spc_Dsp5writeEii:sq,__ZN8Spc_FileD1Ev:tc,__ZN9blip_eq_tC2Edlll:lU,__ZN7Hes_EmuD0Ev:mN,__ZN13blargg_vectorIsED2Ev:eD,__ZN7Sap_Emu10run_clocksERii:rM,__ZNK8Gme_File9user_dataEv:fv,__ZN8Rom_DataILi4096EE8set_addrEl:pU,__ZL3minii413:ng,__ZN16Remaining_Reader4readEPvl:dC,__ZN13Stereo_Buffer9bass_freqEi:hk,__ZN12Multi_BufferD0Ev:hN,__ZN7Nsf_Emu10set_tempo_Ed:pG,__ZN13blargg_vectorIhEC1Ev:f2,__ZN8Gme_FileC2Ev:f7,__ZN14Effects_Buffer10mix_stereoEPsl:e0,__ZN14Fir_Resampler_5clearEv:e5,__Z13from_hex_chari:gY,__ZN7Gym_Emu7run_dacEi:lW,__ZN9Gme_Info_8pre_loadEv:ih,__ZN7Nsf_EmuD0Ev:pK,__Z7set_segR6slot_ti:iC,__ZN8Hes_File5load_ER11Data_Reader:m6,_gme_track_ended:fN,__ZN8Snes_Spc5resetEv:r0,__ZN7Scc_Apu6volumeEd:no,__ZN11Classic_EmuD2Ev:cP,__ZN9Music_Emu4skipEl:h7,__ZN7Nes_Apu6volumeEd:n1,__ZN14Effects_Buffer5clearEv:eU,__ZNK9blip_eq_t8generateEPfi:cr,__ZNK13blargg_vectorIA4_cEixEj:qZ,__ZNK8Gme_File12remap_track_EPi:go,__ZN14Effects_BufferC2Eb:eI,__ZN12Sap_Apu_ImplC2Ev:q9,__ZN7Hes_Cpu15update_end_timeEll:mm,__ZN18ym2612_update_chanILi6EE4funcER8tables_tR9channel_tPsi:i1,__ZN13Fir_ResamplerILi24EED2Ev:tl,__ZN9Nes_NoiseC1Ev:nZ,__ZN13Silent_BufferD0Ev:di,__ZN6Ay_EmuC2Ev:jV,__ZN8Vgm_File5load_ER11Data_Reader:t0,__ZN9Music_Emu23set_max_initial_silenceEi:kT,__ZN7Nes_Dmc10recalc_irqEv:pa,__ZN7Kss_EmuC2Ev:nu,__ZN9Music_Emu14ignore_silenceEb:fz,__ZN13Fir_ResamplerILi12EEC1Ev:ef,__ZN9Music_Emu10post_load_Ev:hL,__ZN11Blip_BufferD2Ev:cl,__ZN7Nes_Cpu5resetEPKv:oF,__ZN7Hes_Cpu5resetEv:mi,__ZL3minll554:qA,___cxx_global_var_init1:kY,__ZN9Music_Emu18end_track_if_errorEPKc:h_,__ZN10Blip_SynthILi12ELi1EE6volumeEd:iE,__ZNK7Spc_Emu11track_info_EP12track_info_ti:sR,__ZN7Spc_Dsp11run_counterEi:sE,__ZL3minll414:nz,__ZL8from_hexPKh:rO,__ZN11Data_Reader4skipEl:dv,__ZN16Remaining_Reader10read_firstEPvl:dA,__ZN7Nes_Apu9treble_eqERK9blip_eq_t:n3,__ZNK13blargg_vectorIhE3endEv:c1,__ZN11File_ReaderD2Ev:dM,__ZN10Ym2612_Emu5resetEv:iP,__ZN12Multi_BuffernwEj:c2,__ZN7Gbs_EmuD0Ev:lf,__ZN6Ay_Apu9treble_eqERK9blip_eq_t:jR,__ZN11Classic_Emu12setup_bufferEl:c5,__ZN8Rom_DataILi4096EE5clearEv:pD,__ZN7Nes_Apu16enable_nonlinearEd:n4,__ZN12Nes_Fme7_Apu11write_latchEi:p3,__ZN7Hes_Apu15balance_changedER7Hes_Osc:mb,__ZN13Fir_ResamplerILi24EE4readEPsl:s8,__ZN7Hes_Cpu12set_irq_timeEl:mX,__ZN6Gb_Cpu3runEl:kE,__ZNSt10bad_typeidD2Ev:uB,__ZN9Nsfe_FileD2Ev:rd,__ZN6Ym_EmuI10Ym2413_EmuEC1Ev:t9,__ZN6Gb_Apu13update_volumeEv:kq,_strtold_l:wa,__ZN8Nsfe_Emu16disable_playlistEb:qR,__ZN16Blip_Synth_Fast_C2Ev:ci,__ZN11Blip_Synth_C2EPsi:ck,__ZL10parse_linePcRN12M3u_Playlist7entry_tE:g1,__ZN8Gbs_File5load_ER11Data_Reader:ln,__ZN7Kss_Emu9update_eqERK9blip_eq_t:nr,__ZNK12Multi_Buffer6lengthEv:c$,__ZL14copy_ay_fieldsRKN6Ay_Emu6file_tEP12track_info_ti:jN,__ZN9Music_Emu13remute_voicesEv:c7,__ZN12Nes_Triangle5resetEv:oc,__ZN7Nes_DmcC1Ev:n$,__Z8set_le16Pvj:jE,__ZN11File_Reader4skipEl:dR,__ZN14Dual_Resampler9dual_playElPsR11Blip_Buffer:eC,__ZNK14Effects_Buffer13samples_availEv:eY,__ZNK9Music_Emu11voice_countEv:cZ,__ZN9Gb_Square3runEiii:kO,__ZN15Callback_Reader4readEPvl:dI,__ZN13Stereo_Buffer10mix_stereoEPsl:hg,__ZL15copy_hes_fieldsPKhP12track_info_t:mz,__Z8get_be32PKv:e8,__ZN11File_ReaderC2Ev:dE,__ZN15Std_File_Reader4seekEl:dZ,__ZN7Gym_Emu5play_ElPs:l_,__ZN13Subset_ReaderD1Ev:d2,__ZN7Sms_ApuD2Ev:i8,__ZN14Fir_Resampler_11buffer_sizeEi:e6,__ZL10skip_whitePc:g_,__ZN8Snes_Spc9set_tempoEi:rW,__ZN6Gb_Cpu5resetEPv:kz,__ZN13blargg_vectorIhE5clearEv:c9,__ZNSt9bad_allocD2Ev:vK,__ZN15Std_File_ReaderD2Ev:dT,__ZN14Effects_Buffer8mix_monoEPsl:e1,__ZN14Dual_Resampler11play_frame_ER11Blip_BufferPs:eq,__ZN13Silent_Buffer7channelEii:dd,__ZN13blargg_vectorIPKcEC1Ev:qp,__ZN9Music_EmuC2Ev:hO,__ZN9Music_Emu21set_silence_lookaheadEi:jH,__GLOBAL__I_a290:lu,__ZN18ym2612_update_chanILi5EE4funcER8tables_tR9channel_tPsi:i0,__ZN11Blip_Buffer14remove_samplesEl:cq,__ZL13parse_commentPcRN12M3u_Playlist6info_tEb:gQ,__ZN13blargg_vectorIcEC1Ev:gI,__ZN8Gme_File16set_user_cleanupEPFvPvE:fx,_gme_set_fade:fM,__ZN8Gym_File9load_mem_EPKhl:l1,__ZN9Gme_Info_12start_track_Ei:ic,__ZNK12Vgm_Emu_Impl15update_fm_ratesEPlS0_:uq,__ZN18ym2612_update_chanILi1EE4funcER8tables_tR9channel_tPsi:iY,__ZN6Gb_Apu5resetEv:kn,__ZN13blargg_vectorIhED1Ev:f3,__ZNSt20bad_array_new_lengthC2Ev:vP,__ZN7Hes_Emu9set_voiceEiP11Blip_BufferS1_S1_:mI,__ZNK6Ym_EmuI10Ym2612_EmuE7enabledEv:tt,__ZN7Spc_Dsp17soft_reset_commonEv:sZ,__ZL14get_vgm_lengthRKN7Vgm_Emu8header_tEP12track_info_t:tB,__ZNK15Std_File_Reader4tellEv:dY,__GLOBAL__I_a:il,__ZN10Ym2413_Emu3runEiPs:uH,__ZN8Kss_FileD1Ev:nR,__ZN14Effects_Buffer7channelEii:eW,__ZN11Mono_Buffer9end_frameEi:hB,__ZNK14Fir_Resampler_5ratioEv:dV,__ZN8Gbs_FileD2Ev:lp,__ZN7Hes_Apu10osc_outputEiP11Blip_BufferS1_S1_:ma,__ZN13Stereo_BufferD0Ev:hq,__ZN9Rom_Data_9set_addr_Eli:db,__ZN13Fir_ResamplerILi12EEC2Ev:eE,__ZN13blargg_vectorIN12M3u_Playlist7entry_tEED1Ev:gE,__ZN8Kss_File5load_ER11Data_Reader:nS,__ZN9Music_Emu5skip_El:h2,__ZN13Stereo_Buffer12read_samplesEPsl:hs,__ZN11Data_ReaderD1Ev:d_,__ZN13Stereo_Buffer10clock_rateEl:hj,__ZN9Nes_Noise5resetEv:od,__ZN13blargg_vectorIPKcE6resizeEj:q8,__ZN13Silent_Buffer15set_sample_rateEli:cI,__ZN8Gme_File9load_m3u_EPKc:gT,__ZN14Dual_Resampler6resizeEi:el,__ZN7Hes_Emu5load_ER11Data_Reader:mB,__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib:vg,__ZN7Vgm_Emu9update_eqERK9blip_eq_t:tF,__ZN14Effects_Buffer9set_depthEd:eG,_malloc_set_footprint_limit:vx,__ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi:uQ,__ZN11Blip_Buffer5clearEi:cn,__ZN11Ym2612_Impl6YM_SETEii:iJ,__ZL13count_silencePsl:hZ,__Z15update_envelopeR6slot_t:i5,__ZN7Kss_EmuD0Ev:nv,__ZN14Fir_Resampler_C2EiPs:e3,__ZN9Music_Emu15set_voice_namesEPKPKc:hu,__ZNK11Blip_Reader4readEv:eu,__ZN13Fir_ResamplerILi12EED1Ev:ei,__ZNK13blargg_vectorIA4_cE5beginEv:qF,__ZN15Mem_File_ReaderD1Ev:d6,__ZNK9Music_Emu9equalizerEv:cD,__ZN13Stereo_Buffer5clearEv:hl,__ZN9Music_Emu10mute_voiceEib:hT,__ZN11Classic_EmuD0Ev:cO,__ZN9Music_Emu4playElPs:is,__ZN7Nsf_Emu9update_eqERK9blip_eq_t:pV,__Z10ay_cpu_outP6Ay_Cpulji:j4,__ZN11Blip_Buffer9bass_freqEi:cg,__ZN7Gbs_Emu7cpu_jsrEj:lb,__ZN6Gb_Env14write_registerEii:kJ,_internal_memalign:vo,__ZN9Sms_Noise5resetEv:jo,__ZN10Nes_Square11clock_sweepEi:o1,__ZN8Gme_File14clear_playlistEv:f_,__ZN6Ym_EmuI10Ym2612_EmuED1Ev:t5,__ZNK10Blip_SynthILi12ELi1EE6offsetEiiP11Blip_Buffer:ix,__ZN8Rom_DataILi4096EED2Ev:qm,__ZN6Gb_Env5resetEv:kr,__ZNK7Hes_Cpu8end_timeEv:mT,__ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC2Ev:gy,__ZNK6Gb_Cpu6remainEv:kF,_realloc_in_place:vm,__ZN8Spc_FileD2Ev:to,__ZN7Nes_Dmc3runEll:pg,__ZN11Classic_Emu12mute_voices_Ei:df,__ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib:vf,__ZN13Nes_Namco_Apu6accessEv:oJ,__ZL12parse_headerPKhlPN6Ay_Emu6file_tE:jP,__ZN13Silent_Buffer9end_frameEi:cV,__ZN8Nsf_FileD1Ev:qi,__ZN8Kss_FileD0Ev:n8,__ZN9Nsfe_Info16disable_playlistEb:qt,_gme_type_multitrack:fA,__ZN11Classic_Emu10set_bufferEP12Multi_Buffer:dQ,__ZNK8Rom_DataILi4096EE9mask_addrEl:oy,__ZN8Gme_File11copy_field_EPcPKci:gm,__ZN14Dual_ResamplerD0Ev:eh,_gme_set_stereo_depth:fG,__ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC1Ev:gH,__ZN8Gbs_FileC2Ev:lz,__ZNK11Blip_Buffer18resampled_durationEi:kM,__ZN12Multi_BufferC2Ei:g$,_malloc_max_footprint:vv,__ZL16gym_track_lengthPKhS0_:lD,__ZN9Music_Emu6unloadEv:hJ,__ZN10Blip_SynthILi8ELi1EEC2Ev:jw,__ZN14Dual_Resampler5setupEddd:lL,__ZN14Effects_Buffer12read_samplesEPsl:e$,__ZL12new_sap_filev:rT,__ZNK12Vgm_Emu_Impl12to_blip_timeEi:t$,__ZN14Effects_Buffer9bass_freqEi:eT,__ZN6Ay_Cpu11adjust_timeEi:j1,__ZN8Gme_File6unloadEv:f0,__ZN10Ym2612_Emu6write0Eii:iQ,__ZNK8Gme_File4typeEv:fi,__ZN13Nes_Namco_Apu5resetEv:oK,__ZN8Gym_FileC2Ev:l8,__ZL12new_vgm_filev:tW,__ZN7Hes_Cpu9end_frameEl:m0,__ZN15Std_File_ReaderC2Ev:dJ,__ZL3minll680:sC,__ZN8Gme_File4loadER11Data_Reader:gl,__ZNK12Nes_Vrc6_Apu8Vrc6_Osc6periodEv:pp,__ZN12M3u_PlaylistD2Ev:gR,__ZN8Rom_DataILi8192EED1Ev:mv,__ZN11Data_Reader4readEPvl:du,__ZN7Sap_Cpu3runEl:rn,__ZL11get_gd3_strPKhS0_Pc:t3,__ZN7Sap_Emu10set_tempo_Ed:rq,__ZN12Multi_Buffer15set_sample_rateEli:cC,__ZN7Kss_Cpu3runEl:nf,__ZN6Ym_EmuI10Ym2413_EmuE11begin_frameEPs:uw,__ZN16Remaining_Reader10read_availEPvl:dB,__ZN7Scc_Apu9treble_eqERK9blip_eq_t:ns,__ZN11Classic_Emu14set_equalizer_ERK15gme_equalizer_t:cL,__ZN7Nes_Apu14write_registerElji:oi,__ZNK9Music_Emu11sample_rateEv:hv,__ZN10Sms_SquareC2Ev:jx,__ZN7Nes_DmcC2Ev:ot,__ZN10SPC_Filter6enableEb:sI,_mallinfo:vD,__ZN12M3u_PlaylistC2Ev:gS,__ZNK14Fir_Resampler_12input_neededEl:fb,__ZdaPv:vS,__ZN14Effects_Buffer17mix_mono_enhancedEPsl:e2,__ZL11new_hes_emuv:m1,__ZN15Callback_ReaderD1Ev:d8,__ZN9Music_Emu14set_equalizer_ERK15gme_equalizer_t:cz,__GLOBAL__I_a541:qo,__ZN7Scc_Apu5writeEiii:nM,__ZN9blip_eq_tC1Edlll:lK,__ZN11Blip_Buffer12set_modifiedEv:iv,__ZN15Std_File_ReaderD0Ev:dK,__Z12zero_apu_oscI9Nes_NoiseEvPT_l:op,__ZNK6Ym_EmuI10Ym2413_EmuE7enabledEv:tu,__ZN13Fir_ResamplerILi24EED1Ev:sO,__ZN7Gbs_Emu10set_tempo_Ed:lc,__ZN8Spc_FileC1Ev:tb,__ZN12Nes_Fme7_Apu6volumeEd:pQ,__ZNK6Ay_Cpu4timeEv:j0,__ZN14Effects_Buffer8config_tC2Ev:ez,__ZN6Ym_EmuI10Ym2612_EmuEC2Ev:ub,__ZN8Rom_DataILi16384EE8set_addrEl:li,__ZNK9Music_Emu13current_trackEv:hY,__ZN10__cxxabiv119__pointer_type_infoD0Ev:u2,__ZN15Mem_File_Reader10read_availEPvl:dF,__ZN11Ym2612_Impl3runEiPs:iT,__ZN8Gme_File8pre_loadEv:gi,__ZN12Nes_Fme7_Apu10osc_outputEiP11Blip_Buffer:p$,__ZL12to_uppercasePKciPc:fg,_malloc_stats:vE,__ZN8Rom_DataILi16384EED1Ev:k_,__ZdlPvRKSt9nothrow_t:vR,__ZN6Ay_EmuD2Ev:jL,__ZNK12M3u_PlaylistixEi:gq,__ZL10parse_timePcPiS0_:g8,__ZN11Blip_Buffer15set_sample_rateEli:cu,__ZN6Ay_Cpu12set_end_timeEl:jC,__ZL3minll368:mP,__ZN7Sap_Emu9call_initEi:rK,__ZL11new_kss_emuv:n5,__ZN9blip_eq_tC1Ed:cG,__ZNK8Hes_File11track_info_EP12track_info_ti:m7,__ZN11Ym2612_Impl11CHANNEL_SETEii:iI,__ZNK13blargg_vectorIcE3endEv:gB,__ZN10__cxxabiv116__enum_type_infoD0Ev:uZ,_gme_identify_extension:ff,__ZN11gme_info_t_nwEj:fD,__ZN7Sms_Apu5resetEji:jh,__ZN11Blip_Buffer9end_frameEi:cw,__ZN7Sap_Apu10osc_outputEiP11Blip_Buffer:rf,__ZN13blargg_vectorIN12M3u_Playlist7entry_tEE6resizeEj:g0,__ZN7Sms_Apu9run_untilEi:jq,__ZN7Kss_EmuD2Ev:nw,__ZN13Stereo_Buffer9end_frameEi:hm,__ZN14Dual_ResamplerC2Ev:eo,__ZL3minii716:tZ,__ZN6Ay_Emu12start_track_Ei:jU,__ZN13Silent_Buffer5clearEv:cU,__ZN10Blip_SynthILi8ELi1EEC1Ev:jv,__ZNK11Blip_Buffer6lengthEv:eN,__ZN7Kss_Emu5load_ER11Data_Reader:np,__ZNK8Nsfe_Emu11track_info_EP12track_info_ti:qP,__ZN6Ay_Cpu8set_timeEl:j$,__ZL3minll:hW,__ZN7Hes_Emu8cpu_doneEv:mY,__ZN9Music_Emu8fill_bufEv:h6,__ZN13Nes_Namco_Apu9treble_eqERK9blip_eq_t:pW,__ZN8Rom_DataILi16384EE7at_addrEl:k9,__ZN7Spc_Dsp5extraEv:rX,__ZN8Sap_FileD1Ev:rR,__ZN8Hes_FileC1Ev:m_,_gme_enable_accuracy:fV,__ZN7Hes_Apu9treble_eqERK9blip_eq_t:mH,__ZNK13blargg_vectorIsE3endEv:ey,__ZN7Gym_Emu9load_mem_EPKhl:lP,__ZN12Nes_Triangle3runEll:o8,__ZN10Nes_SquareC1EPK10Blip_SynthILi12ELi1EE:nY,__ZdlPv:vQ,__ZN6Gb_Cpu8get_codeEj:ku,__ZN7Kss_Emu8set_bankEii:nH,_strtod_l:v9,__ZNK8Sap_File11track_info_EP12track_info_ti:rZ,_gme_ignore_silence:fR,__Z13kss_cpu_writeP7Kss_Cpuji:nJ,__ZN9Music_Emu12start_track_Ei:cR,__ZN7Kss_Cpu5writeEj:nC,__ZN11Mono_Buffer5clearEv:hA,__ZNK13blargg_vectorIcE5beginEv:gC,__ZN11Blip_BufferC2Ev:ct,__ZN7Gbs_EmuC2Ev:ld,__ZN9Nsfe_FileC2Ev:q3,__ZN8Rom_DataILi16384EE8unmappedEv:lj,__ZN7Kss_Emu9cpu_writeEji:nI,__ZN7Nsf_Emu8cpu_readEj:oB,__ZN8Snes_Spc15reset_time_regsEv:r6,__ZN7Ay_FileC2Ev:ke,_malloc_footprint:vu,__ZNK10Blip_SynthILi12ELi1EE16offset_resampledEjiP11Blip_Buffer:iG,__ZN7Sms_ApuC2Ev:jd,__ZN7Spc_Emu10set_tempo_Ed:s3,__ZN8Nsfe_Emu6unloadEv:qN,__ZL10next_fieldPcPi:ha,__ZN7Hes_Emu8cpu_readEj:me,__ZN12Nes_Vrc6_Apu9write_oscEiiii:pH,__ZN7Vgm_EmuD0Ev:tK,__ZN12Vgm_Emu_ImplD0Ev:ux,__ZN13blargg_vectorIcED1Ev:gD,__ZN8Gme_File8set_typeEPK11gme_type_t_:jF,_free:vk,__ZN7Hes_EmuD2Ev:mO,__ZN12M3u_Playlist4loadEPKc:gU,__ZNK8Gme_File10track_infoEP12track_info_ti:gr,__ZNK8Vgm_File11track_info_EP12track_info_ti:t1,__ZN11Data_ReaderD2Ev:dk,__ZN16Remaining_ReaderD0Ev:d5,__ZN7Gym_Emu12start_track_Ei:lR,__ZN7Sap_Cpu15update_end_timeEll:ro,__ZL16check_gd3_headerPKhl:tz,_gme_load_m3u_data:gV,__ZN11Blip_Synth_11volume_unitEd:cM,__ZN7Spc_Dsp5resetEv:sK,__warnx:v3,__ZNK8Rom_DataILi8192EE9file_sizeEv:mp,__ZNK10__cxxabiv116__enum_type_info9can_catchEPKNS_16__shim_type_infoERPv:uL,__ZN9Music_Emu16enable_accuracy_Eb:dl,_independent_calloc:vq,__ZNK7Kss_Emu11track_info_EP12track_info_ti:nl,__ZN6Ym_EmuI10Ym2413_EmuE9run_untilEi:un,__ZN14Fir_Resampler_D2Ev:e4,__ZN9Music_Emu15set_voice_countEi:jI,__ZN6Ay_Emu9set_voiceEiP11Blip_BufferS1_S1_:jS,__Z9pin_rangeiii:eL,__ZN10Ym2413_Emu5resetEv:uh,_gme_warning:fo,__ZN10Blip_SynthILi12ELi15EEC2Ev:o$,__vwarn:v4,__ZN7Nes_Apu6outputEP11Blip_Buffer:n0,__ZN7Vgm_Emu9load_mem_EPKhl:tN,__ZNK7Sap_Emu11play_periodEv:rF,__ZN8Gbs_FileD1Ev:lm,__ZN11Ym2612_Impl6KEY_ONER9channel_ti:iA,__ZN10Blip_SynthILi8ELi1EE6outputEP11Blip_Buffer:ts,__ZN7Nes_Cpu8set_timeEl:p4,_gme_set_user_cleanup:fJ,__ZN11Blip_Reader4nextEi:ev,__ZN7Nsf_Emu8pcm_readEPvj:pw,__ZN8Gme_File9load_fileEPKc:gu,__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib:ve,__ZNK7Gym_Emu12track_lengthEv:lI,__ZN11Ym2612_Impl6write0Eii:iV,__ZN7Gb_Wave14write_registerEii:kR,__ZN7Hes_Emu10set_tempo_Ed:mJ,__ZL16update_envelope_P6slot_t:i6,__ZN7Gbs_Emu9cpu_writeEji:ky,__ZN11Mono_BufferD0Ev:hn,__ZN8Nsf_FileC2Ev:qw,__ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi:uM,__ZN13Nes_Namco_Apu10write_dataEii:p8,__ZNK14Fir_Resampler_6avail_El:e7,__ZN13blargg_vectorIN12M3u_Playlist7entry_tEE5clearEv:gJ,__ZN12M3u_Playlist5parseEv:g2,__ZN13Nes_Namco_Apu9end_frameEi:oU,__ZN11Mono_Buffer10clock_rateEl:hy,__ZNK8Rom_DataILi4096EE4sizeEv:oz,_getopt_internal:vX,__ZN8Gme_File9load_mem_EPKhl:gt,__ZN10Ym2612_Emu8set_rateEdd:iN,__ZNK7Nsf_Emu11track_info_EP12track_info_ti:pE,__ZN12Vgm_Emu_Impl10play_frameEiiPs:uu,__ZN14Fir_Resampler_10skip_inputEl:fc,__ZL11parse_trackPcRN12M3u_Playlist7entry_tEPi:g6,_gme_open_file:ft,__ZN7Sap_Emu11run_routineEj:rB,__ZN14Fir_Resampler_10time_ratioEddd:e9,__ZThn336_N7Vgm_EmuD1Ev:tx,__ZN9Nsfe_FileD1Ev:qX,__ZNK10__cxxabiv116__shim_type_info5noop1Ev:uD,__ZNK13blargg_vectorIN12M3u_Playlist7entry_tEEixEj:gw,__ZN12Sap_Apu_Impl6volumeEd:ry,__ZN9Nes_NoiseC2Ev:ov,__ZN7Hes_EmuC2Ev:mM,__ZThn320_N7Gym_EmuD0Ev:lw,__ZNK7Kss_Emu9bank_sizeEv:nA,__ZN6Ay_CpuC2Ev:jt,__ZN8Hes_FileD2Ev:m8,__ZNK10Blip_SynthILi8ELi1EE6offsetEiiP11Blip_Buffer:jb,__ZN7Gb_Wave3runEiii:kQ,__ZN8Gme_File8load_memEPKvl:gk,__ZNK7Ay_File11track_info_EP12track_info_ti:kj,__ZNKSt20bad_array_new_length4whatEv:vM,__ZN13blargg_vectorIcEC2Ev:gx,__ZN7Sap_Apu9run_untilEi:rc,__ZN7Sap_EmuD2Ev:rt,__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib:va,__ZN8Snes_Spc10clear_echoEv:sb,__ZN8Nsf_File5load_ER11Data_Reader:qj,__ZNK9Music_Emu11track_endedEv:fy,__ZN7Spc_Emu16enable_accuracy_Eb:sU,__ZN7Hes_Cpu7set_mmrEii:mk,__ZNK14Fir_Resampler_7writtenEv:en,__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi:u5,__ZNSt9type_infoD2Ev:uy,__ZN13Nes_Namco_ApunwEj:pM,__ZL11parse_time_PcPi:g9,__ZN7Sap_Emu12start_track_Ei:rJ,__ZN7Nsf_Emu5load_ER11Data_Reader:pR,__ZN10Nes_Square3runEll:o2,__ZNK9Nsfe_Info11track_info_EP12track_info_ti:qM,__ZN13Stereo_Buffer20mix_stereo_no_centerEPsl:ht,__ZN10SPC_Filter8set_gainEi:s1,__ZL3maxll:sD,__ZN7Sap_Emu8cpu_readEj:ri,__ZN7Nes_Apu18nonlinear_tnd_gainEv:nO,_posix_memalign:vp,__ZN10Blip_SynthILi8ELi1EE6volumeEd:ji,__ZL15copy_sap_fieldsRKN7Sap_Emu6info_tEP12track_info_t:rv,__ZN9Gb_Square5resetEv:kN,__ZN12Nes_Vrc6_Apu6volumeEd:pk,__ZN8Vgm_FileD2Ev:ud,__ZN8Snes_Spc11regs_loadedEv:r5,__ZN8Nsfe_EmuD0Ev:q$,__ZN9Gme_Info_D0Ev:it,__ZN10__cxxabiv117__pbase_type_infoD0Ev:u1,__ZN8Gym_FileC1Ev:l$,__ZN13blargg_vectorIhED2Ev:gs,__ZN7Sms_Apu6outputEP11Blip_Buffer:lO,__ZN11gme_info_t_dlEPv:fF,__ZN8Rom_DataILi8192EEC1Ev:mu,__ZN8Gym_FileD2Ev:l3,_ialloc:vA,__ZN8Nsfe_Emu12start_track_Ei:qT,__ZL11new_sap_emuv:rS,__ZN6Ay_Apu5resetEv:ir,__ZL15copy_kss_fieldsRKN7Kss_Emu8header_tEP12track_info_t:nm,__ZN8Gme_File11set_warningEPKc:gA,__ZN9Nsfe_FileC1Ev:qW,__ZN14Effects_Buffer10clock_rateEl:eS,__ZN14Effects_Buffer15set_sample_rateEli:eR,__ZN9Nsfe_Info6unloadEv:qO,__ZN13blargg_vectorIcE5clearEv:gK,__ZL8gen_polymiPh:q5,__ZNK10Blip_SynthILi12ELi1EE13offset_inlineEiiP11Blip_Buffer:i9,__ZN11Blip_Buffer11mix_samplesEPKsl:cN,__ZN8Kss_FileC1Ev:nQ,__ZN9Music_Emu4seekEl:h1,__ZN11Blip_Buffer14remove_silenceEl:cx,__ZN6Ay_Emu10set_tempo_Ed:jT,__ZNK10__cxxabiv120__function_type_info9can_catchEPKNS_16__shim_type_infoERPv:uG,__ZN11Blip_Buffer12read_samplesEPsli:cH,__Z9ay_cpu_inP6Ay_Cpuj:jX,__ZN13Nes_Namco_Apu9run_untilEi:oR,__ZN8Snes_Spc11mute_voicesEi:sW,__ZNSt10bad_typeidD0Ev:uT,__ZNK7Nes_Cpu4timeEv:ox,_gme_mute_voices:fU,__ZN10__cxxabiv121__vmi_class_type_infoD0Ev:u0,__ZNK13blargg_vectorIA4_cE4sizeEv:qG,__ZN7Kss_Cpu7map_memEjmPvPKv:ne,__ZNK14Fir_Resampler_9max_writeEv:s9,__ZN13Subset_ReaderD2Ev:ed,__ZN8Rom_DataILi4096EE7at_addrEl:oE,__ZN8Gme_File7warningEv:fj,__ZN12Vgm_Emu_ImplC2Ev:tI,__ZN11Mono_Buffer12read_samplesEPsl:hC,__ZN18Silent_Blip_BufferC2Ev:cm,__ZN8Spc_File5load_ER11Data_Reader:ti,__ZNK13blargg_vectorIhE4sizeEv:gc,__ZNK10Blip_SynthILi8ELi1EE16offset_resampledEjiP11Blip_Buffer:jA,__ZN6Ay_Apu10osc_outputEiP11Blip_Buffer:iH,__ZNK11Blip_Buffer11sample_rateEv:eM,__ZN7Nsf_Emu10init_soundEv:p_,_gme_clear_playlist:fX,__ZN6Ym_EmuI10Ym2612_EmuED2Ev:t6,__ZN8Rom_DataILi8192EE8set_addrEl:mE,__ZNK7Kss_Cpu4timeEv:nB,__ZN7Vgm_Emu10run_clocksERii:tR,__ZN10Blip_SynthILi12ELi1EE9treble_eqERK9blip_eq_t:jk,__ZN8Gme_FileD0Ev:f9,__ZNK8Rom_DataILi16384EE4sizeEv:kV,__ZN13Stereo_Buffer15set_sample_rateEli:hi,__ZN7Sap_Emu9update_eqERK9blip_eq_t:rz,__ZN7Nsf_Emu6unloadEv:pz,__ZN7Sms_Apu10write_dataEii:jz,__ZN7Spc_Dsp4loadEPKh:sM,__ZN11Blip_Reader3endER11Blip_Buffer:ew,__ZL8gen_sincdidddiPs:fa,__ZN16Blip_Synth_Fast_11volume_unitEd:cj,__ZN12Nes_Fme7_ApunwEj:pO,_gme_open_data:fq,__ZN7Gbs_Emu10run_clocksERii:lk,__ZNK13blargg_vectorIsEixEj:eH,__ZN12M3u_Playlist6parse_Ev:gP,__ZNSt9bad_allocD0Ev:vU,__Z8get_be16PKv:jZ,__ZN10Nes_SquareC2EPK10Blip_SynthILi12ELi1EE:oo,__ZN8Nsf_FileD0Ev:qx,__ZNK8Snes_Spc12sample_countEv:sf,__ZL12new_spc_filev:te,__ZNK7Nes_Apu18next_dmc_read_timeEv:of,__ZL8gen_sincPfiddd:cs,__ZL3minii:jY,__ZNK11Classic_Emu10clock_rateEv:jK,__ZN6Ym_EmuI10Ym2612_EmuE6enableEb:tL,__ZNK7Nes_Dmc11count_readsElPl:pb,__ZN13Silent_BufferD1Ev:dc,__ZN13Silent_Buffer12read_samplesEPsl:cW,__ZN8Sap_File9load_mem_EPKhl:rY,__ZNK13blargg_vectorIPKcE4sizeEv:qE,__ZL12get_spc_xid6PKhlP12track_info_t:tk,__ZN9Music_Emu8emu_playElPs:h5,__ZNK7Spc_Emu12trailer_sizeEv:sQ,__ZN11Mono_BufferD2Ev:ho,_gme_tell:fO,__ZN8Nsfe_EmuC2Ev:q_,__ZN7Hes_CpuC2Ev:mo,__ZN11Classic_Emu17change_clock_rateEl:c4,__ZN11Mono_Buffer7channelEii:hx,__ZNK12Vgm_Emu_Impl10to_fm_timeEi:ul,__ZN9Music_Emu13set_equalizerERK15gme_equalizer_t:hK,__ZN8Snes_Spc11CPU_mem_bitEPKhi:sz,__ZN18ym2612_update_chanILi4EE4funcER8tables_tR9channel_tPsi:i$,__ZNK10__cxxabiv117__array_type_info9can_catchEPKNS_16__shim_type_infoERPv:uF,__ZN8Snes_Spc4initEv:r$,__ZN12Nes_Vrc6_ApudlEPv:pA,__ZN12Nes_Triangle14maintain_phaseElll:o5,__ZN13Stereo_Buffer8mix_monoEPsl:hf,___cxx_global_var_init:hG,__ZN7Spc_EmuD2Ev:s0,__ZN7Gym_EmuD0Ev:lC,__ZN10__cxxabiv120__function_type_infoD0Ev:uY,_gme_voice_count:fQ,__ZN6Gb_Cpu8map_codeEjjPv:kD,__ZN7Sms_Apu6outputEP11Blip_BufferS1_S1_:jm,__ZN7Nes_Apu11read_statusEl:or,__ZNK7Gbs_Emu5clockEv:kx,__ZN15Std_File_Reader5closeEv:dL,__ZN11Blip_Buffer14clear_modifiedEv:eQ,__Z11command_leni:uk,__ZN7Hes_Cpu12set_end_timeEl:mr,__ZN9Gme_Info_16enable_accuracy_Eb:ig,__ZN12Nes_Envelope5resetEv:os,__ZNK7Nes_Dmc14next_read_timeEv:om,_getopt_long:vY,__ZNK7Sap_Cpu4timeEv:rG,__ZN13Silent_BufferC2Ev:hd,__ZN7Gbs_Emu5load_ER11Data_Reader:k3,_memmove:wi,__ZN7Sms_Osc5resetEv:i3,__ZN7Nes_Apu10osc_outputEiP11Blip_Buffer:n9,__ZN8Rom_DataILi8192EED2Ev:na,__ZN10__cxxabiv120__si_class_type_infoD0Ev:u$,__ZN12M3u_Playlist4loadER11Data_Reader:gN,__ZNK13blargg_vectorIcE4sizeEv:gZ,__ZNK13blargg_vectorIcEixEj:re,__ZN7Hes_Cpu3runEl:ml,__ZN12Nes_Triangle20clock_linear_counterEv:o4,__ZN12Vgm_Emu_ImplD1Ev:ur,__ZNK6Gb_Osc9frequencyEv:kL,__ZN7Sms_OscC2Ev:i2,__ZN8Snes_Spc10run_timer_EPNS_5TimerEi:sh,_strlen:wj,__ZN10Ym2612_Emu3runEiPs:iU,__ZN10Ym2612_EmuC2Ev:lV,__ZN11Data_ReaderC2Ev:dm,__ZL12new_gbs_filev:ly,__ZN7Sap_Apu10write_dataEiji:rj,__ZN6Ay_EmuD0Ev:jW,__ZN11Classic_Emu5play_ElPs:dg,__ZNK11Mono_Buffer13samples_availEv:hD,__ZN16Remaining_ReaderC2EPKvlP11Data_Reader:dy,__ZN11Ym2612_Impl5resetEv:iK,__ZNK9Music_Emu11voice_namesEv:fB,__ZN8Gme_File5load_ER11Data_Reader:gh,__ZN7Gbs_Emu6unloadEv:k$,__ZNK11Blip_Synth_13impulses_sizeEv:cA,_gme_identify_header:fe,__ZN8Gme_File13set_user_dataEPv:fw,__ZN7Sap_Emu9load_mem_EPKhl:rw,__ZN8Snes_Spc9dsp_writeEii:ss,__ZN12Multi_Buffer17set_channel_countEi:gW,__ZN7Spc_Dsp3runEi:sB,__ZL12new_kss_filev:n6,_strncpy:wl,__ZN8Gbs_FileC1Ev:ll,__ZN9Music_EmuD2Ev:hQ,__ZN9Nsfe_InfoC2Ev:qy,__ZN7Nes_Apu5resetEbi:n2,__ZN12Multi_Buffer22channels_changed_countEv:c_,__ZNK12Nes_Triangle8calc_ampEv:o6,__ZN7Sms_Apu9end_frameEi:jr,__ZN7Vgm_Emu16set_sample_rate_El:tE,_gme_type_system:f6,__ZN8Rom_DataILi16384EEC1Ev:kZ,__ZN7Gym_Emu10play_frameEiiPs:lY,__ZN12Nes_Fme7_Apu9end_frameEi:qf,__ZN12M3u_PlaylistD1Ev:f4,__ZN11Mono_Buffer9bass_freqEi:hz,__ZNK13blargg_vectorIsE4sizeEv:dU,__ZN6Ay_Emu9update_eqERK9blip_eq_t:jQ,__ZL9read_strsR11Data_ReaderlR13blargg_vectorIcERS1_IPKcE:qJ,__ZN14Effects_BufferD0Ev:eJ,__ZN13Silent_Buffer10clock_rateEl:cS,__ZN7Scc_ApuC1Ev:nj,__ZN14Effects_BufferD2Ev:eZ,__ZN12Nes_Fme7_Apu6outputEP11Blip_Buffer:qe,__ZN8Hes_FileD1Ev:m$,__ZThn320_N7Gym_Emu10play_frameEiiPs:lZ,__ZN7Sap_Emu7cpu_jsrEj:rr,__ZN8Snes_Spc10run_until_Ei:sy,__ZN8Gme_File15clear_playlist_Ev:cY,__ZL10new_ay_emuv:kc,__ZN7Vgm_Emu10set_tempo_Ed:tD,_parse_long_options:v1,__ZL16check_kss_headerPKv:nq,__ZNK11Blip_Buffer13count_samplesEi:cp,__ZN13blargg_vectorIsEC1Ev:ee,__ZN7Nsf_Emu14cpu_write_miscEji:p7,__ZN12Nes_Fme7_ApudlEPv:pC,__ZN7Ay_FileD0Ev:kf,__ZN12Nes_TriangleC2Ev:ou,__ZNK15Callback_Reader6remainEv:ds,__ZN7Nes_Dmc14write_registerEii:pc,__ZThn336_N12Vgm_Emu_ImplD1Ev:us,__ZN12M3u_Playlist5clearEv:f$,__ZN6Gb_Apu13read_registerEij:kC,__ZN6Gb_ApuC2Ev:kl,__ZN7Vgm_Emu12mute_voices_Ei:tH,__ZN12Vgm_Emu_Impl9write_pcmEii:uc,__ZL16check_spc_headerPKv:s2,__ZN7Nsf_EmuC2Ev:pJ,_gme_user_data:fH,__ZN12Nes_Fme7_Apu9treble_eqERK9blip_eq_t:pY,__ZN7Sap_CpuC2Ev:rp,__ZN8Spc_FileC2Ev:tf,__ZN9Gme_Info_10post_load_Ev:ii,__ZN6Ay_Apu9run_untilEi:iy,_memalign:vn,__ZN13Fir_ResamplerILi12EED2Ev:eF,__ZNK11Blip_Buffer14resampled_timeEi:ch,__ZN7Hes_Emu6unloadEv:mw,_gme_type:fn,__ZN7Vgm_Emu12start_track_Ei:tQ,__ZThn320_N7Gym_EmuD1Ev:lF,_bulk_free:vB,__Z9run_poly5mi:rg,__ZN9Music_Emu11start_trackEi:hM,__ZN7Kss_Emu11update_gainEv:nn,__warn:v2,__ZN8Snes_Spc18cpu_write_smp_reg_Eiii:sm,__ZN10__cxxabiv116__shim_type_infoD0Ev:uU,__ZN8Gym_FileD1Ev:l0,__ZN13Stereo_Buffer7channelEii:hE,__ZN9Music_Emu8pre_loadEv:hS,__ZN8Snes_Spc10enable_romEi:sj,___dynamic_cast:u9,__ZN12M3u_Playlist4loadEPKvl:g4,__ZN8Snes_Spc9load_regsEPKh:r3,__ZN8Nsfe_EmuD2Ev:q0,__ZL11new_ay_filev:kd,__ZN8Rom_DataILi4096EEC2Ev:qn,__ZN7Nes_Apu9set_tempoEd:oa,__Z24blargg_verify_byte_orderv:f8,__ZN6Gb_Apu9run_untilEi:kA,__ZN8Spc_FileD0Ev:tg,__ZN7Sms_Apu9treble_eqERK9blip_eq_t:jj,__ZN6Gb_Apu9end_frameEi:kB,__ZN8Nsf_FileD2Ev:ql,__ZL16check_vgm_headerRKN7Vgm_Emu8header_tE:tO,__ZN8Snes_Spc9end_frameEi:sx,_gme_set_equalizer:fY,__ZNK7Gbs_Emu11track_info_EP12track_info_ti:k1,__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi:uN,__ZN9Music_Emu16clear_track_varsEv:hI,__ZNK7Spc_Emu7trailerEv:sP,__ZN7Hes_Apu9end_frameEi:mg,__ZN7Gbs_Emu12start_track_Ei:lh,__ZThn336_N7Vgm_EmuD0Ev:tv,__ZN6Gb_CpuC2Ev:kS,__ZNK7Hes_Cpu4timeEv:mS,__ZN13blargg_vectorIPKcED2Ev:qV,__ZN10Ym2413_Emu8set_rateEdd:ug,__verr:we,__ZN7Spc_Emu16set_sample_rate_El:sT,_gme_mute_voice:fT,__ZN8Vgm_FileC2Ev:tX,__ZN7Hes_Emu13cpu_write_vdpEii:mL,__ZN7Sap_Cpu8set_timeEl:rH,__ZN8Snes_Spc10soft_resetEv:r9,__ZN6Ym_EmuI10Ym2612_EmuE9run_untilEi:uo,__ZN15Mem_File_Reader4seekEl:dr,__ZN11Classic_EmuC2Ev:cJ,__ZN7Vgm_Emu5play_ElPs:tS,__ZN7Hes_Emu9update_eqERK9blip_eq_t:mG,__ZN12Nes_Fme7_ApuC1Ev:pP,__ZNK7Spc_Emu6headerEv:sH,__ZN8Gme_File10post_load_Ev:gb,__ZN8Rom_DataILi8192EE8unmappedEv:mt,__ZN8Snes_Spc13timers_loadedEv:r2,__ZL12new_nsfe_emuv:q1,__ZN11Blip_Buffer10clock_rateEl:co,__ZN7Spc_Dsp10set_outputEPsi:sA,__Z12zero_apu_oscI12Nes_TriangleEvPT_l:oh,__ZN7Nsf_Emu9cpu_writeEji:oD,__ZN9Gme_Info_C2Ev:j8,__ZN13blargg_vectorIcED2Ev:gG,__ZN8Rom_DataILi8192EE7at_addrEl:ms,__ZN13Nes_Namco_ApuC2Ev:oN,__ZN9Music_Emu14make_equalizerEdd:hH,__ZNK13blargg_vectorIsE5beginEv:es,__ZN6Ay_Apu11write_data_Eii:iu,__ZN7Hes_Apu10write_dataEiii:md,__ZL12new_gym_filev:l7,__ZL10copy_fieldPKhPc:m9,__ZNK10Blip_SynthILi8ELi1EE13offset_inlineEiiP11Blip_Buffer:jc,__ZN7Gym_Emu11parse_frameEv:lX,__ZN7Ay_FileD2Ev:kk,__ZSt17__throw_bad_allocv:v0,__ZNKSt9bad_alloc4whatEv:vL,_malloc:vi,__ZN7Spc_Dsp4initEPv:sY,__ZN9Gme_Info_10set_tempo_Ed:ib,__ZNK15Mem_File_Reader4sizeEv:dp,__ZL12get_gd3_pairPKhS0_Pc:t2,__ZN7Scc_Apu5resetEv:nG,__ZN12Nes_Vrc6_Apu5resetEv:pf,__ZN7Nes_Apu9end_frameEl:ol,__ZN10Ym2413_EmuD2Ev:uf,__ZN7Sap_ApuC2Ev:ra,__ZNK7Vgm_Emu11track_info_EP12track_info_ti:tA,_independent_comalloc:vz,__ZN12Multi_BufferD2Ev:dj,__ZN7Sap_Cpu5resetEPv:rm,__ZN9Music_Emu15set_track_endedEv:lT,__Znaj:v_,__ZN7Ay_FileC1Ev:j7,__Z11kss_cpu_outP7Kss_Cpulji:nK,__ZN7Gym_Emu10set_tempo_Ed:lM,__ZNK12M3u_Playlist4sizeEv:gp,__ZN7Nes_Osc5resetEv:on,__ZNSt20bad_array_new_lengthD0Ev:vV,__ZN8Rom_DataILi4096EEC1Ev:px,__ZN10SPC_FilterC2Ev:tn,__ZN7Hes_Emu12start_track_Ei:mK,__ZN9Gme_Info_D1Ev:ij,__ZNK12M3u_Playlist4infoEv:ge,__ZN7Hes_Emu11cpu_set_mmrEii:mj,__ZN13blargg_vectorIA4_cE6resizeEj:qL,__ZN7Spc_EmuC2Ev:s_,__ZNSt8bad_castD0Ev:uS,__ZL3minii539:p0,__verrx:wf,__ZN9Nsfe_FileD0Ev:q4,__ZL9parse_intPcPiS0_:hb,__ZL15copy_nsf_fieldsRKN7Nsf_Emu8header_tEP12track_info_t:pF,__ZN14Fir_Resampler_5writeEl:er,__ZN12Nes_Vrc6_Apu10run_squareERNS_8Vrc6_OscEi:pl,__ZN7Nes_Osc12clock_lengthEi:oV,__ZN9Music_EmuD0Ev:hP,__ZN9Music_Emu8set_gainEd:le,__ZN6Ym_EmuI10Ym2413_EmuE6enableEb:tM,__ZN8Rom_DataILi16384EE4loadER11Data_ReaderiPvi:k4,__ZNSt9bad_allocC2Ev:vO,__ZNK16Remaining_Reader6remainEv:dz,__ZN9Nsfe_File5load_ER11Data_Reader:q6,__ZN7Ay_File9load_mem_EPKhl:ki,__ZN6Gb_Apu14write_registerEiji:kt,__ZN13blargg_vectorIcE6resizeEj:g3,__ZN7Hes_Cpu8get_codeEj:mc,__ZN6Gb_Osc5resetEv:kG,__ZN9Sms_Noise3runEii:ja,__ZN6Ay_Cpu5resetEPv:jy,__ZN13Fir_ResamplerILi24EEC2Ev:ta,__ZN11Ym2612_Impl9run_timerEi:iS,__ZN13blargg_vectorIA4_cEC1Ev:qq,__ZN12Nes_Envelope14clock_envelopeEv:oW,__ZN11Ym2612_Impl6write1Eii:iW,__ZL12skip_gd3_strPKhS0_:t_,__ZN9Gme_Info_16set_sample_rate_El:h8,__ZN11Ym2612_Impl8SLOT_SETEii:iF,__ZN13Nes_Namco_Apu10write_addrEi:p2,___cxx_global_var_init535:pu,_mallopt:vF,__ZN10Ym2413_EmuC2Ev:ue,__ZN6Ym_EmuI10Ym2413_EmuED2Ev:t7,__ZN8Sap_FileC2Ev:rU,__ZN8Snes_Spc9cpu_writeEiii:st,__ZN15Mem_File_ReaderD2Ev:eb,__ZN10SPC_Filter5clearEv:tm,__ZN7Hes_Emu9cpu_writeEji:mh,__ZN8Hes_FileC2Ev:m3,__ZN7Nes_Apu9run_untilEl:oj,__ZN7Vgm_Emu8setup_fmEv:tP,__ZN11Ym2612_Impl8set_rateEdd:iL,__ZN6Ay_Apu6outputEP11Blip_Buffer:ip,_memcmp:wk,__ZN7Nsf_Emu10run_clocksERii:qb,__ZN9Music_Emu10set_bufferEP12Multi_Buffer:ie,__ZN13Silent_BufferD2Ev:dt,__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv:u4,__ZN8Rom_DataILi4096EED1Ev:py,__ZN9Music_Emu12mute_voices_Ei:cQ,__ZN8Snes_Spc16cpu_read_smp_regEii:su,__ZN7Hes_Apu5resetEv:l5,__ZN7Gbs_Emu8set_bankEi:k8,__ZN7Sap_EmuC2Ev:rC,__ZN7Nes_CpuC2Ev:pq,__ZN7Nes_ApuC2Ev:nX,__ZN7Spc_Emu5skip_El:s6,__ZN10Blip_SynthILi12ELi15EEC1Ev:oO,__ZL11new_gym_emuv:l6,__ZNKSt8bad_cast4whatEv:uA,_malloc_footprint_limit:vw,__ZN7Vgm_EmuC2Ev:tq,__ZN10Blip_SynthILi12ELi15EE9treble_eqERK9blip_eq_t:qc,__ZN8Vgm_FileD1Ev:tU,_valloc:vs,__ZNK13blargg_vectorIN12M3u_Playlist7entry_tEE4sizeEv:gg,__ZN13Subset_Reader10read_availEPvl:dx,__Z8from_decj:gX,__ZN8Gme_File9post_loadEPKc:gj,__ZN16Remaining_ReaderD1Ev:d4,__ZN12Nes_Fme7_Apu5resetEv:oM,__ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib:vd,__ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv:u8,__ZN7Gbs_Emu8cpu_readEj:kw,__ZN7Nes_Apu10run_until_El:ok,__ZThn336_N12Vgm_Emu_ImplD0Ev:ut,__ZN8Snes_Spc4skipEi:si,__ZN14Dual_ResamplerD2Ev:ep,__ZN13blargg_vectorIsE6resizeEj:ek,__ZN12Multi_BufferdlEPv:c3,__ZNK8Kss_File11track_info_EP12track_info_ti:nT,__ZN7Sap_Emu10cpu_write_Eji:rL,__ZN10__cxxabiv117__class_type_infoD0Ev:u_,__ZN11Blip_Synth_14adjust_impulseEv:cE,__ZN10Ym2612_EmuD2Ev:iO,__ZN6Gb_Cpu13set_code_pageEiPh:kv,__ZN8Rom_DataILi4096EE4loadER11Data_ReaderiPvi:pS,__ZN14Effects_Buffer12mix_enhancedEPsl:e_,__ZSt15set_new_handlerPFvvE:vN,__ZL15copy_gbs_fieldsRKN7Gbs_Emu8header_tEP12track_info_t:k2,__ZN8Snes_Spc9run_timerEPNS_5TimerEi:sn,__ZL8from_decPKhS0_:rI,_malloc_trim:vC,__ZN7Kss_Emu12start_track_Ei:nF,__ZN9Rom_Data_14load_rom_data_ER11Data_ReaderiPvil:c8,__ZN13blargg_vectorIN12M3u_Playlist7entry_tEED2Ev:gF,__ZN6Gb_Apu10osc_outputEiP11Blip_BufferS1_S1_:ks,__ZN7Nes_Cpu8map_codeEjjPKvb:oG,__ZNSt8bad_castC2Ev:uI,__ZN9Music_Emu8set_fadeEll:h3,__ZN8Rom_DataILi8192EEC2Ev:nb,__ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi:u6,__ZN7Nes_Dmc13reload_sampleEv:o7,__ZNK12Nes_Vrc6_Apu10save_stateEP16vrc6_apu_state_t:po,__ZN7Kss_Emu10set_tempo_Ed:ni,__ZL12check_headerPKhlPi:lQ,_gme_track_count:fp,__ZN14Fir_Resampler_6bufferEv:dW,__ZN12M3u_PlaylistC1Ev:f1,__ZL12new_nsf_filev:qv,__ZN12Nes_TriangleC1Ev:n_,__ZNK15Mem_File_Reader4tellEv:dq,__ZN13blargg_vectorIsED1Ev:eg,__ZNK7Spc_Dsp7out_posEv:se,__ZN10Blip_SynthILi8ELi1EE9treble_eqERK9blip_eq_t:jl,__ZNK11Blip_Buffer17clock_rate_factorEl:cv,__ZN8Sap_FileD2Ev:r_,__ZNK8Gme_File11track_countEv:fk,__ZL11new_gbs_emuv:lx,__ZNSt8bad_castD2Ev:uz,__ZNK11Blip_Buffer10clock_rateEv:iw,__ZNK15Std_File_Reader4sizeEv:dO,__ZN13blargg_vectorIA4_cED2Ev:qU,__ZN13blargg_vectorIA4_cE5clearEv:qC,__ZN7Gbs_Emu9set_voiceEiP11Blip_BufferS1_S1_:k7,__ZN8Gbs_FileD0Ev:lA,__ZN18ym2612_update_chanILi2EE4funcER8tables_tR9channel_tPsi:iZ,__ZN9Rom_Data_D2Ev:lr,__ZL12get_gym_infoRKN7Gym_Emu8header_tElP12track_info_t:lH,__ZN7Kss_Cpu8set_timeEl:nD,__ZN18ym2612_update_chanILi7EE4funcER8tables_tR9channel_tPsi:i4,__ZN8Snes_Spc4playEiPs:sp,__ZN8Rom_DataILi16384EED2Ev:lq,__ZN7Kss_CpuC2Ev:m4,__ZN6Gb_Env14clock_envelopeEv:kI,__ZN9Nes_Noise3runEll:ph,__ZN8Nsf_FileC1Ev:qh,__ZL11new_nsf_emuv:qg,__ZN7Gym_Emu16set_sample_rate_El:lJ,__ZN12Nes_Fme7_Apu9run_untilEi:oS,__ZdaPvRKSt9nothrow_t:vT,__ZN12Nes_Vrc6_Apu10osc_outputEiP11Blip_Buffer:pm,__ZL8copy_strPKcPci:qK,__ZN11Classic_Emu12start_track_Ei:c6,__ZN8Snes_Spc10save_extraEv:so,__ZN12Nes_Vrc6_Apu9end_frameEi:pI,__ZN8Snes_Spc8cpu_readEii:sw,_gme_play:fL,__ZN14Dual_Resampler5resetEi:ej,__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib:vh,__ZN7Hes_Emu9cpu_read_Ej:mW,__ZN10Ym2612_Emu11mute_voicesEi:iM,__ZN15Std_File_Reader10read_availEPvl:dP,_gme_load_file:fl,_gme_set_tempo:fS,_pvalloc:vt,__ZN10SPC_Filter3runEPsi:tp,__ZL16check_nsf_headerPKv:pT,__ZN8Nsfe_Emu5load_ER11Data_Reader:qQ,__ZN7Hes_Apu6volumeEd:mF,__ZN9Gme_Info_12mute_voices_Ei:ia,__ZNSt9type_infoD0Ev:uR,__ZL3minll540:p1,__ZN7Sap_Cpu12set_end_timeEl:rs,_gme_start_track:fK,__ZN15Mem_File_ReaderC2EPKvl:dD,__ZL10parse_infoPKhlPN7Sap_Emu6info_tE:rx,__ZN7Gbs_EmuD2Ev:lg,__ZN13Nes_Namco_ApudlEPv:pB,__ZN7Hes_Emu10run_clocksERii:mZ,__ZN7Spc_Emu12start_track_Ei:s4,__ZN10Ym2413_Emu11mute_voicesEi:uj,__ZNK11Blip_Buffer13samples_availEv:cf,__ZN7Kss_Emu6unloadEv:nk,__ZNK12Multi_Buffer11sample_rateEv:eP,__ZN15Callback_Reader10read_availEPvl:dH,__ZN12Nes_Vrc6_Apu9run_untilEi:pn,__ZL12get_spc_infoRKN7Spc_Emu8header_tEPKhlP12track_info_t:sS,__Z10kss_cpu_inP7Kss_Cpulj:ny,__ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv:uK,__Z21YM2612_Special_Updatev:iz,__ZN8Gme_FiledlEPv:cK,__ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi:u7,_memcpy:wh,__Z12zero_apu_oscI10Nes_SquareEvPT_l:og,__ZN15Mem_File_ReaderD0Ev:d7,__ZN13blargg_vectorIPKcED1Ev:qr,__vwarnx:v5,__ZN9Sms_NoiseC1Ev:jf,__ZN11Blip_Reader5beginER11Blip_Buffer:et,__ZN10__cxxabiv117__array_type_infoD0Ev:uX,__ZN7Nsf_EmuD2Ev:pL,__ZN8Gym_FileD0Ev:l9,__ZN8Snes_Spc10set_outputEPsi:sd,__ZNK7Nes_Cpu11error_countEv:p5,__ZN10Ym2413_Emu5writeEii:ui,__ZNK9Music_Emu4gainEv:jJ,__ZN7Spc_EmuD0Ev:s$,__ZN6Ay_Emu9load_mem_EPKhl:jO,__ZNK6Ay_Emu11track_info_EP12track_info_ti:jM,__ZNK8Nsf_File11track_info_EP12track_info_ti:qk,_malloc_usable_size:vy,__ZL11new_vgm_emuv:tV,__ZN7Sap_Apu9end_frameEi:rk,__ZN6Ay_Emu12cpu_out_miscElji:j2,__ZN12Multi_BufferD1Ev:hw,__ZN9Music_Emu11handle_fadeElPs:h4,__ZN13Subset_ReaderC2EP11Data_Readerl:dS,__ZN9Nsfe_Info4loadER11Data_ReaderP7Nsf_Emu:qD,___cxx_global_var_init285:kX,__ZN9Music_Emu11mute_voicesEi:hU,__ZNK10__cxxabiv116__shim_type_info5noop2Ev:uE,__ZN13Nes_Namco_Apu6volumeEd:oQ,__ZL16check_gbs_headerPKv:k5,__ZN7Gbs_Emu9update_eqERK9blip_eq_t:k6,__err:wc,__ZN6Gb_Apu9write_oscEiii:kW,__ZN13Stereo_BufferC2Ev:hp,__ZN9Music_Emu9set_tempoEd:hV,__ZN11File_ReaderD0Ev:d1,__ZN8Snes_Spc12reset_commonEi:r8,__ZN13Stereo_BufferD2Ev:hr,__ZN9Music_Emu15set_sample_rateEl:hR,__ZN14Dual_Resampler5clearEv:em,__ZL3maxii:kg,_gme_track_info:fC,_gme_delete:fm,__ZN7Sap_Apu12calc_periodsEv:rh,__ZN12Nes_Fme7_Apu10write_dataEii:p9,__ZN6Ay_Apu6volumeEd:iq,__ZN12Nes_Vrc6_Apu10load_stateERK16vrc6_apu_state_t:pt,__ZN8Gme_FilenwEj:j6,__ZNK7Hes_Emu11track_info_EP12track_info_ti:my,__ZN14Effects_Buffer9end_frameEi:eX,__ZN6Ay_Apu9end_frameEi:kb,_gme_identify_file:fh,__ZL7int_loglii:hX,__ZN18ym2612_update_chanILi3EE4funcER8tables_tR9channel_tPsi:i_,__ZN7Kss_Emu9set_voiceEiP11Blip_BufferS1_S1_:nt,__ZN8Vgm_FileD0Ev:tY,__ZN8Kss_FileD2Ev:nU,__ZN7Nes_Cpu3runEl:oH,__ZN8Rom_DataILi16384EEC2Ev:ls,__ZL3minii606:rE,__ZNK8Gym_File11track_info_EP12track_info_ti:l2,__ZL10parse_namePc:g7,__ZN12Multi_Buffer16channels_changedEv:eO,__ZN12Nes_Vrc6_ApunwEj:pN,__ZN8Rom_DataILi8192EE4loadER11Data_ReaderiPvi:mC,__ZN7Hes_ApuC2Ev:l4,__ZN13blargg_vectorIhEC2Ev:gf,_strtof:v8,_strtod:v6,__ZN7Scc_Apu10osc_outputEiP11Blip_Buffer:nx,__ZN7Nes_Osc10update_ampEi:o_,__ZL10parse_int_PcPi:hc,__ZN8Snes_Spc10ram_loadedEv:r4,__ZN15Callback_ReaderC2EPFPKcPvS2_iElS2_:dG,__ZN9blip_eq_tC2Ed:cB,__ZN10Sms_Square3runEii:i7,__ZN10Ym2612_EmuC1Ev:lv,_gme_load_m3u:gO,__ZN8Hes_FileD0Ev:nd,__ZN7Spc_Emu9load_mem_EPKhl:sX,__ZN7Spc_Dsp16disable_surroundEb:sF,__ZNK9Music_Emu5tempoEv:j_,__ZN7Nes_Cpu17clear_error_countEv:p6,__ZN8Snes_Spc8init_romEPKh:r1,__ZNK13blargg_vectorIhE5beginEv:c0,__ZN10__cxxabiv129__pointer_to_member_type_infoD0Ev:u3,__ZN7Nes_Dmc5startEv:pd,_gme_equalizer:fZ,__ZN12Nes_Vrc6_Apu7run_sawEi:ps,__ZN7Hes_Osc9run_untilER10Blip_SynthILi8ELi1EEi:mf,__ZN7Kss_Cpu11adjust_timeEi:nE,__ZN10Sms_Square5resetEv:jn,__ZN7Spc_Emu12mute_voices_Ei:sV,__ZN15Std_File_Reader4readEPvl:dX,__ZNK7Vgm_Emu8gd3_dataEPi:ty,_gme_load_data:fs,__ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib:vb,__ZN7Nes_Cpu13set_code_pageEiPKv:oA,__ZL9parse_gd3PKhS0_P12track_info_t:tC,__ZN11Ym2612_Impl7KEY_OFFER9channel_ti:iB,_gme_new_emu:fr,_try_realloc_chunk:vr,__ZN7Ay_FileD1Ev:j9,_gme_load_custom:fu,__ZNK12M3u_Playlist11first_errorEv:gz,__ZN6Gb_Apu6outputEP11Blip_BufferS1_S1_:kp,__Z8get_le16PKv:jD,__ZN10__cxxabiv123__fundamental_type_infoD0Ev:uW,__ZN7Sms_Apu14write_ggstereoEii:js,__ZN12Nes_Vrc6_Apu9treble_eqERK9blip_eq_t:pX,__ZN10Nes_Square5resetEv:ob,__Znwj:vI,__ZN15Std_File_Reader4openEPKc:dN,__ZN7Nes_Dmc11fill_bufferEv:pe,__ZN13blargg_vectorIPKcEC2Ev:qI,__ZNK13blargg_vectorIPKcEixEj:qY,__ZNK9Nsfe_Info11remap_trackEi:qu,__ZN7Scc_ApuC2Ev:nV,__ZN7Spc_Dsp16update_voice_volEi:sg,__ZN7Kss_Emu10run_clocksERii:nL,__ZN7Kss_Cpu8set_pageEiPvPKv:m5,__ZN7Spc_Dsp12init_counterEv:sG,__ZN13blargg_vectorIA4_cEC2Ev:qH,_gme_free_info:fE,__ZN9Gb_Square11clock_sweepEv:kK,__ZN16Remaining_ReaderD2Ev:ec,__ZNK7Spc_Dsp4readEi:sc,__ZN7Spc_Dsp11mute_voicesEi:sJ,__ZNK9Nsfe_File11track_info_EP12track_info_ti:q7,__ZN6Ay_Apu5writeEiii:j3,__ZL8get_dataRKN6Ay_Emu6file_tEPKhi:ka,_strtold:v7,__ZN9Gme_Info_5play_ElPs:id,__ZN7Kss_Cpu5resetEPvPKv:nc,__ZN11Mono_Buffer15set_sample_rateEli:hh,__ZL3minii681:th,__ZNK9Music_Emu15msec_to_samplesEl:h$,__ZN6Ym_EmuI10Ym2413_EmuEC2Ev:ua,__ZN8Snes_Spc14cpu_write_highEiii:sv,__ZN6Ay_Emu10run_clocksERii:j5,__ZNK8Rom_DataILi8192EE9mask_addrEl:mn,__ZN7Gym_EmuC2Ev:lB,__ZN11Classic_Emu16set_sample_rate_El:de,__ZN7Gym_Emu12mute_voices_Ei:lN,__ZL14parse_filenamePcRN12M3u_Playlist7entry_tE:g5,__ZN10Sms_SquareC1Ev:je,__ZN8Kss_FileC2Ev:n7,__ZN7Sap_Emu9call_playEv:rN,__ZN7Nes_Apu10dmc_readerEPFiPvjES0_:pr,__ZNK7Gym_Emu11track_info_EP12track_info_ti:lG,__ZN13Nes_Namco_Apu10osc_outputEiP11Blip_Buffer:oT,__ZN8Rom_DataILi8192EE5clearEv:mx,__ZNK8Rom_DataILi16384EE9mask_addrEl:kU,__ZN7Scc_Apu6outputEP11Blip_Buffer:nP,__ZN12Nes_Vrc6_ApuC2Ev:pi,__ZL13new_nsfe_filev:q2,__ZN7Sms_Apu10osc_outputEiP11Blip_BufferS1_S1_:jp,__ZN8Snes_Spc9reset_bufEv:r7,__ZN7Scc_Apu9run_untilEi:nW,__ZN15Callback_ReaderD2Ev:ea,__ZnwjRKSt9nothrow_t:vJ,_memset:wg,__ZN6Ay_ApuC2Ev:im,_atof:wb,__ZN7Nsf_Emu9set_voiceEiP11Blip_BufferS1_S1_:pZ,__ZN8Gme_FileD2Ev:ga,__ZNK7Sap_Emu11track_info_EP12track_info_ti:ru,__ZN7Gym_EmuD2Ev:lS,__ZN9Rom_Data_C2Ev:lt,__ZN10Blip_SynthILi12ELi15EE6volumeEd:o0,__ZNK13blargg_vectorIhEixEj:dh,__ZL12parse_stringPKhS0_iPc:rP,__ZN7Vgm_EmuD2Ev:tw,__ZN6Gb_Apu9set_tempoEd:kh,__ZN13blargg_vectorIPKcE5clearEv:qB,__ZN7Nes_Apu11irq_changedEv:oe,__ZN6Gb_Apu9treble_eqERK9blip_eq_t:ko,__ZSt15get_new_handlerv:vG,__ZN13Fir_ResamplerILi12EE4readEPsl:eA,__ZN9Music_Emu15enable_accuracyEb:fW,__ZN8Vgm_FileC1Ev:tT,__ZNK13Subset_Reader6remainEv:dn,__ZN10Ym2612_Emu6write1Eii:iR,__ZN8Gme_File8load_m3uEPKc:gL,__ZN8Rom_DataILi16384EE5clearEv:k0,__ZN12Nes_Fme7_ApuC2Ev:qd,__ZN6Gb_Osc12clock_lengthEv:kH,__ZL12new_hes_filev:m2,__ZNK8Gbs_File11track_info_EP12track_info_ti:lo,__ZN6Ym_EmuI10Ym2612_EmuEC1Ev:t8,__ZN13blargg_vectorIsEC2Ev:ex,__ZN6Ay_Cpu3runEl:jB,__ZN7Hes_Emu17recalc_timer_loadEv:mq,__ZN7Sap_Emu9cpu_writeEji:rl,__ZN13Silent_Buffer9bass_freqEi:cT,_dispose_chunk:vH,__ZN11File_ReaderD1Ev:d0,__ZNK8Rom_DataILi8192EE5beginEv:mA,__ZN8Snes_Spc17cpu_write_smp_regEiii:sr,__ZN7Gbs_Emu12update_timerEv:la,_getopt:vW,__ZN14Effects_Buffer6configERKNS_8config_tE:eV,__ZN10Blip_SynthILi12ELi1EEC2Ev:iD,__ZN8Gme_File8load_m3uER11Data_Reader:gM,__ZN11Blip_Synth_9treble_eqERK9blip_eq_t:cF,__ZThn336_N12Vgm_Emu_Impl10play_frameEiiPs:up,__ZN6Gb_Apu6volumeEd:km,_gme_set_user_data:fI,__ZL16check_hes_headerPKv:mD,__ZNK9Music_Emu4tellEv:h0,__ZN7Sap_Apu5resetEP12Sap_Apu_Impl:rb,__ZN9Gme_Info_D2Ev:ik,__ZN13Fir_ResamplerILi24EEC1Ev:sN,__ZN10Blip_SynthILi12ELi1EEC1Ev:io,__ZN7Spc_Emu15play_and_filterElPs:s5,__ZN7Spc_Emu5play_ElPs:s7,__ZN8Snes_Spc8load_spcEPKvl:sa,__ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib:vc,__ZN8Gme_File15set_track_countEi:gd,_getopt_long_only:vZ,__ZNK10__cxxabiv117__pbase_type_info9can_catchEPKNS_16__shim_type_infoERPv:uO,__ZN9Nsfe_InfoD2Ev:qz,__ZN12Nes_Vrc6_Apu6outputEP11Blip_Buffer:pj,__ZN7Vgm_Emu9set_voiceEiP11Blip_BufferS1_S1_:tG,__ZN8Nsfe_Emu15clear_playlist_Ev:qS,_calloc:vj,__Z8get_le32PKv:lE,__ZN7Nes_Cpu15update_end_timeEll:oI,__ZN7Hes_Emu11irq_changedEv:mU,_gme_type_list:fd,__ZN13Nes_Namco_Apu6outputEP11Blip_Buffer:oP,__ZNK13Silent_Buffer13samples_availEv:cX,__ZNK11Blip_Buffer14output_latencyEv:eK,__ZNK11Blip_Buffer12count_clocksEl:cy,__ZN13blargg_vectorIhE6resizeEj:da,__ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i:uP,__ZN8Sap_FileC1Ev:rQ,__ZN15Callback_ReaderD0Ev:d9,__ZN7Sms_Apu6volumeEd:jg,__ZN14Dual_Resampler11mix_samplesER11Blip_BufferPs:eB,__ZN9Sms_NoiseC2Ev:ju,__ZN12Vgm_Emu_Impl12run_commandsEi:um,__ZN10__cxxabiv116__shim_type_infoD2Ev:uV,__ZNK11File_Reader6remainEv:dw,__ZN7Hes_Emu10cpu_write_Eji:mV,__ZL11new_spc_emuv:td,__ZNK7Nes_Osc6periodEv:oY,__ZN8Gb_Noise3runEiii:kP,__ZN7Spc_Dsp10soft_resetEv:sL,__ZN7Scc_Apu9end_frameEi:nN,__ZN10Nes_Square14maintain_phaseElll:oZ,__ZN7Sap_Emu9set_voiceEiP11Blip_BufferS1_S1_:rA,_realloc:vl,__ZN6Ym_EmuI10Ym2413_EmuED1Ev:t4,__ZN7Nes_Cpu8get_codeEj:ow,__ZN8Snes_Spc8dsp_readEi:sk,__ZN18ym2612_update_chanILi0EE4funcER8tables_tR9channel_tPsi:iX,__ZN11Classic_Emu15set_voice_typesEPKi:jG,__ZN11Data_ReaderD0Ev:d$,__ZN7Nes_Cpu12set_end_timeEl:oL,__ZNSt10bad_typeidC2Ev:uJ,__ZN7Nsf_Emu12start_track_Ei:qa,__ZN8Snes_Spc17check_echo_accessEi:sl,___cxx_global_var_init1536:pv,__errx:wd,__ZN11Mono_BufferC2Ev:he,__ZN8Sap_FileD0Ev:rV,__ZN9Gme_Info_14set_equalizer_ERK15gme_equalizer_t:h9,__ZNKSt10bad_typeid4whatEv:uC,__ZNK7Vgm_Emu6headerEv:tr,__Z12zero_apu_oscI7Nes_DmcEvPT_l:oq,__ZL11adjust_timeRll:mQ,__ZN12Vgm_Emu_ImplD2Ev:tJ,__ZN7Sap_EmuD0Ev:rD,_gme_seek:fP,__ZNK12Nes_Envelope6volumeEv:oX,__ZN13Nes_Namco_Apu9read_dataEv:oC,__ZN8Gme_File11copy_field_EPcPKc:gn,_gme_voice_name:f5,__ZN7Kss_Cpu12set_end_timeEl:nh,__ZN8Gme_File15load_remaining_EPKvlR11Data_Reader:gv,__ZNK8Spc_File11track_info_EP12track_info_ti:tj,__ZnajRKSt9nothrow_t:v$,__ZN7Hes_Emu9run_untilEl:mR,__ZNK10Blip_SynthILi12ELi15EE16offset_resampledEjiP11Blip_Buffer:o3,__ZN6Ym_EmuI10Ym2612_EmuE11begin_frameEPs:uv,__ZN7Nes_Dmc5resetEv:o9,__ZN13blargg_vectorIA4_cED1Ev:qs,runPostSets:ce,stackAlloc:b_,stackSave:b$,stackRestore:b0,setThrew:b1,setTempRet0:b4,setTempRet1:b5,setTempRet2:b6,setTempRet3:b7,setTempRet4:b8,setTempRet5:b9,setTempRet6:ca,setTempRet7:cb,setTempRet8:cc,setTempRet9:cd,dynCall_viiiii:wn,dynCall_vif:wo,dynCall_i:wp,dynCall_vi:wq,dynCall_vii:wr,dynCall_iiii:ws,dynCall_ii:wt,dynCall_viii:wu,dynCall_v:wv,dynCall_iiiii:ww,dynCall_viiiiii:wx,dynCall_iii:wy,dynCall_viiii:wz}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_viiiii": invoke_viiiii, "invoke_vif": invoke_vif, "invoke_i": invoke_i, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_iiii": invoke_iiii, "invoke_ii": invoke_ii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_iiiii": invoke_iiiii, "invoke_viiiiii": invoke_viiiiii, "invoke_iii": invoke_iii, "invoke_viiii": invoke_viiii, "_strncmp": _strncmp, "_lseek": _lseek, "_feof": _feof, "_sysconf": _sysconf, "___cxa_free_exception": ___cxa_free_exception, "___cxa_throw": ___cxa_throw, "_fread": _fread, "_strerror": _strerror, "_fwrite": _fwrite, "_abort": _abort, "_fprintf": _fprintf, "_llvm_eh_exception": _llvm_eh_exception, "_toupper": _toupper, "_close": _close, "_pread": _pread, "_fflush": _fflush, "_fopen": _fopen, "_open": _open, "_strchr": _strchr, "_fputc": _fputc, "___buildEnvironment": ___buildEnvironment, "_fabs": _fabs, "_floor": _floor, "___setErrNo": ___setErrNo, "___assert_func": ___assert_func, "_fseek": _fseek, "_send": _send, "_write": _write, "_ftell": _ftell, "_exit": _exit, "_strrchr": _strrchr, "_log10": _log10, "_sin": _sin, "_printf": _printf, "_llvm_va_end": _llvm_va_end, "___cxa_pure_virtual": ___cxa_pure_virtual, "_read": _read, "_fclose": _fclose, "__reallyNegative": __reallyNegative, "_time": _time, "__formatString": __formatString, "___cxa_does_inherit": ___cxa_does_inherit, "_getenv": _getenv, "___cxa_guard_acquire": ___cxa_guard_acquire, "__ZSt9terminatev": __ZSt9terminatev, "_vfprintf": _vfprintf, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_recv": _recv, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_cos": _cos, "_pwrite": _pwrite, "_llvm_pow_f64": _llvm_pow_f64, "_fsync": _fsync, "_strerror_r": _strerror_r, "___cxa_allocate_exception": ___cxa_allocate_exception, "___cxa_begin_catch": ___cxa_begin_catch, "___errno_location": ___errno_location, "___gxx_personality_v0": ___gxx_personality_v0, "_isspace": _isspace, "___cxa_call_unexpected": ___cxa_call_unexpected, "___cxa_is_number_type": ___cxa_is_number_type, "_sbrk": _sbrk, "_fmod": _fmod, "___cxa_guard_release": ___cxa_guard_release, "__exit": __exit, "___resumeException": ___resumeException, "_strcmp": _strcmp, "___cxa_end_catch": ___cxa_end_catch, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity, "__ZTIy": __ZTIy, "__ZTIs": __ZTIs, "__ZTIm": __ZTIm, "__ZTIi": __ZTIi, "__ZTIj": __ZTIj, "__ZTIe": __ZTIe, "__ZTIa": __ZTIa, "__ZTIc": __ZTIc, "__ZTIx": __ZTIx, "__ZTVN10__cxxabiv120__si_class_type_infoE": __ZTVN10__cxxabiv120__si_class_type_infoE, "___progname": ___progname, "__ZTIl": __ZTIl, "__ZTVN10__cxxabiv117__class_type_infoE": __ZTVN10__cxxabiv117__class_type_infoE, "__ZTIf": __ZTIf, "__ZTVN10__cxxabiv119__pointer_type_infoE": __ZTVN10__cxxabiv119__pointer_type_infoE, "__ZTIt": __ZTIt, "__ZTIh": __ZTIh, "__ZTId": __ZTId, "_stderr": _stderr }, buffer);
var __ZNK13Stereo_Buffer13samples_availEv = Module["__ZNK13Stereo_Buffer13samples_availEv"] = asm["__ZNK13Stereo_Buffer13samples_availEv"];
var __ZN13Subset_ReaderD0Ev = Module["__ZN13Subset_ReaderD0Ev"] = asm["__ZN13Subset_ReaderD0Ev"];
var __ZN7Spc_Dsp5writeEii = Module["__ZN7Spc_Dsp5writeEii"] = asm["__ZN7Spc_Dsp5writeEii"];
var __ZN8Spc_FileD1Ev = Module["__ZN8Spc_FileD1Ev"] = asm["__ZN8Spc_FileD1Ev"];
var __ZN9blip_eq_tC2Edlll = Module["__ZN9blip_eq_tC2Edlll"] = asm["__ZN9blip_eq_tC2Edlll"];
var __ZN7Hes_EmuD0Ev = Module["__ZN7Hes_EmuD0Ev"] = asm["__ZN7Hes_EmuD0Ev"];
var __ZN13blargg_vectorIsED2Ev = Module["__ZN13blargg_vectorIsED2Ev"] = asm["__ZN13blargg_vectorIsED2Ev"];
var __ZN7Sap_Emu10run_clocksERii = Module["__ZN7Sap_Emu10run_clocksERii"] = asm["__ZN7Sap_Emu10run_clocksERii"];
var __ZNK8Gme_File9user_dataEv = Module["__ZNK8Gme_File9user_dataEv"] = asm["__ZNK8Gme_File9user_dataEv"];
var __ZN8Rom_DataILi4096EE8set_addrEl = Module["__ZN8Rom_DataILi4096EE8set_addrEl"] = asm["__ZN8Rom_DataILi4096EE8set_addrEl"];
var __ZL3minii413 = Module["__ZL3minii413"] = asm["__ZL3minii413"];
var __ZN16Remaining_Reader4readEPvl = Module["__ZN16Remaining_Reader4readEPvl"] = asm["__ZN16Remaining_Reader4readEPvl"];
var __ZN13Stereo_Buffer9bass_freqEi = Module["__ZN13Stereo_Buffer9bass_freqEi"] = asm["__ZN13Stereo_Buffer9bass_freqEi"];
var __ZN12Multi_BufferD0Ev = Module["__ZN12Multi_BufferD0Ev"] = asm["__ZN12Multi_BufferD0Ev"];
var __ZN7Nsf_Emu10set_tempo_Ed = Module["__ZN7Nsf_Emu10set_tempo_Ed"] = asm["__ZN7Nsf_Emu10set_tempo_Ed"];
var __ZN13blargg_vectorIhEC1Ev = Module["__ZN13blargg_vectorIhEC1Ev"] = asm["__ZN13blargg_vectorIhEC1Ev"];
var __ZN8Gme_FileC2Ev = Module["__ZN8Gme_FileC2Ev"] = asm["__ZN8Gme_FileC2Ev"];
var __ZN14Effects_Buffer10mix_stereoEPsl = Module["__ZN14Effects_Buffer10mix_stereoEPsl"] = asm["__ZN14Effects_Buffer10mix_stereoEPsl"];
var __ZN14Fir_Resampler_5clearEv = Module["__ZN14Fir_Resampler_5clearEv"] = asm["__ZN14Fir_Resampler_5clearEv"];
var __Z13from_hex_chari = Module["__Z13from_hex_chari"] = asm["__Z13from_hex_chari"];
var __ZN7Gym_Emu7run_dacEi = Module["__ZN7Gym_Emu7run_dacEi"] = asm["__ZN7Gym_Emu7run_dacEi"];
var __ZN9Gme_Info_8pre_loadEv = Module["__ZN9Gme_Info_8pre_loadEv"] = asm["__ZN9Gme_Info_8pre_loadEv"];
var __ZN7Nsf_EmuD0Ev = Module["__ZN7Nsf_EmuD0Ev"] = asm["__ZN7Nsf_EmuD0Ev"];
var __Z7set_segR6slot_ti = Module["__Z7set_segR6slot_ti"] = asm["__Z7set_segR6slot_ti"];
var __ZN8Hes_File5load_ER11Data_Reader = Module["__ZN8Hes_File5load_ER11Data_Reader"] = asm["__ZN8Hes_File5load_ER11Data_Reader"];
var _gme_track_ended = Module["_gme_track_ended"] = asm["_gme_track_ended"];
var __ZN8Snes_Spc5resetEv = Module["__ZN8Snes_Spc5resetEv"] = asm["__ZN8Snes_Spc5resetEv"];
var __ZN7Scc_Apu6volumeEd = Module["__ZN7Scc_Apu6volumeEd"] = asm["__ZN7Scc_Apu6volumeEd"];
var __ZN11Classic_EmuD2Ev = Module["__ZN11Classic_EmuD2Ev"] = asm["__ZN11Classic_EmuD2Ev"];
var __ZN9Music_Emu4skipEl = Module["__ZN9Music_Emu4skipEl"] = asm["__ZN9Music_Emu4skipEl"];
var __ZN7Nes_Apu6volumeEd = Module["__ZN7Nes_Apu6volumeEd"] = asm["__ZN7Nes_Apu6volumeEd"];
var __ZN14Effects_Buffer5clearEv = Module["__ZN14Effects_Buffer5clearEv"] = asm["__ZN14Effects_Buffer5clearEv"];
var __ZNK9blip_eq_t8generateEPfi = Module["__ZNK9blip_eq_t8generateEPfi"] = asm["__ZNK9blip_eq_t8generateEPfi"];
var __ZNK13blargg_vectorIA4_cEixEj = Module["__ZNK13blargg_vectorIA4_cEixEj"] = asm["__ZNK13blargg_vectorIA4_cEixEj"];
var __ZNK8Gme_File12remap_track_EPi = Module["__ZNK8Gme_File12remap_track_EPi"] = asm["__ZNK8Gme_File12remap_track_EPi"];
var __ZN14Effects_BufferC2Eb = Module["__ZN14Effects_BufferC2Eb"] = asm["__ZN14Effects_BufferC2Eb"];
var __ZN12Sap_Apu_ImplC2Ev = Module["__ZN12Sap_Apu_ImplC2Ev"] = asm["__ZN12Sap_Apu_ImplC2Ev"];
var __ZN7Hes_Cpu15update_end_timeEll = Module["__ZN7Hes_Cpu15update_end_timeEll"] = asm["__ZN7Hes_Cpu15update_end_timeEll"];
var __ZN18ym2612_update_chanILi6EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi6EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi6EE4funcER8tables_tR9channel_tPsi"];
var __ZN13Fir_ResamplerILi24EED2Ev = Module["__ZN13Fir_ResamplerILi24EED2Ev"] = asm["__ZN13Fir_ResamplerILi24EED2Ev"];
var __ZN9Nes_NoiseC1Ev = Module["__ZN9Nes_NoiseC1Ev"] = asm["__ZN9Nes_NoiseC1Ev"];
var __ZN13Silent_BufferD0Ev = Module["__ZN13Silent_BufferD0Ev"] = asm["__ZN13Silent_BufferD0Ev"];
var __ZN6Ay_EmuC2Ev = Module["__ZN6Ay_EmuC2Ev"] = asm["__ZN6Ay_EmuC2Ev"];
var __ZN8Vgm_File5load_ER11Data_Reader = Module["__ZN8Vgm_File5load_ER11Data_Reader"] = asm["__ZN8Vgm_File5load_ER11Data_Reader"];
var __ZN9Music_Emu23set_max_initial_silenceEi = Module["__ZN9Music_Emu23set_max_initial_silenceEi"] = asm["__ZN9Music_Emu23set_max_initial_silenceEi"];
var __ZN7Nes_Dmc10recalc_irqEv = Module["__ZN7Nes_Dmc10recalc_irqEv"] = asm["__ZN7Nes_Dmc10recalc_irqEv"];
var __ZN7Kss_EmuC2Ev = Module["__ZN7Kss_EmuC2Ev"] = asm["__ZN7Kss_EmuC2Ev"];
var __ZN9Music_Emu14ignore_silenceEb = Module["__ZN9Music_Emu14ignore_silenceEb"] = asm["__ZN9Music_Emu14ignore_silenceEb"];
var __ZN13Fir_ResamplerILi12EEC1Ev = Module["__ZN13Fir_ResamplerILi12EEC1Ev"] = asm["__ZN13Fir_ResamplerILi12EEC1Ev"];
var __ZN9Music_Emu10post_load_Ev = Module["__ZN9Music_Emu10post_load_Ev"] = asm["__ZN9Music_Emu10post_load_Ev"];
var __ZN11Blip_BufferD2Ev = Module["__ZN11Blip_BufferD2Ev"] = asm["__ZN11Blip_BufferD2Ev"];
var __ZN7Nes_Cpu5resetEPKv = Module["__ZN7Nes_Cpu5resetEPKv"] = asm["__ZN7Nes_Cpu5resetEPKv"];
var __ZN7Hes_Cpu5resetEv = Module["__ZN7Hes_Cpu5resetEv"] = asm["__ZN7Hes_Cpu5resetEv"];
var __ZL3minll554 = Module["__ZL3minll554"] = asm["__ZL3minll554"];
var ___cxx_global_var_init1 = Module["___cxx_global_var_init1"] = asm["___cxx_global_var_init1"];
var __ZN9Music_Emu18end_track_if_errorEPKc = Module["__ZN9Music_Emu18end_track_if_errorEPKc"] = asm["__ZN9Music_Emu18end_track_if_errorEPKc"];
var __ZN10Blip_SynthILi12ELi1EE6volumeEd = Module["__ZN10Blip_SynthILi12ELi1EE6volumeEd"] = asm["__ZN10Blip_SynthILi12ELi1EE6volumeEd"];
var __ZNK7Spc_Emu11track_info_EP12track_info_ti = Module["__ZNK7Spc_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Spc_Emu11track_info_EP12track_info_ti"];
var __ZN7Spc_Dsp11run_counterEi = Module["__ZN7Spc_Dsp11run_counterEi"] = asm["__ZN7Spc_Dsp11run_counterEi"];
var __ZL3minll414 = Module["__ZL3minll414"] = asm["__ZL3minll414"];
var __ZL8from_hexPKh = Module["__ZL8from_hexPKh"] = asm["__ZL8from_hexPKh"];
var __ZN11Data_Reader4skipEl = Module["__ZN11Data_Reader4skipEl"] = asm["__ZN11Data_Reader4skipEl"];
var __ZN16Remaining_Reader10read_firstEPvl = Module["__ZN16Remaining_Reader10read_firstEPvl"] = asm["__ZN16Remaining_Reader10read_firstEPvl"];
var __ZN7Nes_Apu9treble_eqERK9blip_eq_t = Module["__ZN7Nes_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN7Nes_Apu9treble_eqERK9blip_eq_t"];
var __ZNK13blargg_vectorIhE3endEv = Module["__ZNK13blargg_vectorIhE3endEv"] = asm["__ZNK13blargg_vectorIhE3endEv"];
var __ZN11File_ReaderD2Ev = Module["__ZN11File_ReaderD2Ev"] = asm["__ZN11File_ReaderD2Ev"];
var __ZN10Ym2612_Emu5resetEv = Module["__ZN10Ym2612_Emu5resetEv"] = asm["__ZN10Ym2612_Emu5resetEv"];
var __ZN12Multi_BuffernwEj = Module["__ZN12Multi_BuffernwEj"] = asm["__ZN12Multi_BuffernwEj"];
var __ZN7Gbs_EmuD0Ev = Module["__ZN7Gbs_EmuD0Ev"] = asm["__ZN7Gbs_EmuD0Ev"];
var __ZN6Ay_Apu9treble_eqERK9blip_eq_t = Module["__ZN6Ay_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN6Ay_Apu9treble_eqERK9blip_eq_t"];
var __ZN11Classic_Emu12setup_bufferEl = Module["__ZN11Classic_Emu12setup_bufferEl"] = asm["__ZN11Classic_Emu12setup_bufferEl"];
var __ZN8Rom_DataILi4096EE5clearEv = Module["__ZN8Rom_DataILi4096EE5clearEv"] = asm["__ZN8Rom_DataILi4096EE5clearEv"];
var __ZN7Nes_Apu16enable_nonlinearEd = Module["__ZN7Nes_Apu16enable_nonlinearEd"] = asm["__ZN7Nes_Apu16enable_nonlinearEd"];
var __ZN12Nes_Fme7_Apu11write_latchEi = Module["__ZN12Nes_Fme7_Apu11write_latchEi"] = asm["__ZN12Nes_Fme7_Apu11write_latchEi"];
var __ZN7Hes_Apu15balance_changedER7Hes_Osc = Module["__ZN7Hes_Apu15balance_changedER7Hes_Osc"] = asm["__ZN7Hes_Apu15balance_changedER7Hes_Osc"];
var __ZN13Fir_ResamplerILi24EE4readEPsl = Module["__ZN13Fir_ResamplerILi24EE4readEPsl"] = asm["__ZN13Fir_ResamplerILi24EE4readEPsl"];
var __ZN7Hes_Cpu12set_irq_timeEl = Module["__ZN7Hes_Cpu12set_irq_timeEl"] = asm["__ZN7Hes_Cpu12set_irq_timeEl"];
var __ZN6Gb_Cpu3runEl = Module["__ZN6Gb_Cpu3runEl"] = asm["__ZN6Gb_Cpu3runEl"];
var __ZNSt10bad_typeidD2Ev = Module["__ZNSt10bad_typeidD2Ev"] = asm["__ZNSt10bad_typeidD2Ev"];
var __ZN9Nsfe_FileD2Ev = Module["__ZN9Nsfe_FileD2Ev"] = asm["__ZN9Nsfe_FileD2Ev"];
var __ZN6Ym_EmuI10Ym2413_EmuEC1Ev = Module["__ZN6Ym_EmuI10Ym2413_EmuEC1Ev"] = asm["__ZN6Ym_EmuI10Ym2413_EmuEC1Ev"];
var __ZN6Gb_Apu13update_volumeEv = Module["__ZN6Gb_Apu13update_volumeEv"] = asm["__ZN6Gb_Apu13update_volumeEv"];
var _strtold_l = Module["_strtold_l"] = asm["_strtold_l"];
var __ZN8Nsfe_Emu16disable_playlistEb = Module["__ZN8Nsfe_Emu16disable_playlistEb"] = asm["__ZN8Nsfe_Emu16disable_playlistEb"];
var __ZN16Blip_Synth_Fast_C2Ev = Module["__ZN16Blip_Synth_Fast_C2Ev"] = asm["__ZN16Blip_Synth_Fast_C2Ev"];
var __ZN11Blip_Synth_C2EPsi = Module["__ZN11Blip_Synth_C2EPsi"] = asm["__ZN11Blip_Synth_C2EPsi"];
var __ZL10parse_linePcRN12M3u_Playlist7entry_tE = Module["__ZL10parse_linePcRN12M3u_Playlist7entry_tE"] = asm["__ZL10parse_linePcRN12M3u_Playlist7entry_tE"];
var __ZN8Gbs_File5load_ER11Data_Reader = Module["__ZN8Gbs_File5load_ER11Data_Reader"] = asm["__ZN8Gbs_File5load_ER11Data_Reader"];
var __ZN7Kss_Emu9update_eqERK9blip_eq_t = Module["__ZN7Kss_Emu9update_eqERK9blip_eq_t"] = asm["__ZN7Kss_Emu9update_eqERK9blip_eq_t"];
var __ZNK12Multi_Buffer6lengthEv = Module["__ZNK12Multi_Buffer6lengthEv"] = asm["__ZNK12Multi_Buffer6lengthEv"];
var __ZL14copy_ay_fieldsRKN6Ay_Emu6file_tEP12track_info_ti = Module["__ZL14copy_ay_fieldsRKN6Ay_Emu6file_tEP12track_info_ti"] = asm["__ZL14copy_ay_fieldsRKN6Ay_Emu6file_tEP12track_info_ti"];
var __ZN9Music_Emu13remute_voicesEv = Module["__ZN9Music_Emu13remute_voicesEv"] = asm["__ZN9Music_Emu13remute_voicesEv"];
var __ZN12Nes_Triangle5resetEv = Module["__ZN12Nes_Triangle5resetEv"] = asm["__ZN12Nes_Triangle5resetEv"];
var __ZN7Nes_DmcC1Ev = Module["__ZN7Nes_DmcC1Ev"] = asm["__ZN7Nes_DmcC1Ev"];
var __Z8set_le16Pvj = Module["__Z8set_le16Pvj"] = asm["__Z8set_le16Pvj"];
var __ZN11File_Reader4skipEl = Module["__ZN11File_Reader4skipEl"] = asm["__ZN11File_Reader4skipEl"];
var __ZN14Dual_Resampler9dual_playElPsR11Blip_Buffer = Module["__ZN14Dual_Resampler9dual_playElPsR11Blip_Buffer"] = asm["__ZN14Dual_Resampler9dual_playElPsR11Blip_Buffer"];
var __ZNK14Effects_Buffer13samples_availEv = Module["__ZNK14Effects_Buffer13samples_availEv"] = asm["__ZNK14Effects_Buffer13samples_availEv"];
var __ZNK9Music_Emu11voice_countEv = Module["__ZNK9Music_Emu11voice_countEv"] = asm["__ZNK9Music_Emu11voice_countEv"];
var __ZN9Gb_Square3runEiii = Module["__ZN9Gb_Square3runEiii"] = asm["__ZN9Gb_Square3runEiii"];
var __ZN15Callback_Reader4readEPvl = Module["__ZN15Callback_Reader4readEPvl"] = asm["__ZN15Callback_Reader4readEPvl"];
var __ZN13Stereo_Buffer10mix_stereoEPsl = Module["__ZN13Stereo_Buffer10mix_stereoEPsl"] = asm["__ZN13Stereo_Buffer10mix_stereoEPsl"];
var __ZL15copy_hes_fieldsPKhP12track_info_t = Module["__ZL15copy_hes_fieldsPKhP12track_info_t"] = asm["__ZL15copy_hes_fieldsPKhP12track_info_t"];
var __Z8get_be32PKv = Module["__Z8get_be32PKv"] = asm["__Z8get_be32PKv"];
var __ZN11File_ReaderC2Ev = Module["__ZN11File_ReaderC2Ev"] = asm["__ZN11File_ReaderC2Ev"];
var __ZN15Std_File_Reader4seekEl = Module["__ZN15Std_File_Reader4seekEl"] = asm["__ZN15Std_File_Reader4seekEl"];
var __ZN7Gym_Emu5play_ElPs = Module["__ZN7Gym_Emu5play_ElPs"] = asm["__ZN7Gym_Emu5play_ElPs"];
var __ZN13Subset_ReaderD1Ev = Module["__ZN13Subset_ReaderD1Ev"] = asm["__ZN13Subset_ReaderD1Ev"];
var __ZN7Sms_ApuD2Ev = Module["__ZN7Sms_ApuD2Ev"] = asm["__ZN7Sms_ApuD2Ev"];
var __ZN14Fir_Resampler_11buffer_sizeEi = Module["__ZN14Fir_Resampler_11buffer_sizeEi"] = asm["__ZN14Fir_Resampler_11buffer_sizeEi"];
var __ZL10skip_whitePc = Module["__ZL10skip_whitePc"] = asm["__ZL10skip_whitePc"];
var __ZN8Snes_Spc9set_tempoEi = Module["__ZN8Snes_Spc9set_tempoEi"] = asm["__ZN8Snes_Spc9set_tempoEi"];
var __ZN6Gb_Cpu5resetEPv = Module["__ZN6Gb_Cpu5resetEPv"] = asm["__ZN6Gb_Cpu5resetEPv"];
var __ZN13blargg_vectorIhE5clearEv = Module["__ZN13blargg_vectorIhE5clearEv"] = asm["__ZN13blargg_vectorIhE5clearEv"];
var __ZNSt9bad_allocD2Ev = Module["__ZNSt9bad_allocD2Ev"] = asm["__ZNSt9bad_allocD2Ev"];
var __ZN15Std_File_ReaderD2Ev = Module["__ZN15Std_File_ReaderD2Ev"] = asm["__ZN15Std_File_ReaderD2Ev"];
var __ZN14Effects_Buffer8mix_monoEPsl = Module["__ZN14Effects_Buffer8mix_monoEPsl"] = asm["__ZN14Effects_Buffer8mix_monoEPsl"];
var __ZN14Dual_Resampler11play_frame_ER11Blip_BufferPs = Module["__ZN14Dual_Resampler11play_frame_ER11Blip_BufferPs"] = asm["__ZN14Dual_Resampler11play_frame_ER11Blip_BufferPs"];
var __ZN13Silent_Buffer7channelEii = Module["__ZN13Silent_Buffer7channelEii"] = asm["__ZN13Silent_Buffer7channelEii"];
var __ZN13blargg_vectorIPKcEC1Ev = Module["__ZN13blargg_vectorIPKcEC1Ev"] = asm["__ZN13blargg_vectorIPKcEC1Ev"];
var __ZN9Music_EmuC2Ev = Module["__ZN9Music_EmuC2Ev"] = asm["__ZN9Music_EmuC2Ev"];
var __ZN9Music_Emu21set_silence_lookaheadEi = Module["__ZN9Music_Emu21set_silence_lookaheadEi"] = asm["__ZN9Music_Emu21set_silence_lookaheadEi"];
var __GLOBAL__I_a290 = Module["__GLOBAL__I_a290"] = asm["__GLOBAL__I_a290"];
var __ZN18ym2612_update_chanILi5EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi5EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi5EE4funcER8tables_tR9channel_tPsi"];
var __ZN11Blip_Buffer14remove_samplesEl = Module["__ZN11Blip_Buffer14remove_samplesEl"] = asm["__ZN11Blip_Buffer14remove_samplesEl"];
var __ZL13parse_commentPcRN12M3u_Playlist6info_tEb = Module["__ZL13parse_commentPcRN12M3u_Playlist6info_tEb"] = asm["__ZL13parse_commentPcRN12M3u_Playlist6info_tEb"];
var __ZN13blargg_vectorIcEC1Ev = Module["__ZN13blargg_vectorIcEC1Ev"] = asm["__ZN13blargg_vectorIcEC1Ev"];
var __ZN8Gme_File16set_user_cleanupEPFvPvE = Module["__ZN8Gme_File16set_user_cleanupEPFvPvE"] = asm["__ZN8Gme_File16set_user_cleanupEPFvPvE"];
var _gme_set_fade = Module["_gme_set_fade"] = asm["_gme_set_fade"];
var __ZN8Gym_File9load_mem_EPKhl = Module["__ZN8Gym_File9load_mem_EPKhl"] = asm["__ZN8Gym_File9load_mem_EPKhl"];
var __ZN9Gme_Info_12start_track_Ei = Module["__ZN9Gme_Info_12start_track_Ei"] = asm["__ZN9Gme_Info_12start_track_Ei"];
var __ZNK12Vgm_Emu_Impl15update_fm_ratesEPlS0_ = Module["__ZNK12Vgm_Emu_Impl15update_fm_ratesEPlS0_"] = asm["__ZNK12Vgm_Emu_Impl15update_fm_ratesEPlS0_"];
var __ZN18ym2612_update_chanILi1EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi1EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi1EE4funcER8tables_tR9channel_tPsi"];
var __ZN6Gb_Apu5resetEv = Module["__ZN6Gb_Apu5resetEv"] = asm["__ZN6Gb_Apu5resetEv"];
var __ZN13blargg_vectorIhED1Ev = Module["__ZN13blargg_vectorIhED1Ev"] = asm["__ZN13blargg_vectorIhED1Ev"];
var __ZNSt20bad_array_new_lengthC2Ev = Module["__ZNSt20bad_array_new_lengthC2Ev"] = asm["__ZNSt20bad_array_new_lengthC2Ev"];
var __ZN7Hes_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN7Hes_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN7Hes_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var __ZNK6Ym_EmuI10Ym2612_EmuE7enabledEv = Module["__ZNK6Ym_EmuI10Ym2612_EmuE7enabledEv"] = asm["__ZNK6Ym_EmuI10Ym2612_EmuE7enabledEv"];
var __ZN7Spc_Dsp17soft_reset_commonEv = Module["__ZN7Spc_Dsp17soft_reset_commonEv"] = asm["__ZN7Spc_Dsp17soft_reset_commonEv"];
var __ZL14get_vgm_lengthRKN7Vgm_Emu8header_tEP12track_info_t = Module["__ZL14get_vgm_lengthRKN7Vgm_Emu8header_tEP12track_info_t"] = asm["__ZL14get_vgm_lengthRKN7Vgm_Emu8header_tEP12track_info_t"];
var __ZNK15Std_File_Reader4tellEv = Module["__ZNK15Std_File_Reader4tellEv"] = asm["__ZNK15Std_File_Reader4tellEv"];
var __GLOBAL__I_a = Module["__GLOBAL__I_a"] = asm["__GLOBAL__I_a"];
var __ZN10Ym2413_Emu3runEiPs = Module["__ZN10Ym2413_Emu3runEiPs"] = asm["__ZN10Ym2413_Emu3runEiPs"];
var __ZN8Kss_FileD1Ev = Module["__ZN8Kss_FileD1Ev"] = asm["__ZN8Kss_FileD1Ev"];
var __ZN14Effects_Buffer7channelEii = Module["__ZN14Effects_Buffer7channelEii"] = asm["__ZN14Effects_Buffer7channelEii"];
var __ZN11Mono_Buffer9end_frameEi = Module["__ZN11Mono_Buffer9end_frameEi"] = asm["__ZN11Mono_Buffer9end_frameEi"];
var __ZNK14Fir_Resampler_5ratioEv = Module["__ZNK14Fir_Resampler_5ratioEv"] = asm["__ZNK14Fir_Resampler_5ratioEv"];
var __ZN8Gbs_FileD2Ev = Module["__ZN8Gbs_FileD2Ev"] = asm["__ZN8Gbs_FileD2Ev"];
var __ZN7Hes_Apu10osc_outputEiP11Blip_BufferS1_S1_ = Module["__ZN7Hes_Apu10osc_outputEiP11Blip_BufferS1_S1_"] = asm["__ZN7Hes_Apu10osc_outputEiP11Blip_BufferS1_S1_"];
var __ZN13Stereo_BufferD0Ev = Module["__ZN13Stereo_BufferD0Ev"] = asm["__ZN13Stereo_BufferD0Ev"];
var __ZN9Rom_Data_9set_addr_Eli = Module["__ZN9Rom_Data_9set_addr_Eli"] = asm["__ZN9Rom_Data_9set_addr_Eli"];
var __ZN13Fir_ResamplerILi12EEC2Ev = Module["__ZN13Fir_ResamplerILi12EEC2Ev"] = asm["__ZN13Fir_ResamplerILi12EEC2Ev"];
var __ZN13blargg_vectorIN12M3u_Playlist7entry_tEED1Ev = Module["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEED1Ev"] = asm["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEED1Ev"];
var __ZN8Kss_File5load_ER11Data_Reader = Module["__ZN8Kss_File5load_ER11Data_Reader"] = asm["__ZN8Kss_File5load_ER11Data_Reader"];
var __ZN9Music_Emu5skip_El = Module["__ZN9Music_Emu5skip_El"] = asm["__ZN9Music_Emu5skip_El"];
var __ZN13Stereo_Buffer12read_samplesEPsl = Module["__ZN13Stereo_Buffer12read_samplesEPsl"] = asm["__ZN13Stereo_Buffer12read_samplesEPsl"];
var __ZN11Data_ReaderD1Ev = Module["__ZN11Data_ReaderD1Ev"] = asm["__ZN11Data_ReaderD1Ev"];
var __ZN13Stereo_Buffer10clock_rateEl = Module["__ZN13Stereo_Buffer10clock_rateEl"] = asm["__ZN13Stereo_Buffer10clock_rateEl"];
var __ZN9Nes_Noise5resetEv = Module["__ZN9Nes_Noise5resetEv"] = asm["__ZN9Nes_Noise5resetEv"];
var __ZN13blargg_vectorIPKcE6resizeEj = Module["__ZN13blargg_vectorIPKcE6resizeEj"] = asm["__ZN13blargg_vectorIPKcE6resizeEj"];
var __ZN13Silent_Buffer15set_sample_rateEli = Module["__ZN13Silent_Buffer15set_sample_rateEli"] = asm["__ZN13Silent_Buffer15set_sample_rateEli"];
var __ZN8Gme_File9load_m3u_EPKc = Module["__ZN8Gme_File9load_m3u_EPKc"] = asm["__ZN8Gme_File9load_m3u_EPKc"];
var __ZN14Dual_Resampler6resizeEi = Module["__ZN14Dual_Resampler6resizeEi"] = asm["__ZN14Dual_Resampler6resizeEi"];
var __ZN7Hes_Emu5load_ER11Data_Reader = Module["__ZN7Hes_Emu5load_ER11Data_Reader"] = asm["__ZN7Hes_Emu5load_ER11Data_Reader"];
var __ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib = Module["__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"] = asm["__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"];
var __ZN7Vgm_Emu9update_eqERK9blip_eq_t = Module["__ZN7Vgm_Emu9update_eqERK9blip_eq_t"] = asm["__ZN7Vgm_Emu9update_eqERK9blip_eq_t"];
var __ZN14Effects_Buffer9set_depthEd = Module["__ZN14Effects_Buffer9set_depthEd"] = asm["__ZN14Effects_Buffer9set_depthEd"];
var _malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = asm["_malloc_set_footprint_limit"];
var __ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi = Module["__ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi"] = asm["__ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi"];
var __ZN11Blip_Buffer5clearEi = Module["__ZN11Blip_Buffer5clearEi"] = asm["__ZN11Blip_Buffer5clearEi"];
var __ZN11Ym2612_Impl6YM_SETEii = Module["__ZN11Ym2612_Impl6YM_SETEii"] = asm["__ZN11Ym2612_Impl6YM_SETEii"];
var __ZL13count_silencePsl = Module["__ZL13count_silencePsl"] = asm["__ZL13count_silencePsl"];
var __Z15update_envelopeR6slot_t = Module["__Z15update_envelopeR6slot_t"] = asm["__Z15update_envelopeR6slot_t"];
var __ZN7Kss_EmuD0Ev = Module["__ZN7Kss_EmuD0Ev"] = asm["__ZN7Kss_EmuD0Ev"];
var __ZN14Fir_Resampler_C2EiPs = Module["__ZN14Fir_Resampler_C2EiPs"] = asm["__ZN14Fir_Resampler_C2EiPs"];
var __ZN9Music_Emu15set_voice_namesEPKPKc = Module["__ZN9Music_Emu15set_voice_namesEPKPKc"] = asm["__ZN9Music_Emu15set_voice_namesEPKPKc"];
var __ZNK11Blip_Reader4readEv = Module["__ZNK11Blip_Reader4readEv"] = asm["__ZNK11Blip_Reader4readEv"];
var __ZN13Fir_ResamplerILi12EED1Ev = Module["__ZN13Fir_ResamplerILi12EED1Ev"] = asm["__ZN13Fir_ResamplerILi12EED1Ev"];
var __ZNK13blargg_vectorIA4_cE5beginEv = Module["__ZNK13blargg_vectorIA4_cE5beginEv"] = asm["__ZNK13blargg_vectorIA4_cE5beginEv"];
var __ZN15Mem_File_ReaderD1Ev = Module["__ZN15Mem_File_ReaderD1Ev"] = asm["__ZN15Mem_File_ReaderD1Ev"];
var __ZNK9Music_Emu9equalizerEv = Module["__ZNK9Music_Emu9equalizerEv"] = asm["__ZNK9Music_Emu9equalizerEv"];
var __ZN13Stereo_Buffer5clearEv = Module["__ZN13Stereo_Buffer5clearEv"] = asm["__ZN13Stereo_Buffer5clearEv"];
var __ZN9Music_Emu10mute_voiceEib = Module["__ZN9Music_Emu10mute_voiceEib"] = asm["__ZN9Music_Emu10mute_voiceEib"];
var __ZN11Classic_EmuD0Ev = Module["__ZN11Classic_EmuD0Ev"] = asm["__ZN11Classic_EmuD0Ev"];
var __ZN9Music_Emu4playElPs = Module["__ZN9Music_Emu4playElPs"] = asm["__ZN9Music_Emu4playElPs"];
var __ZN7Nsf_Emu9update_eqERK9blip_eq_t = Module["__ZN7Nsf_Emu9update_eqERK9blip_eq_t"] = asm["__ZN7Nsf_Emu9update_eqERK9blip_eq_t"];
var __Z10ay_cpu_outP6Ay_Cpulji = Module["__Z10ay_cpu_outP6Ay_Cpulji"] = asm["__Z10ay_cpu_outP6Ay_Cpulji"];
var __ZN11Blip_Buffer9bass_freqEi = Module["__ZN11Blip_Buffer9bass_freqEi"] = asm["__ZN11Blip_Buffer9bass_freqEi"];
var __ZN7Gbs_Emu7cpu_jsrEj = Module["__ZN7Gbs_Emu7cpu_jsrEj"] = asm["__ZN7Gbs_Emu7cpu_jsrEj"];
var __ZN6Gb_Env14write_registerEii = Module["__ZN6Gb_Env14write_registerEii"] = asm["__ZN6Gb_Env14write_registerEii"];
var _internal_memalign = Module["_internal_memalign"] = asm["_internal_memalign"];
var __ZN9Sms_Noise5resetEv = Module["__ZN9Sms_Noise5resetEv"] = asm["__ZN9Sms_Noise5resetEv"];
var __ZN10Nes_Square11clock_sweepEi = Module["__ZN10Nes_Square11clock_sweepEi"] = asm["__ZN10Nes_Square11clock_sweepEi"];
var __ZN8Gme_File14clear_playlistEv = Module["__ZN8Gme_File14clear_playlistEv"] = asm["__ZN8Gme_File14clear_playlistEv"];
var __ZN6Ym_EmuI10Ym2612_EmuED1Ev = Module["__ZN6Ym_EmuI10Ym2612_EmuED1Ev"] = asm["__ZN6Ym_EmuI10Ym2612_EmuED1Ev"];
var __ZNK10Blip_SynthILi12ELi1EE6offsetEiiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi12ELi1EE6offsetEiiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi12ELi1EE6offsetEiiP11Blip_Buffer"];
var __ZN8Rom_DataILi4096EED2Ev = Module["__ZN8Rom_DataILi4096EED2Ev"] = asm["__ZN8Rom_DataILi4096EED2Ev"];
var __ZN6Gb_Env5resetEv = Module["__ZN6Gb_Env5resetEv"] = asm["__ZN6Gb_Env5resetEv"];
var __ZNK7Hes_Cpu8end_timeEv = Module["__ZNK7Hes_Cpu8end_timeEv"] = asm["__ZNK7Hes_Cpu8end_timeEv"];
var __ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC2Ev = Module["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC2Ev"] = asm["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC2Ev"];
var __ZNK6Gb_Cpu6remainEv = Module["__ZNK6Gb_Cpu6remainEv"] = asm["__ZNK6Gb_Cpu6remainEv"];
var _realloc_in_place = Module["_realloc_in_place"] = asm["_realloc_in_place"];
var __ZN8Spc_FileD2Ev = Module["__ZN8Spc_FileD2Ev"] = asm["__ZN8Spc_FileD2Ev"];
var __ZN7Nes_Dmc3runEll = Module["__ZN7Nes_Dmc3runEll"] = asm["__ZN7Nes_Dmc3runEll"];
var __ZN11Classic_Emu12mute_voices_Ei = Module["__ZN11Classic_Emu12mute_voices_Ei"] = asm["__ZN11Classic_Emu12mute_voices_Ei"];
var __ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib = Module["__ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"] = asm["__ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"];
var __ZN13Nes_Namco_Apu6accessEv = Module["__ZN13Nes_Namco_Apu6accessEv"] = asm["__ZN13Nes_Namco_Apu6accessEv"];
var __ZL12parse_headerPKhlPN6Ay_Emu6file_tE = Module["__ZL12parse_headerPKhlPN6Ay_Emu6file_tE"] = asm["__ZL12parse_headerPKhlPN6Ay_Emu6file_tE"];
var __ZN13Silent_Buffer9end_frameEi = Module["__ZN13Silent_Buffer9end_frameEi"] = asm["__ZN13Silent_Buffer9end_frameEi"];
var __ZN8Nsf_FileD1Ev = Module["__ZN8Nsf_FileD1Ev"] = asm["__ZN8Nsf_FileD1Ev"];
var __ZN8Kss_FileD0Ev = Module["__ZN8Kss_FileD0Ev"] = asm["__ZN8Kss_FileD0Ev"];
var __ZN9Nsfe_Info16disable_playlistEb = Module["__ZN9Nsfe_Info16disable_playlistEb"] = asm["__ZN9Nsfe_Info16disable_playlistEb"];
var _gme_type_multitrack = Module["_gme_type_multitrack"] = asm["_gme_type_multitrack"];
var __ZN11Classic_Emu10set_bufferEP12Multi_Buffer = Module["__ZN11Classic_Emu10set_bufferEP12Multi_Buffer"] = asm["__ZN11Classic_Emu10set_bufferEP12Multi_Buffer"];
var __ZNK8Rom_DataILi4096EE9mask_addrEl = Module["__ZNK8Rom_DataILi4096EE9mask_addrEl"] = asm["__ZNK8Rom_DataILi4096EE9mask_addrEl"];
var __ZN8Gme_File11copy_field_EPcPKci = Module["__ZN8Gme_File11copy_field_EPcPKci"] = asm["__ZN8Gme_File11copy_field_EPcPKci"];
var __ZN14Dual_ResamplerD0Ev = Module["__ZN14Dual_ResamplerD0Ev"] = asm["__ZN14Dual_ResamplerD0Ev"];
var _gme_set_stereo_depth = Module["_gme_set_stereo_depth"] = asm["_gme_set_stereo_depth"];
var __ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC1Ev = Module["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC1Ev"] = asm["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEEC1Ev"];
var __ZN8Gbs_FileC2Ev = Module["__ZN8Gbs_FileC2Ev"] = asm["__ZN8Gbs_FileC2Ev"];
var __ZNK11Blip_Buffer18resampled_durationEi = Module["__ZNK11Blip_Buffer18resampled_durationEi"] = asm["__ZNK11Blip_Buffer18resampled_durationEi"];
var __ZN12Multi_BufferC2Ei = Module["__ZN12Multi_BufferC2Ei"] = asm["__ZN12Multi_BufferC2Ei"];
var _malloc_max_footprint = Module["_malloc_max_footprint"] = asm["_malloc_max_footprint"];
var __ZL16gym_track_lengthPKhS0_ = Module["__ZL16gym_track_lengthPKhS0_"] = asm["__ZL16gym_track_lengthPKhS0_"];
var __ZN9Music_Emu6unloadEv = Module["__ZN9Music_Emu6unloadEv"] = asm["__ZN9Music_Emu6unloadEv"];
var __ZN10Blip_SynthILi8ELi1EEC2Ev = Module["__ZN10Blip_SynthILi8ELi1EEC2Ev"] = asm["__ZN10Blip_SynthILi8ELi1EEC2Ev"];
var __ZN14Dual_Resampler5setupEddd = Module["__ZN14Dual_Resampler5setupEddd"] = asm["__ZN14Dual_Resampler5setupEddd"];
var __ZN14Effects_Buffer12read_samplesEPsl = Module["__ZN14Effects_Buffer12read_samplesEPsl"] = asm["__ZN14Effects_Buffer12read_samplesEPsl"];
var __ZL12new_sap_filev = Module["__ZL12new_sap_filev"] = asm["__ZL12new_sap_filev"];
var __ZNK12Vgm_Emu_Impl12to_blip_timeEi = Module["__ZNK12Vgm_Emu_Impl12to_blip_timeEi"] = asm["__ZNK12Vgm_Emu_Impl12to_blip_timeEi"];
var __ZN14Effects_Buffer9bass_freqEi = Module["__ZN14Effects_Buffer9bass_freqEi"] = asm["__ZN14Effects_Buffer9bass_freqEi"];
var __ZN6Ay_Cpu11adjust_timeEi = Module["__ZN6Ay_Cpu11adjust_timeEi"] = asm["__ZN6Ay_Cpu11adjust_timeEi"];
var __ZN8Gme_File6unloadEv = Module["__ZN8Gme_File6unloadEv"] = asm["__ZN8Gme_File6unloadEv"];
var __ZN10Ym2612_Emu6write0Eii = Module["__ZN10Ym2612_Emu6write0Eii"] = asm["__ZN10Ym2612_Emu6write0Eii"];
var __ZNK8Gme_File4typeEv = Module["__ZNK8Gme_File4typeEv"] = asm["__ZNK8Gme_File4typeEv"];
var __ZN13Nes_Namco_Apu5resetEv = Module["__ZN13Nes_Namco_Apu5resetEv"] = asm["__ZN13Nes_Namco_Apu5resetEv"];
var __ZN8Gym_FileC2Ev = Module["__ZN8Gym_FileC2Ev"] = asm["__ZN8Gym_FileC2Ev"];
var __ZL12new_vgm_filev = Module["__ZL12new_vgm_filev"] = asm["__ZL12new_vgm_filev"];
var __ZN7Hes_Cpu9end_frameEl = Module["__ZN7Hes_Cpu9end_frameEl"] = asm["__ZN7Hes_Cpu9end_frameEl"];
var __ZN15Std_File_ReaderC2Ev = Module["__ZN15Std_File_ReaderC2Ev"] = asm["__ZN15Std_File_ReaderC2Ev"];
var __ZL3minll680 = Module["__ZL3minll680"] = asm["__ZL3minll680"];
var __ZN8Gme_File4loadER11Data_Reader = Module["__ZN8Gme_File4loadER11Data_Reader"] = asm["__ZN8Gme_File4loadER11Data_Reader"];
var __ZNK12Nes_Vrc6_Apu8Vrc6_Osc6periodEv = Module["__ZNK12Nes_Vrc6_Apu8Vrc6_Osc6periodEv"] = asm["__ZNK12Nes_Vrc6_Apu8Vrc6_Osc6periodEv"];
var __ZN12M3u_PlaylistD2Ev = Module["__ZN12M3u_PlaylistD2Ev"] = asm["__ZN12M3u_PlaylistD2Ev"];
var __ZN8Rom_DataILi8192EED1Ev = Module["__ZN8Rom_DataILi8192EED1Ev"] = asm["__ZN8Rom_DataILi8192EED1Ev"];
var __ZN11Data_Reader4readEPvl = Module["__ZN11Data_Reader4readEPvl"] = asm["__ZN11Data_Reader4readEPvl"];
var __ZN7Sap_Cpu3runEl = Module["__ZN7Sap_Cpu3runEl"] = asm["__ZN7Sap_Cpu3runEl"];
var __ZL11get_gd3_strPKhS0_Pc = Module["__ZL11get_gd3_strPKhS0_Pc"] = asm["__ZL11get_gd3_strPKhS0_Pc"];
var __ZN7Sap_Emu10set_tempo_Ed = Module["__ZN7Sap_Emu10set_tempo_Ed"] = asm["__ZN7Sap_Emu10set_tempo_Ed"];
var __ZN12Multi_Buffer15set_sample_rateEli = Module["__ZN12Multi_Buffer15set_sample_rateEli"] = asm["__ZN12Multi_Buffer15set_sample_rateEli"];
var __ZN7Kss_Cpu3runEl = Module["__ZN7Kss_Cpu3runEl"] = asm["__ZN7Kss_Cpu3runEl"];
var __ZN6Ym_EmuI10Ym2413_EmuE11begin_frameEPs = Module["__ZN6Ym_EmuI10Ym2413_EmuE11begin_frameEPs"] = asm["__ZN6Ym_EmuI10Ym2413_EmuE11begin_frameEPs"];
var __ZN16Remaining_Reader10read_availEPvl = Module["__ZN16Remaining_Reader10read_availEPvl"] = asm["__ZN16Remaining_Reader10read_availEPvl"];
var __ZN7Scc_Apu9treble_eqERK9blip_eq_t = Module["__ZN7Scc_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN7Scc_Apu9treble_eqERK9blip_eq_t"];
var __ZN11Classic_Emu14set_equalizer_ERK15gme_equalizer_t = Module["__ZN11Classic_Emu14set_equalizer_ERK15gme_equalizer_t"] = asm["__ZN11Classic_Emu14set_equalizer_ERK15gme_equalizer_t"];
var __ZN7Nes_Apu14write_registerElji = Module["__ZN7Nes_Apu14write_registerElji"] = asm["__ZN7Nes_Apu14write_registerElji"];
var __ZNK9Music_Emu11sample_rateEv = Module["__ZNK9Music_Emu11sample_rateEv"] = asm["__ZNK9Music_Emu11sample_rateEv"];
var __ZN10Sms_SquareC2Ev = Module["__ZN10Sms_SquareC2Ev"] = asm["__ZN10Sms_SquareC2Ev"];
var __ZN7Nes_DmcC2Ev = Module["__ZN7Nes_DmcC2Ev"] = asm["__ZN7Nes_DmcC2Ev"];
var __ZN10SPC_Filter6enableEb = Module["__ZN10SPC_Filter6enableEb"] = asm["__ZN10SPC_Filter6enableEb"];
var _mallinfo = Module["_mallinfo"] = asm["_mallinfo"];
var __ZN12M3u_PlaylistC2Ev = Module["__ZN12M3u_PlaylistC2Ev"] = asm["__ZN12M3u_PlaylistC2Ev"];
var __ZNK14Fir_Resampler_12input_neededEl = Module["__ZNK14Fir_Resampler_12input_neededEl"] = asm["__ZNK14Fir_Resampler_12input_neededEl"];
var __ZdaPv = Module["__ZdaPv"] = asm["__ZdaPv"];
var __ZN14Effects_Buffer17mix_mono_enhancedEPsl = Module["__ZN14Effects_Buffer17mix_mono_enhancedEPsl"] = asm["__ZN14Effects_Buffer17mix_mono_enhancedEPsl"];
var __ZL11new_hes_emuv = Module["__ZL11new_hes_emuv"] = asm["__ZL11new_hes_emuv"];
var __ZN15Callback_ReaderD1Ev = Module["__ZN15Callback_ReaderD1Ev"] = asm["__ZN15Callback_ReaderD1Ev"];
var __ZN9Music_Emu14set_equalizer_ERK15gme_equalizer_t = Module["__ZN9Music_Emu14set_equalizer_ERK15gme_equalizer_t"] = asm["__ZN9Music_Emu14set_equalizer_ERK15gme_equalizer_t"];
var __GLOBAL__I_a541 = Module["__GLOBAL__I_a541"] = asm["__GLOBAL__I_a541"];
var __ZN7Scc_Apu5writeEiii = Module["__ZN7Scc_Apu5writeEiii"] = asm["__ZN7Scc_Apu5writeEiii"];
var __ZN9blip_eq_tC1Edlll = Module["__ZN9blip_eq_tC1Edlll"] = asm["__ZN9blip_eq_tC1Edlll"];
var __ZN11Blip_Buffer12set_modifiedEv = Module["__ZN11Blip_Buffer12set_modifiedEv"] = asm["__ZN11Blip_Buffer12set_modifiedEv"];
var __ZN15Std_File_ReaderD0Ev = Module["__ZN15Std_File_ReaderD0Ev"] = asm["__ZN15Std_File_ReaderD0Ev"];
var __Z12zero_apu_oscI9Nes_NoiseEvPT_l = Module["__Z12zero_apu_oscI9Nes_NoiseEvPT_l"] = asm["__Z12zero_apu_oscI9Nes_NoiseEvPT_l"];
var __ZNK6Ym_EmuI10Ym2413_EmuE7enabledEv = Module["__ZNK6Ym_EmuI10Ym2413_EmuE7enabledEv"] = asm["__ZNK6Ym_EmuI10Ym2413_EmuE7enabledEv"];
var __ZN13Fir_ResamplerILi24EED1Ev = Module["__ZN13Fir_ResamplerILi24EED1Ev"] = asm["__ZN13Fir_ResamplerILi24EED1Ev"];
var __ZN7Gbs_Emu10set_tempo_Ed = Module["__ZN7Gbs_Emu10set_tempo_Ed"] = asm["__ZN7Gbs_Emu10set_tempo_Ed"];
var __ZN8Spc_FileC1Ev = Module["__ZN8Spc_FileC1Ev"] = asm["__ZN8Spc_FileC1Ev"];
var __ZN12Nes_Fme7_Apu6volumeEd = Module["__ZN12Nes_Fme7_Apu6volumeEd"] = asm["__ZN12Nes_Fme7_Apu6volumeEd"];
var __ZNK6Ay_Cpu4timeEv = Module["__ZNK6Ay_Cpu4timeEv"] = asm["__ZNK6Ay_Cpu4timeEv"];
var __ZN14Effects_Buffer8config_tC2Ev = Module["__ZN14Effects_Buffer8config_tC2Ev"] = asm["__ZN14Effects_Buffer8config_tC2Ev"];
var __ZN6Ym_EmuI10Ym2612_EmuEC2Ev = Module["__ZN6Ym_EmuI10Ym2612_EmuEC2Ev"] = asm["__ZN6Ym_EmuI10Ym2612_EmuEC2Ev"];
var __ZN8Rom_DataILi16384EE8set_addrEl = Module["__ZN8Rom_DataILi16384EE8set_addrEl"] = asm["__ZN8Rom_DataILi16384EE8set_addrEl"];
var __ZNK9Music_Emu13current_trackEv = Module["__ZNK9Music_Emu13current_trackEv"] = asm["__ZNK9Music_Emu13current_trackEv"];
var __ZN10__cxxabiv119__pointer_type_infoD0Ev = Module["__ZN10__cxxabiv119__pointer_type_infoD0Ev"] = asm["__ZN10__cxxabiv119__pointer_type_infoD0Ev"];
var __ZN15Mem_File_Reader10read_availEPvl = Module["__ZN15Mem_File_Reader10read_availEPvl"] = asm["__ZN15Mem_File_Reader10read_availEPvl"];
var __ZN11Ym2612_Impl3runEiPs = Module["__ZN11Ym2612_Impl3runEiPs"] = asm["__ZN11Ym2612_Impl3runEiPs"];
var __ZN8Gme_File8pre_loadEv = Module["__ZN8Gme_File8pre_loadEv"] = asm["__ZN8Gme_File8pre_loadEv"];
var __ZN12Nes_Fme7_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN12Nes_Fme7_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN12Nes_Fme7_Apu10osc_outputEiP11Blip_Buffer"];
var __ZL12to_uppercasePKciPc = Module["__ZL12to_uppercasePKciPc"] = asm["__ZL12to_uppercasePKciPc"];
var _malloc_stats = Module["_malloc_stats"] = asm["_malloc_stats"];
var __ZN8Rom_DataILi16384EED1Ev = Module["__ZN8Rom_DataILi16384EED1Ev"] = asm["__ZN8Rom_DataILi16384EED1Ev"];
var __ZdlPvRKSt9nothrow_t = Module["__ZdlPvRKSt9nothrow_t"] = asm["__ZdlPvRKSt9nothrow_t"];
var __ZN6Ay_EmuD2Ev = Module["__ZN6Ay_EmuD2Ev"] = asm["__ZN6Ay_EmuD2Ev"];
var __ZNK12M3u_PlaylistixEi = Module["__ZNK12M3u_PlaylistixEi"] = asm["__ZNK12M3u_PlaylistixEi"];
var __ZL10parse_timePcPiS0_ = Module["__ZL10parse_timePcPiS0_"] = asm["__ZL10parse_timePcPiS0_"];
var __ZN11Blip_Buffer15set_sample_rateEli = Module["__ZN11Blip_Buffer15set_sample_rateEli"] = asm["__ZN11Blip_Buffer15set_sample_rateEli"];
var __ZN6Ay_Cpu12set_end_timeEl = Module["__ZN6Ay_Cpu12set_end_timeEl"] = asm["__ZN6Ay_Cpu12set_end_timeEl"];
var __ZL3minll368 = Module["__ZL3minll368"] = asm["__ZL3minll368"];
var __ZN7Sap_Emu9call_initEi = Module["__ZN7Sap_Emu9call_initEi"] = asm["__ZN7Sap_Emu9call_initEi"];
var __ZL11new_kss_emuv = Module["__ZL11new_kss_emuv"] = asm["__ZL11new_kss_emuv"];
var __ZN9blip_eq_tC1Ed = Module["__ZN9blip_eq_tC1Ed"] = asm["__ZN9blip_eq_tC1Ed"];
var __ZNK8Hes_File11track_info_EP12track_info_ti = Module["__ZNK8Hes_File11track_info_EP12track_info_ti"] = asm["__ZNK8Hes_File11track_info_EP12track_info_ti"];
var __ZN11Ym2612_Impl11CHANNEL_SETEii = Module["__ZN11Ym2612_Impl11CHANNEL_SETEii"] = asm["__ZN11Ym2612_Impl11CHANNEL_SETEii"];
var __ZNK13blargg_vectorIcE3endEv = Module["__ZNK13blargg_vectorIcE3endEv"] = asm["__ZNK13blargg_vectorIcE3endEv"];
var __ZN10__cxxabiv116__enum_type_infoD0Ev = Module["__ZN10__cxxabiv116__enum_type_infoD0Ev"] = asm["__ZN10__cxxabiv116__enum_type_infoD0Ev"];
var _gme_identify_extension = Module["_gme_identify_extension"] = asm["_gme_identify_extension"];
var __ZN11gme_info_t_nwEj = Module["__ZN11gme_info_t_nwEj"] = asm["__ZN11gme_info_t_nwEj"];
var __ZN7Sms_Apu5resetEji = Module["__ZN7Sms_Apu5resetEji"] = asm["__ZN7Sms_Apu5resetEji"];
var __ZN11Blip_Buffer9end_frameEi = Module["__ZN11Blip_Buffer9end_frameEi"] = asm["__ZN11Blip_Buffer9end_frameEi"];
var __ZN7Sap_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN7Sap_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN7Sap_Apu10osc_outputEiP11Blip_Buffer"];
var __ZN13blargg_vectorIN12M3u_Playlist7entry_tEE6resizeEj = Module["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEE6resizeEj"] = asm["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEE6resizeEj"];
var __ZN7Sms_Apu9run_untilEi = Module["__ZN7Sms_Apu9run_untilEi"] = asm["__ZN7Sms_Apu9run_untilEi"];
var __ZN7Kss_EmuD2Ev = Module["__ZN7Kss_EmuD2Ev"] = asm["__ZN7Kss_EmuD2Ev"];
var __ZN13Stereo_Buffer9end_frameEi = Module["__ZN13Stereo_Buffer9end_frameEi"] = asm["__ZN13Stereo_Buffer9end_frameEi"];
var __ZN14Dual_ResamplerC2Ev = Module["__ZN14Dual_ResamplerC2Ev"] = asm["__ZN14Dual_ResamplerC2Ev"];
var __ZL3minii716 = Module["__ZL3minii716"] = asm["__ZL3minii716"];
var __ZN6Ay_Emu12start_track_Ei = Module["__ZN6Ay_Emu12start_track_Ei"] = asm["__ZN6Ay_Emu12start_track_Ei"];
var __ZN13Silent_Buffer5clearEv = Module["__ZN13Silent_Buffer5clearEv"] = asm["__ZN13Silent_Buffer5clearEv"];
var __ZN10Blip_SynthILi8ELi1EEC1Ev = Module["__ZN10Blip_SynthILi8ELi1EEC1Ev"] = asm["__ZN10Blip_SynthILi8ELi1EEC1Ev"];
var __ZNK11Blip_Buffer6lengthEv = Module["__ZNK11Blip_Buffer6lengthEv"] = asm["__ZNK11Blip_Buffer6lengthEv"];
var __ZN7Kss_Emu5load_ER11Data_Reader = Module["__ZN7Kss_Emu5load_ER11Data_Reader"] = asm["__ZN7Kss_Emu5load_ER11Data_Reader"];
var __ZNK8Nsfe_Emu11track_info_EP12track_info_ti = Module["__ZNK8Nsfe_Emu11track_info_EP12track_info_ti"] = asm["__ZNK8Nsfe_Emu11track_info_EP12track_info_ti"];
var __ZN6Ay_Cpu8set_timeEl = Module["__ZN6Ay_Cpu8set_timeEl"] = asm["__ZN6Ay_Cpu8set_timeEl"];
var __ZL3minll = Module["__ZL3minll"] = asm["__ZL3minll"];
var __ZN7Hes_Emu8cpu_doneEv = Module["__ZN7Hes_Emu8cpu_doneEv"] = asm["__ZN7Hes_Emu8cpu_doneEv"];
var __ZN9Music_Emu8fill_bufEv = Module["__ZN9Music_Emu8fill_bufEv"] = asm["__ZN9Music_Emu8fill_bufEv"];
var __ZN13Nes_Namco_Apu9treble_eqERK9blip_eq_t = Module["__ZN13Nes_Namco_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN13Nes_Namco_Apu9treble_eqERK9blip_eq_t"];
var __ZN8Rom_DataILi16384EE7at_addrEl = Module["__ZN8Rom_DataILi16384EE7at_addrEl"] = asm["__ZN8Rom_DataILi16384EE7at_addrEl"];
var __ZN7Spc_Dsp5extraEv = Module["__ZN7Spc_Dsp5extraEv"] = asm["__ZN7Spc_Dsp5extraEv"];
var __ZN8Sap_FileD1Ev = Module["__ZN8Sap_FileD1Ev"] = asm["__ZN8Sap_FileD1Ev"];
var __ZN8Hes_FileC1Ev = Module["__ZN8Hes_FileC1Ev"] = asm["__ZN8Hes_FileC1Ev"];
var _gme_enable_accuracy = Module["_gme_enable_accuracy"] = asm["_gme_enable_accuracy"];
var __ZN7Hes_Apu9treble_eqERK9blip_eq_t = Module["__ZN7Hes_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN7Hes_Apu9treble_eqERK9blip_eq_t"];
var __ZNK13blargg_vectorIsE3endEv = Module["__ZNK13blargg_vectorIsE3endEv"] = asm["__ZNK13blargg_vectorIsE3endEv"];
var __ZN7Gym_Emu9load_mem_EPKhl = Module["__ZN7Gym_Emu9load_mem_EPKhl"] = asm["__ZN7Gym_Emu9load_mem_EPKhl"];
var __ZN12Nes_Triangle3runEll = Module["__ZN12Nes_Triangle3runEll"] = asm["__ZN12Nes_Triangle3runEll"];
var __ZN10Nes_SquareC1EPK10Blip_SynthILi12ELi1EE = Module["__ZN10Nes_SquareC1EPK10Blip_SynthILi12ELi1EE"] = asm["__ZN10Nes_SquareC1EPK10Blip_SynthILi12ELi1EE"];
var __ZdlPv = Module["__ZdlPv"] = asm["__ZdlPv"];
var __ZN6Gb_Cpu8get_codeEj = Module["__ZN6Gb_Cpu8get_codeEj"] = asm["__ZN6Gb_Cpu8get_codeEj"];
var __ZN7Kss_Emu8set_bankEii = Module["__ZN7Kss_Emu8set_bankEii"] = asm["__ZN7Kss_Emu8set_bankEii"];
var _strtod_l = Module["_strtod_l"] = asm["_strtod_l"];
var __ZNK8Sap_File11track_info_EP12track_info_ti = Module["__ZNK8Sap_File11track_info_EP12track_info_ti"] = asm["__ZNK8Sap_File11track_info_EP12track_info_ti"];
var _gme_ignore_silence = Module["_gme_ignore_silence"] = asm["_gme_ignore_silence"];
var __Z13kss_cpu_writeP7Kss_Cpuji = Module["__Z13kss_cpu_writeP7Kss_Cpuji"] = asm["__Z13kss_cpu_writeP7Kss_Cpuji"];
var __ZN9Music_Emu12start_track_Ei = Module["__ZN9Music_Emu12start_track_Ei"] = asm["__ZN9Music_Emu12start_track_Ei"];
var __ZN7Kss_Cpu5writeEj = Module["__ZN7Kss_Cpu5writeEj"] = asm["__ZN7Kss_Cpu5writeEj"];
var __ZN11Mono_Buffer5clearEv = Module["__ZN11Mono_Buffer5clearEv"] = asm["__ZN11Mono_Buffer5clearEv"];
var __ZNK13blargg_vectorIcE5beginEv = Module["__ZNK13blargg_vectorIcE5beginEv"] = asm["__ZNK13blargg_vectorIcE5beginEv"];
var __ZN11Blip_BufferC2Ev = Module["__ZN11Blip_BufferC2Ev"] = asm["__ZN11Blip_BufferC2Ev"];
var __ZN7Gbs_EmuC2Ev = Module["__ZN7Gbs_EmuC2Ev"] = asm["__ZN7Gbs_EmuC2Ev"];
var __ZN9Nsfe_FileC2Ev = Module["__ZN9Nsfe_FileC2Ev"] = asm["__ZN9Nsfe_FileC2Ev"];
var __ZN8Rom_DataILi16384EE8unmappedEv = Module["__ZN8Rom_DataILi16384EE8unmappedEv"] = asm["__ZN8Rom_DataILi16384EE8unmappedEv"];
var __ZN7Kss_Emu9cpu_writeEji = Module["__ZN7Kss_Emu9cpu_writeEji"] = asm["__ZN7Kss_Emu9cpu_writeEji"];
var __ZN7Nsf_Emu8cpu_readEj = Module["__ZN7Nsf_Emu8cpu_readEj"] = asm["__ZN7Nsf_Emu8cpu_readEj"];
var __ZN8Snes_Spc15reset_time_regsEv = Module["__ZN8Snes_Spc15reset_time_regsEv"] = asm["__ZN8Snes_Spc15reset_time_regsEv"];
var __ZN7Ay_FileC2Ev = Module["__ZN7Ay_FileC2Ev"] = asm["__ZN7Ay_FileC2Ev"];
var _malloc_footprint = Module["_malloc_footprint"] = asm["_malloc_footprint"];
var __ZNK10Blip_SynthILi12ELi1EE16offset_resampledEjiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi12ELi1EE16offset_resampledEjiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi12ELi1EE16offset_resampledEjiP11Blip_Buffer"];
var __ZN7Sms_ApuC2Ev = Module["__ZN7Sms_ApuC2Ev"] = asm["__ZN7Sms_ApuC2Ev"];
var __ZN7Spc_Emu10set_tempo_Ed = Module["__ZN7Spc_Emu10set_tempo_Ed"] = asm["__ZN7Spc_Emu10set_tempo_Ed"];
var __ZN8Nsfe_Emu6unloadEv = Module["__ZN8Nsfe_Emu6unloadEv"] = asm["__ZN8Nsfe_Emu6unloadEv"];
var __ZL10next_fieldPcPi = Module["__ZL10next_fieldPcPi"] = asm["__ZL10next_fieldPcPi"];
var __ZN7Hes_Emu8cpu_readEj = Module["__ZN7Hes_Emu8cpu_readEj"] = asm["__ZN7Hes_Emu8cpu_readEj"];
var __ZN12Nes_Vrc6_Apu9write_oscEiiii = Module["__ZN12Nes_Vrc6_Apu9write_oscEiiii"] = asm["__ZN12Nes_Vrc6_Apu9write_oscEiiii"];
var __ZN7Vgm_EmuD0Ev = Module["__ZN7Vgm_EmuD0Ev"] = asm["__ZN7Vgm_EmuD0Ev"];
var __ZN12Vgm_Emu_ImplD0Ev = Module["__ZN12Vgm_Emu_ImplD0Ev"] = asm["__ZN12Vgm_Emu_ImplD0Ev"];
var __ZN13blargg_vectorIcED1Ev = Module["__ZN13blargg_vectorIcED1Ev"] = asm["__ZN13blargg_vectorIcED1Ev"];
var __ZN8Gme_File8set_typeEPK11gme_type_t_ = Module["__ZN8Gme_File8set_typeEPK11gme_type_t_"] = asm["__ZN8Gme_File8set_typeEPK11gme_type_t_"];
var _free = Module["_free"] = asm["_free"];
var __ZN7Hes_EmuD2Ev = Module["__ZN7Hes_EmuD2Ev"] = asm["__ZN7Hes_EmuD2Ev"];
var __ZN12M3u_Playlist4loadEPKc = Module["__ZN12M3u_Playlist4loadEPKc"] = asm["__ZN12M3u_Playlist4loadEPKc"];
var __ZNK8Gme_File10track_infoEP12track_info_ti = Module["__ZNK8Gme_File10track_infoEP12track_info_ti"] = asm["__ZNK8Gme_File10track_infoEP12track_info_ti"];
var __ZNK8Vgm_File11track_info_EP12track_info_ti = Module["__ZNK8Vgm_File11track_info_EP12track_info_ti"] = asm["__ZNK8Vgm_File11track_info_EP12track_info_ti"];
var __ZN11Data_ReaderD2Ev = Module["__ZN11Data_ReaderD2Ev"] = asm["__ZN11Data_ReaderD2Ev"];
var __ZN16Remaining_ReaderD0Ev = Module["__ZN16Remaining_ReaderD0Ev"] = asm["__ZN16Remaining_ReaderD0Ev"];
var __ZN7Gym_Emu12start_track_Ei = Module["__ZN7Gym_Emu12start_track_Ei"] = asm["__ZN7Gym_Emu12start_track_Ei"];
var __ZN7Sap_Cpu15update_end_timeEll = Module["__ZN7Sap_Cpu15update_end_timeEll"] = asm["__ZN7Sap_Cpu15update_end_timeEll"];
var __ZL16check_gd3_headerPKhl = Module["__ZL16check_gd3_headerPKhl"] = asm["__ZL16check_gd3_headerPKhl"];
var _gme_load_m3u_data = Module["_gme_load_m3u_data"] = asm["_gme_load_m3u_data"];
var __ZN11Blip_Synth_11volume_unitEd = Module["__ZN11Blip_Synth_11volume_unitEd"] = asm["__ZN11Blip_Synth_11volume_unitEd"];
var __ZN7Spc_Dsp5resetEv = Module["__ZN7Spc_Dsp5resetEv"] = asm["__ZN7Spc_Dsp5resetEv"];
var __warnx = Module["__warnx"] = asm["__warnx"];
var __ZNK8Rom_DataILi8192EE9file_sizeEv = Module["__ZNK8Rom_DataILi8192EE9file_sizeEv"] = asm["__ZNK8Rom_DataILi8192EE9file_sizeEv"];
var __ZNK10__cxxabiv116__enum_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv116__enum_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv116__enum_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __ZN9Music_Emu16enable_accuracy_Eb = Module["__ZN9Music_Emu16enable_accuracy_Eb"] = asm["__ZN9Music_Emu16enable_accuracy_Eb"];
var _independent_calloc = Module["_independent_calloc"] = asm["_independent_calloc"];
var __ZNK7Kss_Emu11track_info_EP12track_info_ti = Module["__ZNK7Kss_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Kss_Emu11track_info_EP12track_info_ti"];
var __ZN6Ym_EmuI10Ym2413_EmuE9run_untilEi = Module["__ZN6Ym_EmuI10Ym2413_EmuE9run_untilEi"] = asm["__ZN6Ym_EmuI10Ym2413_EmuE9run_untilEi"];
var __ZN14Fir_Resampler_D2Ev = Module["__ZN14Fir_Resampler_D2Ev"] = asm["__ZN14Fir_Resampler_D2Ev"];
var __ZN9Music_Emu15set_voice_countEi = Module["__ZN9Music_Emu15set_voice_countEi"] = asm["__ZN9Music_Emu15set_voice_countEi"];
var __ZN6Ay_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN6Ay_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN6Ay_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var __Z9pin_rangeiii = Module["__Z9pin_rangeiii"] = asm["__Z9pin_rangeiii"];
var __ZN10Ym2413_Emu5resetEv = Module["__ZN10Ym2413_Emu5resetEv"] = asm["__ZN10Ym2413_Emu5resetEv"];
var _gme_warning = Module["_gme_warning"] = asm["_gme_warning"];
var __ZN10Blip_SynthILi12ELi15EEC2Ev = Module["__ZN10Blip_SynthILi12ELi15EEC2Ev"] = asm["__ZN10Blip_SynthILi12ELi15EEC2Ev"];
var __vwarn = Module["__vwarn"] = asm["__vwarn"];
var __ZN7Nes_Apu6outputEP11Blip_Buffer = Module["__ZN7Nes_Apu6outputEP11Blip_Buffer"] = asm["__ZN7Nes_Apu6outputEP11Blip_Buffer"];
var __ZN7Vgm_Emu9load_mem_EPKhl = Module["__ZN7Vgm_Emu9load_mem_EPKhl"] = asm["__ZN7Vgm_Emu9load_mem_EPKhl"];
var __ZNK7Sap_Emu11play_periodEv = Module["__ZNK7Sap_Emu11play_periodEv"] = asm["__ZNK7Sap_Emu11play_periodEv"];
var __ZN8Gbs_FileD1Ev = Module["__ZN8Gbs_FileD1Ev"] = asm["__ZN8Gbs_FileD1Ev"];
var __ZN11Ym2612_Impl6KEY_ONER9channel_ti = Module["__ZN11Ym2612_Impl6KEY_ONER9channel_ti"] = asm["__ZN11Ym2612_Impl6KEY_ONER9channel_ti"];
var __ZN10Blip_SynthILi8ELi1EE6outputEP11Blip_Buffer = Module["__ZN10Blip_SynthILi8ELi1EE6outputEP11Blip_Buffer"] = asm["__ZN10Blip_SynthILi8ELi1EE6outputEP11Blip_Buffer"];
var __ZN7Nes_Cpu8set_timeEl = Module["__ZN7Nes_Cpu8set_timeEl"] = asm["__ZN7Nes_Cpu8set_timeEl"];
var _gme_set_user_cleanup = Module["_gme_set_user_cleanup"] = asm["_gme_set_user_cleanup"];
var __ZN11Blip_Reader4nextEi = Module["__ZN11Blip_Reader4nextEi"] = asm["__ZN11Blip_Reader4nextEi"];
var __ZN7Nsf_Emu8pcm_readEPvj = Module["__ZN7Nsf_Emu8pcm_readEPvj"] = asm["__ZN7Nsf_Emu8pcm_readEPvj"];
var __ZN8Gme_File9load_fileEPKc = Module["__ZN8Gme_File9load_fileEPKc"] = asm["__ZN8Gme_File9load_fileEPKc"];
var __ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib = Module["__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"] = asm["__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"];
var __ZNK7Gym_Emu12track_lengthEv = Module["__ZNK7Gym_Emu12track_lengthEv"] = asm["__ZNK7Gym_Emu12track_lengthEv"];
var __ZN11Ym2612_Impl6write0Eii = Module["__ZN11Ym2612_Impl6write0Eii"] = asm["__ZN11Ym2612_Impl6write0Eii"];
var __ZN7Gb_Wave14write_registerEii = Module["__ZN7Gb_Wave14write_registerEii"] = asm["__ZN7Gb_Wave14write_registerEii"];
var __ZN7Hes_Emu10set_tempo_Ed = Module["__ZN7Hes_Emu10set_tempo_Ed"] = asm["__ZN7Hes_Emu10set_tempo_Ed"];
var __ZL16update_envelope_P6slot_t = Module["__ZL16update_envelope_P6slot_t"] = asm["__ZL16update_envelope_P6slot_t"];
var __ZN7Gbs_Emu9cpu_writeEji = Module["__ZN7Gbs_Emu9cpu_writeEji"] = asm["__ZN7Gbs_Emu9cpu_writeEji"];
var __ZN11Mono_BufferD0Ev = Module["__ZN11Mono_BufferD0Ev"] = asm["__ZN11Mono_BufferD0Ev"];
var __ZN8Nsf_FileC2Ev = Module["__ZN8Nsf_FileC2Ev"] = asm["__ZN8Nsf_FileC2Ev"];
var __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi = Module["__ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi"] = asm["__ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi"];
var __ZN13Nes_Namco_Apu10write_dataEii = Module["__ZN13Nes_Namco_Apu10write_dataEii"] = asm["__ZN13Nes_Namco_Apu10write_dataEii"];
var __ZNK14Fir_Resampler_6avail_El = Module["__ZNK14Fir_Resampler_6avail_El"] = asm["__ZNK14Fir_Resampler_6avail_El"];
var __ZN13blargg_vectorIN12M3u_Playlist7entry_tEE5clearEv = Module["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEE5clearEv"] = asm["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEE5clearEv"];
var __ZN12M3u_Playlist5parseEv = Module["__ZN12M3u_Playlist5parseEv"] = asm["__ZN12M3u_Playlist5parseEv"];
var __ZN13Nes_Namco_Apu9end_frameEi = Module["__ZN13Nes_Namco_Apu9end_frameEi"] = asm["__ZN13Nes_Namco_Apu9end_frameEi"];
var __ZN11Mono_Buffer10clock_rateEl = Module["__ZN11Mono_Buffer10clock_rateEl"] = asm["__ZN11Mono_Buffer10clock_rateEl"];
var __ZNK8Rom_DataILi4096EE4sizeEv = Module["__ZNK8Rom_DataILi4096EE4sizeEv"] = asm["__ZNK8Rom_DataILi4096EE4sizeEv"];
var _getopt_internal = Module["_getopt_internal"] = asm["_getopt_internal"];
var __ZN8Gme_File9load_mem_EPKhl = Module["__ZN8Gme_File9load_mem_EPKhl"] = asm["__ZN8Gme_File9load_mem_EPKhl"];
var __ZN10Ym2612_Emu8set_rateEdd = Module["__ZN10Ym2612_Emu8set_rateEdd"] = asm["__ZN10Ym2612_Emu8set_rateEdd"];
var __ZNK7Nsf_Emu11track_info_EP12track_info_ti = Module["__ZNK7Nsf_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Nsf_Emu11track_info_EP12track_info_ti"];
var __ZN12Vgm_Emu_Impl10play_frameEiiPs = Module["__ZN12Vgm_Emu_Impl10play_frameEiiPs"] = asm["__ZN12Vgm_Emu_Impl10play_frameEiiPs"];
var __ZN14Fir_Resampler_10skip_inputEl = Module["__ZN14Fir_Resampler_10skip_inputEl"] = asm["__ZN14Fir_Resampler_10skip_inputEl"];
var __ZL11parse_trackPcRN12M3u_Playlist7entry_tEPi = Module["__ZL11parse_trackPcRN12M3u_Playlist7entry_tEPi"] = asm["__ZL11parse_trackPcRN12M3u_Playlist7entry_tEPi"];
var _gme_open_file = Module["_gme_open_file"] = asm["_gme_open_file"];
var __ZN7Sap_Emu11run_routineEj = Module["__ZN7Sap_Emu11run_routineEj"] = asm["__ZN7Sap_Emu11run_routineEj"];
var __ZN14Fir_Resampler_10time_ratioEddd = Module["__ZN14Fir_Resampler_10time_ratioEddd"] = asm["__ZN14Fir_Resampler_10time_ratioEddd"];
var __ZThn336_N7Vgm_EmuD1Ev = Module["__ZThn336_N7Vgm_EmuD1Ev"] = asm["__ZThn336_N7Vgm_EmuD1Ev"];
var __ZN9Nsfe_FileD1Ev = Module["__ZN9Nsfe_FileD1Ev"] = asm["__ZN9Nsfe_FileD1Ev"];
var __ZNK10__cxxabiv116__shim_type_info5noop1Ev = Module["__ZNK10__cxxabiv116__shim_type_info5noop1Ev"] = asm["__ZNK10__cxxabiv116__shim_type_info5noop1Ev"];
var __ZNK13blargg_vectorIN12M3u_Playlist7entry_tEEixEj = Module["__ZNK13blargg_vectorIN12M3u_Playlist7entry_tEEixEj"] = asm["__ZNK13blargg_vectorIN12M3u_Playlist7entry_tEEixEj"];
var __ZN12Sap_Apu_Impl6volumeEd = Module["__ZN12Sap_Apu_Impl6volumeEd"] = asm["__ZN12Sap_Apu_Impl6volumeEd"];
var __ZN9Nes_NoiseC2Ev = Module["__ZN9Nes_NoiseC2Ev"] = asm["__ZN9Nes_NoiseC2Ev"];
var __ZN7Hes_EmuC2Ev = Module["__ZN7Hes_EmuC2Ev"] = asm["__ZN7Hes_EmuC2Ev"];
var __ZThn320_N7Gym_EmuD0Ev = Module["__ZThn320_N7Gym_EmuD0Ev"] = asm["__ZThn320_N7Gym_EmuD0Ev"];
var __ZNK7Kss_Emu9bank_sizeEv = Module["__ZNK7Kss_Emu9bank_sizeEv"] = asm["__ZNK7Kss_Emu9bank_sizeEv"];
var __ZN6Ay_CpuC2Ev = Module["__ZN6Ay_CpuC2Ev"] = asm["__ZN6Ay_CpuC2Ev"];
var __ZN8Hes_FileD2Ev = Module["__ZN8Hes_FileD2Ev"] = asm["__ZN8Hes_FileD2Ev"];
var __ZNK10Blip_SynthILi8ELi1EE6offsetEiiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi8ELi1EE6offsetEiiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi8ELi1EE6offsetEiiP11Blip_Buffer"];
var __ZN7Gb_Wave3runEiii = Module["__ZN7Gb_Wave3runEiii"] = asm["__ZN7Gb_Wave3runEiii"];
var __ZN8Gme_File8load_memEPKvl = Module["__ZN8Gme_File8load_memEPKvl"] = asm["__ZN8Gme_File8load_memEPKvl"];
var __ZNK7Ay_File11track_info_EP12track_info_ti = Module["__ZNK7Ay_File11track_info_EP12track_info_ti"] = asm["__ZNK7Ay_File11track_info_EP12track_info_ti"];
var __ZNKSt20bad_array_new_length4whatEv = Module["__ZNKSt20bad_array_new_length4whatEv"] = asm["__ZNKSt20bad_array_new_length4whatEv"];
var __ZN13blargg_vectorIcEC2Ev = Module["__ZN13blargg_vectorIcEC2Ev"] = asm["__ZN13blargg_vectorIcEC2Ev"];
var __ZN7Sap_Apu9run_untilEi = Module["__ZN7Sap_Apu9run_untilEi"] = asm["__ZN7Sap_Apu9run_untilEi"];
var __ZN7Sap_EmuD2Ev = Module["__ZN7Sap_EmuD2Ev"] = asm["__ZN7Sap_EmuD2Ev"];
var __ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib = Module["__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"] = asm["__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"];
var __ZN8Snes_Spc10clear_echoEv = Module["__ZN8Snes_Spc10clear_echoEv"] = asm["__ZN8Snes_Spc10clear_echoEv"];
var __ZN8Nsf_File5load_ER11Data_Reader = Module["__ZN8Nsf_File5load_ER11Data_Reader"] = asm["__ZN8Nsf_File5load_ER11Data_Reader"];
var __ZNK9Music_Emu11track_endedEv = Module["__ZNK9Music_Emu11track_endedEv"] = asm["__ZNK9Music_Emu11track_endedEv"];
var __ZN7Spc_Emu16enable_accuracy_Eb = Module["__ZN7Spc_Emu16enable_accuracy_Eb"] = asm["__ZN7Spc_Emu16enable_accuracy_Eb"];
var __ZN7Hes_Cpu7set_mmrEii = Module["__ZN7Hes_Cpu7set_mmrEii"] = asm["__ZN7Hes_Cpu7set_mmrEii"];
var __ZNK14Fir_Resampler_7writtenEv = Module["__ZNK14Fir_Resampler_7writtenEv"] = asm["__ZNK14Fir_Resampler_7writtenEv"];
var __ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi = Module["__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"] = asm["__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"];
var __ZNSt9type_infoD2Ev = Module["__ZNSt9type_infoD2Ev"] = asm["__ZNSt9type_infoD2Ev"];
var __ZN13Nes_Namco_ApunwEj = Module["__ZN13Nes_Namco_ApunwEj"] = asm["__ZN13Nes_Namco_ApunwEj"];
var __ZL11parse_time_PcPi = Module["__ZL11parse_time_PcPi"] = asm["__ZL11parse_time_PcPi"];
var __ZN7Sap_Emu12start_track_Ei = Module["__ZN7Sap_Emu12start_track_Ei"] = asm["__ZN7Sap_Emu12start_track_Ei"];
var __ZN7Nsf_Emu5load_ER11Data_Reader = Module["__ZN7Nsf_Emu5load_ER11Data_Reader"] = asm["__ZN7Nsf_Emu5load_ER11Data_Reader"];
var __ZN10Nes_Square3runEll = Module["__ZN10Nes_Square3runEll"] = asm["__ZN10Nes_Square3runEll"];
var __ZNK9Nsfe_Info11track_info_EP12track_info_ti = Module["__ZNK9Nsfe_Info11track_info_EP12track_info_ti"] = asm["__ZNK9Nsfe_Info11track_info_EP12track_info_ti"];
var __ZN13Stereo_Buffer20mix_stereo_no_centerEPsl = Module["__ZN13Stereo_Buffer20mix_stereo_no_centerEPsl"] = asm["__ZN13Stereo_Buffer20mix_stereo_no_centerEPsl"];
var __ZN10SPC_Filter8set_gainEi = Module["__ZN10SPC_Filter8set_gainEi"] = asm["__ZN10SPC_Filter8set_gainEi"];
var __ZL3maxll = Module["__ZL3maxll"] = asm["__ZL3maxll"];
var __ZN7Sap_Emu8cpu_readEj = Module["__ZN7Sap_Emu8cpu_readEj"] = asm["__ZN7Sap_Emu8cpu_readEj"];
var __ZN7Nes_Apu18nonlinear_tnd_gainEv = Module["__ZN7Nes_Apu18nonlinear_tnd_gainEv"] = asm["__ZN7Nes_Apu18nonlinear_tnd_gainEv"];
var _posix_memalign = Module["_posix_memalign"] = asm["_posix_memalign"];
var __ZN10Blip_SynthILi8ELi1EE6volumeEd = Module["__ZN10Blip_SynthILi8ELi1EE6volumeEd"] = asm["__ZN10Blip_SynthILi8ELi1EE6volumeEd"];
var __ZL15copy_sap_fieldsRKN7Sap_Emu6info_tEP12track_info_t = Module["__ZL15copy_sap_fieldsRKN7Sap_Emu6info_tEP12track_info_t"] = asm["__ZL15copy_sap_fieldsRKN7Sap_Emu6info_tEP12track_info_t"];
var __ZN9Gb_Square5resetEv = Module["__ZN9Gb_Square5resetEv"] = asm["__ZN9Gb_Square5resetEv"];
var __ZN12Nes_Vrc6_Apu6volumeEd = Module["__ZN12Nes_Vrc6_Apu6volumeEd"] = asm["__ZN12Nes_Vrc6_Apu6volumeEd"];
var __ZN8Vgm_FileD2Ev = Module["__ZN8Vgm_FileD2Ev"] = asm["__ZN8Vgm_FileD2Ev"];
var __ZN8Snes_Spc11regs_loadedEv = Module["__ZN8Snes_Spc11regs_loadedEv"] = asm["__ZN8Snes_Spc11regs_loadedEv"];
var __ZN8Nsfe_EmuD0Ev = Module["__ZN8Nsfe_EmuD0Ev"] = asm["__ZN8Nsfe_EmuD0Ev"];
var __ZN9Gme_Info_D0Ev = Module["__ZN9Gme_Info_D0Ev"] = asm["__ZN9Gme_Info_D0Ev"];
var __ZN10__cxxabiv117__pbase_type_infoD0Ev = Module["__ZN10__cxxabiv117__pbase_type_infoD0Ev"] = asm["__ZN10__cxxabiv117__pbase_type_infoD0Ev"];
var __ZN8Gym_FileC1Ev = Module["__ZN8Gym_FileC1Ev"] = asm["__ZN8Gym_FileC1Ev"];
var __ZN13blargg_vectorIhED2Ev = Module["__ZN13blargg_vectorIhED2Ev"] = asm["__ZN13blargg_vectorIhED2Ev"];
var __ZN7Sms_Apu6outputEP11Blip_Buffer = Module["__ZN7Sms_Apu6outputEP11Blip_Buffer"] = asm["__ZN7Sms_Apu6outputEP11Blip_Buffer"];
var __ZN11gme_info_t_dlEPv = Module["__ZN11gme_info_t_dlEPv"] = asm["__ZN11gme_info_t_dlEPv"];
var __ZN8Rom_DataILi8192EEC1Ev = Module["__ZN8Rom_DataILi8192EEC1Ev"] = asm["__ZN8Rom_DataILi8192EEC1Ev"];
var __ZN8Gym_FileD2Ev = Module["__ZN8Gym_FileD2Ev"] = asm["__ZN8Gym_FileD2Ev"];
var _ialloc = Module["_ialloc"] = asm["_ialloc"];
var __ZN8Nsfe_Emu12start_track_Ei = Module["__ZN8Nsfe_Emu12start_track_Ei"] = asm["__ZN8Nsfe_Emu12start_track_Ei"];
var __ZL11new_sap_emuv = Module["__ZL11new_sap_emuv"] = asm["__ZL11new_sap_emuv"];
var __ZN6Ay_Apu5resetEv = Module["__ZN6Ay_Apu5resetEv"] = asm["__ZN6Ay_Apu5resetEv"];
var __ZL15copy_kss_fieldsRKN7Kss_Emu8header_tEP12track_info_t = Module["__ZL15copy_kss_fieldsRKN7Kss_Emu8header_tEP12track_info_t"] = asm["__ZL15copy_kss_fieldsRKN7Kss_Emu8header_tEP12track_info_t"];
var __ZN8Gme_File11set_warningEPKc = Module["__ZN8Gme_File11set_warningEPKc"] = asm["__ZN8Gme_File11set_warningEPKc"];
var __ZN9Nsfe_FileC1Ev = Module["__ZN9Nsfe_FileC1Ev"] = asm["__ZN9Nsfe_FileC1Ev"];
var __ZN14Effects_Buffer10clock_rateEl = Module["__ZN14Effects_Buffer10clock_rateEl"] = asm["__ZN14Effects_Buffer10clock_rateEl"];
var __ZN14Effects_Buffer15set_sample_rateEli = Module["__ZN14Effects_Buffer15set_sample_rateEli"] = asm["__ZN14Effects_Buffer15set_sample_rateEli"];
var __ZN9Nsfe_Info6unloadEv = Module["__ZN9Nsfe_Info6unloadEv"] = asm["__ZN9Nsfe_Info6unloadEv"];
var __ZN13blargg_vectorIcE5clearEv = Module["__ZN13blargg_vectorIcE5clearEv"] = asm["__ZN13blargg_vectorIcE5clearEv"];
var __ZL8gen_polymiPh = Module["__ZL8gen_polymiPh"] = asm["__ZL8gen_polymiPh"];
var __ZNK10Blip_SynthILi12ELi1EE13offset_inlineEiiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi12ELi1EE13offset_inlineEiiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi12ELi1EE13offset_inlineEiiP11Blip_Buffer"];
var __ZN11Blip_Buffer11mix_samplesEPKsl = Module["__ZN11Blip_Buffer11mix_samplesEPKsl"] = asm["__ZN11Blip_Buffer11mix_samplesEPKsl"];
var __ZN8Kss_FileC1Ev = Module["__ZN8Kss_FileC1Ev"] = asm["__ZN8Kss_FileC1Ev"];
var __ZN9Music_Emu4seekEl = Module["__ZN9Music_Emu4seekEl"] = asm["__ZN9Music_Emu4seekEl"];
var __ZN11Blip_Buffer14remove_silenceEl = Module["__ZN11Blip_Buffer14remove_silenceEl"] = asm["__ZN11Blip_Buffer14remove_silenceEl"];
var __ZN6Ay_Emu10set_tempo_Ed = Module["__ZN6Ay_Emu10set_tempo_Ed"] = asm["__ZN6Ay_Emu10set_tempo_Ed"];
var __ZNK10__cxxabiv120__function_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv120__function_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv120__function_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __ZN11Blip_Buffer12read_samplesEPsli = Module["__ZN11Blip_Buffer12read_samplesEPsli"] = asm["__ZN11Blip_Buffer12read_samplesEPsli"];
var __Z9ay_cpu_inP6Ay_Cpuj = Module["__Z9ay_cpu_inP6Ay_Cpuj"] = asm["__Z9ay_cpu_inP6Ay_Cpuj"];
var __ZN13Nes_Namco_Apu9run_untilEi = Module["__ZN13Nes_Namco_Apu9run_untilEi"] = asm["__ZN13Nes_Namco_Apu9run_untilEi"];
var __ZN8Snes_Spc11mute_voicesEi = Module["__ZN8Snes_Spc11mute_voicesEi"] = asm["__ZN8Snes_Spc11mute_voicesEi"];
var __ZNSt10bad_typeidD0Ev = Module["__ZNSt10bad_typeidD0Ev"] = asm["__ZNSt10bad_typeidD0Ev"];
var __ZNK7Nes_Cpu4timeEv = Module["__ZNK7Nes_Cpu4timeEv"] = asm["__ZNK7Nes_Cpu4timeEv"];
var _gme_mute_voices = Module["_gme_mute_voices"] = asm["_gme_mute_voices"];
var __ZN10__cxxabiv121__vmi_class_type_infoD0Ev = Module["__ZN10__cxxabiv121__vmi_class_type_infoD0Ev"] = asm["__ZN10__cxxabiv121__vmi_class_type_infoD0Ev"];
var __ZNK13blargg_vectorIA4_cE4sizeEv = Module["__ZNK13blargg_vectorIA4_cE4sizeEv"] = asm["__ZNK13blargg_vectorIA4_cE4sizeEv"];
var __ZN7Kss_Cpu7map_memEjmPvPKv = Module["__ZN7Kss_Cpu7map_memEjmPvPKv"] = asm["__ZN7Kss_Cpu7map_memEjmPvPKv"];
var __ZNK14Fir_Resampler_9max_writeEv = Module["__ZNK14Fir_Resampler_9max_writeEv"] = asm["__ZNK14Fir_Resampler_9max_writeEv"];
var __ZN13Subset_ReaderD2Ev = Module["__ZN13Subset_ReaderD2Ev"] = asm["__ZN13Subset_ReaderD2Ev"];
var __ZN8Rom_DataILi4096EE7at_addrEl = Module["__ZN8Rom_DataILi4096EE7at_addrEl"] = asm["__ZN8Rom_DataILi4096EE7at_addrEl"];
var __ZN8Gme_File7warningEv = Module["__ZN8Gme_File7warningEv"] = asm["__ZN8Gme_File7warningEv"];
var __ZN12Vgm_Emu_ImplC2Ev = Module["__ZN12Vgm_Emu_ImplC2Ev"] = asm["__ZN12Vgm_Emu_ImplC2Ev"];
var __ZN11Mono_Buffer12read_samplesEPsl = Module["__ZN11Mono_Buffer12read_samplesEPsl"] = asm["__ZN11Mono_Buffer12read_samplesEPsl"];
var __ZN18Silent_Blip_BufferC2Ev = Module["__ZN18Silent_Blip_BufferC2Ev"] = asm["__ZN18Silent_Blip_BufferC2Ev"];
var __ZN8Spc_File5load_ER11Data_Reader = Module["__ZN8Spc_File5load_ER11Data_Reader"] = asm["__ZN8Spc_File5load_ER11Data_Reader"];
var __ZNK13blargg_vectorIhE4sizeEv = Module["__ZNK13blargg_vectorIhE4sizeEv"] = asm["__ZNK13blargg_vectorIhE4sizeEv"];
var __ZNK10Blip_SynthILi8ELi1EE16offset_resampledEjiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi8ELi1EE16offset_resampledEjiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi8ELi1EE16offset_resampledEjiP11Blip_Buffer"];
var __ZN6Ay_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN6Ay_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN6Ay_Apu10osc_outputEiP11Blip_Buffer"];
var __ZNK11Blip_Buffer11sample_rateEv = Module["__ZNK11Blip_Buffer11sample_rateEv"] = asm["__ZNK11Blip_Buffer11sample_rateEv"];
var __ZN7Nsf_Emu10init_soundEv = Module["__ZN7Nsf_Emu10init_soundEv"] = asm["__ZN7Nsf_Emu10init_soundEv"];
var _gme_clear_playlist = Module["_gme_clear_playlist"] = asm["_gme_clear_playlist"];
var __ZN6Ym_EmuI10Ym2612_EmuED2Ev = Module["__ZN6Ym_EmuI10Ym2612_EmuED2Ev"] = asm["__ZN6Ym_EmuI10Ym2612_EmuED2Ev"];
var __ZN8Rom_DataILi8192EE8set_addrEl = Module["__ZN8Rom_DataILi8192EE8set_addrEl"] = asm["__ZN8Rom_DataILi8192EE8set_addrEl"];
var __ZNK7Kss_Cpu4timeEv = Module["__ZNK7Kss_Cpu4timeEv"] = asm["__ZNK7Kss_Cpu4timeEv"];
var __ZN7Vgm_Emu10run_clocksERii = Module["__ZN7Vgm_Emu10run_clocksERii"] = asm["__ZN7Vgm_Emu10run_clocksERii"];
var __ZN10Blip_SynthILi12ELi1EE9treble_eqERK9blip_eq_t = Module["__ZN10Blip_SynthILi12ELi1EE9treble_eqERK9blip_eq_t"] = asm["__ZN10Blip_SynthILi12ELi1EE9treble_eqERK9blip_eq_t"];
var __ZN8Gme_FileD0Ev = Module["__ZN8Gme_FileD0Ev"] = asm["__ZN8Gme_FileD0Ev"];
var __ZNK8Rom_DataILi16384EE4sizeEv = Module["__ZNK8Rom_DataILi16384EE4sizeEv"] = asm["__ZNK8Rom_DataILi16384EE4sizeEv"];
var __ZN13Stereo_Buffer15set_sample_rateEli = Module["__ZN13Stereo_Buffer15set_sample_rateEli"] = asm["__ZN13Stereo_Buffer15set_sample_rateEli"];
var __ZN7Sap_Emu9update_eqERK9blip_eq_t = Module["__ZN7Sap_Emu9update_eqERK9blip_eq_t"] = asm["__ZN7Sap_Emu9update_eqERK9blip_eq_t"];
var __ZN7Nsf_Emu6unloadEv = Module["__ZN7Nsf_Emu6unloadEv"] = asm["__ZN7Nsf_Emu6unloadEv"];
var __ZN7Sms_Apu10write_dataEii = Module["__ZN7Sms_Apu10write_dataEii"] = asm["__ZN7Sms_Apu10write_dataEii"];
var __ZN7Spc_Dsp4loadEPKh = Module["__ZN7Spc_Dsp4loadEPKh"] = asm["__ZN7Spc_Dsp4loadEPKh"];
var __ZN11Blip_Reader3endER11Blip_Buffer = Module["__ZN11Blip_Reader3endER11Blip_Buffer"] = asm["__ZN11Blip_Reader3endER11Blip_Buffer"];
var __ZL8gen_sincdidddiPs = Module["__ZL8gen_sincdidddiPs"] = asm["__ZL8gen_sincdidddiPs"];
var __ZN16Blip_Synth_Fast_11volume_unitEd = Module["__ZN16Blip_Synth_Fast_11volume_unitEd"] = asm["__ZN16Blip_Synth_Fast_11volume_unitEd"];
var __ZN12Nes_Fme7_ApunwEj = Module["__ZN12Nes_Fme7_ApunwEj"] = asm["__ZN12Nes_Fme7_ApunwEj"];
var _gme_open_data = Module["_gme_open_data"] = asm["_gme_open_data"];
var __ZN7Gbs_Emu10run_clocksERii = Module["__ZN7Gbs_Emu10run_clocksERii"] = asm["__ZN7Gbs_Emu10run_clocksERii"];
var __ZNK13blargg_vectorIsEixEj = Module["__ZNK13blargg_vectorIsEixEj"] = asm["__ZNK13blargg_vectorIsEixEj"];
var __ZN12M3u_Playlist6parse_Ev = Module["__ZN12M3u_Playlist6parse_Ev"] = asm["__ZN12M3u_Playlist6parse_Ev"];
var __ZNSt9bad_allocD0Ev = Module["__ZNSt9bad_allocD0Ev"] = asm["__ZNSt9bad_allocD0Ev"];
var __Z8get_be16PKv = Module["__Z8get_be16PKv"] = asm["__Z8get_be16PKv"];
var __ZN10Nes_SquareC2EPK10Blip_SynthILi12ELi1EE = Module["__ZN10Nes_SquareC2EPK10Blip_SynthILi12ELi1EE"] = asm["__ZN10Nes_SquareC2EPK10Blip_SynthILi12ELi1EE"];
var __ZN8Nsf_FileD0Ev = Module["__ZN8Nsf_FileD0Ev"] = asm["__ZN8Nsf_FileD0Ev"];
var __ZNK8Snes_Spc12sample_countEv = Module["__ZNK8Snes_Spc12sample_countEv"] = asm["__ZNK8Snes_Spc12sample_countEv"];
var __ZL12new_spc_filev = Module["__ZL12new_spc_filev"] = asm["__ZL12new_spc_filev"];
var __ZNK7Nes_Apu18next_dmc_read_timeEv = Module["__ZNK7Nes_Apu18next_dmc_read_timeEv"] = asm["__ZNK7Nes_Apu18next_dmc_read_timeEv"];
var __ZL8gen_sincPfiddd = Module["__ZL8gen_sincPfiddd"] = asm["__ZL8gen_sincPfiddd"];
var __ZL3minii = Module["__ZL3minii"] = asm["__ZL3minii"];
var __ZNK11Classic_Emu10clock_rateEv = Module["__ZNK11Classic_Emu10clock_rateEv"] = asm["__ZNK11Classic_Emu10clock_rateEv"];
var __ZN6Ym_EmuI10Ym2612_EmuE6enableEb = Module["__ZN6Ym_EmuI10Ym2612_EmuE6enableEb"] = asm["__ZN6Ym_EmuI10Ym2612_EmuE6enableEb"];
var __ZNK7Nes_Dmc11count_readsElPl = Module["__ZNK7Nes_Dmc11count_readsElPl"] = asm["__ZNK7Nes_Dmc11count_readsElPl"];
var __ZN13Silent_BufferD1Ev = Module["__ZN13Silent_BufferD1Ev"] = asm["__ZN13Silent_BufferD1Ev"];
var __ZN13Silent_Buffer12read_samplesEPsl = Module["__ZN13Silent_Buffer12read_samplesEPsl"] = asm["__ZN13Silent_Buffer12read_samplesEPsl"];
var __ZN8Sap_File9load_mem_EPKhl = Module["__ZN8Sap_File9load_mem_EPKhl"] = asm["__ZN8Sap_File9load_mem_EPKhl"];
var __ZNK13blargg_vectorIPKcE4sizeEv = Module["__ZNK13blargg_vectorIPKcE4sizeEv"] = asm["__ZNK13blargg_vectorIPKcE4sizeEv"];
var __ZL12get_spc_xid6PKhlP12track_info_t = Module["__ZL12get_spc_xid6PKhlP12track_info_t"] = asm["__ZL12get_spc_xid6PKhlP12track_info_t"];
var __ZN9Music_Emu8emu_playElPs = Module["__ZN9Music_Emu8emu_playElPs"] = asm["__ZN9Music_Emu8emu_playElPs"];
var __ZNK7Spc_Emu12trailer_sizeEv = Module["__ZNK7Spc_Emu12trailer_sizeEv"] = asm["__ZNK7Spc_Emu12trailer_sizeEv"];
var __ZN11Mono_BufferD2Ev = Module["__ZN11Mono_BufferD2Ev"] = asm["__ZN11Mono_BufferD2Ev"];
var _gme_tell = Module["_gme_tell"] = asm["_gme_tell"];
var __ZN8Nsfe_EmuC2Ev = Module["__ZN8Nsfe_EmuC2Ev"] = asm["__ZN8Nsfe_EmuC2Ev"];
var __ZN7Hes_CpuC2Ev = Module["__ZN7Hes_CpuC2Ev"] = asm["__ZN7Hes_CpuC2Ev"];
var __ZN11Classic_Emu17change_clock_rateEl = Module["__ZN11Classic_Emu17change_clock_rateEl"] = asm["__ZN11Classic_Emu17change_clock_rateEl"];
var __ZN11Mono_Buffer7channelEii = Module["__ZN11Mono_Buffer7channelEii"] = asm["__ZN11Mono_Buffer7channelEii"];
var __ZNK12Vgm_Emu_Impl10to_fm_timeEi = Module["__ZNK12Vgm_Emu_Impl10to_fm_timeEi"] = asm["__ZNK12Vgm_Emu_Impl10to_fm_timeEi"];
var __ZN9Music_Emu13set_equalizerERK15gme_equalizer_t = Module["__ZN9Music_Emu13set_equalizerERK15gme_equalizer_t"] = asm["__ZN9Music_Emu13set_equalizerERK15gme_equalizer_t"];
var __ZN8Snes_Spc11CPU_mem_bitEPKhi = Module["__ZN8Snes_Spc11CPU_mem_bitEPKhi"] = asm["__ZN8Snes_Spc11CPU_mem_bitEPKhi"];
var __ZN18ym2612_update_chanILi4EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi4EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi4EE4funcER8tables_tR9channel_tPsi"];
var __ZNK10__cxxabiv117__array_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv117__array_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv117__array_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __ZN8Snes_Spc4initEv = Module["__ZN8Snes_Spc4initEv"] = asm["__ZN8Snes_Spc4initEv"];
var __ZN12Nes_Vrc6_ApudlEPv = Module["__ZN12Nes_Vrc6_ApudlEPv"] = asm["__ZN12Nes_Vrc6_ApudlEPv"];
var __ZN12Nes_Triangle14maintain_phaseElll = Module["__ZN12Nes_Triangle14maintain_phaseElll"] = asm["__ZN12Nes_Triangle14maintain_phaseElll"];
var __ZN13Stereo_Buffer8mix_monoEPsl = Module["__ZN13Stereo_Buffer8mix_monoEPsl"] = asm["__ZN13Stereo_Buffer8mix_monoEPsl"];
var ___cxx_global_var_init = Module["___cxx_global_var_init"] = asm["___cxx_global_var_init"];
var __ZN7Spc_EmuD2Ev = Module["__ZN7Spc_EmuD2Ev"] = asm["__ZN7Spc_EmuD2Ev"];
var __ZN7Gym_EmuD0Ev = Module["__ZN7Gym_EmuD0Ev"] = asm["__ZN7Gym_EmuD0Ev"];
var __ZN10__cxxabiv120__function_type_infoD0Ev = Module["__ZN10__cxxabiv120__function_type_infoD0Ev"] = asm["__ZN10__cxxabiv120__function_type_infoD0Ev"];
var _gme_voice_count = Module["_gme_voice_count"] = asm["_gme_voice_count"];
var __ZN6Gb_Cpu8map_codeEjjPv = Module["__ZN6Gb_Cpu8map_codeEjjPv"] = asm["__ZN6Gb_Cpu8map_codeEjjPv"];
var __ZN7Sms_Apu6outputEP11Blip_BufferS1_S1_ = Module["__ZN7Sms_Apu6outputEP11Blip_BufferS1_S1_"] = asm["__ZN7Sms_Apu6outputEP11Blip_BufferS1_S1_"];
var __ZN7Nes_Apu11read_statusEl = Module["__ZN7Nes_Apu11read_statusEl"] = asm["__ZN7Nes_Apu11read_statusEl"];
var __ZNK7Gbs_Emu5clockEv = Module["__ZNK7Gbs_Emu5clockEv"] = asm["__ZNK7Gbs_Emu5clockEv"];
var __ZN15Std_File_Reader5closeEv = Module["__ZN15Std_File_Reader5closeEv"] = asm["__ZN15Std_File_Reader5closeEv"];
var __ZN11Blip_Buffer14clear_modifiedEv = Module["__ZN11Blip_Buffer14clear_modifiedEv"] = asm["__ZN11Blip_Buffer14clear_modifiedEv"];
var __Z11command_leni = Module["__Z11command_leni"] = asm["__Z11command_leni"];
var __ZN7Hes_Cpu12set_end_timeEl = Module["__ZN7Hes_Cpu12set_end_timeEl"] = asm["__ZN7Hes_Cpu12set_end_timeEl"];
var __ZN9Gme_Info_16enable_accuracy_Eb = Module["__ZN9Gme_Info_16enable_accuracy_Eb"] = asm["__ZN9Gme_Info_16enable_accuracy_Eb"];
var __ZN12Nes_Envelope5resetEv = Module["__ZN12Nes_Envelope5resetEv"] = asm["__ZN12Nes_Envelope5resetEv"];
var __ZNK7Nes_Dmc14next_read_timeEv = Module["__ZNK7Nes_Dmc14next_read_timeEv"] = asm["__ZNK7Nes_Dmc14next_read_timeEv"];
var _getopt_long = Module["_getopt_long"] = asm["_getopt_long"];
var __ZNK7Sap_Cpu4timeEv = Module["__ZNK7Sap_Cpu4timeEv"] = asm["__ZNK7Sap_Cpu4timeEv"];
var __ZN13Silent_BufferC2Ev = Module["__ZN13Silent_BufferC2Ev"] = asm["__ZN13Silent_BufferC2Ev"];
var __ZN7Gbs_Emu5load_ER11Data_Reader = Module["__ZN7Gbs_Emu5load_ER11Data_Reader"] = asm["__ZN7Gbs_Emu5load_ER11Data_Reader"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var __ZN7Sms_Osc5resetEv = Module["__ZN7Sms_Osc5resetEv"] = asm["__ZN7Sms_Osc5resetEv"];
var __ZN7Nes_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN7Nes_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN7Nes_Apu10osc_outputEiP11Blip_Buffer"];
var __ZN8Rom_DataILi8192EED2Ev = Module["__ZN8Rom_DataILi8192EED2Ev"] = asm["__ZN8Rom_DataILi8192EED2Ev"];
var __ZN10__cxxabiv120__si_class_type_infoD0Ev = Module["__ZN10__cxxabiv120__si_class_type_infoD0Ev"] = asm["__ZN10__cxxabiv120__si_class_type_infoD0Ev"];
var __ZN12M3u_Playlist4loadER11Data_Reader = Module["__ZN12M3u_Playlist4loadER11Data_Reader"] = asm["__ZN12M3u_Playlist4loadER11Data_Reader"];
var __ZNK13blargg_vectorIcE4sizeEv = Module["__ZNK13blargg_vectorIcE4sizeEv"] = asm["__ZNK13blargg_vectorIcE4sizeEv"];
var __ZNK13blargg_vectorIcEixEj = Module["__ZNK13blargg_vectorIcEixEj"] = asm["__ZNK13blargg_vectorIcEixEj"];
var __ZN7Hes_Cpu3runEl = Module["__ZN7Hes_Cpu3runEl"] = asm["__ZN7Hes_Cpu3runEl"];
var __ZN12Nes_Triangle20clock_linear_counterEv = Module["__ZN12Nes_Triangle20clock_linear_counterEv"] = asm["__ZN12Nes_Triangle20clock_linear_counterEv"];
var __ZN12Vgm_Emu_ImplD1Ev = Module["__ZN12Vgm_Emu_ImplD1Ev"] = asm["__ZN12Vgm_Emu_ImplD1Ev"];
var __ZNK6Gb_Osc9frequencyEv = Module["__ZNK6Gb_Osc9frequencyEv"] = asm["__ZNK6Gb_Osc9frequencyEv"];
var __ZN7Sms_OscC2Ev = Module["__ZN7Sms_OscC2Ev"] = asm["__ZN7Sms_OscC2Ev"];
var __ZN8Snes_Spc10run_timer_EPNS_5TimerEi = Module["__ZN8Snes_Spc10run_timer_EPNS_5TimerEi"] = asm["__ZN8Snes_Spc10run_timer_EPNS_5TimerEi"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var __ZN10Ym2612_Emu3runEiPs = Module["__ZN10Ym2612_Emu3runEiPs"] = asm["__ZN10Ym2612_Emu3runEiPs"];
var __ZN10Ym2612_EmuC2Ev = Module["__ZN10Ym2612_EmuC2Ev"] = asm["__ZN10Ym2612_EmuC2Ev"];
var __ZN11Data_ReaderC2Ev = Module["__ZN11Data_ReaderC2Ev"] = asm["__ZN11Data_ReaderC2Ev"];
var __ZL12new_gbs_filev = Module["__ZL12new_gbs_filev"] = asm["__ZL12new_gbs_filev"];
var __ZN7Sap_Apu10write_dataEiji = Module["__ZN7Sap_Apu10write_dataEiji"] = asm["__ZN7Sap_Apu10write_dataEiji"];
var __ZN6Ay_EmuD0Ev = Module["__ZN6Ay_EmuD0Ev"] = asm["__ZN6Ay_EmuD0Ev"];
var __ZN11Classic_Emu5play_ElPs = Module["__ZN11Classic_Emu5play_ElPs"] = asm["__ZN11Classic_Emu5play_ElPs"];
var __ZNK11Mono_Buffer13samples_availEv = Module["__ZNK11Mono_Buffer13samples_availEv"] = asm["__ZNK11Mono_Buffer13samples_availEv"];
var __ZN16Remaining_ReaderC2EPKvlP11Data_Reader = Module["__ZN16Remaining_ReaderC2EPKvlP11Data_Reader"] = asm["__ZN16Remaining_ReaderC2EPKvlP11Data_Reader"];
var __ZN11Ym2612_Impl5resetEv = Module["__ZN11Ym2612_Impl5resetEv"] = asm["__ZN11Ym2612_Impl5resetEv"];
var __ZNK9Music_Emu11voice_namesEv = Module["__ZNK9Music_Emu11voice_namesEv"] = asm["__ZNK9Music_Emu11voice_namesEv"];
var __ZN8Gme_File5load_ER11Data_Reader = Module["__ZN8Gme_File5load_ER11Data_Reader"] = asm["__ZN8Gme_File5load_ER11Data_Reader"];
var __ZN7Gbs_Emu6unloadEv = Module["__ZN7Gbs_Emu6unloadEv"] = asm["__ZN7Gbs_Emu6unloadEv"];
var __ZNK11Blip_Synth_13impulses_sizeEv = Module["__ZNK11Blip_Synth_13impulses_sizeEv"] = asm["__ZNK11Blip_Synth_13impulses_sizeEv"];
var _gme_identify_header = Module["_gme_identify_header"] = asm["_gme_identify_header"];
var __ZN8Gme_File13set_user_dataEPv = Module["__ZN8Gme_File13set_user_dataEPv"] = asm["__ZN8Gme_File13set_user_dataEPv"];
var __ZN7Sap_Emu9load_mem_EPKhl = Module["__ZN7Sap_Emu9load_mem_EPKhl"] = asm["__ZN7Sap_Emu9load_mem_EPKhl"];
var __ZN8Snes_Spc9dsp_writeEii = Module["__ZN8Snes_Spc9dsp_writeEii"] = asm["__ZN8Snes_Spc9dsp_writeEii"];
var __ZN12Multi_Buffer17set_channel_countEi = Module["__ZN12Multi_Buffer17set_channel_countEi"] = asm["__ZN12Multi_Buffer17set_channel_countEi"];
var __ZN7Spc_Dsp3runEi = Module["__ZN7Spc_Dsp3runEi"] = asm["__ZN7Spc_Dsp3runEi"];
var __ZL12new_kss_filev = Module["__ZL12new_kss_filev"] = asm["__ZL12new_kss_filev"];
var _strncpy = Module["_strncpy"] = asm["_strncpy"];
var __ZN8Gbs_FileC1Ev = Module["__ZN8Gbs_FileC1Ev"] = asm["__ZN8Gbs_FileC1Ev"];
var __ZN9Music_EmuD2Ev = Module["__ZN9Music_EmuD2Ev"] = asm["__ZN9Music_EmuD2Ev"];
var __ZN9Nsfe_InfoC2Ev = Module["__ZN9Nsfe_InfoC2Ev"] = asm["__ZN9Nsfe_InfoC2Ev"];
var __ZN7Nes_Apu5resetEbi = Module["__ZN7Nes_Apu5resetEbi"] = asm["__ZN7Nes_Apu5resetEbi"];
var __ZN12Multi_Buffer22channels_changed_countEv = Module["__ZN12Multi_Buffer22channels_changed_countEv"] = asm["__ZN12Multi_Buffer22channels_changed_countEv"];
var __ZNK12Nes_Triangle8calc_ampEv = Module["__ZNK12Nes_Triangle8calc_ampEv"] = asm["__ZNK12Nes_Triangle8calc_ampEv"];
var __ZN7Sms_Apu9end_frameEi = Module["__ZN7Sms_Apu9end_frameEi"] = asm["__ZN7Sms_Apu9end_frameEi"];
var __ZN7Vgm_Emu16set_sample_rate_El = Module["__ZN7Vgm_Emu16set_sample_rate_El"] = asm["__ZN7Vgm_Emu16set_sample_rate_El"];
var _gme_type_system = Module["_gme_type_system"] = asm["_gme_type_system"];
var __ZN8Rom_DataILi16384EEC1Ev = Module["__ZN8Rom_DataILi16384EEC1Ev"] = asm["__ZN8Rom_DataILi16384EEC1Ev"];
var __ZN7Gym_Emu10play_frameEiiPs = Module["__ZN7Gym_Emu10play_frameEiiPs"] = asm["__ZN7Gym_Emu10play_frameEiiPs"];
var __ZN12Nes_Fme7_Apu9end_frameEi = Module["__ZN12Nes_Fme7_Apu9end_frameEi"] = asm["__ZN12Nes_Fme7_Apu9end_frameEi"];
var __ZN12M3u_PlaylistD1Ev = Module["__ZN12M3u_PlaylistD1Ev"] = asm["__ZN12M3u_PlaylistD1Ev"];
var __ZN11Mono_Buffer9bass_freqEi = Module["__ZN11Mono_Buffer9bass_freqEi"] = asm["__ZN11Mono_Buffer9bass_freqEi"];
var __ZNK13blargg_vectorIsE4sizeEv = Module["__ZNK13blargg_vectorIsE4sizeEv"] = asm["__ZNK13blargg_vectorIsE4sizeEv"];
var __ZN6Ay_Emu9update_eqERK9blip_eq_t = Module["__ZN6Ay_Emu9update_eqERK9blip_eq_t"] = asm["__ZN6Ay_Emu9update_eqERK9blip_eq_t"];
var __ZL9read_strsR11Data_ReaderlR13blargg_vectorIcERS1_IPKcE = Module["__ZL9read_strsR11Data_ReaderlR13blargg_vectorIcERS1_IPKcE"] = asm["__ZL9read_strsR11Data_ReaderlR13blargg_vectorIcERS1_IPKcE"];
var __ZN14Effects_BufferD0Ev = Module["__ZN14Effects_BufferD0Ev"] = asm["__ZN14Effects_BufferD0Ev"];
var __ZN13Silent_Buffer10clock_rateEl = Module["__ZN13Silent_Buffer10clock_rateEl"] = asm["__ZN13Silent_Buffer10clock_rateEl"];
var __ZN7Scc_ApuC1Ev = Module["__ZN7Scc_ApuC1Ev"] = asm["__ZN7Scc_ApuC1Ev"];
var __ZN14Effects_BufferD2Ev = Module["__ZN14Effects_BufferD2Ev"] = asm["__ZN14Effects_BufferD2Ev"];
var __ZN12Nes_Fme7_Apu6outputEP11Blip_Buffer = Module["__ZN12Nes_Fme7_Apu6outputEP11Blip_Buffer"] = asm["__ZN12Nes_Fme7_Apu6outputEP11Blip_Buffer"];
var __ZN8Hes_FileD1Ev = Module["__ZN8Hes_FileD1Ev"] = asm["__ZN8Hes_FileD1Ev"];
var __ZThn320_N7Gym_Emu10play_frameEiiPs = Module["__ZThn320_N7Gym_Emu10play_frameEiiPs"] = asm["__ZThn320_N7Gym_Emu10play_frameEiiPs"];
var __ZN7Sap_Emu7cpu_jsrEj = Module["__ZN7Sap_Emu7cpu_jsrEj"] = asm["__ZN7Sap_Emu7cpu_jsrEj"];
var __ZN8Snes_Spc10run_until_Ei = Module["__ZN8Snes_Spc10run_until_Ei"] = asm["__ZN8Snes_Spc10run_until_Ei"];
var __ZN8Gme_File15clear_playlist_Ev = Module["__ZN8Gme_File15clear_playlist_Ev"] = asm["__ZN8Gme_File15clear_playlist_Ev"];
var __ZL10new_ay_emuv = Module["__ZL10new_ay_emuv"] = asm["__ZL10new_ay_emuv"];
var __ZN7Vgm_Emu10set_tempo_Ed = Module["__ZN7Vgm_Emu10set_tempo_Ed"] = asm["__ZN7Vgm_Emu10set_tempo_Ed"];
var _parse_long_options = Module["_parse_long_options"] = asm["_parse_long_options"];
var __ZL16check_kss_headerPKv = Module["__ZL16check_kss_headerPKv"] = asm["__ZL16check_kss_headerPKv"];
var __ZNK11Blip_Buffer13count_samplesEi = Module["__ZNK11Blip_Buffer13count_samplesEi"] = asm["__ZNK11Blip_Buffer13count_samplesEi"];
var __ZN13blargg_vectorIsEC1Ev = Module["__ZN13blargg_vectorIsEC1Ev"] = asm["__ZN13blargg_vectorIsEC1Ev"];
var __ZN7Nsf_Emu14cpu_write_miscEji = Module["__ZN7Nsf_Emu14cpu_write_miscEji"] = asm["__ZN7Nsf_Emu14cpu_write_miscEji"];
var __ZN12Nes_Fme7_ApudlEPv = Module["__ZN12Nes_Fme7_ApudlEPv"] = asm["__ZN12Nes_Fme7_ApudlEPv"];
var __ZN7Ay_FileD0Ev = Module["__ZN7Ay_FileD0Ev"] = asm["__ZN7Ay_FileD0Ev"];
var __ZN12Nes_TriangleC2Ev = Module["__ZN12Nes_TriangleC2Ev"] = asm["__ZN12Nes_TriangleC2Ev"];
var __ZNK15Callback_Reader6remainEv = Module["__ZNK15Callback_Reader6remainEv"] = asm["__ZNK15Callback_Reader6remainEv"];
var __ZN7Nes_Dmc14write_registerEii = Module["__ZN7Nes_Dmc14write_registerEii"] = asm["__ZN7Nes_Dmc14write_registerEii"];
var __ZThn336_N12Vgm_Emu_ImplD1Ev = Module["__ZThn336_N12Vgm_Emu_ImplD1Ev"] = asm["__ZThn336_N12Vgm_Emu_ImplD1Ev"];
var __ZN12M3u_Playlist5clearEv = Module["__ZN12M3u_Playlist5clearEv"] = asm["__ZN12M3u_Playlist5clearEv"];
var __ZN6Gb_Apu13read_registerEij = Module["__ZN6Gb_Apu13read_registerEij"] = asm["__ZN6Gb_Apu13read_registerEij"];
var __ZN6Gb_ApuC2Ev = Module["__ZN6Gb_ApuC2Ev"] = asm["__ZN6Gb_ApuC2Ev"];
var __ZN7Vgm_Emu12mute_voices_Ei = Module["__ZN7Vgm_Emu12mute_voices_Ei"] = asm["__ZN7Vgm_Emu12mute_voices_Ei"];
var __ZN12Vgm_Emu_Impl9write_pcmEii = Module["__ZN12Vgm_Emu_Impl9write_pcmEii"] = asm["__ZN12Vgm_Emu_Impl9write_pcmEii"];
var __ZL16check_spc_headerPKv = Module["__ZL16check_spc_headerPKv"] = asm["__ZL16check_spc_headerPKv"];
var __ZN7Nsf_EmuC2Ev = Module["__ZN7Nsf_EmuC2Ev"] = asm["__ZN7Nsf_EmuC2Ev"];
var _gme_user_data = Module["_gme_user_data"] = asm["_gme_user_data"];
var __ZN12Nes_Fme7_Apu9treble_eqERK9blip_eq_t = Module["__ZN12Nes_Fme7_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN12Nes_Fme7_Apu9treble_eqERK9blip_eq_t"];
var __ZN7Sap_CpuC2Ev = Module["__ZN7Sap_CpuC2Ev"] = asm["__ZN7Sap_CpuC2Ev"];
var __ZN8Spc_FileC2Ev = Module["__ZN8Spc_FileC2Ev"] = asm["__ZN8Spc_FileC2Ev"];
var __ZN9Gme_Info_10post_load_Ev = Module["__ZN9Gme_Info_10post_load_Ev"] = asm["__ZN9Gme_Info_10post_load_Ev"];
var __ZN6Ay_Apu9run_untilEi = Module["__ZN6Ay_Apu9run_untilEi"] = asm["__ZN6Ay_Apu9run_untilEi"];
var _memalign = Module["_memalign"] = asm["_memalign"];
var __ZN13Fir_ResamplerILi12EED2Ev = Module["__ZN13Fir_ResamplerILi12EED2Ev"] = asm["__ZN13Fir_ResamplerILi12EED2Ev"];
var __ZNK11Blip_Buffer14resampled_timeEi = Module["__ZNK11Blip_Buffer14resampled_timeEi"] = asm["__ZNK11Blip_Buffer14resampled_timeEi"];
var __ZN7Hes_Emu6unloadEv = Module["__ZN7Hes_Emu6unloadEv"] = asm["__ZN7Hes_Emu6unloadEv"];
var _gme_type = Module["_gme_type"] = asm["_gme_type"];
var __ZN7Vgm_Emu12start_track_Ei = Module["__ZN7Vgm_Emu12start_track_Ei"] = asm["__ZN7Vgm_Emu12start_track_Ei"];
var __ZThn320_N7Gym_EmuD1Ev = Module["__ZThn320_N7Gym_EmuD1Ev"] = asm["__ZThn320_N7Gym_EmuD1Ev"];
var _bulk_free = Module["_bulk_free"] = asm["_bulk_free"];
var __Z9run_poly5mi = Module["__Z9run_poly5mi"] = asm["__Z9run_poly5mi"];
var __ZN9Music_Emu11start_trackEi = Module["__ZN9Music_Emu11start_trackEi"] = asm["__ZN9Music_Emu11start_trackEi"];
var __ZN7Kss_Emu11update_gainEv = Module["__ZN7Kss_Emu11update_gainEv"] = asm["__ZN7Kss_Emu11update_gainEv"];
var __warn = Module["__warn"] = asm["__warn"];
var __ZN8Snes_Spc18cpu_write_smp_reg_Eiii = Module["__ZN8Snes_Spc18cpu_write_smp_reg_Eiii"] = asm["__ZN8Snes_Spc18cpu_write_smp_reg_Eiii"];
var __ZN10__cxxabiv116__shim_type_infoD0Ev = Module["__ZN10__cxxabiv116__shim_type_infoD0Ev"] = asm["__ZN10__cxxabiv116__shim_type_infoD0Ev"];
var __ZN8Gym_FileD1Ev = Module["__ZN8Gym_FileD1Ev"] = asm["__ZN8Gym_FileD1Ev"];
var __ZN13Stereo_Buffer7channelEii = Module["__ZN13Stereo_Buffer7channelEii"] = asm["__ZN13Stereo_Buffer7channelEii"];
var __ZN9Music_Emu8pre_loadEv = Module["__ZN9Music_Emu8pre_loadEv"] = asm["__ZN9Music_Emu8pre_loadEv"];
var __ZN8Snes_Spc10enable_romEi = Module["__ZN8Snes_Spc10enable_romEi"] = asm["__ZN8Snes_Spc10enable_romEi"];
var ___dynamic_cast = Module["___dynamic_cast"] = asm["___dynamic_cast"];
var __ZN12M3u_Playlist4loadEPKvl = Module["__ZN12M3u_Playlist4loadEPKvl"] = asm["__ZN12M3u_Playlist4loadEPKvl"];
var __ZN8Snes_Spc9load_regsEPKh = Module["__ZN8Snes_Spc9load_regsEPKh"] = asm["__ZN8Snes_Spc9load_regsEPKh"];
var __ZN8Nsfe_EmuD2Ev = Module["__ZN8Nsfe_EmuD2Ev"] = asm["__ZN8Nsfe_EmuD2Ev"];
var __ZL11new_ay_filev = Module["__ZL11new_ay_filev"] = asm["__ZL11new_ay_filev"];
var __ZN8Rom_DataILi4096EEC2Ev = Module["__ZN8Rom_DataILi4096EEC2Ev"] = asm["__ZN8Rom_DataILi4096EEC2Ev"];
var __ZN7Nes_Apu9set_tempoEd = Module["__ZN7Nes_Apu9set_tempoEd"] = asm["__ZN7Nes_Apu9set_tempoEd"];
var __Z24blargg_verify_byte_orderv = Module["__Z24blargg_verify_byte_orderv"] = asm["__Z24blargg_verify_byte_orderv"];
var __ZN6Gb_Apu9run_untilEi = Module["__ZN6Gb_Apu9run_untilEi"] = asm["__ZN6Gb_Apu9run_untilEi"];
var __ZN8Spc_FileD0Ev = Module["__ZN8Spc_FileD0Ev"] = asm["__ZN8Spc_FileD0Ev"];
var __ZN7Sms_Apu9treble_eqERK9blip_eq_t = Module["__ZN7Sms_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN7Sms_Apu9treble_eqERK9blip_eq_t"];
var __ZN6Gb_Apu9end_frameEi = Module["__ZN6Gb_Apu9end_frameEi"] = asm["__ZN6Gb_Apu9end_frameEi"];
var __ZN8Nsf_FileD2Ev = Module["__ZN8Nsf_FileD2Ev"] = asm["__ZN8Nsf_FileD2Ev"];
var __ZL16check_vgm_headerRKN7Vgm_Emu8header_tE = Module["__ZL16check_vgm_headerRKN7Vgm_Emu8header_tE"] = asm["__ZL16check_vgm_headerRKN7Vgm_Emu8header_tE"];
var __ZN8Snes_Spc9end_frameEi = Module["__ZN8Snes_Spc9end_frameEi"] = asm["__ZN8Snes_Spc9end_frameEi"];
var _gme_set_equalizer = Module["_gme_set_equalizer"] = asm["_gme_set_equalizer"];
var __ZNK7Gbs_Emu11track_info_EP12track_info_ti = Module["__ZNK7Gbs_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Gbs_Emu11track_info_EP12track_info_ti"];
var __ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi = Module["__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"] = asm["__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"];
var __ZN9Music_Emu16clear_track_varsEv = Module["__ZN9Music_Emu16clear_track_varsEv"] = asm["__ZN9Music_Emu16clear_track_varsEv"];
var __ZNK7Spc_Emu7trailerEv = Module["__ZNK7Spc_Emu7trailerEv"] = asm["__ZNK7Spc_Emu7trailerEv"];
var __ZN7Hes_Apu9end_frameEi = Module["__ZN7Hes_Apu9end_frameEi"] = asm["__ZN7Hes_Apu9end_frameEi"];
var __ZN7Gbs_Emu12start_track_Ei = Module["__ZN7Gbs_Emu12start_track_Ei"] = asm["__ZN7Gbs_Emu12start_track_Ei"];
var __ZThn336_N7Vgm_EmuD0Ev = Module["__ZThn336_N7Vgm_EmuD0Ev"] = asm["__ZThn336_N7Vgm_EmuD0Ev"];
var __ZN6Gb_CpuC2Ev = Module["__ZN6Gb_CpuC2Ev"] = asm["__ZN6Gb_CpuC2Ev"];
var __ZNK7Hes_Cpu4timeEv = Module["__ZNK7Hes_Cpu4timeEv"] = asm["__ZNK7Hes_Cpu4timeEv"];
var __ZN13blargg_vectorIPKcED2Ev = Module["__ZN13blargg_vectorIPKcED2Ev"] = asm["__ZN13blargg_vectorIPKcED2Ev"];
var __ZN10Ym2413_Emu8set_rateEdd = Module["__ZN10Ym2413_Emu8set_rateEdd"] = asm["__ZN10Ym2413_Emu8set_rateEdd"];
var __verr = Module["__verr"] = asm["__verr"];
var __ZN7Spc_Emu16set_sample_rate_El = Module["__ZN7Spc_Emu16set_sample_rate_El"] = asm["__ZN7Spc_Emu16set_sample_rate_El"];
var _gme_mute_voice = Module["_gme_mute_voice"] = asm["_gme_mute_voice"];
var __ZN8Vgm_FileC2Ev = Module["__ZN8Vgm_FileC2Ev"] = asm["__ZN8Vgm_FileC2Ev"];
var __ZN7Hes_Emu13cpu_write_vdpEii = Module["__ZN7Hes_Emu13cpu_write_vdpEii"] = asm["__ZN7Hes_Emu13cpu_write_vdpEii"];
var __ZN7Sap_Cpu8set_timeEl = Module["__ZN7Sap_Cpu8set_timeEl"] = asm["__ZN7Sap_Cpu8set_timeEl"];
var __ZN8Snes_Spc10soft_resetEv = Module["__ZN8Snes_Spc10soft_resetEv"] = asm["__ZN8Snes_Spc10soft_resetEv"];
var __ZN6Ym_EmuI10Ym2612_EmuE9run_untilEi = Module["__ZN6Ym_EmuI10Ym2612_EmuE9run_untilEi"] = asm["__ZN6Ym_EmuI10Ym2612_EmuE9run_untilEi"];
var __ZN15Mem_File_Reader4seekEl = Module["__ZN15Mem_File_Reader4seekEl"] = asm["__ZN15Mem_File_Reader4seekEl"];
var __ZN11Classic_EmuC2Ev = Module["__ZN11Classic_EmuC2Ev"] = asm["__ZN11Classic_EmuC2Ev"];
var __ZN7Vgm_Emu5play_ElPs = Module["__ZN7Vgm_Emu5play_ElPs"] = asm["__ZN7Vgm_Emu5play_ElPs"];
var __ZN7Hes_Emu9update_eqERK9blip_eq_t = Module["__ZN7Hes_Emu9update_eqERK9blip_eq_t"] = asm["__ZN7Hes_Emu9update_eqERK9blip_eq_t"];
var __ZN12Nes_Fme7_ApuC1Ev = Module["__ZN12Nes_Fme7_ApuC1Ev"] = asm["__ZN12Nes_Fme7_ApuC1Ev"];
var __ZNK7Spc_Emu6headerEv = Module["__ZNK7Spc_Emu6headerEv"] = asm["__ZNK7Spc_Emu6headerEv"];
var __ZN8Gme_File10post_load_Ev = Module["__ZN8Gme_File10post_load_Ev"] = asm["__ZN8Gme_File10post_load_Ev"];
var __ZN8Rom_DataILi8192EE8unmappedEv = Module["__ZN8Rom_DataILi8192EE8unmappedEv"] = asm["__ZN8Rom_DataILi8192EE8unmappedEv"];
var __ZN8Snes_Spc13timers_loadedEv = Module["__ZN8Snes_Spc13timers_loadedEv"] = asm["__ZN8Snes_Spc13timers_loadedEv"];
var __ZL12new_nsfe_emuv = Module["__ZL12new_nsfe_emuv"] = asm["__ZL12new_nsfe_emuv"];
var __ZN11Blip_Buffer10clock_rateEl = Module["__ZN11Blip_Buffer10clock_rateEl"] = asm["__ZN11Blip_Buffer10clock_rateEl"];
var __ZN7Spc_Dsp10set_outputEPsi = Module["__ZN7Spc_Dsp10set_outputEPsi"] = asm["__ZN7Spc_Dsp10set_outputEPsi"];
var __Z12zero_apu_oscI12Nes_TriangleEvPT_l = Module["__Z12zero_apu_oscI12Nes_TriangleEvPT_l"] = asm["__Z12zero_apu_oscI12Nes_TriangleEvPT_l"];
var __ZN7Nsf_Emu9cpu_writeEji = Module["__ZN7Nsf_Emu9cpu_writeEji"] = asm["__ZN7Nsf_Emu9cpu_writeEji"];
var __ZN9Gme_Info_C2Ev = Module["__ZN9Gme_Info_C2Ev"] = asm["__ZN9Gme_Info_C2Ev"];
var __ZN13blargg_vectorIcED2Ev = Module["__ZN13blargg_vectorIcED2Ev"] = asm["__ZN13blargg_vectorIcED2Ev"];
var __ZN8Rom_DataILi8192EE7at_addrEl = Module["__ZN8Rom_DataILi8192EE7at_addrEl"] = asm["__ZN8Rom_DataILi8192EE7at_addrEl"];
var __ZN13Nes_Namco_ApuC2Ev = Module["__ZN13Nes_Namco_ApuC2Ev"] = asm["__ZN13Nes_Namco_ApuC2Ev"];
var __ZN9Music_Emu14make_equalizerEdd = Module["__ZN9Music_Emu14make_equalizerEdd"] = asm["__ZN9Music_Emu14make_equalizerEdd"];
var __ZNK13blargg_vectorIsE5beginEv = Module["__ZNK13blargg_vectorIsE5beginEv"] = asm["__ZNK13blargg_vectorIsE5beginEv"];
var __ZN6Ay_Apu11write_data_Eii = Module["__ZN6Ay_Apu11write_data_Eii"] = asm["__ZN6Ay_Apu11write_data_Eii"];
var __ZN7Hes_Apu10write_dataEiii = Module["__ZN7Hes_Apu10write_dataEiii"] = asm["__ZN7Hes_Apu10write_dataEiii"];
var __ZL12new_gym_filev = Module["__ZL12new_gym_filev"] = asm["__ZL12new_gym_filev"];
var __ZL10copy_fieldPKhPc = Module["__ZL10copy_fieldPKhPc"] = asm["__ZL10copy_fieldPKhPc"];
var __ZNK10Blip_SynthILi8ELi1EE13offset_inlineEiiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi8ELi1EE13offset_inlineEiiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi8ELi1EE13offset_inlineEiiP11Blip_Buffer"];
var __ZN7Gym_Emu11parse_frameEv = Module["__ZN7Gym_Emu11parse_frameEv"] = asm["__ZN7Gym_Emu11parse_frameEv"];
var __ZN7Ay_FileD2Ev = Module["__ZN7Ay_FileD2Ev"] = asm["__ZN7Ay_FileD2Ev"];
var __ZSt17__throw_bad_allocv = Module["__ZSt17__throw_bad_allocv"] = asm["__ZSt17__throw_bad_allocv"];
var __ZNKSt9bad_alloc4whatEv = Module["__ZNKSt9bad_alloc4whatEv"] = asm["__ZNKSt9bad_alloc4whatEv"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var __ZN7Spc_Dsp4initEPv = Module["__ZN7Spc_Dsp4initEPv"] = asm["__ZN7Spc_Dsp4initEPv"];
var __ZN9Gme_Info_10set_tempo_Ed = Module["__ZN9Gme_Info_10set_tempo_Ed"] = asm["__ZN9Gme_Info_10set_tempo_Ed"];
var __ZNK15Mem_File_Reader4sizeEv = Module["__ZNK15Mem_File_Reader4sizeEv"] = asm["__ZNK15Mem_File_Reader4sizeEv"];
var __ZL12get_gd3_pairPKhS0_Pc = Module["__ZL12get_gd3_pairPKhS0_Pc"] = asm["__ZL12get_gd3_pairPKhS0_Pc"];
var __ZN7Scc_Apu5resetEv = Module["__ZN7Scc_Apu5resetEv"] = asm["__ZN7Scc_Apu5resetEv"];
var __ZN12Nes_Vrc6_Apu5resetEv = Module["__ZN12Nes_Vrc6_Apu5resetEv"] = asm["__ZN12Nes_Vrc6_Apu5resetEv"];
var __ZN7Nes_Apu9end_frameEl = Module["__ZN7Nes_Apu9end_frameEl"] = asm["__ZN7Nes_Apu9end_frameEl"];
var __ZN10Ym2413_EmuD2Ev = Module["__ZN10Ym2413_EmuD2Ev"] = asm["__ZN10Ym2413_EmuD2Ev"];
var __ZN7Sap_ApuC2Ev = Module["__ZN7Sap_ApuC2Ev"] = asm["__ZN7Sap_ApuC2Ev"];
var __ZNK7Vgm_Emu11track_info_EP12track_info_ti = Module["__ZNK7Vgm_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Vgm_Emu11track_info_EP12track_info_ti"];
var _independent_comalloc = Module["_independent_comalloc"] = asm["_independent_comalloc"];
var __ZN12Multi_BufferD2Ev = Module["__ZN12Multi_BufferD2Ev"] = asm["__ZN12Multi_BufferD2Ev"];
var __ZN7Sap_Cpu5resetEPv = Module["__ZN7Sap_Cpu5resetEPv"] = asm["__ZN7Sap_Cpu5resetEPv"];
var __ZN9Music_Emu15set_track_endedEv = Module["__ZN9Music_Emu15set_track_endedEv"] = asm["__ZN9Music_Emu15set_track_endedEv"];
var __Znaj = Module["__Znaj"] = asm["__Znaj"];
var __ZN7Ay_FileC1Ev = Module["__ZN7Ay_FileC1Ev"] = asm["__ZN7Ay_FileC1Ev"];
var __Z11kss_cpu_outP7Kss_Cpulji = Module["__Z11kss_cpu_outP7Kss_Cpulji"] = asm["__Z11kss_cpu_outP7Kss_Cpulji"];
var __ZN7Gym_Emu10set_tempo_Ed = Module["__ZN7Gym_Emu10set_tempo_Ed"] = asm["__ZN7Gym_Emu10set_tempo_Ed"];
var __ZNK12M3u_Playlist4sizeEv = Module["__ZNK12M3u_Playlist4sizeEv"] = asm["__ZNK12M3u_Playlist4sizeEv"];
var __ZN7Nes_Osc5resetEv = Module["__ZN7Nes_Osc5resetEv"] = asm["__ZN7Nes_Osc5resetEv"];
var __ZNSt20bad_array_new_lengthD0Ev = Module["__ZNSt20bad_array_new_lengthD0Ev"] = asm["__ZNSt20bad_array_new_lengthD0Ev"];
var __ZN8Rom_DataILi4096EEC1Ev = Module["__ZN8Rom_DataILi4096EEC1Ev"] = asm["__ZN8Rom_DataILi4096EEC1Ev"];
var __ZN10SPC_FilterC2Ev = Module["__ZN10SPC_FilterC2Ev"] = asm["__ZN10SPC_FilterC2Ev"];
var __ZN7Hes_Emu12start_track_Ei = Module["__ZN7Hes_Emu12start_track_Ei"] = asm["__ZN7Hes_Emu12start_track_Ei"];
var __ZN9Gme_Info_D1Ev = Module["__ZN9Gme_Info_D1Ev"] = asm["__ZN9Gme_Info_D1Ev"];
var __ZNK12M3u_Playlist4infoEv = Module["__ZNK12M3u_Playlist4infoEv"] = asm["__ZNK12M3u_Playlist4infoEv"];
var __ZN7Hes_Emu11cpu_set_mmrEii = Module["__ZN7Hes_Emu11cpu_set_mmrEii"] = asm["__ZN7Hes_Emu11cpu_set_mmrEii"];
var __ZN13blargg_vectorIA4_cE6resizeEj = Module["__ZN13blargg_vectorIA4_cE6resizeEj"] = asm["__ZN13blargg_vectorIA4_cE6resizeEj"];
var __ZN7Spc_EmuC2Ev = Module["__ZN7Spc_EmuC2Ev"] = asm["__ZN7Spc_EmuC2Ev"];
var __ZNSt8bad_castD0Ev = Module["__ZNSt8bad_castD0Ev"] = asm["__ZNSt8bad_castD0Ev"];
var __ZL3minii539 = Module["__ZL3minii539"] = asm["__ZL3minii539"];
var __verrx = Module["__verrx"] = asm["__verrx"];
var __ZN9Nsfe_FileD0Ev = Module["__ZN9Nsfe_FileD0Ev"] = asm["__ZN9Nsfe_FileD0Ev"];
var __ZL9parse_intPcPiS0_ = Module["__ZL9parse_intPcPiS0_"] = asm["__ZL9parse_intPcPiS0_"];
var __ZL15copy_nsf_fieldsRKN7Nsf_Emu8header_tEP12track_info_t = Module["__ZL15copy_nsf_fieldsRKN7Nsf_Emu8header_tEP12track_info_t"] = asm["__ZL15copy_nsf_fieldsRKN7Nsf_Emu8header_tEP12track_info_t"];
var __ZN14Fir_Resampler_5writeEl = Module["__ZN14Fir_Resampler_5writeEl"] = asm["__ZN14Fir_Resampler_5writeEl"];
var __ZN12Nes_Vrc6_Apu10run_squareERNS_8Vrc6_OscEi = Module["__ZN12Nes_Vrc6_Apu10run_squareERNS_8Vrc6_OscEi"] = asm["__ZN12Nes_Vrc6_Apu10run_squareERNS_8Vrc6_OscEi"];
var __ZN7Nes_Osc12clock_lengthEi = Module["__ZN7Nes_Osc12clock_lengthEi"] = asm["__ZN7Nes_Osc12clock_lengthEi"];
var __ZN9Music_EmuD0Ev = Module["__ZN9Music_EmuD0Ev"] = asm["__ZN9Music_EmuD0Ev"];
var __ZN9Music_Emu8set_gainEd = Module["__ZN9Music_Emu8set_gainEd"] = asm["__ZN9Music_Emu8set_gainEd"];
var __ZN6Ym_EmuI10Ym2413_EmuE6enableEb = Module["__ZN6Ym_EmuI10Ym2413_EmuE6enableEb"] = asm["__ZN6Ym_EmuI10Ym2413_EmuE6enableEb"];
var __ZN8Rom_DataILi16384EE4loadER11Data_ReaderiPvi = Module["__ZN8Rom_DataILi16384EE4loadER11Data_ReaderiPvi"] = asm["__ZN8Rom_DataILi16384EE4loadER11Data_ReaderiPvi"];
var __ZNSt9bad_allocC2Ev = Module["__ZNSt9bad_allocC2Ev"] = asm["__ZNSt9bad_allocC2Ev"];
var __ZNK16Remaining_Reader6remainEv = Module["__ZNK16Remaining_Reader6remainEv"] = asm["__ZNK16Remaining_Reader6remainEv"];
var __ZN9Nsfe_File5load_ER11Data_Reader = Module["__ZN9Nsfe_File5load_ER11Data_Reader"] = asm["__ZN9Nsfe_File5load_ER11Data_Reader"];
var __ZN7Ay_File9load_mem_EPKhl = Module["__ZN7Ay_File9load_mem_EPKhl"] = asm["__ZN7Ay_File9load_mem_EPKhl"];
var __ZN6Gb_Apu14write_registerEiji = Module["__ZN6Gb_Apu14write_registerEiji"] = asm["__ZN6Gb_Apu14write_registerEiji"];
var __ZN13blargg_vectorIcE6resizeEj = Module["__ZN13blargg_vectorIcE6resizeEj"] = asm["__ZN13blargg_vectorIcE6resizeEj"];
var __ZN7Hes_Cpu8get_codeEj = Module["__ZN7Hes_Cpu8get_codeEj"] = asm["__ZN7Hes_Cpu8get_codeEj"];
var __ZN6Gb_Osc5resetEv = Module["__ZN6Gb_Osc5resetEv"] = asm["__ZN6Gb_Osc5resetEv"];
var __ZN9Sms_Noise3runEii = Module["__ZN9Sms_Noise3runEii"] = asm["__ZN9Sms_Noise3runEii"];
var __ZN6Ay_Cpu5resetEPv = Module["__ZN6Ay_Cpu5resetEPv"] = asm["__ZN6Ay_Cpu5resetEPv"];
var __ZN13Fir_ResamplerILi24EEC2Ev = Module["__ZN13Fir_ResamplerILi24EEC2Ev"] = asm["__ZN13Fir_ResamplerILi24EEC2Ev"];
var __ZN11Ym2612_Impl9run_timerEi = Module["__ZN11Ym2612_Impl9run_timerEi"] = asm["__ZN11Ym2612_Impl9run_timerEi"];
var __ZN13blargg_vectorIA4_cEC1Ev = Module["__ZN13blargg_vectorIA4_cEC1Ev"] = asm["__ZN13blargg_vectorIA4_cEC1Ev"];
var __ZN12Nes_Envelope14clock_envelopeEv = Module["__ZN12Nes_Envelope14clock_envelopeEv"] = asm["__ZN12Nes_Envelope14clock_envelopeEv"];
var __ZN11Ym2612_Impl6write1Eii = Module["__ZN11Ym2612_Impl6write1Eii"] = asm["__ZN11Ym2612_Impl6write1Eii"];
var __ZL12skip_gd3_strPKhS0_ = Module["__ZL12skip_gd3_strPKhS0_"] = asm["__ZL12skip_gd3_strPKhS0_"];
var __ZN9Gme_Info_16set_sample_rate_El = Module["__ZN9Gme_Info_16set_sample_rate_El"] = asm["__ZN9Gme_Info_16set_sample_rate_El"];
var __ZN11Ym2612_Impl8SLOT_SETEii = Module["__ZN11Ym2612_Impl8SLOT_SETEii"] = asm["__ZN11Ym2612_Impl8SLOT_SETEii"];
var __ZN13Nes_Namco_Apu10write_addrEi = Module["__ZN13Nes_Namco_Apu10write_addrEi"] = asm["__ZN13Nes_Namco_Apu10write_addrEi"];
var ___cxx_global_var_init535 = Module["___cxx_global_var_init535"] = asm["___cxx_global_var_init535"];
var _mallopt = Module["_mallopt"] = asm["_mallopt"];
var __ZN10Ym2413_EmuC2Ev = Module["__ZN10Ym2413_EmuC2Ev"] = asm["__ZN10Ym2413_EmuC2Ev"];
var __ZN6Ym_EmuI10Ym2413_EmuED2Ev = Module["__ZN6Ym_EmuI10Ym2413_EmuED2Ev"] = asm["__ZN6Ym_EmuI10Ym2413_EmuED2Ev"];
var __ZN8Sap_FileC2Ev = Module["__ZN8Sap_FileC2Ev"] = asm["__ZN8Sap_FileC2Ev"];
var __ZN8Snes_Spc9cpu_writeEiii = Module["__ZN8Snes_Spc9cpu_writeEiii"] = asm["__ZN8Snes_Spc9cpu_writeEiii"];
var __ZN15Mem_File_ReaderD2Ev = Module["__ZN15Mem_File_ReaderD2Ev"] = asm["__ZN15Mem_File_ReaderD2Ev"];
var __ZN10SPC_Filter5clearEv = Module["__ZN10SPC_Filter5clearEv"] = asm["__ZN10SPC_Filter5clearEv"];
var __ZN7Hes_Emu9cpu_writeEji = Module["__ZN7Hes_Emu9cpu_writeEji"] = asm["__ZN7Hes_Emu9cpu_writeEji"];
var __ZN8Hes_FileC2Ev = Module["__ZN8Hes_FileC2Ev"] = asm["__ZN8Hes_FileC2Ev"];
var __ZN7Nes_Apu9run_untilEl = Module["__ZN7Nes_Apu9run_untilEl"] = asm["__ZN7Nes_Apu9run_untilEl"];
var __ZN7Vgm_Emu8setup_fmEv = Module["__ZN7Vgm_Emu8setup_fmEv"] = asm["__ZN7Vgm_Emu8setup_fmEv"];
var __ZN11Ym2612_Impl8set_rateEdd = Module["__ZN11Ym2612_Impl8set_rateEdd"] = asm["__ZN11Ym2612_Impl8set_rateEdd"];
var __ZN6Ay_Apu6outputEP11Blip_Buffer = Module["__ZN6Ay_Apu6outputEP11Blip_Buffer"] = asm["__ZN6Ay_Apu6outputEP11Blip_Buffer"];
var _memcmp = Module["_memcmp"] = asm["_memcmp"];
var __ZN7Nsf_Emu10run_clocksERii = Module["__ZN7Nsf_Emu10run_clocksERii"] = asm["__ZN7Nsf_Emu10run_clocksERii"];
var __ZN9Music_Emu10set_bufferEP12Multi_Buffer = Module["__ZN9Music_Emu10set_bufferEP12Multi_Buffer"] = asm["__ZN9Music_Emu10set_bufferEP12Multi_Buffer"];
var __ZN13Silent_BufferD2Ev = Module["__ZN13Silent_BufferD2Ev"] = asm["__ZN13Silent_BufferD2Ev"];
var __ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __ZN8Rom_DataILi4096EED1Ev = Module["__ZN8Rom_DataILi4096EED1Ev"] = asm["__ZN8Rom_DataILi4096EED1Ev"];
var __ZN9Music_Emu12mute_voices_Ei = Module["__ZN9Music_Emu12mute_voices_Ei"] = asm["__ZN9Music_Emu12mute_voices_Ei"];
var __ZN8Snes_Spc16cpu_read_smp_regEii = Module["__ZN8Snes_Spc16cpu_read_smp_regEii"] = asm["__ZN8Snes_Spc16cpu_read_smp_regEii"];
var __ZN7Hes_Apu5resetEv = Module["__ZN7Hes_Apu5resetEv"] = asm["__ZN7Hes_Apu5resetEv"];
var __ZN7Gbs_Emu8set_bankEi = Module["__ZN7Gbs_Emu8set_bankEi"] = asm["__ZN7Gbs_Emu8set_bankEi"];
var __ZN7Sap_EmuC2Ev = Module["__ZN7Sap_EmuC2Ev"] = asm["__ZN7Sap_EmuC2Ev"];
var __ZN7Nes_CpuC2Ev = Module["__ZN7Nes_CpuC2Ev"] = asm["__ZN7Nes_CpuC2Ev"];
var __ZN7Nes_ApuC2Ev = Module["__ZN7Nes_ApuC2Ev"] = asm["__ZN7Nes_ApuC2Ev"];
var __ZN7Spc_Emu5skip_El = Module["__ZN7Spc_Emu5skip_El"] = asm["__ZN7Spc_Emu5skip_El"];
var __ZN10Blip_SynthILi12ELi15EEC1Ev = Module["__ZN10Blip_SynthILi12ELi15EEC1Ev"] = asm["__ZN10Blip_SynthILi12ELi15EEC1Ev"];
var __ZL11new_gym_emuv = Module["__ZL11new_gym_emuv"] = asm["__ZL11new_gym_emuv"];
var __ZNKSt8bad_cast4whatEv = Module["__ZNKSt8bad_cast4whatEv"] = asm["__ZNKSt8bad_cast4whatEv"];
var _malloc_footprint_limit = Module["_malloc_footprint_limit"] = asm["_malloc_footprint_limit"];
var __ZN7Vgm_EmuC2Ev = Module["__ZN7Vgm_EmuC2Ev"] = asm["__ZN7Vgm_EmuC2Ev"];
var __ZN10Blip_SynthILi12ELi15EE9treble_eqERK9blip_eq_t = Module["__ZN10Blip_SynthILi12ELi15EE9treble_eqERK9blip_eq_t"] = asm["__ZN10Blip_SynthILi12ELi15EE9treble_eqERK9blip_eq_t"];
var __ZN8Vgm_FileD1Ev = Module["__ZN8Vgm_FileD1Ev"] = asm["__ZN8Vgm_FileD1Ev"];
var _valloc = Module["_valloc"] = asm["_valloc"];
var __ZNK13blargg_vectorIN12M3u_Playlist7entry_tEE4sizeEv = Module["__ZNK13blargg_vectorIN12M3u_Playlist7entry_tEE4sizeEv"] = asm["__ZNK13blargg_vectorIN12M3u_Playlist7entry_tEE4sizeEv"];
var __ZN13Subset_Reader10read_availEPvl = Module["__ZN13Subset_Reader10read_availEPvl"] = asm["__ZN13Subset_Reader10read_availEPvl"];
var __Z8from_decj = Module["__Z8from_decj"] = asm["__Z8from_decj"];
var __ZN8Gme_File9post_loadEPKc = Module["__ZN8Gme_File9post_loadEPKc"] = asm["__ZN8Gme_File9post_loadEPKc"];
var __ZN16Remaining_ReaderD1Ev = Module["__ZN16Remaining_ReaderD1Ev"] = asm["__ZN16Remaining_ReaderD1Ev"];
var __ZN12Nes_Fme7_Apu5resetEv = Module["__ZN12Nes_Fme7_Apu5resetEv"] = asm["__ZN12Nes_Fme7_Apu5resetEv"];
var __ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib = Module["__ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"] = asm["__ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"];
var __ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __ZN7Gbs_Emu8cpu_readEj = Module["__ZN7Gbs_Emu8cpu_readEj"] = asm["__ZN7Gbs_Emu8cpu_readEj"];
var __ZN7Nes_Apu10run_until_El = Module["__ZN7Nes_Apu10run_until_El"] = asm["__ZN7Nes_Apu10run_until_El"];
var __ZThn336_N12Vgm_Emu_ImplD0Ev = Module["__ZThn336_N12Vgm_Emu_ImplD0Ev"] = asm["__ZThn336_N12Vgm_Emu_ImplD0Ev"];
var __ZN8Snes_Spc4skipEi = Module["__ZN8Snes_Spc4skipEi"] = asm["__ZN8Snes_Spc4skipEi"];
var __ZN14Dual_ResamplerD2Ev = Module["__ZN14Dual_ResamplerD2Ev"] = asm["__ZN14Dual_ResamplerD2Ev"];
var __ZN13blargg_vectorIsE6resizeEj = Module["__ZN13blargg_vectorIsE6resizeEj"] = asm["__ZN13blargg_vectorIsE6resizeEj"];
var __ZN12Multi_BufferdlEPv = Module["__ZN12Multi_BufferdlEPv"] = asm["__ZN12Multi_BufferdlEPv"];
var __ZNK8Kss_File11track_info_EP12track_info_ti = Module["__ZNK8Kss_File11track_info_EP12track_info_ti"] = asm["__ZNK8Kss_File11track_info_EP12track_info_ti"];
var __ZN7Sap_Emu10cpu_write_Eji = Module["__ZN7Sap_Emu10cpu_write_Eji"] = asm["__ZN7Sap_Emu10cpu_write_Eji"];
var __ZN10__cxxabiv117__class_type_infoD0Ev = Module["__ZN10__cxxabiv117__class_type_infoD0Ev"] = asm["__ZN10__cxxabiv117__class_type_infoD0Ev"];
var __ZN11Blip_Synth_14adjust_impulseEv = Module["__ZN11Blip_Synth_14adjust_impulseEv"] = asm["__ZN11Blip_Synth_14adjust_impulseEv"];
var __ZN10Ym2612_EmuD2Ev = Module["__ZN10Ym2612_EmuD2Ev"] = asm["__ZN10Ym2612_EmuD2Ev"];
var __ZN6Gb_Cpu13set_code_pageEiPh = Module["__ZN6Gb_Cpu13set_code_pageEiPh"] = asm["__ZN6Gb_Cpu13set_code_pageEiPh"];
var __ZN8Rom_DataILi4096EE4loadER11Data_ReaderiPvi = Module["__ZN8Rom_DataILi4096EE4loadER11Data_ReaderiPvi"] = asm["__ZN8Rom_DataILi4096EE4loadER11Data_ReaderiPvi"];
var __ZN14Effects_Buffer12mix_enhancedEPsl = Module["__ZN14Effects_Buffer12mix_enhancedEPsl"] = asm["__ZN14Effects_Buffer12mix_enhancedEPsl"];
var __ZSt15set_new_handlerPFvvE = Module["__ZSt15set_new_handlerPFvvE"] = asm["__ZSt15set_new_handlerPFvvE"];
var __ZL15copy_gbs_fieldsRKN7Gbs_Emu8header_tEP12track_info_t = Module["__ZL15copy_gbs_fieldsRKN7Gbs_Emu8header_tEP12track_info_t"] = asm["__ZL15copy_gbs_fieldsRKN7Gbs_Emu8header_tEP12track_info_t"];
var __ZN8Snes_Spc9run_timerEPNS_5TimerEi = Module["__ZN8Snes_Spc9run_timerEPNS_5TimerEi"] = asm["__ZN8Snes_Spc9run_timerEPNS_5TimerEi"];
var __ZL8from_decPKhS0_ = Module["__ZL8from_decPKhS0_"] = asm["__ZL8from_decPKhS0_"];
var _malloc_trim = Module["_malloc_trim"] = asm["_malloc_trim"];
var __ZN7Kss_Emu12start_track_Ei = Module["__ZN7Kss_Emu12start_track_Ei"] = asm["__ZN7Kss_Emu12start_track_Ei"];
var __ZN9Rom_Data_14load_rom_data_ER11Data_ReaderiPvil = Module["__ZN9Rom_Data_14load_rom_data_ER11Data_ReaderiPvil"] = asm["__ZN9Rom_Data_14load_rom_data_ER11Data_ReaderiPvil"];
var __ZN13blargg_vectorIN12M3u_Playlist7entry_tEED2Ev = Module["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEED2Ev"] = asm["__ZN13blargg_vectorIN12M3u_Playlist7entry_tEED2Ev"];
var __ZN6Gb_Apu10osc_outputEiP11Blip_BufferS1_S1_ = Module["__ZN6Gb_Apu10osc_outputEiP11Blip_BufferS1_S1_"] = asm["__ZN6Gb_Apu10osc_outputEiP11Blip_BufferS1_S1_"];
var __ZN7Nes_Cpu8map_codeEjjPKvb = Module["__ZN7Nes_Cpu8map_codeEjjPKvb"] = asm["__ZN7Nes_Cpu8map_codeEjjPKvb"];
var __ZNSt8bad_castC2Ev = Module["__ZNSt8bad_castC2Ev"] = asm["__ZNSt8bad_castC2Ev"];
var __ZN9Music_Emu8set_fadeEll = Module["__ZN9Music_Emu8set_fadeEll"] = asm["__ZN9Music_Emu8set_fadeEll"];
var __ZN8Rom_DataILi8192EEC2Ev = Module["__ZN8Rom_DataILi8192EEC2Ev"] = asm["__ZN8Rom_DataILi8192EEC2Ev"];
var __ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi = Module["__ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"] = asm["__ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"];
var __ZN7Nes_Dmc13reload_sampleEv = Module["__ZN7Nes_Dmc13reload_sampleEv"] = asm["__ZN7Nes_Dmc13reload_sampleEv"];
var __ZNK12Nes_Vrc6_Apu10save_stateEP16vrc6_apu_state_t = Module["__ZNK12Nes_Vrc6_Apu10save_stateEP16vrc6_apu_state_t"] = asm["__ZNK12Nes_Vrc6_Apu10save_stateEP16vrc6_apu_state_t"];
var __ZN7Kss_Emu10set_tempo_Ed = Module["__ZN7Kss_Emu10set_tempo_Ed"] = asm["__ZN7Kss_Emu10set_tempo_Ed"];
var __ZL12check_headerPKhlPi = Module["__ZL12check_headerPKhlPi"] = asm["__ZL12check_headerPKhlPi"];
var _gme_track_count = Module["_gme_track_count"] = asm["_gme_track_count"];
var __ZN14Fir_Resampler_6bufferEv = Module["__ZN14Fir_Resampler_6bufferEv"] = asm["__ZN14Fir_Resampler_6bufferEv"];
var __ZN12M3u_PlaylistC1Ev = Module["__ZN12M3u_PlaylistC1Ev"] = asm["__ZN12M3u_PlaylistC1Ev"];
var __ZL12new_nsf_filev = Module["__ZL12new_nsf_filev"] = asm["__ZL12new_nsf_filev"];
var __ZN12Nes_TriangleC1Ev = Module["__ZN12Nes_TriangleC1Ev"] = asm["__ZN12Nes_TriangleC1Ev"];
var __ZNK15Mem_File_Reader4tellEv = Module["__ZNK15Mem_File_Reader4tellEv"] = asm["__ZNK15Mem_File_Reader4tellEv"];
var __ZN13blargg_vectorIsED1Ev = Module["__ZN13blargg_vectorIsED1Ev"] = asm["__ZN13blargg_vectorIsED1Ev"];
var __ZNK7Spc_Dsp7out_posEv = Module["__ZNK7Spc_Dsp7out_posEv"] = asm["__ZNK7Spc_Dsp7out_posEv"];
var __ZN10Blip_SynthILi8ELi1EE9treble_eqERK9blip_eq_t = Module["__ZN10Blip_SynthILi8ELi1EE9treble_eqERK9blip_eq_t"] = asm["__ZN10Blip_SynthILi8ELi1EE9treble_eqERK9blip_eq_t"];
var __ZNK11Blip_Buffer17clock_rate_factorEl = Module["__ZNK11Blip_Buffer17clock_rate_factorEl"] = asm["__ZNK11Blip_Buffer17clock_rate_factorEl"];
var __ZN8Sap_FileD2Ev = Module["__ZN8Sap_FileD2Ev"] = asm["__ZN8Sap_FileD2Ev"];
var __ZNK8Gme_File11track_countEv = Module["__ZNK8Gme_File11track_countEv"] = asm["__ZNK8Gme_File11track_countEv"];
var __ZL11new_gbs_emuv = Module["__ZL11new_gbs_emuv"] = asm["__ZL11new_gbs_emuv"];
var __ZNSt8bad_castD2Ev = Module["__ZNSt8bad_castD2Ev"] = asm["__ZNSt8bad_castD2Ev"];
var __ZNK11Blip_Buffer10clock_rateEv = Module["__ZNK11Blip_Buffer10clock_rateEv"] = asm["__ZNK11Blip_Buffer10clock_rateEv"];
var __ZNK15Std_File_Reader4sizeEv = Module["__ZNK15Std_File_Reader4sizeEv"] = asm["__ZNK15Std_File_Reader4sizeEv"];
var __ZN13blargg_vectorIA4_cED2Ev = Module["__ZN13blargg_vectorIA4_cED2Ev"] = asm["__ZN13blargg_vectorIA4_cED2Ev"];
var __ZN13blargg_vectorIA4_cE5clearEv = Module["__ZN13blargg_vectorIA4_cE5clearEv"] = asm["__ZN13blargg_vectorIA4_cE5clearEv"];
var __ZN7Gbs_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN7Gbs_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN7Gbs_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var __ZN8Gbs_FileD0Ev = Module["__ZN8Gbs_FileD0Ev"] = asm["__ZN8Gbs_FileD0Ev"];
var __ZN18ym2612_update_chanILi2EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi2EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi2EE4funcER8tables_tR9channel_tPsi"];
var __ZN9Rom_Data_D2Ev = Module["__ZN9Rom_Data_D2Ev"] = asm["__ZN9Rom_Data_D2Ev"];
var __ZL12get_gym_infoRKN7Gym_Emu8header_tElP12track_info_t = Module["__ZL12get_gym_infoRKN7Gym_Emu8header_tElP12track_info_t"] = asm["__ZL12get_gym_infoRKN7Gym_Emu8header_tElP12track_info_t"];
var __ZN7Kss_Cpu8set_timeEl = Module["__ZN7Kss_Cpu8set_timeEl"] = asm["__ZN7Kss_Cpu8set_timeEl"];
var __ZN18ym2612_update_chanILi7EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi7EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi7EE4funcER8tables_tR9channel_tPsi"];
var __ZN8Snes_Spc4playEiPs = Module["__ZN8Snes_Spc4playEiPs"] = asm["__ZN8Snes_Spc4playEiPs"];
var __ZN8Rom_DataILi16384EED2Ev = Module["__ZN8Rom_DataILi16384EED2Ev"] = asm["__ZN8Rom_DataILi16384EED2Ev"];
var __ZN7Kss_CpuC2Ev = Module["__ZN7Kss_CpuC2Ev"] = asm["__ZN7Kss_CpuC2Ev"];
var __ZN6Gb_Env14clock_envelopeEv = Module["__ZN6Gb_Env14clock_envelopeEv"] = asm["__ZN6Gb_Env14clock_envelopeEv"];
var __ZN9Nes_Noise3runEll = Module["__ZN9Nes_Noise3runEll"] = asm["__ZN9Nes_Noise3runEll"];
var __ZN8Nsf_FileC1Ev = Module["__ZN8Nsf_FileC1Ev"] = asm["__ZN8Nsf_FileC1Ev"];
var __ZL11new_nsf_emuv = Module["__ZL11new_nsf_emuv"] = asm["__ZL11new_nsf_emuv"];
var __ZN7Gym_Emu16set_sample_rate_El = Module["__ZN7Gym_Emu16set_sample_rate_El"] = asm["__ZN7Gym_Emu16set_sample_rate_El"];
var __ZN12Nes_Fme7_Apu9run_untilEi = Module["__ZN12Nes_Fme7_Apu9run_untilEi"] = asm["__ZN12Nes_Fme7_Apu9run_untilEi"];
var __ZdaPvRKSt9nothrow_t = Module["__ZdaPvRKSt9nothrow_t"] = asm["__ZdaPvRKSt9nothrow_t"];
var __ZN12Nes_Vrc6_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN12Nes_Vrc6_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN12Nes_Vrc6_Apu10osc_outputEiP11Blip_Buffer"];
var __ZL8copy_strPKcPci = Module["__ZL8copy_strPKcPci"] = asm["__ZL8copy_strPKcPci"];
var __ZN11Classic_Emu12start_track_Ei = Module["__ZN11Classic_Emu12start_track_Ei"] = asm["__ZN11Classic_Emu12start_track_Ei"];
var __ZN8Snes_Spc10save_extraEv = Module["__ZN8Snes_Spc10save_extraEv"] = asm["__ZN8Snes_Spc10save_extraEv"];
var __ZN12Nes_Vrc6_Apu9end_frameEi = Module["__ZN12Nes_Vrc6_Apu9end_frameEi"] = asm["__ZN12Nes_Vrc6_Apu9end_frameEi"];
var __ZN8Snes_Spc8cpu_readEii = Module["__ZN8Snes_Spc8cpu_readEii"] = asm["__ZN8Snes_Spc8cpu_readEii"];
var _gme_play = Module["_gme_play"] = asm["_gme_play"];
var __ZN14Dual_Resampler5resetEi = Module["__ZN14Dual_Resampler5resetEi"] = asm["__ZN14Dual_Resampler5resetEi"];
var __ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib = Module["__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"] = asm["__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"];
var __ZN7Hes_Emu9cpu_read_Ej = Module["__ZN7Hes_Emu9cpu_read_Ej"] = asm["__ZN7Hes_Emu9cpu_read_Ej"];
var __ZN10Ym2612_Emu11mute_voicesEi = Module["__ZN10Ym2612_Emu11mute_voicesEi"] = asm["__ZN10Ym2612_Emu11mute_voicesEi"];
var __ZN15Std_File_Reader10read_availEPvl = Module["__ZN15Std_File_Reader10read_availEPvl"] = asm["__ZN15Std_File_Reader10read_availEPvl"];
var _gme_load_file = Module["_gme_load_file"] = asm["_gme_load_file"];
var _gme_set_tempo = Module["_gme_set_tempo"] = asm["_gme_set_tempo"];
var _pvalloc = Module["_pvalloc"] = asm["_pvalloc"];
var __ZN10SPC_Filter3runEPsi = Module["__ZN10SPC_Filter3runEPsi"] = asm["__ZN10SPC_Filter3runEPsi"];
var __ZL16check_nsf_headerPKv = Module["__ZL16check_nsf_headerPKv"] = asm["__ZL16check_nsf_headerPKv"];
var __ZN8Nsfe_Emu5load_ER11Data_Reader = Module["__ZN8Nsfe_Emu5load_ER11Data_Reader"] = asm["__ZN8Nsfe_Emu5load_ER11Data_Reader"];
var __ZN7Hes_Apu6volumeEd = Module["__ZN7Hes_Apu6volumeEd"] = asm["__ZN7Hes_Apu6volumeEd"];
var __ZN9Gme_Info_12mute_voices_Ei = Module["__ZN9Gme_Info_12mute_voices_Ei"] = asm["__ZN9Gme_Info_12mute_voices_Ei"];
var __ZNSt9type_infoD0Ev = Module["__ZNSt9type_infoD0Ev"] = asm["__ZNSt9type_infoD0Ev"];
var __ZL3minll540 = Module["__ZL3minll540"] = asm["__ZL3minll540"];
var __ZN7Sap_Cpu12set_end_timeEl = Module["__ZN7Sap_Cpu12set_end_timeEl"] = asm["__ZN7Sap_Cpu12set_end_timeEl"];
var _gme_start_track = Module["_gme_start_track"] = asm["_gme_start_track"];
var __ZN15Mem_File_ReaderC2EPKvl = Module["__ZN15Mem_File_ReaderC2EPKvl"] = asm["__ZN15Mem_File_ReaderC2EPKvl"];
var __ZL10parse_infoPKhlPN7Sap_Emu6info_tE = Module["__ZL10parse_infoPKhlPN7Sap_Emu6info_tE"] = asm["__ZL10parse_infoPKhlPN7Sap_Emu6info_tE"];
var __ZN7Gbs_EmuD2Ev = Module["__ZN7Gbs_EmuD2Ev"] = asm["__ZN7Gbs_EmuD2Ev"];
var __ZN13Nes_Namco_ApudlEPv = Module["__ZN13Nes_Namco_ApudlEPv"] = asm["__ZN13Nes_Namco_ApudlEPv"];
var __ZN7Hes_Emu10run_clocksERii = Module["__ZN7Hes_Emu10run_clocksERii"] = asm["__ZN7Hes_Emu10run_clocksERii"];
var __ZN7Spc_Emu12start_track_Ei = Module["__ZN7Spc_Emu12start_track_Ei"] = asm["__ZN7Spc_Emu12start_track_Ei"];
var __ZN10Ym2413_Emu11mute_voicesEi = Module["__ZN10Ym2413_Emu11mute_voicesEi"] = asm["__ZN10Ym2413_Emu11mute_voicesEi"];
var __ZNK11Blip_Buffer13samples_availEv = Module["__ZNK11Blip_Buffer13samples_availEv"] = asm["__ZNK11Blip_Buffer13samples_availEv"];
var __ZN7Kss_Emu6unloadEv = Module["__ZN7Kss_Emu6unloadEv"] = asm["__ZN7Kss_Emu6unloadEv"];
var __ZNK12Multi_Buffer11sample_rateEv = Module["__ZNK12Multi_Buffer11sample_rateEv"] = asm["__ZNK12Multi_Buffer11sample_rateEv"];
var __ZN15Callback_Reader10read_availEPvl = Module["__ZN15Callback_Reader10read_availEPvl"] = asm["__ZN15Callback_Reader10read_availEPvl"];
var __ZN12Nes_Vrc6_Apu9run_untilEi = Module["__ZN12Nes_Vrc6_Apu9run_untilEi"] = asm["__ZN12Nes_Vrc6_Apu9run_untilEi"];
var __ZL12get_spc_infoRKN7Spc_Emu8header_tEPKhlP12track_info_t = Module["__ZL12get_spc_infoRKN7Spc_Emu8header_tEPKhlP12track_info_t"] = asm["__ZL12get_spc_infoRKN7Spc_Emu8header_tEPKhlP12track_info_t"];
var __Z10kss_cpu_inP7Kss_Cpulj = Module["__Z10kss_cpu_inP7Kss_Cpulj"] = asm["__Z10kss_cpu_inP7Kss_Cpulj"];
var __ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __Z21YM2612_Special_Updatev = Module["__Z21YM2612_Special_Updatev"] = asm["__Z21YM2612_Special_Updatev"];
var __ZN8Gme_FiledlEPv = Module["__ZN8Gme_FiledlEPv"] = asm["__ZN8Gme_FiledlEPv"];
var __ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi = Module["__ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"] = asm["__ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var __Z12zero_apu_oscI10Nes_SquareEvPT_l = Module["__Z12zero_apu_oscI10Nes_SquareEvPT_l"] = asm["__Z12zero_apu_oscI10Nes_SquareEvPT_l"];
var __ZN15Mem_File_ReaderD0Ev = Module["__ZN15Mem_File_ReaderD0Ev"] = asm["__ZN15Mem_File_ReaderD0Ev"];
var __ZN13blargg_vectorIPKcED1Ev = Module["__ZN13blargg_vectorIPKcED1Ev"] = asm["__ZN13blargg_vectorIPKcED1Ev"];
var __vwarnx = Module["__vwarnx"] = asm["__vwarnx"];
var __ZN9Sms_NoiseC1Ev = Module["__ZN9Sms_NoiseC1Ev"] = asm["__ZN9Sms_NoiseC1Ev"];
var __ZN11Blip_Reader5beginER11Blip_Buffer = Module["__ZN11Blip_Reader5beginER11Blip_Buffer"] = asm["__ZN11Blip_Reader5beginER11Blip_Buffer"];
var __ZN10__cxxabiv117__array_type_infoD0Ev = Module["__ZN10__cxxabiv117__array_type_infoD0Ev"] = asm["__ZN10__cxxabiv117__array_type_infoD0Ev"];
var __ZN7Nsf_EmuD2Ev = Module["__ZN7Nsf_EmuD2Ev"] = asm["__ZN7Nsf_EmuD2Ev"];
var __ZN8Gym_FileD0Ev = Module["__ZN8Gym_FileD0Ev"] = asm["__ZN8Gym_FileD0Ev"];
var __ZN8Snes_Spc10set_outputEPsi = Module["__ZN8Snes_Spc10set_outputEPsi"] = asm["__ZN8Snes_Spc10set_outputEPsi"];
var __ZNK7Nes_Cpu11error_countEv = Module["__ZNK7Nes_Cpu11error_countEv"] = asm["__ZNK7Nes_Cpu11error_countEv"];
var __ZN10Ym2413_Emu5writeEii = Module["__ZN10Ym2413_Emu5writeEii"] = asm["__ZN10Ym2413_Emu5writeEii"];
var __ZNK9Music_Emu4gainEv = Module["__ZNK9Music_Emu4gainEv"] = asm["__ZNK9Music_Emu4gainEv"];
var __ZN7Spc_EmuD0Ev = Module["__ZN7Spc_EmuD0Ev"] = asm["__ZN7Spc_EmuD0Ev"];
var __ZN6Ay_Emu9load_mem_EPKhl = Module["__ZN6Ay_Emu9load_mem_EPKhl"] = asm["__ZN6Ay_Emu9load_mem_EPKhl"];
var __ZNK6Ay_Emu11track_info_EP12track_info_ti = Module["__ZNK6Ay_Emu11track_info_EP12track_info_ti"] = asm["__ZNK6Ay_Emu11track_info_EP12track_info_ti"];
var __ZNK8Nsf_File11track_info_EP12track_info_ti = Module["__ZNK8Nsf_File11track_info_EP12track_info_ti"] = asm["__ZNK8Nsf_File11track_info_EP12track_info_ti"];
var _malloc_usable_size = Module["_malloc_usable_size"] = asm["_malloc_usable_size"];
var __ZL11new_vgm_emuv = Module["__ZL11new_vgm_emuv"] = asm["__ZL11new_vgm_emuv"];
var __ZN7Sap_Apu9end_frameEi = Module["__ZN7Sap_Apu9end_frameEi"] = asm["__ZN7Sap_Apu9end_frameEi"];
var __ZN6Ay_Emu12cpu_out_miscElji = Module["__ZN6Ay_Emu12cpu_out_miscElji"] = asm["__ZN6Ay_Emu12cpu_out_miscElji"];
var __ZN12Multi_BufferD1Ev = Module["__ZN12Multi_BufferD1Ev"] = asm["__ZN12Multi_BufferD1Ev"];
var __ZN9Music_Emu11handle_fadeElPs = Module["__ZN9Music_Emu11handle_fadeElPs"] = asm["__ZN9Music_Emu11handle_fadeElPs"];
var __ZN13Subset_ReaderC2EP11Data_Readerl = Module["__ZN13Subset_ReaderC2EP11Data_Readerl"] = asm["__ZN13Subset_ReaderC2EP11Data_Readerl"];
var __ZN9Nsfe_Info4loadER11Data_ReaderP7Nsf_Emu = Module["__ZN9Nsfe_Info4loadER11Data_ReaderP7Nsf_Emu"] = asm["__ZN9Nsfe_Info4loadER11Data_ReaderP7Nsf_Emu"];
var ___cxx_global_var_init285 = Module["___cxx_global_var_init285"] = asm["___cxx_global_var_init285"];
var __ZN9Music_Emu11mute_voicesEi = Module["__ZN9Music_Emu11mute_voicesEi"] = asm["__ZN9Music_Emu11mute_voicesEi"];
var __ZNK10__cxxabiv116__shim_type_info5noop2Ev = Module["__ZNK10__cxxabiv116__shim_type_info5noop2Ev"] = asm["__ZNK10__cxxabiv116__shim_type_info5noop2Ev"];
var __ZN13Nes_Namco_Apu6volumeEd = Module["__ZN13Nes_Namco_Apu6volumeEd"] = asm["__ZN13Nes_Namco_Apu6volumeEd"];
var __ZL16check_gbs_headerPKv = Module["__ZL16check_gbs_headerPKv"] = asm["__ZL16check_gbs_headerPKv"];
var __ZN7Gbs_Emu9update_eqERK9blip_eq_t = Module["__ZN7Gbs_Emu9update_eqERK9blip_eq_t"] = asm["__ZN7Gbs_Emu9update_eqERK9blip_eq_t"];
var __err = Module["__err"] = asm["__err"];
var __ZN6Gb_Apu9write_oscEiii = Module["__ZN6Gb_Apu9write_oscEiii"] = asm["__ZN6Gb_Apu9write_oscEiii"];
var __ZN13Stereo_BufferC2Ev = Module["__ZN13Stereo_BufferC2Ev"] = asm["__ZN13Stereo_BufferC2Ev"];
var __ZN9Music_Emu9set_tempoEd = Module["__ZN9Music_Emu9set_tempoEd"] = asm["__ZN9Music_Emu9set_tempoEd"];
var __ZN11File_ReaderD0Ev = Module["__ZN11File_ReaderD0Ev"] = asm["__ZN11File_ReaderD0Ev"];
var __ZN8Snes_Spc12reset_commonEi = Module["__ZN8Snes_Spc12reset_commonEi"] = asm["__ZN8Snes_Spc12reset_commonEi"];
var __ZN13Stereo_BufferD2Ev = Module["__ZN13Stereo_BufferD2Ev"] = asm["__ZN13Stereo_BufferD2Ev"];
var __ZN9Music_Emu15set_sample_rateEl = Module["__ZN9Music_Emu15set_sample_rateEl"] = asm["__ZN9Music_Emu15set_sample_rateEl"];
var __ZN14Dual_Resampler5clearEv = Module["__ZN14Dual_Resampler5clearEv"] = asm["__ZN14Dual_Resampler5clearEv"];
var __ZL3maxii = Module["__ZL3maxii"] = asm["__ZL3maxii"];
var _gme_track_info = Module["_gme_track_info"] = asm["_gme_track_info"];
var _gme_delete = Module["_gme_delete"] = asm["_gme_delete"];
var __ZN7Sap_Apu12calc_periodsEv = Module["__ZN7Sap_Apu12calc_periodsEv"] = asm["__ZN7Sap_Apu12calc_periodsEv"];
var __ZN12Nes_Fme7_Apu10write_dataEii = Module["__ZN12Nes_Fme7_Apu10write_dataEii"] = asm["__ZN12Nes_Fme7_Apu10write_dataEii"];
var __ZN6Ay_Apu6volumeEd = Module["__ZN6Ay_Apu6volumeEd"] = asm["__ZN6Ay_Apu6volumeEd"];
var __ZN12Nes_Vrc6_Apu10load_stateERK16vrc6_apu_state_t = Module["__ZN12Nes_Vrc6_Apu10load_stateERK16vrc6_apu_state_t"] = asm["__ZN12Nes_Vrc6_Apu10load_stateERK16vrc6_apu_state_t"];
var __ZN8Gme_FilenwEj = Module["__ZN8Gme_FilenwEj"] = asm["__ZN8Gme_FilenwEj"];
var __ZNK7Hes_Emu11track_info_EP12track_info_ti = Module["__ZNK7Hes_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Hes_Emu11track_info_EP12track_info_ti"];
var __ZN14Effects_Buffer9end_frameEi = Module["__ZN14Effects_Buffer9end_frameEi"] = asm["__ZN14Effects_Buffer9end_frameEi"];
var __ZN6Ay_Apu9end_frameEi = Module["__ZN6Ay_Apu9end_frameEi"] = asm["__ZN6Ay_Apu9end_frameEi"];
var _gme_identify_file = Module["_gme_identify_file"] = asm["_gme_identify_file"];
var __ZL7int_loglii = Module["__ZL7int_loglii"] = asm["__ZL7int_loglii"];
var __ZN18ym2612_update_chanILi3EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi3EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi3EE4funcER8tables_tR9channel_tPsi"];
var __ZN7Kss_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN7Kss_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN7Kss_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var __ZN8Vgm_FileD0Ev = Module["__ZN8Vgm_FileD0Ev"] = asm["__ZN8Vgm_FileD0Ev"];
var __ZN8Kss_FileD2Ev = Module["__ZN8Kss_FileD2Ev"] = asm["__ZN8Kss_FileD2Ev"];
var __ZN7Nes_Cpu3runEl = Module["__ZN7Nes_Cpu3runEl"] = asm["__ZN7Nes_Cpu3runEl"];
var __ZN8Rom_DataILi16384EEC2Ev = Module["__ZN8Rom_DataILi16384EEC2Ev"] = asm["__ZN8Rom_DataILi16384EEC2Ev"];
var __ZL3minii606 = Module["__ZL3minii606"] = asm["__ZL3minii606"];
var __ZNK8Gym_File11track_info_EP12track_info_ti = Module["__ZNK8Gym_File11track_info_EP12track_info_ti"] = asm["__ZNK8Gym_File11track_info_EP12track_info_ti"];
var __ZL10parse_namePc = Module["__ZL10parse_namePc"] = asm["__ZL10parse_namePc"];
var __ZN12Multi_Buffer16channels_changedEv = Module["__ZN12Multi_Buffer16channels_changedEv"] = asm["__ZN12Multi_Buffer16channels_changedEv"];
var __ZN12Nes_Vrc6_ApunwEj = Module["__ZN12Nes_Vrc6_ApunwEj"] = asm["__ZN12Nes_Vrc6_ApunwEj"];
var __ZN8Rom_DataILi8192EE4loadER11Data_ReaderiPvi = Module["__ZN8Rom_DataILi8192EE4loadER11Data_ReaderiPvi"] = asm["__ZN8Rom_DataILi8192EE4loadER11Data_ReaderiPvi"];
var __ZN7Hes_ApuC2Ev = Module["__ZN7Hes_ApuC2Ev"] = asm["__ZN7Hes_ApuC2Ev"];
var __ZN13blargg_vectorIhEC2Ev = Module["__ZN13blargg_vectorIhEC2Ev"] = asm["__ZN13blargg_vectorIhEC2Ev"];
var _strtof = Module["_strtof"] = asm["_strtof"];
var _strtod = Module["_strtod"] = asm["_strtod"];
var __ZN7Scc_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN7Scc_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN7Scc_Apu10osc_outputEiP11Blip_Buffer"];
var __ZN7Nes_Osc10update_ampEi = Module["__ZN7Nes_Osc10update_ampEi"] = asm["__ZN7Nes_Osc10update_ampEi"];
var __ZL10parse_int_PcPi = Module["__ZL10parse_int_PcPi"] = asm["__ZL10parse_int_PcPi"];
var __ZN8Snes_Spc10ram_loadedEv = Module["__ZN8Snes_Spc10ram_loadedEv"] = asm["__ZN8Snes_Spc10ram_loadedEv"];
var __ZN15Callback_ReaderC2EPFPKcPvS2_iElS2_ = Module["__ZN15Callback_ReaderC2EPFPKcPvS2_iElS2_"] = asm["__ZN15Callback_ReaderC2EPFPKcPvS2_iElS2_"];
var __ZN9blip_eq_tC2Ed = Module["__ZN9blip_eq_tC2Ed"] = asm["__ZN9blip_eq_tC2Ed"];
var __ZN10Sms_Square3runEii = Module["__ZN10Sms_Square3runEii"] = asm["__ZN10Sms_Square3runEii"];
var __ZN10Ym2612_EmuC1Ev = Module["__ZN10Ym2612_EmuC1Ev"] = asm["__ZN10Ym2612_EmuC1Ev"];
var _gme_load_m3u = Module["_gme_load_m3u"] = asm["_gme_load_m3u"];
var __ZN8Hes_FileD0Ev = Module["__ZN8Hes_FileD0Ev"] = asm["__ZN8Hes_FileD0Ev"];
var __ZN7Spc_Emu9load_mem_EPKhl = Module["__ZN7Spc_Emu9load_mem_EPKhl"] = asm["__ZN7Spc_Emu9load_mem_EPKhl"];
var __ZN7Spc_Dsp16disable_surroundEb = Module["__ZN7Spc_Dsp16disable_surroundEb"] = asm["__ZN7Spc_Dsp16disable_surroundEb"];
var __ZNK9Music_Emu5tempoEv = Module["__ZNK9Music_Emu5tempoEv"] = asm["__ZNK9Music_Emu5tempoEv"];
var __ZN7Nes_Cpu17clear_error_countEv = Module["__ZN7Nes_Cpu17clear_error_countEv"] = asm["__ZN7Nes_Cpu17clear_error_countEv"];
var __ZN8Snes_Spc8init_romEPKh = Module["__ZN8Snes_Spc8init_romEPKh"] = asm["__ZN8Snes_Spc8init_romEPKh"];
var __ZNK13blargg_vectorIhE5beginEv = Module["__ZNK13blargg_vectorIhE5beginEv"] = asm["__ZNK13blargg_vectorIhE5beginEv"];
var __ZN10__cxxabiv129__pointer_to_member_type_infoD0Ev = Module["__ZN10__cxxabiv129__pointer_to_member_type_infoD0Ev"] = asm["__ZN10__cxxabiv129__pointer_to_member_type_infoD0Ev"];
var __ZN7Nes_Dmc5startEv = Module["__ZN7Nes_Dmc5startEv"] = asm["__ZN7Nes_Dmc5startEv"];
var _gme_equalizer = Module["_gme_equalizer"] = asm["_gme_equalizer"];
var __ZN12Nes_Vrc6_Apu7run_sawEi = Module["__ZN12Nes_Vrc6_Apu7run_sawEi"] = asm["__ZN12Nes_Vrc6_Apu7run_sawEi"];
var __ZN7Hes_Osc9run_untilER10Blip_SynthILi8ELi1EEi = Module["__ZN7Hes_Osc9run_untilER10Blip_SynthILi8ELi1EEi"] = asm["__ZN7Hes_Osc9run_untilER10Blip_SynthILi8ELi1EEi"];
var __ZN7Kss_Cpu11adjust_timeEi = Module["__ZN7Kss_Cpu11adjust_timeEi"] = asm["__ZN7Kss_Cpu11adjust_timeEi"];
var __ZN10Sms_Square5resetEv = Module["__ZN10Sms_Square5resetEv"] = asm["__ZN10Sms_Square5resetEv"];
var __ZN7Spc_Emu12mute_voices_Ei = Module["__ZN7Spc_Emu12mute_voices_Ei"] = asm["__ZN7Spc_Emu12mute_voices_Ei"];
var __ZN15Std_File_Reader4readEPvl = Module["__ZN15Std_File_Reader4readEPvl"] = asm["__ZN15Std_File_Reader4readEPvl"];
var __ZNK7Vgm_Emu8gd3_dataEPi = Module["__ZNK7Vgm_Emu8gd3_dataEPi"] = asm["__ZNK7Vgm_Emu8gd3_dataEPi"];
var _gme_load_data = Module["_gme_load_data"] = asm["_gme_load_data"];
var __ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib = Module["__ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"] = asm["__ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"];
var __ZN7Nes_Cpu13set_code_pageEiPKv = Module["__ZN7Nes_Cpu13set_code_pageEiPKv"] = asm["__ZN7Nes_Cpu13set_code_pageEiPKv"];
var __ZL9parse_gd3PKhS0_P12track_info_t = Module["__ZL9parse_gd3PKhS0_P12track_info_t"] = asm["__ZL9parse_gd3PKhS0_P12track_info_t"];
var __ZN11Ym2612_Impl7KEY_OFFER9channel_ti = Module["__ZN11Ym2612_Impl7KEY_OFFER9channel_ti"] = asm["__ZN11Ym2612_Impl7KEY_OFFER9channel_ti"];
var _gme_new_emu = Module["_gme_new_emu"] = asm["_gme_new_emu"];
var _try_realloc_chunk = Module["_try_realloc_chunk"] = asm["_try_realloc_chunk"];
var __ZN7Ay_FileD1Ev = Module["__ZN7Ay_FileD1Ev"] = asm["__ZN7Ay_FileD1Ev"];
var _gme_load_custom = Module["_gme_load_custom"] = asm["_gme_load_custom"];
var __ZNK12M3u_Playlist11first_errorEv = Module["__ZNK12M3u_Playlist11first_errorEv"] = asm["__ZNK12M3u_Playlist11first_errorEv"];
var __ZN6Gb_Apu6outputEP11Blip_BufferS1_S1_ = Module["__ZN6Gb_Apu6outputEP11Blip_BufferS1_S1_"] = asm["__ZN6Gb_Apu6outputEP11Blip_BufferS1_S1_"];
var __Z8get_le16PKv = Module["__Z8get_le16PKv"] = asm["__Z8get_le16PKv"];
var __ZN10__cxxabiv123__fundamental_type_infoD0Ev = Module["__ZN10__cxxabiv123__fundamental_type_infoD0Ev"] = asm["__ZN10__cxxabiv123__fundamental_type_infoD0Ev"];
var __ZN7Sms_Apu14write_ggstereoEii = Module["__ZN7Sms_Apu14write_ggstereoEii"] = asm["__ZN7Sms_Apu14write_ggstereoEii"];
var __ZN12Nes_Vrc6_Apu9treble_eqERK9blip_eq_t = Module["__ZN12Nes_Vrc6_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN12Nes_Vrc6_Apu9treble_eqERK9blip_eq_t"];
var __ZN10Nes_Square5resetEv = Module["__ZN10Nes_Square5resetEv"] = asm["__ZN10Nes_Square5resetEv"];
var __Znwj = Module["__Znwj"] = asm["__Znwj"];
var __ZN15Std_File_Reader4openEPKc = Module["__ZN15Std_File_Reader4openEPKc"] = asm["__ZN15Std_File_Reader4openEPKc"];
var __ZN7Nes_Dmc11fill_bufferEv = Module["__ZN7Nes_Dmc11fill_bufferEv"] = asm["__ZN7Nes_Dmc11fill_bufferEv"];
var __ZN13blargg_vectorIPKcEC2Ev = Module["__ZN13blargg_vectorIPKcEC2Ev"] = asm["__ZN13blargg_vectorIPKcEC2Ev"];
var __ZNK13blargg_vectorIPKcEixEj = Module["__ZNK13blargg_vectorIPKcEixEj"] = asm["__ZNK13blargg_vectorIPKcEixEj"];
var __ZNK9Nsfe_Info11remap_trackEi = Module["__ZNK9Nsfe_Info11remap_trackEi"] = asm["__ZNK9Nsfe_Info11remap_trackEi"];
var __ZN7Scc_ApuC2Ev = Module["__ZN7Scc_ApuC2Ev"] = asm["__ZN7Scc_ApuC2Ev"];
var __ZN7Spc_Dsp16update_voice_volEi = Module["__ZN7Spc_Dsp16update_voice_volEi"] = asm["__ZN7Spc_Dsp16update_voice_volEi"];
var __ZN7Kss_Emu10run_clocksERii = Module["__ZN7Kss_Emu10run_clocksERii"] = asm["__ZN7Kss_Emu10run_clocksERii"];
var __ZN7Kss_Cpu8set_pageEiPvPKv = Module["__ZN7Kss_Cpu8set_pageEiPvPKv"] = asm["__ZN7Kss_Cpu8set_pageEiPvPKv"];
var __ZN7Spc_Dsp12init_counterEv = Module["__ZN7Spc_Dsp12init_counterEv"] = asm["__ZN7Spc_Dsp12init_counterEv"];
var __ZN13blargg_vectorIA4_cEC2Ev = Module["__ZN13blargg_vectorIA4_cEC2Ev"] = asm["__ZN13blargg_vectorIA4_cEC2Ev"];
var _gme_free_info = Module["_gme_free_info"] = asm["_gme_free_info"];
var __ZN9Gb_Square11clock_sweepEv = Module["__ZN9Gb_Square11clock_sweepEv"] = asm["__ZN9Gb_Square11clock_sweepEv"];
var __ZN16Remaining_ReaderD2Ev = Module["__ZN16Remaining_ReaderD2Ev"] = asm["__ZN16Remaining_ReaderD2Ev"];
var __ZNK7Spc_Dsp4readEi = Module["__ZNK7Spc_Dsp4readEi"] = asm["__ZNK7Spc_Dsp4readEi"];
var __ZN7Spc_Dsp11mute_voicesEi = Module["__ZN7Spc_Dsp11mute_voicesEi"] = asm["__ZN7Spc_Dsp11mute_voicesEi"];
var __ZNK9Nsfe_File11track_info_EP12track_info_ti = Module["__ZNK9Nsfe_File11track_info_EP12track_info_ti"] = asm["__ZNK9Nsfe_File11track_info_EP12track_info_ti"];
var __ZN6Ay_Apu5writeEiii = Module["__ZN6Ay_Apu5writeEiii"] = asm["__ZN6Ay_Apu5writeEiii"];
var __ZL8get_dataRKN6Ay_Emu6file_tEPKhi = Module["__ZL8get_dataRKN6Ay_Emu6file_tEPKhi"] = asm["__ZL8get_dataRKN6Ay_Emu6file_tEPKhi"];
var _strtold = Module["_strtold"] = asm["_strtold"];
var __ZN9Gme_Info_5play_ElPs = Module["__ZN9Gme_Info_5play_ElPs"] = asm["__ZN9Gme_Info_5play_ElPs"];
var __ZN7Kss_Cpu5resetEPvPKv = Module["__ZN7Kss_Cpu5resetEPvPKv"] = asm["__ZN7Kss_Cpu5resetEPvPKv"];
var __ZN11Mono_Buffer15set_sample_rateEli = Module["__ZN11Mono_Buffer15set_sample_rateEli"] = asm["__ZN11Mono_Buffer15set_sample_rateEli"];
var __ZL3minii681 = Module["__ZL3minii681"] = asm["__ZL3minii681"];
var __ZNK9Music_Emu15msec_to_samplesEl = Module["__ZNK9Music_Emu15msec_to_samplesEl"] = asm["__ZNK9Music_Emu15msec_to_samplesEl"];
var __ZN6Ym_EmuI10Ym2413_EmuEC2Ev = Module["__ZN6Ym_EmuI10Ym2413_EmuEC2Ev"] = asm["__ZN6Ym_EmuI10Ym2413_EmuEC2Ev"];
var __ZN8Snes_Spc14cpu_write_highEiii = Module["__ZN8Snes_Spc14cpu_write_highEiii"] = asm["__ZN8Snes_Spc14cpu_write_highEiii"];
var __ZN6Ay_Emu10run_clocksERii = Module["__ZN6Ay_Emu10run_clocksERii"] = asm["__ZN6Ay_Emu10run_clocksERii"];
var __ZNK8Rom_DataILi8192EE9mask_addrEl = Module["__ZNK8Rom_DataILi8192EE9mask_addrEl"] = asm["__ZNK8Rom_DataILi8192EE9mask_addrEl"];
var __ZN7Gym_EmuC2Ev = Module["__ZN7Gym_EmuC2Ev"] = asm["__ZN7Gym_EmuC2Ev"];
var __ZN11Classic_Emu16set_sample_rate_El = Module["__ZN11Classic_Emu16set_sample_rate_El"] = asm["__ZN11Classic_Emu16set_sample_rate_El"];
var __ZN7Gym_Emu12mute_voices_Ei = Module["__ZN7Gym_Emu12mute_voices_Ei"] = asm["__ZN7Gym_Emu12mute_voices_Ei"];
var __ZL14parse_filenamePcRN12M3u_Playlist7entry_tE = Module["__ZL14parse_filenamePcRN12M3u_Playlist7entry_tE"] = asm["__ZL14parse_filenamePcRN12M3u_Playlist7entry_tE"];
var __ZN10Sms_SquareC1Ev = Module["__ZN10Sms_SquareC1Ev"] = asm["__ZN10Sms_SquareC1Ev"];
var __ZN8Kss_FileC2Ev = Module["__ZN8Kss_FileC2Ev"] = asm["__ZN8Kss_FileC2Ev"];
var __ZN7Sap_Emu9call_playEv = Module["__ZN7Sap_Emu9call_playEv"] = asm["__ZN7Sap_Emu9call_playEv"];
var __ZN7Nes_Apu10dmc_readerEPFiPvjES0_ = Module["__ZN7Nes_Apu10dmc_readerEPFiPvjES0_"] = asm["__ZN7Nes_Apu10dmc_readerEPFiPvjES0_"];
var __ZNK7Gym_Emu11track_info_EP12track_info_ti = Module["__ZNK7Gym_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Gym_Emu11track_info_EP12track_info_ti"];
var __ZN13Nes_Namco_Apu10osc_outputEiP11Blip_Buffer = Module["__ZN13Nes_Namco_Apu10osc_outputEiP11Blip_Buffer"] = asm["__ZN13Nes_Namco_Apu10osc_outputEiP11Blip_Buffer"];
var __ZN8Rom_DataILi8192EE5clearEv = Module["__ZN8Rom_DataILi8192EE5clearEv"] = asm["__ZN8Rom_DataILi8192EE5clearEv"];
var __ZNK8Rom_DataILi16384EE9mask_addrEl = Module["__ZNK8Rom_DataILi16384EE9mask_addrEl"] = asm["__ZNK8Rom_DataILi16384EE9mask_addrEl"];
var __ZN7Scc_Apu6outputEP11Blip_Buffer = Module["__ZN7Scc_Apu6outputEP11Blip_Buffer"] = asm["__ZN7Scc_Apu6outputEP11Blip_Buffer"];
var __ZN12Nes_Vrc6_ApuC2Ev = Module["__ZN12Nes_Vrc6_ApuC2Ev"] = asm["__ZN12Nes_Vrc6_ApuC2Ev"];
var __ZL13new_nsfe_filev = Module["__ZL13new_nsfe_filev"] = asm["__ZL13new_nsfe_filev"];
var __ZN7Sms_Apu10osc_outputEiP11Blip_BufferS1_S1_ = Module["__ZN7Sms_Apu10osc_outputEiP11Blip_BufferS1_S1_"] = asm["__ZN7Sms_Apu10osc_outputEiP11Blip_BufferS1_S1_"];
var __ZN8Snes_Spc9reset_bufEv = Module["__ZN8Snes_Spc9reset_bufEv"] = asm["__ZN8Snes_Spc9reset_bufEv"];
var __ZN7Scc_Apu9run_untilEi = Module["__ZN7Scc_Apu9run_untilEi"] = asm["__ZN7Scc_Apu9run_untilEi"];
var __ZN15Callback_ReaderD2Ev = Module["__ZN15Callback_ReaderD2Ev"] = asm["__ZN15Callback_ReaderD2Ev"];
var __ZnwjRKSt9nothrow_t = Module["__ZnwjRKSt9nothrow_t"] = asm["__ZnwjRKSt9nothrow_t"];
var _memset = Module["_memset"] = asm["_memset"];
var __ZN6Ay_ApuC2Ev = Module["__ZN6Ay_ApuC2Ev"] = asm["__ZN6Ay_ApuC2Ev"];
var _atof = Module["_atof"] = asm["_atof"];
var __ZN7Nsf_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN7Nsf_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN7Nsf_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var __ZN8Gme_FileD2Ev = Module["__ZN8Gme_FileD2Ev"] = asm["__ZN8Gme_FileD2Ev"];
var __ZNK7Sap_Emu11track_info_EP12track_info_ti = Module["__ZNK7Sap_Emu11track_info_EP12track_info_ti"] = asm["__ZNK7Sap_Emu11track_info_EP12track_info_ti"];
var __ZN7Gym_EmuD2Ev = Module["__ZN7Gym_EmuD2Ev"] = asm["__ZN7Gym_EmuD2Ev"];
var __ZN9Rom_Data_C2Ev = Module["__ZN9Rom_Data_C2Ev"] = asm["__ZN9Rom_Data_C2Ev"];
var __ZN10Blip_SynthILi12ELi15EE6volumeEd = Module["__ZN10Blip_SynthILi12ELi15EE6volumeEd"] = asm["__ZN10Blip_SynthILi12ELi15EE6volumeEd"];
var __ZNK13blargg_vectorIhEixEj = Module["__ZNK13blargg_vectorIhEixEj"] = asm["__ZNK13blargg_vectorIhEixEj"];
var __ZL12parse_stringPKhS0_iPc = Module["__ZL12parse_stringPKhS0_iPc"] = asm["__ZL12parse_stringPKhS0_iPc"];
var __ZN7Vgm_EmuD2Ev = Module["__ZN7Vgm_EmuD2Ev"] = asm["__ZN7Vgm_EmuD2Ev"];
var __ZN6Gb_Apu9set_tempoEd = Module["__ZN6Gb_Apu9set_tempoEd"] = asm["__ZN6Gb_Apu9set_tempoEd"];
var __ZN13blargg_vectorIPKcE5clearEv = Module["__ZN13blargg_vectorIPKcE5clearEv"] = asm["__ZN13blargg_vectorIPKcE5clearEv"];
var __ZN7Nes_Apu11irq_changedEv = Module["__ZN7Nes_Apu11irq_changedEv"] = asm["__ZN7Nes_Apu11irq_changedEv"];
var __ZN6Gb_Apu9treble_eqERK9blip_eq_t = Module["__ZN6Gb_Apu9treble_eqERK9blip_eq_t"] = asm["__ZN6Gb_Apu9treble_eqERK9blip_eq_t"];
var __ZSt15get_new_handlerv = Module["__ZSt15get_new_handlerv"] = asm["__ZSt15get_new_handlerv"];
var __ZN13Fir_ResamplerILi12EE4readEPsl = Module["__ZN13Fir_ResamplerILi12EE4readEPsl"] = asm["__ZN13Fir_ResamplerILi12EE4readEPsl"];
var __ZN9Music_Emu15enable_accuracyEb = Module["__ZN9Music_Emu15enable_accuracyEb"] = asm["__ZN9Music_Emu15enable_accuracyEb"];
var __ZN8Vgm_FileC1Ev = Module["__ZN8Vgm_FileC1Ev"] = asm["__ZN8Vgm_FileC1Ev"];
var __ZNK13Subset_Reader6remainEv = Module["__ZNK13Subset_Reader6remainEv"] = asm["__ZNK13Subset_Reader6remainEv"];
var __ZN10Ym2612_Emu6write1Eii = Module["__ZN10Ym2612_Emu6write1Eii"] = asm["__ZN10Ym2612_Emu6write1Eii"];
var __ZN8Gme_File8load_m3uEPKc = Module["__ZN8Gme_File8load_m3uEPKc"] = asm["__ZN8Gme_File8load_m3uEPKc"];
var __ZN8Rom_DataILi16384EE5clearEv = Module["__ZN8Rom_DataILi16384EE5clearEv"] = asm["__ZN8Rom_DataILi16384EE5clearEv"];
var __ZN12Nes_Fme7_ApuC2Ev = Module["__ZN12Nes_Fme7_ApuC2Ev"] = asm["__ZN12Nes_Fme7_ApuC2Ev"];
var __ZN6Gb_Osc12clock_lengthEv = Module["__ZN6Gb_Osc12clock_lengthEv"] = asm["__ZN6Gb_Osc12clock_lengthEv"];
var __ZL12new_hes_filev = Module["__ZL12new_hes_filev"] = asm["__ZL12new_hes_filev"];
var __ZNK8Gbs_File11track_info_EP12track_info_ti = Module["__ZNK8Gbs_File11track_info_EP12track_info_ti"] = asm["__ZNK8Gbs_File11track_info_EP12track_info_ti"];
var __ZN6Ym_EmuI10Ym2612_EmuEC1Ev = Module["__ZN6Ym_EmuI10Ym2612_EmuEC1Ev"] = asm["__ZN6Ym_EmuI10Ym2612_EmuEC1Ev"];
var __ZN13blargg_vectorIsEC2Ev = Module["__ZN13blargg_vectorIsEC2Ev"] = asm["__ZN13blargg_vectorIsEC2Ev"];
var __ZN6Ay_Cpu3runEl = Module["__ZN6Ay_Cpu3runEl"] = asm["__ZN6Ay_Cpu3runEl"];
var __ZN7Hes_Emu17recalc_timer_loadEv = Module["__ZN7Hes_Emu17recalc_timer_loadEv"] = asm["__ZN7Hes_Emu17recalc_timer_loadEv"];
var __ZN7Sap_Emu9cpu_writeEji = Module["__ZN7Sap_Emu9cpu_writeEji"] = asm["__ZN7Sap_Emu9cpu_writeEji"];
var __ZN13Silent_Buffer9bass_freqEi = Module["__ZN13Silent_Buffer9bass_freqEi"] = asm["__ZN13Silent_Buffer9bass_freqEi"];
var _dispose_chunk = Module["_dispose_chunk"] = asm["_dispose_chunk"];
var __ZN11File_ReaderD1Ev = Module["__ZN11File_ReaderD1Ev"] = asm["__ZN11File_ReaderD1Ev"];
var __ZNK8Rom_DataILi8192EE5beginEv = Module["__ZNK8Rom_DataILi8192EE5beginEv"] = asm["__ZNK8Rom_DataILi8192EE5beginEv"];
var __ZN8Snes_Spc17cpu_write_smp_regEiii = Module["__ZN8Snes_Spc17cpu_write_smp_regEiii"] = asm["__ZN8Snes_Spc17cpu_write_smp_regEiii"];
var __ZN7Gbs_Emu12update_timerEv = Module["__ZN7Gbs_Emu12update_timerEv"] = asm["__ZN7Gbs_Emu12update_timerEv"];
var _getopt = Module["_getopt"] = asm["_getopt"];
var __ZN14Effects_Buffer6configERKNS_8config_tE = Module["__ZN14Effects_Buffer6configERKNS_8config_tE"] = asm["__ZN14Effects_Buffer6configERKNS_8config_tE"];
var __ZN10Blip_SynthILi12ELi1EEC2Ev = Module["__ZN10Blip_SynthILi12ELi1EEC2Ev"] = asm["__ZN10Blip_SynthILi12ELi1EEC2Ev"];
var __ZN8Gme_File8load_m3uER11Data_Reader = Module["__ZN8Gme_File8load_m3uER11Data_Reader"] = asm["__ZN8Gme_File8load_m3uER11Data_Reader"];
var __ZN11Blip_Synth_9treble_eqERK9blip_eq_t = Module["__ZN11Blip_Synth_9treble_eqERK9blip_eq_t"] = asm["__ZN11Blip_Synth_9treble_eqERK9blip_eq_t"];
var __ZThn336_N12Vgm_Emu_Impl10play_frameEiiPs = Module["__ZThn336_N12Vgm_Emu_Impl10play_frameEiiPs"] = asm["__ZThn336_N12Vgm_Emu_Impl10play_frameEiiPs"];
var __ZN6Gb_Apu6volumeEd = Module["__ZN6Gb_Apu6volumeEd"] = asm["__ZN6Gb_Apu6volumeEd"];
var _gme_set_user_data = Module["_gme_set_user_data"] = asm["_gme_set_user_data"];
var __ZL16check_hes_headerPKv = Module["__ZL16check_hes_headerPKv"] = asm["__ZL16check_hes_headerPKv"];
var __ZNK9Music_Emu4tellEv = Module["__ZNK9Music_Emu4tellEv"] = asm["__ZNK9Music_Emu4tellEv"];
var __ZN7Sap_Apu5resetEP12Sap_Apu_Impl = Module["__ZN7Sap_Apu5resetEP12Sap_Apu_Impl"] = asm["__ZN7Sap_Apu5resetEP12Sap_Apu_Impl"];
var __ZN9Gme_Info_D2Ev = Module["__ZN9Gme_Info_D2Ev"] = asm["__ZN9Gme_Info_D2Ev"];
var __ZN13Fir_ResamplerILi24EEC1Ev = Module["__ZN13Fir_ResamplerILi24EEC1Ev"] = asm["__ZN13Fir_ResamplerILi24EEC1Ev"];
var __ZN10Blip_SynthILi12ELi1EEC1Ev = Module["__ZN10Blip_SynthILi12ELi1EEC1Ev"] = asm["__ZN10Blip_SynthILi12ELi1EEC1Ev"];
var __ZN7Spc_Emu15play_and_filterElPs = Module["__ZN7Spc_Emu15play_and_filterElPs"] = asm["__ZN7Spc_Emu15play_and_filterElPs"];
var __ZN7Spc_Emu5play_ElPs = Module["__ZN7Spc_Emu5play_ElPs"] = asm["__ZN7Spc_Emu5play_ElPs"];
var __ZN8Snes_Spc8load_spcEPKvl = Module["__ZN8Snes_Spc8load_spcEPKvl"] = asm["__ZN8Snes_Spc8load_spcEPKvl"];
var __ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib = Module["__ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"] = asm["__ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib"];
var __ZN8Gme_File15set_track_countEi = Module["__ZN8Gme_File15set_track_countEi"] = asm["__ZN8Gme_File15set_track_countEi"];
var _getopt_long_only = Module["_getopt_long_only"] = asm["_getopt_long_only"];
var __ZNK10__cxxabiv117__pbase_type_info9can_catchEPKNS_16__shim_type_infoERPv = Module["__ZNK10__cxxabiv117__pbase_type_info9can_catchEPKNS_16__shim_type_infoERPv"] = asm["__ZNK10__cxxabiv117__pbase_type_info9can_catchEPKNS_16__shim_type_infoERPv"];
var __ZN9Nsfe_InfoD2Ev = Module["__ZN9Nsfe_InfoD2Ev"] = asm["__ZN9Nsfe_InfoD2Ev"];
var __ZN12Nes_Vrc6_Apu6outputEP11Blip_Buffer = Module["__ZN12Nes_Vrc6_Apu6outputEP11Blip_Buffer"] = asm["__ZN12Nes_Vrc6_Apu6outputEP11Blip_Buffer"];
var __ZN7Vgm_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN7Vgm_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN7Vgm_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var __ZN8Nsfe_Emu15clear_playlist_Ev = Module["__ZN8Nsfe_Emu15clear_playlist_Ev"] = asm["__ZN8Nsfe_Emu15clear_playlist_Ev"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var __Z8get_le32PKv = Module["__Z8get_le32PKv"] = asm["__Z8get_le32PKv"];
var __ZN7Nes_Cpu15update_end_timeEll = Module["__ZN7Nes_Cpu15update_end_timeEll"] = asm["__ZN7Nes_Cpu15update_end_timeEll"];
var __ZN7Hes_Emu11irq_changedEv = Module["__ZN7Hes_Emu11irq_changedEv"] = asm["__ZN7Hes_Emu11irq_changedEv"];
var _gme_type_list = Module["_gme_type_list"] = asm["_gme_type_list"];
var __ZN13Nes_Namco_Apu6outputEP11Blip_Buffer = Module["__ZN13Nes_Namco_Apu6outputEP11Blip_Buffer"] = asm["__ZN13Nes_Namco_Apu6outputEP11Blip_Buffer"];
var __ZNK13Silent_Buffer13samples_availEv = Module["__ZNK13Silent_Buffer13samples_availEv"] = asm["__ZNK13Silent_Buffer13samples_availEv"];
var __ZNK11Blip_Buffer14output_latencyEv = Module["__ZNK11Blip_Buffer14output_latencyEv"] = asm["__ZNK11Blip_Buffer14output_latencyEv"];
var __ZNK11Blip_Buffer12count_clocksEl = Module["__ZNK11Blip_Buffer12count_clocksEl"] = asm["__ZNK11Blip_Buffer12count_clocksEl"];
var __ZN13blargg_vectorIhE6resizeEj = Module["__ZN13blargg_vectorIhE6resizeEj"] = asm["__ZN13blargg_vectorIhE6resizeEj"];
var __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i = Module["__ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i"] = asm["__ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i"];
var __ZN8Sap_FileC1Ev = Module["__ZN8Sap_FileC1Ev"] = asm["__ZN8Sap_FileC1Ev"];
var __ZN15Callback_ReaderD0Ev = Module["__ZN15Callback_ReaderD0Ev"] = asm["__ZN15Callback_ReaderD0Ev"];
var __ZN7Sms_Apu6volumeEd = Module["__ZN7Sms_Apu6volumeEd"] = asm["__ZN7Sms_Apu6volumeEd"];
var __ZN14Dual_Resampler11mix_samplesER11Blip_BufferPs = Module["__ZN14Dual_Resampler11mix_samplesER11Blip_BufferPs"] = asm["__ZN14Dual_Resampler11mix_samplesER11Blip_BufferPs"];
var __ZN9Sms_NoiseC2Ev = Module["__ZN9Sms_NoiseC2Ev"] = asm["__ZN9Sms_NoiseC2Ev"];
var __ZN12Vgm_Emu_Impl12run_commandsEi = Module["__ZN12Vgm_Emu_Impl12run_commandsEi"] = asm["__ZN12Vgm_Emu_Impl12run_commandsEi"];
var __ZN10__cxxabiv116__shim_type_infoD2Ev = Module["__ZN10__cxxabiv116__shim_type_infoD2Ev"] = asm["__ZN10__cxxabiv116__shim_type_infoD2Ev"];
var __ZNK11File_Reader6remainEv = Module["__ZNK11File_Reader6remainEv"] = asm["__ZNK11File_Reader6remainEv"];
var __ZN7Hes_Emu10cpu_write_Eji = Module["__ZN7Hes_Emu10cpu_write_Eji"] = asm["__ZN7Hes_Emu10cpu_write_Eji"];
var __ZL11new_spc_emuv = Module["__ZL11new_spc_emuv"] = asm["__ZL11new_spc_emuv"];
var __ZNK7Nes_Osc6periodEv = Module["__ZNK7Nes_Osc6periodEv"] = asm["__ZNK7Nes_Osc6periodEv"];
var __ZN8Gb_Noise3runEiii = Module["__ZN8Gb_Noise3runEiii"] = asm["__ZN8Gb_Noise3runEiii"];
var __ZN7Spc_Dsp10soft_resetEv = Module["__ZN7Spc_Dsp10soft_resetEv"] = asm["__ZN7Spc_Dsp10soft_resetEv"];
var __ZN7Scc_Apu9end_frameEi = Module["__ZN7Scc_Apu9end_frameEi"] = asm["__ZN7Scc_Apu9end_frameEi"];
var __ZN10Nes_Square14maintain_phaseElll = Module["__ZN10Nes_Square14maintain_phaseElll"] = asm["__ZN10Nes_Square14maintain_phaseElll"];
var __ZN7Sap_Emu9set_voiceEiP11Blip_BufferS1_S1_ = Module["__ZN7Sap_Emu9set_voiceEiP11Blip_BufferS1_S1_"] = asm["__ZN7Sap_Emu9set_voiceEiP11Blip_BufferS1_S1_"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var __ZN6Ym_EmuI10Ym2413_EmuED1Ev = Module["__ZN6Ym_EmuI10Ym2413_EmuED1Ev"] = asm["__ZN6Ym_EmuI10Ym2413_EmuED1Ev"];
var __ZN7Nes_Cpu8get_codeEj = Module["__ZN7Nes_Cpu8get_codeEj"] = asm["__ZN7Nes_Cpu8get_codeEj"];
var __ZN8Snes_Spc8dsp_readEi = Module["__ZN8Snes_Spc8dsp_readEi"] = asm["__ZN8Snes_Spc8dsp_readEi"];
var __ZN18ym2612_update_chanILi0EE4funcER8tables_tR9channel_tPsi = Module["__ZN18ym2612_update_chanILi0EE4funcER8tables_tR9channel_tPsi"] = asm["__ZN18ym2612_update_chanILi0EE4funcER8tables_tR9channel_tPsi"];
var __ZN11Classic_Emu15set_voice_typesEPKi = Module["__ZN11Classic_Emu15set_voice_typesEPKi"] = asm["__ZN11Classic_Emu15set_voice_typesEPKi"];
var __ZN11Data_ReaderD0Ev = Module["__ZN11Data_ReaderD0Ev"] = asm["__ZN11Data_ReaderD0Ev"];
var __ZN7Nes_Cpu12set_end_timeEl = Module["__ZN7Nes_Cpu12set_end_timeEl"] = asm["__ZN7Nes_Cpu12set_end_timeEl"];
var __ZNSt10bad_typeidC2Ev = Module["__ZNSt10bad_typeidC2Ev"] = asm["__ZNSt10bad_typeidC2Ev"];
var __ZN7Nsf_Emu12start_track_Ei = Module["__ZN7Nsf_Emu12start_track_Ei"] = asm["__ZN7Nsf_Emu12start_track_Ei"];
var __ZN8Snes_Spc17check_echo_accessEi = Module["__ZN8Snes_Spc17check_echo_accessEi"] = asm["__ZN8Snes_Spc17check_echo_accessEi"];
var ___cxx_global_var_init1536 = Module["___cxx_global_var_init1536"] = asm["___cxx_global_var_init1536"];
var __errx = Module["__errx"] = asm["__errx"];
var __ZN11Mono_BufferC2Ev = Module["__ZN11Mono_BufferC2Ev"] = asm["__ZN11Mono_BufferC2Ev"];
var __ZN8Sap_FileD0Ev = Module["__ZN8Sap_FileD0Ev"] = asm["__ZN8Sap_FileD0Ev"];
var __ZN9Gme_Info_14set_equalizer_ERK15gme_equalizer_t = Module["__ZN9Gme_Info_14set_equalizer_ERK15gme_equalizer_t"] = asm["__ZN9Gme_Info_14set_equalizer_ERK15gme_equalizer_t"];
var __ZNKSt10bad_typeid4whatEv = Module["__ZNKSt10bad_typeid4whatEv"] = asm["__ZNKSt10bad_typeid4whatEv"];
var __ZNK7Vgm_Emu6headerEv = Module["__ZNK7Vgm_Emu6headerEv"] = asm["__ZNK7Vgm_Emu6headerEv"];
var __Z12zero_apu_oscI7Nes_DmcEvPT_l = Module["__Z12zero_apu_oscI7Nes_DmcEvPT_l"] = asm["__Z12zero_apu_oscI7Nes_DmcEvPT_l"];
var __ZL11adjust_timeRll = Module["__ZL11adjust_timeRll"] = asm["__ZL11adjust_timeRll"];
var __ZN12Vgm_Emu_ImplD2Ev = Module["__ZN12Vgm_Emu_ImplD2Ev"] = asm["__ZN12Vgm_Emu_ImplD2Ev"];
var __ZN7Sap_EmuD0Ev = Module["__ZN7Sap_EmuD0Ev"] = asm["__ZN7Sap_EmuD0Ev"];
var _gme_seek = Module["_gme_seek"] = asm["_gme_seek"];
var __ZNK12Nes_Envelope6volumeEv = Module["__ZNK12Nes_Envelope6volumeEv"] = asm["__ZNK12Nes_Envelope6volumeEv"];
var __ZN13Nes_Namco_Apu9read_dataEv = Module["__ZN13Nes_Namco_Apu9read_dataEv"] = asm["__ZN13Nes_Namco_Apu9read_dataEv"];
var __ZN8Gme_File11copy_field_EPcPKc = Module["__ZN8Gme_File11copy_field_EPcPKc"] = asm["__ZN8Gme_File11copy_field_EPcPKc"];
var _gme_voice_name = Module["_gme_voice_name"] = asm["_gme_voice_name"];
var __ZN7Kss_Cpu12set_end_timeEl = Module["__ZN7Kss_Cpu12set_end_timeEl"] = asm["__ZN7Kss_Cpu12set_end_timeEl"];
var __ZN8Gme_File15load_remaining_EPKvlR11Data_Reader = Module["__ZN8Gme_File15load_remaining_EPKvlR11Data_Reader"] = asm["__ZN8Gme_File15load_remaining_EPKvlR11Data_Reader"];
var __ZNK8Spc_File11track_info_EP12track_info_ti = Module["__ZNK8Spc_File11track_info_EP12track_info_ti"] = asm["__ZNK8Spc_File11track_info_EP12track_info_ti"];
var __ZnajRKSt9nothrow_t = Module["__ZnajRKSt9nothrow_t"] = asm["__ZnajRKSt9nothrow_t"];
var __ZN7Hes_Emu9run_untilEl = Module["__ZN7Hes_Emu9run_untilEl"] = asm["__ZN7Hes_Emu9run_untilEl"];
var __ZNK10Blip_SynthILi12ELi15EE16offset_resampledEjiP11Blip_Buffer = Module["__ZNK10Blip_SynthILi12ELi15EE16offset_resampledEjiP11Blip_Buffer"] = asm["__ZNK10Blip_SynthILi12ELi15EE16offset_resampledEjiP11Blip_Buffer"];
var __ZN6Ym_EmuI10Ym2612_EmuE11begin_frameEPs = Module["__ZN6Ym_EmuI10Ym2612_EmuE11begin_frameEPs"] = asm["__ZN6Ym_EmuI10Ym2612_EmuE11begin_frameEPs"];
var __ZN7Nes_Dmc5resetEv = Module["__ZN7Nes_Dmc5resetEv"] = asm["__ZN7Nes_Dmc5resetEv"];
var __ZN13blargg_vectorIA4_cED1Ev = Module["__ZN13blargg_vectorIA4_cED1Ev"] = asm["__ZN13blargg_vectorIA4_cED1Ev"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vif = Module["dynCall_vif"] = asm["dynCall_vif"];
var dynCall_i = Module["dynCall_i"] = asm["dynCall_i"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      throw e;
    }
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + (new Error().stack);
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}
