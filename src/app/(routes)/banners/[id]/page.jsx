'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, Dialog, FormControlLabel, IconButton, InputAdornment, MenuItem, Radio, TextField } from "@mui/material";
import { Add, CameraAlt, CropRotate, Delete, Folder, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CropEasyBanner from '@/components/crop/CropEasyBanner';

const View = ({params}) => {
  const router = useRouter();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");
  const [size, setSize] = useState("large");

  const [editId, setEditId] = useState("");
  const [editSize, setEditSize] = useState("large");
  const [editSizeError, setEditSizeError] = useState(false);
  const [editStatus, setEditStatus] = useState("active");
  const [editStatusError, setEditStatusError] = useState(false);
  const [editPosition, setEditPosition] = useState("center");
  const [editPositionError, setEditPositionError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);
  const [editHeading, setEditHeading] = useState("");
  const [editHeadingError, setEditHeadingError] = useState(false);
  const [editSubHeading, setEditSubHeading] = useState("");
  const [editSubHeadingError, setEditSubHeadingError] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editContentError, setEditContentError] = useState(false);
  const [editVPosition, setEditVPosition] = useState(0);
  const [editVPositionError, setEditVPositionError] = useState(false);
  const [editHPosition, setEditHPosition] = useState(0);
  const [editHPositionError, setEditHPositionError] = useState(false);
  const [editLink, setEditLink] = useState("");
  const [editLinkError, setEditLinkError] = useState(false);
  const [editBackgroundColor, setEditBackgroundColor] = useState("white");
  const [editBackgroundColorError, setEditBackgroundColorError] = useState(false);
  const [editBackgroundOpacity, setEditBackgroundOpacity] = useState("0.9");
  const [editBackgroundOpacityError, setEditBackgroundOpacityError] = useState(false);
  const [editHeadingColor, setEditHeadingColor] = useState("#666666");
  const [editHeadingColorError, setEditHeadingColorError] = useState(false);
  const [editSubHeadingColor, setEditSubHeadingColor] = useState("#666666");
  const [editSubHeadingColorError, setEditSubHeadingColorError] = useState(false);
  const [editLinkBackgroundColor, setEditLinkBackgroundColor] = useState("green");
  const [editLinkBackgroundColorError, setEditLinkBackgroundColorError] = useState(false);
  const [editLinkTextColor, setEditLinkTextColor] = useState("#ffffff");
  const [editLinkTextColorError, setEditLinkTextColorError] = useState(false);
  const [editContentColor, setEditContentColor] = useState("#666666");
  const [editContentColorError, setEditContentColorError] = useState(false);
  const [editShowCaption, setEditShowCaption] = useState("no");
  const [editShowCaptionError, setEditShowCaptionError] = useState(false);
  const [editLinkOnly, setEditLinkOnly] = useState("no");
  const [editLinkOnlyError, setEditLinkOnlyError] = useState(false);

  const [editImage, setEditImage] = useState("none");
  const [editImageError, setEditImageError] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [file, setFile] = useState(null);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Banner");
      setFormSubHeading("Create a new banner");
    }
    else{
      setFormHeading("Edit Banner");
      setFormSubHeading("Edit an existing banner");
      loadItem(params.id);
    }
  }, []);
  
  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/banners/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditSize(val.size);
      setEditStatus(val.status);
      setEditDescription(val.description);
      setEditHeading(val.heading);
      setEditSubHeading(val.sub_heading);
      setEditContent(val.content);
      setEditPosition(val.position);
      setEditVPosition(val.v_position);
      setEditHPosition(val.h_position);
      setEditLink(val.link);
      setEditBackgroundOpacity(val.background_opacity);
      setEditBackgroundColor(val.background_color);
      setEditHeadingColor(val.heading_color);
      setEditSubHeadingColor(val.sub_heading_color);
      setEditContentColor(val.content_color);
      setEditShowCaption(val.show_caption);
      setEditLinkOnly(val.link_only);
      setEditLinkBackgroundColor(val.link_background_color);
      setEditLinkTextColor(val.link_text_color);

      if(val.image_url==="none"){
        setEditImage("none");
      }
      else{
        setEditImage(" http://tm-web.effisoftsolutions.com/"+val.image_url);
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
    setFormHeading("Create Banner");
    setFormSubHeading("Create a new banner");
  }
  
  const clearErrors = () => {
    setEditSizeError(false);
    setEditStatusError(false);
    setEditPositionError(false);
    setEditDescriptionError(false);
    setEditHeadingError(false);
    setEditSubHeadingError(false);
    setEditContentError(false);
    setEditVPositionError(false);
    setEditHPositionError(false);
    setEditLinkError(false);
    setEditBackgroundOpacityError(false);
    setEditBackgroundColorError(false);
    setEditHeadingColorError(false);
    setEditSubHeadingColorError(false);
    setEditContentColorError(false);
    setEditImageError(false);
    setEditShowCaptionError(false);
    setEditLinkOnlyError(false);
    setEditLinkBackgroundColorError(false);
    setEditLinkTextColorError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId('');
    setEditSize("large");
    setEditStatus("active");
    setEditPosition('center');
    setEditDescription('');
    setEditHeading("");
    setEditSubHeading("");
    setEditContent("");
    setEditVPosition(0);
    setEditHPosition(0);
    setEditLink("");
    setEditShowCaption("no");
    setEditLinkOnly("no");
    setEditLinkBackgroundColor("green");
    setEditLinkTextColor("#ffffff");
    setEditBackgroundOpacity(0.9);
    setEditBackgroundColor("#ffffff");
    setEditHeadingColor("#666666");
    setEditSubHeadingColor("#666666");
    setEditContentColor("#666666");
    setEditImage('none');
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
      if (editLink.length>128) {
        error = true;
        setEditLinkError(true);
      }
      if (editLinkBackgroundColor.length===0 && editLinkBackgroundColor.length>16) {
        error = true;
        setEditLinkBackgroundColor(true);
      }
      if (editLinkTextColor.length===0 && editLinkTextColor.length>16) {
        error = true;
        setEditLinkTextColor(true);
      }
      if (editBackgroundColor.length===0 && editBackgroundColor.length>16) {
        error = true;
        setEditBackgroundColor(true);
      }
      if (editBackgroundOpacity.length===0 && editBackgroundOpacity.length>8) {
        error = true;
        setEditBackgroundOpacity(true);
      }
      if (editHeadingColor.length===0 && editHeadingColor.length>8) {
        error = true;
        setEditHeadingColor(true);
      }
      if (editSubHeadingColor.length===0 && editSubHeadingColor.length>8) {
        error = true;
        setEditSubHeadingColor(true);
      }
      if (editContentColor.length===0 && editContentColor.length>8) {
        error = true;
        setEditContentColor(true);
      }
      if(!error){
        var apiDes = "";
        if(editId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/banners/${apiDes}`, {
          id: parseInt(editId),
          status: editStatus,
          size: editSize,
          description: editDescription,
          heading: editHeading,
          sub_heading: editSubHeading,
          content: editContent,
          link: editLink,
          background_opacity: editBackgroundOpacity,
          background_color: editBackgroundColor,
          heading_color: editHeadingColor,
          sub_heading_color: editSubHeadingColor,
          content_color: editContentColor,
          show_caption: editShowCaption,
          link_only: editLinkOnly,
          link_background_color: editLinkBackgroundColor,
          link_text_color: editLinkTextColor,
          position: editPosition,
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
        const response = await axios.post("/api/banners/delete-image", {
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
        url: " http://tm-web.effisoftsolutions.com/banners/edit-image",
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
          setEditImage(" http://tm-web.effisoftsolutions.com/"+response.data.data);
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
            <IconButton onClick={()=>router.push('/banners')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#71717a"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
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
                  {size==="large"?
                    <div className='flex justify-center items-center w-[200px] xs:w-[300px] sm:w-[400px] h-[100px] xs:h-[150px] sm:h-[200px] relative'>
                      {editImage==="none" ? 
                        <CameraAlt sx={{width: 60, height: 60, color: '#cbd5e1'}}/> : 
                        <Image src={editImage} alt="banner image" fill sizes='(max-width: 640px) 400px, (max-width: 440px) 300px, 200px' priority={true} style={{objectFit: 'contain'}}/>
                      }
                    </div>:
                    <div className='flex justify-center items-center w-[200px] xs:w-[300px] sm:w-[400px] h-[50px] xs:h-[75px] sm:h-[100px] relative'>
                      {editImage==="none" ? 
                        <CameraAlt sx={{width: 60, height: 60, color: '#cbd5e1'}}/> : 
                        <Image src={editImage} alt="banner image" fill sizes='(max-width: 640px) 400px, (max-width: 440px) 300px, 200px' priority={true} style={{objectFit: 'contain'}}/>
                      }                      
                    </div>
                  }                  
                  <div className='inventory_image_controls mt-2'>
                    <input type='file' ref={imageRef} onChange={handleImageChange} className='file_input'/>
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
              <div className='form_text_field_constructed'>
                <span className='form_text_field_constructed_label'>Show Caption</span>
                <div className='w-full flex flex-row justify-end items-center'>
                  <FormControlLabel sx={{fontSize: 12}} value="yes" checked={editShowCaption==="yes"} onChange={(e)=>setEditShowCaption(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                  <FormControlLabel value="no" checked={editShowCaption==="no"} onChange={(e)=>setEditShowCaption(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                </div>
                {editShowCaptionError && <span className='form_error_floating'>Invalid Show Caption</span>}
              </div>
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='size'
                value={editSize}
                label="Size"
                onChange={event=>setEditSize(event.target.value)} 
                variant={"outlined"}
                select={true}
                disabled={isLoading||isSaving}
                size='small'
                onFocus={()=>setEditSizeError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem value={"large"}>Large</MenuItem>
                <MenuItem value={"small"}>Small</MenuItem>
              </TextField>
              {editSizeError && <span className='form_error_floating'>Invalid Size</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='position'
                value={editPosition}
                label="Position"
                onChange={event=>setEditPosition(event.target.value)} 
                variant={"outlined"}
                select={true}
                disabled={isLoading||isSaving}
                size='small'
                onFocus={()=>setEditPositionError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem value={"top_start"}>Top Start</MenuItem>
                <MenuItem value={"top_end"}>Top End</MenuItem>
                <MenuItem value={"bottom_start"}>Bottom Start</MenuItem>
                <MenuItem value={"bottom_end"}>Bottom End</MenuItem>
                <MenuItem value={"center"}>Center</MenuItem>
              </TextField>
              {editPositionError && <span className='form_error_floating'>Invalid Position</span>}
            </div>
            <div className='form_field_container'>              
              
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='v-position'
                type='number'
                value={editVPosition}
                label="V Position"
                onChange={event=>setEditVPosition(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditVPositionError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
                InputProps={{
                  endAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>%</span></InputAdornment>,
                }}
              />
              {editVPositionError && <span className='form_error_floating'>Invalid V Position</span>}
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='h-position'
                type='number'
                value={editHPosition}
                label="H Position"
                onChange={event=>setEditHPosition(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditHPositionError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
                InputProps={{
                  endAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>%</span></InputAdornment>,
                }}
              />
              {editHPositionError && <span className='form_error_floating'>Invalid H Position</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='background-color'
                value={editBackgroundColor}
                label="Background Color"
                onChange={event=>setEditBackgroundColor(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditBackgroundColorError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editBackgroundColorError && <span className='form_error_floating'>Invalid Background Color</span>}
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='background-opacity'
                type='number'
                value={editBackgroundOpacity}
                label="Background Opacity"
                onChange={event=>setEditBackgroundOpacity(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditBackgroundOpacityError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editBackgroundOpacityError && <span className='form_error_floating'>Invalid Background Opacity</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='heading-color'
                value={editHeadingColor}
                label="Heading Color"
                onChange={event=>setEditHeadingColor(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditHeadingColorError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editHeadingColorError && <span className='form_error_floating'>Invalid Heading Color</span>}
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='sub-heading-color'
                value={editSubHeadingColor}
                label="Sub Heading Color"
                onChange={event=>setEditSubHeadingColor(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditSubHeadingColorError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editSubHeadingColorError && <span className='form_error_floating'>Invalid Sub Heading Color</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='content-color'
                value={editContentColor}
                label="Content Color"
                onChange={event=>setEditContentColor(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditContentColorError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editContentColorError && <span className='form_error_floating'>Invalid Content Color</span>}
            </div>
            <div className='form_field_container'>
              <div className='form_text_field_constructed'>
                <span className='form_text_field_constructed_label'>Link Only</span>
                <div className='w-full flex flex-row justify-end items-center'>
                  <FormControlLabel sx={{fontSize: 12}} value="yes" checked={editLinkOnly==="yes"} onChange={(e)=>setEditLinkOnly(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                  <FormControlLabel value="no" checked={editLinkOnly==="no"} onChange={(e)=>setEditLinkOnly(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                </div>
                {editLinkOnlyError && <span className='form_error_floating'>Invalid Link Only</span>}
              </div>
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='link-background-color'
                value={editLinkBackgroundColor}
                label="Link Background Color"
                onChange={event=>setEditLinkBackgroundColor(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditLinkBackgroundColorError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editLinkBackgroundColorError && <span className='form_error_floating'>Invalid Link Background Color</span>}
            </div>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='link-text-color'
                value={editLinkTextColor}
                label="Link Text Color"
                onChange={event=>setEditLinkTextColor(event.target.value)} 
                variant={"outlined"}
                disabled={isLoading||isSaving}
                size='small'
                sx={{input: {textAlign: "right"}}}
                onFocus={()=>setEditLinkTextColorError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editLinkTextColorError && <span className='form_error_floating'>Invalid Link Text Color</span>}
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
                label="Sub Heading" 
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
          <div className='form_row_single'>
            <div className='form_field_container_full'>
              <TextField 
                id='link'
                label="Link" 
                variant="outlined" 
                className='form_text_field' 
                value={editLink} 
                error={editLinkError}
                onChange={event=>setEditLink(event.target.value)}
                disabled={isSaving||isLoading}
                size='small' 
                onFocus={()=>setEditLinkError(false)}
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editLinkError && <span className='form_error_floating'>Invalid Link</span>}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasyBanner {...{setOpenCrop: setOpenCrop, photoURL: editImage, selectSingleImage, imageSize: editSize}}/>
      </Dialog>
      <ToastContainer />
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;