import { useCallback } from 'react';
import { useDropzone } from "react-dropzone";
import { useMutation } from '@apollo/react-hooks';
import { InboxOutlined } from '@ant-design/icons';
import gql from 'graphql-tag';

import style from './PhotoUpload.module.scss';
import {getPhotosQuery, defaultRequestQuery} from './PhotoList';

interface PhotoUploadProps {
    onUploadFinish: (status: boolean, response: any) => void;
}

const uploadPhotosMutation = gql`
  mutation UploadPhotos($files: [Upload]!) {
      uploadPhotos(files: $files) {
          filename
          uploaded
      }
  }
`;

export default function PhotoUpload({ onUploadFinish }: PhotoUploadProps) {
    const [uploadPhotos] = useMutation(uploadPhotosMutation, {
        refetchQueries: [{ query: getPhotosQuery, variables: defaultRequestQuery }],
        onCompleted: (data) => onUploadFinish(true, data),
    });
    const onDrop = useCallback(
        (photos) => {
            uploadPhotos({ variables: { files: photos } });
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
