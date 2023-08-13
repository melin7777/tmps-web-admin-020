'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, Dialog, IconButton, MenuItem, TextField } from "@mui/material";
import { Add, CameraAlt, CropRotate, Delete, Folder, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CropEasySlide from '@/components/crop/CropEasySlide';

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
  const [editStatus, setEditStatus] = useState("active");
  const [editStatusError, setEditStatusError] = useState(false);
  const [editSortIndex, setEditSortIndex] = useState("");
  const [editSortIndexError, setEditSortIndexError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);
  const [editHeading, setEditHeading] = useState("");
  const [editHeadingError, setEditHeadingError] = useState(false);
  const [editSubHeading, setEditSubHeading] = useState("");
  const [editSubHeadingError, setEditSubHeadingError] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editContentError, setEditContentError] = useState(false);
  const [editVPosition, setEditVPosition] = useState("start");
  const [editVPositionError, setEditVPositionError] = useState(false);
  const [editHPosition, setEditHPosition] = useState("end");
  const [editHPositionError, setEditHPositionError] = useState(false);

  const [editImage, setEditImage] = useState("none");
  const [editImageError, setEditImageError] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [file, setFile] = useState(null);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Slide");
      setFormSubHeading("Create a new slide");
    }
    else{
      setFormHeading("Edit Slide");
      setFormSubHeading("Edit an existing slide");
      loadItem(params.id);
    }
  }, []);
  
  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/slides/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditStatus(val.status);
      setEditSortIndex(val.sort_index);
      setEditDescription(val.description);
      setEditHeading(val.heading);
      setEditSubHeading(val.sub_heading);
      setEditContent(val.content);
      setEditVPosition(val.v_position);
      setEditHPosition(val.h_position);

      if(val.image_url==="none"){
        setEditImage("none");
      }
      else{
        setEditImage("https://tm-web.techmax.lk/"+val.image_url);
      }
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
    setFormHeading("Create Slide");
    setFormSubHeading("Create a new slide");
  }
  
  const clearErrors = () => {
    setEditStatusError(false);
    setEditSortIndexError(false);
    setEditDescriptionError(false);
    setEditHeadingError(false);
    setEditSubHeadingError(false);
    setEditContentError(false);
    setEditVPositionError(false);
    setEditHPositionError(false);
    setEditImageError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId('');
    setEditStatus("active");
    setEditSortIndex('');
    setEditDescription('');
    setEditHeading("");
    setEditSubHeading("");
    setEditContent("");
    setEditVPosition({id: 'start', description: "Start"});
    setEditHPosition({id: 'start', description: "Start"});
    setEditImage('none');
  };

  const saveClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
      if (editSortIndex.length>16) {
        error = true;
        setEditSortIndexError(true);
      }
      if (editDescription.length>128) {
        error = true;
        setEditDescriptionError(true);
      }
      if (editHeading.length>128) {
        error = true;
        setEditHeadingError(true);
      }
      if (editSubHeading.length>256) {
        error = true;
        setEditSubHeadingError(true);
      }
      if (editContent.length>1024) {
        error = true;
        setEditContentError(true);
      }
      if(!error){
        var apiDes = "";
        if(editId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/slides/${apiDes}`, {
          id: parseInt(editId),
          status: editStatus,
          sort_index: editSortIndex,
          description: editDescription,
          heading: editHeading,
          sub_heading: editSubHeading,
          content: editContent,
          v_position: editVPosition,
          h_position: editHPosition,
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

  const handleImageRemove = (event) => {
    setEditImage("none");
    setFile(null);
    deleteImage();
  }

  const deleteImage = async () => {
    if(editId!==""){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/slides/delete-image", {
          id: parseInt(editId),
        });
        setEditImage("none");
      }
      catch(error){
        toast.error("Image Delete Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const handleImageChange = (event) => {
    const file1 = event.target.files[0];
    if(file1){
      setFile(file1);
      setEditImage(URL.createObjectURL(file1));
      setOpenCrop(true);
    }
  }

  const selectSingleImage = (fileIn, url) => {
    if(editId!==""){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", ""+editId);
      formData.append('imageUrl', fileIn);
      axios({
        method: "post",
        url: "https://tm-web.techmax.lk/slides/edit-image",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        if (response.data.error) {
          setServerError(true);
          toast.error("Image Upload Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
          setIsSaving(false);
        } 
        else {
          setEditImage("https://tm-web.techmax.lk/"+response.data.data);
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
  }

  return (
    <div className='form_container' style={{minHeight: (height-80)}}>
      <div className='form_container_medium' style={{minHeight: (height-80)}}>
        <div className='header_container'>
          <div className='header_container_left'>
            <IconButton onClick={()=>router.push('/slides')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#71717a"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
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
          {editId!=="" &&
            <>
              <div className='form_row_single_left'>
                <span className="form_internal_header">Image</span>
              </div>
              <div className='form_row_single'>
                <div className='inventory_image_container'>
                  <div className='flex justify-center items-center w-[200px] xs:w-[300px] sm:w-[400px] h-[80px] xs:h-[120px] sm:h-[160px] relative'>
                    {editImage==="none" ? 
                      <CameraAlt sx={{width: 60, height: 60, color: '#cbd5e1'}}/> : 
                      <Image src={editImage} alt="slide image" fill sizes='(max-width: 640px) 400px, (max-width: 440px) 300px, 200px' priority={true} style={{objectFit: 'contain'}}/>
                    }
                    <input type='file' ref={imageRef} onChange={handleImageChange} className='file_input'/>
                  </div>
                  <div className='inventory_image_controls mt-2'>
                    <IconButton disabled={isLoading||isSaving} onClick={()=>imageRef.current.click()}><Folder sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                    {file && <IconButton disabled={isLoading||isSaving} onClick={()=>setOpenCrop(true)}><CropRotate sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>}
                    <IconButton disabled={isLoading||isSaving} onClick={(event)=>handleImageRemove(event)}><Delete sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                  </div>
                </div>
              </div>
            </>
          }
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
                id='sort-index'
                label="Index" 
                variant="outlined" 
                className='form_text_field' 
                value={editSortIndex} 
                error={editSortIndexError}
                onChange={event=>setEditSortIndex(event.target.value)}
                disabled={isLoading||isSaving}
                size='small' 
                onFocus={()=>setEditSortIndexError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
                sx={{textAlign: 'right'}}
              />
              {editSortIndexError && <span className='form_error_floating'>Invalid Index</span>}
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
          <div className='form_row_single'>
            <div className='form_field_container_full'>
              <TextField 
                id='heading'
                label="Heading" 
                variant="outlined" 
                className='form_text_field' 
                value={editHeading} 
                error={editHeadingError}
                onChange={event=>setEditHeading(event.target.value)}
                disabled={isSaving||isLoading}
                size='small' 
                onFocus={()=>setEditHeadingError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editHeadingError && <span className='form_error_floating'>Invalid Heading</span>}
            </div>
          </div>
          <div className='form_row_single'>
            <div className='form_field_container_full'>
              <TextField 
                id='sub-heading'
                label="SubHeading" 
                variant="outlined" 
                className='form_text_field' 
                value={editSubHeading} 
                error={editSubHeadingError}
                onChange={event=>setEditSubHeading(event.target.value)}
                disabled={isSaving||isLoading}
                size='small' 
                onFocus={()=>setEditSubHeadingError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editSubHeadingError && <span className='form_error_floating'>Invalid Sub Heading</span>}
            </div>
          </div>
          <div className='form_row_single'>
            <div className='form_field_container_full'>
              <TextField 
                id='content'
                label="Content" 
                variant="outlined" 
                className='form_text_field' 
                value={editContent} 
                error={editContentError}
                onChange={event=>setEditContent(event.target.value)}
                disabled={isSaving||isLoading}
                size='small' 
                multiline={true}
                rows={8}
                onFocus={()=>setEditContentError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editContentError && <span className='form_error_floating'>Invalid Content</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='v-position'
                value={editVPosition}
                label="V Position"
                onChange={event=>setEditVPosition(event.target.value)} 
                variant={"outlined"}
                select={true}
                disabled={isLoading||isSaving}
                size='small'
                onFocus={()=>setEditVPositionError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem value={"start"}>Start</MenuItem>
                <MenuItem value={"center"}>Center</MenuItem>
                <MenuItem value={"end"}>End</MenuItem>
              </TextField>
              {editVPositionError && <span className='form_error_floating'>Invalid V Position</span>}
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='h-position'
                value={editHPosition}
                label="H Position"
                onChange={event=>setEditHPosition(event.target.value)} 
                variant={"outlined"}
                select={true}
                disabled={isLoading||isSaving}
                size='small'
                onFocus={()=>setEditHPositionError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem value={"start"}>Start</MenuItem>
                <MenuItem value={"center"}>Center</MenuItem>
                <MenuItem value={"end"}>End</MenuItem>
              </TextField>
              {editHPositionError && <span className='form_error_floating'>Invalid H Position</span>}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasySlide {...{setOpenCrop: setOpenCrop, photoURL: editImage, selectSingleImage}}/>
      </Dialog>
      <ToastContainer />
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;