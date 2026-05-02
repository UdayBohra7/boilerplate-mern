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
    colors: ['#2563EB'],
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '35%',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: '#94A3B8',
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: 'inherit',
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
          colors: '#94A3B8',
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: 'inherit',
        },
        formatter: (value) => `${value}`,
      }
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 4,
      padding: {
        left: 20,
        right: 20
      },
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
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
      y: {
        formatter: (val) => `${val} Users`
      }
    }
  }), [data]);

  const series = useMemo(() => [
    {
      name: "Total Users",
      data: data?.data || [0, 0, 0, 0, 0, 0, 0],
    },
  ], [data]);

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Loading Graph...</p>
        </div>
      ) : (
        <div className="w-full h-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      )}
    </div>
  );
};
