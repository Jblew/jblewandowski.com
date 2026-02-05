export interface Product {
    id: string
    name: string
    pricePln: number
}

export const products: Product[] = [
    { id: "returning_continuation_prescription", name: "Recepta przez formularz", pricePln: 15 },
    { id: "returning_continuation_phone", name: "Telefon 15 min", pricePln: 40 },
    { id: "returning_continuation_video", name: "Wideo 15 min", pricePln: 40 },
    { id: "returning_continuation_home_visit", name: "Wizyta domowa 30 min", pricePln: 175 },
    { id: "returning_new_problem_video", name: "Wideo 30 min", pricePln: 80 },
    { id: "returning_new_problem_home_visit", name: "Wizyta domowa 30 min", pricePln: 200 },
    { id: "new_patient_full_teleconsult_video", name: "Teleporada 1h video", pricePln: 120 },
    { id: "new_patient_full_home_visit", name: "Wizyta domowa 1h15min", pricePln: 250 },
    { id: "new_patient_single_teleconsult_video", name: "Teleporada wideo 30 min", pricePln: 80 },
    { id: "new_patient_single_home_visit", name: "Wizyta domowa 45 min", pricePln: 200 },
]

const productMap = new Map(products.map(p => [p.id, p]))

export function getProduct(id: string): Product | undefined {
    return productMap.get(id)
}
