import { Employee } from "./employee"

export interface Page {
        content: Employee[],
        pageable: {
            sort: {
                empty: boolean,
                sorted: boolean,
                unsorted: boolean
            },
            offset: number,
            pageNumber: number,
            pageSize: number,
            paged: boolean,
            unpaged: boolean
        },
        last: boolean,
        totalElements: number,
        totalPages: number,
        size: number,
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean
        },
        numberOfElements: number,
        first: boolean,
        number: number,
        empty: boolean
}
