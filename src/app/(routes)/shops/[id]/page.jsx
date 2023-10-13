'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, CircularProgress, Dialog, FormControlLabel, IconButton, MenuItem, Radio, Tab, Tabs, TextField } from "@mui/material";
import { Add, AddAPhoto, CameraAlt, Delete, Folder, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CropEasyMulti from '@/components/crop/CropEasyMulti';
import CropEasySingle from '@/components/crop/CropEasySingle';
import { Loader } from '@googlemaps/js-api-loader';

const View = ({params}) => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();
  const mapRef = useRef();

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const [editId, setEditId] = useState("");
  const [editStatus, setEditStatus] = useState('active');
  const [editStatusError, setEditStatusError] = useState(false);
  const [editBarcode, setEditBarcode] = useState("");
  const [editBarcodeError, setEditBarcodeError] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editCodeError, setEditCodeError] = useState(false);
  const [editHeading, setEditHeading] = useState("");
  const [editHeadingError, setEditHeadingError] = useState(false);
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editShortDescriptionError, setEditShortDescriptionError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editPhoneError, setEditPhoneError] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editAddressError, setEditAddressError] = useState(false);

  const [editLat, setEditLat] = useState(0.0);
  const [editLatError, setEditLatError] = useState(false);
  const [editLng, setEditLng] = useState(0.0);
  const [editLngError, setEditLngError] = useState(false);
  const [editFeatured, setEditFeatured] = useState("no");
  const [editFeaturedError, setEditFeaturedError] = useState(false);

  const [editImage, setEditImage] = useState("none");
  const [editImageError, setEditImageError] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [photoURL, setPhotoURL] = useState("none");

  const [editImages, setEditImages] = useState([]);
  const [editImagesError, setEditImagesError] = useState(false);
  const [editEditingImage, setEditEditingImage] = useState(-1);
  const [openOtherCrop, setOpenOtherCrop] = useState(false);
  const otherImageRef = useRef();
  const [otherPhotoURL, setOtherPhotoURL] = useState("none");

  useEffect(() => {
    if(status==='unauthenticated'){
      router.push("/signin");
    }
  }, [status]);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Shop");
      setFormSubHeading("Create a new shop");
    }
    else{
      setFormHeading("Edit Shop");
      setFormSubHeading("Edit an existing shop");
      loadItem(params.id);
    }
  }, []);

  useEffect(() => {
    (async ()=>{
      const loader = new Loader({
        apiKey: 'AIzaSyA5yhDnmG4Swv6iRHNxYWnm7C69GvX7ZHk',
        version: 'weekly'
      });

      const { Map } = await loader.importLibrary('maps');

      const position = {
        lat: 7.2918,
        lng: 80.6338,
      }

      const mapOptions = {
        center: position,
        zoom: 10,
        mapId: 'tmps-web-admin-map'
      }

      const map = new Map(mapRef.current, mapOptions);

    })();
  }, []);
  

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/shops/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditStatus(val.status);
      setEditBarcode(val.barcode);
      setEditCode(val.code);
      setEditHeading(val.heading);
      setEditShortDescription(val.short_description);
      setEditPhone(val.phone);
      setEditDescription(val.description);
      setEditAddress(val.address);

      setEditLat(val.lat);
      setEditLng(val.lng);
      setEditFeatured(val.featured);

      if(val.image_url==="none"){
        setEditImage("none");
      }
      else{
        setEditImage(" http://localhost:8000/"+val.image_url);
      }

      var val1 = val.shops_images;
      var val2 = [];
      val1.map(val3=>{
        val2.push({id: val3.id, shopsId: val.id, imageUrl: " http://localhost:8000/"+val3.image_url});
      });
      setEditImages(val2);

      setIsSaving(false);
    }
    catch(error){
      console.log(error);
      toast.error("Find Shop Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsLoading(false);
    }
  };

  const newItemClicked = () => {
    clearErrors();
    clearFields();
    setFormHeading("Create Shop");
    setFormSubHeading("Create a new shop");
    setTabIndex(0);
  };

  const clearErrors = () => {
    setEditStatusError(false);
    setEditBarcodeError(false);
    setEditCodeError(false);
    setEditHeadingError(false);
    setEditShortDescriptionError(false);
    setEditPhoneError(false);
    setEditDescriptionError(false);
    setEditAddressError(false);
    setEditLatError(false);
    setEditLngError(false);
    setEditFeaturedError(false);
    setEditImageError(false);
    setEditImagesError(false);
    setServerError(false);
  };

  const clearFields = () => {
    setEditId('');
    setEditStatus('active');
    setEditBarcode('');
    setEditCode('');
    setEditHeading('');
    setEditShortDescription('');
    setEditPhone('');
    setEditDescription('');
    setEditAddress('');
    setEditLat(0);
    setEditLng(0);
    //setEditFeatured("no");
    setEditFeatured("yes");
    setEditImage('none');
    setEditImages([]);
  };

  const saveClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
      if (editBarcode.length>32) {
        error = true;
        setEditBarcodeError(true);
      }
      if (editCode.length>32) {
        error = true;
        setEditCodeError(true);
      }
      if (editHeading.length===0 || editHeading.length>128) {
        error = true;
        setEditHeadingError(true);
      }      
      if (editShortDescription.length===0 || editShortDescription.length>256) {
        error = true;
        setEditShortDescriptionError(true);
      }
      if (editDescription.length>2048) {
        error = true;
        setEditDescriptionError(true);
      }
      if (editPhone.length>64) {
        error = true;
        setEditPhoneError(true);
      }
      if (editAddress.length>128) {
        error = true;
        setEditAddressError(true);
      }
      if(!error){
        var apiDes = "";
        if(editId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/shops/${apiDes}`, {
          id: parseInt(editId),
          status: editStatus,
          barcode: editBarcode,
          code: editCode,
          heading: editHeading,
          short_description: editShortDescription,
          phone: editPhone,
          description: editDescription,
          address: editAddress,
          lat: editLat,
          lng: editLng,
          featured: editFeatured,
        });
        if(editId===""){
          setEditId(response.data.data.id);
          toast.success("Shop Created !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else{
          toast.success("Shop Edited !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
    }
    catch(error){
      toast.error("Shop Create Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  };

  const handleImageRemove = (event) => {
    setPhotoURL("none");
    deleteImage();
  };

  const deleteImage = async () => {
    if(editId!==""){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/shops/delete-main-image", {
          id: parseInt(editId),
        });
        setEditImage("none");
      }
      catch(error){
        
      }
      finally{
        setIsSaving(false);
      }
    }
  };

  const handleImageChange = (event) => {
    const file1 = event.target.files[0];
    if(file1){
      setPhotoURL(URL.createObjectURL(file1));
      setOpenCrop(true);
    }
  };

  const selectSingleImage = (fileIn, url) => {
    if(editId!==""){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", ""+editId);
      formData.append('imageUrl', fileIn);
      axios({
        method: "post",
        url: " http://localhost:8000/shops/edit-main-image-web",
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
          setEditImage(" http://localhost:8000/"+response.data.data);
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
  };

  const handleOtherImageRemove = (event, id) => {
    deleteOtherImage(id);
  };

  const deleteOtherImage = async (id) => {
    if(editId!==""){
      setIsSaving(true);
      setEditEditingImage(id);
      try{
        const response = await axios.post("/api/shops/delete-other-image", {
          id: id,
        });
        if(response.data.data.response==="ok"){
          let filteredArray = editImages.filter(item => item.id !== response.data.data.id);
          setEditImages(filteredArray);
        }
        setEditEditingImage(-1);
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
  };

  const handleOtherImageChange = (event, id) => {
    const file1 = event.target.files[0];
    if(file1){
      setEditEditingImage(id);
      setOtherPhotoURL(URL.createObjectURL(file1));
      setOpenOtherCrop(true);
    }
  };

  const selectMultiImage = (fileIn, url) => {
    if(editId!==""){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("shopId", ""+editId);
      formData.append('imageUrl', fileIn);
      axios({
        method: "post",
        url: " http://localhost:8000/shops/edit-other-image-web",
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
          let val = [...editImages];
          val.push({id: response.data.data.data.id, shopsId: parseInt(editId), imageUrl: " http://localhost:8000/"+response.data.data.data.image_url});
          setEditImages(val);
          setOtherPhotoURL("none");
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
  };  

  return (
    <div className='form_container' style={{minHeight: (height-80)}}>
      <div className='form_container_medium' style={{minHeight: (height-80)}}>
        <div className='header_container'>
          <div className='header_container_left'>
            <IconButton onClick={()=>router.push('/shops')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#52525b"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
            <div className='header_container_left_text'>
              <span className="form_header">{formHeading}</span>
              <span className="form_sub_header">{formSubHeading}</span>
            </div>
          </div>
          <div className='header_container_right'>
            <Button 
              variant='outlined' 
              disabled={isSaving||isLoading} 
              style={{textTransform: 'none'}} 
              startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Add />}
              onClick={()=>newItemClicked()}
              size='small'
            >Create</Button>
            <Button 
              variant='contained' 
              disabled={isSaving||isLoading} 
              style={{textTransform: 'none'}} 
              startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Save />}
              onClick={()=>saveClicked()}
              size='small'
            >Save</Button>
          </div>
        </div>
        <Tabs value={tabIndex} onChange={handleTabChange} centered >
          <Tab label="Details" />
          <Tab label="Location" />
          <Tab label="Images" disabled={editId===""} />
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
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditCodeError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editCodeError && <span className='form_error_floating'>Invalid Code</span>}
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='barcode'
                  label="Barcode" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editBarcode} 
                  error={editBarcodeError}
                  onChange={event=>setEditBarcode(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditBarcodeError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editBarcodeError && <span className='form_error_floating'>Invalid Barcode</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='phone'
                  label="Phone" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editPhone} 
                  error={editPhoneError}
                  onChange={event=>setEditPhone(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditPhoneError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editPhoneError && <span className='form_error_floating'>Invalid Phone</span>}
              </div>
              <div className='form_field_container'>

              </div>
            </div>
            <div className='form_row_single'>
              <div className='form_field_container_full'>
                <TextField 
                  id='address'
                  label="Address" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editAddress} 
                  error={editAddressError}
                  onChange={event=>setEditAddress(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  multiline={true}
                  rows={4}
                  onFocus={()=>setEditAddressError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editAddressError && <span className='form_error_floating'>Invalid Address</span>}
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
                  id='short-description'
                  label="Short Description" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editShortDescription} 
                  error={editShortDescriptionError}
                  onChange={event=>setEditShortDescription(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditShortDescriptionError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editShortDescriptionError && <span className='form_error_floating'>Invalid Short Description</span>}
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
                  disabled={isSaving||isLoading}
                  size='small' 
                  multiline={true}
                  rows={8}
                  onFocus={()=>setEditDescriptionError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editDescriptionError && <span className='form_error_floating'>Invalid Description</span>}
              </div>
            </div>
          </div>
        }
        {tabIndex===1 &&
          <div className='form_fields_container_search mt-4'>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='lat'
                  type='number'
                  label="Latitude" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editLat} 
                  error={editLatError}
                  onChange={event=>setEditLat(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditLatError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}                  
                />
                {editLatError && <span className='form_error_floating'>Invalid Lat</span>}
              </div>
              <div className='form_field_container'>              
                <TextField 
                  id='lng'
                  type='number'
                  label="Longitude" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editLng} 
                  error={editLngError}
                  onChange={event=>setEditLng(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditLngError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editLngError && <span className='form_error_floating'>Invalid Lng</span>}
              </div>
            </div>
            <div className='flex w-[400px] h-[400px]' ref={mapRef}></div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Featured</span>
                  <div className='w-full flex flex-row justify-end items-center'>
                    <FormControlLabel disabled={isSaving||isLoading} sx={{fontSize: 12}} value="yes" checked={editFeatured==="yes"} onChange={(e)=>setEditFeatured(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                    <FormControlLabel disabled={isSaving||isLoading} value="no" checked={editFeatured==="no"} onChange={(e)=>setEditFeatured(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                  </div>
                  {editFeaturedError && <span className='form_error_floating'>Invalid Featured</span>}
                </div>
              </div>
              <div className='form_field_container'>
                
              </div>
            </div>
          </div>
        }
        {tabIndex===2 &&
          <>
            <div className='form_fields_container_search mt-4'>
              <div className='form_row_single_left'>
                <span className="form_internal_header">Main Image</span>
              </div>
              <div className='inventory_image_container'>
                <div className='flex justify-center items-center w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] relative'>
                  {editImage==="none" ? 
                    <CameraAlt sx={{width: 120, height: 120, color: '#cbd5e1'}}/> : 
                    <Image src={editImage} alt="product image" fill sizes='(max-width: 640px) 280px, 400px' priority={true} style={{objectFit: 'cover'}}/>
                  }
                  <input type='file' ref={imageRef} onChange={handleImageChange} className='file_input'/>
                </div>
                <div className='inventory_image_controls mt-2'>
                  <IconButton disabled={isSaving||isLoading} onClick={()=>imageRef.current.click()}><Folder sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                  <IconButton disabled={isSaving||isLoading} onClick={(event)=>handleImageRemove(event)}><Delete sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                </div>
              </div>
            </div>
            <div className='form_fields_container mt-3'>
              <div className='form_row_single_left'>
                <span className="form_internal_header">Other Images</span>
              </div>
              <div className='w-full flex flex-row justify-center items-start flex-wrap gap-2'>
                <input type='file' ref={otherImageRef} onChange={(event)=>handleOtherImageChange(event, -1)} className='file_input'/>
                <div className='flex justify-center items-center w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] relative bg-slate-100 border-slate-300 border rounded cursor-pointer' onClick={()=>otherImageRef.current.click()}>
                  <AddAPhoto sx={{width: 50, height: 50, color: '#cbd5e1'}}/>
                </div>
                {editImages.map(val=>
                  <div key={val.imageUrl} className='flex justify-center items-center w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] relative'>
                    <Image src={val.imageUrl} alt="product image" fill sizes='(max-width: 640px) 150px, 180px' priority={true} style={{objectFit: 'cover'}}/>
                    <IconButton sx={{position: 'absolute', top: 5, right: 5, backgroundColor: '#7c3aed', "&:hover, &.Mui-focusVisible": {backgroundColor: "#5b21b6"}, opacity: 0.5}} disabled={isSaving&&editEditingImage===val.id} onClick={(event)=>handleOtherImageRemove(event, val.id)}>
                      {isSaving && editEditingImage===val.id ? 
                        <CircularProgress size={16} style={{'color': '#9ca3af'}}/>:
                        <Delete style={{'color': '#ffffff', width: 16, height: 16}}/>
                      }
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          </>
        }
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasySingle {...{setOpenCrop: setOpenCrop, photoURL: photoURL, selectSingleImage}}/>
      </Dialog>
      <Dialog open={openOtherCrop} onClose={()=>setOpenOtherCrop(false)}>
        <CropEasyMulti {...{setOpenCrop: setOpenOtherCrop, photoURL: otherPhotoURL, selectMultiImage}}/>
      </Dialog>
      <ToastContainer />
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;