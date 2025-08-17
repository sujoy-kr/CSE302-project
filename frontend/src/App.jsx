import { useState } from 'react'
import StudentPanel from './pages/StudentPanel'
import EmployeePanel from './pages/EmployeePanel'
import SupplierPanel from './pages/SupplierPanel'
import AuthorityPanel from './pages/AuthorityPanel'
import Navbar from './components/Navbar'

function App() {
    const [currentPanel, setCurrentPanel] = useState('student')

    const renderPanel = () => {
        switch (currentPanel) {
            case 'student':
                return <StudentPanel />
            case 'employee':
                return <EmployeePanel />
            case 'supplier':
                return <SupplierPanel />
            case 'authority':
                return <AuthorityPanel />
            default:
                return <StudentPanel />
        }
    }

    return (
        <>
            <Navbar currentPanel={currentPanel} setPanel={setCurrentPanel} />
            {renderPanel()}
        </>
    )
}

export default App
