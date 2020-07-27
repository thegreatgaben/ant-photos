export interface RequestQuery {
    search?: string;
    pageSize?: number;
    after?: string;
}

export interface PaginationResponse {
    cursor: string;
    paginatedList: any[];
}

