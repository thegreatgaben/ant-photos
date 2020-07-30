/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPhotoAlbumList
// ====================================================

export interface GetPhotoAlbumList_photoAlbumList_albums {
  __typename: "PhotoAlbum";
  id: string;
  name: string;
}

export interface GetPhotoAlbumList_photoAlbumList {
  __typename: "PhotoAlbumConnection";
  albums: (GetPhotoAlbumList_photoAlbumList_albums | null)[];
}

export interface GetPhotoAlbumList {
  photoAlbumList: GetPhotoAlbumList_photoAlbumList;
}
