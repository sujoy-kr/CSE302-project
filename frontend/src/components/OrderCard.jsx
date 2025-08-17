export default function OrderCard({ order, onDeliver }) {
    return (
        <div className='border p-4 rounded shadow mb-2 flex justify-between items-center'>
            <div>
                <p>Order ID: {order.ID}</p>
                <p>Student ID: {order.student_ID}</p>
                <p>Food Item ID: {order.food_item_ID}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Status: {order.status}</p>
            </div>
            {onDeliver && (
                <button
                    onClick={() => onDeliver(order)}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                    Deliver
                </button>
            )}
        </div>
    )
}
