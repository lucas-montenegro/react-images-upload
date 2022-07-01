/* eslint-disable prettier/prettier */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const baseURL = 'http://localhost:3000';

type ImageData = {
  'title': string;
  'description': string;
  'url': string;
  'ts': number;
  'id': string;
}

type ImagesResponse = {
  data: ImageData[];
  after: string | null;
}

// TODO AXIOS REQUEST WITH PARAM
async function fetchImagesWithPagination({ pageParam = null }): Promise<ImagesResponse> {
  const response = await api.get<ImagesResponse>(`${baseURL}/api/images`, { 
    params: {
      after: pageParam,
    }
  });

  const responseData = response.data;

  return responseData;
} 

function getNextPageParam(data: ImagesResponse): (string | undefined) {
  return data.after;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchImagesWithPagination, 
    {
      getNextPageParam
    }
    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    if (data === undefined) {
      return null;
    }

    return data.pages.map(page => {
      return page.data;
    }).flat();
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return (
      <Loading />
    )
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return (
      <Error />
    )
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        { hasNextPage === true 
          ? <Button 
              mt={10}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
            {
              isFetchingNextPage === false ? 'Carregar mais' : 'Carregando...'
            }
            </Button>// {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
          : ''
        }
      </Box>
    </>
  );
}
