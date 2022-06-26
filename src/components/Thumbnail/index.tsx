import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context, dispatch } from "../../recontext";

export default function Thumbnail(props: any) {
  const { selection } = useContext(Context);
  const { coverImage, id, seasonYear, title, selectable } = props;
  const navigate = useNavigate();
  const isSelected = selection.includes(id);

  const onClick = () => {
    const { onClick } = props;
    if (onClick) onClick();
    else navigate(`/anime/${id}`);
  }

  const toggleSelection = () => {
    dispatch('TOGGLE_SELECTION', id);
  };

  return (
    <div className="list-card">
      <div className="list-content" onClick={onClick}>
        <img src={coverImage.large} className="img img-responsive" alt={title} />
        <div className="list-title">{title.english || title.native}</div>
        <div className="list-year">{seasonYear}</div>
      </div>
      {
        !!selectable && (
          <div className="list-icons">
            <span onClick={toggleSelection} className={"fa " + (isSelected ? 'fa-check-square-o' : 'fa-square-o')}></span>
          </div>
        )
      }
    </div>
  );
}