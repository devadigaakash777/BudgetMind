export type GaugeItem = {
  value: number;
  label?: string;
};

export type GaugeList = {
  [key: string]: GaugeItem;
};

export function adjustGaugeList(original: GaugeList, days: number, dailyBudget: number): GaugeList {
  // console.warn("when function called with ",original['Impossible'].value);

  const goodValue = original['Good'].value * days;

  const update = (key: keyof GaugeList) => ({
    ...original[key],
    value: original[key].value + goodValue,
  });

  // console.warn("called with ",original['Impossible'].value," and ",goodValue);

  return {
    'Neutral': original['Neutral'],
    'Good': { ...original['Good'], value: goodValue },
    'Slightly over': update('Slightly over'),
    'Spending Wallet': update('Spending Wallet'),
    'Savings Access': update('Savings Access'),
    'High Risk': original['High Risk'],
    'Impossible': original['Impossible'],
  };
}
