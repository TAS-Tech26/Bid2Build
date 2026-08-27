// AuctionHeader.tsx


import {ArrowLeft} from 'lucide-react'

interface Props {
    assetName: string
    category: string
    onClose: () => void
}

export default function AuctionHeader({assetName, category, onClose}: Props) {

    return (
    
        <div className = "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
            <button
                onClick = {onClose}
                className = "flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 transition hover:bg-white/4 active:scale-[0.98] w-fit cursor-pointer text-white"
            >
                <ArrowLeft className = "h-4 w-4" />
   
                Marketplace
            </button>

            <div className = "text-center sm:text-right">
                <div className = "text-[10px] font-mono uppercase tracking-[0.3em] text-[#e8c07d]">
                    LIVE AUCTION • {category?.toUpperCase() || "ASSET"}
                </div>

                <h1 className = "mt-1.5 text-3xl font-black tracking-tight text-white">
                    {assetName}
                </h1>
            </div>
        </div>
    
    )

}

