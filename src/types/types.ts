export interface StandardApi {
    success: boolean
    message: string
}

export interface Analytics {
    id: string
    country: string | null
    countryIsoCode: string | null
    continent: string | null
    continentCode: string | null
    userAgent: string | null
    referrer: string | null
    timestamp: Date | null
    screenWidth: number | null
    browser: string | null
    os: string | null
    createdAt: Date
    updatedAt: Date
}

export interface AnalyticPage {
    id: string
    page: string
    rank: number
    timeSpent: number
    analyticId: string | null
    createdAt: Date
    updatedAt: Date
}