'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Avatar, Button, CircularProgress, Dialog, IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import { Add, CameraAlt, Close, CropRotate, Delete, Folder, Key, KeyboardArrowLeft, MailOutline, Phone, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CropEasy from '@/components/crop/CropEasy';

const View = ({params}) => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");

  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [editId, setEditId] = useState("");
  const [editStatus, setEditStatus] = useState('active');
  const [editStatusError, setEditStatusError] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editFirstNameError, setEditFirstNameError] = useState(false);
  const [editLastName, setEditLastName] = useState("");
  const [editLastNameError, setEditLastNameError] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editPhoneError, setEditPhoneError] = useState(false);
  const [editDuplicatePhoneError, setEditDuplicatePhoneError] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editEmailError, setEditEmailError] = useState(false);
  const [editDuplicateEmailError, setEditDuplicateEmailError] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editAddressError, setEditAddressError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);
  const [editRegNumber, setEditRegNumber] = useState("");
  const [editRegNumberError, setEditRegNumberError] = useState(false);
  const [editWebAddress, setEditWebAddress] = useState("");
  const [editWebAddressError, setEditWebAddressError] = useState(false);
  const [editNotifyBy, setEditNotifyBy] = useState("email");
  const [editNotifyByError, setEditNotifyByError] = useState(false);

  const [editPassword, setEditPassword] = useState("");
  const [editPasswordError, setEditPasswordError] = useState(false);
  const [editConfirm, setEditConfirm] = useState("");
  const [editConfirmError, setEditConfirmError] = useState(false);

  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [photoURL, setPhotoURL] = useState("none");
  const [file, setFile] = useState(null);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Seller");
      setFormSubHeading("Create a new seller");
    }
    else{
      setFormHeading("Edit Seller");
      setFormSubHeading("Edit an existing seller");
      loadItem(params.id);
    }
  }, []);
  
  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/sellers/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditFirstName(val.first_name);
      setEditLastName(val.last_name);
      setEditEmail(val.email);
      setEditPhone(val.phone);
      setEditNotifyBy(val.notify_by);
      setEditAddress(val.address);
      setEditDescription(val.description);
      setEditRegNumber(val.reg_number);
      setEditWebAddress(val.web_address);
      var status = "";
      if(val.status==="active"){
        status = "Active";
      }
      else if(val.status==="inactive"){
        status = "Inactive";
      }
      setEditStatus(val.status);
      if(val.image_url==="none"){
        setPhotoURL("none");
      }
      else{
        setPhotoURL(" http://localhost:8000/"+val.image_url);
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
    setFormHeading("Create Seller");
    setFormSubHeading("Create a new seller");
  }
  
  const clearErrors = () => {
    setEditStatusError(false);
    setEditFirstNameError(false);
    setEditLastNameError(false);
    setEditPhoneError(false);
    setEditEmailError(false);
    setEditPasswordError(false);
    setEditConfirmError(false);
    setEditDuplicateEmailError(false);
    setEditDuplicatePhoneError(false);
    setEditNotifyByError(false);
    setEditAddressError(false);
    setEditDescriptionError(false);
    setEditWebAddressError(false);
    setEditRegNumberError(false);
    setServerError(false);
  };
  
  const clearFields = () => {
    setEditId("");
    setEditStatus('active');
    setEditFirstName("");
    setEditLastName("");
    setEditPhone("");
    setEditEmail("");
    setEditPassword("");
    setEditConfirm("");
    setEditNotifyBy("email");
    setEditAddress("");
    setEditDescription("");
    setEditWebAddress("");
    setEditRegNumber("");
    setPhotoURL("none");
  };

  const saveClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
      if(editFirstName.length===0 || editFirstName.length>32) {
        error = true;
        setEditFirstNameError(true);
      }
      if(editLastName.length===0 || editLastName.length>128) {
        error = true;
        setEditLastNameError(true);
      }
      if(editAddress.length===0 || editAddress.length>256) {
        error = true;
        setEditAddressError(true);
      }
      if(editDescription.length===0 || editDescription.length>2048) {
        error = true;
        setEditDescriptionError(true);
      }
      if(editWebAddress.length>128) {
        error = true;
        setEditWebAddressError(true);
      }
      if(editRegNumber.length>64) {
        error = true;
        setEditRegNumberError(true);
      }
      if(editId===""){
        if(editEmail.length===0 || editEmail.length>128) {
          error = true;
          setEditEmailError(true);
        }
        if(editPhone.length===0 || editPhone.length>128) {
          error = true;
          setEditPhoneError(true);
        }
        if(editPassword.length===0 || editPassword.length>12) {
          error = true;
          setEditPasswordError(true);
        }
        if(editConfirm.length===0 || editConfirm.length>12) {
          error = true;
          setEditConfirmError(true);
        }
        if(editPassword!==editConfirm){
          error = true;
          setEditConfirmError(true);
        }
      }
      if(!error){
        var apiDes = "";
        var data1 = {};
        if(editId===""){          
          apiDes = "create";
          data1 = {
            firstName: editFirstName,
            lastName: editLastName,
            phone: editPhone,
            email: editEmail,
            notifyBy: editNotifyBy,
            password: editPassword,
            address: editAddress,
            description: editDescription,
            webAddress: editWebAddress,
            regNumber: editRegNumber,
            status: editStatus,
          };
        }
        else{
          apiDes = "edit";
          data1 = {
            id: parseInt(editId),
            firstName: editFirstName,
            lastName: editLastName,
            address: editAddress,
            description: editDescription,
            webAddress: editWebAddress,
            regNumber: editRegNumber,
            status: editStatus,
          };
        }
        const response = await axios.post(`/api/sellers/${apiDes}`, data1);
        if(response.data.status==="duplicate_email"){
          setEditDuplicateEmailError(true);
        }
        else if(response.data.status==="duplicate_phone"){
          setEditDuplicatePhoneError(true);
        }
        else{
          if(editId===""){
            setEditId(response.data.data.id);
            saveImage(response.data.data.id);
          }
          else{
            saveImage(editId);
          }
        }
      }
    }
    catch(error){
      toast.error("Seller Create Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  }

  const handleImageRemove = (event) => {
    setPhotoURL("none");
    setFile(null);
    deleteImage();
  }

  const deleteImage = async () => {
    if(editId!==""){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/sellers/delete-image", {
          id: parseInt(editId),
        });
        setPhotoURL("none");
        toast.success("Image Deleted !", {
          position: toast.POSITION.TOP_RIGHT
        });
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
      setPhotoURL(URL.createObjectURL(file1));
      setOpenCrop(true);
    }
  }

  const saveImage = (id) => {
    if(file && id>0){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", ""+id);
      formData.append('imageUrl', file);
      axios({
        method: "post",
        url: " http://localhost:8000/online-users/edit-image-web",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        if (response.data.error) {
          setServerError(true);
          setIsSaving(false);
        } 
        else {
          setPhotoURL(" http://localhost:8000/"+response.data.data.image_url);
          setFile(null);
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
  }

  const savePasswordClicked = async () => {
    clearErrors();
    setIsSaving(true);
    var error = false;
    if(editPassword.length===0 || editPassword.length>12) {
      error = true;
      setEditPasswordError(true);
    }
    if(editConfirm.length===0 || editConfirm.length>12) {
      error = true;
      setEditConfirmError(true);
    }
    if(editPassword!==editConfirm){
      error = true;
      setEditConfirmError(true);
    }
    if(error) {
      setIsSaving(false);
    }
    else{
      try{
        const response = await axios.post("/api/sellers/save-password", {
          id: editId,
          password: editPassword,
        });
        setEditPassword("");
        setEditConfirm("");
        setIsPasswordShowing(false);
        toast.success("Password Change Successfull !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      catch(error){
        toast.error("Password Change Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  return (
    <div className='form_container' style={{minHeight: (height-80)}}>
      <div className='form_container_medium' style={{minHeight: (height-80)}}>
        <div className='header_container'>
          <div className='header_container_left'>
            <IconButton onClick={()=>router.push('/sellers')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#71717a"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
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
          <div className='form_row_single_left'>
            <span className="form_internal_header">Image</span>
          </div>
          <div className='form_row_single'>
            <div className='inventory_image_container'>
              <div className='flex justify-center items-center w-[140px] h-[140px] relative'>
                {photoURL==="none" ? 
                  <CameraAlt sx={{width: 80, height: 80, color: '#cbd5e1'}}/> : 
                  <Avatar src={photoURL} sx={{width: 140, height: 140, cursor: 'pointer'}}/>
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
                onFocus={()=>setEditStatusError(false)}
                size='small'
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
                id='first-name'
                label="First Name" 
                variant="outlined" 
                className='form_text_field' 
                value={editFirstName} 
                error={editFirstNameError}
                onChange={event=>setEditFirstName(event.target.value)}
                disabled={isLoading||isSaving}
                onFocus={()=>setEditFirstNameError(false)}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editFirstNameError && <span className='form_error_floating'>Invalid First Name</span>}
            </div>
            <div className='form_field_container'>
              <TextField 
                id='last-name'
                label="Last Name" 
                variant="outlined" 
                className='form_text_field' 
                value={editLastName} 
                error={editLastNameError}
                onChange={event=>setEditLastName(event.target.value)}
                disabled={isLoading||isSaving}
                onFocus={()=>setEditLastNameError(false)}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editLastNameError && <span className='form_error_floating'>Invalid Last Name</span>}
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField 
                id='email'
                label="Email" 
                variant="outlined" 
                className='form_text_field' 
                value={editEmail} 
                error={editEmailError||editDuplicateEmailError}
                onChange={event=>setEditEmail(event.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MailOutline sx={{width: 26, height: 26, color: editEmailError||editDuplicateEmailError?'crimson':'#94a3b8'}}/></InputAdornment>,
                }}
                disabled={isLoading||isSaving||editId!==""}
                onFocus={()=>{setEditEmailError(false); setEditDuplicateEmailError(false);}}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editEmailError && <span className='form_error_floating'>Invalid Email</span>}
              {editDuplicateEmailError && <span className='form_error_floating'>Email Already Exists !</span>}
            </div>
            <div className='form_field_container'>
              <TextField 
                id='phone'
                label="Phone" 
                variant="outlined" 
                className='form_text_field' 
                value={editPhone} 
                error={editPhoneError||editDuplicatePhoneError}
                onChange={event=>setEditPhone(event.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Phone sx={{width: 26, height: 26, color: editPhoneError?'crimson':'#94a3b8'}}/></InputAdornment>,
                }}
                disabled={isLoading||isSaving||editId!==""}
                onFocus={()=>{setEditPhoneError(false); setEditDuplicatePhoneError(false)}}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editPhoneError && <span className='form_error_floating'>Invalid Phone</span>}
              {editDuplicatePhoneError && <span className='form_error_floating'>Phone Already Exists !</span>}
            </div>
          </div>
          <div className='form_row_double_top'>
            <div className='form_field_container_vertical'>
              <TextField 
                id='description'
                label="Description" 
                variant="outlined" 
                className='form_text_field' 
                value={editDescription} 
                error={editDescriptionError}
                onChange={event=>setEditDescription(event.target.value)}
                disabled={isLoading||isSaving}
                multiline={true}
                rows={4}
                onFocus={()=>setEditDescriptionError(false)}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editDescriptionError && <span className='form_error_floating'>Invalid Description</span>}
            </div>
            <div className='form_field_container_vertical'>
              <TextField 
                id='address'
                label="Address" 
                variant="outlined" 
                className='form_text_field' 
                value={editAddress} 
                error={editAddressError}
                onChange={event=>setEditAddress(event.target.value)}
                disabled={isLoading||isSaving}
                multiline={true}
                rows={4}
                onFocus={()=>setEditAddressError(false)}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              />
              {editAddressError && <span className='form_error_floating'>Invalid Address</span>}
            </div>
          </div>
          <div className='form_row_double_top'>              
            <div className='form_field_container_vertical'>
              <div className='form_field_container'>
                <TextField 
                  id='web-address'
                  label="Web Address" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editWebAddress} 
                  error={editWebAddressError}
                  onChange={event=>setEditWebAddress(event.target.value)}
                  disabled={isLoading||isSaving}
                  onFocus={()=>setEditWebAddressError(false)}
                  size='small'
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editWebAddressError && <span className='form_error_floating'>Invalid Web Address</span>}
              </div>
            </div>
            <div className='form_field_container_vertical'>
              <div className='form_field_container'>
                <TextField 
                  id='reg-number'
                  label="Reg Number" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editRegNumber} 
                  error={editRegNumberError}
                  onChange={event=>setEditRegNumber(event.target.value)}
                  disabled={isLoading||isSaving}
                  onFocus={()=>setEditRegNumberError(false)}
                  size='small'
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editRegNumberError && <span className='form_error_floating'>Invalid Reg Number</span>}
              </div>
            </div>
          </div>
          <div className='form_row_double'>
            <div className='form_field_container'>
              <TextField className='form_text_field'
                id='notify-by'
                value={editNotifyBy}
                error={editNotifyByError}
                label="Notify By"
                onChange={event=>setEditNotifyBy(event.target.value)}                
                variant={"outlined"}
                select={true}
                disabled={isLoading||isSaving}
                onFocus={()=>setEditNotifyByError(false)}
                size='small'
                inputProps={{style: {fontSize: 13}}}
                SelectProps={{style: {fontSize: 13}}}
                InputLabelProps={{style: {fontSize: 15}}}
              >
                <MenuItem value={"email"}>Email</MenuItem>
                <MenuItem value={"sms"}>SMS</MenuItem>
              </TextField>
              {editNotifyByError && <span className='form_error_floating'>Invalid Notify By</span>}
            </div>
            <div className='form_field_container'></div>
          </div>
          {editId=="" &&
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='password'
                  type={"password"} 
                  label="Password" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editPassword}
                  error={editPasswordError}
                  onChange={event=>setEditPassword(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editPasswordError?'crimson':'#94a3b8'}}/></InputAdornment>
                  }}
                  disabled={isLoading||isSaving}
                  onFocus={()=>setEditPasswordError(false)}
                  size='small'
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editPasswordError && <span className='form_error_floating'>Invalid Password</span>}
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='confirm'
                  type={"password"} 
                  label="Confirm Password" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editConfirm}
                  error={editConfirmError}
                  onChange={event=>setEditConfirm(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editConfirmError?'crimson':'#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={isLoading||isSaving}
                  onFocus={()=>setEditConfirmError(false)}
                  size='small'
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editConfirmError && <span className='form_error_floating'>Invalid Confirmation</span>}
              </div>
            </div>
          }
          {isPasswordShowing && editId!=="" &&
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='password'
                  type={"password"} 
                  label="Password" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editPassword}
                  error={editPasswordError}
                  onChange={event=>setEditPassword(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editPasswordError?'crimson':'#94a3b8'}}/></InputAdornment>
                  }}
                  disabled={isLoading||isSaving}
                  onFocus={()=>setEditPasswordError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editPasswordError && <span className='form_error_floating'>Invalid Password</span>}
              </div>
              <div className='form_field_container'>
                <TextField 
                  id='confirm'
                  type={"password"} 
                  label="Confirm Password" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editConfirm}
                  error={editConfirmError}
                  onChange={event=>setEditConfirm(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Key sx={{width: 26, height: 26, color: editConfirmError?'crimson':'#94a3b8'}}/></InputAdornment>,
                  }}
                  disabled={isLoading||isSaving}
                  onFocus={()=>setEditConfirmError(false)}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editConfirmError && <span className='form_error_floating'>Invalid Confirmation</span>}
              </div>
            </div>
          }
          {editId!=="" &&
            <div className='form_row_double'>
              <span></span>
              <div className='form_field_container gap-2'>
                {isPasswordShowing ?
                  <>
                    <Button 
                      variant='outlined' 
                      disabled={isLoading||isSaving} 
                      style={{textTransform: 'none'}} 
                      startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Close />}
                      onClick={()=>setIsPasswordShowing(false)}
                      size='small'
                    >Cancel</Button>
                    <Button 
                      variant='contained' 
                      disabled={isLoading||isSaving} 
                      style={{textTransform: 'none'}} 
                      startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Save />}
                      onClick={()=>savePasswordClicked()}
                      size='small'
                    >Save</Button>
                  </>
                :
                  <Button 
                    variant='contained' 
                    disabled={isLoading||isSaving} 
                    style={{textTransform: 'none'}} 
                    startIcon={isLoading||isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Key />}
                    onClick={()=>setIsPasswordShowing(true)}
                    size='small'
                  >Change Password</Button>
                }
              </div>
            </div>
          }
        </div>
      </div>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasy {...{setOpenCrop, photoURL, setPhotoURL, setFile}}/>
      </Dialog>
      <ToastContainer />
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;