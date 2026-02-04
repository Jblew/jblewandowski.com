import express, { Router } from 'express';
import path from 'path';
import { mustGetEnv } from './util'

interface DiscountCode {
    code: string
    discountPercentDefault: number
    discountPercentMin: number
    discountPercentMax: number
}

const allowedDiscountCodes: DiscountCode[] = [
    {
        code: 'b2x19a1a',
        discountPercentMin: 25,
        discountPercentMax: 100,
        discountPercentDefault: 100,
    },
    {
        code: 'b2c19a0k',
        discountPercentMin: 25,
        discountPercentMax: 100,
        discountPercentDefault: 100,
    }
]

export function setupDiscountRoutes(router: Router) {
    router.post('/api/verifyDiscountCode', (req, res) => {
        const { code } = req.body
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ valid: false, error: 'Code is required' })
        }
        const foundCode = allowedDiscountCodes.find(c => c.code === code)
        if (foundCode) {
            return res.json({
                valid: true,
                discountPercentDefault: foundCode.discountPercentDefault,
                discountPercentMin: foundCode.discountPercentMin,
                discountPercentMax: foundCode.discountPercentMax,
            })
        }
        return res.json({ valid: false })
    })
}