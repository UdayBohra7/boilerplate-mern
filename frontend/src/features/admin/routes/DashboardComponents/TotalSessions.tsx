import React from "react";
import ReactApexChart from "react-apexcharts";

export const TotalSessions = () => {
    const [state, setState] = React.useState({
      
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        options: {
          chart: {
            height: 200,
            type: 'line',
            zoom: {
              enabled: false
            }
          },
          colors: ['#CB3CFF'],
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: '',
            align: 'left'
          },
          grid: {
            show: false, 
            row: {
              colors: ['transparent', 'transparent'], 
              opacity: 0.5
            },
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            labels: {
                style: {
                  colors: '#FFFFFF'  
                }
              }
          },
          yaxis: {
            labels: {
                style: {
                  colors: '#FFFFFF'  
                }
              }
          }
        },
      
      
    });

    

    return (
      <div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="line" height={200} />
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }
