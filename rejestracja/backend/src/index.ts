import express from 'express';
import path from 'path';
import { readFileSync } from 'fs';
import { auth } from 'express-openid-connect'
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
const auth0Conf = JSON.parse(readFileSync(path.join(__dirname, '../../auth0.json'), 'utf8'))

app.use(basePath, express.static(publicPath));
const apiRouter = express.Router()

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(basePath, auth({
    authRequired: false,
    auth0Logout: true,
    baseURL: baseUrl,
    clientID: auth0Conf.clientId,
    secret: auth0Conf.clientSecret,
    issuerBaseURL: 'https://dev-dm1fjo0wgp2xrsc0.us.auth0.com', // TODO
    session: {
        name: '__session' // Required for Firebase hosting rewrites policy (https://firebase.google.com/docs/hosting/manage-cache#using_cookies)
    },
}));

// req.isAuthenticated is provided from the auth router
apiRouter.get('/user', async (req, res) => {
    try {
        console.log('REQ OIDC', req.oidc)
        console.log('REQ OIDC isAuthenticated', req.oidc.isAuthenticated()) 
        const isAuthenticated = req.oidc.isAuthenticated()
        if (isAuthenticated && req.oidc.user) {
            const email = req.oidc.user.email
            return res.json({ loggedIn: true, email })
        }
        return res.json({ loggedIn: false })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});

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
