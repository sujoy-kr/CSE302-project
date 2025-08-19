import { useEffect, useState } from "react";
import {
  createFood,
  getStudents,
  getEmployees,
  getSuppliedFoods,
  getTransactions,
  getTopFood,
  getFeedbacks,
  getPopularDepartment,
  getCategoryRevenue,
  getTopEmployeeRating,
  getTopEmployeeOrders,
} from "../api/api";

export default function AdminPanel() {
  const [foodForm, setFoodForm] = useState({
    food_name: "",
    price: "",
    category: "",
  });
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliedFoods, setSuppliedFoods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const [s, e, f, t, fb] = await Promise.all([
      getStudents(),
      getEmployees(),
      getSuppliedFoods(),
      getTransactions(),
      getFeedbacks(),
    ]);
    setStudents(s.data);
    setEmployees(e.data);
    setSuppliedFoods(f.data);
    setTransactions(t.data);
    setFeedbacks(fb.data);
  };

  const handleCreateFood = async () => {
    try {
      await createFood(foodForm);
      alert("Food item created!");
      setFoodForm({ food_name: "", price: "", category: "" });
    } catch {
      alert("Failed to create food");
    }
  };

  const handleReport = async (type) => {
    let res;
    try {
      switch (type) {
        case "topFood":
          res = await getTopFood();
          break;
        case "popularDept":
          res = await getPopularDepartment();
          break;
        case "categoryRevenue":
          res = await getCategoryRevenue();
          break;
        case "topEmployeeRating":
          res = await getTopEmployeeRating();
          break;
        case "topEmployeeOrders":
          res = await getTopEmployeeOrders();
          break;
      }
      setReportData(res.data);
    } catch {
      alert("Failed to fetch report");
    }
  };

  const renderTable = (data, columns) => (
    <table className="w-full text-sm border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="border p-2 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col, i) => (
                <td key={i} className="border p-2">
                  {row[col] instanceof Date
                    ? row[col].toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : row[col]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center p-4">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      {/* Create Food */}
      <div className="p-4 border rounded shadow space-y-4">
        <h3 className="text-xl font-bold">Create Food</h3>
        <input
          placeholder="Food Name"
          value={foodForm.food_name}
          onChange={(e) =>
            setFoodForm({ ...foodForm, food_name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={foodForm.price}
          onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          placeholder="Category"
          value={foodForm.category}
          onChange={(e) =>
            setFoodForm({ ...foodForm, category: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleCreateFood}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Food
        </button>
      </div>

      {/* Data Tables */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border rounded shadow overflow-auto">
          <h3 className="font-bold mb-2">Students</h3>
          {renderTable(students, [
            "student_id",
            "first_name",
            "last_name",
            "dept_name",
          ])}
        </div>

        <div className="p-4 border rounded shadow overflow-auto">
          <h3 className="font-bold mb-2">Employees</h3>
          {renderTable(employees, [
            "employee_id",
            "first_name",
            "last_name",
            "role",
            "salary",
            "phone",
            "hire_date",
          ])}
        </div>

        <div className="p-4 border rounded shadow overflow-auto">
          <h3 className="font-bold mb-2">Supplied Foods</h3>
          {renderTable(suppliedFoods, [
            "supply_id",
            "food_item_id",
            "quantity",
            "supply_date",
          ])}
        </div>

        <div className="p-4 border rounded shadow overflow-auto">
          <h3 className="font-bold mb-2">Transactions</h3>
          {renderTable(transactions, [
            "transaction_id",
            "type",
            "quantity",
            "transaction_date",
            "food_item_id",
          ])}
        </div>

        <div className="p-4 border rounded shadow overflow-auto col-span-2">
          <h3 className="font-bold mb-2">Employee Feedbacks</h3>
          {renderTable(feedbacks, [
            "feedback_id",
            "rating",
            "comment",
            "date",
            "employee_id",
            "student_id",
          ])}
        </div>
      </div>

      {/* Reports */}
      <div className="p-4 border rounded shadow space-y-4 mt-4">
        <h3 className="text-xl font-bold">Reports</h3>
        <div className="flex space-x-2 flex-wrap mb-2">
          <button
            onClick={() => handleReport("topFood")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Top Food
          </button>
          <button
            onClick={() => handleReport("popularDept")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Popular Department
          </button>
          <button
            onClick={() => handleReport("categoryRevenue")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Revenue by Category
          </button>
          <button
            onClick={() => handleReport("topEmployeeRating")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Top Employee Rating
          </button>
          <button
            onClick={() => handleReport("topEmployeeOrders")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Top Employee Orders
          </button>
        </div>

        {reportData.length > 0 && (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(reportData[0]).map((key, i) => (
                  <th key={i} className="border p-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border p-2">
                      {val instanceof Date
                        ? val.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
