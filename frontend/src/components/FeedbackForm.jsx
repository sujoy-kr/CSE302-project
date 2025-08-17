import React, { useState } from 'react'
import { postFeedback } from '../api/api'

const FeedbackForm = ({ studentId, employeeId }) => {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')

    const handleSubmit = async () => {
        await postFeedback({ studentId, employeeId, rating, comment })
        alert('Feedback submitted!')
        setComment('')
        setRating(5)
    }

    return (
        <div className='border p-4 rounded shadow mt-4'>
            <h3 className='font-semibold mb-2'>Leave Feedback</h3>
            <label className='block mb-1'>Rating (1-5):</label>
            <input
                type='number'
                min='1'
                max='5'
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className='border p-1 w-full mb-2'
            />
            <label className='block mb-1'>Comment:</label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='border p-1 w-full mb-2'
            ></textarea>
            <button
                onClick={handleSubmit}
                className='bg-blue-600 text-white px-2 py-1 rounded'
            >
                Submit Feedback
            </button>
        </div>
    )
}

export default FeedbackForm
