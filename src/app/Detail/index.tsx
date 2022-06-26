import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import collections from "../../class/collections";
import AddCollectionModal from "../../components/AddCollectionModal";
import { dispatch } from "../../recontext";
import './index.css';

const GET_ANIME_DETAIL = gql`
  query GetAnimeDetail ($id: Int) {
    Media(id: $id) {
      id
      title {
        userPreferred
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      description
      season
      seasonYear
      status(version: 2)
      characterPreview: characters(perPage: 12, sort: [ROLE, RELEVANCE, ID]) {
        edges {
          node {
            id
            name {
              userPreferred
            }
            image {
              large
            }
          }
        }
      }
    }
  }
`;

export default function Detail(props: any) {
  const { id } = useParams();
  const [isVisible, setVisible] = useState(false);
  const { data, loading } = useQuery(GET_ANIME_DETAIL, { variables: { id } });
  const anime = data?.Media;
  const collectionAdd = collections.hasBeenAdded(id as any);

  const onClose = () => {
    setVisible(false);
  }

  const onAddCollection = () => {
    dispatch('SELECT_ANIME', id);
    setVisible(true);
  }

  if (loading || !anime) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <div className="banner" style={{ backgroundImage: `url(${anime.bannerImage || anime.coverImage.extraLarge})` }}>
            <div className="banner-title">
              <h1>{anime.title.userPreferred}</h1>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <img src={anime.coverImage.extraLarge} alt="" style={{ width: '100%' }} />
          <div className="col-xs-12">
            <div className="form-horizontal">
              <div className="form-group" style={{ paddingBottom: '15px', paddingTop: '15px' }}>
                <button className="btn btn-primary btn-block" onClick={onAddCollection}>Add To Collection</button>
              </div>
              <CollectionLink collections={collectionAdd}/>
              <div className="form-group">
                <label className="control-label">Start Date</label>
                <p className="form-control-static">{anime.startDate.day}/{anime.startDate.month}/{anime.startDate.year}</p>
              </div>
              {
                !!anime.endDate?.day && (<div className="form-group">
                  <label className="control-label">End Date</label>
                  <p className="form-control-static">{anime.endDate.day}/{anime.endDate.month}/{anime.endDate.year}</p>
                </div>)
              }
              <div className="form-group">
                <label className="control-label">Season Year</label>
                <p className="form-control-static">{anime.seasonYear}</p>
              </div>
              <div className="form-group">
                <label className="control-label">Season</label>
                <p className="form-control-static">{anime.season}</p>
              </div>
              <div className="form-group">
                <label className="control-label">Status</label>
                <p className="form-control-static">{anime.status}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <h3>Storyline</h3>
          <p dangerouslySetInnerHTML={{ __html: anime.description }} />

          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Characters</h3>
            </div>
            <div className="panel-body">
              <div className="grid-view">
                {
                  (anime.characterPreview.edges as any[]).map((char, index) => <Characters {...char.node} key={index} />)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCollectionModal isVisible={isVisible} onClose={onClose} onSubmit={onClose} hideSelected />
    </div>
  );
}

const CollectionLink = (props: any) => {
  const { collections } = props;

  if (!collections?.length) return null;

  return (
    <div className="form-group">
      <label className="control-label">Collection</label>
      <p className="form-control-static">
        {
          (collections as any[]).map(({name, id}, index) => (
            <Link key={index} to={`/collections/${id}`}>{index === 0 ? name : ', ' + name}</Link>
          ))
        }
      </p>
    </div>
  );
}

const Characters = (props: any) => {
  const { image, name } = props;
  return (
    <div className="char-grid">
      <img src={image.large} alt={name.userPreferred} className="char-image" />
      <span>{name.userPreferred}</span>
    </div>
  );
}