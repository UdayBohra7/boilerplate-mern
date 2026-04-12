import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { Spinner } from "@/components/Elements";

interface Data {
  labels: string[];
  data: number[];
}

export const BarChart = ({
  isLoading,
  data
}: {
  data?: Data
  isLoading?: boolean;
}) => {
  const options = useMemo<ApexOptions>(() => ({
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ['#F882A1'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: '#636E72',
          fontSize: '12px',
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#636E72',
          fontSize: '12px',
        },
        formatter: (value) => `${value}`,
      }
    },
    grid: {
      borderColor: '#E9ECEF',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  }), [data]);

  const series = useMemo(() => [
    {
      name: "Total Users",
      data: data?.data || [0, 0, 0, 0, 0, 0, 0],
    },
  ], [data]);

  return (
    <div>
      <div id="chart">
        {isLoading ?
          <Spinner size="lg" />
          :
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />}
      </div>
    </div>
  );
};
