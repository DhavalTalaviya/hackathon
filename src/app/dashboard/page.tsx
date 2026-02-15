import Link from 'next/link';
import DashboardComponent from '@/components/generated/Dashboard';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            AI Analytics Dashboard
                        </h1>
                    </div>
                </header>

                <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 min-h-[500px]">
                    <DashboardComponent />
                </main>
            </div>
        </div>
    );
}
