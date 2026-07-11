import { isValidCardDetails, isValidLeagueDataResponse } from '../r2-client';

const baseCardDetails = {
  artFilename: 'Acclimatisation',
  rewardName: '20x Orb of Alteration',
  isCorrupted: false,
  flavour: '...',
};

describe('isValidCardDetails', () => {
  it('accepts rewardClass: null (currency card)', () => {
    expect(isValidCardDetails({ ...baseCardDetails, rewardClass: null })).toBe(true);
  });

  it('accepts numeric rewardClass values', () => {
    expect(isValidCardDetails({ ...baseCardDetails, rewardClass: 3 })).toBe(true);
    expect(isValidCardDetails({ ...baseCardDetails, rewardClass: 6 })).toBe(true);
  });

  it('rejects a string rewardClass', () => {
    expect(isValidCardDetails({ ...baseCardDetails, rewardClass: 'some-string' })).toBe(false);
  });
});

describe('isValidLeagueDataResponse', () => {
  it('validates the real R2 payload shape observed live in production', () => {
    const payload = {
      data: [{
        card: {
          name: 'Acclimatisation',
          stack: 2,
          chaosPrice: 1,
          details: {
            artFilename: 'Acclimatisation',
            rewardName: '20x Orb of Alteration',
            rewardClass: null,
            isCorrupted: false,
            flavour: '...',
          },
        },
        reward: { name: '20x Orb of Alteration', chaosPrice: 2.118 },
        setChaosPrice: 2,
        chaosProfit: 0.118,
        isCurrency: true,
      }],
      currencyRates: {
        exalted: 0.572, divine: 205, annul: 9.54, mirror: 104406,
      },
      updatedAt: '2026-07-11T19:57:52.174Z',
      entryCount: 1,
    };

    expect(isValidLeagueDataResponse(payload)).toBe(true);
  });
});
