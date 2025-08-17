export default function FoodCard({ food, onOrder }) {
    return (
        <div className='border p-4 rounded shadow hover:shadow-lg'>
            <h2 className='font-bold'>{food.food_name}</h2>
            <p>Category: {food.category}</p>
            <p>Price: ${food.price}</p>
            {onOrder && (
                <button
                    onClick={() => onOrder(food)}
                    className='mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                    Order
                </button>
            )}
        </div>
    )
}
