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

export interface SendReceiptRequest {
    serviceId: string
    payerEmail: string
    discountCode?: string
    discountPercent?: number
}

export interface SendReceiptResponse {
    success: boolean
}

export async function sendReceipt(data: SendReceiptRequest): Promise<SendReceiptResponse> {
    const resp = await apiClient.post<SendReceiptResponse>('/api/sendReceipt', data)
    return resp.data
}
