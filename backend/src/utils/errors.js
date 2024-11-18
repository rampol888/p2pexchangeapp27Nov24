export class PaymentError extends Error {
  constructor(message, code = 'payment_failed') {
    super(message);
    this.name = 'PaymentError';
    this.type = 'StripeError';
    this.code = code;
    this.status = 402;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
} 