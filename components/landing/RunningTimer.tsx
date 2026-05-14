'use client'

import { useEffect, useMemo, useState } from 'react'

function pad(value: number) {
    return String(value).padStart(2, '0')
}

export default function RunningTimer() {
    const [seconds, setSeconds] = useState(35)

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSeconds((current) => (current + 1) % 60)
        }, 1000)
        return () => window.clearInterval(timer)
    }, [])

    const countdown = useMemo(
        () => [
            { value: '28', label: 'Days' },
            { value: '09', label: 'Hrs' },
            { value: '26', label: 'Min' },
            { value: pad(seconds), label: 'Sec' },
        ],
        [seconds],
    )

    return (
        <div className="mt-2 rounded-[1.5rem] border border-[#E8DCCD] bg-white/90 p-2.5 shadow-card">
            <div className="grid grid-cols-4 gap-1.5 text-center">
                {countdown.map((segment) => (
                    <div key={segment.label} className="rounded-xl border border-[#E8DCCD] bg-[#FFF8F1] px-1 py-2">
                        <p className="font-heading text-[13px] text-[#221B17] tabular-nums leading-none">{segment.value}</p>
                        <p className="mt-0.5 text-[7px] uppercase tracking-[0.2em] text-[#7E716B]">{segment.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
