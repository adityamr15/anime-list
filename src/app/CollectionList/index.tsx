import { useQuery } from "@apollo/client";
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/Modal";
import Thumbnail from "../../components/Thumbnail";
import { Context, dispatch } from "../../recontext"
import { ANIME_DETAIL } from "../Collection";

export default function CollectionList() {
  const { collections } = useContext(Context);
  const names = Object.keys(collections);

  const confirmDelete = (collectionId: string) => {
    dispatch('DELETE_COLLECTION', collectionId);
  }

  return (
    <>
      <div className="container">
        <div className="row">
          {names.map((id, idx) => (
            <div key={idx} className="col-md-3" style={{ cursor: 'pointer' }}>
              <Item id={id} animeData={collections[id].data} name={collections[id].name} onDelete={confirmDelete}/>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const Item = (props: any) => {
  const { onDelete } = props;
  const [isVisible, setVisibile] = useState(false);
  const navigate = useNavigate();
  const { data } = useQuery(ANIME_DETAIL, { variables: { id: props.animeData[0] } });
  const defaultData = {
    coverImage: {
      large: 'https://previews.123rf.com/images/apoev/apoev1709/apoev170900088/85467744-default-avatar-anime-girl-profile-icon-grey-photo-manga-placeholder.jpg'
    }
  };

  const onDeleteConfirm = (isConfirm: boolean) => {
    if (isConfirm) {
      onDelete && onDelete(props.id);
    }

    setVisibile(false);
  }

  return (
    <div className="anime-container">
      <span className="fa fa-trash" onClick={() => setVisibile(true)}></span>
      <Thumbnail {...data?.Media || defaultData} onClick={() => navigate('/collections/' + props.id)} title={{ english: props.name }} seasonYear={props.animeData.length}/>
      <ConfirmModal isVisible={isVisible} 
        onSubmit={onDeleteConfirm} 
        onClose={onDeleteConfirm}>
          Are you sure you want to delete <strong>{props.name}</strong>?
      </ConfirmModal>
    </div>
  );
}