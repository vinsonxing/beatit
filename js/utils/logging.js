const LOGLEVEL = {
  DISABLE: -1,
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
};

const DEFAULT_LOGLEVEL = __DEV__ ? LOGLEVEL.DEBUG : LOGLEVEL.INFO;

function defaultFormatter(msg, filename) {
  const time = new Date().toISOString();
  let pMsg;
  try {
    if (typeof msg === 'string') {
      pMsg = msg;
    } else {
      pMsg = JSON.stringify(msg);
    }
  } catch (e) {
    pMsg = 'unrecognized message';
  }
  return `[ ${time} ] [ ${filename} ] ${pMsg}`;
}

function noop() {}

class Logger {
  constructor(f, fn, level) {
    this.formatter = f;
    this.filename = fn;
    this.level = level;
    // methods
    this.debug = noop;
    this.info = noop;
    this.warn = noop;
  }

  fMsg = (...args) => {
    // to reduce the time for formatting, if log is disabled, just return without any caculation
    if (this.level === LOGLEVEL.DISABLE || args.length === 0) return undefined;
    const isAllString = !args.find((a) => typeof a !== 'string');
    // for non-string message, just remain as it is
    if (!isAllString) {
      if (args.length === 1) return args[0];
      console.warn('Arguments should be pure strings', args);
      return args;
    }
    return this.formatter(args.join(' '), this.filename);
  };

  // Temp removed
  // getLogProvider = () => (__DEV__ ? console : NativeLog)
  getLogProvider = () => console;

  bindMethod = () => {
    try {
      if (this.level === LOGLEVEL.DISABLE) return;
      const provider = this.getLogProvider();
      this.warn = provider.warn;
      if (this.level <= LOGLEVEL.INFO) {
        this.info = provider.info;
      }
      if (this.level === LOGLEVEL.DEBUG) {
        this.debug = provider.debug;
      }
    } finally {
      // run this before return
      this._exposeAlias();
    }
  };

  _exposeAlias = () => {
    // alias
    this.d = this.debug;
    this.i = this.info;
    this.w = this.warn;
  };
}

console.getLogger = (fn, formatter = defaultFormatter) => {
  if (typeof formatter !== 'function') {
    throw new Error('Invalid log formatter');
  }
  const l = new Logger(formatter, fn, DEFAULT_LOGLEVEL);
  l.bindMethod();
  return l;
};

// hide console.log
console.log = noop;
