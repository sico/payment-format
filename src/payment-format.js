define([],
function () {

	var defaultFormat = /(\d{1,4})/g

	defaultFormat = /(\d{1,4})/g;

	  cards = [
	    {
	      type: 'visaelectron',
	      pattern: /^4(026|17500|405|508|844|91[37])/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'maestro',
	      pattern: /^(5(018|0[23]|[68])|6(39|7))/,
	      format: defaultFormat,
	      length: [12, 13, 14, 15, 16, 17, 18, 19],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'forbrugsforeningen',
	      pattern: /^600/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'dankort',
	      pattern: /^5019/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'visa',
	      pattern: /^4/,
	      format: defaultFormat,
	      length: [13, 16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'mastercard',
	      pattern: /^5[0-5]/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'amex',
	      pattern: /^3[47]/,
	      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
	      length: [15],
	      cvcLength: [3, 4],
	      luhn: true
	    }, {
	      type: 'dinersclub',
	      pattern: /^3[0689]/,
	      format: defaultFormat,
	      length: [14],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'discover',
	      pattern: /^6([045]|22)/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'unionpay',
	      pattern: /^(62|88)/,
	      format: defaultFormat,
	      length: [16, 17, 18, 19],
	      cvcLength: [3],
	      luhn: false
	    }, {
	      type: 'jcb',
	      pattern: /^35/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }
	  ];

	function hasTextSelected(target) {
    var _ref;
    if ((target.selectionStart != null) && target.selectionStart !== target.selectionEnd) {
      return true;
    }

    if (typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? typeof _ref.createRange === "function" ? _ref.createRange().text : void 0 : void 0 : void 0) {
      return true;
    }

    return false;
  };

  function restrictCardNumber (e) {
    var target, card, digit, value;
    target = e.target;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected(target)) {
      return;
    }
    value = (target.value + digit).replace(/\D/g, '');
    card = cardFromNumber(value);
    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      return value.length <= 16;
    }
  };

  function formatCardNumber (num) {
  	var card, groups, upperLength, _ref;
    card = cardFromNumber(num);
    if (!card) {
			return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.replace(/\D/g, '');
    num = num.slice(0, upperLength);
    if (card.format.global) {
      return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
    } else {
      groups = card.format.exec(num);
      if (groups == null) {
        return;
      }
      groups.shift();
      groups = groups.filter(function(n) {
        return n;
      });
      return groups.join(' ');
    }
  }

  function formatCardNumberInput (e) {
    var target, card, digit, length, re, upperLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    target = e.target;
    value = target.value;
    card = cardFromNumber(value + digit);
    length = (value.replace(/\D/g, '') + digit).length;
    upperLength = 16;
    if (card) {
      upperLength = card.length[card.length.length - 1];
    }
    if (length >= upperLength) {
      return;
    }
    if ((target.selectionStart != null) && target.selectionStart !== value.length) {
      return;
    }
    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }
    if (re.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = value + ' ' + digit;
      });
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = value + digit + ' ';
      });
    }
  };

	function formatBackCardNumber (e) {
    var target, value;
    target = e.target;
    value = target.value;
    if (e.which !== 8) {
      return;
    }
    if ((target.selectionStart != null) && target.selectionStart !== value.length) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = value.replace(/\d\s$/, '');
      });
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = value.replace(/\s\d?$/, '');
      });
    }
  };

  function reFormatCardNumber (e) {
    return setTimeout(function() {
      var target, value;
      target = e.target;
      value = target.value;
      value = formatCardNumber(value);
      target.value = value;
    });
  };

  function setCardType (e) {
    var target, allTypes, card, cardType, val;
    target = e.target;
    val = target.value;
    cardType = cardType(val) || 'unknown';
    if (!target.classList.contains(cardType)) {
      allTypes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cards.length; _i < _len; _i++) {
          card = cards[_i];
          _results.push(card.type);
        }
        return _results;
      })();
      target.removeClass('unknown');
      target.removeClass(allTypes.join(' '));
      target.addClass(cardType);
      target.toggleClass('identified', cardType !== 'unknown');
      //return target.trigger('payment.cardType', cardType);
    }
  };

	function cardFromNumber (num) {
    num = (num + '').replace(/\D/g, '');
    for ( var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.pattern.test(num)) {
        return card;
      }
    }
  };

  function cardFromType (type) {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.type === type) {
        return card;
      }
    }
  };

  function luhnCheck (num) {
    var odd = true;
    var sum = 0;
    var digits = (num + '').split('').reverse();
    for (var i = 0; i < digits.length; i++) {
      digit = digits[i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };


	function validateCardNumber (num) {
    var num = (num + '').replace(/\s+|-/g, '');

    if (!/^\d+$/.test(num)) {
      return false;
    }

    var card = cardFromNumber(num);

    if (!card) {
      return false;
    }

	  return (card.length.indexOf(num.length) >= 0) && (card.luhn === false || luhnCheck(num));
	};

	function validateCardCVC (cvc, type) {
    cvc = cvc.replace(/\s+/g, '');

    if (!/^\d+$/.test(cvc)) {
      return false;
    }

    var card = cardFromType(type);

    if (card != null) {
      return card.cvcLength.indexOf(cvc.length) >= 0;
    } else {
      return cvc.length >= 3 && cvc.length <= 4;
    }
	};

	function cardType (num) {
		var _ref;
    if (!num) {
      return null;
    }
    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
	}

	function validateCardExpiry (month, year) {
		var currentTime, expiry, _ref;
    if (typeof month === 'object' && 'month' in month) {
      _ref = month, month = _ref.month, year = _ref.year;
    }
    if (!(month && year)) {
      return false;
    }

    month = (month + '').replace(/\s+/g, '');
    year = (year + '').replace(/\s+/g, '');
    if (!/^\d+$/.test(month)) {
      return false;
    }
    if (!/^\d+$/.test(year)) {
      return false;
    }
    if (!((1 <= month && month <= 12))) {
      return false;
    }
    if (year.length === 2) {
      if (year < 70) {
        year = "20" + year;
      } else {
        year = "19" + year;
      }
    }
    if (year.length !== 4) {
      return false;
    }
    expiry = new Date(year, month);
    currentTime = new Date;
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
	}

	// expiry methods

	function restrictExpiry (e) {
		var target, digit, value;
		target = e.target;
		digit = String.fromCharCode(e.which);
		if (!/^\d+$/.test(digit)) {
		  return;
		}
		if (hasTextSelected(target)) {
		  return;
		}
		value = target.value + digit;
		value = value.replace(/\D/g, '');
		if (value.length > 6) {
		  return false;
		}
	};

	function reFormatExpiry (e) {
    return setTimeout(function() {
      var target, value;
      target = e.target;
      value = target.value;
      value = formatExpiry(value);
      return target.value = value;
    });
  };

  function formatExpiryInput (e) {
    var target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    target = e.target;
    val = target.value + digit;
    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = "0" + val + " / ";
      });
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = "" + val + " / ";
      });
    }
  };

  function formatForwardExpiry (e) {
    var target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    target = e.target;
    val = target.value;
    if (/^\d\d$/.test(val)) {
      return target.value = "" + val + " / ";
    }
  };

  function formatForwardSlashAndSpace (e) {
    var target, val, which;
    which = String.fromCharCode(e.which);
    if (!(which === '/' || which === ' ')) {
      return;
    }
    target = e.target;
    val = target.value;
    if (/^\d$/.test(val) && val !== '0') {
      return target.value = "0" + val + " / ";
    }
  };

  function formatBackExpiry (e) {
    var target, value;
    target = e.target;
    value = target.value;
    if (e.which !== 8) {
      return;
    }
    if ((target.selectionStart != null) && target.selectionStart !== value.length) {
      return;
    }
    if (/\s\/\s\d?$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return target.value = value.replace(/\s\/\s\d?$/, '');
      });
    }
  };

  function formatExpiry (expiry) {
    var mon, parts, sep, year;
    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
    if (!parts) {
      return '';
    }
    mon = parts[1] || '';
    sep = parts[2] || '';
    year = parts[3] || '';
    if (year.length > 0 || (sep.length > 0 && !(/\ \/?\ ?/.test(sep)))) {
      sep = ' / ';
    }
    if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
      mon = "0" + mon;
      sep = ' / ';
    }
    return mon + sep + year;
  };

  function restrictNumeric (e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  };

	// add events

	function makeCardFormatter (el) {
		makeNumericOnly(el);

		el.addEventListener('keypress', restrictCardNumber);
		el.addEventListener('keypress', formatCardNumberInput);
		el.addEventListener('keydown', formatBackCardNumber);
		el.addEventListener('keyUp', setCardType);
		el.addEventListener('paste', reFormatCardNumber);
		el.addEventListener('change', reFormatCardNumber);
		el.addEventListener('input', reFormatCardNumber);
		el.addEventListener('input', setCardType);
	}

	function makeExpiryFormatter (el) {
		makeNumericOnly(el);
		el.addEventListener('keypress', restrictExpiry);
		el.addEventListener('keypress', formatExpiryInput);
		el.addEventListener('keypress', formatForwardSlashAndSpace);
		el.addEventListener('keypress', formatForwardExpiry);
		el.addEventListener('keydown', formatBackExpiry);
		el.addEventListener('change', reFormatExpiry);
		el.addEventListener('input', reFormatExpiry);
		return this;
	}

	function makeNumericOnly (el) {
		el.addEventListener('keypress', restrictNumeric);
	}

	return {
		validateCardNumber: validateCardNumber,
		validateCardCVC: validateCardCVC,
		validateCardExpiry: validateCardExpiry,
		cardType: cardType,
		makeCardFormatter: makeCardFormatter,
		makeExpiryFormatter: makeExpiryFormatter
	}
})