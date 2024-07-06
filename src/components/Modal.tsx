import React, { ChangeEvent, useState } from 'react';
import { Task } from '../data';
import Loader from './Loader';

interface ModalTypes {
  editText: Task;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  contentErr: boolean;
  onCancel: () => void;
  onSubmit: (s: React.Dispatch<React.SetStateAction<boolean>>) => void;
}

const Modal: React.FC<ModalTypes> = ({editText, onChange, contentErr, onCancel, onSubmit}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="edit-form modal">
      <div className="modal-content">
        <div className="input-group align-start">
          <label>Title</label>
          <input
            className="edit-input disp-block"
            placeholder="Title"
            name="content"
            value={editText.content ?? ""}
            type="text"
            onChange={onChange}
          />
          {contentErr &&
            <span className="err-section">Title is required field</span>}
        </div>
        <div className="input-group align-start">
          <label>Photo Url</label>
          <input
            className="edit-input disp-block"
            placeholder="Photo Url"
            name="photo"
            value={editText.photo ?? ""}
            type="text"
            onChange={onChange}
          />
        </div>
        <div className='disp-flex align-center justify-center'>
          <button 
            className="background-red" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="background-sblue" 
            onClick={() => onSubmit(setIsLoading)}
            disabled={isLoading}
          >
              {isLoading ? <Loader /> : "Submit"}
            </button>
        </div>
      </div>
    </div>
  )
}

export default Modal