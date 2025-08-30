import { useEffect, useState } from 'react'
import {
  getFoods,
  getSuppliers,
  loginUser,
  registerUser,
  supplyFood,
} from '../api/api'

export default function SupplierPanel() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [supplierId, setSupplierId] = useState(null)
  const [loginForm, setLoginForm] = useState({ ID: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    supplier_name: '',
    phone: '',
    email: '',
    password: '',
  })
  const [foods, setFoods] = useState([])
  const [quantities, setQuantities] = useState({})
  const [suppliers, setSuppliers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('supplierId')
    if (id) {
      setSupplierId(id)
      setLoggedIn(true)
      fetchFoods()
      fetchSuppliers()
    }
  }, [])

  const fetchFoods = async () => {
    const res = await getFoods()
    setFoods(res.data)
  }

  const fetchSuppliers = async () => {
    const res = await getSuppliers()
    setSuppliers(res.data)
  }

  const handleLogin = async () => {
    try {
      const res = await loginUser({ userType: 'supplier', ...loginForm })

      if (res.data.exists) {
        const supplierIdFromServer = res.data.user.supplier_id
        localStorage.setItem('supplierId', supplierIdFromServer)
        setSupplierId(supplierIdFromServer)
        setLoggedIn(true)
        fetchFoods()
        fetchSuppliers()
      } else setError('Invalid credentials')
    } catch {
      setError('Server error')
    }
  }

  const handleRegister = async () => {
    try {
      const res = await registerUser({
        userType: 'supplier',
        ...registerForm,
      })

      localStorage.setItem('supplierId', res.data.supplier_id)
      setSupplierId(res.data.supplier_id)
      setLoggedIn(true)
      fetchFoods()
      fetchSuppliers()
    } catch {
      setError('Server error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('supplierId')
    setLoggedIn(false)
    setSupplierId(null)
    setFoods([])
    setQuantities({})
    setSuppliers([])
  }

  const handleSupply = async (foodId) => {
    try {
      const quantity = parseInt(quantities[foodId] || 1)
      await supplyFood({
        supplier_id: supplierId,
        food_item_id: foodId,
        quantity,
      })
      alert('Food delivered successfully!')
      setQuantities({ ...quantities, [foodId]: '' })
    } catch {
      alert('Failed to deliver food')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
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
              placeholder="Supplier Name"
              value={registerForm.supplier_name}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  supplier_name: e.target.value,
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
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
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
            <h2 className="text-2xl font-bold">Supplier Panel</h2>
            <h2 className="text-2xl font-bold">Supplier ID: {supplierId}</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {foods.map((f, i) => (
              <div key={i} className="p-4 border rounded shadow">
                <h3 className="font-semibold">{f.food_name}</h3>
                <p>Price: ৳{f.price}</p>
                <p>Category: {f.category}</p>
                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={quantities[f.food_item_id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [f.food_item_id]: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded my-2"
                />
                <button
                  onClick={() => handleSupply(f.food_item_id)}
                  className="mt-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Deliver
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Registered Suppliers</h2>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Phone</th>
                  <th className="border px-2 py-1">Email</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{s.supplier_id}</td>
                    <td className="border px-2 py-1">{s.supplier_name}</td>
                    <td className="border px-2 py-1">{s.phone}</td>
                    <td className="border px-2 py-1">{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
