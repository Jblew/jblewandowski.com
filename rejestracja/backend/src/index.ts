import express from 'express';
import path from 'path';
import { mustGetEnv } from './util'
import { setupDiscountRoutes } from './discount';
import { setupPaymentRoutes } from './payment';

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

app.use(express.json({
    verify: function (req, res, buf, encoding) {
        (req as any).rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true }));
const publicPath = process.env.STATIC_ASSETS_PATH ?? path.join(__dirname, '../public')

const baseUrl = mustGetEnv('BASE_URL')
const basePath = new URL(baseUrl).pathname

app.use(basePath, express.static(publicPath));

const apiRouter = express.Router()
setupPaymentRoutes(apiRouter);
setupDiscountRoutes(apiRouter)
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
