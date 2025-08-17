import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

// -------------------- Auth --------------------

// Login for all users
export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data)

// Register for all users
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

// Get all orders (can filter pending in frontend)
export const getOrders = () => axios.get(`${BASE_URL}/orders`)

// Assign employee to deliver an order
export const assignDelivery = (data) =>
    axios.post(`${BASE_URL}/orders/assign-delivery`, data)

// Get only pending orders
export const getPendingOrders = async () => {
    const res = await axios.get(`${BASE_URL}/orders`)
    return res.data.filter((o) => o.status === 'pending')
}

// -------------------- Suppliers --------------------

export const supplyFood = (data) =>
    axios.post(`${BASE_URL}/suppliers/add-food`, data)

export const addFood = (data) =>
    axios.post(`${BASE_URL}/suppliers/add-food`, data)

export const createFood = (data) => axios.post(`${BASE_URL}/food-items`, data)

// -------------------- Authority / Reports --------------------

// Top 10 foods ordered
export const getTopFood = () => axios.get(`${BASE_URL}/reports/top-food`)

// Most popular department
export const getPopularDepartment = () =>
    axios.get(`${BASE_URL}/reports/popular-department`)

// Revenue per food category
export const getCategoryRevenue = () =>
    axios.get(`${BASE_URL}/reports/category-revenue`)

// Employee with most 5-star ratings
export const getTopEmployeeRating = () =>
    axios.get(`${BASE_URL}/reports/top-employee-rating`)

// Employee with highest average orders per day
export const getTopEmployeeOrders = () =>
    axios.get(`${BASE_URL}/reports/top-employee-orders`)

// General get reports (mock wrapper)
export const getReports = async () => {
    const [topFood, popularDept, categoryRevenue, topEmpRating, topEmpOrders] =
        await Promise.all([
            getTopFood(),
            getPopularDepartment(),
            getCategoryRevenue(),
            getTopEmployeeRating(),
            getTopEmployeeOrders(),
        ])

    return {
        topFood: topFood.data,
        popularDepartment: popularDept.data,
        categoryRevenue: categoryRevenue.data,
        topEmployeeRating: topEmpRating.data,
        topEmployeeOrders: topEmpOrders.data,
    }
}
