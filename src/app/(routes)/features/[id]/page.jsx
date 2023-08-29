'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, Dialog, FormControlLabel, IconButton, MenuItem, Radio, Tab, Tabs, TextField } from "@mui/material";
import { Add, CameraAlt, Close, CropRotate, Delete, Edit, Folder, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CropEasySmall from '@/components/crop/CropEasySmall';

const View = ({params}) => {
  const router = useRouter();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();
  const [editShowing, setEditShowing] = useState(false);

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [subFeatures, setSubFeatures] = useState([]);

  const [editId, setEditId] = useState("");
  const [editStatus, setEditStatus] = useState('active');
  const [editStatusError, setEditStatusError] = useState(false);
  const [editType, setEditType] = useState("single");
  const [editTypeError, setEditTypeError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);
  const [editShowOnFilters, setEditShowOnFilters] = useState("no");
  const [editShowOnFiltersError, setEditShowOnFiltersError] = useState(false);

  const [editSubFeatureId, setEditSubFeatureId] = useState("");
  const [editSubFeatureStatus, setEditSubFeatureStatus] = useState('active');
  const [editSubFeatureStatusError, setEditSubFeatureStatusError] = useState(false);
  const [editSubFeatureDescription, setEditSubFeatureDescription] = useState("");
  const [editSubFeatureDescriptionError, setEditSubFeatureDescriptionError] = useState(false);
  const [editSubFeatureShowOnFilters, setEditSubFeatureShowOnFilters] = useState("no");
  const [editSubFeatureShowOnFiltersError, setEditSubFeatureShowOnFiltersError] = useState(false);

  const [editImage, setEditImage] = useState("none");
  const [editImageError, setEditImageError] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [editSubFeatureImage, setEditSubFeatureImage] = useState("none");
  const [editSubFeatureImageError, setEditSubFeatureImageError] = useState(false);
  const [openCropSubFeature, setOpenCropSubFeature] = useState(false);  
  const imageRefSubFeature = useRef();
  const [fileSubFeature, setFileSubFeature] = useState(null);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Feature");
      setFormSubHeading("Create a new feature");
    }
    else{
      setFormHeading("Edit Feature");
      setFormSubHeading("Edit an existing feature");
      loadItem(params.id);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/features/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditStatus(val.status);
      setEditType(val.type);
      setEditDescription(val.description);
      setEditShowOnFilters(val.show_on_filters);

      if(val.image_url==="none"){
        setEditImage("none");
      }
      else{
        setEditImage("https://tm-web.techmax.lk/"+val.image_url);
      }

      var val2 = [];
      val.sub_features.map(val3=>{
        var img = "none";
        if(val3.image_url!=="none"){
          img = "https://tm-web.techmax.lk/"+val3.image_url;
        }
        val2.push({id: val3.id, feature_id: val.id, description: val3.description, status: val3.status, show_on_filters: val3.show_on_filters, image_url: img});
      });
      setSubFeatures(val2);
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
    setFormHeading("Create Feature");
    setFormSubHeading("Create a new feature");
  }
  
  const clearErrors = () => {
    setEditStatusError(false);
    setEditTypeError(false);
    setEditDescriptionError(false);
    setEditShowOnFiltersError(false);
    setEditImageError(false);
    setEditSubFeatureStatusError(false);
    setEditSubFeatureDescriptionError(false);
    setEditSubFeatureShowOnFiltersError(false);
    setEditSubFeatureImageError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId('');
    setEditStatus('active');
    setEditDescription('');
    setEditType("single");
    setEditShowOnFilters("no");
    setEditImage('none');
    setEditSubFeatureId('');
    setEditSubFeatureStatus('active');
    setEditSubFeatureDescription('');
    setEditSubFeatureShowOnFilters("no");
    setEditSubFeatureImage('none');
    setSubFeatures([]);
  };

  const saveClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
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
        const response = await axios.post(`/api/features/${apiDes}`, {
          id: parseInt(editId),
          status: editStatus,
          type: editType,
          description: editDescription,
          show_on_filters: editShowOnFilters,
        });
        if(editId===""){
          setEditId(response.data.data.id);
        }
      }
    }
    catch(error){
      toast.error("Feature Create Failed !", {
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
        const response = await axios.post("/api/features/delete-image", {
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
        url: "https://tm-web.techmax.lk/features/edit-image-web",
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

  const createSubFeatureClicked = async () => {
    setEditSubFeatureId('');
    setEditSubFeatureStatus('active');
    setEditSubFeatureDescription('');
    setEditSubFeatureShowOnFilters("no");
    setEditSubFeatureImage('none');
    setEditShowing(true);
  }

  const editSubFeatureClicked = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/sub-features/find", {
        id: id
      });
      let val = response.data.data;
      setEditSubFeatureId(val.id);
      setEditSubFeatureStatus(val.status);
      setEditSubFeatureDescription(val.description);
      setEditSubFeatureShowOnFilters(val.show_on_filters);

      if(val.image_url==="none"){
        setEditSubFeatureImage("none");
      }
      else{
        setEditSubFeatureImage("https://tm-web.techmax.lk/"+val.image_url);
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
    setEditShowing(true);
  }

  const closeSubFeatureClicked = async () => {
    setEditSubFeatureId('');
    setEditSubFeatureStatus('active');
    setEditSubFeatureDescription('');
    setEditSubFeatureShowOnFilters("no");
    setEditSubFeatureImage('none');
    setEditShowing(false);
  }

  const saveSubFeatureClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
      if (editSubFeatureDescription.length>128) {
        error = true;
        setEditSubFeatureDescriptionError(true);
      }
      if(!error){
        var apiDes = "";
        if(editSubFeatureId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/sub-features/${apiDes}`, {
          id: parseInt(editSubFeatureId),
          feature_id: parseInt(editId),
          status: editSubFeatureStatus,
          description: editSubFeatureDescription,
          show_on_filters: editSubFeatureShowOnFilters,
        });
        if(apiDes==="create"){
          setEditSubFeatureId(response.data.data.id);
          let val = [...subFeatures];
          val.push({id: response.data.data.id, feature_id: parseInt(editId), status: editSubFeatureStatus, description: editSubFeatureDescription, show_on_filters: editSubFeatureShowOnFilters, image_url: "none"});
          setSubFeatures(val);
        }
        else{
          const index = subFeatures.findIndex(val2 => val2.id === editSubFeatureId);
          if(index>-1){
            var val3 = [...subFeatures];
            val3[index] = {id: val3[index].id, feature_id: val3[index].feature_id, status: editSubFeatureStatus, description: editSubFeatureDescription, show_on_filters: editSubFeatureShowOnFilters, image_url: val3[index].image_url};
            setSubFeatures(val3);
          }
        }
      }
    }
    catch(error){
      toast.error("Sub Feature Create Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  }

  const handleSubFeatureImageRemove = (event) => {
    deleteSubFeatureImage();
  }

  const deleteSubFeatureImage = async () => {
    if(editSubFeatureId!==""){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/sub-features/delete-image", {
          id: editSubFeatureId,
        });
        setEditSubFeatureImage("none");
        const index = subFeatures.findIndex(val2 => val2.id === editSubFeatureId);
        if(index>-1){
          var val3 = [...subFeatures];
          val3[index] = {id: val3[index].id, feature_id: val3[index].feature_id, status: val3[index].status, description: val3[index].description, show_on_filters: val3[index].show_on_filters, image_url: "none"};
          setSubFeatures(val3);
        }
      }
      catch(error){
        toast.error("Sub Feature Image Delete Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const handleSubFeatureImageChange = (event, id) => {
    const file1 = event.target.files[0];
    if(file1){
      setFileSubFeature(file1);
      setEditSubFeatureImage(URL.createObjectURL(file1));
      setOpenCropSubFeature(true);
    }
  }

  const selectSubFeatureImage = (fileIn, url) => {
    if(editSubFeatureId!==""){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", ""+editSubFeatureId);
      formData.append('imageUrl', fileIn);
      axios({
        method: "post",
        url: "https://tm-web.techmax.lk/sub-features/edit-image-web",
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
          setEditSubFeatureImage("https://tm-web.techmax.lk/"+response.data.data);
          setFileSubFeature(null);
          const index = subFeatures.findIndex(val2 => val2.id === editSubFeatureId);
          if(index>-1){
            var val3 = [...subFeatures];
            val3[index] = {id: val3[index].id, feature_id: val3[index].feature_id, status: val3[index].status, description: val3[index].description, show_on_filters: val3[index].show_on_filters, image_url: "https://tm-web.techmax.lk/"+response.data.data};
            setSubFeatures(val3);
          }
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
            <IconButton onClick={()=>router.push('/features')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#71717a"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
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
        <Tabs value={tabIndex} onChange={handleTabChange} centered >
          <Tab label="Feature" />
          <Tab label="Sub Features" disabled={editId===""} />
        </Tabs>
        {tabIndex===0 &&
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
                <TextField className='form_text_field'
                  id='type'
                  value={editType}
                  label="Type"
                  onChange={event=>setEditType(event.target.value)} 
                  variant={"outlined"}
                  select={true}
                  disabled={isLoading||isSaving}
                  size='small'
                  onFocus={()=>setEditTypeError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                >
                  <MenuItem value={"single"}>Single</MenuItem>
                  <MenuItem value={"multiple"}>Multiple</MenuItem>
                </TextField>
                {editTypeError && <span className='form_error_floating'>Invalid Type</span>}
              </div>
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
          </div>
        }
        {tabIndex===1 && 
          <>
            {editShowing ? 
              <div className='form_fields_container_search mt-4 relative'>
                <div className='form_row_double'>              
                  <span className="form_internal_header">{editSubFeatureId===""?"Add Sub Feature":"Edit Sub Feature"}</span>
                  <div className='header_container_right'>
                    <Button 
                      variant='outlined' 
                      disabled={isLoading||isSaving} 
                      style={{textTransform: 'none'}} 
                      startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Add />}
                      onClick={()=>createSubFeatureClicked(true)}
                      size='small'
                    >New</Button>
                    <Button 
                      variant='contained' 
                      disabled={isLoading||isSaving} 
                      style={{textTransform: 'none'}} 
                      startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Save />}
                      onClick={()=>saveSubFeatureClicked()}
                      size='small'
                    >Save</Button>
                    <Button 
                      variant='outlined' 
                      disabled={isLoading||isSaving} 
                      style={{textTransform: 'none'}} 
                      startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Close />}
                      onClick={()=>closeSubFeatureClicked()}
                      size='small'
                    >Close</Button>
                  </div>
                </div>
                <div className='form_row_double'>
                  <div className='form_field_container'>
                    <TextField 
                      id='sub-feature-id'
                      label="ID" 
                      variant="outlined" 
                      className='form_text_field' 
                      value={editSubFeatureId} 
                      disabled={true}
                      size='small' 
                      inputProps={{style: {fontSize: 13}}}
                      SelectProps={{style: {fontSize: 13}}}
                      InputLabelProps={{style: {fontSize: 15}}}
                    />
                  </div>
                  <div className='form_field_container'>
                    <TextField className='form_text_field'
                      id='sub-feature-status'
                      value={editSubFeatureStatus}
                      label="Status"
                      onChange={event=>setEditSubFeatureStatus(event.target.value)} 
                      variant={"outlined"}
                      select={true}
                      disabled={isLoading||isSaving}
                      size='small'
                      onFocus={()=>setEditSubFeatureStatusError(false)}
                      inputProps={{style: {fontSize: 13}}}
                      SelectProps={{style: {fontSize: 13}}}
                      InputLabelProps={{style: {fontSize: 15}}}
                    >
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"inactive"}>Inactive</MenuItem>
                    </TextField>
                    {editSubFeatureStatusError && <span className='form_error_floating'>Invalid Status</span>}
                  </div>
                </div>
                <div className='form_row_double'>
                  <div className='form_field_container'>
                    <div className='form_text_field_constructed'>
                      <span className='form_text_field_constructed_label'>Show On Filters</span>
                      <div className='w-full flex flex-row justify-end items-center'>
                        <FormControlLabel sx={{fontSize: 12}} value="yes" checked={editSubFeatureShowOnFilters==="yes"} onChange={(e)=>setEditSubFeatureShowOnFilters(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                        <FormControlLabel value="no" checked={editSubFeatureShowOnFilters==="no"} onChange={(e)=>setEditSubFeatureShowOnFilters(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                      </div>
                      {editSubFeatureShowOnFiltersError && <span className='form_error_floating'>Invalid Show On Filters</span>}
                    </div>
                  </div>
                  <div className='form_field_container'></div>
                </div>
                <div className='form_row_single'>
                  <div className='form_field_container_full'>
                    <TextField 
                      id='sub-feature-description'
                      label="Description" 
                      variant="outlined" 
                      className='form_text_field' 
                      value={editSubFeatureDescription} 
                      error={editSubFeatureDescriptionError}
                      onChange={event=>setEditSubFeatureDescription(event.target.value)}
                      disabled={isLoading||isSaving}
                      size='small' 
                      onFocus={()=>setEditSubFeatureDescriptionError(false)}
                      inputProps={{style: {fontSize: 13}}}
                      SelectProps={{style: {fontSize: 13}}}
                      InputLabelProps={{style: {fontSize: 15}}}
                    />
                    {editSubFeatureDescriptionError && <span className='form_error_floating'>Invalid Description</span>}
                  </div>
                </div>
                {editSubFeatureId!=="" &&
                  <>
                    <div className='form_row_single_left'>
                      <span className="form_internal_header">Image</span>
                    </div>
                    <div className='form_row_single'>
                      <div className='inventory_image_container'>
                        <div className='flex justify-center items-center w-[120px] sm:w-[140px] h-[120px] sm:h-[140px] relative'>
                          {editSubFeatureImage==="none" ? 
                            <CameraAlt sx={{width: 80, height: 80, color: '#cbd5e1'}}/> : 
                            <Image src={editSubFeatureImage} alt="brand image" fill sizes='(max-width: 640px) 120px, 140px' priority={true} style={{objectFit: 'cover'}}/>
                          }
                          <input type='file' ref={imageRefSubFeature} onChange={handleSubFeatureImageChange} className='file_input'/>
                        </div>
                        <div className='inventory_image_controls mt-2'>
                          <IconButton disabled={isLoading||isSaving} onClick={()=>imageRefSubFeature.current.click()}><Folder sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                          {fileSubFeature && <IconButton disabled={isLoading||isSaving} onClick={()=>setOpenCropSubFeature(true)}><CropRotate sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>}
                          <IconButton disabled={isLoading||isSaving} onClick={(event)=>handleSubFeatureImageRemove(event)}><Delete sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                        </div>
                      </div>
                    </div>
                  </>
                }
              </div>
            :
              <div className='form_fields_container_search mt-4 relative'>
                <div className='form_row_double'>              
                  <span className="form_internal_header">Add / Edit Sub Features</span>
                  <Button 
                    variant='contained' 
                    disabled={isLoading||isSaving} 
                    style={{textTransform: 'none'}} 
                    startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Add />}
                    onClick={()=>createSubFeatureClicked(true)}
                    size='small'
                  >Add</Button>
                </div>
                <div className='table_container'>
                  <div className='table_header_container'>
                    <div className='table_header_col flex-1'>Details</div>
                    <div className='table_header_col_2 w-[80px]'>Actions</div>
                  </div>
                  <div className='table_body_container'>
                    {subFeatures.map(val=>
                      <div key={val.id} className='table_row'>
                        <div className='table_col_1_center_center h-[80px] w-[80px]'>
                          {val.image_url==="none" ? 
                            <CameraAlt sx={{width: 40, height: 40, color: '#cbd5e1'}}/> : 
                            <div className='table_col_1_image'><Image src={val.image_url} alt="brand image" fill sizes='80px' priority={true} style={{objectFit: 'contain'}}/></div>
                          }
                        </div>
                        <div className='table_col_start_center sm:h-[80px]'>
                          <div className='table_field_double'>
                            <div className='table_field'>
                              <span className='table_field_label'>ID:</span>
                              <span className='table_field_text_center'>{val.id}</span>
                            </div>
                            <div className='table_field'></div>
                          </div>
                          <div className='table_field_single'>
                            <div className='table_field_full'>
                              <span className='table_field_label'>Description:</span>
                              <span className='table_field_text_full h-[30px]'>{val.description}</span>
                            </div>
                          </div>
                          <div className='table_field_double sm:form_field_single'>
                            <div className='table_field_full'></div>
                            <div className='flex sm:hidden'>
                              <Button 
                                variant='outlined' 
                                style={{textTransform: 'none'}} 
                                startIcon={<Edit />}
                                onClick={()=>editSubFeatureClicked(val.id)}
                                size='small'
                              >Edit</Button>
                            </div>
                          </div>
                        </div>
                        <div className='table_col_2_end_end w-[80px] h-[80px]'>
                          <Button 
                            variant='outlined' 
                            style={{textTransform: 'none'}} 
                            startIcon={<Edit />}
                            onClick={()=>editSubFeatureClicked(val.id)}
                            size='small'
                          >Edit</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            }
          </>          
        }        
        <ToastContainer />
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasySmall {...{setOpenCrop: setOpenCrop, photoURL: editImage, selectSingleImage}}/>
      </Dialog>
      <Dialog open={openCropSubFeature} onClose={()=>setOpenCropSubFeature(false)}>
        <CropEasySmall {...{setOpenCrop: setOpenCropSubFeature, photoURL: editSubFeatureImage, selectSingleImage: selectSubFeatureImage}}/>
      </Dialog>
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;