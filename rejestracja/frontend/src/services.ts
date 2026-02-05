import axios from "axios";

declare global {
    interface Window {
        apiBaseUrl: string;
    }
}

const apiClient = axios.create({
    baseURL: window.apiBaseUrl,
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
    }
})

// Add request interceptor to append timestamp for cache busting
apiClient.interceptors.request.use((config) => {
    // Add timestamp to URL to prevent caching
    const timestamp = Date.now();
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${timestamp}`;
    return config;
});

export interface DiscountCodeResponse {
    valid: boolean
    discountPercentDefault?: number
    discountPercentMin?: number
    discountPercentMax?: number
}

export async function verifyDiscountCode(code: string): Promise<DiscountCodeResponse> {
    const resp = await apiClient.post<DiscountCodeResponse>('/api/verifyDiscountCode', { code })
    return resp.data
}

export interface CreatePaymentRequest {
    serviceId: string
    serviceName: string
    amount: number
    payerEmail: string
    payerName: string
    discountCode?: string
    discountPercent?: number
}

export interface CreatePaymentResponse {
    transactionPaymentUrl: string
    transactionId: string
}

export async function createPayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const resp = await apiClient.post<CreatePaymentResponse>('/api/createPayment', data)
    return resp.data
}
