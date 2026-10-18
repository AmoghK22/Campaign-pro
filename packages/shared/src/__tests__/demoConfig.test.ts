import { describe, expect, it } from 'vitest';
import {
  DEMO_IMPRESSIONS_PER_RUPEE,
  DEMO_PLATFORM_FEE_RATE,
  DEMO_REFUND_POLICY,
  calculateContribution,
  calculateUseOfFunds,
  estimateImpressionsForGoal,
  isValidHttpUrl,
} from '../demoConfig';
import { formatDate, formatINR } from '../format';

describe('demo contribution math', () => {
  it('uses the documented demo assumptions', () => {
    expect(DEMO_PLATFORM_FEE_RATE).toBe(0.03);
    expect(DEMO_IMPRESSIONS_PER_RUPEE).toBe(100);
  });

  it('computes fee, net budget, and estimated impressions for a typical amount', () => {
    const result = calculateContribution(1000);
    expect(result.fee).toBe(30);
    expect(result.netAmplificationBudget).toBe(970);
    expect(result.estimatedImpressions).toBe(97000);
    expect(result.total).toBe(1000);
  });

  it('rounds fee to paise', () => {
    const result = calculateContribution(99);
    expect(result.fee).toBe(2.97);
    expect(result.netAmplificationBudget).toBe(96.03);
    expect(result.estimatedImpressions).toBe(9603);
  });

  it('handles small amounts', () => {
    const result = calculateContribution(1);
    expect(result.fee).toBe(0.03);
    expect(result.netAmplificationBudget).toBe(0.97);
    expect(result.estimatedImpressions).toBe(97);
  });

  it('rejects zero, negative, and non-finite amounts', () => {
    expect(() => calculateContribution(0)).toThrow(RangeError);
    expect(() => calculateContribution(-5)).toThrow(RangeError);
    expect(() => calculateContribution(Number.NaN)).toThrow(RangeError);
  });

  it('goal-level estimate uses the same model', () => {
    expect(estimateImpressionsForGoal(1000)).toBe(97000);
    expect(estimateImpressionsForGoal(0)).toBe(0);
    expect(estimateImpressionsForGoal(-1)).toBe(0);
  });

  it('formats INR for display', () => {
    expect(formatINR(120000)).toContain('1,20,000');
    expect(formatINR(0)).toMatch(/0/);
  });

  it('formats dates and tolerates missing or invalid values', () => {
    expect(formatDate('2026-12-01T00:00:00.000Z')).toContain('2026');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('calculateUseOfFunds', () => {
  it('splits the net budget into advertising and contingency that sum back to the gross amount', () => {
    const result = calculateUseOfFunds(100000, {
      advertisingSharePercent: 85,
      contingencySharePercent: 15,
    });
    expect(result.platformFee).toBe(3000);
    expect(result.netAmplificationBudget).toBe(97000);
    expect(result.advertisingBudget).toBe(82450);
    expect(result.contingencyBudget).toBe(14550);
    expect(
      result.platformFee + result.advertisingBudget + result.contingencyBudget,
    ).toBeCloseTo(result.grossAmount, 5);
    expect(result.estimatedImpressions).toBe(9700000);
  });

  it('honours a different allocation split', () => {
    const result = calculateUseOfFunds(50000, {
      advertisingSharePercent: 80,
      contingencySharePercent: 20,
    });
    expect(result.netAmplificationBudget).toBe(48500);
    expect(result.advertisingBudget).toBe(38800);
    expect(result.contingencyBudget).toBe(9700);
    expect(result.advertisingBudget + result.contingencyBudget).toBeCloseTo(48500, 5);
  });

  it('clamps out-of-range shares instead of producing negative budgets', () => {
    const result = calculateUseOfFunds(10000, {
      advertisingSharePercent: 150,
      contingencySharePercent: -50,
    });
    expect(result.advertisingSharePercent).toBe(100);
    expect(result.contingencySharePercent).toBe(0);
    expect(result.contingencyBudget).toBe(0);
  });

  it('rejects invalid amounts and exposes an honest refund policy string', () => {
    expect(() => calculateUseOfFunds(0, { advertisingSharePercent: 85, contingencySharePercent: 15 })).toThrow(
      RangeError,
    );
    expect(DEMO_REFUND_POLICY.toLowerCase()).toContain('simulated');
  });
});

describe('isValidHttpUrl', () => {
  it('accepts http and https URLs only', () => {
    expect(isValidHttpUrl('https://example.com/source')).toBe(true);
    expect(isValidHttpUrl('http://example.com')).toBe(true);
    expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    expect(isValidHttpUrl('not a url')).toBe(false);
    expect(isValidHttpUrl('')).toBe(false);
  });
});
