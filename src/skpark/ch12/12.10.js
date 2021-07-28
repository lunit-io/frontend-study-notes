class PremiumBookingDelegate {
  constructor(hostBooking, extra) {
    this._host = hostBooking;
    this._extra = extra;
  }

  get hasTalkback() {
    return this._host._show.hasOwnProperty("talkback");
  }

  get hasDinner() {
    return this._extra.hasOwnProperty("dinner") && !this._host.isPeakDay;
  }

  extendBasePrice(base) {
    return Math.round(base + this._extra.premiumFee);
  }
}

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
    return this._premiumDelegate
      ? this._premiumDelegate.hasTalkback
      : this._show.hasOwnProperty("talkback") && !this.isPeakDay;
  }

  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return this._premiumDelegate
      ? this._premiumDelegate.extendBasePrice(result)
      : result;
  }

  get hasDinner() {
    return this._premiumDelegate ? this._premiumDelegate.hasDinner : undefined;
  }

  _bePremium(extra) {
    this._premiumDelegate = new PremiumBookingDelegate(this, extra);
  }
}

export class PremiumBooking extends Booking {
  constructor(show, date, extra) {
    super(show, date);
    this._extra = extra;
  }
}

function createBooking(show, date) {
  return new Booking(show, date);
}

export function createPremiumBooking(show, date, extra) {
  const result = new PremiumBooking(show, date, extra);
  result._bePremium(extra);
  return result;
}
