import { useEffect, useState } from "react";
import {
  createOrder,
  getFoods,
  leaveFeedback,
  loginUser,
  registerUser,
} from "../api/api";

export default function StudentPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [loginForm, setLoginForm] = useState({ ID: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    first_name: "",
    last_name: "",
    dept_name: "",
    password: "",
  });
  const [foods, setFoods] = useState([]);
  const [feedback, setFeedback] = useState({
    employee_id: "",
    rating: 5,
    comment: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (id) {
      setStudentId(id);
      setLoggedIn(true);
      fetchFoods();
    }
  }, []);

  const fetchFoods = async () => {
    const res = await getFoods();
    setFoods(res.data);
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser({ userType: "student", ...loginForm });
      if (res.data.exists) {
        localStorage.setItem("studentId", loginForm.ID);
        setStudentId(loginForm.ID);
        setLoggedIn(true);
        fetchFoods();
      } else setError("Invalid credentials");
    } catch {
      setError("Server error");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await registerUser({ userType: "student", ...registerForm });
      localStorage.setItem("studentId", res.data.ID);
      setStudentId(res.data.ID);
      setLoggedIn(true);
      fetchFoods();
    } catch {
      setError("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    setLoggedIn(false);
    setStudentId(null);
  };

  const handleOrder = async (foodId) => {
    try {
      await createOrder({
        student_id: studentId,
        food_item_id: foodId,
        quantity: 1,
      });
      alert("Order placed! Employee will be assigned automatically.");
    } catch {
      alert("Failed to place order");
    }
  };

  const handleLeaveFeedback = async () => {
    try {
      await leaveFeedback({
        student_id: studentId,
        ...feedback,
      });
      alert("Feedback submitted");
      setFeedback({ employee_id: "", rating: 5, comment: "" });
    } catch {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {!loggedIn && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Login */}
          <div className="p-6 border rounded shadow space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              placeholder="ID"
              value={loginForm.ID}
              onChange={(e) =>
                setLoginForm({ ...loginForm, ID: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>

          {/* Register */}
          <div className="p-6 border rounded shadow space-y-4">
            <h2 className="text-xl font-bold">Register</h2>
            <input
              placeholder="First Name"
              value={registerForm.first_name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, first_name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Last Name"
              value={registerForm.last_name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, last_name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Department"
              value={registerForm.dept_name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, dept_name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleRegister}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {loggedIn && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Foods</h2>
            <h2 className="text-2xl font-bold">Student ID: {studentId}</h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {foods.map((f) => (
              <div key={f.ID} className="p-4 border rounded shadow">
                <h3 className="font-semibold">{f.food_name}</h3>
                <p>Price: ${f.price}</p>
                <p>Category: {f.category}</p>
                <button
                  onClick={() => handleOrder(f.ID)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Order
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border rounded shadow mt-6">
            <h2 className="text-xl font-bold">Leave Feedback</h2>
            <input
              placeholder="Employee ID"
              value={feedback.employee_id}
              onChange={(e) =>
                setFeedback({ ...feedback, employee_id: e.target.value })
              }
              className="w-full p-2 border rounded my-2"
            />
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rating"
              value={feedback.rating}
              onChange={(e) =>
                setFeedback({ ...feedback, rating: e.target.value })
              }
              className="w-full p-2 border rounded my-2"
            />
            <textarea
              placeholder="Comment"
              value={feedback.comment}
              onChange={(e) =>
                setFeedback({ ...feedback, comment: e.target.value })
              }
              className="w-full p-2 border rounded my-2"
            />
            <button
              onClick={handleLeaveFeedback}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit Feedback
            </button>
          </div>
        </>
      )}
    </div>
  );
}
