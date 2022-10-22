import React from 'react';
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";
import { Label, Input, Button} from 'reactstrap';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const data = React.useMemo(() => makeData(100000), []);
  const fileUpload = async (event) => {
    let csrf;

    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    const formData = new FormData();
    
    Object.entries(event.target.files).forEach( ([key, file]) =>{
      formData.append(file.name, file);
    })
    
    try {
      await axios({
        method: "POST",
        url: "/uploaded_files/create",
        headers: {
          "Content-type" : "multipart/form-data",
          "X-CSRF-Token": csrf,
        },
        data: formData,
      });
      toast.success("Success!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  }
  return (<>
    <ToastContainer/>
    <Label for="exampleCustomFileBrowser">Upload CSV</Label>
    <Input type="file" id="exampleCustomFileBrowser" name="customFile" accept=".csv" multiple onChange={fileUpload}/>{' '}
    <Button onClick={() => setShow(true)}>Add Form</Button>
    <DashboardTable data={data} />
  
    {/* <Modal show={show}
    onHide={() => setShow(false)}
    dialogClassName="modal-90w"
    aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Custom Modal Styling
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Hello
        </p>
      </Modal.Body> 
    </Modal>  */}
    </>
    );  
  }
  export default Dashboard;



  
