import { Op as SQL } from 'sequelize'; 
import { RequestQuery, PaginationResponse } from '../types/index.d';

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
        options.where = {id: {[operator]: after} }
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
