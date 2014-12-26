define(
[
	'payment-format'
],
function (PaymentFormat) {
	describe("A suite", function() {
	  it("contains spec with an expectation", function() {
	    expect(true).toBe(true);
	  });
	});

	describe('Validating a card number', function () {

		it('should fail if empty', function () {
			expect( PaymentFormat.validateCardNumber('') ).toBe( false );
		});

		it('should fail if only spaces', function () {
			expect( PaymentFormat.validateCardNumber('              ') ).toBe( false );
		});

		it('should succeed if it is valid', function () {
			expect( PaymentFormat.validateCardNumber('4242424242424242') ).toBe( true );
		});

		it('should succeed with dashes but valid', function () {
			expect( PaymentFormat.validateCardNumber('4242-4242-4242-4242') ).toBe( true );
		});

		it('should succeed with spaces but valid', function () {
			expect( PaymentFormat.validateCardNumber('4242 4242 4242 4242') ).toBe( true );
		});

		it('should fail if does not pass luhn check', function () {
			expect( PaymentFormat.validateCardNumber('4242424242424241') ).toBe( false );
		});

		it('should fail if more than 16 digits', function () {
			expect( PaymentFormat.validateCardNumber('42424242424242424') ).toBe( false );
		});

		it('should fail if fewer than 10 digits', function () {
			expect( PaymentFormat.validateCardNumber('424242424') ).toBe( false );
		});

		it('should fail with non-digits', function () {
			expect( PaymentFormat.validateCardNumber('4242424e42424241') ).toBe( false );
		});

		it('should validate for all card types', function () {
			expect( PaymentFormat.validateCardNumber('4917300800000000') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('6759649826438453') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('6007220000000004') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('5019717010103742') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('4111111111111111') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('4012888888881881') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('4222222222222') ).toBe( true )
      expect( PaymentFormat.validateCardNumber('4462030000000000') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('4484070000000000') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('5555555555554444') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('5454545454545454') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('378282246310005') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('371449635398431') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('378734493671000') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('30569309025904') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('38520000023237') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('36700102000000') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('36148900647913') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('6011111111111117') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('6011000990139424') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('6271136264806203568') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('6236265930072952775') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('6204679475679144515') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('6216657720782466507') ).toBe( true );

      expect( PaymentFormat.validateCardNumber('3530111333300000') ).toBe( true );
      expect( PaymentFormat.validateCardNumber('3566002020360505') ).toBe( true );
		});

	});

	describe('Validating a CVC', function () {
		it('should fail if it is empty', function () {
			expect( PaymentFormat.validateCardCVC('') ).toBe( false );
		});

		it('should pass if it is valid', function () {
			expect( PaymentFormat.validateCardCVC('123') ).toBe( true );
		});

		it('should fail with non-digits', function () {
			expect( PaymentFormat.validateCardCVC('12e') ).toBe( false );
		});

		it('should fail with fewer than 3 digits', function () {
			expect( PaymentFormat.validateCardCVC('12') ).toBe( false );
		});

		it('should fail with more than 4 digits', function () {
			expect( PaymentFormat.validateCardCVC('12345') ).toBe( false );
		});

		describe('with card type', function () {
			it('should validate a three digit cvc with something other than amex', function () {
				expect( PaymentFormat.validateCardCVC('123', 'visa') ).toBe( true );
			});

			it('should not validate a four digit number with something other than amex', function () {
				expect( PaymentFormat.validateCardCVC('1234', 'visa') ).toBe( false );
			});

			it('should validate a four digit number with amex', function () {
				expect( PaymentFormat.validateCardCVC('1234', 'amex') ).toBe( true );
			});
		});

	});

	describe('Validating an expiration date', function () {

		var currentTime;
		beforeEach(function() {
	    currentTime = new Date();
	  });

		it('should fail if expires is before the current year', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1, currentTime.getFullYear() - 1)).toBe( false );
		});

		it('should fail if expires in the current year but before current month', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth(), currentTime.getFullYear())).toBe( false );
		});

		it('should fail with invalid month', function () {
			expect( PaymentFormat.validateCardExpiry(13, currentTime.getFullYear())).toBe( false );
		});

		it('should succeed for this year and month', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1, currentTime.getFullYear())).toBe( true );
		});

		it('should pass for the next month', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1, currentTime.getFullYear())).toBe( true );
		});

		it('should pass for the next year', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1, currentTime.getFullYear() + 1)).toBe( true );
		});

		it('should pass for a two digit year', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1, ('' + currentTime.getFullYear()).slice(0,2)) ).toBe( true );
		});

		it('should fail for a two digit year in the past', function () {
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1, 99)).toBe( false );
		});

		it('should pass with string numbers', function () {
			currentTime.setFullYear(currentTime.getFullYear() + 1, currentTime.getMonth() + 2)
			expect( PaymentFormat.validateCardExpiry(currentTime.getMonth() + 1 + '', currentTime.getFullYear() + '')).toBe( true );
		});

		it('should fail for non-numbers', function () {
			expect( PaymentFormat.validateCardExpiry('h12', '3300')).toBe( false );
		});

		it('should fail if year or month is NaN', function () {
			expect( PaymentFormat.validateCardExpiry('12', NaN)).toBe( false );
		});

		it('should support year shorthand', function () {
			expect( PaymentFormat.validateCardExpiry('05', '20')).toBe( true );
		});
	});

	describe('getting a card type', function () {
		it('should return visa that starts with 40', function () {
			expect( PaymentFormat.cardType('4012121212121212')).toBe('visa');
		});

		it('should return mastercard if starts with 5', function () {
			expect( PaymentFormat.cardType('5555555555554444')).toBe('mastercard');
		});

		it('should return amex if starts with 34', function () {
			expect( PaymentFormat.cardType('3412121212121212')).toBe('amex');
		});

		it('should return null for non number', function () {
			expect( PaymentFormat.cardType('aoeu')).toBe(null);
		});
	});

	describe('formatCardNumber', function () {
		it('should format cc number correctly', function () {
			var number =  document.createElement('input');
			number.type = 'tel';
			document.body.appendChild(number);
			PaymentFormat.makeCardFormatter(number);

			number.value = '4242';

			//var e = new Event('keypress');
	    var e = document.createEvent('KeyboardEvent');
	    e.initEvent('keypress', true, false);
			e.which = 52  //'4'
			number.dispatchEvent(e);

			expect( number.value ).toEqual('4242');
			window.setTimeout(function() {
				expect( number.value ).toEqual('4242 4');
			});
		});

		it('should format amex cc number correctly', function () {
			var number =  document.createElement('input');
			number.type = 'tel';
			document.body.appendChild(number);
			PaymentFormat.makeCardFormatter(number);

			number.value = '3782';

			//var e = new Event('keypress');
	    var e = document.createEvent('KeyboardEvent');
	    e.initEvent('keypress', true, false);
			e.which = 56  //'8'
			number.dispatchEvent(e);

			expect( number.value ).toEqual('3782');
			window.setTimeout(function() {
				expect( number.value ).toEqual('3782 8');
			});
		});
	});

	describe('format card expiry', function () {
		it('should format month shorthand correctly', function () {
			var expiry = document.createElement('input');
			expiry.type = 'text';
			document.body.appendChild(expiry);
			PaymentFormat.makeExpiryFormatter(expiry);

			//var e = new Event('keypress');
	    var e = document.createEvent('KeyboardEvent');
	    e.initEvent('keypress', true, false);
			e.which = 52  //'4'
			expiry.dispatchEvent(e);

		  window.setTimeout(function() {
		  	expect( expiry.value ).toEqual('04 / ');
		  });
		});

		it('should format forward slash shorthand correctly', function () {
			var expiry = document.createElement('input');
			expiry.type = 'text';
			document.body.appendChild(expiry);
			PaymentFormat.makeExpiryFormatter(expiry);

		  expiry.value = '1';

  		//var e = new Event('keypress');
      var e = document.createEvent('KeyboardEvent');
      e.initEvent('keypress', true, false);
  		e.which = 47  //'/'
  		expiry.dispatchEvent(e);

  	  window.setTimeout(function() {
  	  	expect( expiry.value ).toEqual('01 / ');
  	  });
		});

		it('should only allow numbers', function () {
			var expiry = document.createElement('input');
			expiry.type = 'text';
			document.body.appendChild(expiry);
			PaymentFormat.makeExpiryFormatter(expiry);

			expiry.value = '1';

			//var e = new Event('keypress');
	    var e = document.createEvent('KeyboardEvent');
	    e.initEvent('keypress', true, false);
			e.which = 100  //'d'
			expiry.dispatchEvent(e);

		  window.setTimeout(function() {
		  	expect( expiry.value ).toEqual('1');
		  });
		});
	});
});