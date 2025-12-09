export default function HowItWorks() {
    return(
        <div className="px-6 py-16 md:py-24">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
                How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <div className="flex flex-col gap-3">
                    <h4 className="text-lg md:text-xl font-semibold mb-1">
                        Create Your Tour
                    </h4>
                    <p>Add steps and descriptions inside the dashboard.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="text-lg md:text-xl font-semibold mb-1">
                        Get Your Embed Code
                    </h4>
                    <p>Copy the generated script tag.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="text-lg md:text-xl font-semibold mb-1">
                        Add It to Your Website
                    </h4>
                    <p>Paste the script and watch your onboarding appear instantly.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="text-lg md:text-xl font-semibold mb-1">
                        Track User Activity
                    </h4>
                    <p>Monitor completions, skips, and engagement.</p>
                </div>
            </div>
        </div>
    )
}