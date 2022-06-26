import { gql, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import collections from "../../class/collections";
import Modal, { ConfirmModal } from "../../components/Modal";
import Thumbnail from "../../components/Thumbnail";
import { Context, dispatch } from "../../recontext";
import './index.css';

export const ANIME_DETAIL = gql`
    query GetAnimeDetail ($id: Int) {
      Media(id: $id) {
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
`;

const Item = function (props: any) {
  const { id, onDelete } = props;
  const { data, loading } = useQuery(ANIME_DETAIL, { variables: { id } });
  const [isVisible, setVisibile] = useState(false);

  const onDeleteConfirm = async (isConfirm: boolean) => {
    if (isConfirm) {
      onDelete && await onDelete(id);
    }

    setVisibile(false);
  }

  if (loading) return <div className="image-loading"></div>;

  return (
    <div className="anime-container">
      <span className="fa fa-trash" onClick={() => setVisibile(true)}></span>
      <Thumbnail {...data.Media} selectable />
      <ConfirmModal isVisible={isVisible} 
        onSubmit={onDeleteConfirm} 
        onClose={onDeleteConfirm}>
          Are you sure you want to delete <strong>{data.Media.title.english || data.Media.title.native}</strong>?
      </ConfirmModal>
    </div>
  );
}

export default function Collection(props: any) {
  const { collections, selection } = useContext(Context);
  const [isVisible, setVisibile] = useState(false);
  const { id = '' } = useParams();

  const onClose = () => {
    setVisibile(false);
  };

  const removeSelected = () => {
    for (const animeId of selection) {
      dispatch('REMOVE_FROM_COLLECTION', { animeId, collectionId: id });
    }

    dispatch('CLEAR_SELECTION', null);
  }

  const onDelete = async (animeId: string) => {
    dispatch('REMOVE_FROM_COLLECTION', { animeId, collectionId: id});
    return Promise.resolve(true);
  }

  const { data } = collections[id] || {};

  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-6">
          <h1 style={{ marginBottom: '20px' }}>{collections[id].name}</h1>
        </div>
        <div className="col-xs-6 text-right">
          <button onClick={() => setVisibile(true)} className="btn btn-primary">Edit</button>
          {
            selection.length > 0 &&
            <button
              onClick={removeSelected}
              className="btn btn-default"
              style={{ marginLeft: '10px' }}>Remove Selected</button>
          }
        </div>
      </div>
      <div className="row">
        {
          (data as any[]).map((item, index) => (
            <div key={index} className="col-md-3">
              <Item id={item} onDelete={onDelete}/>
            </div>
          ))
        }
        {
          !data?.length &&
          (<div className="text-center col-xs-12">
            <h3>No Data Found</h3>
          </div>)
        }
      </div>
      <RenameModal isVisible={isVisible} onClose={onClose} data={{ name: collections[id].name, id}} />
    </div>
  );
}

const RenameModal = (props: any) => {
  const { onClose, data: { name, id } } = props;
  const [inputName, setInputName] = useState(name || '');
  const [errorMessage, setErrorMessage] = useState('');

  const _onChange = (value: string) => {
    const regex = /`|\\|\^|~|'|"/g;
    const nameExists = collections.findCollectionByName(value);

    if (nameExists && value !== name) {
      setErrorMessage(`Collection ${value} already exists!`);
    }
    else {
      setErrorMessage(regex.test(value) ? 'Special characters not allowed' : '');
    }

    setInputName(value);
  }

  const _onSubmit = () => {
    if (!errorMessage) {
      if (!!inputName) {
        dispatch('RENAME_COLLECTION', { name: inputName, id });
      }
      onClose && onClose();
    }
  }

  return (
    <Modal {...props} title="Rename Collection" onSubmit={() => _onSubmit()}>
      <div className="row">
        <div className="col-xs-12">
          <div className={"form-group "  + (!!errorMessage ? "has-error" : "")} style={{ borderBottom: 0 }}>
            <input value={inputName}
              placeholder="Collection Name"
              className="form-control"
              onChange={(e) => _onChange(e.target.value)} />
            <span className="help-block">{errorMessage}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}