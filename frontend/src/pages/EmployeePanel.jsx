// pages/EmployeePanel.jsx
import { useEffect, useState } from 'react'
import {
    deliverOrder,
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
        setOrders(pendingOrders)
    }

    const handleLogin = async () => {
        try {
            const res = await loginUser({ userType: 'employee', ...loginForm })
            console.log(res)

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

            console.log(res)

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
    }

    const handleDeliver = async (orderId) => {
        try {
            await deliverOrder(orderId, employeeId)
            alert('Order delivered & transaction created!')
            fetchOrders()
        } catch (e) {
            console.log(e)

            alert('Failed to deliver order')
        }
    }

    return (
        <div className='p-6 max-w-5xl mx-auto space-y-6'>
            {!loggedIn && (
                <div className='grid md:grid-cols-2 gap-6'>
                    {/* Login */}
                    <div className='p-6 border rounded shadow space-y-4'>
                        <h2 className='text-xl font-bold'>Login</h2>
                        {error && <p className='text-red-500'>{error}</p>}
                        <input
                            placeholder='ID'
                            value={loginForm.ID}
                            onChange={(e) =>
                                setLoginForm({
                                    ...loginForm,
                                    ID: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={loginForm.password}
                            onChange={(e) =>
                                setLoginForm({
                                    ...loginForm,
                                    password: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <button
                            onClick={handleLogin}
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                        >
                            Login
                        </button>
                    </div>

                    {/* Register */}
                    <div className='p-6 border rounded shadow space-y-4'>
                        <h2 className='text-xl font-bold'>Register</h2>
                        <input
                            placeholder='First Name'
                            value={registerForm.first_name}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    first_name: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            placeholder='Last Name'
                            value={registerForm.last_name}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    last_name: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            placeholder='Role'
                            value={registerForm.role}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    role: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            placeholder='Salary'
                            value={registerForm.salary}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    salary: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            placeholder='Phone'
                            value={registerForm.phone}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    phone: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={registerForm.password}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    password: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <button
                            onClick={handleRegister}
                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}

            {loggedIn && (
                <>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold'>Pending Orders</h2>
                        <h2 className='text-2xl font-bold'>
                            Employee ID: {employeeId}
                        </h2>
                        <button
                            onClick={handleLogout}
                            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                        >
                            Logout
                        </button>
                    </div>

                    <div className='grid md:grid-cols-3 gap-4'>
                        {orders.map((o, i) => (
                            <div key={i} className='p-4 border rounded shadow'>
                                <p>Order ID: {o.order_id}</p>
                                <p>Food ID: {o.food_item_id}</p>
                                <p>Student: {o.student_id}</p>
                                <p>Quantity: {o.quantity}</p>
                                <p>
                                    Date:{' '}
                                    {new Date(o.order_date).toLocaleDateString(
                                        undefined,
                                        {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        }
                                    )}
                                </p>

                                <p>Status: {o.status}</p>
                                <button
                                    onClick={() => handleDeliver(o.order_id)}
                                    className='mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
                                >
                                    Deliver
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
