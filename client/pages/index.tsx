import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

const Home = ({ launches })=> {
    console.log(launches);
    return (
        <div>This is Home.</div>
    );
}

const LaunchesQuery = () => {
    const { loading, error, data } = useQuery(GET_LAUNCHES);
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error!</div>

    return <Home launches={data.launches} />;
}

export default LaunchesQuery;
