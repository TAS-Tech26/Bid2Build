// sonner.tsx


import {Toaster as Sonner} from 'sonner'


type ToasterProps = React.ComponentProps<typeof Sonner>


const Toaster = ({...props}: ToasterProps) => {

    return (

        <Sonner
            className = "toaster group"
            toastOptions = {{
                classNames: {
                    toast: "group toast rounded-none shadow-none font-mono uppercase group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton: "rounded-none group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton: "rounded-none group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
                }
            }}
            {...props}
        />

    )

}


export {Toaster}