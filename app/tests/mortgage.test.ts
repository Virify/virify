import { describe, it, expect } from "vitest";
import {
  getSelectedBuyerType,
  getMinDepositPercentage,
  calculateDepositPercentage,
  calculateLtvPercentage,
  validateDeposit,
  canProceedToNextStep,
  getTotalTermMonths,
  getTotalTermYears,
  isFormValid,
  calculateInterestPercentage,
  getDefaultFormData,
  type MortgageFormData,
} from "../../app/utils/mortgage";

const baseFormData: MortgageFormData = {
  buyerType: "FIRST_TIME_BUYER",
  propertyPrice: 200000,
  deposit: 20000,
  termYears: 25,
  termMonths: 0,
  customInterestRate: null,
};

describe("getSelectedBuyerType", () => {
  it("returns the correct buyer type option", () => {
    const result = getSelectedBuyerType("FIRST_TIME_BUYER");
    expect(result?.value).toBe("FIRST_TIME_BUYER");
    expect(result?.key).toBe("First Time Buyer");
  });

  it("returns undefined for null", () => {
    expect(getSelectedBuyerType(null)).toBeUndefined();
  });

  it("returns buy to let option", () => {
    expect(getSelectedBuyerType("BUY_TO_LET")?.minDeposit).toBe(20);
  });
});

describe("getMinDepositPercentage", () => {
  it("returns 5 for FIRST_TIME_BUYER", () => {
    expect(getMinDepositPercentage("FIRST_TIME_BUYER")).toBe(5);
  });

  it("returns 20 for BUY_TO_LET", () => {
    expect(getMinDepositPercentage("BUY_TO_LET")).toBe(20);
  });

  it("returns 10 for REMORTGAGE", () => {
    expect(getMinDepositPercentage("REMORTGAGE")).toBe(10);
  });

  it("returns 5 as default for null", () => {
    expect(getMinDepositPercentage(null)).toBe(5);
  });
});

describe("calculateDepositPercentage", () => {
  it("calculates 10% correctly", () => {
    expect(calculateDepositPercentage(20000, 200000)).toBe(10);
  });

  it("returns 0 if propertyPrice is 0", () => {
    expect(calculateDepositPercentage(1000, 0)).toBe(0);
  });

  it("returns 0 if propertyPrice is negative", () => {
    expect(calculateDepositPercentage(1000, -100)).toBe(0);
  });

  it("calculates partial percentage and rounds to 2 dp", () => {
    expect(calculateDepositPercentage(15000, 200000)).toBe(7.5);
  });
});

describe("calculateLtvPercentage", () => {
  it("returns 90 for a 10% deposit", () => {
    expect(calculateLtvPercentage(10)).toBe(90);
  });

  it("returns 75 for a 25% deposit", () => {
    expect(calculateLtvPercentage(25)).toBe(75);
  });

  it("returns 100 for 0% deposit", () => {
    expect(calculateLtvPercentage(0)).toBe(100);
  });
});

describe("validateDeposit", () => {
  it("returns null when buyerType is null", () => {
    expect(validateDeposit(20000, 200000, null)).toBeNull();
  });

  it("returns null when propertyPrice is 0", () => {
    expect(validateDeposit(20000, 0, "FIRST_TIME_BUYER")).toBeNull();
  });

  it("returns error when deposit is below minimum", () => {
    // 5% of 200000 = 10000; deposit 5000 = 2.5% → too low
    const error = validateDeposit(5000, 200000, "FIRST_TIME_BUYER");
    expect(error).toContain("Minimum deposit required");
  });

  it("returns null when deposit is exactly at minimum", () => {
    // 5% of 200000 = 10000
    expect(validateDeposit(10000, 200000, "FIRST_TIME_BUYER")).toBeNull();
  });

  it("returns error when deposit exceeds 95%", () => {
    const error = validateDeposit(191000, 200000, "FIRST_TIME_BUYER");
    expect(error).toBe("Deposit cannot exceed 95% of property price");
  });
});

describe("getTotalTermMonths", () => {
  it("converts years and months to total months", () => {
    expect(getTotalTermMonths({ ...baseFormData, termYears: 25, termMonths: 6 })).toBe(306);
  });

  it("returns 0 for zero term", () => {
    expect(getTotalTermMonths({ ...baseFormData, termYears: 0, termMonths: 0 })).toBe(0);
  });
});

describe("getTotalTermYears", () => {
  it("returns exact years when no extra months", () => {
    expect(getTotalTermYears({ ...baseFormData, termYears: 25, termMonths: 0 })).toBe(25);
  });

  it("returns decimal years for months", () => {
    expect(getTotalTermYears({ ...baseFormData, termYears: 25, termMonths: 6 })).toBe(25.5);
  });
});

describe("canProceedToNextStep", () => {
  it("step 0: returns true when buyerType is set", () => {
    expect(canProceedToNextStep(0, baseFormData)).toBe(true);
  });

  it("step 0: returns false when buyerType is null", () => {
    expect(canProceedToNextStep(0, { ...baseFormData, buyerType: null })).toBe(false);
  });

  it("step 1: returns true when propertyPrice > 0", () => {
    expect(canProceedToNextStep(1, baseFormData)).toBe(true);
  });

  it("step 1: returns false when propertyPrice is 0", () => {
    expect(canProceedToNextStep(1, { ...baseFormData, propertyPrice: 0 })).toBe(false);
  });

  it("step 2: returns true with valid deposit", () => {
    expect(canProceedToNextStep(2, baseFormData)).toBe(true);
  });

  it("step 3: returns true with valid term", () => {
    expect(canProceedToNextStep(3, baseFormData)).toBe(true);
  });

  it("unknown step: returns false", () => {
    expect(canProceedToNextStep(99, baseFormData)).toBe(false);
  });
});

describe("isFormValid", () => {
  it("returns true for a valid form (25 year term = 300 months)", () => {
    expect(isFormValid(baseFormData)).toBe(true);
  });

  it("returns false when buyerType is null", () => {
    expect(isFormValid({ ...baseFormData, buyerType: null })).toBe(false);
  });

  it("returns false when term is below minimum (< 60 months)", () => {
    expect(isFormValid({ ...baseFormData, termYears: 4, termMonths: 0 })).toBe(false);
  });

  it("returns false when term exceeds maximum (> 480 months)", () => {
    expect(isFormValid({ ...baseFormData, termYears: 41, termMonths: 0 })).toBe(false);
  });
});

describe("calculateInterestPercentage", () => {
  it("returns 0 for null result", () => {
    expect(calculateInterestPercentage(null)).toBe(0);
  });

  it("calculates percentage of interest in total payment", () => {
    const result = {
      rateType: "FIXED_5_YEAR",
      rate: 5,
      monthlyPayment: 1000,
      totalPayment: 300000,
      totalInterest: 100000,
      loanAmount: 200000,
    };
    expect(calculateInterestPercentage(result)).toBe(33);
  });
});

describe("getDefaultFormData", () => {
  it("returns a zeroed form with no property price", () => {
    const data = getDefaultFormData();
    expect(data.propertyPrice).toBe(0);
    expect(data.buyerType).toBeNull();
  });

  it("uses provided property price", () => {
    const data = getDefaultFormData(350000);
    expect(data.propertyPrice).toBe(350000);
  });
});
