import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
    return (
        <div className="min-h-screen bg-[#0d1117] text-white flex">
            <Sidebar />
            <div className="flex-1 ml-44 min-w-0">
                <Header />
                <main className="min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}