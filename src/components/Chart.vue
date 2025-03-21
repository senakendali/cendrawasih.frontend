<template>
    <div style="width: 400px; height: 400px">
      <v-chart v-if="chartOptions" :option="chartOptions" autoresize />
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from "vue";
  import VChart from "vue-echarts";
  import { use } from "echarts/core";
  import { PieChart, BarChart } from "echarts/charts";
  import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
  import { CanvasRenderer } from "echarts/renderers";
  
  // Register the components
  use([PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);
  
  export default defineComponent({
    components: {
      VChart,
    },
    props: {
      data: Object, // Data API
      title: String, // Judul chart
      type: String, // Jenis chart: "pie" atau "bar"
    },
    setup(props) {
      const chartOptions = computed(() => ({
        title: { text: props.title, left: "center" },
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left" },
        series: [
          {
            name: props.title,
            type: props.type,
            radius: props.type === "pie" ? "50%" : undefined,
            data: Object.entries(props.data).map(([key, info]) => ({
              name: key,
              value: info.total_contingents,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      }));
  
      return { chartOptions };
    },
  });
  </script>
  