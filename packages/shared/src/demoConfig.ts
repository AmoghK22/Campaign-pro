/**
 * Centralized demo assumptions. These model the hackathon demo only.
 * They are NOT real fee quotes, ad bids, or delivery guarantees.
 */

import type { BudgetAllocation } from './types';

export const DEMO_PLATFORM_FEE_RATE = 0.03;
export const DEMO_IMPRESSIONS_PER_RUPEE = 100;

export const DEMO_ASSUMPTION_NOTES = {
  fee: 'Demo assumption: 3% illustrative platform/processing fee. Not a real fee quote.',
  impressions:
    'Demo assumption: about 100 estimated impressions per ₹1 of net amplification budget. Impressions are not unique people and are never guaranteed.',
  reach: 'Estimated impressions count how many times an ad may be shown. Unique people reached is always lower and cannot be known before a campaign runs.',
  allocation:
    'Demo assumption: the net budget is split between advertising spend and a contingency reserve. Advertising is only spent after review and distribution setup.',
} as const;

export const DEMO_REFUND_POLICY =
  'Refunds are simulated in this demo. In the real product, any unspent amplification budget would be refunded to backers after a campaign closes, minus the platform/processing fee already incurred.';

export interface ContributionBreakdown {
  amount: number;
  fee: number;
  total: number;
  netAmplificationBudget: number;
  estimatedImpressions: number;
}

export function calculateContribution(amount: number): ContributionBreakdown {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError('Contribution amount must be a positive number');
  }
  const roundedAmount = Math.round(amount * 100) / 100;
  const fee = Math.round(roundedAmount * DEMO_PLATFORM_FEE_RATE * 100) / 100;
  const netAmplificationBudget = Math.round((roundedAmount - fee) * 100) / 100;
  const estimatedImpressions = Math.round(netAmplificationBudget * DEMO_IMPRESSIONS_PER_RUPEE);
  return {
    amount: roundedAmount,
    fee,
    total: roundedAmount,
    netAmplificationBudget,
    estimatedImpressions,
  };
}

export function estimateImpressionsForGoal(fundingGoal: number): number {
  if (!Number.isFinite(fundingGoal) || fundingGoal <= 0) {
    return 0;
  }
  return calculateContribution(fundingGoal).estimatedImpressions;
}

export interface UseOfFundsBreakdown {
  grossAmount: number;
  platformFee: number;
  netAmplificationBudget: number;
  advertisingBudget: number;
  contingencyBudget: number;
  estimatedImpressions: number;
  advertisingSharePercent: number;
  contingencySharePercent: number;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(value, 0), 100);
}

/**
 * Splits a raised/goal amount into the pieces shown on the use-of-funds panel.
 * The components always add back up to the gross amount exactly.
 */
export function calculateUseOfFunds(
  amount: number,
  allocation: BudgetAllocation,
): UseOfFundsBreakdown {
  const { fee, netAmplificationBudget, estimatedImpressions } = calculateContribution(amount);
  const advertisingSharePercent = clampPercent(allocation.advertisingSharePercent);
  const contingencySharePercent = 100 - advertisingSharePercent;
  const netPaise = Math.round(netAmplificationBudget * 100);
  const advertisingBudget = Math.round((netPaise * advertisingSharePercent) / 100) / 100;
  const contingencyBudget = Math.round(netPaise - advertisingBudget * 100) / 100;

  return {
    grossAmount: Math.round(amount * 100) / 100,
    platformFee: fee,
    netAmplificationBudget,
    advertisingBudget,
    contingencyBudget,
    estimatedImpressions,
    advertisingSharePercent,
    contingencySharePercent,
  };
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
