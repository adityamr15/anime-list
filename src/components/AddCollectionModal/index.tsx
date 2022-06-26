import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context, dispatch } from "../../recontext";
import Modal from "../Modal";
import cl from "../../class/collections";

export default function AddCollectionModal(props: any) {
  const { collections, selection } = useContext(Context);
  const [inputName, setInputName] = useState('');
  const navigate = useNavigate();
  const { onClose, hideSelected } = props;
  const nameExist = !!cl.findCollectionByName(inputName);
  const [errorMessage, setErrorMessage] = useState('');

  const ids = Object.keys(collections || {});

  const onSelectCollection = (collectionId: string) => {
    if (!selection?.length) {
      navigate(`/collections/${collectionId}`)
    } else {
      dispatch('ADD_TO_COLLECTION', { id: collectionId, animeId: selection });
    }
    onClose && onClose();
  }

  const onCreateNew = () => {
    const isContainSpecialCharacters = /`|\\|\^|~|'|"/g.test(inputName);
    if (nameExist) {
      setErrorMessage(`Collection ${inputName} already exist`);
    } else {
      setErrorMessage(isContainSpecialCharacters 
          ? 'Special characters not allowed' 
          : '');
    }

    if (!!inputName && !nameExist && !isContainSpecialCharacters) {
      dispatch('CREATE_COLLECTION', inputName);
      setInputName('');
    }
  }

  return (
    <Modal {...props} title="Add Collection">
      <div className="row">
        <div className="col-xs-12">
          <div className={"form-group " + (!!errorMessage ? "has-error" : "")} style={{ borderBottom: 0 }}>
            <div className="input-group">
              <input value={inputName} placeholder="Collection Name" className="form-control" onChange={(e) => setInputName(e.target.value)} />
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={onCreateNew} type="button">Create!</button>
              </span>
            </div>
            <span className="help-block">{errorMessage}</span>
          </div>
        </div>
        <div className="col-xs-12" style={{ paddingTop: '20px' }}>
          {
            (!hideSelected && selection.length > 0) && (
              <>
                <strong>Current Selected: {selection.length}</strong>
                <p style={{ marginTop: '20px' }}>Please select to your collection(s) below:</p>
              </>
            )
          }
          {
            (!!hideSelected || !selection?.length) && (<p>Your collection list:</p>)
          }
          <div className="list-group">
            {
              ids.map((id, index) => <button key={index} type="button" onClick={() => onSelectCollection(id)} className="list-group-item">{collections[id].name}</button>)
            }
          </div>
        </div>
      </div>
    </Modal>
  );
}