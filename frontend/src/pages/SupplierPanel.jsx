import { useState, useEffect } from 'react'
import { getFoods, addFood, loginUser, registerUser } from '../api/api'

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
    const [foodForm, setFoodForm] = useState({
        food_name: '',
        price: '',
        category: '',
    })
    const [foods, setFoods] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const id = localStorage.getItem('supplierId')
        if (id) {
            setSupplierId(id)
            setLoggedIn(true)
            fetchFoods()
        }
    }, [])

    const fetchFoods = async () => {
        const res = await getFoods()
        setFoods(res.data)
    }

    const handleLogin = async () => {
        try {
            const res = await loginUser({ userType: 'supplier', ...loginForm })
            if (res.data.exists) {
                // Save the ID returned by the backend
                console.log(res)

                const supplierIdFromServer = res.data.ID || loginForm.ID
                localStorage.setItem('supplierId', supplierIdFromServer)
                setSupplierId(supplierIdFromServer)
                setLoggedIn(true)
                fetchFoods()
            } else {
                setError('Invalid credentials')
            }
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
            localStorage.setItem('supplierId', res.data.ID)
            setSupplierId(res.data.ID)
            setLoggedIn(true)
            fetchFoods()
        } catch {
            setError('Server error')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('supplierId')
        setLoggedIn(false)
        setSupplierId(null)
        setFoods([])
    }

    const handleAddFood = async () => {
        try {
            await addFood({ supplier_id: supplierId, ...foodForm })
            alert('Food added successfully')
            fetchFoods()
            setFoodForm({ food_name: '', price: '', category: '' })
        } catch {
            alert('Failed to add food')
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
                            placeholder='Supplier Name'
                            value={registerForm.supplier_name}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    supplier_name: e.target.value,
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
                            placeholder='Email'
                            value={registerForm.email}
                            onChange={(e) =>
                                setRegisterForm({
                                    ...registerForm,
                                    email: e.target.value,
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
                        <h2 className='text-2xl font-bold'>Manage Foods</h2>
                        <h2 className='text-2xl font-bold'>
                            Supplier ID: {supplierId}
                        </h2>
                        <button
                            onClick={handleLogout}
                            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                        >
                            Logout
                        </button>
                    </div>

                    <div className='p-4 border rounded shadow space-y-4'>
                        <h3 className='text-lg font-bold'>Add Food</h3>
                        <input
                            placeholder='Food Name'
                            value={foodForm.food_name}
                            onChange={(e) =>
                                setFoodForm({
                                    ...foodForm,
                                    food_name: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            type='number'
                            placeholder='Price'
                            value={foodForm.price}
                            onChange={(e) =>
                                setFoodForm({
                                    ...foodForm,
                                    price: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <input
                            placeholder='Category'
                            value={foodForm.category}
                            onChange={(e) =>
                                setFoodForm({
                                    ...foodForm,
                                    category: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded'
                        />
                        <button
                            onClick={handleAddFood}
                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                        >
                            Add Food
                        </button>
                    </div>

                    <div className='grid md:grid-cols-3 gap-4 mt-4'>
                        {foods.map((f) => (
                            <div
                                key={f.ID}
                                className='p-4 border rounded shadow'
                            >
                                <h3 className='font-semibold'>{f.food_name}</h3>
                                <p>Price: ${f.price}</p>
                                <p>Category: {f.category}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
