export default function Modal(props: any) {
  const { children, title, isVisible, onSubmit, onClose } = props;

  return (
    <div className="bs-example bs-example-modal">
      <div className="modal fade in" role="dialog" style={{ display: isVisible ? "block" : "none", backgroundColor: "#0000009e"}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" onClick={() => onClose && onClose()} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => onClose && onClose()} className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" onClick={() => onSubmit && onSubmit()} className="btn btn-primary">Ok</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ConfirmModal = (props: any) => {
  const { children , onSubmit, onCancel} = props;

  const _onSubmit = () => {
    return onSubmit(true);
  }

  const _onCancel = async () => {
    return onCancel(false);
  }

  return (
    <Modal {...props} title="Confirm" onSubmit={_onSubmit} onCancel={_onCancel}>
      {children}
    </Modal>
  );
}