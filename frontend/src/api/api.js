// api/api.js
import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

// -------------------- Auth --------------------
export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data)

export const registerUser = async ({ userType, ...rest }) => {
    let url = ''
    if (userType === 'student') url = `${BASE_URL}/students`
    else if (userType === 'employee') url = `${BASE_URL}/employees`
    else if (userType === 'supplier') url = `${BASE_URL}/suppliers`

    return axios.post(url, rest)
}

// -------------------- Students --------------------
export const getFoods = () => axios.get(`${BASE_URL}/food-items`)
export const createOrder = (data) => axios.post(`${BASE_URL}/orders`, data)
export const leaveFeedback = (data) => axios.post(`${BASE_URL}/feedback`, data)

// -------------------- Employees --------------------
export const getOrders = () => axios.get(`${BASE_URL}/orders`)
export const getPendingOrders = async () => {
    const res = await getOrders()
    return res.data.filter((o) => o.status === 'pending')
}
export const deliverOrder = (orderId, employee_id) =>
    axios.put(`${BASE_URL}/orders/${orderId}/deliver`, { employee_id })

// -------------------- Suppliers --------------------
// Supplier delivers food
export const supplyFood = (data) =>
    axios.post(`${BASE_URL}/suppliers/supply-food`, data)

// -------------------- Admin / Reports --------------------
export const getStudents = () => axios.get(`${BASE_URL}/students`)
export const getEmployees = () => axios.get(`${BASE_URL}/employees`)
export const getSuppliedFoods = () => axios.get(`${BASE_URL}/suppliers/foods`)

export const getTopFood = () => axios.get(`${BASE_URL}/reports/top-food`)
export const getPopularDepartment = () =>
    axios.get(`${BASE_URL}/reports/popular-department`)
export const getCategoryRevenue = () =>
    axios.get(`${BASE_URL}/reports/category-revenue`)
export const getTopEmployeeRating = () =>
    axios.get(`${BASE_URL}/reports/top-employee-rating`)
export const getTopEmployeeOrders = () =>
    axios.get(`${BASE_URL}/reports/top-employee-orders`)

export const createFood = (data) => axios.post(`${BASE_URL}/food-items`, data)
