/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPaginatedPhotoList
// ====================================================

export interface GetPaginatedPhotoList_photoList_photos {
  __typename: "Photo";
  id: string;
  filename: string;
  mimetype: string;
  url: string;
  caption: string | null;
  albumId: string | null;
}

export interface GetPaginatedPhotoList_photoList {
  __typename: "PhotoConnection";
  cursor: string;
  photos: (GetPaginatedPhotoList_photoList_photos | null)[];
}

export interface GetPaginatedPhotoList {
  photoList: GetPaginatedPhotoList_photoList;
}

export interface GetPaginatedPhotoListVariables {
  pageSize?: number | null;
  after?: string | null;
  albumId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  favorite?: boolean | null;
}
