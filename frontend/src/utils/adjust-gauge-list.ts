export type GaugeItem = {
  value: number;
  label?: string;
};

export type GaugeList = {
  [key: string]: GaugeItem;
};

export function adjustGaugeList(original: GaugeList, days: number, dailyBudget: number): GaugeList {
  console.warn("when function called with ",original['Impossible'].value);

  const goodValue = original['Good'].value * days;

  const update = (key: keyof GaugeList) => ({
    ...original[key],
    value: original[key].value + goodValue,
  });

  const updateBudget = (key: keyof GaugeList) => ({
    ...original[key],
    value: original[key].value + goodValue + Math.max(dailyBudget - goodValue, 0),
  });

  console.warn("called with ",original['Impossible'].value," and ",goodValue);

  return {
    'Neutral': original['Neutral'],
    'Good': { ...original['Good'], value: goodValue },
    'Slightly over': update('Slightly over'),
    'Spending Wallet': update('Spending Wallet'),
    'Savings Access': update('Savings Access'),
    'High Risk': updateBudget('High Risk'),
    'Impossible': updateBudget('Impossible'),
  };
}
