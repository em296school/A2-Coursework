import { TransactionsProps } from '@/app/models/Transactions';
import { ActivityIcon } from '../icons/ActivityIcon';
import { DashboardPageTitle } from './StaffDashboard';
import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import { RadarChart, Sparkline } from '@mantine/charts';
import { SELLABLE_BUNDLES } from '@/app/consts/Bundles.json';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { FINANCIAL_OVERVIEW_WEEKS } from '@/app/consts/DashboardSettings.json';
import { TrendUpIcon } from '../icons/TrendUpIcon';
import { FlightProps } from '@/app/models/Flights';

interface FinancialProps {
  transactions: TransactionsProps[];
  loading: boolean;
}

const DATA_KEY = 'bundle';
const SERIES_VALUE = 'transactions';

function getSeriesDataKeyForBundles(transactions: TransactionsProps[]) {
  let data: SeriesData[] = [];

  type SeriesData = {
    [DATA_KEY]: string;
    [SERIES_VALUE]: number;
  };

  let bundleData: Record<string, string> = SELLABLE_BUNDLES;

  // First get all the bundles
  for (let key of Object.keys(bundleData)) {
    data.push({
      [DATA_KEY]: key,
      [SERIES_VALUE]: 0,
    });
  }

  // Calculate all transactions for each
  for (let value of data) {
    let bundleType = bundleData[value[DATA_KEY]];
    const amount = transactions.filter((transaction) => {
      return (
        transaction.type === 'booking' &&
        transaction.metadata &&
        transaction.metadata.isBundle &&
        transaction.metadata.bundleType == bundleType
      );
    });

    value[SERIES_VALUE] = amount.length;
  }

  // Add a "no bundle value"
  data.push({
    [DATA_KEY]: 'No bundle',
    [SERIES_VALUE]: 0,
  });

  const amount = transactions.filter((transaction) => {
    return transaction.type === 'booking' && !transaction.metadata;
  });

  data[data.findLastIndex(() => true)][SERIES_VALUE] = amount.length;

  return data;
}

async function getMostSoldFlight(transactions: TransactionsProps[]) {
  // Record<FlightID, totalBookings>
  let highestDict: Record<string, number> = {};

  for (let transaction of transactions) {
    if (transaction.type !== 'booking') continue;

    if (highestDict[transaction.flight_id]) {
      highestDict[transaction.flight_id]++;
      continue;
    }

    highestDict[transaction.flight_id] = 1;
  }

  // Get the highest id
  let currentHighest = null;
  for (let [id, totalBookings] of Object.entries(highestDict)) {
    if (currentHighest == null) {
      currentHighest = id;
      continue;
    }

    if (totalBookings > highestDict[currentHighest]) {
      currentHighest = id;
    }
  }

  // Get this flight from the api
  try {
    const response = await fetch('/api/dashboard/get-flight', {
      body: JSON.stringify({
        flightId: currentHighest,
      }),
      method: 'POST',
    });

    if (!response.ok) {
      return 'No flight found';
    }

    const flight: FlightProps = await response.json();
    return `${flight.flight_info.departure_location} -> ${flight.flight_info.arrival_location}`;
  } catch {
    return 'No flight found';
  }
}

function getFinancialProfitsForPeriod(
  maxSpan: number,
  transactions: TransactionsProps[]
): number[] {
  const WEEK = 1000 * 60 * 60 * 24 * 7;
  let profits = [];

  for (let n = 1; n < maxSpan + 1; n++) {
    // We calculate a range of one week
    let weekStart = new Date().getTime() - WEEK * (n - 1);
    let weekEnd = new Date().getTime() - WEEK * n;

    // Then get all transactions which happened in this week
    // For this first part we are only calculating the revenue (booking), and then we
    // will subtract the sum of the losses (cancellation & refund)
    let weeksRevenue = transactions.filter((transaction) => {
      return (
        transaction.timestamp >= weekEnd &&
        transaction.timestamp <= weekStart &&
        transaction.type === 'booking'
      );
    });

    // Then we calculate the total amount spent, we use
    // reduce() to act as a cumulative computation of all the
    // transaction's amount fields
    const revenue = weeksRevenue.reduce(
      (spent, transaction) => spent + transaction.amount,
      0
    );

    // Then take away all the losses:
    let weeksLosses = transactions.filter((transaction) => {
      return (
        transaction.timestamp >= weekEnd &&
        transaction.timestamp <= weekStart &&
        transaction.type !== 'booking'
      );
    });

    const losses = weeksLosses.reduce(
      (spent, transaction) => spent + transaction.amount,
      0
    );

    const profit = revenue - losses;
    profits.push(profit);
  }

  // Reverse the array because right now it is most recent week -> least recent week, we want it
  // least recent -> most recent to display it on the Sparkline
  profits.reverse();
  return profits;
}

function FinancialOverview(props: FinancialProps) {
  return (
    <div className="flex justify-center items-center w-full h-50">
      {props.loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader size={30} />
        </div>
      ) : (
        <div className="flex flex-col gap-1 justify-center items-center w-full">
          <div className="flex flex-row items-center gap-2">
            <ActivityIcon size={13} strokeWidth={3} />
            <h2 className="font-medium">
              {FINANCIAL_OVERVIEW_WEEKS} week profit sparkline
            </h2>
          </div>
          <div className="**:outline-none **:focus:outline-none">
            <Sparkline
              w={400}
              h={100}
              data={getFinancialProfitsForPeriod(
                FINANCIAL_OVERVIEW_WEEKS,
                props.transactions
              )}
              curveType="linear"
              trendColors={{
                positive: 'teal.6',
                negative: 'red.6',
                neutral: 'gray.5',
              }}
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FinancialInfo(props: FinancialProps) {
  const [bestFlight, setBestFlight] = useState<string>('');

  useEffect(() => {
    getMostSoldFlight(props.transactions)
      .then((flight) => setBestFlight(flight))
      .catch(() => setBestFlight('No flight found'));
  }, [props.transactions]);

  return (
    <div className="flex flex-row gap-5 w-full h-50 justify-center">
      {props.loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader size={30} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-center items-center gap-2 w-full">
              <ShoppingCartIcon size={13} strokeWidth={3} />
              <h2 className="font-medium">Buyer preferences</h2>
            </div>
            <div className="flex justify-center text-xs items-center **:outline-none **:focus:outline-none p-2 w-full h-full">
              <RadarChart
                h={200}
                w={350}
                data={getSeriesDataKeyForBundles(props.transactions)}
                dataKey={DATA_KEY}
                gridColor="gray.4"
                series={[
                  {
                    name: SERIES_VALUE,
                    color: 'blue.4',
                    opacity: 0.2,
                  },
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-center items-center gap-2 w-full">
              <TrendUpIcon size={13} strokeWidth={3} />
              <h2 className="font-medium">Best trending flight</h2>
            </div>
            <h2 className="font-bold text-2xl">{bestFlight}</h2>
          </div>
        </>
      )}
    </div>
  );
}

export default function FinancialPage() {
  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getTransactions() {
    try {
      const response = await fetch('/api/dashboard/get-transactions', {
        method: 'GET',
      });

      if (!response.ok) {
        setTransactions([]);
        return;
      }

      setTransactions(await response.json());
    } catch {
      setTransactions([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    getTransactions().finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col w-full gap-2">
      <DashboardPageTitle
        icon={<ActivityIcon size={25} strokeWidth={2} />}
        title="Finances"
        description="View financial statistics."
      />
      <FinancialOverview transactions={transactions} loading={loading} />
      <FinancialInfo transactions={transactions} loading={loading} />
    </div>
  );
}
