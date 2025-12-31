// Utility Functions
const UTILS = {
  // Debounce function
  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  },

  // Validate email
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate required fields
  validateRequired(value) {
    return value && value.trim() !== '';
  },

  // Validate number
  isValidNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },

  // Validate password
  isValidPassword(password) {
    return password && password.length >= 6;
  },

  // Get query parameter from URL
  getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  },

  // Parse hash route
  parseRoute() {
    const hash = window.location.hash.slice(1);
    const [path, ...queryParts] = hash.split('?');
    const [base, id] = path.split('/');
    return { base, id, path };
  },

  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Get difference in days
  daysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
  },

  // Check if date is in past
  isPast(dateString) {
    return new Date(dateString) < new Date();
  },

  // Check if date is in future
  isFuture(dateString) {
    return new Date(dateString) > new Date();
  },

  // Capitalize string
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Slugify string
  slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Deep clone object
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (obj instanceof Object) {
      const cloned = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
  },

  // Merge objects
  mergeObjects(target, source) {
    const result = { ...target };
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = source[key];
      }
    }
    return result;
  },

  // Filter array
  filterArray(array, predicate) {
    return array.filter(predicate);
  },

  // Find in array
  findInArray(array, predicate) {
    return array.find(predicate);
  },

  // Group array by key
  groupByKey(array, key) {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  },

  // Sort array
  sortArray(array, key, desc = false) {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return desc ? 1 : -1;
      if (a[key] > b[key]) return desc ? -1 : 1;
      return 0;
    });
  },

  // Remove duplicates
  removeDuplicates(array, key) {
    const seen = new Set();
    return array.filter(item => {
      const value = key ? item[key] : item;
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },

  // Paginate array
  paginate(array, pageNum, pageSize) {
    const startIndex = (pageNum - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  },

  // Get total pages
  getTotalPages(arrayLength, pageSize) {
    return Math.ceil(arrayLength / pageSize);
  }
};
