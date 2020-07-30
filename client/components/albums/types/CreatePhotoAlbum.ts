/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePhotoAlbum
// ====================================================

export interface CreatePhotoAlbum_createPhotoAlbum {
  __typename: "PhotoAlbum";
  id: string;
  name: string;
  description: string;
}

export interface CreatePhotoAlbum {
  createPhotoAlbum: CreatePhotoAlbum_createPhotoAlbum | null;
}

export interface CreatePhotoAlbumVariables {
  name: string;
  description: string;
}
