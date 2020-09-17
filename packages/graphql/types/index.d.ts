import { FileUpload } from 'graphql-upload';

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

export interface UploadedFiles {
    files: Promise<FileUpload>[];
    albumId: string;
}

export interface PhotoMeta {
    origFilename: string;
    fileStats: {
        mimetype: string;
        filename: string;
        filepath: string;
        filesize: number;
        disk: string;
        url: string;
        albumId: number | null;
        isCoverPhoto: boolean;
    }
}
