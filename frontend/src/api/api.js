import axios from "axios";

const BASE_URL = "http://localhost:3000";

// -------------------- Auth --------------------
export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data);

export const registerUser = async ({ userType, ...rest }) => {
  let url = "";
  if (userType === "student") url = `${BASE_URL}/students`;
  else if (userType === "employee") url = `${BASE_URL}/employees`;
  else if (userType === "supplier") url = `${BASE_URL}/suppliers`;
  else if (userType === "authority") url = `${BASE_URL}/authority`;

  return axios.post(url, rest);
};

// -------------------- Students --------------------
export const getFoods = () => axios.get(`${BASE_URL}/food-items`);
export const createOrder = (data) => axios.post(`${BASE_URL}/orders`, data);
export const leaveFeedback = (data) => axios.post(`${BASE_URL}/feedback`, data);

// -------------------- Employees --------------------
export const getOrders = () => axios.get(`${BASE_URL}/orders`);
export const getPendingOrders = async () => {
  const res = await getOrders();
  return res.data.filter((o) => o.status === "pending");
};
// single route for employee delivery + transaction
export const deliverOrder = (orderId, employee_id) =>
  axios.post(`${BASE_URL}/orders/${orderId}/deliver`, { employee_id });

// -------------------- Suppliers --------------------
export const supplyFood = (data) =>
  axios.post(`${BASE_URL}/suppliers/add-food`, data);
export const addFood = (data) =>
  axios.post(`${BASE_URL}/suppliers/add-food`, data);
export const createFood = (data) => axios.post(`${BASE_URL}/food-items`, data);

// -------------------- Authority / Reports --------------------
export const getTopFood = () => axios.get(`${BASE_URL}/reports/top-food`);
export const getPopularDepartment = () =>
  axios.get(`${BASE_URL}/reports/popular-department`);
export const getCategoryRevenue = () =>
  axios.get(`${BASE_URL}/reports/category-revenue`);
export const getTopEmployeeRating = () =>
  axios.get(`${BASE_URL}/reports/top-employee-rating`);
export const getTopEmployeeOrders = () =>
  axios.get(`${BASE_URL}/reports/top-employee-orders`);

export const getReports = async () => {
  const [topFood, popularDept, categoryRevenue, topEmpRating, topEmpOrders] =
    await Promise.all([
      getTopFood(),
      getPopularDepartment(),
      getCategoryRevenue(),
      getTopEmployeeRating(),
      getTopEmployeeOrders(),
    ]);
  return {
    topFood: topFood.data,
    popularDepartment: popularDept.data,
    categoryRevenue: categoryRevenue.data,
    topEmployeeRating: topEmpRating.data,
    topEmployeeOrders: topEmpOrders.data,
  };
};
