import { useState, useEffect } from 'react'
import {
    getFoods,
    createFood,
    getReports,
    loginUser,
    registerUser,
} from '../api/api'

export default function AuthorityPanel() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loginForm, setLoginForm] = useState({ ID: '', password: '' })
    const [registerForm, setRegisterForm] = useState({
        first_name: '',
        last_name: '',
        password: '',
    })
    const [foodForm, setFoodForm] = useState({
        food_name: '',
        price: '',
        category: '',
    })
    const [foods, setFoods] = useState([])
    const [reports, setReports] = useState({})
    const [error, setError] = useState('')

    useEffect(() => {
        const id = localStorage.getItem('authorityId')
        if (id) {
            setLoggedIn(true)
            fetchFoods()
            fetchReports()
        }
    }, [])

    const fetchFoods = async () => {
        const res = await getFoods()
        setFoods(res.data)
    }

    const fetchReports = async () => {
        const res = await getReports()
        setReports(res.data)
    }

    const handleLogin = async () => {
        try {
            const res = await loginUser({ userType: 'authority', ...loginForm })
            if (res.data.exists) {
                localStorage.setItem('authorityId', loginForm.ID)
                setLoggedIn(true)
                fetchFoods()
                fetchReports()
            } else setError('Invalid credentials')
        } catch {
            setError('Server error')
        }
    }

    const handleRegister = async () => {
        try {
            const res = await registerUser({
                userType: 'authority',
                ...registerForm,
            })
            localStorage.setItem('authorityId', res.data.ID)
            setLoggedIn(true)
            fetchFoods()
            fetchReports()
        } catch {
            setError('Server error')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('authorityId')
        setLoggedIn(false)
    }

    const handleCreateFood = async () => {
        try {
            await createFood(foodForm)
            fetchFoods()
            setFoodForm({ food_name: '', price: '', category: '' })
            alert('Food created')
        } catch {
            alert('Failed to create food')
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
                        <h2 className='text-2xl font-bold'>Authority Panel</h2>
                        <button
                            onClick={handleLogout}
                            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                        >
                            Logout
                        </button>
                    </div>

                    {/* Food Management */}
                    <div className='p-4 border rounded shadow space-y-4'>
                        <h3 className='text-lg font-bold'>Create Food</h3>
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
                            onClick={handleCreateFood}
                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                        >
                            Create
                        </button>
                    </div>

                    {/* Food List */}
                    <div className='grid md:grid-cols-3 gap-4'>
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

                    {/* Reports */}
                    <div className='mt-6 p-4 border rounded shadow'>
                        <h3 className='text-lg font-bold mb-2'>Reports</h3>
                        <pre className='text-sm'>
                            {JSON.stringify(reports, null, 2)}
                        </pre>
                    </div>
                </>
            )}
        </div>
    )
}
