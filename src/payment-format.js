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

	return {
		validateCardNumber: validateCardNumber,
		validateCardCVC: validateCardCVC,
		validateCardExpiry: validateCardExpiry
	}
})