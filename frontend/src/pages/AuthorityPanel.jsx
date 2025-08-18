import { useEffect, useState } from 'react'
import {
    createFood,
    getStudents,
    getEmployees,
    getSuppliedFoods,
    getTopFood,
    getPopularDepartment,
    getCategoryRevenue,
    getTopEmployeeRating,
    getTopEmployeeOrders,
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
    const [reportData, setReportData] = useState([])

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        const [s, e, f] = await Promise.all([
            getStudents(),
            getEmployees(),
            getSuppliedFoods(),
        ])
        setStudents(s.data)
        setEmployees(e.data)
        setSuppliedFoods(f.data)
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
                case 'topEmployeeRating':
                    res = await getTopEmployeeRating()
                    break
                case 'topEmployeeOrders':
                    res = await getTopEmployeeOrders()
                    break
            }
            setReportData(res.data)
        } catch {
            alert('Failed to fetch report')
        }
    }

    return (
        <div className='p-6 max-w-6xl mx-auto space-y-6'>
            <h2 className='text-2xl font-bold'>Admin Panel</h2>

            {/* Create Food */}
            <div className='p-4 border rounded shadow space-y-4'>
                <h3 className='text-xl font-bold'>Create Food</h3>
                <input
                    placeholder='Food Name'
                    value={foodForm.food_name}
                    onChange={(e) =>
                        setFoodForm({ ...foodForm, food_name: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                />
                <input
                    type='number'
                    placeholder='Price'
                    value={foodForm.price}
                    onChange={(e) =>
                        setFoodForm({ ...foodForm, price: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                />
                <input
                    placeholder='Category'
                    value={foodForm.category}
                    onChange={(e) =>
                        setFoodForm({ ...foodForm, category: e.target.value })
                    }
                    className='w-full p-2 border rounded'
                />
                <button
                    onClick={handleCreateFood}
                    className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                    Create Food
                </button>
            </div>

            {/* Tables */}
            <div className='grid md:grid-cols-3 gap-4'>
                <div className='p-4 border rounded shadow overflow-auto'>
                    <h3 className='font-bold mb-2'>Students</h3>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Dept</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.student_id}>
                                    <td>{s.student_id}</td>
                                    <td>
                                        {s.first_name} {s.last_name}
                                    </td>
                                    <td>{s.dept_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='p-4 border rounded shadow overflow-auto'>
                    <h3 className='font-bold mb-2'>Employees</h3>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((e) => (
                                <tr key={e.employee_id}>
                                    <td>{e.employee_id}</td>
                                    <td>
                                        {e.first_name} {e.last_name}
                                    </td>
                                    <td>{e.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='p-4 border rounded shadow overflow-auto'>
                    <h3 className='font-bold mb-2'>Supplied Foods</h3>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Supplier</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliedFoods.map((f, i) => (
                                <tr key={i}>
                                    <td>{f.food_name}</td>
                                    <td>{f.supplier_name}</td>
                                    <td>{f.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reports */}
            <div className='p-4 border rounded shadow space-y-4 mt-4'>
                <h3 className='text-xl font-bold'>Reports</h3>
                <div className='flex space-x-2 flex-wrap mb-2'>
                    <button
                        onClick={() => handleReport('topFood')}
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                    >
                        Top Food
                    </button>
                    <button
                        onClick={() => handleReport('popularDept')}
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                    >
                        Popular Department
                    </button>
                    <button
                        onClick={() => handleReport('categoryRevenue')}
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                    >
                        Revenue by Category
                    </button>
                    <button
                        onClick={() => handleReport('topEmployeeRating')}
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                    >
                        Top Employee Rating
                    </button>
                    <button
                        onClick={() => handleReport('topEmployeeOrders')}
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                    >
                        Top Employee Orders
                    </button>
                </div>

                {reportData.length > 0 && (
                    <table className='w-full text-sm border-collapse border'>
                        <thead>
                            <tr>
                                {Object.keys(reportData[0]).map((key, idx) => (
                                    <th key={idx} className='border px-2 py-1'>
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                        <td
                                            key={j}
                                            className='border px-2 py-1'
                                        >
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
