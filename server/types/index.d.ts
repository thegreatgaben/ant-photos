export interface RequestQuery {
    search?: string;
    pageSize?: number;
    after?: string;
    startDate?: string;
    endDate?: string;
}

export interface PaginationResponse {
    cursor: string;
    paginatedList: any[];
}

