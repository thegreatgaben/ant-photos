/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPaginatedPhotoAlbumList
// ====================================================

export interface GetPaginatedPhotoAlbumList_photoAlbumList_albums {
  __typename: "PhotoAlbum";
  id: string;
  name: string;
  description: string;
  coverPhotoUrl: string | null;
}

export interface GetPaginatedPhotoAlbumList_photoAlbumList {
  __typename: "PhotoAlbumConnection";
  cursor: string;
  albums: (GetPaginatedPhotoAlbumList_photoAlbumList_albums | null)[];
}

export interface GetPaginatedPhotoAlbumList {
  photoAlbumList: GetPaginatedPhotoAlbumList_photoAlbumList;
}

export interface GetPaginatedPhotoAlbumListVariables {
  pageSize?: number | null;
  after?: string | null;
  search?: string | null;
}
