import { Booking, createPremiumBooking } from "./12.10";

describe("서브클래스를 위임으로 바꾸기", () => {
  describe("Booking", () => {
    const hasTalkback = {
      talkback: true,
      price: 100,
    };
    const notHasTalkback = {
      price: 70,
    };

    it("hasTalkbackAndPickday", () => {
      const booking = new Booking(hasTalkback, true);
      expect(booking.isPeakDay).toBe(true);
      expect(booking.hasTalkback).toBe(false);
      expect(booking.basePrice).toBe(115);
    });

    it("hasTalkbackAndNotPickday", () => {
      const booking = new Booking(hasTalkback, false);
      expect(booking.isPeakDay).toBe(false);
      expect(booking.hasTalkback).toBe(true);
      expect(booking.basePrice).toBe(100);
    });

    it("not hasTalkbackAndPickday", () => {
      const booking = new Booking(notHasTalkback, true);
      expect(booking.isPeakDay).toBe(true);
      expect(booking.hasTalkback).toBe(false);
      expect(booking.basePrice).toBe(81);
    });

    it("not hasTalkbackNotPickday", () => {
      const booking = new Booking(notHasTalkback, false);
      expect(booking.isPeakDay).toBe(false);
      expect(booking.hasTalkback).toBe(false);
      expect(booking.basePrice).toBe(70);
    });
  });

  describe("PremiumBookinge", () => {
    const hasTalkback = {
      talkback: true,
      price: 100,
    };
    const notHasTalkback = {
      price: 70,
    };
    const extraWithDinner = {
      dinner: true,
      premiumFee: 30,
    };

    const extraWithoutDinner = {
      premiumFee: 30,
    };

    it("hasTalkbackAndPickdayAndDinner", () => {
      const booking = createPremiumBooking(hasTalkback, true, extraWithDinner);
      expect(booking.hasTalkback).toBe(true);
      expect(booking.basePrice).toBe(145);
      expect(booking.hasDinner).toBe(false);
    });

    it("hasTalkbackAndPickdayAndNoDinner", () => {
      const booking = createPremiumBooking(
        hasTalkback,
        true,
        extraWithoutDinner
      );
      expect(booking.hasTalkback).toBe(true);
      expect(booking.basePrice).toBe(145);
      expect(booking.hasDinner).toBe(false);
    });

    it("not hasTalkbackAndPickdayAndDinner", () => {
      const booking = createPremiumBooking(
        notHasTalkback,
        true,
        extraWithDinner
      );
      expect(booking.isPeakDay).toBe(true);
      expect(booking.hasTalkback).toBe(false);
      expect(booking.basePrice).toBe(111);
    });

    it("not hasTalkbackAndPickdayAndNoDinner", () => {
      const booking = createPremiumBooking(
        notHasTalkback,
        true,
        extraWithoutDinner
      );
      expect(booking.isPeakDay).toBe(true);
      expect(booking.hasTalkback).toBe(false);
      expect(booking.basePrice).toBe(111);
    });
  });
});
