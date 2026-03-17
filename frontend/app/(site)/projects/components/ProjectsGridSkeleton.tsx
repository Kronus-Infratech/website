export default function ProjectsGridSkeleton() {
    return (
        <section className="py-14 px-10" aria-busy="true" aria-label="Loading projects">
            <div className="max-w-7xl mx-auto">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="h-11 flex-1 rounded-lg bg-dark-gray/10 animate-pulse" />
                    <div className="h-11 w-22 rounded-lg bg-dark-gray/10 animate-pulse" />
                    <div className="h-11 w-28 rounded-lg bg-dark-gray/10 animate-pulse" />
                </div>

                {/* Results count */}
                <div className="h-4 w-32 rounded bg-dark-gray/10 animate-pulse mb-6" />

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-dark-gray/6 bg-white">
                            <div className="h-56 bg-dark-gray/10 animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-3 w-20 rounded bg-dark-gray/10 animate-pulse" />
                                <div className="h-5 w-3/4 rounded bg-dark-gray/10 animate-pulse" />
                                <div className="h-3 w-1/2 rounded bg-dark-gray/10 animate-pulse" />
                                <div className="flex gap-4 pt-1">
                                    <div className="h-3 w-12 rounded bg-dark-gray/10 animate-pulse" />
                                    <div className="h-3 w-12 rounded bg-dark-gray/10 animate-pulse" />
                                    <div className="h-3 w-16 rounded bg-dark-gray/10 animate-pulse" />
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-dark-gray/6">
                                    <div className="h-6 w-24 rounded bg-dark-gray/10 animate-pulse" />
                                    <div className="h-9 w-9 rounded-lg bg-dark-gray/10 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
