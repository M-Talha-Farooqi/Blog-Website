import React from "react";
import Modal from "react-modal";
import PostEditor from "./PostEditor"; // Import the original PostEditor

Modal.setAppElement("#root");

const PostEditDialog = ({ isOpen, onRequestClose, post, onSave }) => {
  const handleSave = async (updatedPost) => {
    await onSave(updatedPost);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Post"
      className="modal"
      overlayClassName="overlay"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <PostEditor post={post} onSave={handleSave} />
      <button
        onClick={onRequestClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Cancel
      </button>
    </Modal>
  );
};

export default PostEditDialog;
