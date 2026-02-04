import express from 'express';
import path from 'path';
import { mustGetEnv } from './util'

const app = express();
const PORT = parseInt(mustGetEnv('PORT'))

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    // Log incoming request
    console.log(`[${timestamp}] ➡️  ${req.method} ${req.url} - IP: ${req.ip || req.connection.remoteAddress}`);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';

        console.log(`[${new Date().toISOString()}] ⬅️  ${req.method} ${req.url} - ${statusColor} ${res.statusCode} - ${duration}ms`);
    });

    next();
});

app.use(function (req, res, next) {
    const allowedOrigins: string[] = ['localhost', 'localhost:8080', '127.0.0.1', '127.0.0.1:8080', 'rejestracja-2716012268.europe-central2.run.app', 'jblewandowski.com']
    const origin = req.headers.origin;
    if (origin) {
        const originHostname = new URL(origin).hostname;
        if (allowedOrigins.includes(originHostname)) {
            res.header("Access-Control-Allow-Origin", origin);
        }
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// No-cache headers middleware
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const publicPath = process.env.STATIC_ASSETS_PATH ?? path.join(__dirname, '../public')

const baseUrl = mustGetEnv('BASE_URL')
const basePath = new URL(baseUrl).pathname

app.use(basePath, express.static(publicPath));
const apiRouter = express.Router()

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

apiRouter.get('/api/payment', (req, res) => {
    const widgetUrl = req.query.widgetUrl
    if (!widgetUrl || typeof widgetUrl !== 'string') {
        return res.status(400).send('Missing widgetUrl parameter')
    }

    const html = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Płatność - JB Lewandowski</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link href="https://s3-eu-west-1.amazonaws.com/assets.firmlet.com/assets/fakturownia/widget.css" rel="stylesheet" type="text/css" />
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <script type="text/javascript" src="${widgetUrl}"></script>
    </div>
</body>
</html>`

    return res.type('html').send(html)
})

apiRouter.post('/api/verifyDiscountCode', (req, res) => {
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

apiRouter.get('/api/availableTimeSlots', (req, res) => {
    const availableTimeSlots: AvailableTimeslot[] = [
        { id: '1', startTime: '2025-10-13T09:00:00+02:00', endTime: '2025-10-13T18:00:00+02:00' },
        { id: '2', startTime: '2025-10-14T09:00:00+02:00', endTime: '2025-10-14T18:00:00+02:00' },
        { id: '3', startTime: '2025-10-15T09:00:00+02:00', endTime: '2025-10-15T18:00:00+02:00' },
        { id: '4', startTime: '2025-10-16T09:00:00+02:00', endTime: '2025-10-16T18:00:00+02:00' },
    ]
    res.json({
        availableTimeSlots
    });
});

app.use(basePath, apiRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] 💥 ERROR in ${req.method} ${req.url}:`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Stack: ${err.stack}`);

    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
});

interface AvailableTimeslot {
    startTime: string
    endTime: string
    id?: string
}
