// AssetDetails.jsx


interface Props {
    asset: {
        name: string
        description?: string
        purpose?: string
        benefit?: string
        price: number
        teams: number
        time: number
    }
}


// Format seconds as MM:SS
function formatTime(secs: number): string {
    if (secs <= 0) return 'CLOSED'

    const m = Math.floor(secs / 60).toString().padStart(2, '0')

    const s = (secs % 60).toString().padStart(2, '0')

    return `${m}:${s}`
}


export default function AssetDetails({asset}: Props) {

    return (

        <div className = "space-y-6 text-white">
            {/* Description */}
            <div className = "rounded-3xl border border-white/10 bg-white/3 p-6">
                <h3 className = "mb-4 text-xl font-black">
                    About this Asset
                </h3>

                <p className = "leading-7 text-slate-400">
                    {asset.description ?? "This strategic asset strengthens your startup during Round 2. Purchasing it unlocks additional capabilities that can improve your proposal, business model & final judging score."}
                </p>
            </div>

            {/* Purpose */}
            <div className = "rounded-3xl border border-white/10 bg-white/3 p-6">
                <h3 className = "mb-4 text-xl font-black">
                    Purpose
                </h3>

                <p className = "leading-7 text-slate-400">
                    {asset.purpose ?? "Integrate this asset into your startup solution to solve real-world problems more effectively."}
                </p>
            </div>

            {/* Benefits */}
            <div className = "rounded-3xl border border-white/10 bg-white/3 p-6">
                <h3 className = "mb-4 text-xl font-black">
                    Benefits
                </h3>

                <ul className = "space-y-3 text-slate-400">
                    <li>• Improves feasibility of your startup.</li>
                    <li>• Strengthens business execution.</li>
                    <li>• Helps during market disruptions.</li>
                    <li>• Can improve judging scores when used properly.</li>
                </ul>
            </div>

            {/* Live Statistics */}
            <div className = "rounded-3xl border border-white/10 bg-white/3 p-6">
                <h3 className = "mb-5 text-xl font-black">
                    Live Statistics
                </h3>

                <div className = "grid grid-cols-2 gap-4">
                    <div className = "rounded-xl border border-white/10 p-4">
                        <div className = "text-xs uppercase text-slate-400">
                            Starting Price
                        </div>

                        <div className = "mt-2 text-2xl font-black text-[#e8c07d]">
                            {asset.price} CR
                        </div>
                    </div>

                    <div className = "rounded-xl border border-white/10 p-4">
                        <div className = "text-xs uppercase text-slate-400">
                            Teams Watching
                        </div>

                        <div className = "mt-2 text-2xl font-black">
                            {asset.teams}
                        </div>
                    </div>

                    <div className = "rounded-xl border border-white/10 p-4">
                        <div className = "text-xs uppercase text-slate-400">
                            Auction Ends
                        </div>

                        <div className = "mt-2 text-2xl font-black text-red-500">
                            {formatTime(asset.time)}
                        </div>
                    </div>

                    <div className = "rounded-xl border border-white/10 p-4">
                        <div className = "text-xs uppercase text-slate-400">
                            Status
                        </div>

                        <div className = "mt-2 text-xl font-bold text-emerald-500">
                            LIVE
                        </div>
                    </div>
                </div>
            </div>

            {/* Rules */}
            <div className = "rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
                <h3 className = "mb-4 text-xl font-black">
                    Auction Rules
                </h3>

                <ul className = "space-y-3 text-sm text-slate-400">
                    <li>• Highest bid at timer expiry wins.</li>
                    <li>• Once submitted, bids cannot be withdrawn.</li>
                    <li>• Credits are deducted only if your team wins.</li>
                    <li>• Purchased assets must be used in your final startup.</li>
                </ul>
            </div>
        </div>

    )

}

