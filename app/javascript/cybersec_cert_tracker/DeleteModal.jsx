import React from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Button } from "reactstrap";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const buttonContainer = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
};

function DeleteModal({ open, setOpen, deleteItem, id }) {
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    Are you sure you want to delete?
                    <div style={buttonContainer}>
                        <Button
                            color="success"
                            onClick={() => {
                                setOpen(false);
                                deleteItem(id);
                            }}
                            id="confirm_delete"
                        >
                            Yes
                        </Button>
                        <Button
                            color="danger"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            No
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default DeleteModal;