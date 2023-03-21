import BigNumber from 'bignumber.js';
import { Options } from 'libs/charts';
import { OrderRow, useGetOrderBook } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useCallback } from 'react';
import { orderBookConfig } from 'workers/sdk';

export const useDepthChartWidget = (base?: Token, quote?: Token) => {
  const { data } = useGetOrderBook(base?.address, quote?.address);

  const getOrders = useCallback(
    (orders?: OrderRow[], buy?: boolean) => {
      const res = [...(orders || [])]
        .splice(0, orderBookConfig.buckets.depthChart)
        .map(({ rate, amount }) => {
          return [
            +(+rate).toFixed(quote?.decimals),
            +(+amount).toFixed(base?.decimals),
          ];
        });

      if (res.length > 0) {
        return res;
      }

      let rate;

      return new Array(orderBookConfig.buckets.depthChart)
        .fill(0)
        .map((_, i) => {
          rate = new BigNumber(data?.middleRate || 0)?.[buy ? 'minus' : 'plus'](
            new BigNumber(data?.step || 0).times(i)
          );

          return [+(+rate).toFixed(quote?.decimals), 0];
        });
    },
    [base?.decimals, data?.middleRate, data?.step, quote?.decimals]
  );

  const getOptions = useCallback(
    (bidsData?: number[][], asksData?: number[][]): Options => {
      const xMiddle = data?.middleRate ? +data?.middleRate : 0;

      return {
        chart: {
          type: 'area',
          backgroundColor: '#000000',
          borderColor: '#000000',
        },
        credits: {
          enabled: false,
        },
        title: {
          text: ' ',
        },
        xAxis: {
          minPadding: 0,
          maxPadding: 0,
          plotLines: [
            {
              color: 'rgba(255, 255, 255, 0.25)',
              value: xMiddle,
              width: 1.5,
              label: {
                text: ' ',
                rotation: 90,
              },
            },
          ],
          title: {},
          tickWidth: 0,
          lineWidth: 0,
          labels: {
            style: {
              color: 'rgba(255, 255, 255, 0.6)',
            },
          },
          crosshair: {
            color: 'rgba(255, 255, 255, 0.25)',
            width: 1,
            dashStyle: 'Dash',
          },
        },
        yAxis: [
          {
            lineWidth: 0,
            gridLineWidth: 0,
            title: {
              text: ' ',
            },
            tickWidth: 0,
            tickLength: 5,
            tickPosition: 'inside',
            labels: {
              x: 50,
              enabled: false,
            },
            crosshair: {
              color: 'rgba(255, 255, 255, 0.25)',
              width: 1,
              dashStyle: 'Dash',
            },
          },
          {
            opposite: true,
            linkedTo: 0,
            lineWidth: 0,
            gridLineWidth: 0,
            title: {
              text: ' ',
            },
            tickWidth: 0,
            tickLength: 5,
            tickPosition: 'inside',
            labels: {
              style: {
                color: 'rgba(255, 255, 255, 0.6)',
              },
            },
          },
        ],
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillOpacity: 0.2,
            lineWidth: 1,
            step: 'center',
          },
          series: {
            states: {
              inactive: {
                opacity: 0.7,
              },
            },
          },
        },
        tooltip: {
          headerFormat: ' ',
          pointFormat: `Amount: {point.y} ${base?.symbol}<br/>Price: {point.x} ${quote?.symbol}`,
          valueDecimals: undefined,
          borderRadius: 12,
          backgroundColor: '#212123',
          borderWidth: 0,
          style: {
            color: 'white',
          },
        },
        series: [
          {
            type: 'area',
            name: 'Asks',
            data: asksData,
            color: 'rgba(216, 99, 113, 0.8)',
            marker: {
              enabled: false,
            },
          },
          {
            type: 'area',
            name: 'Bids',
            data: bidsData,
            color: 'rgba(0, 181, 120, 0.8)',
            marker: {
              enabled: false,
            },
          },
        ],
      };
    },
    [base?.symbol, data?.middleRate, quote?.symbol]
  );

  return {
    buyOrders: getOrders(data?.buy, true),
    sellOrders: getOrders(data?.sell),
    getOptions,
  };
};
