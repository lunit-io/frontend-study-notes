export class Booking {
  constructor(show, date) {
    this._show = show;
    this._date = date;
    this._isPeakDay = date;
  }

  get isPeakDay() {
    return !!this._isPeakDay;
  }

  get hasTalkback() {
    return this._show.hasOwnProperty("talkback") && !this.isPeakDay;
  }

  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return result;
  }
}

export class PremiumBooking extends Booking {
  constructor(show, date, extra) {
    super(show, date);
    this._extra = extra;
  }

  get hasTalkback() {
    return this._show.hasOwnProperty("talkback");
  }

  get basePrice() {
    return Math.round(super.basePrice + this._extra.premiumFee);
  }

  get hasDinner() {
    return this._extra.hasOwnProperty("dinner") && !this.isPeakDay;
  }
}

class PremiumBookingDelegate {
  constructor(hostBooking, extra) {
    this._host = hostBooking;
    this._extra = extra;
  }
}

function createBooking(show, date) {
  return new Booking(show, date);
}

function createPremiumBooking(show, date, extra) {
  const result = new PremiumBooking(show, date, extra);
  result._bePremium(extra);
  return result;
}
