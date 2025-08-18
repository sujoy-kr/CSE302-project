import { useEffect, useState } from "react";
import { getReports } from "../api/api";

export default function AuthorityPanel() {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const data = await getReports();
    setReports(data);
  };

  if (!reports) return <div className="p-6">Loading reports...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Reports Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded shadow">
          <h3 className="font-bold">Top Food Items</h3>
          <ul>
            {reports.topFood.map((f) => (
              <li key={f.food_item_ID}>
                {f.food_name} - {f.orders_count} orders
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-bold">Popular Departments</h3>
          <ul>
            {reports.popularDepartment.map((d) => (
              <li key={d.dept_name}>
                {d.dept_name} - {d.orders_count} orders
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-bold">Revenue by Category</h3>
          <ul>
            {reports.categoryRevenue.map((c) => (
              <li key={c.category}>
                {c.category} - ${c.total_revenue}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-bold">Top Employee Ratings</h3>
          <ul>
            {reports.topEmployeeRating.map((e) => (
              <li key={e.employee_ID}>
                {e.first_name} {e.last_name} - {e.avg_rating} ⭐
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-bold">Top Employees by Orders</h3>
          <ul>
            {reports.topEmployeeOrders.map((e) => (
              <li key={e.employee_ID}>
                {e.first_name} {e.last_name} - {e.orders_count} orders
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
