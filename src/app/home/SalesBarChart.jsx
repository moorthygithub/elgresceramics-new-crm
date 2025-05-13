import moment from "moment";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import Loader from "@/components/loader/Loader";

const SalesBarChart = ({ sales, isLoadingdashboord, isErrordashboord }) => {
  const maxValue = Math.max(
    ...(sales?.map((item) => Number(item.total_box)) || [0])
  );
  const yMax = Math.ceil(maxValue / 100) * 100 + 100;
  if (isLoadingdashboord) {
    return (
      <div className="flex justify-center items-center min-h-80 ">
        <Loader />
      </div>
    );
  }

  if (isErrordashboord) {
    return (
      <div className="text-center text-red-500  min-h-80">
        Something went wrong!
      </div>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 min-h-full">
        No Data Available
      </div>
    );
  }
  return (
    <div className="w-full h-[400px] min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sales}
          margin={{ top: 20, right: 10, left: -10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="sales_date"
            tickFormatter={(date) => moment(date).format("DD")}
          />

          <YAxis
            domain={[0, yMax]}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />

          <Tooltip
            formatter={(value) => [`${value} Boxes`, "Total"]}
            labelFormatter={(label) =>
              `Date: ${moment(label).format("DD-MM-YYYY")}`
            }
          />

          <Legend formatter={() => "Total Sales"} />

          <Bar dataKey="total_box" fill="#6366F1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
