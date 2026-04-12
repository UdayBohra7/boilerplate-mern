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
    colors: ['#F882A1', '#8E82F8', '#3AAFC9', '#2678C5'],
    labels: data?.labels || ['Shopping 0%', 'Meal tracking 0%', 'Meal Plan 0%', 'Community 0%'],
    legend: {
      position: 'right',
      fontSize: '13px',
      fontFamily: 'Mona Sans, sans-serif',
      labels: {
        colors: '#636E72',
      },
      markers: {
        offsetX: -4,
      },
      itemMargin: {
        vertical: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '0%',
        },
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }), [data]);

  const series = useMemo(() => (data?.data || [0, 0, 0, 0]), [data]);

  return (
    <div>
      <div id="chart">
        {isLoading ?
          <Spinner size="lg" />
          :
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={320}
          />
        }
      </div>
    </div>
  );
}
