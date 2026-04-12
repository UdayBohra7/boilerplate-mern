import React from "react";
import ReactApexChart from "react-apexcharts";
import { useDailyEngagement } from "../../hooks/useDailyEngagement";

export const DailyCharts = () => {
  // Determine date range (e.g., last 7 days or current month)
  // For "Daily Engagement 2026", maybe we want a longer range, but let's default to last 7 days for now as typical for dashboards
  // or let's try to fetch this year if the title says 2026.
  // The user said "Daily Engagement 2026" in the parent component, so let's try to fetch a reasonable range.
  // Actually, let's just fetch default (last 7 days handled by backend if no params) or explicit range.

  // Let's explicitly ask for last 7 days to match the design or this year?
  // The previous static data had 7 points ['Jan', 'Feb'...] which looks like monthly.
  // But the title is "Daily Engagement", and the previous data had 7 points.
  // Let's stick to the backend default (last 7 days daily) for "Daily" chart.
  const { data: engagementData, isLoading } = useDailyEngagement();

  const chartData = React.useMemo(() => {
    if (!engagementData?.data) return { series: [], categories: [] };

    const categories = engagementData.data.map((item) => {
      const date = new Date(item.date);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    });

    const series = [
      {
        name: "Meal Tracking",
        data: engagementData.data.map((item) => item.meal_tracking)
      },
      {
        name: "Meal Plan",
        data: engagementData.data.map((item) => item.meal_plan)
      },
      {
        name: "Community",
        data: engagementData.data.map((item) => item.community)
      },
      {
        name: "Shopping",
        data: engagementData.data.map((item) => item.shopping)
      }
    ];

    return { series, categories };
  }, [engagementData]);


  const [state, setState] = React.useState<any>({
    options: {
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5
        },
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#6C60FF', '#CE2A96', '#FFB55D', '#2ECC71'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: '',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      markers: {
        size: 4
      },
      xaxis: {
        categories: [], // Helper will fill this
        title: {
          text: ''
        }
      },
      yaxis: {
        title: {
          text: 'Engagements'
        },
        min: 0,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    },
  });

  // Update charts when data changes
  React.useEffect(() => {
    if (chartData.categories.length > 0) {
      setState((prev: any) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: chartData.categories
          }
        }
      }));
    }
  }, [chartData]);


  if (isLoading) {
    return <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>;
  }

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={{ ...state.options, xaxis: { ...state.options.xaxis, categories: chartData.categories } }}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}
