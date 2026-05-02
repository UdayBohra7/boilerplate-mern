import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { Spinner } from "@/components/Elements";

interface Data {
  labels: string[];
  data: number[];
}

export const PieChart = ({
  data,
  isLoading,
}: {
  data?: Data;
  isLoading?: boolean;
}) => {
  const options = useMemo<ApexOptions>(() => ({
    chart: {
      type: 'pie',
      height: 320,
    },
    colors: ['#2563EB', '#6366F1', '#8B5CF6', '#EC4899'],
    labels: data?.labels || ['Shopping', 'Meal Tracking', 'Meal Plan', 'Community'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: 'inherit',
      labels: {
        colors: '#94A3B8',
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
        fontWeight: 900,
        fontFamily: 'inherit',
      },
      dropShadow: {
        enabled: false,
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#ffffff'],
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '65%',
        },
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }), [data]);

  const series = useMemo(() => (data?.data || [25, 25, 25, 25]), [data]);

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Analyzing Activity...</p>
        </div>
      ) : (
        <div className="w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={320}
          />
        </div>
      )}
    </div>
  );
}
