export default function Hero(){
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 max-w-4xl">
                Create Beautiful Guided Product Tours in Minutes
            </h1>
            <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
                Enhance user experience with smooth, interactive onboarding flows that are simple to create and effortless to integrate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 rounded-lg font-medium">
                    Get Started
                </button>
                <button className="px-6 py-3 rounded-lg font-medium">
                    Read Documentation
                </button>
            </div>
        </div>
    )
}