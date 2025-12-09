export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-white px-4">
            <div className="text-center space-y-6 animate-fadeIn">

                <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-lg animate-pulse">
                    404
                </h1>

                <p className="text-gray-400 text-lg">
                    Oops! The page you're looking for doesn't exist.
                </p>

                <a
                    href="/"
                    className="inline-block mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 
                    hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-purple-800/40"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}
