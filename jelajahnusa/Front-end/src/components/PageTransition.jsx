import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({
    children
}) {
    const { pathname } = useLocation()

    const [visible, setVisible] =
        useState(false)

    useEffect(() => {
        setVisible(false)

        const timer = setTimeout(() => {
            setVisible(true)
        }, 30)

        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div
            className={`
                transition-all
                duration-300
                ease-out
                ${visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1'
                }
            `}
        >
            {children}
        </div>
    )
}