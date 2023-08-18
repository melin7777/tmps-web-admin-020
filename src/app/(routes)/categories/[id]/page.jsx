'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, Dialog, FormControlLabel, IconButton, MenuItem, Radio, TextField } from "@mui/material";
import { Add, CameraAlt, CropRotate, Delete, Folder, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CropEasySmall from '@/components/crop/CropEasySmall';

const View = ({params}) => {
  const router = useRouter();
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
  const [editFeatured, setEditFeatured] = useState("no");
  const [editFeaturedError, setEditFeaturedError] = useState(false);
  const [editShowOnFilters, setEditShowOnFilters] = useState("no");
  const [editShowOnFiltersError, setEditShowOnFiltersError] = useState(false);

  const [editImage, setEditImage] = useState("none");
  const [editImageError, setEditImageError] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [file, setFile] = useState(null);

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
      setEditStatus(val.status);
      setEditCode(val.code);
      setEditDescription(val.description);
      setEditFeatured(val.featured);
      setEditShowOnFilters(val.show_on_filters);

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
    setFormHeading("Create Category");
    setFormSubHeading("Create a new category");
  }
  
  const clearErrors = () => {
    setEditStatusError(false);
    setEditCodeError(false);
    setEditDescriptionError(false);
    setEditFeaturedError(false);
    setEditShowOnFiltersError(false);
    setEditImageError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId('');
    setEditStatus('active');
    setEditCode('');
    setEditDescription('');
    setEditFeatured("no");
    setEditShowOnFilters("no");
    setEditImage('none');
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
          status: editStatus,
          code: editCode,
          description: editDescription,
          featured: editFeatured,
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

  const handleImageRemove = (event) => {
    setEditImage("none");
    setFile(null);
    deleteImage();
  }

  const deleteImage = async () => {
    if(editId!==""){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/categories/delete-image", {
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
        url: "https://tm-web.techmax.lk/part-categories/edit-image",
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
          {editId!=="" &&
            <>
              <div className='form_row_single_left'>
                <span className="form_internal_header">Image</span>
              </div>
              <div className='form_row_single'>
                <div className='inventory_image_container'>
                  <div className='flex justify-center items-center w-[120px] sm:w-[140px] h-[120px] sm:h-[140px] relative'>
                    {editImage==="none" ? 
                      <CameraAlt sx={{width: 80, height: 80, color: '#cbd5e1'}}/> : 
                      <Image src={editImage} alt="brand image" fill sizes='(max-width: 640px) 120px, 140px' priority={true} style={{objectFit: 'cover'}}/>
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
                <span className='form_text_field_constructed_label'>Featured</span>
                <div className='w-full flex flex-row justify-end items-center'>
                  <FormControlLabel sx={{fontSize: 12}} value="yes" checked={editFeatured==="yes"} onChange={(e)=>setEditFeatured(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                  <FormControlLabel value="no" checked={editFeatured==="no"} onChange={(e)=>setEditFeatured(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                </div>
                {editFeaturedError && <span className='form_error_floating'>Invalid Featured</span>}
              </div>
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
        <ToastContainer />
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasySmall {...{setOpenCrop: setOpenCrop, photoURL: editImage, selectSingleImage}}/>
      </Dialog>
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;