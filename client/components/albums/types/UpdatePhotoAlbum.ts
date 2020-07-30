/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePhotoAlbum
// ====================================================

export interface UpdatePhotoAlbum_updatePhotoAlbum {
  __typename: "PhotoAlbum";
  id: string;
  name: string;
  description: string;
}

export interface UpdatePhotoAlbum {
  updatePhotoAlbum: UpdatePhotoAlbum_updatePhotoAlbum | null;
}

export interface UpdatePhotoAlbumVariables {
  id: string;
  name: string;
  description: string;
}
