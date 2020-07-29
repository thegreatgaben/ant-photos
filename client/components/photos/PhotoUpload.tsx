import { useCallback } from 'react';
import { useDropzone } from "react-dropzone";
import { useMutation } from '@apollo/react-hooks';
import { InboxOutlined } from '@ant-design/icons';
import gql from 'graphql-tag';

import style from './PhotoUpload.module.scss';

interface PhotoUploadProps {
    onUploadFinish: (status: boolean, response: any) => void;
    // TODO: Type this
    fetchQueries: {query: any, variables: any}[];
    extraVariables?: Object;
}

const uploadPhotosMutation = gql`
  mutation UploadPhotos($files: [Upload]!, $albumId: ID) {
      uploadPhotos(files: $files, albumId: $albumId) {
          filename
          uploaded
      }
  }
`;

export default function PhotoUpload({ onUploadFinish, fetchQueries, extraVariables = {} }: PhotoUploadProps) {
    const [uploadPhotos] = useMutation(uploadPhotosMutation, {
        refetchQueries: fetchQueries,
        onCompleted: (data) => onUploadFinish(true, data),
        onError: () => onUploadFinish(false, null),
    });

    const onDrop = useCallback(
        (photos) => {
            uploadPhotos({ variables: { ...extraVariables, files: photos } });
        },
        [uploadPhotos]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div className={style.uploadContainer} {...getRootProps()}>
                <input {...getInputProps()} />
                <InboxOutlined/>
                {isDragActive ? (
                    <p>Drop the photos here ...</p>
                ) : (
                    <p>Drag 'n' drop some photos here, or click to select photos</p>
                )}
            </div>
        </>
    );
}
