import React, { useEffect, useState } from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";
import { Label, Input, Button} from 'reactstrap';
import Modal from 'react-modal'
// import Moda from "./Moda";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function submit_form() {
  document.formu1.reset(); 
  }

function Dashboard({userData}) {
  const [tableData, setTableData] = useState([]);
  const handleShow = () => setShow(true);
  // const[isOpen, setIsOpen] = useState(false)
  const[modelIsOpen, setModalIsOpen] = useState(false)

  const handleChange = (event) => {
    setMyCar(event.target.value)
  }

  const BUTTON_WRAPPER_STYLES = {
    position: 'relative',
    zIndex: 1
  }

  const OTHER_CONTENT_STYLES = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'red',
    padding: '10px'
  }
  
  useEffect(() => {
    axios.get('/records.json', { headers: {"Authorization" : `Bearer ${userData.token}`}})
      .then((res) => {
        const { records } = res.data;
        console.log(records);
        setTableData(records);
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  const fileUpload = async (event) => {
    let csrf;

    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    const formData = new FormData();
    
    Object.entries(event.target.files).forEach( ([key, file]) => {
      formData.append('file_name', file.name);
      formData.append('body', file);
      formData.append('user_id', 1);
    })
    
    try {
      await axios({
        method: "POST",
        url: "/csv_files.json",
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

  return <>
  <ToastContainer/>
  <Label for="exampleCustomFileBrowser">Upload CSV</Label>
  <Input type="file" id="exampleCustomFileBrowser" name="csvFile" accept=".csv" multiple onChange={fileUpload}/>

  <div>
    <button onClick={() => setModalIsOpen(true)}> 
      Add Student Information
    </button>
    <Modal 
      isOpen = {modelIsOpen} 
      shouldCloseOnOverlayClick = {false}
      onRequestClose={() => setModalIsOpen(false)}>
      <h2>
        Student Details
      </h2>
      <form class = "form-inline">
        <div class="form-row align-items-center">
          <div class="col-sm-3 my-1">
            <label class="sr-only" for="inlineFormInputName">Name</label>
            First Name: <input type="text" class="form-control" id="inlineFormInputName" placeholder="First Name"></input>
          </div>
          <div class="col-sm-3 my-1">
            <label class="sr-only" for="inlineFormInputGroupUsername">Username</label>
            <div class="input-group">
              <input type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Last Name"></input>
            </div>
          </div>
          <div class="col-sm-3 my-1">
            <label class="sr-only" for="inlineFormInputName">Name</label>
            <input type="text" class="form-control" id="inlineFormInputName" placeholder="Certificate Name"></input>
          </div>
          <div class="col-sm-3 my-1">
            <label class="sr-only" for="inlineFormInputGroupUsername">Username</label>
            <div class="input-group">
              <input type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Email Address"></input>
            </div>
          </div>
          <div class="col-sm-3 my-1">
            <label class="sr-only" for="inlineFormInputName">Name</label>
            <input type="text" class="form-control" id="inlineFormInputName" placeholder="Company Name"></input>
          </div>
          <div class="col-sm-3 my-1">
            <label class="sr-only" for="inlineFormInputGroupUsername">Username</label>
            <div class="input-group">
              <input type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Registration Date"></input>
            </div>
          </div>
          <div class="modal-footer">
            <button type="cancel" onClick = {() => setModalIsOpen(false)} class="btn btn-primary mb-2" data-dismiss="modal">Cancel</button> 
            {/* <button type="cancel" onClick = "submit_form()" >Cancel</button>  */}
            <button type="submit" class="btn btn-primary mb-2">Submit</button>
          </div>
        </div>
      </form>
    </Modal>
  </div>

  <DashboardTable data={tableData} />
  </>;
}

export default Dashboard; 

