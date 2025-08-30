import { useEffect, useState } from 'react'
import {
  deliverOrder,
  getOrders,
  getPendingOrders,
  loginUser,
  registerUser,
} from '../api/api'

export default function EmployeePanel() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [employeeId, setEmployeeId] = useState(null)
  const [loginForm, setLoginForm] = useState({ ID: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    first_name: '',
    last_name: '',
    role: '',
    salary: '',
    phone: '',
    password: '',
  })

  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('employeeId')
    if (id) {
      setEmployeeId(id)
      setLoggedIn(true)
      fetchOrders()
    }
  }, [])

  const fetchOrders = async () => {
    const pendingOrders = await getPendingOrders()
    const all = await getOrders()

    setOrders(pendingOrders)
    setAllOrders(all.data)
  }

  const handleLogin = async () => {
    try {
      const res = await loginUser({ userType: 'employee', ...loginForm })
      if (res.data.exists) {
        localStorage.setItem('employeeId', res.data.user.employee_id)
        setEmployeeId(res.data.user.employee_id)
        setLoggedIn(true)
        fetchOrders()
      } else setError('Invalid credentials')
    } catch {
      setError('Server error')
    }
  }

  const handleRegister = async () => {
    try {
      const res = await registerUser({
        userType: 'employee',
        ...registerForm,
      })
      localStorage.setItem('employeeId', res.data.employee_id)
      setEmployeeId(res.data.employee_id)
      setLoggedIn(true)
      fetchOrders()
    } catch {
      setError('Server error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('employeeId')
    setLoggedIn(false)
    setEmployeeId(null)
    setOrders([])
    setAllOrders([])
  }

  const handleDeliver = async (orderId) => {
    try {
      await deliverOrder(orderId, employeeId)
      alert('Order delivered & transaction created!')
      fetchOrders()
    } catch {
      alert('Failed to deliver order')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {!loggedIn && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded shadow space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              placeholder="ID"
              value={loginForm.ID}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  ID: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleLogin}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Login
            </button>
          </div>

          <div className="p-6 border rounded shadow space-y-4">
            <h2 className="text-xl font-bold">Register</h2>
            <input
              placeholder="First Name"
              value={registerForm.first_name}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  first_name: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Last Name"
              value={registerForm.last_name}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  last_name: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Role"
              value={registerForm.role}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  role: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Salary"
              value={registerForm.salary}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  salary: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Phone"
              value={registerForm.phone}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  password: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleRegister}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {loggedIn && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Pending Orders</h2>
            <h2 className="text-2xl font-bold">Employee ID: {employeeId}</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {orders.map((o, i) => (
              <div key={i} className="p-4 border rounded shadow">
                <p>Order ID: {o.order_id}</p>
                <p>Food: {o.food_item}</p>
                <p>Student: {o.ordered_by}</p>
                <p>Quantity: {o.quantity}</p>
                <p>
                  Date:{' '}
                  {new Date(o.order_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p>Status: {o.status}</p>
                <button
                  onClick={() => handleDeliver(o.order_id)}
                  className="mt-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Deliver
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Order ID</th>
                    <th className="p-2 border">Food</th>
                    <th className="p-2 border">Student</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Handled By</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((o, i) => (
                    <tr key={i} className="text-center">
                      <td className="p-2 border">{o.order_id}</td>
                      <td className="p-2 border">{o.food_item}</td>
                      <td className="p-2 border">{o.ordered_by}</td>
                      <td className="p-2 border">{o.quantity}</td>
                      <td className="p-2 border">
                        {new Date(o.order_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-2 border">{o.status}</td>
                      <td className="p-2 border">
                        {o.handled_by ? o.handled_by : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
