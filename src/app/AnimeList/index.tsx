import { gql, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import AddCollectionModal from "../../components/AddCollectionModal";

import Pagination from "../../components/Pagination";
import Thumbnail from "../../components/Thumbnail";
import { Context } from "../../recontext";
import './index.css';

const LIST_ANIME = gql`
    query ($page: Int, $perPage: Int) {
        Page(page:$page, perPage:$perPage) {
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
            media {
                seasonYear
                title {
                    english
                    native
                }
                id
                status
                coverImage {
                    large
                }
                bannerImage
            }
        }
    }
`;

export default function AnimeList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selection } = useContext(Context);
  const [isVisible, setVisible] = useState(false);
  const queryVariables = (page = 1, perPage = 10) => ({
    page,
    perPage
  });
  const {
    data,
    fetchMore,
    loading
  } = useQuery(LIST_ANIME, { variables: queryVariables(), fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true });

  const onPageChange = (page: number) => {
    fetchMore({ variables: queryVariables(page) });
  }

  const addToCollection = () => {
    setVisible(true);
  }

  if (loading) return null;

  return (
    <div className="container">
      <div className="row">
        {(data.Page.media as any[]).map((data, id) => {
          return (
            <div key={id} className="col-md-3">
              <Thumbnail {...data} selectable/>
            </div>
          )
        })}
      </div>
      
      <div className="row">
        <div className="col-xs-12">
          <Pagination onPageChange={onPageChange} pageInfo={data.Page.pageInfo} />
        </div>
      </div>

      <AddCollectionModal isVisible={isVisible} onClose={() => setVisible(false)} onSubmit={() => setVisible(false)} />
      <button type="button" className="bubble btn btn-primary" onClick={addToCollection}>
        Add
      </button>
    </div>
  );
}
