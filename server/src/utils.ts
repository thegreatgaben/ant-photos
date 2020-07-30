import { Op as SQL } from 'sequelize'; 
import { RequestQuery, PaginationResponse } from '../types/index.d';
import {FileUpload} from 'graphql-upload';
import crypto from 'crypto';
import path from 'path';
import { createWriteStream, statSync } from 'fs';

export async function getAllWithPagination(
    // TODO: Type the models
    model: any,
    options: {[key: string]: any}, 
    query: RequestQuery,
    defaultPageSize = 10
): Promise<PaginationResponse> {

    // TODO: Validate params
    let { pageSize, after } = query;
    if (!pageSize) pageSize = defaultPageSize;

    // An additional result to get the 'next' cursor
    options.limit = pageSize + 1;
    if (after) {
        let operator = SQL.gte;
        if (options.order) {
            const index = options.order.findIndex(sortColumn => sortColumn[0] == 'id');
            if (index > -1 && options.order[index][1] == 'DESC') {
                operator = SQL.lte;
            }
        }
        options.where = { ...options.where, id: {[operator]: after} }
    }
    const resultList: Array<any> = await model.findAll(options)

    // Last page
    if (resultList.length <= pageSize) {
        return  {
            cursor: '',
            paginatedList: resultList,
        }
    } else {
        const results = resultList.slice(0, resultList.length-1);
        return {
            cursor: resultList[resultList.length-1].id,
            paginatedList: results,
        }
    }
}

export async function handleFileUpload(
    upload: Promise<FileUpload>,
    apolloServerContext,
    albumId
) {
    const { uploadPath, serverBaseUrl } = apolloServerContext;
    const { createReadStream, filename, mimetype } = await upload; 

    const origFilename = filename;
    const fileExt = origFilename.split('.')[1];
    const newFilename = `${crypto.randomBytes(20).toString('hex')}.${fileExt}`;

    const filePath = {
        relative: path.join(uploadPath.relative, newFilename),
        absolute: path.join(uploadPath.absolute, newFilename),
    }
    const index = filePath.relative.indexOf('/');
    const urlPath = filePath.relative.substr(index);

    return new Promise((resolve, reject) => 
        createReadStream()
        .pipe(createWriteStream(filePath.absolute))
        .on('close', () => resolve({ 
            origFilename: origFilename,
            fileStats: {
                mimetype,
                filename: newFilename, 
                filepath: filePath.relative,
                filesize: statSync(filePath.absolute).size,
                disk: 'local',
                url: serverBaseUrl + urlPath,
                albumId: albumId,
                isCoverPhoto: false,
            }
        }))
        .on('error', () => reject(new Error(origFilename)))
    );
}
