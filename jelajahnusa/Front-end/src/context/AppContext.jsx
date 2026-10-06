import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { seedReviews } from '../data/data'

const Ctx = createContext(null)

export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
    const [wish, setWish] = useLocalStorage('jn_wish', [])

    const [booking, setBooking] = useLocalStorage(
        'jn_booking',
        null
    )

    const [orders, setOrders] = useLocalStorage(
        'jn_orders',
        []
    )

    const [user, setUser] = useLocalStorage(
        'jn_user',
        null
    )

    const [reviews, setReviews] = useLocalStorage(
        'jn_reviews',
        seedReviews
    )

    const [messages, setMessages] = useLocalStorage(
        'jn_messages',
        []
    )

    const toggleWish = (id) =>
        setWish((w) =>
            w.includes(id)
                ? w.filter((x) => x !== id)
                : [...w, id]
        )

    return (
        <Ctx.Provider
            value={{
                wish,
                toggleWish,

                booking,
                setBooking,

                orders,
                setOrders,

                user,
                setUser,

                reviews,
                setReviews,

                messages,
                setMessages,
            }}
        >
            {children}
        </Ctx.Provider>
    )
}
