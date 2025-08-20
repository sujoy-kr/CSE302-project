import axios from "axios";

const BASE_URL = "http://localhost:3000";

// auth
export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data);
export const registerUser = async ({ userType, ...rest }) => {
  let url = "";
  if (userType === "student") url = `${BASE_URL}/students`;
  else if (userType === "employee") url = `${BASE_URL}/employees`;
  else if (userType === "supplier") url = `${BASE_URL}/suppliers`;

  return axios.post(url, rest);
};

// students
export const getFoods = () => axios.get(`${BASE_URL}/food-items`);
export const createOrder = (data) => axios.post(`${BASE_URL}/orders`, data);
export const leaveFeedback = (data) => axios.post(`${BASE_URL}/feedback`, data);

// employees
export const getOrders = () => axios.get(`${BASE_URL}/orders`);

export const getPendingOrders = async () => {
  const res = await getOrders();
  return res.data.filter((o) => o.status === "pending");
};

export const deliverOrder = (orderId, employee_id) =>
  axios.put(`${BASE_URL}/orders/${orderId}/deliver`, { employee_id });

// supplies
export const getSuppliers = () => axios.get(`${BASE_URL}/suppliers`);
export const supplyFood = (data) =>
  axios.post(`${BASE_URL}/suppliers/supply-food`, data);
export const getSuppliedFoods = () =>
  axios.get(`${BASE_URL}/suppliers/supplies`);

// admin
export const getStudents = () => axios.get(`${BASE_URL}/students`);
export const getEmployees = () => axios.get(`${BASE_URL}/employees`);
export const getTransactions = () => axios.get(`${BASE_URL}/transactions`);
export const getFeedbacks = () => axios.get(`${BASE_URL}/feedback`);

// reports
export const getTopFood = () => axios.get(`${BASE_URL}/reports/top-food`);
export const getPopularDepartment = () =>
  axios.get(`${BASE_URL}/reports/popular-department`);
export const getCategoryRevenue = () =>
  axios.get(`${BASE_URL}/reports/category-revenue`);
export const getTopStudents = () =>
  axios.get(`${BASE_URL}/reports/top-students`);
export const getTopSuppliers = () =>
  axios.get(`${BASE_URL}/reports/top-suppliers`);
export const getDailyRevenue = () =>
  axios.get(`${BASE_URL}/reports/daily-revenue`);
export const getEmployeeAverageRating = () =>
  axios.get(`${BASE_URL}/reports/employee-average-rating`);
export const getTopFoodPerDepartment = () =>
  axios.get(`${BASE_URL}/reports/top-food-per-department`);

// food management
export const createFood = (data) => axios.post(`${BASE_URL}/food-items`, data);
