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

});