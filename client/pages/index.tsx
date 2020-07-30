import {useState, useEffect} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {message, Button, Modal, DatePicker} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

import PhotoList from "../components/photos/PhotoList";
import PhotoUpload from '../components/photos/PhotoUpload';
import {defaultPhotosRequestQuery, getPhotosQuery} from '../components/utils';
import { useRouter } from 'next/router';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default function Home() {
    const router = useRouter();
    const { startDate, endDate } = router.query;

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [queryParams, setQueryParams] = useState(defaultPhotosRequestQuery);
    const [getPhotos, {called, loading, error, data, fetchMore}] = useLazyQuery(getPhotosQuery);

    useEffect(() => {
        const params = {...defaultPhotosRequestQuery, startDate, endDate};
        getPhotos({ variables: params });
        setQueryParams(params); 
    }, [router.query]);
    
    if (called && loading) return <div>Loading...</div>;
    if (called && error) return <div>There is an error!</div>;

    const fetchQueries = [{ query: getPhotosQuery, variables: defaultPhotosRequestQuery }];
    const photoListResponse = data ? data.photoList : { photos: [] }
    const handleFetchMore = () => {
        fetchMore({
            query: getPhotosQuery,
            variables: { ...queryParams, after: photoListResponse.cursor },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const previousPhotos = previousResult.photoList.photos;
                const newPhotos = fetchMoreResult.photoList.photos;
                fetchMoreResult.photoList.photos = [
                    ...previousPhotos,
                    ...newPhotos,
                ]
                return fetchMoreResult;
            }
        })
    }
    const handleDateFilter = (values) => {
        if (values) {
            const startDateParam = values[0].format('YYYY-MM-DD');
            const endDateParam = values[1].format('YYYY-MM-DD');
            router.push(`/?startDate=${startDateParam}&endDate=${endDateParam}`);
        } else {
            router.push('/');
        }
    }
    const disabledDates = (current) => {
        // Can not select days after today and today
        return current && current > moment().startOf('day');
    }

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <RangePicker 
                    className="mr-3" 
                    defaultValue={[startDate && moment(startDate), endDate && moment(endDate)]}
                    disabledDate={disabledDates}
                    onChange={handleDateFilter}
                />
                <Button icon={<UploadOutlined/>} type="primary" onClick={() => setShowUploadModal(true)}>
                    Upload
                </Button>
            </div>

            <Modal 
                title="Photos Upload"
                width={720} 
                visible={showUploadModal}
                onCancel={() => setShowUploadModal(false)} 
                footer={null}
            >                    
                <PhotoUpload fetchQueries={fetchQueries} onUploadFinish={(status, response) => {
                    // TODO: Type the response
                    if (status) {
                        let allUploadSuccess = true;
                        // Notify any uploads that failed
                        response.uploadPhotos.forEach(photo => {
                            if(!photo.uploaded) {
                                allUploadSuccess = false;
                                message.error(`${photo.filename} failed to upload`)
                            }
                        });
                        if (allUploadSuccess) message.success('Photos uploaded successfully')
                    }
                    else {
                        message.error('An error occured in the server.');
                    }
                    setShowUploadModal(false)
                }}/>
            </Modal>

            <PhotoList 
                photoListResponse={photoListResponse} 
                fetchQueries={fetchQueries} 
                fetchMore={handleFetchMore}
            />
        </>
    );
}
