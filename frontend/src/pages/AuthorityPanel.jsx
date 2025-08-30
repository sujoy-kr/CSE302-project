import { useEffect, useState } from 'react'
import {
  createFood,
  getCategoryRevenue,
  getDailyRevenue,
  getEmployeeAverageRating,
  getEmployees,
  getFeedbacks,
  getPopularDepartment,
  getStudents,
  getSuppliedFoods,
  getTopFood,
  getTopFoodPerDepartment,
  getTopStudents,
  getTopSuppliers,
  getTransactions,
} from '../api/api'

export default function AdminPanel() {
  const [foodForm, setFoodForm] = useState({
    food_name: '',
    price: '',
    category: '',
  })

  const [students, setStudents] = useState([])
  const [employees, setEmployees] = useState([])
  const [suppliedFoods, setSuppliedFoods] = useState([])
  const [transactions, setTransactions] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [reportData, setReportData] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    const [s, e, f, t, fb] = await Promise.all([
      getStudents(),
      getEmployees(),
      getSuppliedFoods(),
      getTransactions(),
      getFeedbacks(),
    ])
    setStudents(s.data)
    setEmployees(e.data)
    setSuppliedFoods(f.data)
    setTransactions(t.data)
    setFeedbacks(fb.data)
  }

  const handleCreateFood = async () => {
    try {
      await createFood(foodForm)
      alert('Food item created!')
      setFoodForm({ food_name: '', price: '', category: '' })
    } catch {
      alert('Failed to create food')
    }
  }

  const handleReport = async (type) => {
    let res
    try {
      switch (type) {
        case 'topFood':
          res = await getTopFood()
          break
        case 'popularDept':
          res = await getPopularDepartment()
          break
        case 'categoryRevenue':
          res = await getCategoryRevenue()
          break
        case 'topStudents':
          res = await getTopStudents()
          break
        case 'topSuppliers':
          res = await getTopSuppliers()
          break
        case 'dailyRevenue':
          res = await getDailyRevenue()
          break
        case 'employeeAvgRating':
          res = await getEmployeeAverageRating()
          break
        case 'topFoodPerDept':
          res = await getTopFoodPerDepartment()
          break
      }

      setReportData(res.data)
    } catch {
      alert('Failed to fetch report')
    }
  }

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
              {columns.map((col, i) => {
                const cellValue = row[col]
                const isDateColumn = col.toLowerCase().includes('date')

                return (
                  <td key={i} className="border p-2">
                    {isDateColumn && cellValue
                      ? new Date(cellValue).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : cellValue}
                  </td>
                )
              })}
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
  )

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

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
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Create Food
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-4 border rounded shadow bg-blue-50 overflow-auto">
          <h3 className="font-bold mb-2 text-blue-700">Students</h3>
          <div className="bg-white rounded shadow">
            {renderTable(students, [
              'student_id',
              'first_name',
              'last_name',
              'dept_name',
            ])}
          </div>
        </div>

        <div className="p-4 border rounded shadow bg-green-50 overflow-auto">
          <h3 className="font-bold mb-2 text-green-700">Employees</h3>
          <div className="bg-white rounded shadow">
            {renderTable(employees, [
              'employee_id',
              'first_name',
              'last_name',
              'role',
              'salary',
              'phone',
              'hire_date',
            ])}
          </div>
        </div>

        <div className="p-4 border rounded shadow bg-yellow-50 overflow-auto">
          <h3 className="font-bold mb-2 text-yellow-700">Supplied Foods</h3>
          <div className="bg-white rounded shadow">
            {renderTable(suppliedFoods, [
              'supply_id',
              'supplier_name',
              'food_name',
              'quantity',
              'supply_date',
            ])}
          </div>
        </div>

        <div className="p-4 border rounded shadow bg-purple-50 overflow-auto">
          <h3 className="font-bold mb-2 text-purple-700">Transactions</h3>
          <div className="bg-white rounded shadow">
            {renderTable(transactions, [
              'transaction_id',
              'type',
              'quantity',
              'transaction_date',
              'food_name',
            ])}
          </div>
        </div>

        <div className="p-4 border rounded shadow bg-pink-50 overflow-auto">
          <h3 className="font-bold mb-2 text-pink-700">Employee Feedbacks</h3>
          <div className="bg-white rounded shadow">
            {renderTable(feedbacks, [
              'feedback_id',
              'rating',
              'comment',
              'date',
              'employee_name',
              'student_name',
            ])}
          </div>
        </div>
      </div>

      <div className="p-4 border rounded shadow space-y-4 mt-4">
        <h3 className="text-xl font-bold">Reports</h3>
        <div className="flex flex-wrap space-x-2 mb-2">
          {[
            { key: 'topFood', label: 'Top Food' },
            { key: 'popularDept', label: 'Popular Department' },
            {
              key: 'categoryRevenue',
              label: 'Revenue by Category',
            },
            { key: 'topStudents', label: 'Top Students' },
            { key: 'topSuppliers', label: 'Top Suppliers' },
            { key: 'dailyRevenue', label: 'Daily Revenue' },
            {
              key: 'employeeAvgRating',
              label: 'Employee Avg Rating',
            },
            { key: 'topFoodPerDept', label: 'Top Food Per Dept' },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => handleReport(r.key)}
              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-800 mb-1"
            >
              {r.label}
            </button>
          ))}
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
                  {Object.entries(row).map(([key, val], j) => {
                    const isDateColumn = key.toLowerCase().includes('date')

                    return (
                      <td key={j} className="border p-2">
                        {isDateColumn && val
                          ? new Date(val).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : val}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
