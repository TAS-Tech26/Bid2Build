// AuctionHeader.tsx


import {Button} from '@/components/ui/button'

import {ArrowLeft} from 'lucide-react'


interface Props {
    assetName: string
    category: string
    onClose: () => void
}


export default function AuctionHeader({assetName, category, onClose}: Props) {
    
    return (

        <div className = "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
            <Button
                variant = 'outline'
                onClick = {onClose}
                className = "flex items-center gap-2 px-5 py-5 text-sm font-bold w-fit"
            >
                <ArrowLeft className="h-4 w-4" />

                Return to Marketplace
            </Button>

            <div className = "text-left sm:text-right">
                <div className = "text-[10px] font-mono uppercase tracking-[0.3em] text-primary">
                    LIVE AUCTION • {category?.toUpperCase() || 'ASSET'}
                </div>

                <h1 className = "mt-1.5 text-3xl font-black tracking-tight text-foreground">
                    {assetName}
                </h1>
            </div>
        </div>

    )

}
