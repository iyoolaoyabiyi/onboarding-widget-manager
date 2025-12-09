export default function DocumentationPreview() {
    return(
        <div className="px-6 py-16 md:py-24 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                Easy to Install
            </h2>
            <p className="text-lg text-center mb-8 max-w-2xl">
                Just add this script tag to your website to activate the onboarding tour.
            </p>

            <div className="w-full max-w-3xl mb-8 p-6 rounded-lg border-2">
                <code className="block overflow-x-auto">
                    &lt;script src="https://yourproject.com/embed.js" data-tour-id="your-tour-id"&gt;&lt;/script&gt;
                </code>
            </div>

            <div>
                <button className="px-6 py-3 rounded-lg font-medium">
                    View Full Documentation
                </button>
            </div>
        </div>
    )
}