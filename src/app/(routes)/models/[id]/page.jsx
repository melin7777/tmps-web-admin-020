'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, Dialog, FormControlLabel, IconButton, MenuItem, Radio, TextField } from "@mui/material";
import { Add, ArrowDropDown, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import BrandsBrowser from '@/components/browsers/BrandsBrowser';

const View = ({params}) => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");

  const [editId, setEditId] = useState("");
  const [editStatus, setEditStatus] = useState('active');
  const [editStatusError, setEditStatusError] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editCodeError, setEditCodeError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);
  const [editBrand, setEditBrand] = useState({id: 0, description: "Please Select"});
  const [editBrandError, setEditBrandError] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [editShowOnFilters, setEditShowOnFilters] = useState("no");
  const [editShowOnFiltersError, setEditShowOnFiltersError] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Model");
      setFormSubHeading("Create a new model");
    }
    else{
      setFormHeading("Edit Model");
      setFormSubHeading("Edit an existing model");
      loadItem(params.id);
    }
  }, []);
  
  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/models/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditStatus(val.status);
      setEditCode(val.code);
      setEditDescription(val.description);
      setEditBrand({id: val.brand_id, description: val.brand.description});
      setEditShowOnFilters(val.show_on_filters);
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
    setFormHeading("Create Model");
    setFormSubHeading("Create a new model");
  }
  
  const clearErrors = () => {
    setEditStatusError(false);
    setEditCodeError(false);
    setEditDescriptionError(false);
    setEditBrandError(false);
    setEditShowOnFiltersError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId('');
    setEditStatus('active');
    setEditCode('');
    setEditDescription('');
    setEditShowOnFilters("no");
    setEditBrand({id: 0, description: "Please Select"});
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
      if (editBrand.id===0) {
        error = true;
        setEditBrandError(true);
      }
      if(!error){
        var apiDes = "";
        if(editId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/models/${apiDes}`, {
          id: parseInt(editId),
          status: editStatus,
          code: editCode,
          description: editDescription,
          brandId: editBrand.id,
          show_on_filters: editShowOnFilters,
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
            <IconButton onClick={()=>router.push('/models')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#71717a"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
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
                value={editStatus}
                label="Status"
                onChange={event=>setEditStatus(event.target.value)} 
                variant={"outlined"}
                select={true}
                disabled={isLoading||isSaving}
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
            <div className='form_field_container'>              
              <div className='form_text_field_constructed'>
                <span className='form_text_field_constructed_label'>Brand</span>
                <span className='form_text_field_constructed_text' onClick={()=>setOpenBrand(true)}>{editBrand.description}</span>
                <div className='form_text_field_constructed_actions_1'>
                  <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={()=>setOpenBrand(true)}/>
                </div>
              </div>
              {editBrandError && <span className='form_error_floating'>Invalid Brand</span>}
            </div>
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
          <div className='form_row_double'>
            <div className='form_field_container'>
              <div className='form_text_field_constructed'>
                <span className='form_text_field_constructed_label'>Show On Filters</span>
                <div className='w-full flex flex-row justify-end items-center'>
                  <FormControlLabel sx={{fontSize: 12}} value="yes" checked={editShowOnFilters==="yes"} onChange={(e)=>setEditShowOnFilters(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                  <FormControlLabel value="no" checked={editShowOnFilters==="no"} onChange={(e)=>setEditShowOnFilters(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                </div>
                {editShowOnFiltersError && <span className='form_error_floating'>Invalid Show On Filters</span>}
              </div>
            </div>
            <div className='form_field_container'></div>
          </div>
        </div>
        <Dialog open={openBrand} onClose={()=>setOpenBrand(false)} scroll='paper'>
          <BrandsBrowser {...{setOpen: setOpenBrand, value: editBrand, setValue: setEditBrand}}/>
        </Dialog>
        <ToastContainer />
      </div>
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;