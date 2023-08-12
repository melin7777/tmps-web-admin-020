'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, IconButton, MenuItem, TextField } from "@mui/material";
import { Add, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';

const View = ({params}) => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const [editId, setEditId] = useState("");
  const [editStatus, setEditStatus] = useState({id: 'active', description: "Active"});
  const [editStatusError, setEditStatusError] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editCodeError, setEditCodeError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Category");
      setFormSubHeading("Create a new category");
    }
    else{
      setFormHeading("Edit Category");
      setFormSubHeading("Edit an existing category");
      loadItem(params.id);
    }
  }, []);
  
  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/categories/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      var status = "";
      if(val.status==="active"){
        status = "Active";
      }
      else if(val.status==="inactive"){
        status = "Inactive";
      }
      setEditStatus({id: val.status, description: status});
      setEditCode(val.code);
      setEditDescription(val.description);
    }
    catch(error){
      toast.error("Find Item Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsLoading(false);
    }
  }
  
  const newItemClicked = () => {
    clearErrors();
    clearFields();
    setFormHeading("Create Category");
    setFormSubHeading("Create a new category");
  }
  
  const clearErrors = () => {
    setEditStatusError(false);
    setEditCodeError(false);
    setEditDescriptionError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId('');
    setEditStatus({id: 'active', description: 'Active'});
    setEditCode('');
    setEditDescription('');
  };

  const saveClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
      if (editCode.length>32) {
        error = true;
        setEditCodeError(true);
      }
      if (editDescription.length>128) {
        error = true;
        setEditDescriptionError(true);
      }
      if(!error){
        var apiDes = "";
        if(editId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/categories/${apiDes}`, {
          id: parseInt(editId),
          status: editStatus.id,
          code: editCode,
          description: editDescription,
        });
        if(editId===""){
          setEditId(response.data.data.id);
        }
      }
    }
    catch(error){
      toast.error("Item Create Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  }

  return (
    <div className='form_container' style={{minHeight: (height-80)}}>
      <div className='form_container_medium' style={{minHeight: (height-80)}}>
        <div className='header_container'>
          <div className='header_container_left'>
            <IconButton onClick={()=>router.push('/categories')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#71717a"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
            <div className='header_container_left_text'>
              <span className="form_header">{formHeading}</span>
              <span className="form_sub_header">{formSubHeading}</span>
            </div>
          </div>
          <div className='header_container_right'>
            <Button 
              variant='outlined' 
              disabled={isLoading||isSaving} 
              style={{textTransform: 'none'}} 
              startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Add />}
              onClick={()=>newItemClicked()}
              size='small'
            >Create</Button>
            <Button 
              variant='contained' 
              disabled={isLoading||isSaving} 
              style={{textTransform: 'none'}} 
              startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Save />}
              onClick={()=>saveClicked()}
              size='small'
            >Save</Button>
          </div>
        </div>
        <div className='form_fields_container_search mt-4'>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField 
                id='id'
                label="ID" 
                variant="outlined" 
                className='form_text_field' 
                value={editId} 
                disabled={true}
                size='small' 
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='status'
                value={editStatus.id}
                label="Status"
                onChange={event=>setEditStatus(event.target.value)} 
                variant={"outlined"}
                select={true}
                disabled={isLoading}
                size='small'
                onFocus={()=>setEditStatusError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
              </TextField>
              {editStatusError && <span className='form_error_floating'>Invalid Status</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>              
              <TextField 
                id='code'
                label="Code" 
                variant="outlined" 
                className='form_text_field' 
                value={editCode} 
                error={editCodeError}
                onChange={event=>setEditCode(event.target.value)}
                disabled={isLoading||isSaving}
                size='small' 
                onFocus={()=>setEditCodeError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editCodeError && <span className='form_error_floating'>Invalid Code</span>}
            </div>
            <div className='form_field_container'></div>
          </div>
          <div className='form_row_single'>
            <div className='form_field_container_full'>
              <TextField 
                id='description'
                label="Description" 
                variant="outlined" 
                className='form_text_field' 
                value={editDescription} 
                error={editDescriptionError}
                onChange={event=>setEditDescription(event.target.value)}
                disabled={isLoading||isSaving}
                size='small' 
                onFocus={()=>setEditDescriptionError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editDescriptionError && <span className='form_error_floating'>Invalid Description</span>}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;