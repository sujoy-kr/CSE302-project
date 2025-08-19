export default function Navbar({ currentPanel, setPanel }) {
    const panels = ['student', 'employee', 'supplier', 'authority']

    return (
        <nav className='bg-gray-800 p-4 flex justify-between items-center text-white'>
            <div className='flex space-x-4'>
                {panels.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPanel(p)}
                        className={`px-3 py-1 rounded ${
                            currentPanel === p
                                ? 'bg-gray-600'
                                : 'hover:bg-gray-700'
                        }`}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>
        </nav>
    )
}
